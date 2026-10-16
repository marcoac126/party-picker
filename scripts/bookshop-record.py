# Records Bookshop list-upload results: accepted ISBNs go into book-club-picker/isbns.js, all results into docs/bookshop/results.json.
# Usage (repo root): python3 scripts/bookshop-record.py docs/bookshop/<file>-candidates.json <genre|all> "<paste of Bookshop's 'Could not find books with EANs: ...' message, or empty>"
import json, re, sys
cand, genre, rejtxt = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else ''
rej = set(re.findall(r'97[89]\d{10}', rejtxt))
d = json.load(open(cand))
picks = [p for p in d['picks'] if genre == 'all' or p['genre'] == genre]
unknown = [i for i in rej if i not in {p['isbn'] for p in picks}]
ok = [p for p in picks if p['isbn'] not in rej]; bad = [p for p in picks if p['isbn'] in rej]
path = 'book-club-picker/isbns.js'; s = open(path).read()
m = re.search(r'window\.BOOK_ISBNS\s*=\s*(\{[\s\S]*?\});', s); cur = json.loads(m.group(1))
for x in ok: cur[x['key']] = x['isbn']
s = s[:m.start(1)] + json.dumps(dict(sorted(cur.items())), indent=1) + s[m.end(1):]; open(path, 'w').write(s)
r = json.load(open('docs/bookshop/results.json'))
for x in picks:
    g = r.setdefault(x['genre'], {'accepted': [], 'rejected': []})
    if x in ok: g['accepted'] = sorted(set(g['accepted']) | {x['isbn']})
    else: g['rejected'] = sorted(set(g['rejected']) | {x['isbn']})
json.dump(r, open('docs/bookshop/results.json', 'w'), indent=1)
print('accepted', len(ok), [x['title'] for x in ok]); print('rejected', len(bad), [x['title'] for x in bad]); print('unknown', unknown); print('total confirmed', len(cur))
