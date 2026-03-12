import { computed, ref } from 'vue'
import type { Card } from '@/lib/types'

export interface DeckEntry {
  card: Card
  count: number
}

export function useDeck() {
  const deckMap = ref<Map<string, DeckEntry>>(new Map())

  const deckEntries = computed(() =>
    [...deckMap.value.values()].sort((a, b) =>
      a.card.title.localeCompare(b.card.title),
    ),
  )

  const deckSize = computed(() =>
    [...deckMap.value.values()].reduce((sum, e) => sum + e.count, 0),
  )

  const stats = computed(() => {
    const types: Record<string, number> = { Attack: 0, Skill: 0, Power: 0 }
    const costs: Record<string, number> = {}

    for (const { card, count } of deckMap.value.values()) {
      types[card.type] = (types[card.type] || 0) + count
      costs[card.energyCost] = (costs[card.energyCost] || 0) + count
    }

    return { types, costs }
  })

  function addCard(card: Card) {
    const key = card.title
    const existing = deckMap.value.get(key)
    if (existing) {
      existing.count++
    } else {
      deckMap.value.set(key, { card, count: 1 })
    }
    // Trigger reactivity
    deckMap.value = new Map(deckMap.value)
  }

  function removeCard(card: Card) {
    const key = card.title
    const existing = deckMap.value.get(key)
    if (!existing) return
    if (existing.count <= 1) {
      deckMap.value.delete(key)
    } else {
      existing.count--
    }
    deckMap.value = new Map(deckMap.value)
  }

  function clearDeck() {
    deckMap.value = new Map()
  }

  function getCount(card: Card): number {
    return deckMap.value.get(card.title)?.count ?? 0
  }

  return {
    deckEntries,
    deckSize,
    stats,
    addCard,
    removeCard,
    clearDeck,
    getCount,
  }
}
