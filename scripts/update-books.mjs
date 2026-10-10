// Weekly updater: pulls Apple Books' US top-paid feed and writes
// book-club-picker/current-books.js ("New & popular"). Runs in GitHub Actions.
// Same safety pattern as update-hits.mjs (security review 2026-10-09):
//  - Read-only public feed, no keys. Plain text only, length-capped.
//  - Leave out kids/YA, comics & manga, erotica, and box sets (poor book club fits).
//  - If the feed fails or looks wrong, keep the existing list.
import { writeFileSync } from 'node:fs';

const FEED = process.env.BOOKS_FEED || 'https://rss.marketingtools.apple.com/api/v2/us/books/top-paid/50/books.json';
const OUT = new URL('../book-club-picker/current-books.js', import.meta.url);
const MIN_BOOKS = 8;
const SKIP_GENRES = /kids|children|young adult|teen|comic|graphic novel|manga|erotica/i;
const SKIP_TITLES = /box(ed)? set|bundle|collection|books? \d+\s*[-–]\s*\d+|volume \d+|vol\. ?\d+/i;

const clean = (s) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 140);

try {
  const res = await fetch(FEED, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Feed returned HTTP ${res.status}`);
  const data = await res.json();
  const results = data?.feed?.results;
  if (!Array.isArray(results)) throw new Error('Unexpected feed shape');

  const seen = new Set();
  const books = [];
  for (const r of results) {
    const genres = (r.genres || []).map((g) => (typeof g === 'string' ? g : g?.name || '')).join(' | ');
    if (SKIP_GENRES.test(genres)) continue;
    const title = clean(r.name), author = clean(r.artistName);
    if (!title || !author || SKIP_TITLES.test(title)) continue;
    const key = `${title}|${author}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    books.push([title, author, 'current']);
  }
  if (books.length < MIN_BOOKS) throw new Error(`Only ${books.length} usable books; keeping old list`);

  const updated = new Date().toISOString().slice(0, 10);
  writeFileSync(OUT,
    `// Generated weekly by scripts/update-books.mjs from Apple Books' US top-paid chart. Do not edit by hand.\n` +
    `window.CURRENT_BOOKS = ${JSON.stringify({ updated, books }, null, 1)};\n`);
  console.log(`Wrote ${books.length} books (of ${results.length}) updated ${updated}`);
} catch (err) {
  console.error(`Books update skipped: ${err.message}`);
  process.exit(0);
}
