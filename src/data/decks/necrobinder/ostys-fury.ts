import type { FeaturedDeck } from '../index'

export const ostysFury: FeaturedDeck = {
  id: 'ostys-fury',
  name: "Osty's Fury",
  character: 'Necrobinder',
  characterId: 'necrobinder',
  strategy:
    "Maximize Osty's damage output with Calcify (+4 to all Osty attacks) and chain multi-hit combos. Poke (0 cost, Osty deals 6+4=10) into Rattle (1 energy, hits once + once per prior Osty attack this turn = 2 hits of 11 = 22) gives 32 damage for just 1 energy. Keep Osty alive with Sic 'Em (2 Summon per Osty hit), Pull Aggro (Summon 4 + 7 Block), and Afterlife (Summon 6). Squeeze (3 energy) is the finisher: 25 + 5 per Osty Attack card in your deck = 60+ damage. Necro Mastery makes all enemies mirror Osty's HP loss for AoE. If Osty dies, Reanimate (Summon 20) brings him back at full power.",
  pickups: [
    // Core: Osty's damage scaling and multi-hit chain
    { title: 'Calcify', count: 1, priority: 'core' },
    { title: 'Rattle', count: 1, priority: 'core' },
    { title: 'Poke', count: 2, priority: 'core' },
    { title: 'Squeeze', count: 1, priority: 'core' },
    // High: Summon sustain and AoE conversion
    { title: 'Necro Mastery', count: 1, priority: 'high' },
    { title: "Sic 'Em", count: 1, priority: 'high' },
    { title: 'Fetch', count: 1, priority: 'high' },
    { title: 'Pull Aggro', count: 2, priority: 'high' },
    // Situational: Extra Osty attacks and safety nets
    { title: 'Snap', count: 1, priority: 'situational' },
    { title: 'Flatten', count: 1, priority: 'situational' },
    { title: 'Bone Shards', count: 1, priority: 'situational' },
    { title: 'Afterlife', count: 1, priority: 'situational' },
    { title: 'Reanimate', count: 1, priority: 'situational' },
    { title: 'Spur', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Osty attacks are far more efficient. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Calcify + Rattle Chain',
      description:
        "Calcify: all Osty attacks deal +4 damage. Poke (0, Osty deals 6+4=10) → Rattle (1, Osty deals 7+4=11, hits once + once per prior Osty attack = 2 hits = 22). That's 32 damage from Osty for 1 energy total.",
    },
    {
      name: "Sic 'Em Summon Engine",
      description:
        "Sic 'Em (1 energy): Osty deals 5 damage, and whenever Osty hits this turn, Summon 2. After a Poke + Rattle chain (3 hits), that's 6 Summon plus Sic 'Em's own hit. Keeps Osty's HP pool sustained.",
    },
    {
      name: 'Squeeze Crescendo',
      description:
        "Squeeze (3 energy): Osty deals 25 + 5 per Osty Attack in your deck. With 7 Osty Attacks (Poke ×2, Fetch, Snap, Rattle, Flatten, Sic 'Em, Squeeze itself), that's 25 + 35 = 60 damage. A full-turn investment that ends fights.",
    },
    {
      name: 'Necro Mastery Mirror',
      description:
        "Necro Mastery (2 energy): Summon 5, and whenever Osty loses HP, ALL enemies lose that much HP. Bone Shards kills Osty for 9 AoE + enemies mirror Osty's HP loss. Then Reanimate (3, Summon 20) brings Osty back at full power.",
    },
  ],
}
