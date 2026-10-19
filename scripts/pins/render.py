"""Render Pinterest pin images (1000x1500 JPG) in the house pin style.

Usage: python3 scripts/pins/render.py
Reads pins/queue.json and renders any pin whose image file is missing
(pass --all to re-render every pin). Needs Playwright + Chromium and the Inter font.
Agents run this locally; the GitHub Action never renders images.
"""
import html, json, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
QUEUE = ROOT / 'pins' / 'queue.json'

THEMES = {
    'holiday': dict(bg='#123328', ring='#1E3D33', wheel=['#E2453C', '#FFC93C', '#2E8B57', '#FFF4E2']),
    'brand': dict(bg='#2B1342', ring='#3A1F55', wheel=['#FF4F86', '#FFC93C', '#22B8A7', '#FFF4E2']),
}

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1000px;height:1500px;background:%(bg)s;font-family:Inter,system-ui,sans-serif;color:#FFF4E2;
display:flex;flex-direction:column;align-items:center;text-align:center}
.brand{margin-top:68px;color:#FFC93C;font-weight:800;font-size:34px;letter-spacing:1.5px}
h1{margin-top:22px;font-weight:900;font-size:%(hsize)dpx;line-height:1.02;letter-spacing:-2px;padding:0 50px}
.sub{margin-top:26px;font-size:38px;font-weight:700;color:#EBDFCB;padding:0 50px}
canvas{margin-top:auto}
.tag{margin-top:34px;font-size:34px;font-weight:700;color:#EBDFCB}
.cta{margin:22px 0 68px;background:%(accent)s;color:#2B1342;font-weight:900;font-size:44px;
border-radius:60px;padding:22px 52px}
</style></head><body>
<p class="brand">THE PARTY WHEEL</p><h1>%(h)s</h1><p class="sub">%(s)s</p>
<canvas id="c" width="760" height="760"></canvas>
<p class="tag">Free · No sign-up · Works on any phone</p><p class="cta">Spin free at thepartywheel.com</p>
<script>
document.fonts.ready.then(()=>{
const h=document.querySelector('h1');let fs=%(hsize)d;while(h.getBoundingClientRect().height>fs*1.02*2+4&&fs>70){fs-=4;h.style.fontSize=fs+'px';}
const items=%(items)s, cols=%(cols)s, ring='%(ring)s';
const c=document.getElementById('c'),x=c.getContext('2d'),R=350,cx=380,cy=380,n=items.length,a=2*Math.PI/n;
x.fillStyle=ring;x.beginPath();x.arc(cx,cy,R+24,0,7);x.fill();
for(let i=0;i<n;i++){const s=-Math.PI/2-a/2+i*a;
 x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R,s,s+a);x.closePath();x.fillStyle=cols[i%%cols.length];x.fill();
 x.strokeStyle='#2B1342';x.lineWidth=3;x.stroke();
 x.save();x.translate(cx,cy);x.rotate(s+a/2);x.fillStyle='#2B1342';x.font='600 30px Inter';x.textAlign='right';x.textBaseline='middle';
 let t=items[i];while(x.measureText(t).width>R-60&&t.length>4)t=t.slice(0,-2);if(t!==items[i])t=t.trimEnd()+'…';
 x.fillText(t,R-22,0);x.restore();}
x.fillStyle='#2B1342';x.beginPath();x.arc(cx,cy,32,0,7);x.fill();
x.fillStyle='#FFF4E2';x.beginPath();x.moveTo(cx-30,cy-R-38);x.lineTo(cx+30,cy-R-38);x.lineTo(cx,cy-R+30);x.closePath();x.fill();
window.done=true;});
</script></body></html>"""


def render(page, pin, out):
    th = THEMES[pin.get('theme', 'holiday')]
    accent = pin.get('accent', '#FFC93C')
    if not re.fullmatch(r'#[0-9A-Fa-f]{6}', accent):
        raise ValueError(f"{pin['id']}: accent must be #RRGGBB")
    items = json.dumps(pin['wheel']).replace('<', '\\u003c')  # no </script> breakouts
    head = pin['headline']
    doc = PAGE % dict(bg=th['bg'], ring=th['ring'], cols=json.dumps(th['wheel']), accent=accent,
                      h=html.escape(head), s=html.escape(pin['subhead']), items=items,
                      hsize=112)
    page.set_content(doc)
    page.wait_for_function('window.done === true')
    page.screenshot(path=str(out), type='jpeg', quality=88, clip=dict(x=0, y=0, width=1000, height=1500))


def main():
    pins = json.loads(QUEUE.read_text())['pins']
    redo = '--all' in sys.argv
    with sync_playwright() as p:
        b = p.chromium.launch()
        for pin in pins:
            out = ROOT / pin['image'].lstrip('/')
            if out.exists() and not redo:
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            page = b.new_page(viewport=dict(width=1000, height=1500))
            render(page, pin, out)
            page.close()
            print('rendered', out.relative_to(ROOT))
        b.close()


if __name__ == '__main__':
    main()
