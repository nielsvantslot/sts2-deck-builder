export interface StarterDeckEntry {
  title: string
  count: number
}

export interface StarterDeck {
  characterId: string
  energy: number
  secondaryResource?: { name: string; amount: number }
  cards: StarterDeckEntry[]
}

export const STARTER_DECKS: Record<string, StarterDeck> = {
  ironclad: {
    characterId: 'ironclad',
    energy: 3,
    cards: [
      { title: 'Strike', count: 5 },
      { title: 'Defend', count: 4 },
      { title: 'Bash', count: 1 },
    ],
  },
  silent: {
    characterId: 'silent',
    energy: 3,
    cards: [
      { title: 'Strike', count: 5 },
      { title: 'Defend', count: 5 },
      { title: 'Neutralize', count: 1 },
      { title: 'Survivor', count: 1 },
    ],
  },
  defect: {
    characterId: 'defect',
    energy: 3,
    cards: [
      { title: 'Strike', count: 4 },
      { title: 'Defend', count: 4 },
      { title: 'Zap', count: 1 },
      { title: 'Dualcast', count: 1 },
    ],
  },
  necrobinder: {
    characterId: 'necrobinder',
    energy: 3,
    cards: [
      { title: 'Strike', count: 4 },
      { title: 'Defend', count: 4 },
      { title: 'Bodyguard', count: 1 },
      { title: 'Unleash', count: 1 },
    ],
  },
  regent: {
    characterId: 'regent',
    energy: 3,
    secondaryResource: { name: 'Stars', amount: 3 },
    cards: [
      { title: 'Strike', count: 4 },
      { title: 'Defend', count: 4 },
      { title: 'Falling Star', count: 1 },
      { title: 'Venerate', count: 1 },
    ],
  },
}

/** Titles of all starter cards for a given character */
export function getStarterTitles(characterId: string): Set<string> {
  const deck = STARTER_DECKS[characterId]
  if (!deck) return new Set()
  return new Set(deck.cards.map((c) => c.title))
}
