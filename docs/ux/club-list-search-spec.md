# Book club picker: club list entry, book search, share clarity, Kindle link

UX spec, 2026-11-13. Page: `book-club-picker/index.html`. Shared code: `assets/share.js`, `assets/links.js`, `assets/style.css`.
Source: feedback from Mark's book club (11/13). Mark approved Open Library search and links that stay snapshots.

**Before this ships:** Open Library is a new outside service called from the visitor's browser. It needs a security review and a row in `docs/security/third-parties.md`. The site also promises "nothing you type is sent anywhere", so the copy changes in section 5 need Mark's approval. Book search should not go live until both are done.

---

## 1. Entry point near the wheel

The row under Spin (today it holds only "Share this wheel") becomes one centered row with two text buttons that can wrap. Reuse `.share-row` and `.text-btn`.

| Mode / state | First button (label) | What it does |
|---|---|---|
| Next book, suggested picks on | **Use our club’s list** | Turns on "Our club’s list", jumps to the panel, focuses the search box |
| Next book, club list, 0–1 books | **Add books to our list** | Jumps to the panel, focuses the search box |
| Next book, club list, 2+ books | **Edit our list (5 books)** | Same |
| Who hosts | **Edit members** | Jumps to the members box and focuses it |

Second button: **Share a copy** (section 3).

Behavior:
- Use a `<button>`, not a link, because it changes state.
- On tap, run `render()`, then `input.focus({ preventScroll: true })`, then `panel.scrollIntoView({ block: 'start', behavior: 'auto' })`. Jump straight there with no smooth scroll, because the page allows only one animation. Put `scroll-margin-top: 1rem` on the panel.
- Leave the "Suggested picks / Our club’s list" switch in the panel as it is. It is still how people go back to suggested picks.

```
 360px
┌────────────────────────────────┐
│ The Party Wheel                │
│ Book club picker & random…     │
│ Books already loaded, with…    │
│ [ Next book  |  Who hosts   ]  │
│                                │
│          ( WHEEL )             │
│                                │
│ [          Spin          ]     │
│  Use our club’s list  Share a copy │
│  ┌ result card ┐               │
```

## 2. Book search (club panel)

```
│ Books on the wheel             │  h2
│ [Suggested picks|Our club’s list]
│ Add a book                     │  label
│ [ Title or author           ]  │  input
│ Searches go to Open Library, a │  help
│ free book catalog. Your list   │
│ stays on your device.          │
│ ┌────────────────────────────┐ │  listbox (only while open)
│ │ Circe                      │ │
│ │ Madeline Miller · 2018     │ │
│ │ Circe’s Daughter …         │ │
│ │ Add “circe” as typed       │ │
│ └────────────────────────────┘ │
│ 5 books on the wheel.          │  count line
│ Educated – Tara Westover  Remove│
│ Circe – Madeline Miller   Remove│
│ ▸ Edit as text                 │  details.own-list
│ ☐ Remove each pick after…      │
```

### Strings
- Label: **Add a book**
- Placeholder: **Title or author**
- Help (`aria-describedby`): **Searches go to Open Library, a free book catalog. Your list stays on your device.**
- Result row: title on line 1 (weight 750, wraps to two lines at most). Line 2 is dim: `Author · 2018`, or just the author, the year, or nothing if those are missing.
- Last option, shown whenever there is text: **Add “<text>” as typed**
- No results: a plain text line **No matches.** followed by the option **Add “<text>” as typed**
- Error, offline, or no answer after 8 seconds: a plain text line **Can’t search right now. Check your connection, or add it as typed.** followed by the option **Add “<text>” as typed**
- Still loading after 600 ms: a plain text line **Searching…** (not announced)
- Book already on the list: the row shows dim **Already on the list** in place of the year and has `aria-disabled="true"`. Selecting it announces **Circe is already on the list.**
- List is full (60 books, the share limit): **The wheel holds up to 60 books.** Nothing is added.

