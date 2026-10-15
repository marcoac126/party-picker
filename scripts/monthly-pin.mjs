// Renders the monthly book club pick pin (1000x1500 JPG) from book-club-picker/monthly-pick.js.
// Usage: node scripts/monthly-pin.mjs   -> docs/marketing/pins/monthly-YYYY-MM.jpg
// Text and our own wheel only: no book covers (copyright), no store logos (trademarks).
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const PW = ['/opt/node-tools/node_modules/playwright/index.mjs', '/opt/npm-tools/node_modules/playwright/index.mjs', 'playwright'];
let chromium; for (const p of PW) { try { ({ chromium } = await import(p)); break; } catch {} }
if (!chromium) { console.error('Playwright not found'); process.exit(1); }

const u = (p) => new URL(p, import.meta.url);
const pick = JSON.parse(readFileSync(u('../book-club-picker/monthly-pick.js'), 'utf8').match(/window\.MONTHLY_PICK\s*=\s*(\{[\s\S]*?\});/)[1]);
const w = {}; new Function('window', readFileSync(u('../book-club-picker/books.js'), 'utf8'))(w);
const others = w.BOOK_CLUB_BOOKS.filter(([t, , g]) => g === pick.genre && t !== pick.title).map(([t]) => t);
for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
const items = [pick.title, ...others.slice(0, 9)];
const monthName = new Date(`${pick.month}-15T12:00:00Z`).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wheelJs = readFileSync(u('../assets/wheel.js'), 'utf8');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box} body{margin:0;width:1000px;height:1500px;background:#2B1342;color:#FFF4E2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;display:flex;flex-direction:column;align-items:center;padding:80px 70px 70px;text-align:center}
.kicker{color:#FFC93C;font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:40px}
h1{font-size:84px;line-height:1.05;margin:28px 0 14px;font-weight:850;text-wrap:balance}
.by{font-size:40px;color:#E6D6C4;margin:0}
.stage{position:relative;width:640px;height:640px;margin:50px 0 40px}
canvas{width:640px;height:640px} .ptr{position:absolute;left:50%;top:-18px;transform:translateX(-50%);width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-top:52px solid #FFF4E2;z-index:2}
.genre{font-size:36px;color:#E6D6C4;margin:0 0 18px} .genre b{color:#FFF4E2}
.find{font-size:38px;font-weight:750;color:#FFC93C;margin:0 0 auto;text-wrap:balance}
.url{font-size:40px;font-weight:800;margin-top:30px}
</style></head><body>
<div class="kicker">${esc(monthName)} book club pick</div>
<h1>${esc(pick.title)}</h1><p class="by">by ${esc(pick.author)}</p>
<div class="stage"><div class="ptr"></div><canvas id="w"></canvas></div>
<p class="genre">The wheel picked it from <b>${esc(pick.genreLabel.toLowerCase())}</b></p>
<p class="find">Find it at your library or an indie bookstore</p>
<div class="url">thepartywheel.com</div>
<script>window.matchMedia=()=>({matches:false,addEventListener(){}});${wheelJs}
const wh=new Wheel(document.getElementById('w'),{});wh.setItems(${JSON.stringify(items)});
const slice=Math.PI*2/wh.items.length;wh.angle=(-Math.PI/2)-0.5*slice;wh.draw();</script>
</body></html>`;

mkdirSync(u('../docs/marketing/pins/'), { recursive: true });
const out = fileURLToPath(u(`../docs/marketing/pins/monthly-${pick.month}.jpg`));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await (await b.newContext({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 })).newPage();
await p.setContent(html, { waitUntil: 'load' });
await p.waitForTimeout(200);
await p.screenshot({ path: out, type: 'jpeg', quality: 90 });
await b.close();
console.log(out);
