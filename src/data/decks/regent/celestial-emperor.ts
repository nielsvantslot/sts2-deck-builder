import type { FeaturedDeck } from '../index'

export const celestialEmperor: FeaturedDeck = {
  id: 'celestial-emperor',
  name: 'Celestial Emperor',
  character: 'Regent',
  characterId: 'regent',
  strategy:
    'Turn Star generation into a win condition. The Sealed Throne (2 energy Power) generates 1 Star per card played — with 5+ cards per turn that\'s 5+ Stars passively. Heavenly Drill (2 energy Power) deals 7 damage to ALL enemies per Star spent, so every Star-spending card becomes AoE. Genesis (3 energy Power) gives permanent +1 energy per turn. Orbit (1 energy Power) refunds 1 energy every 4 spent. Together, these let you play 5–7 cards per turn, generate massive Stars, and convert them to AoE damage. Glow and Venerate build early Stars. Royal Gamble (1 energy, gain 9 Stars, Exhaust) feeds Heavenly Drill for 63 burst AoE. Black Hole deals damage equal to ALL Stars gained this combat as a late-game finisher.',
  pickups: [
    // Core: The Star generation engine and its damage converter
    { title: 'The Sealed Throne', count: 1, priority: 'core' },
    { title: 'Genesis', count: 1, priority: 'core' },
    { title: 'Heavenly Drill', count: 1, priority: 'core' },
    { title: 'Glow', count: 2, priority: 'core' },
    // High: Energy sustain, Star burst, and finisher
    { title: 'Orbit', count: 1, priority: 'high' },
    { title: 'Black Hole', count: 1, priority: 'high' },
    { title: 'Venerate', count: 2, priority: 'high' },
    { title: 'Cloak of Stars', count: 2, priority: 'high' },
    // Situational: Extra Star generation and utility
    { title: 'Hidden Cache', count: 1, priority: 'situational' },
    { title: 'Alignment', count: 1, priority: 'situational' },
    { title: 'Pale Blue Dot', count: 1, priority: 'situational' },
    { title: 'Royal Gamble', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Stars and Heavenly Drill handle damage. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'The Sealed Throne + Card Spam',
      description:
        'The Sealed Throne (2 energy Power): gain 1 Star every time you play a card. With Genesis giving +1 energy/turn and Orbit refunding every 4th energy, you play 5–7 cards per turn = 5–7 Stars generated passively. Those Stars fuel Heavenly Drill\'s AoE.',
    },
    {
      name: 'Heavenly Drill Star Engine',
      description:
        'Heavenly Drill (2 energy Power): each Star you spend deals 7 damage to ALL enemies. With The Sealed Throne generating 5+ Stars/turn, every Star-spending card triggers 7 AoE. Cards like Alignment (spend Stars for damage/Block) become dual-purpose.',
    },
    {
      name: 'Royal Gamble + Heavenly Drill Nuke',
      description:
        'Royal Gamble (1 energy): gain 9 Stars, Exhaust. With Heavenly Drill active, spending those 9 Stars through subsequent cards deals 63 damage to ALL enemies. A one-time burst that can clear entire encounters.',
    },
    {
      name: 'Black Hole Finisher',
      description:
        'Black Hole (3 energy): deal damage equal to ALL Stars gained this combat. After 10+ turns of The Sealed Throne generating 5+ Stars/turn, that\'s 50+ Stars = 50+ damage in a single card. A devastating finisher for long fights.',
    },
  ],
}