### Search rules
- Start searching at **3 characters**, after a **350 ms** pause in typing. Cancel the earlier request with `AbortController` and cache answers by query for the visit.
- Request: `https://openlibrary.org/search.json?q=<text>&fields=title,author_name,first_publish_year&limit=10`. Use `fetch` with `credentials: 'omit'` and `referrerPolicy: 'no-referrer'`. Send only the typed text. Before building, confirm the endpoint allows CORS.
- Remove duplicates by title plus first author and show **5 results** plus the "as typed" option. That is about 6 rows, which fits above the iPhone keyboard.
- Picking a result adds `Title – First author` (first author only, at most 120 characters) to the end of the list. Clear the input, close the list, and keep focus in the input so people can add the next book right away.
- Treat all API text as plain text (`textContent`). Never insert it as HTML.

### Combobox (WAI-ARIA 1.2, list popup)
- `<input type="text" role="combobox" aria-autocomplete="list" aria-expanded aria-controls="book-results" aria-activedescendant autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">`
- `<ul id="book-results" role="listbox" aria-label="Matching books">` goes **directly after the input in the DOM**, so a swipe from the input reaches it. Each result is an `<li role="option" id="…">`, and the active one has `aria-selected="true"`.
- Give each option an accessible name in one sentence, using visually hidden text where needed: "Circe, by Madeline Miller, 2018". The "No matches." and "Searching…" lines are not options.
- Keys: Down and Up move the active option and wrap around. Down also opens the list if there are results. Enter adds the active option. If no option is active, Enter adds the text as typed (if not empty). Escape closes the list, and a second Escape clears the input. Tab closes the list without adding anything.
- Mouse and touch: tapping a row adds it. Use `pointerdown` with `preventDefault` on rows so the input keeps focus.
- **Don't close the list on `blur`.** iOS VoiceOver and TalkBack can blur the input while the user swipes into the options. Close it on Escape, on a tap outside the input and list, on `focusin` anywhere else, or after an add.
- Announcements go in one hidden polite live region (`#club-live`, `.sr-only`), separate from the visible count line:
  - after results load: **5 books found.** / **No matches.** / **Can’t search right now.**
  - after an add: **Added Circe by Madeline Miller. 5 books on the wheel.**
  - after a remove: **Removed Circe. 4 books on the wheel.**
  - Don't announce "Searching…" or anything on each keystroke.
- Active option style: yellow background with plum text, like a pressed chip. Rows are at least 56px tall.
- **Contrast:** give the new input and the listbox a 2px `var(--cream-dim)` border. The current `--plum-2` border on the dark field is about 1.3:1 and fails 1.4.11 (3:1). The same problem affects the existing textareas and selects (see section 6).

### Count line (visible, not a live region)
- 0 books: **No books on the wheel yet. Add at least 2 to spin.**
- 1 book: **1 book on the wheel. Add 1 more to spin.**
- 2 or more: **5 books on the wheel.**

### List, remove, reorder
- Reuse `.book-list` and `.book-row`. Each row shows `Title – Author`, then a **Remove** text button with `aria-label="Remove Circe"`.
- After a remove, focus goes to the next row's Remove button. If there is no next row, it goes to the previous one. If the list is now empty, it goes to the search input.
- Empty list: show a single line in place of the list: **No books yet. Search above, or paste a list under “Edit as text”.**
- **No reorder controls.** Order doesn't change anyone's odds, and arrow buttons on every row add clutter. Anyone who cares can reorder in "Edit as text".

### Keep the textarea, collapsed
- Use `<details class="own-list">` with the summary **Edit as text**. Inside, the label is **Your club’s list, one book per line** and the help is the current text ("Add the author after a dash, like “Educated – Tara Westover”."). It's good for pasting a list from a group chat.
- Move **Shuffle list** in here. It doesn't change odds either.
- The textarea stays the single source of truth (`clubTA.value`). The list and the textarea update each other, and `currentItems()` keeps working as it does now.

## 3. Share clarity

- Button label: **Share a copy** (was "Share this wheel").
- Status after sharing (`#share-status`, already polite live):
  - Link copied: **Link copied. It shows these 5 books as they are now. Share again after you add more.**
  - Native share sheet completed: **Shared. The link shows these 5 books as they are now. Share again after you add more.** (Today this case clears the status.)
  - Fewer than 2 books (club list): **Add at least 2 books before you share.** For other lists, keep the current wording.
- Use the right noun: books, or names in Who hosts ("these 6 names").
- **Changed since the last share:** in club mode, store `{ sig, count, date }` for the last shared list in localStorage. "Share this result" counts as a share too. If the list now differs, show a static line (not live) under the buttons: **You’ve changed the list since you shared it on Nov 13. Share again so everyone gets the new list.** Hide it when the list is unchanged or hasn't been shared. Also add **Share again to send the new list.** to the end of the add and remove announcements while this is true.

