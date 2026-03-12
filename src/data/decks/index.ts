import type { Card } from '@/lib/types'
import { STARTER_DECKS } from '@/lib/starter-decks'

export interface FeaturedDeck {
  id: string
  name: string
  character: string
  characterId: string
  strategy: string
  pickups: { title: string; count: number; priority?: 'core' | 'high' | 'situational' }[]
  removals?: { title: string; reason: string }[]
  combos: { name: string; description: string }[]
}

// Ironclad
import { ironFortress } from './ironclad/iron-fortress'
import { corruptionEngine } from './ironclad/corruption-engine'
import { demonsWrath } from './ironclad/demons-wrath'

// Silent
import { toxicTempest } from './silent/toxic-tempest'
import { thousandCuts } from './silent/thousand-cuts'
import { shadowDancer } from './silent/shadow-dancer'

// Defect
import { absoluteZero } from './defect/absolute-zero'
import { lightningStorm } from './defect/lightning-storm'
import { clawMachine } from './defect/claw-machine'

// Necrobinder
import { doomsayer } from './necrobinder/doomsayer'
import { ostysFury } from './necrobinder/ostys-fury'
import { spectralTide } from './necrobinder/spectral-tide'

// Regent
import { sovereignBladeMaster } from './regent/sovereign-blade-master'
import { celestialEmperor } from './regent/celestial-emperor'
import { starfall } from './regent/starfall'

export const FEATURED_DECKS: FeaturedDeck[] = [
  ironFortress,
  corruptionEngine,
  demonsWrath,
  toxicTempest,
  thousandCuts,
  shadowDancer,
  absoluteZero,
  lightningStorm,
  clawMachine,
  doomsayer,
  ostysFury,
  spectralTide,
  sovereignBladeMaster,
  celestialEmperor,
  starfall,
]

export function resolveDeckCards(
  deck: FeaturedDeck,
  allCards: Card[],
): { card: Card; count: number; priority: 'core' | 'high' | 'situational' }[] {
  const cardMap = new Map<string, Card>()
  for (const c of allCards) {
    const key = `${c.character}:${c.title}`
    cardMap.set(key, c)
    if (!cardMap.has(c.title)) cardMap.set(c.title, c)
  }
  return deck.pickups
    .map((entry) => {
      const card = cardMap.get(`${deck.character}:${entry.title}`) ?? cardMap.get(entry.title)
      return card ? { card, count: entry.count, priority: entry.priority ?? 'high' } : null
    })
    .filter((e): e is { card: Card; count: number; priority: 'core' | 'high' | 'situational' } => e !== null)
}

export function resolveStarterCards(
  deck: FeaturedDeck,
  allCards: Card[],
): { card: Card; count: number }[] {
  const starter = STARTER_DECKS[deck.characterId]
  if (!starter) return []
  const cardMap = new Map<string, Card>()
  for (const c of allCards) {
    const key = `${c.character}:${c.title}`
    cardMap.set(key, c)
    if (!cardMap.has(c.title)) cardMap.set(c.title, c)
  }
  return starter.cards
    .map((entry) => {
      const card = cardMap.get(`${deck.character}:${entry.title}`) ?? cardMap.get(entry.title)
      return card ? { card, count: entry.count } : null
    })
    .filter((e): e is { card: Card; count: number } => e !== null)
}
