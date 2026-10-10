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
    a.href = s.url(searchTerms(storeId, title, author));
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
    const others = ['bookshop', 'librofm'].filter((id) => STORES[id].aff()).map((id) => STORES[id].name);
    if (others.length) parts.push(`We may earn a commission when you buy through ${others.join(' or ')} links, at no extra cost to you.`);
    return parts.join(' ');
  }

  window.PartyLinks = { bookLinks, gameLinks, movieLinks, giftLinks, link, isAffiliate, disclosure, searchTerms, STORE_IDS: Object.keys(STORES) };
})();
