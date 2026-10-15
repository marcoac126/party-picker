# Approved Third Parties

| Service | Purpose | Account owner | 2FA on | Approved |
|---|---|---|---|---|
| GitHub | Code and hosting (GitHub Pages) | Mark (personal) | ✅ | 2026-10-09 |
| Apple Music + Apple Books RSS feeds (rss.marketingtools.apple.com) | Weekly current hits + bestseller lists, fetched by GitHub Actions | — (public, no account) | — | 2026-10-09 |
| Claude GitHub App | Lets agents push code | Mark | — | 2026-10-09 (party-picker repo only) |
| Claude | AI agent team | Mark (personal) | — | 2026-10-09 |
| Cloudflare | Domain registrar, DNS, and email forwarding (hello@) for thepartywheel.com | Mark (personal) | ✅ | 2026-10-09 |
| Google Search Console | Search visibility + demand data for thepartywheel.com (Domain property, DNS-verified) | Mark (personal Google) | Google account | 2026-10-09 |
| Bookshop.org Affiliates | Book links (10% commission). Plain links only, documented per-book format `bookshop.org/a/129730/<ISBN>`; no Bookshop widget or script | Mark (hello@thepartywheel.com) | Check if offered (see 2026-10-13 audit) | Approved 2026-10-13, affiliate ID 129730 (public); link format confirmed; links live 2026-10-14 (see audit log) |
| Google Books API (googleapis.com/books/v1/volumes) | Weekly ISBN lookup for book club books so Bookshop links open the right book. Server-side only (GitHub Actions); sends only book title + author last name; no API key, no account; only validated ISBN-13 digits are saved | — (public, no account) | — | 2026-10-13 |
| Pinterest Business (free) | Hand-posted pins linking to thepartywheel.com; website claim via DNS TXT. No Pinterest tag, no connected apps, no paid promotion | Mark (hello@thepartywheel.com) | Required (authenticator app) | Approved 2026-10-10, account not yet created |
| JustWatch (justwatch.com/us/search) | "Find where to stream it" on the Christmas movie picker. Plain outbound search link only: no script, embed, or account | — (public, no account) | — | 2026-10-10 |
| Awin (affiliate network) | Hosts the Libro.fm affiliate program (audiobooks: 10%, new memberships: 30%) | Mark (hello@thepartywheel.com) | Turn on if offered | Publisher account approved 2026-10-12 (publisher ID 3121688, public); Libro.fm (US, advertiser 25361) declined 2026-10-15 (site too new; reapply once there's traffic history); tracked links built but OFF |
| Stripe (Express, via Bookshop.org) | Receives Bookshop.org commission payouts to Mark's bank. Mark entered his own identity, tax, and bank details directly on Stripe; agents never see or handle them | Mark (personal email) | Required (turn on right after setup) | Connected 2026-10-14 |
