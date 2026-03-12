import type { FeaturedDeck } from '../index'

export const ironFortress: FeaturedDeck = {
  id: 'iron-fortress',
  name: 'Iron Fortress',
  character: 'Ironclad',
  characterId: 'ironclad',
  strategy:
    'Stack permanent Block behind Barricade, then one-shot with Body Slam. Survive early with Shrug It Off (8 Block + draw) and True Grit (7 Block + exhaust a card to thin the deck). Play Barricade (3 energy) when you can afford a full turn — from here all Block persists. Unmovable doubles the first Block from a card each turn, so Impervious becomes 60 permanent Block for 2 energy. Once Block reaches 80+, Body Slam converts it all into lethal damage for 1 energy. Use Offering (0 cost, lose 6 HP, +2 energy, draw 3) to play Barricade alongside other cards. Thin Strikes and Defends with True Grit to cycle key cards faster.',
  pickups: [
    // Core: The Block-stacking win condition
    { title: 'Barricade', count: 1, priority: 'core' },
    { title: 'Body Slam', count: 2, priority: 'core' },
    { title: 'Unmovable', count: 1, priority: 'core' },
    { title: 'Impervious', count: 2, priority: 'core' },
    // High: Consistent Block generation and draw
    { title: 'Shrug It Off', count: 2, priority: 'high' },
    { title: 'True Grit', count: 2, priority: 'high' },
    { title: 'Offering', count: 1, priority: 'high' },
    { title: 'Flame Barrier', count: 1, priority: 'high' },
    // Situational: Helpful extras, but not essential
    { title: 'Bloodletting', count: 1, priority: 'situational' },
    { title: 'Feel No Pain', count: 1, priority: 'situational' },
    { title: 'Headbutt', count: 1, priority: 'situational' },
    { title: 'Crimson Mantle', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Body Slam is your damage — Strikes waste energy. Remove 1–2 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Barricade + Body Slam',
      description:
        'Barricade makes Block persist across turns. Accumulate 50-100+ Block passively, then Body Slam deals that as damage for just 1 energy. In a 10-card hand cycle, you play 2-3 Block cards per turn adding 15-25 Block each time.',
    },
    {
      name: 'Unmovable + Impervious',
      description:
        'Unmovable doubles the first Block gained from a card each turn. Impervious (30 Block) becomes 60 Block for 2 energy. Behind Barricade that is permanent — one card, one turn, massive scaling.',
    },
    {
      name: 'Offering + Big Turn',
      description:
        'Offering costs 0: lose 6 HP, gain 2 energy, draw 3 cards. This lets you play Barricade (3 energy) on the same turn as a Block card. The HP loss is cheap when you have 80+ Block.',
    },
    {
      name: 'True Grit Deck Thinning',
      description:
        'True Grit gives 7 Block and exhausts a card. Remove Strikes and extra Defends to shrink your deck so you draw Barricade, Body Slam, and key Block cards faster every shuffle.',
    },
  ],
}
