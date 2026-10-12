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

  function makeUrl(items, kind, result) {
    const data = { v: 1, k: kind || '', i: items.slice(0, MAX_ITEMS).map((s) => String(s).slice(0, MAX_LEN)) };
    if (Number.isInteger(result) && result >= 0 && result < data.i.length) data.r = result;
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
      if (!items.length) return null;
      // A shared result only counts if it points at an item and no items were dropped while cleaning.
      const result = (Number.isInteger(data.r) && data.r >= 0 && data.r < items.length && items.length === data.i.length) ? data.r : null;
      return { items, kind: typeof data.k === 'string' ? data.k : '', result };
    } catch (e) { return null; }
  }

  // Native share sheet on phones; copy to clipboard elsewhere. Reports via statusEl.
  async function share(items, kind, title, statusEl, result, text) {
    if (items.length < 2) { statusEl.textContent = 'Add at least two items first.'; return; }
    const url = makeUrl(items, kind, result);
    try {
      if (navigator.share) { await navigator.share({ title, text: text || `Spin our wheel: ${title}`, url }); statusEl.textContent = ''; return; }
      await navigator.clipboard.writeText(url);
      statusEl.textContent = 'Link copied. Paste it anywhere to share.';
    } catch (e) {
      if (e && e.name === 'AbortError') return; // user closed the share sheet
      window.prompt('Copy this link to share your wheel:', url);
    }
  }

  // "Share this result" button for the result card. Shares the list as it was at the spin,
  // plus which item won, so everyone who opens the link sees the same wheel land on the same pick.
  function resultButton(wheel, kind, title) {
    const spin = wheel.lastSpin;
    const wrap = document.createElement('p'); wrap.className = 'share-row';
    if (!spin || spin.items.length < 2) return wrap;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'text-btn'; btn.textContent = 'Share this result';
    const st = document.createElement('span'); st.className = 'share-status'; st.setAttribute('aria-live', 'polite');
    btn.addEventListener('click', () => share(spin.items, kind, title, st, spin.index, `The wheel landed on: ${spin.items[spin.index]}`));
    wrap.append(btn, st);
    return wrap;
  }

  const SHARED_NOTE = 'Someone shared this wheel with you. The list was made by whoever sent the link, not The Party Wheel. Spin away, or change it below.';
  const RESULT_NOTE = 'Someone shared their spin with you. Here’s where the wheel landed. The list was made by whoever sent the link, not The Party Wheel.';
  function note(shared) { return shared && shared.result !== null ? RESULT_NOTE : SHARED_NOTE; }

  window.PartyShare = { makeUrl, read, share, resultButton, note };
})();
