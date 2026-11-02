// Start a book club: name ideas + year planner. Everything runs in the browser.
// Nothing typed here is sent anywhere; the calendar file and shared text are built locally.
(function () {
  const $ = (id) => document.getElementById(id);
  const rand = (n) => { const r = new Uint32Array(1); crypto.getRandomValues(r); return r[0] % n; };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const lines = (t) => t.split('\n').map((s) => s.trim()).filter(Boolean);

  // ---------- Name ideas ----------
  const NAMES = {
    funny: ['Read Between the Wines', 'The Unfinished Chapter', 'Spoiler Alert Society', 'The Mostly Read Club', 'Bound to Be Late', 'Chapter and Snack', 'The Page Skippers', 'Novel Excuses', 'We Read the Ending First', 'The Overdue Fines', 'Book It and Leave It', 'Prose Before Woes', 'The Dog-Eared Dozen', 'Lit and Run', 'Shelf Control'],
    classy: ['The Gilded Page', 'The Margin Notes Society', 'The Evening Chapter', 'The Ink & Oak Circle', 'The Lantern Readers', 'The Velvet Bookmark', 'The Quiet Hour Readers', 'The First Edition Circle', 'The Reading Room Society', 'The Fireside Literary Circle', 'The Parchment Club'],
    wine: ['Wine & Words', 'Pour Me a Chapter', 'Corks & Covers', 'The Cabernet Chapter', 'Sips & Spines', 'The Merlot Readers', 'Uncorked Book Club', 'Vino & Verses', 'Bubbles & Bookmarks', 'Cheese, Wine & Fine Lines', 'The Rosé Readers', 'Tea, Toast & Tomes'],
    mystery: ['The Whodunit Club', 'The Red Herring Society', 'Clue Crew', 'The Plot Thickens', 'The Midnight Sleuths', 'Read It and Weep', 'The Cold Case Readers', 'The Locked Room Club', 'Suspects & Snacks', 'The Twist Ending Society'],
    romance: ['Swoon Society', 'The Happily Ever Readers', 'Slow Burn Book Club', 'The Meet-Cute Club', 'Hearts & Hardcovers', 'Love Between the Lines', 'The Enemies to Readers', 'Chapter of Hearts', 'The Swoon Squad', 'Romance & Rosé'],
    scifi: ['The Time Travelers Book Club', 'Beyond the Last Page', 'The Dragon Readers', 'Parallel Pages', 'The Starship Book Club', 'Worlds Away Readers', 'The Spellbound Society', 'Orbit & Ink', 'The Quest Readers', 'Future Shelf'],
  };
  const TOWN = ['{t} Page Turners', 'The {t} Reading Room', '{t} Book Bunch', 'Novel Neighbors of {t}', '{t} Bookworms', 'The {t} Shelf Society', '{t} Readers Circle', 'Chapters on {t}'];
  const VIBES = [['funny', 'Funny'], ['classy', 'Classy'], ['wine', 'Wine & snacks'], ['mystery', 'Mystery'], ['romance', 'Romance'], ['scifi', 'Sci-fi & fantasy']];
  let vibe = 'funny';
  let deck = [];

  function townWord() { return $('town').value.replace(/[^\p{L}\p{N} '’.-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 30); }
  function buildDeck() {
    const t = townWord();
    const base = NAMES[vibe].slice();
    const town = t ? shuffle(TOWN.slice()).slice(0, 4).map((p) => p.replace('{t}', t)) : [];
    deck = shuffle(base.concat(town));
  }
  function showNames() {
    if (deck.length < 6) buildDeck();
    const pick = deck.splice(0, 6);
    const ul = $('names');
    ul.innerHTML = '';
    pick.forEach((n) => { const li = document.createElement('li'); li.textContent = n; ul.append(li); });
  }
  const vibeWrap = $('vibes');
  VIBES.forEach(([id, label]) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.vibe = id; b.textContent = label;
    b.setAttribute('aria-pressed', id === vibe ? 'true' : 'false');
    b.addEventListener('click', () => {
      vibe = id;
      vibeWrap.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.vibe === id ? 'true' : 'false'));
      buildDeck(); showNames();
    });
    li.append(b); vibeWrap.append(li);
  });
  $('more-names').addEventListener('click', showNames);
  let townTimer;
  $('town').addEventListener('input', () => { clearTimeout(townTimer); townTimer = setTimeout(() => { buildDeck(); showNames(); }, 400); });
  buildDeck(); showNames();

  // ---------- Year planner ----------
  const STORE_KEY = 'pp-planner-v1';
  const PICKER_KEY = 'pp-bookclub-v2';
  const MAX_BOOKS = 12;
  const booksTA = $('plan-books'), hostsTA = $('plan-hosts');
  const fields = ['plan-start', 'plan-time', 'plan-week', 'plan-day'];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) {} },
  };
  const save = () => {
    const v = { books: booksTA.value, hosts: hostsTA.value, shuffle: $('plan-shuffle').checked };
    fields.forEach((f) => { v[f] = $(f).value; });
    store.set(v);
  };

  // Default first month: next month.
  const now = new Date();
  const nm = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  $('plan-start').value = `${nm.getFullYear()}-${String(nm.getMonth() + 1).padStart(2, '0')}`;

  const saved = store.get(STORE_KEY);
  if (saved) {
    booksTA.value = saved.books || ''; hostsTA.value = saved.hosts || '';
    if (typeof saved.shuffle === 'boolean') $('plan-shuffle').checked = saved.shuffle;
    fields.forEach((f) => { if (saved[f]) $(f).value = saved[f]; });
  } else {
    // First visit: borrow the club list and members from the book club picker, if any.
    const p = store.get(PICKER_KEY);
    const got = [];
    if (p && typeof p.club === 'string' && p.club.trim()) { booksTA.value = lines(p.club).slice(0, MAX_BOOKS).join('\n'); got.push('your club’s list'); }
    if (p && typeof p.hosts === 'string' && p.hosts.trim()) { hostsTA.value = lines(p.hosts).join('\n'); got.push('members'); }
    if (got.length) { const n = $('prefill-note'); n.textContent = `We filled in ${got.join(' and ')} from the book club picker on this device. Change anything you like.`; n.hidden = false; }
  }
  [booksTA, hostsTA, $('plan-shuffle')].concat(fields.map($)).forEach((el) => el.addEventListener('change', save));
  [booksTA, hostsTA].forEach((el) => el.addEventListener('input', save));

  // The nth weekday of a month; week 5 means the last one.
  function meetingDate(year, month, week, day) {
    if (week === 5) {
      const d = new Date(year, month + 1, 0);
      while (d.getDay() !== day) d.setDate(d.getDate() - 1);
      return d;
    }
    const d = new Date(year, month, 1);
    while (d.getDay() !== day) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + (week - 1) * 7);
    return d;
  }

  let plan = [];
  const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  function makePlan() {
    const status = $('plan-status');
    let books = lines(booksTA.value);
    if (books.length < 1) { status.textContent = 'Add at least one book first.'; $('plan-output').hidden = true; booksTA.focus(); return; }
    const extra = books.length > MAX_BOOKS;
    books = books.slice(0, MAX_BOOKS).map((b) => b.slice(0, 120));
    const hosts = lines(hostsTA.value).map((h) => h.slice(0, 60)).slice(0, 40);
    const mix = $('plan-shuffle').checked;
    if (mix) shuffle(books);
    let hostOrder = [], lastHost = '';
    const nextHost = () => {
      if (!hosts.length) return '';
      if (!hostOrder.length) {
        hostOrder = mix ? shuffle(hosts.slice()) : hosts.slice();
        // Don't let the same person host twice in a row when a new round starts.
        if (hostOrder.length > 1 && hostOrder[0] === lastHost) hostOrder.push(hostOrder.shift());
      }
      lastHost = hostOrder.shift();
      return lastHost;
    };
    const [y, m] = $('plan-start').value.split('-').map(Number);
    const startY = y || nm.getFullYear(), startM = (m || nm.getMonth() + 1) - 1;
    const [hh, mm] = ($('plan-time').value || '19:00').split(':').map(Number);
    const week = Number($('plan-week').value), day = Number($('plan-day').value);
    plan = books.map((book, i) => {
      const d = meetingDate(startY, startM + i, week, day);
      d.setHours(hh || 0, mm || 0, 0, 0);
      return { date: d, book, host: nextHost() };
    });

    const ol = $('plan-list');
    ol.innerHTML = '';
    plan.forEach((p) => {
      const li = document.createElement('li');
      const when = document.createElement('p'); when.className = 'plan-when'; when.textContent = `${fmtDate(p.date)} · ${fmtTime(p.date)}`;
      const what = document.createElement('p'); what.className = 'plan-book'; what.textContent = p.book;
      li.append(when, what);
      if (p.host) { const who = document.createElement('p'); who.className = 'plan-host'; who.textContent = `Host: ${p.host}`; li.append(who); }
      ol.append(li);
    });
    $('plan-output').hidden = false;
    status.textContent = `${plan.length} meeting${plan.length === 1 ? '' : 's'} planned.` + (extra ? ' Only the first 12 books were used.' : '');
    $('plan-make').textContent = mix ? 'Shuffle again' : 'Update schedule';
    $('plan-title').focus();
    save();
  }
  $('plan-make').addEventListener('click', makePlan);

  // ---------- Calendar file (.ics) ----------
  const pad = (n) => String(n).padStart(2, '0');
  const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const icsText = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/[\r\n]+/g, ' ');
  // Lines over 75 octets must be folded (RFC 5545).
  const fold = (line) => {
    const out = []; let cur = '', bytes = 0;
    for (const ch of line) {
      const b = new TextEncoder().encode(ch).length;
      if (bytes + b > 74) { out.push(cur); cur = ' '; bytes = 1; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join('\r\n');
  };
  $('plan-ics').addEventListener('click', () => {
    if (!plan.length) return;
    const stamp = new Date();
    const utc = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;
    const id = Math.random().toString(36).slice(2, 10);
    const ev = plan.flatMap((p, i) => [
      'BEGIN:VEVENT',
      `UID:${id}-${i}@thepartywheel.com`,
      `DTSTAMP:${utc}`,
      `DTSTART:${icsDate(p.date)}`,
      'DURATION:PT2H',
      `SUMMARY:${icsText('Book club: ' + p.book)}`,
      p.host ? `DESCRIPTION:${icsText('Host: ' + p.host)}` : null,
      'END:VEVENT',
    ].filter(Boolean));
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The Party Wheel//Book club planner//EN', 'CALSCALE:GREGORIAN'].concat(ev, ['END:VCALENDAR']).map(fold).join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'book-club-schedule.ics';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    $('plan-share-status').textContent = 'Calendar file downloaded. Open it to add the dates, or send it to your group.';
  });

  // ---------- Share as text / print ----------
  const planText = () => 'Our book club schedule\n\n' + plan.map((p) => `${fmtDate(p.date)}, ${fmtTime(p.date)}: ${p.book}` + (p.host ? ` (host: ${p.host})` : '')).join('\n') + '\n\nMade with thepartywheel.com/start-a-book-club/';
  $('plan-share').addEventListener('click', async () => {
    if (!plan.length) return;
    const st = $('plan-share-status');
    const text = planText();
    try {
      if (navigator.share) { await navigator.share({ title: 'Our book club schedule', text }); st.textContent = ''; return; }
      await navigator.clipboard.writeText(text);
      st.textContent = 'Schedule copied. Paste it in your group chat.';
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      window.prompt('Copy your schedule:', text);
    }
  });
  $('plan-print').addEventListener('click', () => window.print());
})();
