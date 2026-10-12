// "Share this wheel": packs the wheel's list into the link itself (after the #),
// so nothing is stored on a server. Opening the link loads the list on the
// recipient's wheel. Security: shared text is treated as plain text, capped in
// count and length, and the # part is removed from the address bar after loading.
(function () {
  const MAX_ITEMS = 60, MAX_LEN = 120;

  const b64url = (bytes) => { let bin = ''; bytes.forEach((b) => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

  // Compress with the browser's built-in deflate (no outside code). Falls back to plain if unavailable.
  async function deflate(bytes) {
    if (typeof CompressionStream === 'undefined') return null;
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    } catch (e) { return null; }
  }

  // Small synchronous raw-inflate (RFC 1951) so shared links can be read before the page sets up.
  // Output is capped so a crafted link can't balloon memory.
  const MAX_OUT = 32768;
  const LBASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const LEXT = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const DBASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const DEXT = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  function inflate(src) {
    let pos = 0, bit = 0;
    const out = [];
    const bits = (n) => {
      let v = 0;
      for (let i = 0; i < n; i++) {
        if (pos >= src.length) throw new Error('eof');
        v |= ((src[pos] >> bit) & 1) << i;
        if (++bit === 8) { bit = 0; pos++; }
      }
      return v;
    };
    const huff = (lengths) => {
      const count = new Array(16).fill(0), offs = new Array(16).fill(0), sym = [];
      lengths.forEach((l) => { count[l]++; });
      count[0] = 0;
      for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + count[i - 1];
      lengths.forEach((l, s) => { if (l) sym[offs[l]++] = s; });
      return { count, sym };
    };
    const decode = (h) => {
      let code = 0, first = 0, index = 0;
      for (let len = 1; len < 16; len++) {
        code |= bits(1);
        const c = h.count[len];
        if (code - c < first) return h.sym[index + (code - first)];
        index += c; first += c; first <<= 1; code <<= 1;
      }
      throw new Error('bad code');
    };
    const push = (b) => { if (out.length >= MAX_OUT) throw new Error('too big'); out.push(b); };
    let fixedL = null, fixedD = null, last = 0;
    while (!last) {
      last = bits(1);
      const type = bits(2);
      if (type === 0) {
        if (bit) { bit = 0; pos++; }
        if (pos + 4 > src.length) throw new Error('eof');
        const len = src[pos] | (src[pos + 1] << 8); pos += 4;
        if (pos + len > src.length) throw new Error('eof');
        for (let i = 0; i < len; i++) push(src[pos++]);
        continue;
      }
      let lcode, dcode;
      if (type === 1) {
        if (!fixedL) {
          const l = []; for (let i = 0; i < 288; i++) l.push(i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8);
          fixedL = huff(l); fixedD = huff(new Array(30).fill(5));
        }
        lcode = fixedL; dcode = fixedD;
      } else if (type === 2) {
        const nlen = bits(5) + 257, ndist = bits(5) + 1, ncode = bits(4) + 4;
        const order = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
        const cl = new Array(19).fill(0);
        for (let i = 0; i < ncode; i++) cl[order[i]] = bits(3);
        const clh = huff(cl), lens = [];
        while (lens.length < nlen + ndist) {
          const sym = decode(clh);
          if (sym < 16) lens.push(sym);
          else {
            let rep, val = 0;
            if (sym === 16) { if (!lens.length) throw new Error('bad'); val = lens[lens.length - 1]; rep = 3 + bits(2); }
            else if (sym === 17) rep = 3 + bits(3);
            else rep = 11 + bits(7);
            while (rep--) lens.push(val);
          }
        }
        if (lens.length > nlen + ndist) throw new Error('bad');
        lcode = huff(lens.slice(0, nlen)); dcode = huff(lens.slice(nlen));
      } else throw new Error('bad block');
      for (;;) {
        let sym = decode(lcode);
        if (sym < 256) push(sym);
        else if (sym === 256) break;
        else {
          sym -= 257; if (sym >= 29) throw new Error('bad');
          const len = LBASE[sym] + bits(LEXT[sym]);
          const ds = decode(dcode); if (ds >= 30) throw new Error('bad');
          const dist = DBASE[ds] + bits(DEXT[ds]);
          if (dist > out.length) throw new Error('bad dist');
          for (let i = 0; i < len; i++) push(out[out.length - dist]);
        }
      }
    }
    return new Uint8Array(out);
  }

  // Builds the share link. Compressed (#z=) when the browser supports it, plain (#w=) otherwise.
  async function makeUrl(items, kind, result) {
    const data = { v: 1, k: kind || '', i: items.slice(0, MAX_ITEMS).map((s) => String(s).slice(0, MAX_LEN)) };
    if (Number.isInteger(result) && result >= 0 && result < data.i.length) data.r = result;
    const raw = new TextEncoder().encode(JSON.stringify(data));
    const z = await deflate(raw);
    const base = `${location.origin}${location.pathname}`;
    // Only compress what read() can decompress (under MAX_OUT); otherwise use the plain format.
    return z && z.length < raw.length && raw.length <= MAX_OUT ? `${base}#z=${b64url(z)}` : `${base}#w=${b64url(raw)}`;
  }

  // Returns { items, kind, result } if the page was opened from a shared link, else null.
  // Reads both compressed (#z=) and older plain (#w=) links.
  function read() {
    const m = location.hash.match(/^#([wz])=([A-Za-z0-9_-]+)$/);
    if (!m || m[2].length > 24000) return null;
    try {
      const bytes = m[1] === 'z' ? inflate(unb64url(m[2])) : unb64url(m[2]);
      const data = JSON.parse(new TextDecoder().decode(bytes));
      if (!data || !Array.isArray(data.i)) return null;
      const items = data.i.filter((s) => typeof s === 'string')
        .map((s) => s.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, MAX_LEN))
        .filter(Boolean).slice(0, MAX_ITEMS);
      if (!items.length) return null;
      // A shared result only counts if it points at an item and no items were dropped while cleaning.
      const result = (Number.isInteger(data.r) && data.r >= 0 && data.r < items.length && items.length === data.i.length) ? data.r : null;
      return { items, kind: typeof data.k === 'string' ? data.k : '', result };
    } catch (e) { return null; }
    finally { history.replaceState(null, '', location.pathname + location.search); }
  }

  // Native share sheet on phones; copy to clipboard elsewhere. Reports via statusEl.
  async function share(items, kind, title, statusEl, result, text) {
    if (items.length < 2) { statusEl.textContent = 'Add at least two items first.'; return; }
    const url = await makeUrl(items, kind, result);
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

  window.PartyShare = { makeUrl, read, share, resultButton, note, _inflate: inflate };
})();
