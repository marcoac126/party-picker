// Shared "where to get it" links for books (and later, other products).
// Groundwork for affiliate links: today every link is a plain store search.
// When an affiliate program approves the site, set its ID below. Nothing else changes.
// Rules (security + finance agents):
//  - Only turn on an ID after Mark approves and the program is listed in docs/security/third-parties.md.
//  - Affiliate links get rel="sponsored", and the page shows the disclosure automatically.
(function () {
  const CONFIG = {
    bookStore: 'bookshop',   // 'bookshop' (10% commission) or 'amazon' (4.5%)
    bookshopAffiliateId: '', // set after Bookshop.org approval
    amazonTag: ''            // set after Amazon Associates approval, e.g. 'thepartywheel-20'
  };

  const q = (s) => encodeURIComponent(s.trim());

  function bookUrl(title, author) {
    const terms = author ? `${title} ${author}` : title;
    if (CONFIG.bookStore === 'amazon') {
      const tag = CONFIG.amazonTag ? `&tag=${q(CONFIG.amazonTag)}` : '';
      return `https://www.amazon.com/s?k=${q(terms)}&i=stripbooks${tag}`;
    }
    const aff = CONFIG.bookshopAffiliateId ? `&affiliate=${q(CONFIG.bookshopAffiliateId)}` : '';
    return `https://bookshop.org/search?keywords=${q(terms)}${aff}`;
  }

  function isAffiliate() {
    return CONFIG.bookStore === 'amazon' ? !!CONFIG.amazonTag : !!CONFIG.bookshopAffiliateId;
  }

  function disclosure() {
    if (!isAffiliate()) return '';
    return CONFIG.bookStore === 'amazon'
      ? 'As an Amazon Associate I earn from qualifying purchases.'
      : 'We may earn a commission from Bookshop.org when you buy through these links, which supports independent bookstores.';
  }

  // Build an <a> safely (no innerHTML).
  function bookLink(title, author, text) {
    const a = document.createElement('a');
    a.href = bookUrl(title, author);
    a.textContent = text || 'Find this book';
    a.target = '_blank';
    a.rel = isAffiliate() ? 'sponsored noopener' : 'noopener';
    return a;
  }

  window.PartyLinks = { bookUrl, bookLink, isAffiliate, disclosure, storeName: () => CONFIG.bookStore === 'amazon' ? 'Amazon' : 'Bookshop.org' };
})();
