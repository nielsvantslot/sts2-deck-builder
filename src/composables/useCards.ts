import { computed, ref } from 'vue'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'

export type SortField = 'name' | 'cost' | 'type' | 'rarity'

const RARITY_ORDER: Record<string, number> = {
  Starter: 0,
  Common: 1,
  Uncommon: 2,
  Rare: 3,
}

export function useCards(characterId: string) {
  const searchQuery = ref('')
  const typeFilter = ref<string>('')
  const rarityFilter = ref<string>('')
  const costFilter = ref<string>('')
  const sortBy = ref<SortField>('name')

  const characterName = characterId.charAt(0).toUpperCase() + characterId.slice(1)

  const characterCards = computed(() =>
    (allCards as Card[]).filter(
      (c) => c.character === characterName || c.character === 'Colorless',
    ),
  )

  const filteredCards = computed(() => {
    let cards = characterCards.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      cards = cards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
    }

    if (typeFilter.value) {
      cards = cards.filter((c) => c.type === typeFilter.value)
    }

    if (rarityFilter.value) {
      cards = cards.filter((c) => c.rarity === rarityFilter.value)
    }

    if (costFilter.value) {
      cards = cards.filter((c) => c.energyCost === costFilter.value)
    }

    return cards.slice().sort((a, b) => {
      switch (sortBy.value) {
        case 'cost':
          return a.energyCost.localeCompare(b.energyCost) || a.title.localeCompare(b.title)
        case 'type':
          return a.type.localeCompare(b.type) || a.title.localeCompare(b.title)
        case 'rarity':
          return (RARITY_ORDER[a.rarity] ?? 9) - (RARITY_ORDER[b.rarity] ?? 9) || a.title.localeCompare(b.title)
        default:
          return a.title.localeCompare(b.title)
      }
    })
  })

  function clearFilters() {
    searchQuery.value = ''
    typeFilter.value = ''
    rarityFilter.value = ''
    costFilter.value = ''
  }

  return {
    searchQuery,
    typeFilter,
    rarityFilter,
    costFilter,
    sortBy,
    characterCards,
    filteredCards,
    clearFilters,
  }
}
