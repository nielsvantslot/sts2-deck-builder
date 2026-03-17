<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CHARACTER_MAP } from '@/lib/constants'
import { useCards } from '@/composables/useCards'
import { useDeck } from '@/composables/useDeck'
import { encodeDeck, decodeDeck } from '@/lib/deck-code'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'
import CharacterIcon from '@/components/CharacterIcon.vue'
import CardFilters from '@/components/CardFilters.vue'
import CardList from '@/components/CardList.vue'
import DeckPanel from '@/components/DeckPanel.vue'

const props = defineProps<{ character: string }>()
const route = useRoute()
const router = useRouter()

const charInfo = CHARACTER_MAP[props.character]
const { searchQuery, typeFilter, rarityFilter, costFilter, sortBy, characterCards, filteredCards, clearFilters } =
  useCards(props.character)
const { deckEntries, deckSize, stats, addCard, removeCard, clearDeck, getCount, loadDeck, exportDeck } = useDeck()

const shareStatus = ref<'idle' | 'copied'>('idle')
const deckName = ref('')

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
  const decoded = decodeDeck(code)
  if (!decoded) return
  if (decoded.name) {
    deckName.value = decoded.name
  }
  const cardMap = buildCardMap()
  const resolved = decoded.entries
    .map(({ title, count }) => {
      const card = cardMap.get(title)
      return card ? { card, count } : null
    })
    .filter((e): e is { card: Card; count: number } => e !== null)
  if (resolved.length) loadDeck(resolved)
})

async function shareDeck() {
  const n = deckName.value.trim()
  const code = encodeDeck(exportDeck(), n)
  if (!code) return
  const url = new URL(
    window.location.origin +
      router.resolve({
        name: 'custom-deck',
        params: { character: props.character },
        query: { d: code }, // no more n param
      }).href,
  )
  await navigator.clipboard.writeText(url.toString())
  shareStatus.value = 'copied'
  setTimeout(() => { shareStatus.value = 'idle' }, 2000)
}
</script>

<template>
  <div class="page" :style="{ '--c': charInfo?.color }">
    <!-- ===== HERO ===== -->
    <header class="hero">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <RouterLink :to="`/characters/${character}`" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ charInfo?.name }}
        </RouterLink>

        <div class="hero-badge">
          <CharacterIcon :character="character" :size="20" />
          <span>{{ charInfo?.name }}</span>
        </div>
        <h1 class="hero-title">Deck Builder</h1>

        <div class="hero-chips">
          <div class="chip"><span class="chip-val">{{ characterCards.length }}</span><span class="chip-key">Available</span></div>
          <div class="chip"><span class="chip-val">{{ deckSize }}</span><span class="chip-key">In Deck</span></div>
        </div>
      </div>
    </header>

    <!-- ===== CONTENT ===== -->
    <div class="content">
      <main class="main">
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
        :deck-name="deckName"
        :stats="stats"
        :share-status="shareStatus"
        @update:deckName="deckName = $event"
        @add="addCard"
        @remove="removeCard"
        @clear="clearDeck"
        @share="shareDeck"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2.5rem) 6rem;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  padding: clamp(2rem, 5vw, 4rem) 0 clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--c) 35%, transparent) 30%,
    var(--c) 50%,
    color-mix(in srgb, var(--c) 35%, transparent) 70%,
    transparent 100%
  );
}

.hero-glow {
  position: absolute;
  top: -40%;
  left: 50%;
  width: 800px;
  height: 500px;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--c) 12%, transparent) 0%,
    color-mix(in srgb, var(--c) 4%, transparent) 40%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(40px);
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text-dim);
  text-decoration: none;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: color 0.25s ease;
  width: fit-content;
  margin-bottom: 0.5rem;
}

.back-link:hover {
  color: var(--c);
}

.back-link svg {
  transition: transform 0.25s ease;
}

.back-link:hover svg {
  transform: translateX(-3px);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c);
  padding: 0.4rem 1rem 0.4rem 0.6rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--c) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 18%, transparent);
  width: fit-content;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0.25rem 0 0.5rem;
  background: linear-gradient(
    180deg,
    var(--color-text) 30%,
    color-mix(in srgb, var(--c) 40%, var(--color-text)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.chip-val {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--c);
}

.chip-key {
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
}

/* ===== CONTENT GRID ===== */
.content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--text-2xl);
  }
}
</style>
