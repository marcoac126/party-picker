# Book club picker: simplify the page, browse by theme and mood, clearer result

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

**After** (Suggested, Holiday + Scary chosen, before a spin)
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
