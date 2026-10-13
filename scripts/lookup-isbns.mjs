// Finds an ISBN-13 for each book on the book club page so "Buy at Bookshop.org" can link
// straight to the book with our affiliate ID (Bookshop's documented format: /a/<id>/<isbn>).
// Runs in GitHub Actions after update-books.mjs. Same safety pattern as the other updaters:
//  - Read-only public API (Google Books), no key, no personal data sent: only title + author last name.
//  - Output is digits only (validated ISBN-13). Anything odd is skipped, and the page falls back to a search link.
//  - Keeps earlier results; only looks up books it hasn't found yet. Polite pacing.
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = new URL('../book-club-picker/isbns.js', import.meta.url);
const SOURCES = ['../book-club-picker/books.js', '../book-club-picker/current-books.js'];
const API = 'https://www.googleapis.com/books/v1/volumes';
const MAX_LOOKUPS = 250;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Must match the key in assets/links.js (bookKey) ---
const cleanText = (s) => String(s || '').replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, ' ').replace(/[&,;!?…]/g, ' ').replace(/\s+/g, ' ').trim();
const cleanTitle = (t) => cleanText(String(t || '').replace(/\s*[(\[].*?[)\]]\s*/g, ' ').split(/:\s/)[0]);
const firstAuthor = (a) => cleanText(String(a || '').split(/\s+(?:&|and|ft\.?|feat\.?|featuring|with)\s+|,\s*/i)[0]);
const lastName = (a) => { const w = firstAuthor(a).split(' ').filter((x) => !/^(jr\.?|sr\.?|ii|iii|iv)$/i.test(x)); return w.length ? w[w.length - 1] : ''; };
const bookKey = (t, a) => `${cleanTitle(t)}|${lastName(a)}`.toLowerCase();
// ---

const norm = (s) => cleanText(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const SKIP = /summary|study guide|workbook|analysis|sparknotes|cliffsnotes|coloring|journal|companion|collection|box ?set|boxed/i;

function loadBooks() {
  const books = [];
  for (const rel of SOURCES) {
    try {
      const txt = readFileSync(new URL(rel, import.meta.url), 'utf8');
      let list = [];
      const cur = txt.match(/window\.CURRENT_BOOKS\s*=\s*(\{[\s\S]*\});/);
      if (cur) list = JSON.parse(cur[1]).books || [];          // generated file: parse as data, never run it
      else { const window = {}; new Function('window', txt)(window); list = window.BOOK_CLUB_BOOKS || []; } // our hand-written list
      list.forEach((b) => { if (Array.isArray(b) && b[0] && b[1]) books.push([String(b[0]), String(b[1])]); });
    } catch (e) { console.log(`Could not read ${rel}: ${e.message}`); }
  }
  return books;
}

function loadExisting() {
  try {
    const txt = readFileSync(OUT, 'utf8');
    const m = txt.match(/window\.BOOK_ISBNS\s*=\s*(\{[\s\S]*?\});/);
    const x = txt.match(/window\.BOOK_ISBN_MISSES\s*=\s*(\{[\s\S]*?\});/);
    const ok = m ? JSON.parse(m[1]) : {};
    return {
      isbns: Object.fromEntries(Object.entries(ok).filter(([, v]) => /^97[89]\d{10}$/.test(v))),
      misses: x ? Object.fromEntries(Object.entries(JSON.parse(x[1])).filter(([, v]) => /^\d{4}-\d{2}-\d{2}$/.test(v))) : {}
    };
  } catch { return { isbns: {}, misses: {} }; }
}

const stats = { google: 0, openlibrary: 0, checks: 0, errors: {}, bookshop: {} };
const err = (m) => { stats.errors[m] = (stats.errors[m] || 0) + 1; };

// Candidate ISBNs (US/UK English groups 978-0 / 978-1) from matching titles by the same author.
function candidates(items, want, wantLast) {
  const out = [];
  for (const it of items) {
    const vt = norm(it.title || '');
    if (!vt || SKIP.test(`${it.title} ${it.subtitle || ''}`)) continue;
    if (!(vt === want || vt.startsWith(want + ' ') || want.startsWith(vt + ' '))) continue;
    if (!(it.authors || []).some((a) => norm(a).split(' ').includes(wantLast))) continue;
    (it.isbns || []).forEach((x) => { if (/^97[89][01]\d{9}$/.test(x) && !out.includes(x)) out.push(x); });
  }
  return out;
}

async function google(t, last) {
  const url = `${API}?q=${encodeURIComponent(`intitle:${t} inauthor:${last}`)}&printType=books&langRestrict=en&maxResults=10`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  return (data.items || []).map((i) => { const v = i.volumeInfo || {}; return { title: v.title, subtitle: v.subtitle, authors: v.authors,
    isbns: (v.industryIdentifiers || []).filter((x) => x.type === 'ISBN_13').map((x) => x.identifier) }; });
}

// Backup source: Open Library (public, no key).
async function openLibrary(t, last) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(t)}&author=${encodeURIComponent(last)}&limit=5&fields=title,subtitle,author_name,isbn`;
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA } });
  if (!res.ok) throw new Error(`OpenLibrary HTTP ${res.status}`);
  const data = await res.json();
  return (data.docs || []).map((d) => ({ title: d.title, subtitle: d.subtitle, authors: d.author_name, isbns: d.isbn || [] }));
}

// Bookshop check: a normal (non-affiliate) Bookshop search for the ISBN. If Bookshop carries that edition,
// the search lands on the book's page (/p/books/...). Polite: identified, slow, capped, and only if robots.txt allows /search.
const UA = 'ThePartyWheel-linkcheck/1.0 (+https://thepartywheel.com; hello@thepartywheel.com)';
const MAX_CHECKS = 300, CHECK_GAP = 1500, PER_BOOK = 6;
async function bookshopAllows() {
  try {
    const res = await fetch('https://bookshop.org/robots.txt', { headers: { 'user-agent': UA } });
    if (!res.ok) return true;
    let applies = false, blocked = false; stats.robots = [];
    for (const raw of (await res.text()).split('\n')) {
      const line = raw.replace(/#.*/, '').trim(); const [k, ...rest] = line.split(':'); const v = rest.join(':').trim();
      if (/^user-agent$/i.test(k)) applies = v === '*';
      else if (applies && /^(dis)?allow$/i.test(k) && v) stats.robots.push(`${k[0].toLowerCase()}:${v}`);
      else if (applies && /^disallow$/i.test(k) && v && ('/search'.startsWith(v) || v.startsWith('/search'))) blocked = true;
    }
    return !blocked;
  } catch { return true; }
}
async function onBookshop(isbn) {
  if (stats.checks >= MAX_CHECKS) return null;
  stats.checks++;
  await sleep(CHECK_GAP);
  try {
    const res = await fetch(`https://bookshop.org/search?keywords=${isbn}`, { headers: { 'user-agent': UA }, redirect: 'follow' });
    const tag = `${res.status}${/\/p\/books\//.test(res.url) ? ' book' : ''}`;
    stats.bookshop[tag] = (stats.bookshop[tag] || 0) + 1;
    return res.ok && /\/p\/books\//.test(res.url);
  } catch (e) { err('Bookshop ' + e.message); return null; }
}

