import type { FeaturedDeck } from '../index'

export const toxicTempest: FeaturedDeck = {
  id: 'toxic-tempest',
  name: 'Toxic Tempest',
  character: 'Silent',
  characterId: 'silent',
  strategy:
    'Stack Poison passively with Noxious Fumes (2 Poison to ALL each turn) and Accelerant (Poison ticks an extra time). Survive with Backflip (5 Block + draw 2) and Wraith Form (2 turns of Intangible). For burst Poison, Burst + Corrosive Wave doubles it — every card drawn applies 6 Poison to ALL enemies instead of 3. Nightmare on Corrosive Wave creates 3 copies for next turn for devastating stacks. Well-Laid Plans retains key combo pieces. The deck plays defensively while Poison scales exponentially — Accelerant effectively doubles all Poison accumulation over the fight.',
  pickups: [
    // Core: The passive Poison engine
    { title: 'Noxious Fumes', count: 1, priority: 'core' },
    { title: 'Accelerant', count: 1, priority: 'core' },
    { title: 'Corrosive Wave', count: 1, priority: 'core' },
    { title: 'Deadly Poison', count: 2, priority: 'core' },
    // High: Burst combos and key survival
    { title: 'Burst', count: 1, priority: 'high' },
    { title: 'Nightmare', count: 1, priority: 'high' },
    { title: 'Backflip', count: 2, priority: 'high' },
    { title: 'Well-Laid Plans', count: 1, priority: 'high' },
    { title: 'Wraith Form', count: 1, priority: 'high' },
    // Situational: Extra Poison or defense, but the core handles most fights
    { title: 'Bouncing Flask', count: 1, priority: 'situational' },
    { title: 'Acrobatics', count: 1, priority: 'situational' },
    { title: 'Leg Sweep', count: 1, priority: 'situational' },
    { title: 'Blur', count: 1, priority: 'situational' },
    { title: 'Piercing Wail', count: 1, priority: 'situational' },
    { title: 'Footwork', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Poison does the killing — Strikes waste energy. Remove 1–2 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Burst + Corrosive Wave',
      description:
        'Burst makes the next Skill play twice. Corrosive Wave applies 3 Poison to ALL enemies per card drawn. Doubled, every draw applies 6 Poison. Follow with Backflip (draw 2) and Acrobatics (draw 3) for 30+ Poison in one turn.',
    },
    {
      name: 'Nightmare + Corrosive Wave',
      description:
        'Nightmare creates 3 copies of Corrosive Wave for next turn. Playing all 4 copies means every card drawn applies 12 Poison to ALL enemies. Draw even 3 more cards and that\'s 36 additional Poison. Ends boss fights.',
    },
    {
      name: 'Noxious Fumes + Accelerant',
      description:
        'Noxious Fumes passively applies 2 Poison to ALL enemies at the start of your turn. Accelerant makes Poison trigger an additional time — so Poison ticks twice per turn, effectively doubling all Poison accumulation over the fight.',
    },
    {
      name: 'Wraith Form + Poison Stall',
      description:
        'Wraith Form grants 2 Intangible (take only 1 damage per hit). Use these 2 safe turns to play Powers and stack Poison. The -1 Dexterity per turn downside doesn\'t matter — Poison is doing the killing, not your Attacks.',
    },
  ],
}
