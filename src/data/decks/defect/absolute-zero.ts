import type { FeaturedDeck } from '../index'

export const absoluteZero: FeaturedDeck = {
  id: 'absolute-zero',
  name: 'Absolute Zero',
  character: 'Defect',
  characterId: 'defect',
  strategy:
    'Build a Frost Orb wall boosted by Focus. Each Frost Orb generates Block equal to 2 + Focus at end of turn. Defragment (+1 Focus) and Biased Cognition (+4 Focus) are the key scaling Powers. With 5 Orb Slots (via Capacitor) and +5 Focus, that\'s 35 passive Block per turn before playing any cards. Glacier (2 energy, 6 Block + 2 Frost) and Coolheaded (1 energy, 1 Frost + draw 1) fill your Orb Slots efficiently. Loop triggers the rightmost Orb again at start of turn for bonus Block. Hailstorm adds 6 free AoE damage per turn while you sit behind an impenetrable wall. The deck wins slowly but is nearly unkillable once Focus + Frost are online.',
  pickups: [
    // Core: Frost generation and Focus scaling
    { title: 'Glacier', count: 2, priority: 'core' },
    { title: 'Coolheaded', count: 2, priority: 'core' },
    { title: 'Defragment', count: 1, priority: 'core' },
    { title: 'Biased Cognition', count: 1, priority: 'core' },
    // High: Orb slots, cycling, and passive damage
    { title: 'Cold Snap', count: 2, priority: 'high' },
    { title: 'Capacitor', count: 1, priority: 'high' },
    { title: 'Loop', count: 1, priority: 'high' },
    { title: 'Hailstorm', count: 1, priority: 'high' },
    // Situational: Extra defense or draw, but Frost handles most of it
    { title: 'Coolant', count: 1, priority: 'situational' },
    { title: 'Buffer', count: 1, priority: 'situational' },
    { title: 'Leap', count: 1, priority: 'situational' },
    { title: 'Skim', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Frost Orbs and Hailstorm handle damage passively. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Focus + Frost Wall',
      description:
        'Defragment (+1 Focus) and Biased Cognition (+4 Focus) boost every Frost Orb\'s passive Block. With 4 Orbs at +5 Focus: each generates 7 Block = 28 passive Block every turn. Capacitor adds 2 more slots for 42 passive Block.',
    },
    {
      name: 'Loop + Rightmost Frost',
      description:
        'Loop triggers the passive ability of your rightmost Orb at start of turn. If Frost is rightmost, you gain extra Block before even drawing cards. Combined with high Focus this is 7+ free Block on top of end-of-turn Frost Block.',
    },
    {
      name: 'Coolheaded Cycling',
      description:
        'Coolheaded (1 energy) channels 1 Frost and draws 1 card. In a tight 3-energy economy, this is perfect: it builds defense, draws your Focus Powers faster, and maintains Frost presence. Two copies means very consistent Frost channeling.',
    },
    {
      name: 'Hailstorm Passive AoE',
      description:
        'Hailstorm: at end of turn, if you have Frost, deal 6 AoE damage. Completely free every turn once active. Combined with passive Frost Block, you\'re unkillable AND dealing 6 damage per turn without spending energy.',
    },
  ],
}
