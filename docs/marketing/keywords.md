# Keywords & Page Priorities

Last updated: 2026-10-31 (first Search Console data)

The table below is the original 10/09 research, scored on competition only. Where we now have real data, the "2026-10-31 first data" section overrides it.

## 2026-10-31 first data

Source: Search Console, last 28 days (Oct 8 – Oct 29). Totals: **29 clicks, 259 impressions, ~11% CTR**. Mobile 21 clicks / 147 impressions (pos 4.1); desktop 8 / 111 (pos 10.8). Numbers are small. Treat them as direction, not proof.

### Per page
| Page | Clicks | Impr. | CTR | Avg pos. | Read |
|---|---|---|---|---|---|
| /book-club-picker/ | 27 | 222 | 12.2% | 4.9 | **Working.** 93% of all clicks. Position improving (daily avg ~2–3 since 10/22) |
| /karaoke-song-picker/ | 1 | 27 | 3.7% | 21.0 | **Not working yet.** Page 2–3; "random karaoke song generator" at pos ~52 |
| / (home) | 1 | 7 | 14.3% | 5.1 | Too little data |
| /party-game-picker/ | 0 | 9 | 0% | 13.4 | Too little data |
| /white-elephant-gift-ideas/ | 0 | 5 | 0% | 6.2 | Too little data; season hasn't started |
| /about/ | 0 | 5 | 0% | 4.0 | n/a |
| /christmas-movie-picker/ | — | — | — | — | No impressions. Likely not indexed (see Indexing) |

### Top queries (all go to book club unless noted)
| Query | Clicks | Impr. | Pos. | Note |
|---|---|---|---|---|
| random book generator | 0 | 39 | 3.9 | **Biggest single query, 0 clicks.** Title doesn't say "random book generator" |
| random books generator | 0 | 5 | 3.8 | Same intent |
| random book picker | 1 | 4 | 5.0 | |
| book randomizer | 0 | 4 | 2.3 | |
| book club book picker | 0 | 4 | 6.5 | Our original target phrase. Low volume so far |
| book picker wheel / wheel of books / random book selector / book club book generator | 0 | 1–2 each | 1–6 | Same intent family |
| book club generator | 0 | 2 | 41 | |
| karaoke random song generator | 0 | 5 | 20.2 | Karaoke page |
| random karaoke song generator | 0 | 4 | 51.8 | Karaoke page |
| karaoke wheel | 1 | 1 | 5.0 | Karaoke page |
| sorteio de livros para ler (PT) | 1 | 4 | 5.3 | Spanish/Portuguese, see below |
| libro al azar / libro aleatorio / ruleta de libros / rueda de libros (ES) | 1 | 6 | 1–4 | |

Query rows add up to only 5 of 29 clicks. Google hides low-volume queries, so most book club clicks come from queries we can't see.

**What changed vs. the 10/09 guesses:** the real demand is "random book generator / picker" (readers wanting any random book), not "book club book picker wheel". Book club stays the page; the title should name both.

### Where the clicks come from
- US 9 clicks / 129 impr. Non-US 20 clicks (Brazil 5, Spain 4, Italy 4, UK 2, others 1 each).
- **About 70% of clicks are outside the US.** This matters for money: Bookshop.org affiliate is US/UK only, and display-ad pay per visitor is much lower outside the US. Clicks are real but worth less than the count suggests.
- Spanish/Portuguese queries (~11 impressions, 2 clicks): **note only.** Too small to justify a translated page now. Revisit if they pass ~100 impressions/month.

### Indexing (Search Console, as of 10/22)
- 6 indexed, 11 not. Indexed count has been flat at 6 since 10/09.
- **Page with redirect (3)** and **Alternate page with proper canonical (3):** normal. These are URL variants (http/www/no-slash or ?params) pointing to the real page. No action.
- **Discovered – currently not indexed (5):** sitemap has 11 URLs, and the 6 with impressions are home, karaoke, book club, party game, about, white elephant. So the 5 are most likely privacy, affiliate-disclosure, **christmas-movie-picker**, **holiday-wheels**, **make-your-own-wheel** (inferred, not confirmed in the export; check in URL Inspection). Privacy/disclosure don't matter. **Christmas movie picker does:** its season peaks late Nov–Dec.
- Action: URL Inspection → Request indexing for /christmas-movie-picker/ (then /holiday-wheels/, /make-your-own-wheel/). Add a visible link to the Christmas movie picker from the book club page, since that's the page Google crawls most.

### Score changes
| Page | Old score | New score | Why |
|---|---|---|---|
| Book club picker | Build now | **Optimize now** | Only page earning clicks; title/meta change to capture "random book generator" |
| Karaoke song picker | Build now | **Hold** | Page 2–3 after 3 weeks. Don't add more karaoke pages until it reaches page 1 for one phrase |
| Christmas movie picker | Build now | **Get indexed now** | Built but invisible to Google; seasonal deadline mid-Nov |
| Spanish/Portuguese book picker | — | **Skip (note only)** | ~11 impressions |

