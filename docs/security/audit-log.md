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

## 2026-10-13 — Review: Bookshop.org affiliate links + Google Books ISBN lookup (not pushed)
Scope: `scripts/lookup-isbns.mjs`, `.github/workflows/update-hits.yml`, `assets/links.js`, `book-club-picker/index.html`, `tools/link-test/index.html`, `affiliate-disclosure/index.html`, `privacy/index.html`. Code read only; nothing was run.

**Verdict: the code is OK to push now with the Bookshop ID still blank. Don't fill in `IDS.bookshop` until items 1–3 are fixed in the same push.**

**High (blocks switching Bookshop links on)**
1. **Affiliate disclosure page will become false.** It says "None of our links earn us money yet." Once the ID is set, that's an untrue statement on a live page. Fix: replace "Right now" with a list of active programs (Bookshop.org, with date). Bookshop requires affiliates to disclose and suggests: "I am an affiliate of Bookshop.org and I will earn a commission if you click through and make a purchase." Also add movies and gift ideas to "book, game…" (open item from 2026-10-10). Update the date.

**Medium (also fix before switching on)**
2. **Disclosure is a scroll away from the Buy links on the book club page.** `#disclosure` sits at the bottom of the controls. The Buy link shows up in the result box under the wheel and in each book's Options panel, both well above it on a phone. The FTC wants the disclosure close to the link. Fix: add the disclosure line inside the result box when `L.isAffiliate()` is true, as the movie and gift pages already do. Also add it once above the book list (or inside each Options panel).
3. **Privacy policy is out of date.** It says links "may become affiliate links in the future." Fix: say Bookshop.org links are affiliate links. The link carries our ID, not anything about the visitor. Bookshop may use its own cookies on bookshop.org to credit the sale, and we never learn who bought what. Add one line like the Apple sentence: "Book identifiers (ISBNs) come from Google Books, fetched on our side; your browser never contacts Google." Update the date.

**Low**
4. **Link-test page shows live affiliate links with no disclosure.** `/tools/link-test/` is noindex but public, and the preview switch makes its Bookshop links sponsored. Fix: add one line there, e.g. "Bookshop links on this page are affiliate links."
5. **Bookshop account 2FA unknown.** That account will hold payout and tax details. Two-factor authentication (a second code at login) stops someone with a stolen password. Fix: Mark checks Bookshop's account settings and turns on 2FA if offered. If it isn't offered, use a unique password from a password manager. Note the result in third-parties.md.
6. **`new Function` in the Actions script.** It runs a file as code in a job that can push to the repo. That's acceptable today: `books.js` is ours, and `current-books.js` is `JSON.stringify` output of cleaned Apple text, so feed text can't become code. Fix (hardening): read `current-books.js` with the same regex + `JSON.parse` approach `loadExisting()` uses. Keep `new Function` only for the hand-written `books.js`.
7. **Possible wrong-book matches.** Prefix matching (`vt.startsWith(want + ' ')` and the reverse) plus an author last-name check can still pick a different book, or an edition Bookshop doesn't carry. A sponsored link to the wrong product hurts trust. Fix: tap-test the Bookshop column on the link-test page after the first run. Consider a small hand-kept override list for misses and mismatches.
8. **Stale comment.** The `links.js` header still says link formats are "placeholders" except Amazon's. Fix: note that Bookshop's format is confirmed (/a/&lt;id&gt;/&lt;isbn&gt;) and Libro.fm's is Awin's documented format.

