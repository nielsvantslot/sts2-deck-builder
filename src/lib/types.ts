export type CardType = 'Attack' | 'Skill' | 'Power'

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Starter'

export interface Card {
  title: string
  description: string
  character: string
  type: CardType
  energyCost: string
  rarity: Rarity
}

export interface Relic {
  name: string
  description: string
  rarity: string
  character?: string
}

export interface Potion {
  name: string
  description: string
  character?: string
  rarity: string
}

export interface DataMeta {
  lastFetched: string
  sourceUrl: string
  cardCount: number
  relicCount: number
  potionCount: number
}
