# Security & Process Audit Log

## 2026-10-09 — Baseline audit (pre-build)

**High**
- **Confirm two-factor authentication on GitHub.** The GitHub account will hold the site's code and control what's published. Fix: turn on 2FA with an authenticator app, and save the recovery codes somewhere safe outside GitHub.

**Medium**
- **Keep work and business separate.** Building on a personal phone and personal accounts is correct. Fix: keep it that way for every new account (Google, Amazon, domain), and check whether your employer's outside-employment policy asks you to disclose side businesses.
- **The repo will be public.** Free GitHub Pages hosting needs a public repo, so anyone can see the code. Fix: never put passwords or keys in it. The developer agent will follow this rule.

**Low**
- **Legal pages aren't needed yet.** A privacy policy and affiliate disclosure are required before analytics, ads, or affiliate links go live. Tracked for the pre-launch review.

**Passed**
- No money spent. Budget and decision log match reality.
- Paid ads were reviewed by finance before reaching Mark, and rejected (money gate followed).
- No accounts were created by agents.

## 2026-10-09 — Review: Apple Music top-songs feed (Current hits)

**Verdict: approved, low risk.**
- Read-only public feed, no account or keys. Fetched by GitHub Actions weekly; visitors' browsers never contact Apple.
- **Explicit filter uses an allow-list.** The feed misspells its explicit flag ("Explict"), so a block-list on "Explicit" would have leaked explicit songs. Only songs with no flag or "Clean" are kept. Tested against a sample feed with all spellings.
- Song text is stripped of `<`, `>`, and control characters, length-capped, and rendered as plain text.
- If the feed fails or returns fewer than 5 clean songs, the old list stays live.
- Workflow has write access to this repo's contents only and a 5-minute timeout.
- **Watch:** if Apple changes or retires the feed, the list goes stale but nothing breaks. The monthly audit should check the last update date in `karaoke-song-picker/hits.js`.

## 2026-10-09 — Domain setup: thepartywheel.com

**Passed**
- Domain verified on Mark's GitHub account (TXT record). Blocks anyone else from using it for a GitHub Pages site.
- DNS: 4 GitHub A records + www CNAME, all "DNS only". No wildcard records.
- Site loads over HTTPS at https://thepartywheel.com.
- Registrar: Cloudflare, personal account, WHOIS details redacted, auto-renew on.

**Open (Mark to confirm)**
- Two-factor login on the Cloudflare account. **High** until confirmed: whoever controls the domain controls the site.
- Tick "Enforce HTTPS" in GitHub Pages settings once it's available.

## 2026-10-09 — Review: Apple Books bestseller feed + outbound book links

**Verdict: approved, low risk.**
- Apple Books US top-paid feed: same source, pattern, and safeguards as the Current hits feed (read-only, no keys, plain text, keep-old-list on failure). Filters out kids/YA, comics & manga, erotica, and box sets. Tested against a sample feed.
- Outbound links (`assets/links.js`): store search links only, built from text with URL encoding, opened in a new tab with `rel="noopener"`. No tracking scripts.
- **Affiliate switch-on checklist** (for later): Mark approves → program added to third-parties list → ID set in `assets/links.js` → links automatically get `rel="sponsored"` and the disclosure line appears. Security re-reviews before the change goes live.

## 2026-10-09 — Review: multi-store book links

**Passed.** Six plain search links (Goodreads, Bookshop.org, Libro.fm, Amazon, Audible, OverDrive library search — replaced WorldCat, which showed visitors a rate-limit error). No widgets or third-party scripts; text is URL-encoded; new tab with `rel="noopener"`. No affiliate IDs active, so no disclosure required yet.
**Note:** affiliate parameter names for Bookshop.org and Libro.fm in `assets/links.js` are placeholders. Confirm exact formats from each program's dashboard at approval, and re-review before the change goes live.

## 2026-10-09 — Review: privacy policy, affiliate disclosure, party game picker

**Passed**
- Privacy policy matches what the site actually does: no cookies, no analytics, lists in local storage only, GitHub Pages hosting, Cloudflare DNS, Search Console, Apple feeds fetched server-side.
- Disclosure states no affiliate links today; FTC-style plain-language commitments (random wheel, no paid placement). Footer links on every page.
- Game picker: plain YouTube and Amazon search links, no embeds or scripts.

**Open**
- **Medium:** `hello@thepartywheel.com` is listed as the contact address. Set up free Cloudflare Email Routing to forward it to Mark's personal email, or mail will bounce.
- Not legal advice. If revenue grows or ads/analytics are added, have the policy reviewed.
