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
