// Builds Pinterest RSS feeds from pins/queue.json.
// A pin is added to its feed once its publish date (Central time) has arrived, at most one
// per feed per day (earliest date first), so a late merge doesn't post a backlog all at once.
// The committed feed is the state: items keep the date they entered; new ones get today's date.
// Pinterest reads each feed and posts new items to the board connected to it.
// Run by .github/workflows/pin-feeds.yml every morning; safe to run by hand.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const SITE = 'https://thepartywheel.com';
// Preset settings the picker pages read from the link. Nothing else (no tracking tags) may ride along.
const PRESETS = new Set(['moods', 'price', 'vibes', 'style', 'decade', 'occasion', 'players', 'types', 'genres', 'mode']);
const MAX_ITEMS = 25; // keep feeds small; older items have already been pinned
const q = JSON.parse(readFileSync('pins/queue.json', 'utf8'));
// PIN_TODAY=YYYY-MM-DD overrides today's date, for testing only.
const today = process.env.PIN_TODAY || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date()); // YYYY-MM-DD
if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || new Date(`${today}T00:00Z`).getUTCDate() !== +today.slice(8)) throw new Error('PIN_TODAY must be YYYY-MM-DD');
if (process.env.PIN_TODAY && process.env.GITHUB_ACTIONS) throw new Error('PIN_TODAY is for local tests only');
// Items are stamped 6:00 AM Central (12:00 UTC), just before the daily run, so they are never future-dated.
const noon = (d) => new Date(`${d}T06:00:00-06:00`).toUTCString();

// Strip characters XML 1.0 forbids (one stray character would break the whole feed), then escape.
const esc = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Safety checks: every link and image must be on our own site, over HTTPS, with no # data.
function check(p) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) throw new Error(`${p.id}: id must be lowercase words joined by single dashes`);
  const link = new URL(p.link);
  if (link.origin !== SITE) throw new Error(`${p.id}: link must be on ${SITE}`);
  if (link.hash) throw new Error(`${p.id}: no # share links in pins`);
  if (link.username || link.password) throw new Error(`${p.id}: no user@ part in links`);
  for (const k of link.searchParams.keys()) {
    if (!PRESETS.has(k)) throw new Error(`${p.id}: only the pages' own presets are allowed (${[...PRESETS].join(', ')}), not "${k}"`);
  }
  if (!/^\/pins\/img\/[a-z0-9-]+\.jpg$/.test(p.image)) throw new Error(`${p.id}: image must be /pins/img/<name>.jpg`);
  if (!existsSync(p.image.slice(1))) throw new Error(`${p.id}: image file missing`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.publish)) throw new Error(`${p.id}: publish must be YYYY-MM-DD`);
  if (!q.feeds[p.feed]) throw new Error(`${p.id}: unknown feed ${p.feed}`);
  if (p.title.length > 100) throw new Error(`${p.id}: title over Pinterest's 100 characters`);
  if (p.description.length > 500) throw new Error(`${p.id}: description over 500 characters`);
}
const ids = new Set();
for (const p of q.pins) {
  check(p);
  if (ids.has(p.id)) throw new Error(`duplicate id ${p.id}`);
  ids.add(p.id);
}

let changed = 0;
for (const [key, feed] of Object.entries(q.feeds)) {
  const old = existsSync(feed.file) ? readFileSync(feed.file, 'utf8') : '';
  const pins = new Map(q.pins.filter((p) => p.feed === key).map((p) => [p.id, p]));
  // State from the committed feed: items already in it (with the date they entered),
  // plus pins posted earlier but trimmed by MAX_ITEMS (so they are never posted twice).
  const found = [...old.matchAll(/<guid[^>]*>thepartywheel-pin-([^<]+)<\/guid>\s*<pubDate>([^<]+)<\/pubDate>/g)];
  // If the feed layout ever changes, stop rather than re-post pins that look new.
  if (found.length !== (old.match(/<item>/g) || []).length) throw new Error(`${feed.file}: could not read every existing item`);
  const inFeed = found.filter(([, id]) => pins.has(id)).map(([, id, date]) => {
    if (isNaN(Date.parse(date))) throw new Error(`${feed.file}: bad pubDate for ${id}`);
    return { p: pins.get(id), date: new Date(date).toUTCString() };
  });
  const trimmed = (old.match(/<!-- posted earlier: ([^>]*) -->/)?.[1] || '').split(' ').filter((id) => pins.has(id));
  const seen = new Set([...trimmed, ...inFeed.map((i) => i.p.id)]);
  // At most one new pin per feed per day: the earliest due pin not yet posted.
  const next = [...pins.values()].filter((p) => p.publish <= today && !seen.has(p.id))
    .sort((a, b) => a.publish.localeCompare(b.publish) || a.id.localeCompare(b.id))[0];
  if (next && !inFeed.some((i) => i.date === noon(today))) inFeed.push({ p: next, date: noon(today) });
  inFeed.sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.p.id.localeCompare(b.p.id));
  const due = inFeed.slice(0, MAX_ITEMS);
  const posted = [...trimmed, ...inFeed.slice(MAX_ITEMS).map((i) => i.p.id)];
  const items = due.map(({ p, date }) => {
    const img = SITE + p.image;
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(p.link)}</link>
      <guid isPermaLink="false">thepartywheel-pin-${esc(p.id)}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(p.description)}</description>
      <enclosure url="${esc(img)}" type="image/jpeg" length="${statSync(p.image.slice(1)).size}" />
      <media:content url="${esc(img)}" medium="image" type="image/jpeg" width="1000" height="1500">
        <media:description type="plain">${esc(p.alt || p.title)}</media:description>
      </media:content>
    </item>`;
  }).join('\n');
  const latest = due[0] ? due[0].date : 'Mon, 12 Oct 2026 18:00:00 GMT'; // fixed date for an empty feed
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(feed.title)}</title>
    <link>${SITE}/</link>
    <description>Spin-the-wheel pickers from The Party Wheel. Feed for the Pinterest board "${esc(feed.board)}".</description>
    <language>en-us</language>
    <lastBuildDate>${latest}</lastBuildDate>${posted.length ? `\n    <!-- posted earlier: ${posted.join(' ')} -->` : ''}
${items}
  </channel>
</rss>
`;
  if (old !== xml) {
    mkdirSync(dirname(feed.file), { recursive: true });
    writeFileSync(feed.file, xml);
    changed++;
    console.log(`${feed.file}: ${due.length} item(s)`);
  }
}
if (!changed) console.log('No feed changes.');
