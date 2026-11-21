// Visit and link-click counter for The Party Wheel, sending to GoatCounter (goatcounter.com).
// Our own small script (no outside code). No cookies, no screen size, no IDs.
// Sends only: page path, page title, referring page, for link clicks the store's domain plus the page it was clicked on,
// and for wheel spins "spin: /page/" plus a fixed label (mode and filter, e.g. "suggested · christmas"), max 30 per page load.
// Never sends wheel lists or share links (the #... part of a URL is never read).
// Opt-out: PartyCount.setOff(true) stores "skipgc" in this browser (also honored by GoatCounter's own tools).
(function () {
  var ENDPOINT = 'https://thepartywheel.goatcounter.com/count';
  var enc = encodeURIComponent;
  function isOff() { try { return localStorage.getItem('skipgc') === 't'; } catch (e) { return false; } }
  function setOff(off) { try { if (off) localStorage.setItem('skipgc', 't'); else localStorage.removeItem('skipgc'); } catch (e) {} }
  var MAX_EVENTS = 30, events = 0, live = false;
  // Count an event (e.g. a wheel spin). Fire-and-forget: never throws, capped per page load, honors the opt-out.
  function event(name, title) {
    try {
      if (!live || events >= MAX_EVENTS) return;
      events++;
      send(String(name), String(title || ''), '', true);
    } catch (e) {}
  }
  window.PartyCount = { isOff: isOff, setOff: setOff, event: event };

  if (location.hostname !== 'thepartywheel.com' || navigator.webdriver || isOff()) return;
  live = true;

  function send(path, title, referrer, event) {
    if (isOff()) return;
    var url = ENDPOINT + '?p=' + enc(path) + '&t=' + enc(title) + '&r=' + enc(referrer || '') +
      (event ? '&e=true' : '') + '&rnd=' + Math.random().toString(36).slice(2, 7);
    try { if (navigator.sendBeacon && navigator.sendBeacon(url)) return; } catch (e) {}
    var img = new Image(); img.src = url;
  }

  // Page visit (once the page is actually visible).
  function visit() { send(location.pathname + location.search, document.title, document.referrer, false); }
  if (document.visibilityState === 'hidden') {
    var once = function () { if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', once); visit(); } };
    document.addEventListener('visibilitychange', once);
  } else visit();

  // Outbound link clicks: "out: bookshop.org", titled with the page it came from.
  function onClick(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (!/^https?:$/.test(u.protocol) || u.hostname === location.hostname) return;
    var host = u.hostname.replace(/^www\./, '');
    send('out: ' + host, host + ' from ' + location.pathname, '', true);
  }
  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', function (ev) { if (ev.button === 1) onClick(ev); }, true);
})();
