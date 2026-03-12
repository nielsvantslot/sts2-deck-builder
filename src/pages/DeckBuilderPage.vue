<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CHARACTER_MAP } from '@/lib/constants'
import { useCards } from '@/composables/useCards'
import { useDeck } from '@/composables/useDeck'
import { encodeDeck, decodeDeck } from '@/lib/deck-code'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'
import CardFilters from '@/components/CardFilters.vue'
import CardList from '@/components/CardList.vue'
import DeckPanel from '@/components/DeckPanel.vue'

const props = defineProps<{ character: string }>()
const route = useRoute()
const router = useRouter()

const charInfo = CHARACTER_MAP[props.character]
const { searchQuery, typeFilter, rarityFilter, costFilter, sortBy, filteredCards, clearFilters } =
  useCards(props.character)
const { deckEntries, deckSize, stats, addCard, removeCard, clearDeck, getCount, loadDeck, exportDeck } = useDeck()

const shareStatus = ref<'idle' | 'copied'>('idle')

function buildCardMap(): Map<string, Card> {
  const map = new Map<string, Card>()
  for (const c of allCards as Card[]) {
    map.set(c.title, c)
  }
  return map
}

onMounted(() => {
  const code = route.query.d as string | undefined
  if (!code) return
  const entries = decodeDeck(code)
  if (!entries) return
  const cardMap = buildCardMap()
  const resolved = entries
    .map(({ title, count }) => {
      const card = cardMap.get(title)
      return card ? { card, count } : null
    })
    .filter((e): e is { card: Card; count: number } => e !== null)
  if (resolved.length) loadDeck(resolved)
})

async function shareDeck() {
  const code = encodeDeck(exportDeck())
  if (!code) return
  const url = new URL(window.location.origin + router.resolve({ name: 'deck-builder', params: { character: props.character }, query: { d: code } }).href)
  await navigator.clipboard.writeText(url.toString())
  shareStatus.value = 'copied'
  setTimeout(() => { shareStatus.value = 'idle' }, 2000)
}
</script>

<template>
  <div class="deck-builder">
    <header class="page-banner" :style="{ '--c': charInfo?.color }">
      <img
        :src="`/images/characters/${character}.webp`"
        :alt="charInfo?.name"
        class="banner-bg"
      />
      <div class="banner-overlay"></div>
      <div class="banner-inner">
        <RouterLink to="/" class="back-pill">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Home
        </RouterLink>
        <div class="banner-text">
          <h1 class="page-title" :style="{ color: charInfo?.color }">{{ charInfo?.name ?? character }}</h1>
          <p class="page-subtitle">Card catalog &amp; deck builder</p>
        </div>
      </div>
    </header>

    <div class="layout">
      <main class="catalog">
        <CardFilters
          v-model:search="searchQuery"
          v-model:type="typeFilter"
          v-model:rarity="rarityFilter"
          v-model:cost="costFilter"
          v-model:sort="sortBy"
          @clear="clearFilters"
        />
        <CardList
          :cards="filteredCards"
          :get-count="getCount"
          @add="addCard"
          @remove="removeCard"
        />
      </main>

      <DeckPanel
        :entries="deckEntries"
        :deck-size="deckSize"
        :stats="stats"
        :share-status="shareStatus"
        @add="addCard"
        @remove="removeCard"
        @clear="clearDeck"
        @share="shareDeck"
      />
    </div>
  </div>
</template>

<style scoped>
.deck-builder {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem) 5rem;
}

/* ===== BANNER ===== */
.page-banner {
  position: relative;
  height: 220px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(5, 4, 7, 0.97) 0%, rgba(5, 4, 7, 0.7) 35%, rgba(5, 4, 7, 0.2) 65%, transparent 100%),
    linear-gradient(to top, rgba(5, 4, 7, 0.85) 0%, transparent 50%);
}

.banner-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 2.5rem;
  gap: 0.75rem;
}

.back-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: fit-content;
  transition: all var(--transition-fast);
}

.back-pill:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1.1;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* ===== LAYOUT ===== */
.layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

.catalog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .page-banner {
    height: 160px;
  }
}
</style>
