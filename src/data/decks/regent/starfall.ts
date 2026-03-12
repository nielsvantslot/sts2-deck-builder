import type { FeaturedDeck } from '../index'

export const starfall: FeaturedDeck = {
  id: 'starfall',
  name: 'Starfall',
  character: 'Regent',
  characterId: 'regent',
  strategy:
    'Overwhelm enemies with Strength-scaled AoE attacks. Resonance (1 energy Power) gives +2 permanent Strength per turn. Seven Stars (2 energy) hits ALL enemies 3 times — each Strength point adds +3 total. After 3 turns of Resonance, Seven Stars deals 39 AoE. Monologue (1 energy, +3 Strength this turn + draw 1) spikes burst turns even higher. Dying Star (1 energy) deals 9 + 9 AoE if you have 0 Stars — excellent efficiency when Stars are spent. Crash Landing (2 energy, 30 single + 14 AoE) is the big finisher that also scales with Strength. Defend with Patter (8 Block + 2 Vigor) and Cloak of Stars (0 energy, 7 Block). The deck wins fast through overwhelming AoE before enemies can scale.',
  pickups: [
    // Core: Strength scaling and the multi-hit AoE payoff
    { title: 'Seven Stars', count: 2, priority: 'core' },
    { title: 'Resonance', count: 1, priority: 'core' },
    { title: 'Crash Landing', count: 1, priority: 'core' },
    // High: Burst Strength and efficient damage
    { title: 'Monologue', count: 2, priority: 'high' },
    { title: 'Dying Star', count: 2, priority: 'high' },
    { title: 'Monarch\'s Gaze', count: 1, priority: 'high' },
    // Situational: Defense and Star utility
    { title: 'Patter', count: 2, priority: 'situational' },
    { title: 'Cloak of Stars', count: 2, priority: 'situational' },
    { title: 'Glow', count: 1, priority: 'situational' },
    { title: 'Venerate', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Defend', reason: 'The deck wins fast through damage — Patter handles Block better. Consider removing 1 if the opportunity arises.' },
  ],
  combos: [
    {
      name: 'Resonance + Seven Stars',
      description:
        'Resonance (1 energy Power): +2 Strength per turn. Seven Stars (2 energy): 7 damage × 3 hits to ALL enemies. Each Strength point adds +1 per hit = +3 total. After 3 turns of Resonance, Seven Stars deals (7+6)×3 = 39 AoE damage. Multi-hit + Strength = exponential scaling.',
    },
    {
      name: 'Monologue Burst Turn',
      description:
        'Monologue (1 energy): +3 Strength this turn + draw 1 card. Stack with Resonance\'s passive Strength for a huge burst turn. Monologue → Seven Stars = (7+3+passive)×3 damage to ALL. The draw helps find your key attack.',
    },
    {
      name: 'Dying Star Zero-Star Payoff',
      description:
        'Dying Star (1 energy): 9 damage to one enemy, plus 9 damage to ALL enemies if you have 0 Stars. Spend Stars early on other effects, then Dying Star becomes an efficient 18 total damage for 1 energy. Great in multi-enemy fights.',
    },
    {
      name: 'Crash Landing Finisher',
      description:
        'Crash Landing (2 energy): 30 damage to one target + 14 damage to ALL enemies. With Strength scaling from Resonance, both values increase. At +6 Strength: 36 single + 20 AoE = 56 total damage. A single-card finisher.',
    },
  ],
}