async function lookup(title, author) {
  const t = cleanTitle(title), last = lastName(author);
  const want = norm(t), wantLast = norm(last);
  let cands = [];
  for (const [name, fn] of [['google', google], ['openlibrary', openLibrary]]) {
    try { const c = candidates(await fn(t, last), want, wantLast); if (c.length) stats[name]++; cands.push(...c.filter((x) => !cands.includes(x))); }
    catch (e) { err(e.message); }
  }
  for (const isbn of cands.slice(0, PER_BOOK)) {
    const ok = await onBookshop(isbn);
    if (ok) return isbn;
    if (ok === null) return undefined; // out of checks or network trouble: try again next run
  }
  return null;
}

const books = loadBooks();
const { isbns, misses } = loadExisting();
const today = new Date().toISOString().slice(0, 10);
const allowed = await bookshopAllows();
let looked = 0, found = 0, missed = [];
const RETRY_DAYS = 28;
if (allowed) {
  for (const [t, a] of books) {
    const k = bookKey(t, a);
    if (isbns[k] || looked >= MAX_LOOKUPS || stats.checks >= MAX_CHECKS) continue;
    if (misses[k] && (Date.parse(today) - Date.parse(misses[k])) / 864e5 < RETRY_DAYS) continue;
    looked++;
    const isbn = await lookup(t, a);
    if (isbn) { isbns[k] = isbn; found++; delete misses[k]; }
    else if (isbn === null) { misses[k] = today; missed.push(`${t} – ${a}`); }
    await sleep(400);
  }
}
// Keep only keys for books still on the page, so the file doesn't grow forever.
const live = new Set(books.map(([t, a]) => bookKey(t, a)));
const keep = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => live.has(k)).sort());
const kept = keep(isbns);
const clean = (o) => JSON.stringify(o).replace(/[^\w :,{}"]/g, '');
writeFileSync(OUT,
  `// Generated by scripts/lookup-isbns.mjs. Do not edit by hand.\n` +
  `// Key: "<title without subtitle>|<author last name>" in lowercase. Value: ISBN-13 confirmed to open a book page on Bookshop.org.\n` +
  `// Last run ${today}: robots ${allowed ? 'ok' : 'disallow, skipped'}; looked up ${looked}, confirmed ${found}, missing ${missed.length}; Bookshop checks ${stats.checks} ${clean(stats.bookshop)}; sources Google ${stats.google}, Open Library ${stats.openlibrary}; errors ${clean(stats.errors)}\n` +
  `// Bookshop robots (*): ${(stats.robots || []).join(' ').replace(/[^\w\/*:?=. -]/g, '').slice(0, 1500)}\n` +
  `window.BOOK_ISBNS = ${JSON.stringify(kept, null, 1)};\n` +
  `window.BOOK_ISBN_MISSES = ${JSON.stringify(keep(misses))};\n`);
console.log(`Books: ${books.length}. Looked up: ${looked}. Confirmed: ${found}. Total with ISBN: ${Object.keys(kept).length}.`);
