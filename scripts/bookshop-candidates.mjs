// One-time helper (run by hand from the Actions tab): builds CSV files of candidate ISBNs
// for the club favorites, split by genre (max 50 per file), for Mark to upload into Bookshop.org lists.
// Bookshop's list tool only accepts books it carries, which confirms the ISBNs the approved way.
// Source: Open Library (public API, no key). Never contacts Bookshop.
// Pick per book: the most recent English paperback/hardcover edition with a US/UK-group ISBN (978-0/978-1).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const UA = 'ThePartyWheel/1.0 (+https://thepartywheel.com; hello@thepartywheel.com)';
const OUTDIR = new URL('../docs/bookshop/', import.meta.url);
const ROUND = Number(process.env.ROUND || 1); // round 2+ tries the next-best edition for books not yet confirmed
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const cleanText = (s) => String(s || '').replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, ' ').replace(/[&,;!?…]/g, ' ').replace(/\s+/g, ' ').trim();
const cleanTitle = (t) => cleanText(String(t || '').replace(/\s*[(\[].*?[)\]]\s*/g, ' ').split(/:\s/)[0]);
const firstAuthor = (a) => cleanText(String(a || '').split(/\s+(?:&|and|ft\.?|feat\.?|featuring|with)\s+|,\s*/i)[0]);
const lastName = (a) => { const w = firstAuthor(a).split(' ').filter((x) => !/^(jr\.?|sr\.?|ii|iii|iv)$/i.test(x)); return w.length ? w[w.length - 1] : ''; };
const bookKey = (t, a) => `${cleanTitle(t)}|${lastName(a)}`.toLowerCase();
const norm = (s) => cleanText(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const SKIP = /summary|study guide|workbook|analysis|sparknotes|cliffsnotes|coloring|journal|companion|collection|box ?set|boxed|large print|abridged/i;

const window = {};
new Function('window', readFileSync(new URL('../book-club-picker/books.js', import.meta.url), 'utf8'))(window);
const books = (window.BOOK_CLUB_BOOKS || []).map(([t, a, g]) => ({ title: t, author: a, genre: g, key: bookKey(t, a) }));

let confirmed = {};
try { const m = readFileSync(new URL('../book-club-picker/isbns.js', import.meta.url), 'utf8').match(/window\.BOOK_ISBNS\s*=\s*(\{[\s\S]*?\});/); confirmed = m ? JSON.parse(m[1]) : {}; } catch {}

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function editionsFor(b) {
  const t = cleanTitle(b.title), last = lastName(b.author);
  const s = await getJSON(`https://openlibrary.org/search.json?title=${encodeURIComponent(t)}&author=${encodeURIComponent(last)}&limit=5&fields=key,title,author_name`);
  const want = norm(t), wantLast = norm(last);
  const doc = (s.docs || []).find((d) => { const vt = norm(d.title || ''); return (vt === want || vt.startsWith(want + ' ') || want.startsWith(vt + ' ')) && (d.author_name || []).some((a) => norm(a).split(' ').includes(wantLast)); });
  if (!doc) return [];
  await sleep(400);
  const e = await getJSON(`https://openlibrary.org${doc.key}/editions.json?limit=200`);
  const year = (d) => { const m = String(d || '').match(/(19|20)\d{2}/g); return m ? Number(m[m.length - 1]) : 0; };
  return (e.entries || [])
    .filter((x) => !SKIP.test(`${x.title || ''} ${x.subtitle || ''} ${x.physical_format || ''}`))
    .filter((x) => !x.languages || x.languages.some((l) => /eng/.test(l.key || '')))
    .filter((x) => /paperback|hardcover|hardback|trade/i.test(x.physical_format || ''))
    .flatMap((x) => (x.isbn_13 || []).filter((i) => /^97[89][01]\d{9}$/.test(i)).map((i) => ({ isbn: i, year: year(x.publish_date), paper: /paper|trade/i.test(x.physical_format) })))
    .sort((a, b) => (b.year - a.year) || (b.paper - a.paper))
    .filter((x, i, arr) => arr.findIndex((y) => y.isbn === x.isbn) === i);
}

const picks = [], missing = [];
for (const b of books) {
  if (confirmed[b.key]) continue;
  try {
    const eds = await editionsFor(b);
    const choice = eds[ROUND - 1];
    if (choice) picks.push({ ...b, isbn: choice.isbn, year: choice.year }); else missing.push(b);
  } catch (e) { missing.push({ ...b, error: e.message }); }
  await sleep(500);
}

mkdirSync(OUTDIR, { recursive: true });
const NAMES = { fiction: 'contemporary-fiction', mystery: 'mystery-thriller', romance: 'romance', scifi: 'scifi-fantasy', nonfiction: 'nonfiction', classics: 'classics', challenged: 'frequently-challenged' };
const byGenre = {};
picks.forEach((p) => { (byGenre[p.genre] ||= []).push(p); });
const files = [];
for (const [g, list] of Object.entries(byGenre)) {
  for (let i = 0; i < list.length; i += 50) {
    const part = list.slice(i, i + 50);
    const name = `round${ROUND}-${NAMES[g] || g}${list.length > 50 ? `-${i / 50 + 1}` : ''}.csv`;
    writeFileSync(new URL(name, OUTDIR), part.map((p) => p.isbn).join('\n') + '\n');
    files.push(`${name} (${part.length})`);
  }
}
writeFileSync(new URL(`round${ROUND}-candidates.json`, OUTDIR), JSON.stringify({ round: ROUND, made: new Date().toISOString().slice(0, 10), files, picks, missing }, null, 1));
console.log(`Round ${ROUND}: ${picks.length} candidates, ${missing.length} without a candidate. Files: ${files.join(', ')}`);