**Passed**
- Google Books data can't reach the page as code. Each ISBN is checked as digits only (`^97[89]\d{10}$`) three times: at lookup, when reloading the old file, and in the browser (`isbnFor`). Keys come from our own book data, not from Google. The file is written with `JSON.stringify`. The ISBN only goes into an `href` path, and link text uses `textContent`. Keys always contain `|`, so they can't hit built-in object properties.
- Preview switch: it's only set by an inline script on the hidden test page. Nothing reads it from the URL or the hash. It only fills blank IDs, so it can't override a real one. Its `typeof === 'string'` check also blocks a page element with that id from being mistaken for a setting.
- `rel` is correct. Bookshop links get `sponsored noopener` only when they actually carry our ID (ID set and ISBN known). Search fallbacks have no affiliate parameter and stay plain `noopener`. The old undocumented `&affiliate=` placeholder is gone.
- Disclosure logic: `isAffiliate()` turns true as soon as `IDS.bookshop` is set (`aff()` doesn't depend on ISBNs), and `disclosure()` names Bookshop.org. If some links are plain searches, the page over-discloses, which is the safe direction.
- No Bookshop widget or script. Links are plain `<a>` tags.
- Workflow: the lookup step is `continue-on-error`, capped at 250 lookups with 400 ms pacing, uses no key or secret, and sends only title + author last name. Old results are kept, and entries for books no longer listed are pruned.
- Google Books branding rules apply when Google content is displayed. We only store and use ISBNs (bare identifiers) and show no Google content, so they don't appear to apply. Re-check if we ever show covers or descriptions.
- Google Books API added to `docs/security/third-parties.md`. Bookshop row updated with the confirmed link format.
- Process: Bookshop approval and next steps are logged in `docs/decisions.md` (2026-10-13). Switching on still needs Mark's approval and a tap test.

Sources: [Bookshop.org — affiliate disclosure requirement](https://support.bookshop.org/support/solutions/articles/65000168990-if-i-m-an-affiliate-do-i-have-to-disclose-that-on-my-website-newsletter-or-social-media-posts-); [FTC — Endorsement Guides: What People Are Asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking); [Google Books API branding guidelines](https://developers.google.com/books/branding); [Google Books API Terms](https://developers.google.com/books/terms).

## 2026-10-13 — Incident: ISBN checker hit a disallowed Bookshop path
- **What happened:** to confirm which ISBNs Bookshop carries, `scripts/lookup-isbns.mjs` was set to check each ISBN with a normal Bookshop search, only if robots.txt allowed `/search`. The first run correctly skipped (robots.txt disallows `/search`). A follow-up edit, made to log the robots rules, introduced an ordering bug that bypassed the disallow check. The next run made 300 search requests (1.5 s apart, identified user agent with our contact email). Bookshop refused all of them (HTTP 403). No data was collected and nothing was published.
- **Fix:** Bookshop checking is now hard-disabled in the script (`allowed = false`), and the parser bug is fixed. Re-enabling requires a security review and a method Bookshop allows.
- **Process lesson:** any automated request to a third-party site needs a test of its robots/permission check before it runs live, and edits to that check get re-reviewed.
- **Status:** Bookshop affiliate links stay off. Coordinator to ask Bookshop (via Mark) for a supported way to link titles or search results.

## 2026-10-14 — Re-check before Bookshop links go live
- **Scope:** `assets/links.js` (ID set), book club page, affiliate disclosure, privacy policy.
- **Checked:** affiliate links carry only our ID and the ISBN, nothing about the visitor; marked `rel="sponsored noopener"`; disclosure shows above the book list and in the result card; no third-party script (Bookshop widget not used); page makes no outside requests on load; privacy wording matches how ISBNs were actually found (public catalogs + Bookshop list upload); automated Bookshop checks remain disabled.
- **Result:** pass, no findings. Mark tap-tested links on his phone.

## 2026-10-18 — Test-only exception: Bookshop search widget
- **What:** `tools/link-test/bookshop-widget/` (hidden: noindex, /tools/ disallowed in robots.txt, not linked) loads Bookshop's `widgets.js` search widget, only after a tap, so Mark can see whether widget searches carry our affiliate ID.
- **Why allowed:** test page only, used by Mark; no visitor page loads the script. The no-third-party-scripts rule still applies to every public page.
- **Exit:** remove the test page once the result is known. Any public use of the widget needs a full security review and a privacy policy update first.

## 2026-10-12 — Review: Pinterest RSS auto-pin feed (test)
Scope: `pins/queue.json`, `pins/img/*.jpg` (3 images, viewed), `pins/feeds/holiday.xml`, `scripts/build-pin-feeds.mjs`, `scripts/pins/render.py`, `.github/workflows/pin-feeds.yml`. Not committed yet. Checked pin text against `christmas-movie-picker/` and `white-elephant-gift-ideas/` (pages and data files).

**Verdict: OK to test once the two Medium items are done. This needs a condition change. No High findings.** Pinterest's RSS auto-publish is Pinterest's own feature: no app, no token, no tag, nothing new on the site. That fits the "no connected apps" rule. But it changes who can publish. Until now a pin only went live when Mark posted it. Now any commit to `pins/queue.json` publishes a pin on its date, and agents can push to the repo through the Claude GitHub App.

**Medium (before Mark connects the feed)**
- **Publishing now happens through the repo, so the approval rule needs updating.** The 10/10 conditions said pins are made by hand with no automation, and the coordinator rules say Mark approves anything published. A commit that adds a dated pin is now a publish. Pins can't be pulled back through the feed either: Pinterest doesn't update or delete pins when a feed item changes or is removed, so Mark would have to delete them by hand. Fix (new condition): (1) Pinterest's RSS auto-publish is allowed for this one feed only, connected to "Holiday Party Ideas". (2) Every new or changed pin in `queue.json` gets a security review and Mark's explicit OK *before* it is pushed. Agents never push queue changes on their own. (3) Kill switch: disconnect the feed in Pinterest settings. Removing items from the feed won't remove pins. (4) The monthly audit compares the pins on the board with the queue. Third-party schedulers and the Pinterest API/apps still need their own review.
- **Paperwork isn't done yet.** There's no decision entry for the RSS test, and the Pinterest row in `third-parties.md` still says "Hand-posted pins… no connected apps". This test also has no row in `experiments.md`. Fix: coordinator logs the decision with the condition above. Security updates the Pinterest row to say "hand-posted + Pinterest RSS auto-publish from /pins/feeds/holiday.xml (first-party, no app/token)". Marketing adds the test row with a $0 cap, a stop rule, and an end date.

**Medium (before any affiliate tag goes live, not before the test)**
- **Pins can't be edited by the feed, and "Each idea links to shop it" will turn into affiliate links.** Once the Amazon tag is set, the two white elephant pins (and the movie pin's Amazon link) point to pages with affiliate links. Under the 10/10 condition and FTC guidance, those pins need to say so. Fix: when the tag goes live, Mark edits the already-published pins' descriptions in Pinterest by hand to add a short line ("I earn from qualifying purchases on linked items"). New queued pins for those pages include that line, and the builder refuses pins for affiliate pages without it. The "Free · No sign-up" text baked into the images stays true either way.

**Low**
- **"Only G and PG movies" is a little loose.** Frosty, Charlie Brown, Rudolph, and the other TV specials on the family/animated wheels are TV-rated (TV-G), not MPAA G/PG. No PG-13 or R titles are included, so the spirit is true. Fix: use the page's own wording: "No PG-13 or R picks."
- **The builder doesn't enforce "preset parameters only".** `check()` confirms our domain, HTTPS, and no `#`. It still allows any query string (for example `?utm_source=…` or made-up keys), and it allows a `user@` part before the domain. Fix: allow only known keys per page (`moods`, `price`, `vibes`, `style`) and reject `link.username`/`link.password`.
- **Feed text can contain characters XML forbids.** `esc()` removes control characters but not U+FFFE/U+FFFF or broken surrogate pairs, so a pasted odd character would make the whole feed invalid. This is a breakage risk, not an injection risk. Fix: also strip `[￾￿]` and lone surrogates.
- **Office crowd (carried over from 10/10).** The "Funny" pin links to `?vibes=funny`, which still includes Toilet golf set. What Do You Meme? is already gone. Fix: marketing's call, same as before.
- **Don't commit `scripts/pins/__pycache__/`.** It's a compiled leftover from running the renderer locally, not a secret. Fix: add `__pycache__/` to `.gitignore`.
- **Alt text may not carry over.** Pinterest's RSS import may not use `media:description` as the pin's alt text. Fix: check the first auto-pin, and add alt text by hand in Pinterest if it's missing.
- **Watch:** GitHub turns off scheduled workflows in public repos after 60 days without repo activity. If the site goes quiet, pins will stop going out silently.

**Passed**
- No secrets: no Pinterest login, token, or API is used anywhere. The workflow needs nothing beyond the built-in repo token.
- Workflow scope matches the already-approved list updater: write access to this repo's contents only, 5-minute timeout, commits only `pins/feeds`, and only when the feed changed. Images are never rendered in CI. `render.py` runs locally and escapes headline/subhead (`html.escape`) and wheel labels (`json.dumps`).
- XML injection: every text field is escaped for `& < > "`, and control characters are stripped. Links must be on `https://thepartywheel.com` with no `#`. Image paths must match `/pins/img/<name>.jpg` and the file must exist. The feed validates as well-formed XML. Title and description lengths are capped, and duplicate ids are rejected.
- Date gate works: only the 10/12 pin is in the feed. The 10/15 and 10/18 pins stay out until their date (Central time). The feed is capped at 25 items, well under Pinterest's 200/day limit.
- Pin text checked against the pages: every wheel item and every named example exists in the data, in the right price band (all 8 "under $10" items are `u10`) and the right vibe (all 7 "funny" items are `funny`). "Pick a budget from under $10 to $50" matches the three bands. "Where to stream it" matches the JustWatch link on every movie pick. "Each idea links to shop it" matches the Amazon search link on every gift. "Free, no sign-up" is true today. Preset links (`?moods=family,animated`, `?price=u10`, `?vibes=funny`) are real page presets, checked with `hasOwnProperty`. No `#` links, no shorteners.
- Images: text and a drawn wheel only. No posters, logos, or product photos. Brand names are avoided where possible: "Singing fish" instead of Billy Bass, "Jelly bean dare" instead of BeanBoozled, "Card game" instead of UNO. Movie titles appear as plain text naming the films, which is normal fair reference. Nothing in the images is a problem for an office or a family.
- Public exposure: `queue.json`, the feed, and the images are public on GitHub and the site. They contain only planned marketing copy and publish dates, nothing sensitive.
- Privacy policy, robots, sitemap: no change needed. Pinterest fetching our feed involves no visitor data, and visitors' browsers never contact Pinterest. Leave the feed and images out of the sitemap. Allowing them in `robots.txt` is fine.

Sources: [Pinterest bulk create / auto-publish](https://create.pinterest.com/product-features/bulk-content-creation/); Pinterest Business Community threads on [RSS behavior and limits](https://community.pinterest.biz/t/rss-feed-behavior-and-limitations/44176) (oldest first, 200 pins/day across feeds) and on [RSS pins not updating](https://community.pinterest.biz/t/rss-feed-update-old-pins/798) (feed changes don't update existing pins; delete by hand). These are community posts, not official help pages, so confirm the details on the first test pin.

**Follow-up (coordinator, same day):** Low items fixed before the PR: pin wording now "No PG-13 or R picks"; feed builder allows only the pages' preset settings and rejects `user@` links (tested); `esc()` strips all XML-forbidden characters; `__pycache__/` ignored. Decision, third-parties row, and experiment row added. Still open: Toilet golf in the funny pool (marketing's call); confirm alt text and no-edit/no-delete behavior on the first RSS pin; watch for GitHub pausing the daily workflow after 60 days without repo activity.

## 2026-10-19 — Review: 3 new Pinterest RSS pins + re-dated PR #1 pins
Scope: `pins/queue.json` (branch `pinterest-rss-test`, PR #1, unmerged), new images `pins/img/classic-christmas-movies.jpg`, `office-party-games.jpg`, `white-elephant-25-limit.jpg` (viewed), `docs/marketing/experiments.md` row, `scripts/build-pin-feeds.mjs`, `scripts/pins/render.py`, `.github/workflows/pin-feeds.yml`. Pin copy was checked against `christmas-movie-picker/` (movies.js, index.html), `party-game-picker/` (games.js, index.html), and `white-elephant-gift-ideas/` (gifts.js, index.html).
**Limit of this review:** I had no shell, so I didn't run `git diff` or `node scripts/build-pin-feeds.mjs`. I read the working-tree files instead and traced the builder by hand (details under Passed). I couldn't confirm from history that the only change to the 3 existing pins is their `publish` date.

**Verdict: OK with conditions.** The pin text is true, the links are clean, and the content is office-safe. Nothing new is added: no third party, account, token, or automation. One High item is an account issue, not a pin issue. It must be closed before Mark connects the feed.

**High (before Mark connects the RSS feed)**
- **Pinterest two-factor login isn't confirmed anywhere.** The account exists (experiments.md shows pins posted 10/10 and pins 3–10 scheduled), but the audit log has no confirmation that 2FA is on, and `third-parties.md` still said "account not yet created". Once the feed is connected, whoever gets into the account can post under the site's name, or point the feed somewhere else. Fix: Mark confirms 2FA is on with an authenticator app and the backup codes are saved off the phone. He also confirms that no apps are connected under Settings. Security then records it here.

**Low**
- **Holiday Inn is still on the classic wheel the pin links to.** Marketing was right to leave it off the pin image, but `?moods=classic` has exactly 12 titles and shows all of them. So everyone who lands from this pin sees Holiday Inn, whose blackface "Abraham" number is the reason it was left off. "12 old favorites" counts it too. The pin text itself is fine. Fix (marketing/coordinator's call): swap Holiday Inn for another pre-1960 classic so the mood keeps 12 (for example The Bells of St. Mary's or The Lemon Drop Kid). Or add a note to its summary line. Either way, the "12" claim stays true.
- **"Work for 13 or more people" is a little open-ended.** All 11 games really do pass the page's "13 or more" filter (minimum ≤ 99, maximum ≥ 13). But most of them top out at 15–20 players in our data (White Elephant Gift Swap goes to 30). It matches the page's own label, so it's not untrue. Optional: change it to "13 to 20+ people", or "big groups (play in teams)".
- **The local image renderer doesn't check two fields.** `render.py` puts `accent` straight into CSS. It also puts the wheel labels into a `<script>` with `json.dumps`, which doesn't escape `</script>`. This only runs on an agent's machine, never in CI or on the site, and today's values are safe. Fix (developer): reject an `accent` that isn't `#RRGGBB`, and escape `<` in the labels (`json.dumps(...).replace('<', '\\u003c')`).
- **Paperwork.** The decision log has no 10/19 entry for adding 3 pins (6 total) and re-dating. `experiments.md` still says "images still to render", but all 3 images exist. Fix: the coordinator logs the change once Mark approves the merge, and marketing updates the row.
- **Timing.** Pin 1 is dated 10/20, and the workflow runs at about 7:52 AM Central. If the merge or the feed connection slips past 10/20, every pin that's already due goes into the feed on the first run. That brings back the same-morning cluster. Fix: re-date before merging if it slips. Any new dates count as a changed pin under the 10/12 rule, so they need a quick re-review.

**Passed**
- **Classic movies** (`?moods=classic`): `classic` is an accepted mood (`has(moodLabel, x)`, own-property check). The pool is exactly 12 classics, so "12 classics"/"12 old favorites" is true and all 12 show on the wheel. All 5 named films and all 8 wheel labels (Wonderful Life, Miracle on 34th, White Christmas, Christmas Story, Bishop's Wife, Scrooge, St. Louis, Shop Around) are `classic` entries, and the labels match the data's short labels. "One-line summary plus where to stream, rent, or buy" matches the summary line, the JustWatch link, and Amazon's "Rent or buy" link.
- **Office party games** (`?occasion=holiday&players=13-99&types=free,paper`): every value is in the page's select options or type list. The pool is exactly 11 holiday-tagged free/paper games, so "11 holiday games" is true. All 6 named games and all 7 wheel labels are in that pool ("Two Truths" is shortened only on the image). "No board games to buy" is true (only no-supply and pen-and-paper types are on), and "quick rules" is true (those types show the rules line). Nothing in the pool is an issue for an office.
- **White elephant $25 limit** (`?price=u25&vibes=cozy,useful,food`): `u25` and all 3 vibes pass the own-property check. The pool is 9 ideas. All 5 named ideas and all 8 wheel labels are `u25` and in cozy, useful, or food. The "$10 to $25" band and "Prices vary, so check before you buy" match the page's band and its result note. "$20 or $25 limit" matches the page's own guide. "Each idea links to shop it" matches the Amazon search link. The funny vibe is off, so Toilet golf is excluded. The alcohol items are `u50`, so they're excluded too. That makes this the most office-friendly gift pin so far.
- **Links:** all 6 are `https://thepartywheel.com/...`. Each uses only its page's own preset keys. No `#`, no shorteners, no `utm_`/tracking tags, no `user@`. Image paths match `/pins/img/<name>.jpg`, and every file exists.
- **Images** (all 3 viewed): text and a drawn wheel only. No posters, logos, or product photos. Generic names are used where possible ("USB lighter", "Phone charger"). Film titles appear as plain text. The labels match the queue, and "Free · No sign-up" is true today.
- **Length and format:** titles are under 100 characters and descriptions under 500. Ids are unique. Dates are valid and one per day from 10/20 to 10/25.
- **Builder dry run (traced by hand, not run):** today (10/19 Central), no pin is dated on or before today, so the build has zero items, and `lastBuildDate` falls back to 10/12. That is byte-for-byte the current `pins/feeds/holiday.xml`, so the expected output is "No feed changes." Mark or the coordinator should still run it once to confirm.
- **No new third parties, accounts, tokens, or automation:** the workflow is unchanged in scope (built-in token, contents write, 5-minute timeout, commits only `pins/feeds`). No Pinterest API, tag, or app. The `PRESETS` allow-list now also names the party game keys (`occasion`, `players`, `types`) and others the pages use. That's still a closed list of first-party preset names.
- **Process:** the experiment row has a $0 cost, a stop rule, and a 2-week window, all set before the test starts. The test hasn't started (PR unmerged, feed never built with items, nothing published). Merging PR #1 is Mark's publish approval under the 10/12 condition.
