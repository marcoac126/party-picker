// Weekly updater: pulls Apple Music's US top songs feed and writes
// karaoke-song-picker/hits.js. Runs in GitHub Actions; visitors never contact Apple.
// Safety rules (security review 2026-10-09):
//  - Read-only public feed, no keys.
//  - Keep only songs with no advisory flag or "Clean". Apple spells the explicit
//    flag inconsistently ("Explict"), so we allow-list instead of block-list.
//  - Plain text only, length-capped. The page renders with textContent.
//  - If the feed fails or looks wrong, exit without touching the existing list.
import { writeFileSync } from 'node:fs';

const FEED = process.env.HITS_FEED || 'https://rss.marketingtools.apple.com/api/v2/us/music/most-played/50/songs.json';
const OUT = new URL('../karaoke-song-picker/hits.js', import.meta.url);
const MIN_SONGS = 5;

const clean = (s) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 120);

try {
  const res = await fetch(FEED, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Feed returned HTTP ${res.status}`);
  const data = await res.json();
  const results = data?.feed?.results;
  if (!Array.isArray(results)) throw new Error('Unexpected feed shape');

  const seen = new Set();
  const songs = [];
  for (const r of results) {
    const rating = r.contentAdvisoryRating;
    if (rating !== undefined && rating !== 'Clean') continue;
    const title = clean(r.name), artist = clean(r.artistName);
    const key = `${title}|${artist}`.toLowerCase();
    if (!title || !artist || seen.has(key)) continue;
    seen.add(key);
    songs.push([title, artist]);
  }
  if (songs.length < MIN_SONGS) throw new Error(`Only ${songs.length} clean songs; keeping old list`);

  const updated = new Date().toISOString().slice(0, 10);
  const body =
    `// Generated weekly by scripts/update-hits.mjs from Apple Music's US top songs feed. Do not edit by hand.\n` +
    `window.KARAOKE_HITS = ${JSON.stringify({ updated, songs }, null, 1)};\n`;
  writeFileSync(OUT, body);
  console.log(`Wrote ${songs.length} clean songs (of ${results.length}) updated ${updated}`);
} catch (err) {
  console.error(`Hits update skipped: ${err.message}`);
  process.exit(0); // don't fail the workflow; the old list stays live
}
