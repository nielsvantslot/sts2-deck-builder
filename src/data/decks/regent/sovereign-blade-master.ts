import type { FeaturedDeck } from '../index'

export const sovereignBladeMaster: FeaturedDeck = {
  id: 'sovereign-blade-master',
  name: 'Sovereign Blade Master',
  character: 'Regent',
  characterId: 'regent',
  strategy:
    "Forge the Sovereign Blade relentlessly until it one-shots everything. The Smith (1 energy, 30 Forge) is the biggest single boost. Furnace (1 energy Power) adds 4 passive Forge per turn. Spoils of Battle (1 energy, 10 Forge) and Refine Blade (1 energy, 6 Forge) keep the Blade growing. Sword Sage (2 energy Power) adds an extra Blade hit at +1 cost. Seeking Edge (1 energy, Forge 7) makes the Blade hit ALL enemies. With Sword Sage + Seeking Edge, a 50-Forge Blade hits all enemies twice for 100+ AoE. Conqueror (1 energy) doubles Blade damage for one turn. Parry (1 energy Power) gives 6 Block per Blade play for defense. Use Glow and Venerate for Star generation and cycling.",
  pickups: [
    // Core: Forge scaling and the Blade's power multipliers
    { title: 'Sword Sage', count: 1, priority: 'core' },
    { title: 'Furnace', count: 1, priority: 'core' },
    { title: 'The Smith', count: 1, priority: 'core' },
    { title: 'Spoils of Battle', count: 2, priority: 'core' },
    // High: Blade enhancement and burst
    { title: 'Seeking Edge', count: 1, priority: 'high' },
    { title: 'Parry', count: 1, priority: 'high' },
    { title: 'Conqueror', count: 1, priority: 'high' },
    { title: 'Refine Blade', count: 1, priority: 'high' },
    // Situational: Utility and defensive support
    { title: 'Summon Forth', count: 1, priority: 'situational' },
    { title: 'Bulwark', count: 1, priority: 'situational' },
    { title: 'Beat into Shape', count: 1, priority: 'situational' },
    { title: 'Glow', count: 1, priority: 'situational' },
    { title: 'Cloak of Stars', count: 1, priority: 'situational' },
    { title: 'Patter', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Sovereign Blade replaces all your damage needs. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'The Smith + Furnace Forge Rush',
      description:
        'The Smith (1 energy): 30 Forge instantly. Furnace (1 energy Power): 4 passive Forge per turn. Spoils of Battle (1 energy): 10 Forge. Within 3 turns your Blade has 50+ Forge — each Forge point = +1 damage on Sovereign Blade.',
    },
    {
      name: 'Sword Sage + Seeking Edge',
      description:
        'Sword Sage adds an extra Blade hit (+1 cost). Seeking Edge makes Blade hit ALL enemies. A 50-Forge Blade now hits all enemies twice for 50+ damage each hit = 100+ AoE. The Regent\'s premier finisher combo.',
    },
    {
      name: 'Conqueror Double Damage',
      description:
        'Conqueror (1 energy): Forge 3, Sovereign Blade deals double damage this turn. On a 50-Forge Blade with Sword Sage (2 hits), that\'s 100 damage per hit × 2 = 200 damage. Use Summon Forth to pull Blade to hand first.',
    },
    {
      name: 'Parry Defense',
      description:
        'Parry (1 energy Power): gain 6 Block whenever you play Sovereign Blade. With Sword Sage making Blade more central, Parry turns every Blade play into offense + defense. Combined with Patter (8 Block + 2 Vigor) for consistent defense.',
    },
  ],
}