### What the person who opens the link sees (`PartyShare.note`)
Current text: "Someone shared this wheel with you. The list was made by whoever sent the link, not The Party Wheel. Spin away, or change it below." It never says the list is a copy.

- Add the share date to the link data (`d: 'YYYY-MM-DD'`). When reading a link, accept it only if it matches `^\d{4}-\d{2}-\d{2}$`.
- Change `note(shared, nouns)` to take `{ one: 'book', many: 'books' }`. Pages that don't pass a noun use "choices".
- New wheel note: **This is a copy of 5 books shared on Nov 13. Changes you make won’t update anyone else’s wheel. The list was made by whoever sent the link, not The Party Wheel.**
- Older links with no date: **This is a copy of 5 books someone shared. Changes you make won’t update anyone else’s wheel. The list was made by whoever sent the link, not The Party Wheel.**
- Result link: **Someone shared their spin. Here’s where the wheel landed on their copy of 5 books from Nov 13. The list was made by whoever sent the link, not The Party Wheel.**
- Date format: `toLocaleDateString(undefined, { month: 'short', day: 'numeric' })`. Add the year if it isn't the current year.
- Keep the attribution sentence. It's an existing safety line.

## 4. Kindle link (`assets/links.js`)
- New store `kindle`: action **Read**, name **Kindle**. URL: `https://www.amazon.com/s?k=<terms>&i=digital-text`, with `&tag=` only when `IDS.amazon` is set (it's empty today, so this is a plain link). `aff: () => !!IDS.amazon`. Add `kindle: 'title+author'` to `SEARCH_STYLE`.
- Put it under **More**, between Amazon and Audible (print, ebook, audio). Relabel the More row by task, following the rule that links say task then place:
  `MORE = [['amazon', 'Buy on Amazon'], ['kindle', 'Read on Kindle'], ['audible', 'Listen on Audible']]`
  This also stops "Amazon Kindle" from reading as one link name.
- Give `.store-more a` a `min-height: 2.75rem` (about 42px today, under our 44px rule).
- Note: `count.js` logs clicks by domain, so Kindle and Amazon clicks will be counted together. If we want them separate, that's a count.js change (needs a security check).

## 5. Copy changes elsewhere on the page (need Mark's approval)
- Guide, "How to pick": "Choose “Our club’s list”, type them in, and spin." becomes **Tap “Use our club’s list”, search for each book, and spin.**
- FAQ "Is the wheel random?": "Your lists stay on your device and aren’t sent anywhere." becomes **Your list stays on your device. When you search for a book, only what you type is sent to Open Library, a free public book catalog.**
- The privacy page needs a matching sentence in "Your lists stay on your device" and an updated date. That goes to security and Mark.

## 6. Notes for testing (NVDA, TalkBack, iOS VoiceOver)
- **NVDA (Chrome/Firefox):** the combobox should switch NVDA to focus mode by itself. Arrowing through options should read each option's name and "x of 6". Check that "5 books found." is read once and isn't cut off by option reading.
- **TalkBack:** `aria-activedescendant` is mostly ignored. Swiping right from the input must reach the options in order, and double-tap must add a book. Make sure the keyboard closing doesn't close the list.
- **iOS VoiceOver:** same swipe check. Make sure the list stays open after a swipe (the blur rule above). Check that "Use our club’s list" moves VoiceOver focus to the search input. If it lands on the page top, focus the input after the scroll in a `requestAnimationFrame`.
- Everywhere: after Remove, focus must land where section 2 says. With 0–1 books, Spin is disabled and the first button reads "Add books to our list", which is the explanation. Also change `.spin-btn:disabled { cursor: wait }` to `not-allowed`. It's a small thing, but "wait" suggests something is loading.
- Existing issue (P2, separate fix): textarea, select, and `.text-input` borders (`--plum-2`) fail 1.4.11 against their fields. Use the `--cream-dim` border sitewide.

## 7. Out of scope, flag to coordinator
- Opening a shared link overwrites the receiver's own saved club list with no warning or undo. This is a data-loss risk for members who keep their own list. Suggest a follow-up: keep the old list and add a "Restore my list" button to the shared note.
