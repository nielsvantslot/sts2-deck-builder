import type { FeaturedDeck } from '../index'

export const shadowDancer: FeaturedDeck = {
  id: 'shadow-dancer',
  name: 'Shadow Dancer',
  character: 'Silent',
  characterId: 'silent',
  strategy:
    'Lock enemies into permanent Weakness, then double your Attack damage with Tracking. Master Planner makes all Skills gain Sly (replayable from discard), so Backflip, Leg Sweep, and Acrobatics come back every turn. Tactician (Sly, +1 energy from discard) and Reflex (Sly, draw 2 from discard) generate free resources each turn. Keep enemies permanently Weak with Suppress (Innate, 3 Weak), Sucker Punch, and Leg Sweep. Under Tracking, Predator hits for 30 and Pounce for 24. Speedster deals passive AoE damage whenever you draw cards — with all the extra draw from Sly Skills and Backflip, that adds up fast.',
  pickups: [
    // Core: The Sly engine and damage doubler
    { title: 'Master Planner', count: 1, priority: 'core' },
    { title: 'Tracking', count: 1, priority: 'core' },
    { title: 'Reflex', count: 1, priority: 'core' },
    { title: 'Tactician', count: 1, priority: 'core' },
    // High: Key damage and Weakness enablers
    { title: 'Speedster', count: 1, priority: 'high' },
    { title: 'Leg Sweep', count: 1, priority: 'high' },
    { title: 'Predator', count: 1, priority: 'high' },
    { title: 'Sucker Punch', count: 2, priority: 'high' },
    { title: 'Backflip', count: 2, priority: 'high' },
    // Situational: Good support, but skip if deck is already tight
    { title: 'Footwork', count: 1, priority: 'situational' },
    { title: 'Well-Laid Plans', count: 1, priority: 'situational' },
    { title: 'Pounce', count: 1, priority: 'situational' },
    { title: 'Acrobatics', count: 1, priority: 'situational' },
    { title: 'Dash', count: 1, priority: 'situational' },
    { title: 'Wraith Form', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Predator and Pounce hit much harder under Tracking. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Tracking + Permanent Weak',
      description:
        'Tracking makes Weak enemies take double Attack damage. Suppress (Innate, 3 Weak at start) + Sucker Punch (1 Weak, 1 energy) + Leg Sweep (2 Weak, 2 energy) keeps enemies permanently Weak. Predator at 15 damage becomes 30. Pounce at 12 becomes 24.',
    },
    {
      name: 'Master Planner + Sly Skills',
      description:
        'Master Planner gives Sly to every Skill you play. Sly cards can be played from the discard pile. Your best Skills never leave — Backflip (5 Block + 2 draw), Leg Sweep (2 Weak + 11 Block), Acrobatics all replayable every turn.',
    },
    {
      name: 'Tactician + Reflex Sly Engine',
      description:
        'Tactician (Sly, gain 1 energy) and Reflex (Sly, draw 2) are natively Sly. Every turn you can play them from discard for free energy and extra draws without spending them from hand. This effectively gives +1 energy and +2 draw per turn.',
    },
    {
      name: 'Speedster Passive Damage',
      description:
        'Speedster deals 2 damage to ALL enemies whenever you draw a card during your turn. With Backflip (draw 2), Acrobatics (draw 3), Predator (draw 2 next turn), and Reflex (draw 2), you trigger Speedster 5-8 extra times per turn for 10-16 passive AoE.',
    },
  ],
}
