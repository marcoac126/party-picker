// Builds Pinterest RSS feeds from pins/queue.json.
// A pin is added to its feed once its publish date (Central time) has arrived.
// Pinterest reads each feed and posts new items to the board connected to it.
// Run by .github/workflows/pin-feeds.yml every morning; safe to run by hand.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const SITE = 'https://thepartywheel.com';
// Preset settings the picker pages read from the link. Nothing else (no tracking tags) may ride along.
const PRESETS = new Set(['moods', 'price', 'vibes', 'style', 'decade', 'occasion', 'players', 'types', 'genres', 'mode']);
const MAX_ITEMS = 25; // keep feeds small; older items have already been pinned
const q = JSON.parse(readFileSync('pins/queue.json', 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date()); // YYYY-MM-DD

// Strip characters XML 1.0 forbids (one stray character would break the whole feed), then escape.
const esc = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Safety checks: every link and image must be on our own site, over HTTPS, with no # data.
function check(p) {
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
  const due = q.pins.filter((p) => p.feed === key && p.publish <= today)
    .sort((a, b) => b.publish.localeCompare(a.publish) || a.id.localeCompare(b.id))
    .slice(0, MAX_ITEMS);
  const items = due.map((p) => {
    const img = SITE + p.image;
    const date = new Date(`${p.publish}T12:00:00-06:00`).toUTCString();
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
  const latest = due[0] ? new Date(`${due[0].publish}T12:00:00-06:00`).toUTCString() : new Date('2026-10-12T12:00:00-06:00').toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(feed.title)}</title>
    <link>${SITE}/</link>
    <description>Spin-the-wheel pickers from The Party Wheel. Feed for the Pinterest board "${esc(feed.board)}".</description>
    <language>en-us</language>
    <lastBuildDate>${latest}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  const old = existsSync(feed.file) ? readFileSync(feed.file, 'utf8') : '';
  if (old !== xml) {
    mkdirSync(dirname(feed.file), { recursive: true });
    writeFileSync(feed.file, xml);
    changed++;
    console.log(`${feed.file}: ${due.length} item(s)`);
  }
}
if (!changed) console.log('No feed changes.');
