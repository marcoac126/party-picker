# Decisions Log

| Date | Decision | Why |
|---|---|---|
| 2026-10-09 | Niche: party/gathering picker tools (spin-the-wheel) | Cheap to build, clear search demand, natural affiliate tie-ins |
| 2026-10-09 | Build coordinator, finance, and marketing agents first | Plan money and market fit before building the site |
| 2026-10-09 | Minimal spend until proof of concept, then grow from revenue | Keep risk low |
| 2026-10-09 | Paid ads rejected for Phase 1 | Each paid visitor costs ~$0.50–$1.60 and earns ~$0.006 (finance review) |
| 2026-10-09 | Added security agent (security + process auditor) | Protect accounts and visitors, and confirm the team follows its own rules |
| 2026-10-09 | Finance agent now handles tax set-aside (25% default) | Avoid tax surprises once revenue starts |
| 2026-10-09 | Hosting: public GitHub repo + GitHub Pages (free) | Zero cost, one fewer account than Cloudflare |
| 2026-10-09 | Added developer agent; first page is the karaoke song picker | Highest-ranked "build now" page with no dedicated competitor |
| 2026-10-09 | Use built-in phone fonts, no web font downloads | Faster pages, no third-party font requests; Mark declined the font download |
| 2026-10-09 | Karaoke picker: decade + style dropdowns, random 12 dealt from a ~180-song library, own list collapsed | Fresh wheel every visit and more options without a busy page (Mark's request) |
| 2026-10-09 | Added weekly "Current hits" from Apple Music's free top-songs feed (explicit songs excluded) | Keeps the picker current at $0; Billboard has no free feed and scraping it isn't allowed |
| 2026-10-09 | Built book club picker: next book (club list or ~90 popular picks by genre) + who-hosts mode | Second "build now" page; host rotation adds a reason to return monthly |
| 2026-10-09 | Bought thepartywheel.com ($10.46/yr, Cloudflare); site renamed "The Party Wheel" | partypicker.com taken; broad name fits every picker; finance-approved registrar with flat renewal |
| 2026-10-09 | Book club redesign: Suggested vs club-list switch, multi-genre chips, weekly "New & popular" (Apple Books), book links ready for affiliates | Mark's request; clearer choices and groundwork for revenue |
| 2026-10-09 | Default book store for links: Bookshop.org (search links, no affiliate yet) | Pays 10% vs Amazon's 4.5% on books and has no 3-sales-in-180-days rule; Amazon stays a one-line switch |
| 2026-10-09 | Added UX/UI agent; book links now: Goodreads reviews, Bookshop.org, Libro.fm visible + Amazon, Audible, library under "More"; list rows use an Options toggle | Book-club feedback (Goodreads); UX rule of 3 visible choices; finance join order: Bookshop + Libro.fm now, Amazon/Audible after traffic |
| 2026-10-09 | Library link uses OverDrive (Libby), not WorldCat | WorldCat showed visitors rate-limit errors; OverDrive covers ebook/audiobook borrowing most clubs use (Mark's call) |
| 2026-10-09 | Google Search Console set up (Domain property) and sitemap submitted | Gets the site indexed; first real demand data for marketing in ~2 weeks |
| 2026-10-09 | Published privacy policy and affiliate disclosure (no affiliate links yet), linked in every footer | Lists stored on device + Search Console already in use; affiliate programs check for these when reviewing applications |
| 2026-10-09 | Built party game picker: group size + kind-of-game chips, suggested vs "games we own", quick rules for free games, how-to video + Amazon link for card/board games | Third "build now" page; Amazon is the main board-game affiliate (3% on toys); Target skipped (toys pay 0–1%) |
| 2026-10-09 | Applied to Bookshop.org affiliates (ID 129730, shop: bookshop.org/shop/thepartywheel) | First revenue channel; switch links on only after verification + confirmed link format |
| 2026-10-09 | Added "Frequently challenged" book genre (ALA most-challenged titles, neutral framing) | Popular book club theme; strong discussion value; good Bookshop.org fit |
| 2026-10-09 | Added Holiday karaoke style (25 classics) and Holiday party occasion for games (7 holiday games + 12 crowd-pleasers) | Nov–Dec is peak party and gift season; pages need to be indexed by mid-November |
| 2026-10-09 | Added "Share this wheel" to all pickers (list packed into the link, no server storage) | Word-of-mouth growth: every shared wheel brings a new visitor; keeps the no-data privacy promise |
| 2026-10-09 | Karaoke library expanded from ~180 to 346 regular songs (+25 holiday); every decade + style has 12+ | Mark noticed thin categories (e.g. 2010s R&B had 3); a full wheel needs 12 |
| 2026-10-10 | Store searches now use per-store wording (clean punctuation, drop subtitles, first author's last name; Libro.fm title only; Amazon full author). Added hidden /tools/link-test/ page | Mark saw "no results" with some title+author searches; stores can't be auto-tested, so Mark tap-tests and we tune per store |
| 2026-10-10 | Per-store search wording confirmed: all 8 test books × 6 stores returned the right results on Mark's phone | Keep current SEARCH_STYLE; re-run /tools/link-test/ if a store changes its search |
| 2026-10-10 | Team meeting on outreach: proceed with conditions. Pinterest first (brand account, after security review); Reddit/Facebook as personal accounts, "I built this" disclosure, after Bookshop approval for the big posts. Libro.fm: apply now. Amazon: apply early–mid Nov after the 10/23 review. | Marketing, security, and finance agreed; outreach is for learning + holiday timing, revenue is small until affiliates are live |
| 2026-10-10 | Added link-preview image and tags to all pages; shared wheels now say the list came from whoever sent the link | Outreach readiness (marketing) and share-feature misuse mitigation (security) |
| 2026-10-10 | Headlines lead with freshness + ready-made, not counts (titles, descriptions, intros, home subtitles); exact counts stay in status lines; bestseller update date shown | Mark's concern that counts read small; UX + marketing agreed; truth guardrail: only weekly charts are called current |
