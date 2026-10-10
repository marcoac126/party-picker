// "Share this wheel": packs the wheel's list into the link itself (after the #),
// so nothing is stored on a server. Opening the link loads the list on the
// recipient's wheel. Security: shared text is treated as plain text, capped in
// count and length, and the # part is removed from the address bar after loading.
(function () {
  const MAX_ITEMS = 60, MAX_LEN = 120;

  function toB64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = ''; bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64(b64) {
    const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  }

  function makeUrl(items, kind) {
    const data = { v: 1, k: kind || '', i: items.slice(0, MAX_ITEMS).map((s) => String(s).slice(0, MAX_LEN)) };
    return `${location.origin}${location.pathname}#w=${toB64(JSON.stringify(data))}`;
  }

  // Returns { items, kind } if the page was opened from a shared link, else null.
  function read() {
    const m = location.hash.match(/^#w=([A-Za-z0-9_-]+)$/);
    if (!m) return null;
    try {
      const data = JSON.parse(fromB64(m[1]));
      if (!data || !Array.isArray(data.i)) return null;
      const items = data.i.filter((s) => typeof s === 'string')
        .map((s) => s.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, MAX_LEN))
        .filter(Boolean).slice(0, MAX_ITEMS);
      history.replaceState(null, '', location.pathname + location.search);
      return items.length ? { items, kind: typeof data.k === 'string' ? data.k : '' } : null;
    } catch (e) { return null; }
  }

  // Native share sheet on phones; copy to clipboard elsewhere. Reports via statusEl.
  async function share(items, kind, title, statusEl) {
    if (items.length < 2) { statusEl.textContent = 'Add at least two items first.'; return; }
    const url = makeUrl(items, kind);
    try {
      if (navigator.share) { await navigator.share({ title, text: `Spin our wheel: ${title}`, url }); statusEl.textContent = ''; return; }
      await navigator.clipboard.writeText(url);
      statusEl.textContent = 'Link copied. Paste it anywhere to share.';
    } catch (e) {
      if (e && e.name === 'AbortError') return; // user closed the share sheet
      window.prompt('Copy this link to share your wheel:', url);
    }
  }

  window.PartyShare = { makeUrl, read, share };
})();
