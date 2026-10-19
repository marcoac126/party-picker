# Monthly book club pick (started 2026-10-15)

One pin a month on Pinterest plus a "This month's pick" box on the book club page, both showing the same book.

## Rules
- **Genre rotation** (fixed, starts Nov 2026): contemporary fiction → mystery & thriller → romance → sci-fi & fantasy → nonfiction → classics → frequently challenged → repeat.
- **Fair pick:** `node scripts/monthly-pick.mjs YYYY-MM` picks uniformly at random (crypto) from that genre's club favorites that have a confirmed Bookshop ISBN, never repeating an earlier pick. History: `docs/marketing/monthly-picks.json`. Never re-roll to get a "better" book.
- **Pin image:** `node scripts/monthly-pin.mjs` → `docs/marketing/pins/monthly-YYYY-MM.jpg` (1000×1500). Text and our wheel only: no book covers, no store logos.
- **Site box:** `book-club-picker/monthly-pick.js`; shows only during that month, with Bookshop, library, and Libro.fm links plus the disclosure.
- **Approval:** prep happens on a branch `monthly-pick-YYYY-MM`. Nothing reaches main (the live site) until Mark says go. Mark posts the pin himself; agents never post.
- **Pin goes up:** first Monday of the month (also bestseller refresh day), Book Club Ideas board, section "Book Club Picker", linking to https://thepartywheel.com/book-club-picker/.
- **Stop rule:** review after 3 months (Feb 2027) with Pinterest per-pin outbound clicks; stop if the monthly pins average under 5 outbound clicks each.
