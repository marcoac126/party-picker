# Book club picker: simplify the page, filter books, clearer result

## v2: dropdown filters (Mark 11/21)

Mark's direction: "a more intelligent, concise book choosing workflow. Perhaps a few dropdown menus to filter books, beyond a simple book search/selector. The mobile view is the one I'm most concerned about."

v2 replaces v1's single "What kind of books?" dropdown and mood chips (v1 section 5) with three filters, and moves them **above the wheel** in a collapsed row. The rest of v1 still applies (clutter audit, 3-way switch, summary line, result card, guide wording, accessibility), with the changes listed in V11.

**For the prototype:** the developer can build this now with placeholder tags on 20 to 30 books. Label the prototype "sample tags" until Marketing's data lands. No screenshots in this session (no shell, so no Playwright). Pixel heights below are estimates from `assets/style.css`. Take shots at 390×664 (iPhone 14 Safari with toolbars), 375×548 (iPhone SE Safari) and 412×915 and save them to `/home/claude/work/ux-shots/`.

### V1. Where the filters go: a collapsed "Filters" row above the wheel

Mark asked about three placements. About 80% of visitors are on phones, so the test is an iPhone at 390×664 (the area you can see with Safari's toolbars showing).

| Option | Added above Spin | Where Spin ends up (390×664) | Verdict |
|---|---|---|---|
| A. Compact card, always open, above the wheel | about 230px (3 selects + count) | about 880px. The wheel starts about 500px down, so the first screen is mostly settings | **No.** It breaks "the wheel comes first" for everyone, including the many visitors who just want to spin. |
| B. Collapsed row "Filters (2) ▾ · 18 books match", opens in place | about 60px | about 645px, **on the first screen** (with the wheel sized to fit, see V2) | **Yes.** |
| C. Below the wheel (v1) | 0 | about 590px | **No.** The filters start around 760px, so phone users never see them. When you change a filter, the wheel isn't on screen, so you can't see what changed. Mark wants filtering to be part of choosing a book. |

Why B:
- It's one row, so the first screen still shows the wheel and Spin. The match count is in the same row, so people see "112 books" before they open anything.
- One tap opens the three selects in place, directly above the wheel. While you pick filters, the top of the wheel stays in view and redraws.
- Phones start collapsed. Screens 48rem wide or more start open, since there's room.
- This is a deliberate exception to "settings below the wheel": it's the one setting Mark wants most visitors to use, and it costs one row.

### V2. First screen at 390px (Suggested, 2 filters on, before a spin)

```
 y≈  ┌──────────────────────────────────┐
   0 │ The Party Wheel                  │ site header, 58
  58 │ Book club picker & random        │ H1, same words, 1.75rem on phones
     │ book generator                   │ 2 lines, ~80
 138 │ Books are already on the wheel.  │ lede, 2 lines, ~73
     │ Filter by occasion, mood, or     │
     │ genre, then spin.                │
 211 │┌────────────────────────────────┐│
     ││ Filters (2) ▾    18 books match││ filter row, 52 (card, collapsed)
     │└────────────────────────────────┘│
 271 │                ▼                 │
     │            ( WHEEL )             │ ~296 on this phone (fits viewport)
     │          12 books max            │
 567 │ [             Spin             ] │ 20 + 56, bottom ≈ 643: on screen
 643 │ 12 of 18 on the wheel.   Shuffle │ summary line, just below the fold
     │   (result card appears here)     │
     │ What’s on the wheel              │ H2 + 3-way switch (v1 section 2)
     │ [Suggested | Our list |Who hosts]│
     │ …                                │
```

Same screen with **Filters open** (about 290px tall):
```
     │┌────────────────────────────────┐│
     ││ Filters (2) ▴    18 books match││ toggle, 48
     ││ Occasion  [Christmas & holi… ▾]││ label left, select right, 48 each
     ││ Mood      [Scary             ▾]││ 8px gaps
     ││ Genre     [Any genre         ▾]││
     ││ Clear filters             Done ││ text buttons, 44
     │└────────────────────────────────┘│
     │                ▼                 │ top of wheel still visible
     │            ( WHEEL )             │
```

Sizing (developer):
- Filter card: `background:#12081D; border:2px solid var(--plum-2); border-radius:0.75rem; padding:0.25rem 0.75rem; margin:0 0 0.75rem`.
- Each filter is a row: `display:grid; grid-template-columns:5.25rem 1fr; align-items:center; gap:0.5rem`. Under 22rem of width, or with large text, it stacks (label above): `@media (max-width:22rem){grid-template-columns:1fr}`. Use the existing `select` style (3rem tall, cream-dim border).
- At 48rem and wider: the card starts open and the three filters sit in one row (`grid-template-columns:repeat(3,1fr)`, labels above).
- Wheel fits the phone's screen: `.stage { width: min(100%, 26rem, max(16rem, 100vh - 23rem)); width: min(100%, 26rem, max(16rem, 100svh - 23rem)); }` (vh first as the fallback). Spin's width matches. Results: 390×664 → about 296px, Spin on screen. 412×915 Android → 380px, everything through the summary line on screen. 375×548 (iPhone SE) → 256px, Spin about 55px below the fold. Check in the prototype that slice labels are still readable at 296px. If they're under about 12px, shorten titles on the slices (the result card shows the full title).
- H1 on this page only: `font-size: clamp(1.75rem, 7vw, 3rem)`. It stays 2 lines at 390px.
- Our list and Who hosts: the filter row is `hidden`, and the wheel moves up.

### V3. The filters

Three native `<select>`s with visible `<label for>`. No optgroups (some screen readers skip their labels, and these lists are short).

| Label | Default | Options in order | URL ids |
|---|---|---|---|
| Occasion | Any time | Popular this week · Award winners · then seasonal: Christmas & holidays, Winter, Valentine’s, Summer, Spooky season (in-season ones first) | `popular`, `awards`, `christmas`, `winter`, `valentines`, `summer`, `spooky` |
| Mood | Any mood | Cozy · Romantic · Funny · Mystery & suspense · Scary · Thought-provoking · Uplifting | `cozy`, `romantic`, `funny`, `suspense`, `scary`, `thoughtful`, `uplifting` |
| Genre | Any genre | Fiction · Mystery & thriller · Romance · Sci-fi & fantasy · Nonfiction · Classics | `fiction`, `mystery`, `romance`, `scifi`, `nonfiction`, `classics` |

- **Occasion shows an option only if it has at least 8 books in the whole library** (`MIN_OCCASION_BOOKS = 8`). This is a fixed list, not filtered by the other selects. Today that's probably Christmas & holidays, plus Popular this week when there are 8 or more bestsellers. "In season" means the occasion's months include this month or next month (Christmas 11–12, Winter 12–2, Valentine’s 1–2, Summer 6–8, Spooky 9–10). In-season occasions go right after Award winners. No badge.
- Mood and Genre always show every option.
- Each book has one genre and any number of moods and occasions. Filters combine with AND. A book with no mood matches only "Any mood".

**Decision: bestsellers and award winners go into the Occasion list** (as "Popular this week" and "Award winners"), not into a 4th "Books from" control.
- That keeps it to 3 filters (plus the toggle), and on a phone a 4th select costs 56px.
- A "Books from" control would overlap with the filters ("Bestsellers" + "Scary" means what?). In one list, the AND rule and the counts handle it with no special cases. Bestsellers come from Apple's chart with no mood tags, so after you choose Popular this week, the mood options show "(0)", which is accurate.
- Downside: "Award winners" isn't really an occasion. I accept that. The labels make sense on their own, and people read them as "what to read now". If Marketing finds this confusing, rename the label to **Occasion or list** (no layout change).
- Ask Marketing: could the weekly script map Apple's genre to our genres, so Genre filtering works on bestsellers?
- Lost in this change: "Frequently challenged" and "Contemporary fiction" aren't in the new genre list. Contemporary maps to Fiction. Frequently challenged has nowhere to go. **Flag to Marketing:** add a "Banned Books Week" occasion (months 9–10) so v1's banned-books guide text still applies, or remove that guide paragraph.

**Decision: show counts on options and keep every option selectable.** Don't disable zero-count options.
- Every option except "Any …" and the one already selected shows how many books it would give with the other two filters as they are: `Scary (4)`, `Romance (0)`. Recalculate the option text after each change.
- The selected option shows its name only (`Scary`), so the closed select fits the phone width. "Christmas & holidays (12)" would be cut off at 390px. The count line already shows the total.
- Why not disable? Disabled options look different on each platform. iOS dims them. Android's select dialog greys them out with no reason. NVDA says "unavailable" in some browsers and skips them in others. In every case the person can't tell *why*, and to get "Scary" they'd first need to undo some other filter they can't see. A count explains it, and if someone picks a "(0)" option anyway, the zero state (V5) lets them fix it in one tap.

### V4. Count, wheel, Shuffle

- **Count** (visible, in the filter row, right side; not a live region): `112 books` (no filters on) · `18 books match` · `1 book matches` · `No matches`. It updates right away.
- **Wheel:** up to 12 random matches. With 12 or fewer matches, all of them are on the wheel.
- **Summary line under Spin** (replaces v1 section 3's Suggested row):
  - More than 12: `12 of 18 on the wheel.` + **Shuffle** (text button)
  - 2 to 12: `All 7 are on the wheel.` (no Shuffle)
  - Fewer than 2: `No books on the wheel.` + **Change filters** (opens the card and focuses Occasion)
  - With no filters on, it still reads `12 of 112 on the wheel.`
- **Shuffle** deals 12 matches that haven't been on the wheel yet. When it runs out, it fills from the start again, so every match comes up. Focus stays on Shuffle. It's 44px tall with at least 8px of space from Spin.
- **Changing a filter** always deals new books (picked at random from the matches).

### V5. Zero matches (and one match)

Spin needs at least 2 books. With 0 or 1 match:
- The card opens if it was closed. That only happens when someone arrives from a link, because otherwise the person just changed a filter in the open card. Focus doesn't move.
- A message box appears inside the card, above the footer:
  - 0: `No books match these filters: Christmas & holidays, Scary, Romance.`
  - 1: `Only 1 book matches these filters: Christmas & holidays, Scary, Romance.`
  - Buttons: **Remove Romance (14 books)** · **Clear filters**
- **Remove [filter] (N books)**: offer the one filter whose removal gives the most matches. On a tie, remove the filter that was changed earliest, so the person's latest choice is kept. Show this button only if that removal gives 2 or more matches. Otherwise show only Clear filters.
- The wheel draws as an empty plum disc. Canvas `aria-label="Empty wheel. No books match these filters."`. Spin uses real `disabled` (the reason is shown on screen, which fits v1's rule about disabling only when there are fewer than 2 items).
- In the zero state, the footer's Clear filters is hidden, so it doesn't appear twice.

### V6. Deep links

- `?occasion=christmas&mood=scary&genre=romance`. Leave out a parameter when it's at its default. Only known ids are accepted.
- After each change, `history.replaceState` (no new history entry). Mix of everything, Our list, and Who hosts clear these parameters (`?mode=host` stays for Who hosts).
- When the page loads with filters: Suggested is selected, the filters are set, and the card is **collapsed** with "Filters (2)" (it opens only for the zero state). Anyone who opens a shared link sees the wheel and Spin right away.
- An unknown id, or an occasion under 8 books: that filter falls back to its default, and the card shows one line: `Some filters in this link aren’t available, so they were reset.` The line clears after the next change.
- Priority (same as v1): shared list link (`#z=` / `#w=`) > URL parameters > saved settings. Save `occasion`, `mood`, and `genre` in `pp-bookclub-v2`.
- Old links: `?genres=classics` → `genre=classics`. `contemporary` → `fiction`. `mystery`, `romance`, `scifi`, `nonfiction` map to the same id. `new` (New & popular) → `occasion=popular`. `challenged`, or several values → Any genre, with no message.
- Search pages: same as v1 5.7. Filter links use the main page as canonical. For "scary christmas books" Marketing needs real landing pages that preset the filters.

### V7. Data shape (proposal; Marketing's file wins if it differs)

```js
// books.js, 3rd field becomes an object (old entries without it still work)
['The Haunting of Hill House', 'Shirley Jackson',
  { g: 'classics', m: ['scary', 'suspense'], o: ['spooky'], why: 'A family gathering in a house that won’t let anyone leave.' }]
```
- `g`: one genre id. `m`, `o`: arrays (can be empty). `why`: optional, at most 90 characters, written by us.
- Bestsellers get `o: ['popular']` automatically. Award winners use `o: ['awards']`.
- Constants: `MIN_OCCASION_BOOKS = 8`, `WHEEL_MAX = 12`, `MIN_SPIN = 2`.

### V8. Result card

Same as v1 4.2, but the primary slot stays generic until Mark picks the store:
```
┌──────────────────────────────────┐
│            Next read             │ teal label
│   The Haunting of Hill House     │ karaoke reveal (the one animation)
│        by Shirley Jackson        │ teal
│ Classics · Scary · Spooky season │ tag line, cream-dim, 0.95rem
│ A family gathering in a house    │ why line, cream, max 90 chars
│ that won’t let anyone leave.     │
│ ┌──────────────────────────────┐ │
│ │       [Primary action]       │ │ yellow fill, plum text, 48px
│ └──────────────────────────────┘ │
│      ▸ More ways to get it       │ <details>, links one per line
│        Share this result         │ text button
│ If you buy through a link here…  │ disclosure, only if an affiliate link shows
└──────────────────────────────────┘
```
- **Tag line:** genre · mood · occasion. For mood and occasion, show the value that matched the active filter. Otherwise show the book's first one. Leave out a part that's missing. Leave the whole line out if there's nothing. The ` · ` separators go inside `aria-hidden="true"` spans, each preceded by a `.sr-only` comma, so screen readers read "Classics, Scary, Spooky season".
- **Why line:** only when there's data. No placeholder.
- **[Primary action]:** one filled button. Its label follows the rule "task + place" ("Buy at …" or "Borrow free from …"). This is a money placement, so it goes to finance and security, then Mark. v1's quiet library link is removed. If the primary button isn't the library, put **Borrow free from your library** first inside More.
- **More ways to get it:** the rest of v1's links, one per line, each 44px tall.
- **Showing the card:** after the wheel stops, if the card's title line isn't on screen, scroll instantly (`behavior:'auto'`, no smooth scrolling) so the card's top sits near the top of the screen. Otherwise, on phones, the karaoke reveal plays below the fold and nobody sees it. Focus stays on Spin (v1 section 7).
- **Screen reader sentence** (`#result-live`, polite): `Next read: The Haunting of Hill House, by Shirley Jackson. Classics, Scary, Spooky season.`

### V9. Exact strings

| Where | Text |
|---|---|
| Lede | Books are already on the wheel. Filter by occasion, mood, or genre, then spin. (Marketing + Mark approve) |
| Filter toggle | `Filters` · `Filters (1)` · `Filters (2)` · `Filters (3)`, plus `.sr-only` text after it: `: Christmas & holidays, Scary` |
| Count | `112 books` · `18 books match` · `1 book matches` · `No matches` |
| Labels | Occasion · Mood · Genre |
| Defaults | Any time · Any mood · Any genre |
| Option counts | `Scary (4)`, not shown on the selected option or on "Any …" |
| Card footer | Clear filters · Done |
| Zero / one | `No books match these filters: {list}.` · `Only 1 book matches these filters: {list}.` |
| Relax button | `Remove {filter label} ({n} books)` |
| Link reset | `Some filters in this link aren’t available, so they were reset.` |
| Summary line | `12 of 18 on the wheel.` + Shuffle · `All 7 are on the wheel.` · `No books on the wheel.` + Change filters |
| Empty wheel label | `Empty wheel. No books match these filters.` |
| Result | Next read · [Primary action] · More ways to get it · Share this result |

`{list}` is the labels of the active filters joined with ", " in the order Occasion, Mood, Genre.

### V10. Focus order and accessibility (WCAG 2.2 AA)

**Focus and reading order (Suggested):** site header link → H1 → lede → **Filters toggle** → count text (read in browse mode, not a tab stop) → *[if open: Occasion → Mood → Genre → zero-state message and buttons → Clear filters → Done]* → wheel image → **Spin** → summary sentence → **Shuffle** / Change filters → result card (after a spin) → H2 What’s on the wheel → 3-way switch → …

**Toggle (disclosure pattern):** `<button aria-expanded="false" aria-controls="filter-panel">`. The panel uses `hidden` when collapsed. The visible text comes first in the accessible name (2.5.3 Label in Name). The chevron is CSS or `aria-hidden`.

**Where focus goes after an action (so it's never lost):**
- Done: the card collapses, and focus moves to the toggle.
- Clear filters: focus moves to the Occasion select (the button disappears).
- Remove {filter}: focus moves to that filter's select.
- Change filters (under Spin): the card opens, scrolls into view instantly, and focus moves to Occasion. Do the focus in `requestAnimationFrame` after `scrollIntoView` (the iOS VoiceOver fix from 11/13).
- Changing a select never moves focus or scrolls (3.2.2 On Input). The wheel redraws in place.

**Announcing changes (4.1.3):** one `.sr-only` region `#match-live` with `role="status"` (polite, atomic). The visible count is *not* live, to avoid hearing it twice.
- Filter changes are **debounced 600 ms** after the last change. On Windows, arrowing through a closed select fires `change` on every key press. iOS fires `change` as the picker scrolls. Android's select dialog returns focus and TalkBack reads the select first. If the new sentence is the same as the last one, don't announce it.
  - More than 12: `18 books match. 12 are on the wheel.`
  - 2 to 12: `7 books match. All 7 are on the wheel.`
  - 1: `Only 1 book matches. Not enough to spin.`
  - 0: `No books match these filters.`
- Announced right away (no debounce): Shuffle → `12 new books on the wheel.` · Clear filters → `Filters cleared. 112 books. 12 are on the wheel.` · Remove → `Removed Romance. 14 books match. 12 are on the wheel.`
- Result: v1's `#result-live` sentence (V8).

**Contrast and size:** count text cream-dim on plum is about 11:1. Select borders are cream-dim (passes 1.4.11). The yellow focus ring on the #12081D card is about 11:1. The toggle, selects, Done, Clear, Remove, and Shuffle are all at least 44px tall. Reflow at 320px: the filter rows stack, and there's no horizontal scroll. Native select lists follow `color-scheme: dark`.

**Motion:** the card opens and closes with no transition. The wheel redraws instantly. Scrolling to the card is instant. The karaoke reveal is still the only animation.

**Test script (NVDA + Chrome/Firefox, TalkBack + Chrome, iOS VoiceOver + Safari):**
1. From the top: H1, lede, "Filters, collapsed, button", "112 books", wheel, Spin. Nothing else in between.
2. Open Filters. On Occasion, NVDA reads "Occasion, combo box, Any time". Arrow through Christmas & holidays and Popular this week. The count text changes, and `#match-live` speaks **once**, about 0.6 s after the last arrow press.
3. iOS: choose Scary in the picker and tap Done. VoiceOver reads the select, then "18 books match. 12 are on the wheel." TalkBack: same after the dialog closes. Check that it isn't cut off. If TalkBack drops it, raise the debounce to 900 ms.
4. Pick a "(0)" genre. The zero message appears, "Remove … (n books)" is reachable next, and activating it puts focus on that select.
5. Done: focus is on the toggle, which reads "Filters (2): Christmas & holidays, Scary, expanded" (then "collapsed").
6. Spin. Focus stays on Spin, "Next read: …" is read once, and the card is scrolled into view.
7. Open `?occasion=christmas&mood=scary&genre=romance` cold: the toggle reads Filters (3), and the selects match. Open `?mood=nope`: you see the reset line, and Mood is Any mood.
8. Our list and Who hosts: there's no filter row, and the address bar has no filter parameters.

### V11. What changes in v1

- **Clutter audit (section 1):** rows 13 and 14 now mean "replaced by the filter row above the wheel (v2)". "Spin these books" is dropped, because the filters sit right above the wheel. The control count before a spin goes from about 12 to about 9 (toggle, Spin, Shuffle, the 3-way switch, list details, and so on). With the card open, it's 14.
- **Lede (row 3):** new wording, V9.
- **Section 3:** the Suggested row is replaced by V4. "Change books" is removed for Suggested, and the 3-way switch is the next thing after the result card. The Our list and Who hosts rows are unchanged.
- **Section 4.2:** the primary button is generic (V8), and the library text link is moved into More.
- **Section 5:** replaced by V3 to V7. Section 5.7's `?theme=` is replaced by V6.
- **Section 8 "After" wireframe:** replaced by V2.

### V12. Review checklist (v2)
1. At 390×664: H1, lede, filter row with count, the whole wheel, and Spin are on the first screen.
2. Choosing Christmas & holidays + Scary, then Spin, takes 5 taps: toggle, select, select, Done, Spin. Spin is on screen after Done, with no scrolling.
3. Option counts are correct after each change, and the selected option has no count.
4. The zero state always offers a way out, and focus is never lost.
5. Each change is announced once, after a pause, on NVDA, TalkBack, and VoiceOver.
6. Deep links, old `?genres=` links, and saved settings restore correctly.

**Approvals:** lede → Marketing + Mark. The [Primary action] store → finance + security, then Mark. Occasion list, tags, the "Award winners" label, and Banned Books Week → Marketing.

---

# v1 (morning of 11/21; still applies except where V11 says otherwise)

UX spec, 2026-11-21. Page: `book-club-picker/index.html`. Shared: `assets/style.css`, `assets/links.js`, `assets/share.js`.
Builds on `docs/ux/club-list-search-spec.md` (shipped 11/13).
Sources: Mark's girlfriend's feedback (page too busy; wants theme, then mood). Analytics from 11/21: about 80% of visitors are on phones. The book club page had 148 visits and 6 store-link taps (Goodreads 5, Bookshop 1). Only 44% of book club visitors are in the US.

**Screenshots:** none. This session had no shell, so I couldn't run Playwright. Heights below are estimates from the CSS at 412px. When the developer builds this, take before and after shots at 412×915 and save them to `/home/claude/work/ux-shots/` for the review.

**Approvals before shipping**
- Lede and guide wording changes (sections 1 and 6): Marketing (search) and Mark.
- Result card link order and the Bookshop button (section 4): this is a money placement, so it goes to finance and security, then Mark.
- Counting spins (section 4.1): security review, because it changes `count.js`.
- Themes and moods, and how many books each needs: Marketing decides. This design works with any number, including zero themes.

**Build order:** Part 1 (simplify the page and the result card) doesn't need any theme data. Part 2 (themes) can ship later. If there are no themes, the dropdown just shows "Mix of everything" and genres.

---

## 1. Clutter audit, top to bottom (412px, suggested picks, before a spin)

Today a first-time visitor sees about 27 controls before spinning. After a spin, the result card adds 8 more links and a button. One phone screen (about 915px) only reaches the Spin button.

| # | Block | Today | Decision | Why |
|---|---|---|---|---|
| 1 | Site header "The Party Wheel" | Link home | **Keep** | Small, and it's the way back to the other wheels. |
| 2 | H1 "Book club picker & random book generator" | 3 lines | **Keep, same words** | Marketing needs it for search. |
| 3 | Lede | 3 lines. Promises links to "your library, indie bookstores, Amazon, and Audible" | **Keep, shorten to 2 lines** | It promises store links before anyone has a reason to care. New: **Books are already on the wheel. Spin, or choose a theme and mood below.** Needs Marketing to approve. The meta description still says "bestsellers every Monday". |
| 4 | Mode switch "Next book / Who hosts" | Above the wheel | **Merge and move lower** | Merge it with the source switch into one 3-way switch under "What’s on the wheel" (section 2). This follows the rule that settings go below the wheel, and it removes one of two stacked switches. |
| 5 | Shared-list note (only from a shared link) | Placed after the mode switch | **Keep, move** to right after the lede | It's safety context, so people need to see it before they spin. |
| 6 | Wheel | | **Keep** | |
| 7 | Spin | | **Keep** | |
| 8 | "Use our club’s list" + "Share a copy" row | Two text buttons | **Merge** into one summary line: a sentence about what's on the wheel, plus one button that changes by state (section 3) | It explains the wheel in one sentence and gets people to the settings in one tap. "Share a copy" moves into the club and host panels. That's where lists get shared, and sharing 12 random suggestions has little value. |
| 9 | "Changed since you shared" line | Under Spin | **Move** into the club panel, under Share a copy | It's only about the club list. |
| 10 | Empty result card "Your pick shows up here." | Always shown | **Remove the empty state** | It's an empty box in the most valuable spot. The card appears only after a spin. |
| 11 | "This month's pick" box (3 links + disclosure) | Between result and settings | **Move lower and trim** to just above "More for book clubs", with 2 links | It's a second set of store links that competes with the result card. Marketing can decide later whether to keep it at all. |
| 12 | H2 "Books on the wheel" + "Where should the books come from?" + source switch | | **Merge** into H2 **What’s on the wheel** + one 3-way switch | Replaces two switches and a repeated question. |
| 13 | Genre chips (8 on/off chips, about 4 rows, with strikethrough "off" state) | | **Replace** with the "What kind of books?" dropdown + mood chips (section 5) | Eight on/off chips is the busiest spot on the page, and the struck-through text is hard to read. One dropdown holds any number of genres and themes. |
| 14 | Status line + "Deal new books" | 2 to 3 lines | **Keep**, with new wording (section 5.6). Add **Spin these books** | Spin is a full screen up from the dropdown. This gives people one tap to spin after choosing. |
| 15 | "See the books on the wheel" (12 rows, each with "Options", 7 store links each) | Collapsed | **Keep collapsed, remove the per-row store links and the two disclosures** | 84 hidden links nobody uses. The result card is the one place to get a book. |
| 16 | "Remove each pick after it’s chosen" | Always shown | **Show only in "Our list" and "Who hosts"** | It's pointless with 12 random suggestions that are re-dealt anyway. |
| 17 | Club panel (search, list, Edit as text) | Shipped 11/13 | **Keep as is**, add Share a copy, the changed line, and Remove each pick | It works, and Mark's club asked for it. |
| 18 | Store links in the result | 4 visible + 3 under "More" + share | **Rework** (section 4) | Seven links with equal weight, and nothing tells people what the book is. |
| 19 | "More for book clubs" (2 links) | | **Keep** below the month box | Two links, useful after a pick, and good for internal links. |
| 20 | Guide and FAQ | Visible | **Keep visible at the bottom, update control names** (section 6) | It's already last, so the clutter was everything above it. Collapsing it would cost search weight and add tap-to-read friction. I'm not wrapping the H3s in `<details>`: headings inside `<summary>` lose heading navigation in some screen readers. |
| 21 | Footer | | **Keep** | Affiliate disclosure link is required. |

After the change, a first-time visitor sees about 12 controls before spinning, and the card adds 3 links + 1 button.

---

## 2. One switch: what's on the wheel

Replace `fieldset.segmented` (mode) and `fieldset.segmented.small` (source) with one 3-way `.segmented` in the settings section. Use a 3-column grid. Each segment is at least 44px tall and the labels may wrap to 2 lines.

- H2: **What’s on the wheel** (`id="list-heading"`). The fieldset uses `aria-labelledby="list-heading"`, so there's no second hidden legend.
- Options: **Suggested** · **Our list** · **Who hosts**
- Values map to today's state: Suggested = `mode:book, source:suggested`. Our list = `mode:book, source:club`. Who hosts = `mode:host`. `currentItems()` and saving don't change.
- `?mode=host` and shared links keep working (they select Our list or Who hosts).

## 3. Summary line under Spin (replaces the share row)

One line, centered. It's plain text, then a `.text-btn`. Not a live region (the live status is in the settings, section 5.6).

| State | Sentence | Button |
|---|---|---|
| Suggested | Same sentence as the status line (5.6), without the bestseller dates | **Change books** |
| Our list, 0 books | **No books on your club’s list yet.** | **Add books** |
| Our list, 1 book | **1 book on your club’s list. Add 1 more to spin.** | **Add books** |
| Our list, 2+ | **8 books from your club’s list.** | **Edit our list** |
| Who hosts | **6 members on the wheel.** / **No members on the wheel yet.** | **Edit members** |

Button behavior (the same pattern as 11/13): run `render()`, then jump with no smooth scroll.
- **Change books** focuses the checked radio in the 3-way switch.
- **Add books** and **Edit our list** focus the book search input.
- **Edit members** focuses the members textarea.

Do the focus in a `requestAnimationFrame` after `scrollIntoView` (the iOS VoiceOver fix from 11/13).

New club users now need two taps instead of one: Change books, then Our list. I think that's worth it for a calmer page. Returning clubs land straight on their saved list.

---

## 4. Result card

### 4.1 Why store links get so few taps
1. **No order of importance.** Seven links look the same as every other link on the page (yellow underline), so they read like fine print. Too many choices means people pick none.
2. **The card doesn't say what the book is.** 5 of the 6 taps went to Goodreads, which suggests people wanted to learn about the book before getting it. Show that in the card.
3. **Wrong country for most visitors.** Only 44% of book club visitors are in the US. Bookshop.org (US) and Libro.fm don't serve Brazil, Germany, and other big sources of traffic. Goodreads and OverDrive/Libby work in many countries.
4. **Deciding isn't buying.** A spin is a decision moment. Many clubs buy later, from a group chat. "Share this result" helps here, because the person who opens it gets the same card with links.
5. **We can't see how many people spin.** 148 visits doesn't mean 148 spins. Recommend counting a `spin: book-club` event in `count.js` (no list contents, just the event). That tells us whether the problem is "nobody spins" or "spins but doesn't tap". Needs a security review.
6. **The same links show up in too many places** (month box, 84 links hidden in the list), so none of them stands out.

### 4.2 New card (book modes)

```
┌──────────────────────────────────┐
│            Next read             │ teal label
│   The Haunting of Hill House     │ karaoke reveal (the one animation)
│        by Shirley Jackson        │ teal
│          Holiday, scary          │ tag line, cream-dim, 0.95rem
│ A family gathering in a house    │ "why" line, cream, max 90 chars
│ that won’t let anyone leave.     │
│ ┌──────────────────────────────┐ │
│ │     Buy at Bookshop.org      │ │ primary: yellow fill, plum text, 48px
│ └──────────────────────────────┘ │
│  Borrow free from your library   │ text link, 44px
│     ▸ More ways to get it        │ <details>
│        Share this result         │ text button
│ If you buy a book through a …    │ disclosure, 0.9rem
└──────────────────────────────────┘
```
Opened "More ways to get it" (a list, one link per line, left-aligned inside the card):
**Read reviews on Goodreads** · **Listen on Libro.fm** · **Read on Kindle** · **Buy on Amazon** · **Listen on Audible**

Decisions:
- **One primary action:** **Buy at Bookshop.org**. I didn't use "Get it": a button should say exactly what happens and where. Bookshop is our only live affiliate.
- **The free option stays visible** as a quiet text link. Book clubs use libraries a lot, and showing a free route makes the buy button feel less pushy. That's three things in one spot: button, link, More.
- **Other choice for Mark** (Option B): make **Borrow free from your library** the primary button and Bookshop the text link. It works better for visitors outside the US but earns nothing. Finance, security, and Mark decide this. I recommend A, and checking the spin and tap numbers after 4 weeks.
- Goodreads moves under More, even though it's tapped most. The "why" line answers "what is it?" in the card. If Goodreads taps drop and Bookshop taps don't rise, move Goodreads back out.
- **Tag line** (only when known): theme + mood ("Holiday, scary"), genre label ("Mystery & thriller"), or **On this week’s bestseller list**. Nothing for club-list books.
- **Why line** (only when the data has one): one sentence, at most 90 characters, written by us (don't copy publisher blurbs). Leave it out when missing. Don't show a placeholder.
- The button text stays **Spin again** after a spin.
- Who hosts: label **Hosting next**, the name, Share this result. No tag, why line, or links.
- Club-list books: title, author, links. Optional: if the title and author match a library book (`bookKey`), show its tag and why line.

Code notes for the developer:
- Add `PartyLinks.bookCard(title, author)` in `links.js` to return the new link block. Keep `bookLinks()` for other pages.
- `.get-btn`: `display:block; min-height:3rem; border-radius:999px; background:var(--yellow); color:var(--plum); font:800 1.1rem var(--font); text-decoration:none`, centered, `width:min(100%,22rem)`, `margin: 1rem auto 0.25rem`. Hover: cream background. Focus: the global yellow outline with 3px offset sits on the dark card, so it's visible.
- The month box uses the same two links (**Buy at Bookshop.org**, **Borrow free from your library**) with no More and no Libro.fm.

---

## 5. Browse by theme, then mood

> **Replaced by v2 (V3 to V7).** Kept for the record.

### 5.1 One control or two? One.
Genres and themes are both answers to "what kind of books?". Two dropdowns would make people wonder whether they combine. So there's one native `<select>`, and moods are a second step that appears only when the choice has moods. That's the girlfriend's flow: Holiday, then Scary, then Spin.

What changes: genres become pick-one (today they're on/off chips). "Mix of everything" replaces "all on". You can no longer mix two chosen genres. The guide only suggested "one or two genres" for theme months, and themes now do that job better.

### 5.2 Layout (Suggested panel)

```
│ What kind of books?              │ <label for="kind">
│ ┌──────────────────────────────┐ │
│ │ Holiday                    ▾ │ │ <select id="kind">, 48px
│ └──────────────────────────────┘ │
│ What mood?                       │ <legend>, only if the choice has moods
│ (Any mood)(Scary)(Romantic)      │ radio chips, wrap
│ (Cozy)(Funny)                    │
│ Holiday, scary mood: all 7 books │ status, polite live
│ are on the wheel.                │
│ Spin these books   Deal new books│ text buttons
│ ▸ See the books on the wheel     │
```

Dropdown contents, in order:
1. **Mix of everything** (default, no group). The pool is every genre book plus bestsellers, the same as today's "all chips on". Themed books are not included.
2. `<optgroup label="Themes">`: Marketing's themes. In-season themes go first, then the rest in data order. If there are no themes, leave out the group.
3. `<optgroup label="Genres">`: **Popular now** (was "New & popular". Shown only if 2 or more bestsellers, as today), **Contemporary fiction**, **Mysteries & thrillers**, **Romance**, **Sci-fi & fantasy**, **Nonfiction**, **Classics**, **Frequently challenged**.

Mood chips:
- `<fieldset class="chip-group" id="mood-group">` with `<legend class="field-legend">What mood?</legend>`. First chip **Any mood** (default), then the moods in data order.
- These are **radio inputs** (pick one), not `aria-pressed` buttons. Screen readers then announce "radio button, 2 of 5, checked", and arrow keys work without extra code.
- Selected: yellow fill + plum text (like `.segmented`). Not selected: cream text, 2px `--cream-dim` border. Don't use the strikethrough style.
- Hide the whole fieldset (`hidden`) when the choice has no moods. Changing "What kind of books?" resets the mood to Any mood.

**Spin these books** (text button): scroll the wheel into view (`block:'center'`, `behavior:'auto'`), move focus to Spin, then start the spin. Hide it when fewer than 2 books.
**Deal new books**: as today, shown only when the pool is bigger than 12.

### 5.3 Data shape (developer, fits any number)
New file `book-club-picker/themes.js`:
```js
window.BOOK_THEMES = [
  { id: 'holiday', label: 'Holiday', months: [11, 12],
    moods: [['scary', 'Scary'], ['cozy', 'Cozy']],
    books: [['Title', 'Author', 'scary', 'One-line why, max 90 chars'], ...] }  // mood may be 'cozy|funny'
];
```
- Ids: `^[a-z0-9-]{1,30}$` (they go in URLs). Labels in sentence case, and mood labels should be single common words (they're lowercased inside the status sentence).
- `books.js` can take an optional 4th field `why`. Bestsellers get none.
- Themed books need ISBNs in `isbns.js` so Bookshop links open the book page (and earn credit).

### 5.4 Few books, empty states
- Two constants: `MIN_THEME_BOOKS`, `MIN_MOOD_BOOKS`. Marketing sets them. The code never allows less than 2. My UX advice is at least 6, because a 2- or 3-slice wheel looks broken.
- A theme under its minimum doesn't appear in the dropdown. A mood under its minimum doesn't get a chip. If a theme has no moods that qualify, the mood fieldset stays hidden.
- 12 books or fewer: all of them go on the wheel, Deal new books is hidden, and the status says "all 7 books".
- No themes at all: the Themes group is left out. Nothing else changes.

### 5.5 Seasonal themes: always available, in-season first
- Every theme is always in the dropdown. Book clubs pick a month or more ahead, and links and search pages shouldn't break after a season ends.
- "In season" means this month **or next month** (`months` includes either). Those themes go first in the Themes group. No badge, no extra label, and the default stays Mix of everything.

### 5.6 Status line (`#status`, polite live) and summary sentence
| Case | Wording |
|---|---|
| Mix, pool > 12 | **12 random picks from 112 book club favorites.** |
| Kind, no mood, pool > 12 | **Holiday: 12 random picks from 31 books.** |
| Kind + mood, pool > 12 | **Holiday, scary mood: 12 random picks from 20 books.** |
| Pool ≤ 12 | **Holiday, scary mood: all 7 books are on the wheel.** / **Classics: all 9 books are on the wheel.** |
| Popular now (add) | ** Bestseller list from Nov 16. Next update Mon, Nov 23.** (status only, not in the summary) |
| Link mood too small or unknown | **Not enough books for “Scary” yet, so the wheel shows all Holiday books.** |
| Link theme or genre unknown | **That theme isn’t available, so here’s a mix of book club favorites.** |
| Pool < 2 (shouldn't happen) | **Not enough books here yet. Choose another kind.** Spin disabled. |

Announce status changes after a 500 ms pause. On Windows, arrowing through a closed `<select>` fires `change` on each arrow press, so without the pause it would talk on every step.

### 5.7 Links for sharing and search pages
- Parameters: `?theme=holiday&mood=scary`, `?genre=mystery`. Only known ids are accepted. If both are present, `theme` wins. `mood` without a valid theme or genre is ignored.
- Old links: `?genres=classics` (one value) selects Classics. With several values (`?genres=challenged,classics`), add a temporary first option **Mixed: Frequently challenged, Classics** that pools those genres. Remove it once the visitor picks something else.
- After any change, update the address bar with `history.replaceState` (no new history entries). Then copying the address shares the theme. Mix of everything, Our list, and Who hosts clear the parameters (`?mode=host` stays for Who hosts).
- Priority: shared list link (`#z=` / `#w=`) > URL parameters > saved settings. A theme or genre parameter switches to Suggested, just like `?genres=` does today.
- Save `kind` and `mood` in `pp-bookclub-v2` in place of `genres`. Old saved `genres` arrays: one genre selects it, otherwise use Mix. Unknown saved ids silently fall back to Mix (no message, since the visitor didn't ask for it).
- **Search pages:** `?theme=` links point to the main page as canonical, so Google won't list them separately. To rank for things like "scary christmas books", Marketing needs real pages (for example `/book-club-picker/holiday/`) with their own H1, intro, and canonical, which load this picker with the theme preset. Flagging this to Marketing; not designing it here. GoatCounter logs `pathname + search`, so visits from theme links can already be counted.

### 5.8 With "Our list" and "Who hosts"
The kind and mood controls live only in the Suggested panel, so they're hidden in the other two. Switching back to Suggested restores the last kind and mood.

---

## 6. Exact wording (all new or changed strings)

| Where | Text |
|---|---|
| Lede | Books are already on the wheel. Spin, or choose a theme and mood below. |
| Settings H2 | What’s on the wheel |
| 3-way switch | Suggested / Our list / Who hosts |
| Dropdown label | What kind of books? |
| Default option | Mix of everything |
| Optgroups | Themes / Genres |
| Genre rename | Popular now (was "New & popular"); Mysteries & thrillers (was "Mystery & thriller") |
| Mood legend | What mood? |
| First mood chip | Any mood |
| Buttons | Spin these books / Deal new books / Change books / Add books / Edit our list / Edit members |
| Result primary | Buy at Bookshop.org |
| Result secondary | Borrow free from your library |
| Result disclosure summary | More ways to get it |
| Result, More links | Read reviews on Goodreads / Listen on Libro.fm / Read on Kindle / Buy on Amazon / Listen on Audible |
| Result tag (bestseller) | On this week’s bestseller list |
| Screen reader result | Next read: The Haunting of Hill House, by Shirley Jackson. Holiday, scary. |
| Month box links | Buy at Bookshop.org / Borrow free from your library |
| Guide, "How to pick" | …Under “What’s on the wheel”, choose “Our list”, search for each book, and spin… |
| Guide, Theme months | **Theme months:** under “What kind of books?”, pick a theme, then a mood. |
| Guide, Stay current | **Stay current:** “Popular now” is this week’s bestseller chart, refreshed every Monday. |
| Guide, Banned books | **Banned books month:** choose “Frequently challenged” for titles from the American Library Association’s most-challenged lists. These spark big discussions; some include mature themes. |
| Guide, Pick the host | **Pick the host too:** choose “Who hosts”, add members’ names, and turn on “Remove each pick” so everyone takes a turn. |
| FAQ, where picks come from | …“Popular now” comes from Apple Books’ US bestseller chart each week… |

Summary sentences, status lines, and empty states are in sections 3 and 5.6.

---

## 7. Accessibility (WCAG 2.2 AA)

**Structure and names**
- `<label for="kind">` on the select. Mood chips are a `<fieldset>` with a visible `<legend>` (1.3.1, 3.3.2). The 3-way switch fieldset uses `aria-labelledby="list-heading"`.
- Option text must make sense alone ("Holiday", not "— Holiday"), because some screen readers don't read optgroup labels. No emoji or symbols in labels.
- Heading order: H1, then H2 What’s on the wheel, H2 More for book clubs, then the guide H2 and H3s. The month box is an `aside` with its label (no heading).

**Changing choices (3.2.2 On Input)**
- Changing the select or a mood re-deals the wheel but **doesn't move focus** or scroll. That's a content change, not a change of context. The status line explains it.
- Spin these books moves focus to Spin. That's fine because the visitor asked for it.

**Result announcements (4.1.3)**
- Stop making the whole `#result` card the live region. Today it reads the title, author, 7 links, the disclosure, and share. Add one `.sr-only` polite region `#result-live` that announces a single sentence (section 6). The card itself is not live.
- Keep focus on the Spin button after the spin. The card comes next in the DOM, so the next swipe or Tab reaches it.
- **Bug to fix:** Spin is set to `disabled` while spinning. Some browsers drop focus from a button when it becomes disabled, so keyboard and screen reader focus ends up on `<body>`, and NVDA may jump to the top. During the spin, use `aria-disabled="true"` and ignore clicks instead. Keep real `disabled` only for "fewer than 2 items".

**Radio chips and iOS VoiceOver**
- Don't use the 1px hidden-input trick for the mood chips. VoiceOver touch exploration can land on the 1px input or miss it. Instead, place the input over the whole chip (`position:absolute; inset:0; opacity:0; margin:0`) inside a `position:relative` wrapper, with the visible label underneath. Put the focus ring on the label via `input:focus-visible + label`. Check the existing `.segmented` the same way while testing.

**Visible focus, contrast, size**
- Focus: the global 3px yellow outline. On the yellow Bookshop button, the 3px offset leaves a dark gap, so the ring still shows.
- Contrast (my calculations): yellow #FFC93C on plum #2B1342, and plum on yellow, about 10.7:1. Teal on the card #12081D about 7.9:1. Cream-dim on the card is well above 4.5:1. Unselected chip and select borders use `--cream-dim` (the 11/13 fix for 1.4.11, since `--plum-2` was about 1.3:1). Selected and unselected chips also differ by fill, not only color.
- Targets: chips, segments, text buttons, and the link rows under "More ways to get it" are at least 44px tall. The primary button is 48px. Spacing between chips is at least 8px (2.5.8 needs 24px; our rule is 44px).
- Reflow at 320px: chips wrap and segment labels may wrap to 2 lines. No horizontal scroll.

**Links that open a new tab**
- Store links use `target="_blank"`. Add visually hidden text **(opens in a new tab)** to each one (G201). It's not strictly required for AA, but Mark's audit will likely flag it, and the result card now has fewer links, so it adds little noise.

**Motion**
- No new animation. The karaoke reveal stays the one bold moment. The wheel redraws instantly when the kind or mood changes, the mood fieldset appears without a transition, and Spin these books scrolls instantly.

**Test script (NVDA + Chrome/Firefox, TalkBack + Chrome, iOS VoiceOver + Safari)**
1. Swipe or Tab from the top: H1, lede, wheel image, Spin, summary sentence, Change books. Make sure nothing else is in between.
2. Change books: focus lands on "Suggested, radio button, 1 of 3".
3. Select: NVDA reads "What kind of books?, combo box, Mix of everything". On iOS the picker shows the Themes and Genres groups. In TalkBack the list opens and the group headers aren't focusable as options. After choosing Holiday, the status is read once ("Holiday: 12 random picks from 31 books.").
4. Mood: "What mood?, grouping", then "Scary, radio button, 2 of 5". Arrowing changes the mood and the status speaks once after the pause, not on every key press.
5. Spin these books: focus moves to Spin. When the wheel stops, "Next read: …" is read once, and focus is still on Spin (not on the page body).
6. Next swipe: title, author, tag, why line, "Buy at Bookshop.org, link, opens in a new tab", library link, "More ways to get it, collapsed", Share this result, disclosure.
7. Open `?theme=holiday&mood=scary` cold: Holiday and Scary are already selected and the status matches. Open `?theme=nope`: the fallback sentence shows and the select reads Mix of everything.
8. Our list and Who hosts: the kind and mood controls aren't reachable, and the address bar has no theme.

---

## 8. Phone layout, before and after (412px)

**Before** (Suggested, before a spin; the bottom of the first screen is around Spin)
```
┌──────────────────────────────────┐
│ The Party Wheel                  │
│ Book club picker & random        │ H1
│ book generator                   │
│ Books already loaded, with new   │ lede, 3 lines
│ bestsellers every Monday. Every  │
│ pick links to your library, …    │
│ [  Next book   |   Who hosts   ] │ mode switch
│                ▼                 │
│            ( WHEEL )             │ ~380px
│ [             Spin             ] │ ── end of first screen
│ Use our club’s list  Share a copy│
│ ┌ Your pick shows up here.     ┐ │ empty card
│ ┌ NOVEMBER BOOK CLUB PICK ─────┐ │
│ │ Tomorrow, and Tomorrow, and… │ │
│ │ by Gabrielle Zevin · the …   │ │
│ │ Buy at Bookshop.org · Find at│ │ 3 links
│ │ your library · Listen on …   │ │
│ │ disclosure                   │ │
│ └──────────────────────────────┘ │
│ Books on the wheel               │ H2
│ Where should the books come from?│
│ [Suggested picks|Our club’s list]│
│ Genres                           │
│ Tap to include or leave out      │
│ (New & popular)(Contemporary …)  │ 8 chips, ~4 rows
│ (Mystery & thriller)(Romance)    │
│ (Sci-fi & fantasy)(Nonfiction)   │
│ (Classics)(Frequently challenged)│
│ 12 random books from 112 in 8    │ status
│ genres. Bestseller list from …   │
│ Deal new books                   │
│ ▸ See the books on the wheel     │ 12 rows × "Options" (7 links each)
│ ☐ Remove each pick after it’s…   │
│ More for book clubs              │ H2 + 2 links
│ How to pick a book club book …   │ guide + FAQ
│ footer                           │
└──────────────────────────────────┘
After a spin the card adds: Next read, title, author,
4 links + "More:" 3 links, disclosure, Share this result.
```

**After** (Suggested, Holiday + Scary chosen, before a spin). *Replaced by v2 V2.*
```
┌──────────────────────────────────┐
│ The Party Wheel                  │
│ Book club picker & random        │ H1 unchanged
│ book generator                   │
│ Books are already on the wheel.  │ lede, 2 lines
│ Spin, or choose a theme below.   │
│                ▼                 │
│            ( WHEEL )             │
│ [             Spin             ] │ reachable with one thumb
│ Holiday, scary mood: all 7 books │ summary (not live)
│ are on the wheel.  Change books  │ ── end of first screen
│   (result card appears here)     │ nothing before a spin
│ What’s on the wheel              │ H2
│ [Suggested | Our list |Who hosts]│
│ What kind of books?              │
│ [ Holiday                     ▾ ]│
│ What mood?                       │
│ (Any mood)(Scary)(Romantic)      │
│ (Cozy)(Funny)                    │
│ Holiday, scary mood: all 7 books │ status (live)
│ are on the wheel.                │
│ Spin these books                 │ (Deal new books hidden: ≤ 12)
│ ▸ See the books on the wheel     │ titles only
│ ┌ November book club pick ─────┐ │ compact, 2 links
│ └──────────────────────────────┘ │
│ More for book clubs              │
│ How to pick a book club book …   │ guide + FAQ, new control names
│ footer                           │
└──────────────────────────────────┘
```

**After, Our list**
```
│ [             Spin             ] │
│ 8 books from your club’s list.   │
│ Edit our list                    │
│ What’s on the wheel              │
│ [Suggested |▐Our list▌|Who hosts]│
│ Add a book                       │ 11/13 search, unchanged
│ [ Title or author             ]  │
│ 8 books on the wheel.            │
│ Educated – Tara Westover  Remove │
│ …                                │
│ ▸ Edit as text                   │
│ ☐ Remove each pick after it’s…   │
│ Share a copy                     │ moved here
│ You’ve changed the list since …  │ moved here
```

**After, Who hosts**
```
│ 6 members on the wheel.          │
│ Edit members                     │
│ What’s on the wheel              │
│ [Suggested | Our list |▐Who hosts▌]
│ Members  [textarea]              │
│ ☐ Remove each pick after it’s…   │
│ Share a copy                     │
```

---

## 9. Review checklist after the build
1. First screen at 412×915 shows the H1, lede, wheel, Spin, and summary line, and nothing else competes.
2. Holiday, then Scary, then Spin these books takes 3 taps with no scrolling back up.
3. The result card has one filled button, one text link, and a collapsed More.
4. Deep links, old `?genres=` links, saved settings, and shared lists all restore correctly.
5. The test script in section 7 passes on NVDA, TalkBack, and iOS VoiceOver.
6. After 4 weeks: spins (if counted), Bookshop taps, library taps, and Goodreads taps compared with the 11/21 baseline (5 Goodreads, 1 Bookshop out of 148 visits).
