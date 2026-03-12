import type { FeaturedDeck } from '../index'

export const demonsWrath: FeaturedDeck = {
  id: 'demons-wrath',
  name: "Demon's Wrath",
  character: 'Ironclad',
  characterId: 'ironclad',
  strategy:
    'Scale Strength with Demon Form (+2 per turn permanently) and amplify it with Vulnerable. Inflame (+2 Strength, 1 energy) bridges early damage. Bash and Tremble keep enemies Vulnerable, and Cruelty makes Vulnerable deal an extra 25% on top. As Strength snowballs, efficient 1-cost Attacks become devastating: Twin Strike hits twice, Dismantle hits twice on Vulnerable targets. Rupture converts self-damage from Bloodletting/Offering into bonus Strength. Save Whirlwind (X cost, hits ALL enemies X times) for big energy turns — at +10 Strength with 3 energy, that\'s 45 AoE. Conflagration adds AoE that scales with Attacks played.',
  pickups: [
    // Core: The Strength engine and its best payoffs
    { title: 'Demon Form', count: 1, priority: 'core' },
    { title: 'Cruelty', count: 1, priority: 'core' },
    { title: 'Twin Strike', count: 2, priority: 'core' },
    { title: 'Whirlwind', count: 1, priority: 'core' },
    // High: Accelerants and strong scaling support
    { title: 'Inflame', count: 1, priority: 'high' },
    { title: 'Rupture', count: 1, priority: 'high' },
    { title: 'Conflagration', count: 1, priority: 'high' },
    { title: 'Dismantle', count: 1, priority: 'high' },
    { title: 'Tremble', count: 1, priority: 'high' },
    { title: 'Shrug It Off', count: 2, priority: 'high' },
    // Situational: Useful support, but the deck functions without them
    { title: 'Pommel Strike', count: 1, priority: 'situational' },
    { title: 'Offering', count: 1, priority: 'situational' },
    { title: 'Bloodletting', count: 1, priority: 'situational' },
    { title: 'Flame Barrier', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Defend', reason: 'The deck is offense-focused — Shrug It Off handles defense better. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Demon Form + Time',
      description:
        'Demon Form gives +2 Strength every turn permanently. By turn 3 after playing it you have +6 Strength. Every 1-cost Attack hits significantly harder. Twin Strike at +10 Str is 15 damage twice = 30 damage for 1 energy.',
    },
    {
      name: 'Vulnerable + Cruelty',
      description:
        'Cruelty makes Vulnerable enemies take an additional 25% damage (total 75% bonus). Bash (starter, 2 Vuln) and Tremble (2 Vuln) keep enemies Vulnerable. Dismantle hits twice on Vulnerable targets, doubling the payoff.',
    },
    {
      name: 'Rupture + Self-Damage',
      description:
        'Rupture gives +1 Strength whenever you lose HP on your turn. Bloodletting (lose 3 HP, gain 1 energy) and Offering (lose 6 HP, gain 2 energy, draw 3) both trigger it. That\'s free Strength on top of Demon Form plus bonus energy/draw.',
    },
    {
      name: 'Whirlwind Finisher',
      description:
        'Whirlwind deals 5+Strength damage X times to ALL enemies, where X = energy spent. With +10 Strength and 3 energy: 15 damage × 3 = 45 AoE. With Bloodletting for +1 energy: 15 × 4 = 60 AoE. Scales with both Strength and energy.',
    },
  ],
}