| Page | Target phrases | Who ranks now | Money path | Score |
|---|---|---|---|---|
| Karaoke song picker | karaoke song picker wheel, random karaoke song generator | No dedicated wheel tools found. Results are a Chrome extension, a karaoke app blog, and articles | Ads + karaoke machines/mics (~3% commission) | **Build now** |
| Book club picker | book club book picker wheel, how to pick a book club book | No tools found, only forum threads and advice articles | Ads + books and book club gifts | **Build now** |
| Party game picker | party game picker wheel, game night spinner | Not checked yet | Ads + board games | **Build now (verify first)** |
| White elephant / Secret Santa | white elephant randomizer | Strong, established sites (drawnames, secretsanta.com) | Gift guides (affiliate) | **Later** |
| Movie night picker | movie night picker wheel | Not checked yet | Ads, little affiliate fit | **Later** |

## Competitor notes
- **Wheel of Names:** polished and feature-rich, with 65 languages, cloud saves, sharing, and streaming support. It reports about 462M spins in 2026 and is funded by display ads. Not low quality.
- **Picker Wheel:** also polished. Free with ads, plus a paid Premium plan. Its themed wheels are generic (teams, yes/no, numbers, NBA). It has no party themes.
- **Gap:** neither site has pre-filled party wheels such as song lists, book club, or game night. Compete on themes, not on general wheel features.

## Measurement
- 2026-10-09: Google Search Console live for thepartywheel.com, sitemap submitted (home, karaoke, book club). First review target: ~2026-10-23 (queries, impressions, clicks per page). Replace guessed demand above with real numbers.
- 2026-10-09: Party game picker live (/party-game-picker/). Target phrases: "party game picker", "what game should we play", "party games for large groups", "games with no supplies". Watch these in the Oct 23 review.
- 2026-10-09: Seasonal push live: Holiday karaoke ("christmas karaoke songs", "christmas karaoke song picker"), Holiday party games ("holiday party games for adults", "office christmas party games", "white elephant"). Book club: "banned books for book club" via Frequently challenged genre. Share links added for word-of-mouth. Track all in Oct 23 review.

## Holiday pages (researched 2026-10-10, target: indexed by mid-November)

Demand is still not verified (no volume tool yet). These searches are seasonal and should peak in late November and December. Check Search Console impressions weekly from submission through Dec 20.

| Page | Slug | Target phrases | Who ranks now | Money path | Score |
|---|---|---|---|---|---|
| Christmas movie picker | /christmas-movie-picker/ | christmas movie picker, random christmas movie generator, what christmas movie should I watch, christmas movie wheel | **Weak.** No dedicated wheel tool found. Results are a general movie-generator blog (AhaSlides), Rosebud AI blog posts, a forum flowchart, voting brackets, and several spam or hijacked domains | Ads now; Amazon rent/buy links later (small commissions) | **Build now** |
| White elephant gift ideas | /white-elephant-gift-ideas/ | white elephant gift ideas, white elephant gifts under 25 / under 20 / under 10, funny white elephant gifts | **Okay at listicles, weak at tools.** BestReviews, secretsanta.com blog, PODS blog, and mom blogs rank with long lists. Many results are spam or hijacked domains. No spin-for-an-idea tool found (only an app listing) | Amazon affiliate (main path) + ads | **Build now** (best affiliate fit on the site) |

Notes:
- The gift idea page is a different intent from "white elephant randomizer" (drawing order), which strong sites own. Do not target the randomizer phrase on this page.
- Christmas movie must-includes: Elf, Home Alone, It's a Wonderful Life, A Christmas Story, Christmas Vacation, Die Hard, Love Actually, The Holiday, The Polar Express, both Grinch films, The Muppet Christmas Carol, Miracle on 34th Street, White Christmas, Klaus, Arthur Christmas, The Nightmare Before Christmas, The Santa Clause, Scrooged, Gremlins, Bad Santa, Violent Night. Keep R-rated titles out of the Family filter.
- Gift categories searchers expect: funny/gag (the "everyone fights over it" gift), cozy (blankets, socks, candles), useful gadgets (tumblers, rechargeable lighters, phone stands), food and drink (hot sauce sets, cocoa, snacks), and party games. Price tiers people search: under $10, under $20, under $25, under $50.
- Pinterest angles: "Can't agree on a Christmas movie? Spin for one" (tall pin with the wheel and mood labels); "White elephant gifts people will actually steal, under $25" (price tier in big text).
- Disclosure: the gift page needs an affiliate disclosure before the Amazon tag goes live (security review).
