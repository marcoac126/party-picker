// White elephant gift ideas. Each entry: [idea, price, vibe, amazonSearch, whyItWorks]
// Price bands are typical prices, not guarantees: u10 = under $10, u25 = $10–25, u50 = $25–50.
// Vibes: funny, useful, cozy, food, games. Keep ideas generic (no single product/brand to go stale).
window.GIFT_IDEAS = [
  // Under $10
  ['Christmas pickle ornament', 'u10', 'funny', 'christmas pickle ornament', 'Comes with a tradition: whoever finds it on the tree gets a prize.', 'Pickle ornament'],
  ['Rubber chicken', 'u10', 'funny', 'rubber chicken', 'Pointless, loud, and someone will steal it.'],
  ['Prank gift box', 'u10', 'funny', 'prank gift box', 'A fake, ridiculous product box to wrap a real gift in.'],
  ['BeanBoozled jelly beans', 'u10', 'food', 'beanboozled jelly beans', 'Half are tasty, half taste like dirty socks. Good for a laugh at the party.', 'BeanBoozled'],
  ['Gourmet hot cocoa', 'u10', 'food', 'gourmet hot cocoa gift', 'Easy win in winter. Nobody says no to hot chocolate.', 'Hot cocoa'],
  ['Hand warmers', 'u10', 'useful', 'hand warmers', 'Small, cheap, and everyone uses them on cold mornings.'],
  ['Phone stand', 'u10', 'useful', 'adjustable phone stand', 'Sits on a desk or nightstand and gets used every day.'],
  ['Fuzzy socks', 'u10', 'cozy', 'fuzzy socks', 'The classic cozy gift. Pick a fun pattern.'],
  ['Mini candle', 'u10', 'cozy', 'holiday scented candle small', 'A winter scent like pine or cinnamon works for anyone.'],
  ['Pocket UNO', 'u10', 'games', 'uno card game', 'Everyone knows how to play, and it fits in a pocket.'],
  ['Rubik’s Cube', 'u10', 'games', 'rubiks cube', 'Someone at the party will try to solve it on the spot.'],
  ['Spot It!', 'u10', 'games', 'spot it card game', 'Fast matching game for all ages, in a small tin.'],

  // $10 to $25
  ['Emotional support pickle', 'u25', 'funny', 'emotional support pickle plush', 'A smiling plush pickle. Somehow everyone wants it.', 'Support pickle'],
  ['Bob Ross Chia Pet', 'u25', 'funny', 'bob ross chia pet', 'Grows a happy little afro. Great gag gift that works.', 'Bob Ross Chia'],
  ['Toilet golf set', 'u25', 'funny', 'toilet golf game', 'A tiny putting green for the bathroom. Guaranteed laugh.'],
  ['Rechargeable lighter', 'u25', 'useful', 'rechargeable electric lighter', 'No fuel, charges by USB. Handy for candles and grills.', 'USB lighter'],
  ['Insulated tumbler', 'u25', 'useful', 'insulated tumbler with lid', 'Keeps coffee hot and drinks cold. Everyone uses one.', 'Tumbler'],
  ['Portable phone charger', 'u25', 'useful', 'portable phone charger power bank', 'The gift people end up glad they stole.', 'Phone charger'],
  ['Mini waffle maker', 'u25', 'food', 'mini waffle maker', 'Small, cute, and makes waffles in minutes.', 'Waffle maker'],
  ['Hot sauce sampler', 'u25', 'food', 'hot sauce gift set', 'A few bottles from mild to very hot.', 'Hot sauce set'],
  ['Gourmet popcorn tin', 'u25', 'food', 'gourmet popcorn tin', 'Easy to share at the party or take home.', 'Popcorn tin'],
  ['Sherpa throw blanket', 'u25', 'cozy', 'sherpa throw blanket', 'Soft, warm, and always one of the most-stolen gifts.', 'Sherpa blanket'],
  ['Large scented candle', 'u25', 'cozy', 'large scented candle', 'A nicer candle feels like a treat.', 'Big candle'],
  ['Cocoa mug gift set', 'u25', 'cozy', 'hot cocoa mug gift set', 'A mug plus cocoa. Ready to use that night.', 'Cocoa mug set'],
  ['Exploding Kittens', 'u25', 'games', 'exploding kittens card game', 'A quick, silly card game for 2 to 5 players.'],
  ['Codenames', 'u25', 'games', 'codenames board game', 'A favorite team word game for groups.'],
  ['Taco Cat Goat Cheese Pizza', 'u25', 'games', 'taco cat goat cheese pizza game', 'A fast slapping game that gets loud.', 'Taco Cat Goat'],
  ['Jenga', 'u25', 'games', 'jenga game', 'Everyone knows it, and it works for any age.'],

  // $25 to $50
  ['Inflatable dinosaur costume', 'u50', 'funny', 'inflatable dinosaur costume adult', 'Someone will put it on before the party is over.', 'Dino costume'],
  ['Giant gummy bear', 'u50', 'funny', 'giant gummy bear', 'Weighs about as much as a newborn. Nobody needs it. Everyone wants it.', 'Giant gummy'],
  ['Big Mouth Billy Bass', 'u50', 'funny', 'big mouth billy bass', 'The singing fish on a plaque. A white elephant legend.', 'Billy Bass'],
  ['Electric wine opener', 'u50', 'useful', 'electric wine opener set', 'Opens a bottle with one button. Popular every year.', 'Wine opener'],
  ['Portable Bluetooth speaker', 'u50', 'useful', 'portable bluetooth speaker waterproof', 'Useful anywhere, from the shower to the backyard.', 'Speaker'],
  ['Rechargeable hand warmer', 'u50', 'useful', 'rechargeable hand warmer', 'Doubles as a phone charger. Great for cold commutes.', 'USB hand warmer'],
  ['Heated throw blanket', 'u50', 'cozy', 'heated throw blanket', 'Top-tier cozy. Expect it to get stolen more than once.', 'Heated blanket'],
  ['Plush robe', 'u50', 'cozy', 'plush fleece robe', 'Soft and warm, for weekend mornings.'],
  ['Candle warmer lamp', 'u50', 'cozy', 'candle warmer lamp', 'Melts candles from the top so they last longer, with no flame.', 'Candle warmer'],
  ['Charcuterie board set', 'u50', 'food', 'charcuterie board set', 'Board, knives, and little forks. Ready for the next party.', 'Charcuterie set'],
  ['Cocktail smoker kit', 'u50', 'food', 'cocktail smoker kit', 'Adds a smoky flavor to drinks. Fun to show off.', 'Drink smoker'],
  ['Hot sauce making kit', 'u50', 'food', 'hot sauce making kit', 'Make your own hot sauce at home.', 'Hot sauce kit'],
  ['Herd Mentality', 'u50', 'games', 'herd mentality board game', 'Everyone tries to give the same answer as the group. Works for any crowd.'],
  ['Telestrations', 'u50', 'games', 'telestrations game', 'The drawing version of Telephone. Hilarious with 6 or more.'],
  ['Wavelength', 'u50', 'games', 'wavelength board game', 'A team guessing game that sparks great debates.']
];
