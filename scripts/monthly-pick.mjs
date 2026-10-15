// Monthly book club pick: spins the wheel for one genre (fixed rotation) and writes book-club-picker/monthly-pick.js.
// Run by hand or by the monthly scheduled task, on a branch; it goes live only after Mark approves.
// Usage: node scripts/monthly-pick.mjs 2026-11
// Fair: picks uniformly at random (crypto) among that genre's club favorites that have a confirmed Bookshop ISBN,
// skipping earlier picks listed in docs/marketing/monthly-picks.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';

const month = process.argv[2];
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) { console.error('Usage: node scripts/monthly-pick.mjs YYYY-MM'); process.exit(1); }
const ORDER = ['fiction', 'mystery', 'romance', 'scifi', 'nonfiction', 'classics', 'challenged'];
const LABEL = { fiction: 'Contemporary fiction', mystery: 'Mystery & thriller', romance: 'Romance', scifi: 'Sci-fi & fantasy', nonfiction: 'Nonfiction', classics: 'Classics', challenged: 'Frequently challenged' };
const [y, m] = month.split('-').map(Number);
const genre = ORDER[(((y - 2026) * 12 + (m - 11)) % ORDER.length + ORDER.length) % ORDER.length]; // Nov 2026 = fiction

const u = (p) => new URL(p, import.meta.url);
const w = {}; new Function('window', readFileSync(u('../book-club-picker/books.js'), 'utf8'))(w);
const isbns = JSON.parse(readFileSync(u('../book-club-picker/isbns.js'), 'utf8').match(/window\.BOOK_ISBNS\s*=\s*(\{[\s\S]*?\});/)[1]);
const cleanText = (s) => String(s || '').replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, ' ').replace(/[&,;!?…]/g, ' ').replace(/\s+/g, ' ').trim();
const cleanTitle = (t) => cleanText(String(t || '').replace(/\s*[(\[].*?[)\]]\s*/g, ' ').split(/:\s/)[0]);
const firstAuthor = (a) => cleanText(String(a || '').split(/\s+(?:&|and|ft\.?|feat\.?|featuring|with)\s+|,\s*/i)[0]);
const lastName = (a) => { const q = firstAuthor(a).split(' ').filter((x) => !/^(jr\.?|sr\.?|ii|iii|iv)$/i.test(x)); return q.length ? q[q.length - 1] : ''; };
const bookKey = (t, a) => `${cleanTitle(t)}|${lastName(a)}`.toLowerCase();

let history = [];
try { history = JSON.parse(readFileSync(u('../docs/marketing/monthly-picks.json'), 'utf8')); } catch {}
if (history.some((h) => h.month === month)) { console.error(`${month} already picked: ${JSON.stringify(history.find((h) => h.month === month))}`); process.exit(1); }
const used = new Set(history.map((h) => h.title.toLowerCase()));
const pool = w.BOOK_CLUB_BOOKS.filter(([t, a, g]) => g === genre && isbns[bookKey(t, a)] && !used.has(t.toLowerCase()));
if (!pool.length) { console.error(`No eligible books for ${genre}`); process.exit(1); }
const [title, author] = pool[randomInt(pool.length)];
const pick = { month, genre, genreLabel: LABEL[genre], title, author, isbn: isbns[bookKey(title, author)], poolSize: pool.length, pickedOn: new Date().toISOString().slice(0, 10) };

writeFileSync(u('../book-club-picker/monthly-pick.js'),
  `// "This month's pick" box on the book club page. Written by scripts/monthly-pick.mjs, published only after Mark approves.\n` +
  `// month: "YYYY-MM" (the box shows only during that month). genre: one of the BOOK_CLUB_BOOKS genres.\n` +
  `window.MONTHLY_PICK = ${JSON.stringify({ month, genre, genreLabel: pick.genreLabel, title, author })};\n`);
history.push(pick);
writeFileSync(u('../docs/marketing/monthly-picks.json'), JSON.stringify(history, null, 1) + '\n');
console.log(JSON.stringify(pick));
