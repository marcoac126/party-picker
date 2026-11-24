// Party game library. Each entry: [name, type, minPlayers, maxPlayers, oneLiner]
// Optional 6th field: occasions, space-separated, e.g. 'holiday' or 'holiday thanksgiving'.
// 'holiday' = Occasion: Holiday party. 'thanksgiving' = Occasion: Thanksgiving.
// Types: free (no supplies), paper (pen & paper), card (card games to buy), board (board games to buy).
// Free and pen-and-paper games show the one-liner as quick rules.
// Card and board games show "Watch how to play" + a store link (affiliate-ready via assets/links.js).
window.PARTY_GAMES = [
  // No supplies needed
  ['Charades', 'free', 4, 20, 'Split into teams. Act out a movie, song, or book without talking while your team guesses before time runs out.', 'holiday thanksgiving'],
  ['Two Truths and a Lie', 'free', 3, 20, 'Each person shares three “facts” about themselves. Everyone guesses which one is the lie.', 'holiday thanksgiving'],
  ['Twenty Questions', 'free', 2, 10, 'One person thinks of something. Everyone else gets 20 yes-or-no questions to figure out what it is.', 'thanksgiving'],
  ['Would You Rather', 'free', 2, 20, 'Take turns asking impossible choices, like “fly or be invisible?” Everyone answers and defends their pick.', 'thanksgiving'],
  ['Mafia', 'free', 6, 20, 'A narrator secretly picks a few “mafia.” Each night they strike; each day the town debates and votes out a suspect.'],
  ['Telephone', 'free', 6, 20, 'Whisper a sentence down the line, one person at a time. The last person says it out loud. Compare to the original.', 'thanksgiving'],
  ['Hot Seat', 'free', 4, 15, 'One person sits in the hot seat and answers rapid-fire questions from everyone else for two minutes.'],
  ['Story Chain', 'free', 3, 15, 'Build a story one sentence at a time, going around the room. Bonus: each sentence must start with the next letter of the alphabet.', 'thanksgiving'],
  ['Wink Murder', 'free', 6, 20, 'One secret “murderer” eliminates players by winking at them. A detective tries to catch them in the act.', 'thanksgiving'],
  ['Contact', 'free', 4, 10, 'One player guards a secret word. Others give clues to each other to “make contact” on words that start with the revealed letters.'],
  ['Ghost', 'free', 2, 8, 'Take turns adding a letter to a growing word. Whoever completes a real word, or can’t continue, gets a letter of G-H-O-S-T.'],

  // Pen & paper
  ['Fishbowl', 'paper', 6, 20, 'Everyone writes names on slips. Teams guess them three rounds in a row: describe them, then one word only, then charades.', 'holiday thanksgiving'],
  ['Telephone Pictionary', 'paper', 5, 15, 'Write a phrase, pass it on, draw it, pass it on, describe the drawing. See how far it drifts by the end.', 'holiday thanksgiving'],
  ['Categories', 'paper', 2, 10, 'Pick a letter and a list of categories. Everyone writes one answer per category starting with that letter. Unique answers score.', 'thanksgiving'],
  ['Who Am I?', 'paper', 4, 15, 'Stick a famous name on each person’s forehead. Ask yes-or-no questions to figure out who you are.', 'thanksgiving'],
  ['Pictionary (DIY)', 'paper', 4, 16, 'Teams take turns drawing words from a hat while their teammates race to guess. No talking or letters allowed.', 'thanksgiving'],

  // Card games
  ['Codenames', 'card', 4, 8, 'Two spymasters give one-word clues to help their team find their secret agents on a grid of words.', 'holiday thanksgiving'],
  ['Wavelength', 'card', 2, 12, 'Read your team’s mind: give a clue that lands on a hidden spot between two opposites, like “hot” and “cold.”', 'holiday thanksgiving'],
  ['Exploding Kittens', 'card', 2, 5, 'A fast, silly card game of dodging exploding kittens with defuses, skips, and sneaky steals.'],
  ['Uno', 'card', 2, 10, 'Match colors or numbers and be the first to empty your hand. Don’t forget to yell “Uno.”', 'thanksgiving'],
  ['Telestrations', 'card', 4, 8, 'The board-game version of Telephone Pictionary, with sketchbooks for everyone.', 'holiday thanksgiving'],
  ['Just One', 'card', 3, 7, 'Everyone writes a one-word clue to help one guesser. Matching clues get cancelled, so be original.', 'holiday thanksgiving'],
  ['Monikers', 'card', 4, 16, 'A boxed version of Fishbowl with hilarious ready-made cards across three rounds.', 'holiday'],
  ['Taboo', 'card', 4, 10, 'Get your team to say the word on the card without saying any of the forbidden words listed below it.'],
  ['Apples to Apples', 'card', 4, 10, 'A judge plays a describing word; everyone else plays the noun that fits best, or funniest.', 'thanksgiving'],
  ['Sushi Go!', 'card', 2, 5, 'Pick a card and pass the rest. Collect the best combos of sushi dishes over three quick rounds.'],
  ['Love Letter', 'card', 2, 6, 'A tiny game of deduction and luck with just a handful of cards. Rounds take a few minutes.'],
  ['Coup', 'card', 2, 6, 'Bluff about which characters you hold to steal coins and knock out rivals. Call others’ bluffs at your own risk.'],
  ['Skull', 'card', 3, 6, 'A pure bluffing game: bet on how many flowers you can flip without hitting a skull.'],
  ['Herd Mentality', 'card', 4, 20, 'Answer questions trying to match what most people say. Be the odd one out and you get the pink cow.', 'holiday thanksgiving'],
  ['Spyfall', 'card', 3, 8, 'Everyone knows the location except the spy. Ask questions to find the spy before they figure out where you are.'],
  ['Decrypto', 'card', 3, 8, 'Teams send coded messages using secret words, while the other team tries to crack the code.'],
  ['Monopoly Deal', 'card', 2, 5, 'The quick card version of Monopoly: collect three full property sets to win.'],
  ['One Night Ultimate Werewolf', 'card', 3, 10, 'A one-round, ten-minute werewolf game where everyone has a secret role and roles get swapped in the night.'],
  ['The Resistance: Avalon', 'card', 5, 10, 'Loyal knights complete quests while hidden traitors try to sabotage them. Lots of accusing and lying.'],
  ['Werewords', 'card', 4, 10, 'Guess the secret word with yes-or-no questions, but a hidden werewolf knows it and steers you wrong.'],

  // Board games
  ['Ticket to Ride', 'board', 2, 5, 'Collect train cards and claim railway routes across the map to connect cities.', 'holiday thanksgiving'],
  ['Catan', 'board', 3, 4, 'Gather and trade resources to build roads, settlements, and cities on an island.'],
  ['Azul', 'board', 2, 4, 'Draft colorful tiles to decorate a palace wall. Easy to learn, surprisingly cutthroat.'],
  ['Splendor', 'board', 2, 4, 'Collect gems to buy cards that earn more gems and attract nobles. Quick and strategic.'],
  ['Wingspan', 'board', 1, 5, 'Build a nature preserve by attracting birds, each with its own powers.'],
  ['Pandemic', 'board', 2, 4, 'Work together as a team to stop four diseases from spreading around the world.'],
  ['Dixit', 'board', 3, 6, 'Give a clue for a dreamlike picture card. Not too obvious, not too vague, so only some players guess it.'],
  ['Mysterium', 'board', 2, 7, 'A ghost gives silent picture clues to help psychics solve its murder.'],
  ['Clue', 'board', 2, 6, 'Figure out who did it, where, and with what before anyone else.'],
  ['Scrabble', 'board', 2, 4, 'Build words on the board from letter tiles to score the most points.'],
  ['Jenga', 'board', 2, 8, 'Take turns pulling blocks from the tower and stacking them on top without knocking it over.', 'holiday thanksgiving'],
  ['Blokus', 'board', 2, 4, 'Fit your colored pieces onto the board, touching only at corners, while blocking everyone else.'],
  ['Trivial Pursuit', 'board', 2, 6, 'Answer trivia across six categories to fill your wedge pie. Play in teams for bigger groups.'],

  // Holiday party games (Occasion: Holiday party)
  ['White Elephant Gift Swap', 'free', 6, 30, 'Everyone brings a wrapped gift. Draw numbers; on your turn, open a new gift or steal one that’s already been opened.', 'holiday'],
  ['Christmas Song Charades', 'free', 4, 20, 'Act out holiday song titles without talking while your team races to guess.', 'holiday'],
  ['Name That Holiday Tune', 'free', 4, 20, 'Hum or play the first few seconds of a holiday song. First to name it scores.', 'holiday'],
  ['Holiday Trivia', 'free', 2, 20, 'Quiz each other on holiday movies, songs, and traditions. Play in teams for bigger groups.', 'holiday'],
  ['Pass the Parcel', 'free', 5, 20, 'Wrap a small prize in many layers. Pass it while music plays; when the music stops, unwrap one layer. The last layer wins.', 'holiday'],
  ['Holiday Who Am I?', 'paper', 4, 15, 'Stick a holiday character on each forehead, like Santa, Rudolph, or the Grinch, and ask yes-or-no questions to guess yours.', 'holiday'],
  ['Holiday Pictionary', 'paper', 4, 16, 'Draw holiday words from a hat, from snowman to fruitcake, while your team races to guess.', 'holiday'],
  ['Ornament Switcharoo', 'free', 2, 20, 'Fill one bowl with red and one with green shatterproof ornaments. Race the timer to move every ornament into the other bowl, one at a time; fastest swap wins.', 'holiday'],
  ['Candy Cane Fishing', 'free', 2, 20, 'Tie a candy cane to a string around your waist and stand more canes upright in a bucket of dry rice. No hands: hook as many as you can before time runs out. Keep candy canes out of mouths.', 'holiday'],
  ['Gift Grab', 'free', 4, 20, 'Put out half as many soft gifts as players. A caller shouts body parts to touch, then “gift!” and everyone grabs one; anyone empty-handed sits out the next round. Clear breakables and give players room.', 'holiday'],
  ['Bow Scoop', 'free', 2, 20, 'Blindfolded, use a plastic spatula to scoop gift bows into a bowl; clear the floor and have a spotter. Most bows before the timer wins.', 'holiday'],

  // Thanksgiving / Friendsgiving (Occasion: Thanksgiving)
  ['Thanksgiving Trivia', 'free', 2, 20, 'Quiz each other on feast foods, parades, football, and family traditions. Play in teams for bigger groups.', 'thanksgiving'],
  ['Name Five', 'free', 2, 15, 'Someone calls out a category, like “pies” or “things in a fridge.” The next player has ten seconds to name five.', 'thanksgiving'],
  ['I’m Going on a Picnic', 'free', 2, 15, 'Say “I’m bringing…” plus one dish. Each player repeats the whole list and adds one more. Forget one and you’re out.', 'thanksgiving'],
  ['Name That Tune', 'free', 4, 20, 'Hum the first few notes of a song everyone might know. First person to name it scores a point.', 'thanksgiving'],
  ['Thankful ABCs', 'free', 2, 20, 'Go around the table naming one thing you’re glad about, A to Z. Silly answers count, like “zippers.”', 'thanksgiving'],
  ['Fold-Over Drawings', 'paper', 3, 10, 'Draw a head, fold the paper to hide it, and pass it on. Next person adds a body, then legs. Unfold for a laugh.', 'thanksgiving'],
  ['Consequences', 'paper', 4, 12, 'Write a name, fold, pass. Keep going with who they met, where, and what happened. Read the stories out loud.', 'thanksgiving']
];
