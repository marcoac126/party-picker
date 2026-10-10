// Shared "where to get it" links for books (and later, other products).
// Every link is a plain store search today. When an affiliate program approves the
// site, fill in its ID below. Nothing else needs to change.
// Rules (security + finance agents):
//  - Only fill in an ID after Mark approves and the program is listed in docs/security/third-parties.md.
//  - Confirm each program's exact link format when approved; the parameter names below are placeholders
//    except Amazon's "tag", which is standard.
//  - Links with an ID get rel="sponsored", and pages show the disclosure automatically.
//  - Plain links only: no store widgets or tracking scripts.
(function () {
  const IDS = {
    bookshop: '', // Bookshop.org affiliate ID (10% on books)
    librofm: '',  // Libro.fm affiliate code (10% audiobooks, 30% new memberships)
    amazon: ''    // Amazon Associates tag, e.g. 'thepartywheel-20' (4.5% books; also used for Audible)
  };

  const q = (s) => encodeURIComponent(s.trim());

  // Each store: what the link does, store name, URL builder, affiliate check.
  const STORES = {
    goodreads: { action: 'Read reviews', name: 'Goodreads',
      url: (t) => `https://www.goodreads.com/search?q=${q(t)}`, aff: () => false },
    bookshop: { action: 'Buy', name: 'Bookshop.org',
      url: (t) => `https://bookshop.org/search?keywords=${q(t)}` + (IDS.bookshop ? `&affiliate=${q(IDS.bookshop)}` : ''),
      aff: () => !!IDS.bookshop },
    librofm: { action: 'Listen', name: 'Libro.fm',
      url: (t) => `https://libro.fm/search?q=${q(t)}` + (IDS.librofm ? `&ref=${q(IDS.librofm)}` : ''),
      aff: () => !!IDS.librofm },
    amazon: { action: 'Buy', name: 'Amazon',
      url: (t) => `https://www.amazon.com/s?k=${q(t)}&i=stripbooks` + (IDS.amazon ? `&tag=${q(IDS.amazon)}` : ''),
      aff: () => !!IDS.amazon },
    audible: { action: 'Listen', name: 'Audible',
      url: (t) => `https://www.audible.com/search?keywords=${q(t)}` + (IDS.amazon ? `&tag=${q(IDS.amazon)}` : ''),
      aff: () => !!IDS.amazon },
    library: { action: 'Borrow', name: 'your library',
      url: (t) => `https://www.overdrive.com/search?q=${q(t)}`, aff: () => false } // OverDrive (Libby). WorldCat rate-limited visitors (2026-10-09)
  };

  // UX rule: three visible choices labelled by task, the rest under "More".
  const PRIMARY = [['goodreads', 'Read reviews on Goodreads'], ['bookshop', 'Buy at Bookshop.org'], ['librofm', 'Listen on Libro.fm']];
  const MORE = [['amazon', 'Amazon'], ['audible', 'Audible'], ['library', 'Find at your library']];

  function link(storeId, title, author, text) {
    const s = STORES[storeId];
    const a = document.createElement('a');
    a.href = s.url(author ? `${title} ${author}` : title);
    a.textContent = text || `${s.action} on ${s.name}`;
    a.target = '_blank';
    a.rel = s.aff() ? 'sponsored noopener' : 'noopener';
    return a;
  }

  // Primary links (one per line) plus a compact "More" row.
  function bookLinks(title, author) {
    const wrap = document.createElement('div');
    wrap.className = 'store-links';
    const main = document.createElement('ul');
    main.className = 'store-main';
    PRIMARY.forEach(([id, text]) => {
      const li = document.createElement('li');
      li.append(link(id, title, author, text));
      main.append(li);
    });
    const more = document.createElement('p');
    more.className = 'store-more';
    const lbl = document.createElement('span'); lbl.textContent = 'More:';
    more.append(lbl);
    MORE.forEach(([id, text]) => more.append(link(id, title, author, text)));
    wrap.append(main, more);
    return wrap;
  }

  function isAffiliate() { return Object.values(STORES).some((s) => s.aff()); }

  function disclosure() {
    const parts = [];
    if (IDS.amazon) parts.push('As an Amazon Associate I earn from qualifying purchases.');
    const others = ['bookshop', 'librofm'].filter((id) => STORES[id].aff()).map((id) => STORES[id].name);
    if (others.length) parts.push(`We may earn a commission when you buy through ${others.join(' or ')} links, at no extra cost to you.`);
    return parts.join(' ');
  }

  window.PartyLinks = { bookLinks, link, isAffiliate, disclosure };
})();
