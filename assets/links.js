// Shared "where to get it" links for books (and later, other products).
// Links are plain store searches unless an affiliate program is switched on below.
// Bookshop: /a/<id>/<isbn> (documented by Bookshop) when an ISBN is known, else a plain search.
// Libro.fm: Awin deep link (documented by Awin). Amazon: standard "tag".
// Rules (security + finance agents):
//  - Only fill in an ID after Mark approves and the program is listed in docs/security/third-parties.md.
//  - Use only link formats the program documents.
//  - Links with an ID get rel="sponsored", and pages show the disclosure automatically.
//  - Plain links only: no store widgets or tracking scripts.
(function () {
  // Preview switch for the hidden /tools/link-test/ page only: shows affiliate links before they go live.
  const PREVIEW = window.PARTY_AFF_PREVIEW || {};
  const IDS = {
    bookshop: '129730', // Bookshop.org affiliate ID (10% on books). Live 2026-10-14 after tap test + security re-check
    librofm: '',  // Set to 'awin' once Libro.fm approves us on Awin (10% audiobooks, 30% new memberships)
    amazon: ''    // Amazon Associates tag, e.g. 'thepartywheel-20' (4.5% books; also used for Audible)
  };
  Object.keys(IDS).forEach((k) => { if (typeof PREVIEW[k] === 'string' && !IDS[k]) IDS[k] = PREVIEW[k]; });

  const q = (s) => encodeURIComponent(s.trim());

  // Awin (network for Libro.fm). Publisher ID is public: it appears in every affiliate link.
  // Link format per Awin: https://www.awin1.com/cread.php?awinmid=<advertiser>&awinaffid=<publisher>&ued=<encoded destination>
  const AWIN = { publisher: '3121688', librofm: '25361' };
  const awin = (mid, dest) => `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN.publisher}&ued=${encodeURIComponent(dest)}`;

  // ---- Search wording per store ----
  // Store searches are picky in different ways (curly apostrophes, subtitles,
  // co-authors, initials). Each store gets the wording that works best for it.
  // Tune SEARCH_STYLE after tap-testing on /tools/link-test/.
  const SEARCH_STYLE = {
    goodreads: 'title+last',   // title + first author's last name
    bookshop:  'title+last',
    librofm:   'title',        // audiobook titles match on their own; author wording varies by narrator listing
    amazon:    'title+author', // Amazon's search is forgiving
    audible:   'title+last',
    library:   'title+last'
  };

  function cleanText(s) {
    return String(s || '')
      .replace(/[\u2018\u2019\u02BC]/g, "'").replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, ' ').replace(/[&,;!?…]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function cleanTitle(t) {
    // Drop subtitles and bracketed extras: "Fourth Wing (Empyrean 1)" -> "Fourth Wing"
    return cleanText(String(t || '').replace(/\s*[(\[].*?[)\]]\s*/g, ' ').split(/:\s/)[0]);
  }
  function firstAuthor(a) {
    return cleanText(String(a || '').split(/\s+(?:&|and|ft\.?|feat\.?|featuring|with)\s+|,\s*/i)[0]);
  }
  function lastName(a) {
    const words = firstAuthor(a).split(' ').filter((w) => !/^(jr\.?|sr\.?|ii|iii|iv)$/i.test(w));
    return words.length ? words[words.length - 1] : '';
  }
  // Key for the ISBN list (book-club-picker/isbns.js). Must match scripts/lookup-isbns.mjs.
  function bookKey(title, author) { return `${cleanTitle(title)}|${lastName(author)}`.toLowerCase(); }
  function isbnFor(title, author) {
    const v = (window.BOOK_ISBNS || {})[bookKey(title, author)];
    return /^97[89]\d{10}$/.test(v || '') ? v : '';
  }

  function searchTerms(storeId, title, author) {
    const t = cleanTitle(title);
    switch (SEARCH_STYLE[storeId]) {
      case 'title': return t;
      case 'title+author': return author ? `${t} ${firstAuthor(author)}` : t;
      default: return author ? `${t} ${lastName(author)}` : t;
    }
  }

  // Each store: what the link does, store name, URL builder, affiliate check.
  const STORES = {
    goodreads: { action: 'Read reviews', name: 'Goodreads',
      url: (t) => `https://www.goodreads.com/search?q=${q(t)}`, aff: () => false },
    bookshop: { action: 'Buy', name: 'Bookshop.org',
      // With an affiliate ID and a known ISBN: Bookshop's documented format /a/<id>/<isbn> (opens the book).
      // Otherwise a plain search (no credit).
      url: (t, isbn) => (IDS.bookshop && isbn) ? `https://bookshop.org/a/${encodeURIComponent(IDS.bookshop)}/${isbn}` : `https://bookshop.org/search?keywords=${q(t)}`,
      sponsored: (isbn) => !!(IDS.bookshop && isbn),
      aff: () => !!IDS.bookshop },
    librofm: { action: 'Listen', name: 'Libro.fm',
      url: (t) => { const dest = `https://libro.fm/search?q=${q(t)}`; return IDS.librofm === 'awin' ? awin(AWIN.librofm, dest) : dest; },
      aff: () => IDS.librofm === 'awin' },
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
    const isbn = storeId === 'bookshop' ? isbnFor(title, author) : '';
    a.href = s.url(searchTerms(storeId, title, author), isbn);
    a.textContent = text || `${s.action} on ${s.name}`;
    a.target = '_blank';
    const sponsored = s.sponsored ? s.sponsored(isbn) : s.aff();
    a.rel = sponsored ? 'sponsored noopener' : 'noopener';
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

  // Games: "how to play" video + store link for card and board games.
  function gameLinks(name, buyable) {
    const wrap = document.createElement('div');
    wrap.className = 'store-links';
    const ul = document.createElement('ul');
    ul.className = 'store-main';
    const add = (a) => { const li = document.createElement('li'); li.append(a); ul.append(li); };
    const yt = document.createElement('a');
    yt.href = `https://www.youtube.com/results?search_query=${q('how to play ' + name)}`;
    yt.textContent = 'Watch how to play';
    yt.target = '_blank'; yt.rel = 'noopener';
    add(yt);
    if (buyable) {
      const a = document.createElement('a');
      a.href = `https://www.amazon.com/s?k=${q(name + ' game')}&i=toys-and-games` + (IDS.amazon ? `&tag=${q(IDS.amazon)}` : '');
      a.textContent = 'Buy on Amazon';
      a.target = '_blank'; a.rel = IDS.amazon ? 'sponsored noopener' : 'noopener';
      add(a);
    }
    wrap.append(ul);
    return wrap;
  }

  function makeList(items) {
    const wrap = document.createElement('div');
    wrap.className = 'store-links';
    const ul = document.createElement('ul');
    ul.className = 'store-main';
    items.forEach(([href, text, sponsored]) => {
      const a = document.createElement('a');
      a.href = href; a.textContent = text; a.target = '_blank';
      a.rel = sponsored ? 'sponsored noopener' : 'noopener';
      const li = document.createElement('li'); li.append(a); ul.append(li);
    });
    wrap.append(ul);
    return wrap;
  }

  // Movies: where to stream (JustWatch search), trailer, and Amazon rent/buy.
  function movieLinks(title, year) {
    const t = cleanText(title);
    const ty = year ? `${t} ${year}` : t;
    return makeList([
      [`https://www.justwatch.com/us/search?q=${q(t)}`, 'Find where to stream it', false],
      [`https://www.youtube.com/results?search_query=${q(ty + ' trailer')}`, 'Watch the trailer', false],
      [`https://www.amazon.com/s?k=${q(ty)}&i=instant-video` + (IDS.amazon ? `&tag=${q(IDS.amazon)}` : ''), 'Rent or buy on Amazon', !!IDS.amazon]
    ]);
  }

  // Gift ideas: one Amazon search per idea.
  function giftLinks(search) {
    return makeList([
      [`https://www.amazon.com/s?k=${q(search)}` + (IDS.amazon ? `&tag=${q(IDS.amazon)}` : ''), 'Shop this idea on Amazon', !!IDS.amazon]
    ]);
  }

  function isAffiliate() { return Object.values(STORES).some((s) => s.aff()); }

  function disclosure() {
    const parts = [];
    if (IDS.amazon) parts.push('As an Amazon Associate I earn from qualifying purchases.');
    if (STORES.bookshop.aff()) parts.push('If you buy a book through a Bookshop.org link, we may earn a commission from Bookshop.org, whose fees support independent bookstores.');
    if (STORES.librofm.aff()) parts.push('We may also earn a commission from Libro.fm links, at no extra cost to you.');
    return parts.join(' ');
  }

  window.PartyLinks = { isbnFor, bookKey, bookLinks, gameLinks, movieLinks, giftLinks, link, isAffiliate, disclosure, searchTerms, STORE_IDS: Object.keys(STORES) };
})();
