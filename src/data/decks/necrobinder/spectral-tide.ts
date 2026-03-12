import type { FeaturedDeck } from '../index'

export const spectralTide: FeaturedDeck = {
  id: 'spectral-tide',
  name: 'Spectral Tide',
  character: 'Necrobinder',
  characterId: 'necrobinder',
  strategy:
    "Play Ethereal cards aggressively — they auto-exhaust at end of turn if unplayed, naturally thinning the deck. Spirit of Ash (1 energy Power) gives 4 Block per Ethereal played, turning every Ethereal card into offense + defense. Pagestorm draws 1 whenever you draw an Ethereal, cascading your 5-card draw into 7–8 cards per turn. Defile (Ethereal, 1 energy, 13 damage) and Fear (Ethereal, 1 energy, 7 damage + Vuln) are efficient attacks. Parse (Ethereal, 1 energy, draw 3) cycles deep. Demesne (Ethereal, 3 energy) gives permanent +1 energy and +1 draw. Banshee's Cry starts at 6 energy but costs 1 less per Ethereal played this combat — by mid-fight it's free 33 AoE. Lethality makes the first Attack each turn deal 50% more damage.",
  pickups: [
    // Core: The Ethereal engine and key payoffs
    { title: 'Spirit of Ash', count: 1, priority: 'core' },
    { title: 'Pagestorm', count: 1, priority: 'core' },
    { title: 'Defile', count: 2, priority: 'core' },
    { title: 'Demesne', count: 1, priority: 'core' },
    // High: Scaling damage and Ethereal fuel
    { title: 'Lethality', count: 1, priority: 'high' },
    { title: "Banshee's Cry", count: 1, priority: 'high' },
    { title: 'Defy', count: 2, priority: 'high' },
    { title: 'Parse', count: 2, priority: 'high' },
    // Situational: Extra support, but the Ethereal density is already high
    { title: 'Pull from Below', count: 1, priority: 'situational' },
    { title: 'Fear', count: 1, priority: 'situational' },
    { title: 'Veilpiercer', count: 1, priority: 'situational' },
    { title: 'Death March', count: 1, priority: 'situational' },
    { title: 'Grave Warden', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Ethereal attacks like Defile deal more damage. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'Spirit of Ash Fortress',
      description:
        'Spirit of Ash: gain 4 Block per Ethereal card played. With 8 Ethereal cards in the deck (Defile ×2, Fear, Defy ×2, Parse, Demesne, Lethality), each hand typically has 2-3 Ethereals = 8-12 Block per turn from this Power alone.',
    },
    {
      name: 'Pagestorm Draw Engine',
      description:
        'Pagestorm: draw 1 whenever you draw an Ethereal card. With many Ethereals, your 5-card draw step cascades into 7-8 cards per turn. Combined with Parse (Ethereal, draw 3 — which triggers Pagestorm again), you see most of your deck every turn.',
    },
    {
      name: "Banshee's Cry Ramp",
      description:
        "Banshee's Cry: 33 AoE damage, costs 6 minus 1 per Ethereal played this combat. Playing 2 Ethereals per turn means it's free by turn 3. Free 33 AoE damage every time you draw it after that. Devastating in multi-enemy fights.",
    },
    {
      name: 'Lethality + Defile',
      description:
        'Lethality (Ethereal): first Attack each turn deals 50% more damage. Defile (Ethereal, 13 damage) becomes ~20 damage. Pull from Below (1 energy, 5 damage per Ethereal played this combat) scales enormously: after 15 Ethereals played, it deals 80 damage.',
    },
  ],
}
