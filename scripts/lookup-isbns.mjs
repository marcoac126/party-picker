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
    const m = txt.match(/window\.BOOK_ISBNS\s*=\s*(\{[\s\S]*\});/);
    const obj = m ? JSON.parse(m[1]) : {};
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => /^97[89]\d{10}$/.test(v)));
  } catch { return {}; }
}

function pick(items, want, wantLast) {
  for (const it of items) {
    const vt = norm(it.title || '');
    if (!vt || SKIP.test(`${it.title} ${it.subtitle || ''}`)) continue;
    if (!(vt === want || vt.startsWith(want + ' ') || want.startsWith(vt + ' '))) continue;
    if (!(it.authors || []).some((a) => norm(a).split(' ').includes(wantLast))) continue;
    const isbn = (it.isbns || []).find((x) => /^97[89]\d{10}$/.test(x));
    if (isbn) return isbn;
  }
  return null;
}

async function google(t, last) {
  const url = `${API}?q=${encodeURIComponent(`intitle:${t} inauthor:${last}`)}&printType=books&langRestrict=en&maxResults=10`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  return (data.items || []).map((i) => { const v = i.volumeInfo || {}; return { title: v.title, subtitle: v.subtitle, authors: v.authors,
    isbns: (v.industryIdentifiers || []).filter((x) => x.type === 'ISBN_13').map((x) => x.identifier) }; });
}

// Backup source: Open Library (public, no key). Asks for English editions with ISBNs.
async function openLibrary(t, last) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(t)}&author=${encodeURIComponent(last)}&limit=5&fields=title,subtitle,author_name,isbn,language`;
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'ThePartyWheel/1.0 (hello@thepartywheel.com)' } });
  if (!res.ok) throw new Error(`OpenLibrary HTTP ${res.status}`);
  const data = await res.json();
  if (stats.sample === undefined) stats.sample = `${(data.docs || []).length} docs, first isbns ${((data.docs || [])[0]?.isbn || []).length}`;
  // English-language ISBN groups are 978-0 and 978-1; prefer those.
  return (data.docs || []).map((d) => ({ title: d.title, subtitle: d.subtitle, authors: d.author_name,
    isbns: (d.isbn || []).filter((x) => /^97[89][01]\d{9}$/.test(x)).sort() }));
}

const stats = { google: 0, openlibrary: 0, errors: {} };
async function lookup(title, author) {
  const t = cleanTitle(title), last = lastName(author);
  const want = norm(t), wantLast = norm(last);
  for (const [name, fn] of [['google', google], ['openlibrary', openLibrary]]) {
    try {
      const isbn = pick(await fn(t, last), want, wantLast);
      if (isbn) { stats[name]++; return isbn; }
    } catch (e) { stats.errors[e.message] = (stats.errors[e.message] || 0) + 1; }
  }
  return null;
}

const books = loadBooks();
const isbns = loadExisting();
let looked = 0, found = 0, missed = [];
for (const [t, a] of books) {
  const k = bookKey(t, a);
  if (isbns[k] || looked >= MAX_LOOKUPS) continue;
  looked++;
  const isbn = await lookup(t, a);
  if (isbn) { isbns[k] = isbn; found++; } else missed.push(`${t} – ${a}`);
  await sleep(400);
}
// Keep only keys for books still on the page, so the file doesn't grow forever.
const live = new Set(books.map(([t, a]) => bookKey(t, a)));
const kept = Object.fromEntries(Object.entries(isbns).filter(([k]) => live.has(k)).sort());
writeFileSync(OUT,
  `// Generated by scripts/lookup-isbns.mjs (Google Books). Do not edit by hand.\n` +
  `// Key: "<title without subtitle>|<author last name>" in lowercase. Value: ISBN-13.\n` +
  `// Last run ${new Date().toISOString().slice(0, 10)}: looked up ${looked}, found ${found} (Google ${stats.google}, Open Library ${stats.openlibrary}), missing ${missed.length}. Sample: ${String(stats.sample || '').replace(/[^\w ,]/g, '')}. Errors: ${JSON.stringify(stats.errors).replace(/[^\w :,{}"]/g, '')}\n` +
  `window.BOOK_ISBNS = ${JSON.stringify(kept, null, 1)};\n`);
console.log(`Books: ${books.length}. Looked up: ${looked}. Found: ${found}. Total with ISBN: ${Object.keys(kept).length}.`);
if (missed.length) console.log('No ISBN found for:\n  ' + missed.join('\n  '));
