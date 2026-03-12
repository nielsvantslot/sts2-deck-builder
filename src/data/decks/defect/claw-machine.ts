import type { FeaturedDeck } from '../index'

export const clawMachine: FeaturedDeck = {
  id: 'the-claw-machine',
  name: 'The Claw Machine',
  character: 'Defect',
  characterId: 'defect',
  strategy:
    'Abuse 0-cost cards and Claw\'s permanent scaling. Every time any Claw is played, ALL Claws gain +2 damage permanently. Feral (2 energy Power) returns the first 0-cost Attack to your hand each turn — guaranteed Claw recycling. All for One (2 energy) deals 10 damage AND pulls every 0-cost card from discard back to hand for another burst. Fill the deck with efficient 0-cost cards: FTL (draw 1), Beam Cell (1 Vulnerable), Go for the Eyes (3 Weak), TURBO (+1 energy), Overclock (draw 2). Play 5+ cards per turn for free, then spend 2-3 energy on All for One or other payoffs. Echo Form doubles All for One for a complete hand refill. By mid-combat each Claw hits for 15+ and the machine runs itself.',
  pickups: [
    // Core: The scaling engine and hand-refill loop
    { title: 'Claw', count: 3, priority: 'core' },
    { title: 'All for One', count: 1, priority: 'core' },
    { title: 'Feral', count: 1, priority: 'core' },
    // High: Efficient 0-cost cards that fuel the machine
    { title: 'FTL', count: 2, priority: 'high' },
    { title: 'Go for the Eyes', count: 1, priority: 'high' },
    { title: 'TURBO', count: 1, priority: 'high' },
    { title: 'Scrape', count: 1, priority: 'high' },
    { title: 'Echo Form', count: 1, priority: 'high' },
    // Situational: Nice extras, but the core loop runs without them
    { title: 'Beam Cell', count: 1, priority: 'situational' },
    { title: 'Overclock', count: 1, priority: 'situational' },
    { title: 'Hologram', count: 1, priority: 'situational' },
    { title: 'Machine Learning', count: 1, priority: 'situational' },
    { title: 'Boot Sequence', count: 1, priority: 'situational' },
    { title: 'Momentum Strike', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Defend', reason: 'The deck is all-in on 0-cost offense. Consider removing 1 if you need room for more Claws.' },
  ],
  combos: [
    {
      name: 'Claw Stacking',
      description:
        'Each Claw play increases ALL Claw damage by +2 permanently. With 2 Claws and Feral recycling, you play Claw 3-4 times per turn. By turn 3 each Claw hits for 11-15. By turn 5 each hits for 19+. Costs 0 energy each time.',
    },
    {
      name: 'All for One Reset',
      description:
        'All for One (2 energy): deal 10 damage, pull ALL 0-cost cards from discard to hand. With 6-8 zero-cost cards, your hand instantly refills. Play them all, then you\'re set up for next turn\'s cycle. The entire deck loops.',
    },
    {
      name: 'Feral Infinite Loop',
      description:
        'Feral: first 0-cost Attack played each turn returns to your hand. Play Claw (0), it returns, play again, it stays in discard. That\'s 2 Claw plays (+4 permanent damage) for 0 energy every turn. Guaranteed scaling.',
    },
    {
      name: 'Echo Form + All for One',
      description:
        'Echo Form doubles All for One: pull 0-cost cards back twice. Play all 0-cost cards, All for One pulls them back, play again. You can play 10+ cards in a single turn. Claw damage skyrockets.',
    },
  ],
}
