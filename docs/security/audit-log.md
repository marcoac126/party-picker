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
- ~~**Medium:** `hello@thepartywheel.com` contact address not set up.~~ **Fixed 2026-10-09:** Cloudflare Email Routing forwards hello@ to Mark's personal inbox; tested from an outside account.
- Not legal advice. If revenue grows or ads/analytics are added, have the policy reviewed.

## 2026-10-09 — Open items closed (confirmed by Mark)
- Two-factor login on Cloudflare: **done**.
- Two-factor login on GitHub: **done**.
- "Enforce HTTPS" on GitHub Pages: **done**.

**Status:** no open High or Medium findings. Site is ready for affiliate applications (privacy policy, disclosure, working contact email in place). Next full audit: ~2026-11-09.

## 2026-10-09 — Review: "Share this wheel"
**Passed.** The list travels in the link after `#`, which browsers never send to the server, so nothing is stored or logged by us. Incoming shared lists are capped (60 items, 120 characters each), control characters stripped, rendered as plain text only, and the `#` data is cleared from the address bar after loading. Tested with a malicious link containing HTML/script on all three pickers: shown as text, nothing executed. Native share sheet or clipboard only; no third-party share widgets.

## 2026-10-10 — Review: outreach plan
**OK to proceed, with conditions.**
- **High:** no fake accounts or "I just found this" posts. One real identity per platform; always say "I made this" (FTC fake-review rule; Reddit/Pinterest spam rules).
- **Medium:** disclose ownership in every post; once affiliate links are live, say so in the post itself ("I earn a commission from book links"). Check personal accounts for employer details before posting. 2FA on every account; sign up with hello@ or personal email, never work email. Read each community's rules; space posts out; write each fresh; no automation.
- **Process:** any new account (e.g., Pinterest business) gets a security review and entries in third-parties + decisions before creation.
- **Low (done):** shared wheels now state the list came from the sender; link previews use the site image, not the shared list.

## 2026-10-10 — Review: Pinterest business account
**OK with conditions.** Free account, created by Mark on his phone with hello@thepartywheel.com, 8 pins posted by hand, no scheduling tools, no third-party apps, no Pinterest tag (tracking pixel) on the site, no paid promotion. Low risk: nothing new runs on the site or touches visitors.
- **High:** turn on 2FA (authenticator app, not text message) when the account is created; save the backup codes outside the phone. Whoever controls this account can post under the site's name.
- **Medium:** Mark creates the account himself; agents never sign up, log in, or hold the password. Personal phone and personal Pinterest app only; no work device, no work email, no link to a work-connected personal profile.
- **Medium:** before creating it, log the decision in `docs/decisions.md` (process rule from the outreach review). Third-parties row added today, marked not yet created.
- **Medium:** decline any prompt to connect other apps, ad accounts, or a Pinterest tag. Adding any of these later needs a new security review and a privacy policy update.
- **Medium:** pin text stays honest. "Free · No sign-up" is true today; if ads or affiliate links go live, re-check the wording, and say so on pins linking to pages with affiliate links.
- **Low:** pin links use only the site's own preset parameters (e.g., `?style=holiday`). No shared-wheel `#` links in pins, no URL shorteners.
- **Website claim: OK, use the DNS TXT record.** Pinterest offers an HTML meta tag, an uploaded file, or a DNS TXT record. TXT matches how GitHub and Search Console were verified, needs no code change, and keeps it in Cloudflare where 2FA is on. Mark adds it himself in Cloudflare DNS and leaves it in place (removing it can unclaim the site). The value is not a secret. Claiming adds no scripts and collects no visitor data.
- **Monthly audit:** check 2FA still on, no connected apps, pin count and wording.

## 2026-10-10 — Review: Christmas movie + White Elephant pages
Scope: `christmas-movie-picker/` (index.html, movies.js), `white-elephant-gift-ideas/` (index.html, gifts.js), new `movieLinks` / `giftLinks` / `makeList` in `assets/links.js`. Not pushed yet.

**Verdict: OK to publish once Mark approves and the Low process item is done. No High or Medium findings.**

**Medium (before an Amazon tag is ever set, not before launch)**
- **Affiliate disclosure sits far from the gift links.** On the gift page, the "Shop this idea on Amazon" link appears in the result box under the wheel, but the disclosure line is at the bottom of the controls section. The FTC wants the disclosure close to the link, not a scroll away. Fix: when the Amazon tag goes in, also show the disclosure line inside the result box (same for the movie page's Amazon link). Not needed today because no tag is set.
- **Affiliate disclosure page only mentions books and games.** "Plain links that help you find a book or game" no longer covers movies or gift ideas. Fix: update wording to cover movies and gift ideas at the same time the Amazon program is listed there.

**Low**
- **Price bands next to an Amazon link.** "Usually $10 to $25" beside "Shop this idea on Amazon" could look like an Amazon price. Amazon's policies only allow showing prices pulled from Amazon's own data feed. Fix: before applying to Amazon, reword to "Typical budget: $10 to $25" (clearly our estimate for a generic idea, not a product price) and re-check the current policy.
- **Privacy policy is a little out of date.** The "Links to other sites" list doesn't name JustWatch, and "songs, books, games, and names you type in" doesn't mention movie lists or gift filters. Fix: add JustWatch and "movies" to those two sentences and update the date.
- **Preset checks can be fooled by built-in names.** `?moods=constructor` or `?price=constructor` passes the "known values only" check, because plain objects have hidden built-in properties. Harmless (nothing runs, the wheel just comes up empty), but the check isn't strict. Fix: use `Object.hasOwn(moodLabel, x)` (and the same for `vibeLabel` and `PRICES`), including for saved settings.
- **Gift list, office crowd.** "What Do You Meme?" (core deck has crude cards; our own text calls it an "Adult party favorite"), Toilet golf (bathroom humor), and two alcohol items (Electric wine opener, Cocktail smoker kit) may be awkward at work or family exchanges with kids. Nothing explicit, and nothing on Amazon's restricted list for Associates links. Fix (marketing's call): swap What Do You Meme? for a family-safe game, or add a "Keep it office-friendly" filter that hides these.
- **Process: no decision entry for these two pages.** `docs/marketing/keywords.md` still lists White elephant as "Later". Fix: coordinator logs the decision in `docs/decisions.md` and Mark approves before pushing.

