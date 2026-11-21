# Pinterest pin style test, Nov 24 – Dec 10, 2026 (marketing)

Mark's decision (11/21): the current Pinterest approach stops under the Nov 30 rule, but first we try a bolder, more playful pin style aimed at the audience that already sees our pins. Organic pins through the existing RSS feed. $0. This test has its own stop rule. It replaces the 11/30 rule for these 6 pins only.

**Found** = from our data or a cited source. **Guess** = my judgment.

## 1. Who and what

| Signal (found) | Source |
|---|---|
| Top pins by impressions are all holiday hosting: Office Christmas Party Games 8–12 (335), Holiday Game Night 8–12 (300), Family Christmas Movie Night (290), Classic Christmas Movies (231), White Elephant Under $25 (212) | analytics 11/21 |
| Clicks are the problem: 1,909 impressions, 5 outbound clicks in 30 days = **2.6 outbound per 1,000** | analytics 11/21 |
| Audience hint: 84% women, 52% 35+, hosting, family, party food (weak sample, ~284 people) | experiments.md 11/1 |
| Book club page is the only page that earns store taps (6 taps, all from it) and has a money path (Bookshop 10%) | analytics 11/21 |
| Only one RSS feed exists: `holiday` → **Holiday Party Ideas** board. No new pins are queued after 11/10, so the test pins post alone | pins/queue.json |

