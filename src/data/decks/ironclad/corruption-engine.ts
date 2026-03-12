import type { FeaturedDeck } from '../index'

export const corruptionEngine: FeaturedDeck = {
  id: 'corruption-engine',
  name: 'Corruption Engine',
  character: 'Ironclad',
  characterId: 'ironclad',
  strategy:
    'Build the exhaust engine: Feel No Pain (3 Block per Exhaust), Dark Embrace (draw 1 per Exhaust), then Corruption (all Skills cost 0 but Exhaust). Once online, every Skill is free, draws a card, and generates Block. Chain Shrug It Off (free, 8 Block + draw), Second Wind (free, exhaust all non-Attacks for 5 Block each), and Stoke (exhaust hand, draw that many) to rip through your entire deck in one turn. Use Offering (0 cost, +2 energy, draw 3) to play Corruption alongside a safety piece. The deck rapidly thins to pure Attacks — Fiend Fire exhausts your hand for 7 damage per card as a finisher. Conflagration adds AoE scaling.',
  pickups: [
    // Core: The engine doesn't work without all three pieces
    { title: 'Corruption', count: 1, priority: 'core' },
    { title: 'Dark Embrace', count: 1, priority: 'core' },
    { title: 'Feel No Pain', count: 2, priority: 'core' },
    // High: Major fuel and payoff cards — take whenever offered
    { title: 'Offering', count: 1, priority: 'high' },
    { title: 'Shrug It Off', count: 2, priority: 'high' },
    { title: 'Second Wind', count: 1, priority: 'high' },
    { title: 'Fiend Fire', count: 1, priority: 'high' },
    { title: 'Burning Pact', count: 2, priority: 'high' },
    // Situational: Good support, but the engine runs without them
    { title: 'Stoke', count: 1, priority: 'situational' },
    { title: 'True Grit', count: 1, priority: 'situational' },
    { title: 'Conflagration', count: 1, priority: 'situational' },
    { title: 'Headbutt', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Once the engine is running, Skills do all the work. Remove 1–2 if you have spare gold.' },
    { title: 'Defend', reason: 'Feel No Pain and Second Wind generate far more Block. Consider removing 1 later on.' },
  ],
  combos: [
    {
      name: 'The Engine: Corruption + Dark Embrace + Feel No Pain',
      description:
        'Every Skill costs 0, draws 1, and gains 3 Block. If your hand is 3 Skills, that is 0 energy spent, 3 cards drawn, 9+ Block gained, plus each Skill\'s own effect. You cycle through your entire deck in one turn.',
    },
    {
      name: 'Second Wind Nuke',
      description:
        'Second Wind exhausts all non-Attacks and gives 5 Block each. With the engine active, each exhaust also draws a card. 4 non-Attacks = 20 Block + 4 draws + 12 Block from Feel No Pain = 32 Block from one free card.',
    },
    {
      name: 'Fiend Fire Finisher',
      description:
        'Exhaust your entire hand dealing 7 damage per card. With 6+ cards in hand, that\'s 42+ damage. Each exhaust triggers Feel No Pain (3 Block) and Dark Embrace (draw), so you\'re also gaining 18+ Block for next turn.',
    },
    {
      name: 'Offering for Setup',
      description:
        'Offering (0 cost, lose 6 HP, gain 2 energy, draw 3) lets you play Corruption (3) on the same turn as Feel No Pain (1) or Dark Embrace (2). It\'s the crucial energy burst that gets the engine started a turn earlier.',
    },
  ],
}
