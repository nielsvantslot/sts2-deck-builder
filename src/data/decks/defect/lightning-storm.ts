import type { FeaturedDeck } from '../index'

export const lightningStorm: FeaturedDeck = {
  id: 'lightning-storm',
  name: 'Lightning Storm',
  character: 'Defect',
  characterId: 'defect',
  strategy:
    'Spam Powers to feed Storm (channels 1 Lightning per Power played) and Subroutine (gain 1 energy per Power played). Creative AI generates a free Power each turn, which Storm converts into Lightning automatically. Thunder makes every Lightning evoke deal +6 bonus damage (14 total). Echo Form doubles your first card each turn — doubling a Power means double Storm channels and double Subroutine energy. Use Synthesis (next Power costs 0) before big Powers like Creative AI or Echo Form. Voltaic channels Lightning equal to all Lightning channeled this combat for a massive refill. The deck snowballs — more Powers mean more Lightning, more energy, more damage.',
  pickups: [
    // Core: The Lightning engine and its best amplifier
    { title: 'Storm', count: 1, priority: 'core' },
    { title: 'Thunder', count: 1, priority: 'core' },
    { title: 'Creative AI', count: 1, priority: 'core' },
    { title: 'Echo Form', count: 1, priority: 'core' },
    // High: Focus, energy, and Lightning channelers
    { title: 'Defragment', count: 1, priority: 'high' },
    { title: 'Subroutine', count: 1, priority: 'high' },
    { title: 'Ball Lightning', count: 2, priority: 'high' },
    { title: 'Synthesis', count: 1, priority: 'high' },
    // Situational: Extra support, but the Power engine carries most fights
    { title: 'Capacitor', count: 1, priority: 'situational' },
    { title: 'Machine Learning', count: 1, priority: 'situational' },
    { title: 'Barrage', count: 1, priority: 'situational' },
    { title: 'Voltaic', count: 1, priority: 'situational' },
    { title: 'Skim', count: 1, priority: 'situational' },
    { title: 'Glacier', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Powers and Lightning do the damage. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Storm + Power Spam',
      description:
        'Storm channels 1 Lightning per Power played. With 7+ Powers in the deck, each one both does what it says AND channels Lightning. Creative AI supplies a free Power per turn, so Lightning keeps flowing automatically.',
    },
    {
      name: 'Thunder + Lightning Evoke',
      description:
        'Thunder adds 6 damage to every Lightning evoke. Lightning base evoke = 8 damage. With Thunder: 14 per evoke. When Orb Slots fill up and new Lightning pushes old ones out, each forced evoke hits for 14. With Focus: even more.',
    },
    {
      name: 'Echo Form + Powers',
      description:
        'Echo Form plays your first card each turn twice. Double a Power = double Storm channels (2 Lightning instead of 1), double Subroutine energy. Double Barrage with 5 Orbs = 50+ damage. The most impactful turn-over-turn scaling in the deck.',
    },
    {
      name: 'Subroutine Energy Engine',
      description:
        'Subroutine gives 1 energy per Power played. With Creative AI generating a free Power, plus your own Powers, you gain 1-2 bonus energy per turn. This overcomes the 3-energy constraint and lets you play Powers AND Attacks.',
    },
  ],
}