**Audience:** the Holiday Party Ideas viewers (women 35+ who host). **Pages:**
- 4 pins → `/book-club-picker/?occasion=christmas…` (PR #20). Why: same holiday audience, but the page with a money path. Book clubs are a hosting job too.
- 2 pins → `/party-game-picker/` (the topic Pinterest already shows most). Why: same page as the old top pins, so these 2 isolate **style** from **page**.

All 6 go on **Holiday Party Ideas** through the existing feed. A Book Club Ideas feed would mean a new Pinterest RSS connection (Mark + security review), and that board had 0 outbound clicks in October. Not worth it for a 3-week test.

## 2. The new style

Old style: a plain label ("Holiday Game Night for 8 to 12 People: Spin for a Game"). New style: **a hook first, then an honest promise.** Short, playful lines like "Can't agree? Let fate pick," "Christmas, but make it creepy," "Your book club is about to swoon." Use the `brand` (purple) theme instead of `holiday` green so the pins also look different. Same render.py template, no code change. (Guess: the copy matters more than the layout. If this wins, a layout test comes next.)

**Pinterest rules we must follow (found):**
- Community guidelines: "Do not create Pins that cause deception or otherwise trick Pinners into engaging" and no content that is "repetitive, deceptive or irrelevant in an attempt to make money" ([Pinterest community guidelines](https://policy.pinterest.com/en-gb/community-guidelines)).
- Same page: Pinterest isn't a place for sexual content. It bans "sexually suggestive depictions or descriptions" as well as explicit ones ([guidelines](https://policy.pinterest.com/en-gb/community-guidelines)).
- Links must not go to sites that are "deceptive, untrustworthy, unoriginal" ([guidelines](https://policy.pinterest.com/en-gb/community-guidelines)). Spam pins are pins with misleading links ([Pinterest Help, spam](https://help.pinterest.com/el/article/spam-on-pinterest)).
- Ad rules (not binding on organic pins, but a useful stricter bar): no "sensational clickbait tactics" such as "playing on people's fear," "critiquing deficiencies," "alarmist or gawk-worthy language," or "purposefully withholding information" ([Pinterest advertising guidelines](https://policy.pinterest.com/en/advertising-guidelines), via [ConductAtlas capture](https://conductatlas.com/platform/pinterest-ads/pinterest-advertising-guidelines/provision/CA-P-066073/prohibition-on-sensational-clickbait-tactics/)).

**What this means for "steamy":** the rule bans suggestive *descriptions*, not only explicit images. "Steamy" and "spicy" are read on book sites as code for sex scenes. Our romantic mood is meant to be book-club-friendly, so "spicy" would also mislead people about what they get. **Recommendation: use "swoon / mistletoe / meet-cute" instead of steamy/spicy.** This keeps the flirty tone and stays clearly inside the rules. If Mark still wants "steamy," the romantic list would need to contain such books, and security should review the pin first.

**House rules for these pins:** every hook has to be true on the landing page. The wheel shows mood or trope labels, not book titles or covers, and no store logos. No "best," no claims we can't check ("a book your club will actually finish" is out: we can't promise it, and it critiques the reader). No fear or "you're doing it wrong" lines.

## 3. Draft pins

All: feed `holiday` (board Holiday Party Ideas), theme `brand`, at most 1 per day per board, published at least 2 days apart so each pin gets clean early numbers. Book pins (2, 3, 4, 6) go into queue.json **only after PR #20 is live**, and the param values (`occasion=christmas`, `mood=romantic|scary|funny`) are checked against the merged code. If PR #20 merges late, those dates slip in order. Don't post them early, because a link that silently lands on the plain picker would break the hook's promise.

| # | Date | id | Link |
|---|---|---|---|
| 1 | Mon 11/24 | `dare-holiday-games-8-12` | https://thepartywheel.com/party-game-picker/?occasion=holiday&players=8-12 |
| 2 | Thu 11/27 | `christmas-romance-swoon` | https://thepartywheel.com/book-club-picker/?occasion=christmas&mood=romantic |
| 3 | Sun 11/30 | `book-club-deadlock-christmas` | https://thepartywheel.com/book-club-picker/?occasion=christmas |
| 4 | Wed 12/3 | `spooky-cozy-christmas-reads` | https://thepartywheel.com/book-club-picker/?occasion=christmas&mood=scary |
| 5 | Sat 12/6 | `office-party-wheel-boss` | https://thepartywheel.com/party-game-picker/?occasion=holiday&players=13-99&types=free,paper |
| 6 | Tue 12/9 | `funny-christmas-books` | https://thepartywheel.com/book-club-picker/?occasion=christmas&mood=funny |

**1. Dare: holiday game night**
- Title: Can't Agree on a Holiday Party Game? Let the Wheel Decide
- Description: Hosting 8 to 12 people this Christmas? Skip the debate. Spin a free wheel of holiday party games, from Charades and Holiday Trivia to Wavelength and Monikers. Whatever it lands on, everyone plays. Quick rules on every spin. Free, no sign-up.
- Overlay: headline "Can't agree? Let fate pick." / subhead "Holiday games for 8–12. No take-backs."
- Wheel: same 8 items as `holiday-game-night-8-12`. Accent #FFC93C.

**2. Christmas romance swoon**
- Title: Christmas Romance for Book Club: Spin and Let the Swooning Begin
- Description: Mistletoe, snowed-in cabins, and holiday meet-cutes. Spin a free wheel of Christmas romance picks for your book club. Every pick comes with a one-line reason it works for a group, plus links to borrow it from your library or buy it. Free, no sign-up.
- Overlay: "Your book club is about to swoon" / "Spin a Christmas romance pick."
- Wheel: Meet-cute, Snowed in, Small town, Second chance, Mistletoe, Holiday rivals, Fake dating, Royal Christmas. **Keep only tropes the PR #20 romantic list actually has.** Accent #FF4F86.

**3. Book club deadlock (all moods)**
- Title: Book Club Can't Agree on December's Pick? Let the Wheel Choose
- Description: Cozy, romantic, funny, mystery, or a little creepy? Pick a Christmas mood and spin, or spin them all and let fate decide your December book. Each pick has a one-line reason it works for a club and links to borrow or buy. Free, no sign-up.
- Overlay: "Book club deadlock? Let fate pick." / "Christmas reads, cozy to creepy."
- Wheel: Cozy, Romantic, Funny, Mystery, Scary, Classic (match PR #20's mood names). Accent #22B8A7.

**4. Spooky-cozy Christmas**
- Title: Spooky-Cozy Christmas Reads: Spin a Chilling Book Club Pick
- Description: Ghost stories at Christmas are an old tradition. Spin a free wheel of chilling-but-cozy Christmas and winter reads for your book club: haunted houses, snowed-in suspense, and dark winter tales. Each pick has a one-line reason and links to borrow or buy. Free, no sign-up.
- Overlay: "Christmas, but make it creepy" / "Spin a spooky-cozy book club pick."
- Wheel: Ghost story, Snowed in, Haunted house, Winter tale, Dark carol, Cabin chills, Old mansion, Midnight read (confirm against the list). Accent #FFC93C.

**5. Office party: the wheel is the boss**
- Title: Office Holiday Party Games: The Wheel Picks, Everyone Plays
- Description: Big office party, no time to plan? Let the wheel run it. Spin a free wheel of holiday games for 13+ people in teams, like Charades, Fishbowl, Holiday Trivia, and Two Truths and a Lie. No board games to buy. Quick rules on every spin. Free, no sign-up.
- Overlay: "The wheel is the party boss now" / "Big-group games. No supplies."
- Wheel: same 7 items as `office-party-games`. Accent #22B8A7.

**6. Funny Christmas books**
- Title: Funny Christmas Books for Book Club: Spin for a Holiday Laugh
- Description: Family chaos, holiday disasters, and office-party cringe, in book form. Spin a free wheel of funny Christmas reads for your book club. Each pick has a one-line reason it works for a group and links to borrow or buy. Free, no sign-up.
- Overlay: "Holiday chaos, but make it a book" / "Spin a funny Christmas pick."
- Wheel: Family chaos, Holiday disaster, Office party, Rom-com, Satire, Essays, Road trip, Ugly sweater (confirm). Accent #FF4F86.

Each pin needs `alt` text in house style ("A spinning wheel of … with the headline …"). Process as usual: marketing writes → security reviews → Mark merges → render.py → RSS.

## 4. How we judge it

**Measures**
- Pinterest **per-pin** outbound clicks and impressions (read in the app; the export doesn't split clicks by pin).
- **Control = the old-style pins over the same dates** (they keep getting holiday impressions). Baseline if needed: 2.6 outbound per 1,000 (last 30 days).
- GoatCounter visits with a pinterest.com referrer. Visits to /book-club-picker/ can only come from new pins (no old pin links there except the low-reach book club pins on another board), so they confirm the Pinterest numbers. Also count store taps from those visits if visible.

**Review: Tue Dec 16** (pin 6 has a week of data). Quick look Dec 4 for stop triggers only.

| Outcome (new-style pins combined) | Decision |
|---|---|
| Any Pinterest warning, removal, or pin reported | Stop at once. No more pins. |
| < 1,000 impressions combined | No read. Stop new pin work (Nov 30 rule stands). |
| ≥ 8 outbound per 1,000 **and** ≥ 8 outbound clicks **and** ≥ 10 Pinterest-referred GoatCounter visits | **Continue:** Winter book club pins in this style in January, 1–2 a week, recheck Jan 31 with the same bar. |
| Between (5–8 per 1,000, or the click/visit counts fall short) | Stop new pins for now. Revisit for Valentine's only if one pin type (book vs game) hit ≥ 8 per 1,000 alone. |
| < 5 per 1,000 or < 5 outbound clicks | Style failed. Stop all new pin work. Leave live pins and the feed alone. |

Also compare book pins vs game pins. Game pins vs the old game pins show the effect of style. Book pins vs game pins show whether the book page pulls better with this audience. With small numbers (guess: 1–3k impressions), treat any difference under ~2x as noise.

**Cost:** $0 cash. Effort: ~1 hr marketing/security, a render run, and Mark's merge. No finance gate needed.