**Passed**
- Outbound links are plain `<a>` links only: JustWatch search, YouTube search, Amazon search. Search text is URL-encoded. All open in a new tab with `rel="noopener"`.
- No new scripts, embeds, fonts, images, or trackers. Only the site's own JS files load.
- All list text (built-in, own list, shared list) is shown with `textContent`, never as HTML. The one `insertAdjacentHTML` is a fixed sentence with no user text in it. Movie page reuses the already-reviewed `PartyShare` (capped, plain text, # cleared). Gift page has no share or free-text input.
- Query-string presets are filtered against known values (see the Low item above for the one gap); the movie page's own-list text is never read from the query string.
- localStorage reads and writes are wrapped in try/catch on both pages, so private browsing and blocked storage don't break the page.
- Affiliate logic is correct once a tag is set: Amazon movie and gift links pick up `&tag=`, get `rel="sponsored noopener"`, `isAffiliate()` turns true, and the disclosure includes Amazon's required sentence: "As an Amazon Associate I earn from qualifying purchases." No tag is set today, so links are plain and no disclosure shows, which is correct.
- Family/Animated movie moods contain only G/PG titles, matching the page's claim that they leave out PG-13 and R picks.
- JustWatch added to `docs/security/third-parties.md` as a plain outbound link (no account, no script).

Sources: [Amazon Associates Program Policies, price display rule (summary)](https://conductatlas.com/platform/amazon-associates/amazon-associates-program-policies/provision/CA-P-064489/price-display-requires-api-feed-or-amazon-served-link/). Re-check against Amazon's own Program Policies page at application time.

## 2026-10-11 — Review: "Share this result" + compressed share links (`assets/share.js`, not pushed)

**Verdict: OK to push once Mark approves. No High findings. One Medium (privacy policy wording) should go out in the same push.** This was a code read only. I didn't run anything; the coordinator's fuzz and round-trip tests cover runtime behavior.

**Medium**
- **Privacy policy doesn't mention share links.** It says lists "are never sent to us or anyone else," but Share puts the whole list (and now the winning pick) inside the link, so anyone the link reaches can read it, including the chat app it passes through. The "never sent to us" part is still true, because browsers don't send the part after `#` to the host. Fix: add one sentence under "Your lists stay on your device," for example: "If you use Share, your list (and the winning pick, if you share a result) is packed into the link itself. Anyone with the link can see it. We never receive it." Then update the date.

**Low**
- **No length cap before decoding.** Output is capped at 16 KB, but the input isn't. A very long crafted link made of thousands of tiny compressed blocks could keep the tab busy for a moment. It always finishes and only affects whoever opens that link. Fix: in `read()`, return null if `m[2].length > 24000` before decoding (covers both `#z` and `#w`).
- **The biggest legitimate lists can exceed the 16 KB cap.** 60 items × 120 characters of non-English text or emoji can be more than 16 KB once encoded, so `makeUrl` would build a `#z` link that `read()` rejects. Fix: in `makeUrl`, fall back to `#w` (or warn) when the raw data is over `MAX_OUT`, or raise `MAX_OUT` to 32 KB.
- **A failed decode leaves the `#` data in the address bar.** `replaceState` only runs on success. This is harmless and just cosmetic. Fix: clear the `#` in `finally`.

**Passed**
- Inflate can't loop forever. Every loop step either reads input bits (and throws when input runs out) or writes output (capped at 16 KB). Repeat counts top out at 138, and overshooting the declared length is rejected. All-zero code lengths throw after 15 bits. Long matches are bounded by the output cap. Distances past the start of the output, length symbols 286–287, and distance symbols 30–31 all throw. Lookups stay inside the symbol table even for malformed (over- or under-full) codes, so bad data can't cause a crash.
- Memory: output is at most 16,384 entries, and the code-length tables are at most about 450 entries.
- JSON.parse can't change built-in object behavior (prototype pollution). A `__proto__` key becomes a plain property of that one object. Only `i`, `k`, and `r` are read, each with a type check. `k` is only compared to `'hosts'`.
- Shared text never reaches HTML. Items go to textareas, `textContent`, and canvas `fillText`. `note()` returns one of two fixed sentences, so the `insertAdjacentHTML` calls still contain no user text. `land()` re-checks the index range, and pages only call it when the list length matches.
- Outgoing share text ("The wheel landed on: …") goes only to the native share sheet or clipboard, as plain text.
- No new third-party code. `CompressionStream` is built into the browser, and the decoder is our own code.
