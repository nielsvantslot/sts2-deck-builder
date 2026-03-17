<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CHARACTER_MAP } from '@/lib/constants'
import { decodeDeck } from '@/lib/deck-code'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'
import CharacterIcon from '@/components/CharacterIcon.vue'
import CardImage from '@/components/CardImage.vue'

const props = defineProps<{ character: string }>()
const route = useRoute()
const router = useRouter()

const charInfo = computed(() => CHARACTER_MAP[props.character])

const deckCode = computed(() => (route.query.d as string | undefined) ?? '')
const decodedDeck = computed(() => {
  const code = deckCode.value
  if (!code) return null
  return decodeDeck(code)
})
const deckName = computed(() => {
  if (decodedDeck.value && decodedDeck.value.name) return decodedDeck.value.name.trim()
  return ''
})
const heroTitle = computed(() => {
  if (deckName.value) return deckName.value
  return `Custom ${charInfo.value?.name ?? 'character'} deck`
})

function buildCardMap(): Map<string, Card> {
  const map = new Map<string, Card>()
  for (const c of allCards as Card[]) map.set(c.title, c)
  return map
}

const resolvedCards = computed(() => {
  if (!decodedDeck.value) return [] as { card: Card; count: number }[]
  const cardMap = buildCardMap()
  return decodedDeck.value.entries
    .map(({ title, count }) => {
      const card = cardMap.get(title)
      return card ? { card, count } : null
    })
    .filter((e): e is { card: Card; count: number } => e !== null)
})

const groupedByType = computed(() => {
  const groups = [
    { key: 'Attack' as const, label: 'Attacks', cards: [] as typeof resolvedCards.value },
    { key: 'Skill' as const, label: 'Skills', cards: [] as typeof resolvedCards.value },
    { key: 'Power' as const, label: 'Powers', cards: [] as typeof resolvedCards.value },
  ]
  for (const entry of resolvedCards.value) {
    const group = groups.find((g) => g.key === entry.card.type)
    if (group) group.cards.push(entry)
  }
  for (const g of groups) g.cards.sort((a, b) => a.card.title.localeCompare(b.card.title))
  return groups.filter((g) => g.cards.length > 0)
})

const totalCards = computed(() => resolvedCards.value.reduce((sum, e) => sum + e.count, 0))

const typeBreakdown = computed(() => {
  const types: Record<string, number> = { Attack: 0, Skill: 0, Power: 0 }
  for (const { card, count } of resolvedCards.value) {
    types[card.type] = (types[card.type] || 0) + count
  }
  return types
})

const costDistribution = computed(() => {
  const costs: Record<string, number> = {}
  for (const { card, count } of resolvedCards.value) {
    costs[card.energyCost] = (costs[card.energyCost] || 0) + count
  }
  return Object.entries(costs).sort(([a], [b]) => {
    if (a === 'X') return 1
    if (b === 'X') return -1
    return Number(a) - Number(b)
  })
})

const maxCostCount = computed(() => Math.max(...costDistribution.value.map(([, c]) => c), 1))

function goEdit() {
  const code = deckCode.value
  if (!code) return
  // For legacy: if deckName is not in code, add n param for backwards compatibility
  const decoded = decodedDeck.value
  const query: Record<string, string> = { d: code, edit: '1' }
  if (!decoded || !decoded.name) {
    if (deckName.value) query.n = deckName.value
  }
  router.push({
    name: 'deck-builder',
    params: { character: props.character },
    query,
  })
}
</script>

<template>
  <div class="page" v-if="resolvedCards.length" :style="{ '--c': charInfo?.color }">
    <header class="hero">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <RouterLink :to="`/characters/${character}`" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ charInfo?.name }}
        </RouterLink>

        <div class="hero-top">
          <div class="hero-badge">
            <CharacterIcon :character="character" :size="20" />
            <span>{{ charInfo?.name }}</span>
          </div>

          <button class="edit-btn" type="button" @click="goEdit">
            Edit deck
          </button>
        </div>

        <h1 class="hero-title">{{ heroTitle }}</h1>

      </div>
    </header>

    <div class="content">
      <main class="main">
        <section class="card-section" v-reveal>
          <div class="cs-head">
            <h2 class="cs-title">Cards</h2>
            <span class="cs-count">{{ totalCards }} cards</span>
          </div>
          <p class="cs-hint">Use Edit deck to open this list in the builder.</p>

          <div v-for="group in groupedByType" :key="group.key" class="prio-group">
            <div class="prio-bar" :class="`prio-${group.key.toLowerCase()}`">
              <span class="prio-dot"></span>
              <span class="prio-text">{{ group.label }}</span>
              <span class="prio-num">{{ group.cards.reduce((s, c) => s + c.count, 0) }}</span>
            </div>
            <div class="card-showcase">
              <div
                v-for="entry in group.cards"
                :key="entry.card.title"
                class="card-slot"
                :class="{ 'is-stacked': entry.count > 1 }"
                :style="{ '--stack': Math.min(entry.count, 5), marginRight: entry.count > 1 ? (Math.min(entry.count, 5) - 1) * 6 + 'px' : '0' }"
              >
                <CardImage v-for="i in Math.min(entry.count, 5)" :key="i" :card="entry.card" class="card-slot-img" :style="{ '--i': i - 1 }" />
                <span v-if="entry.count > 1" class="card-slot-qty">{{ entry.count }}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <aside class="sidebar">
        <div class="side-card" v-reveal>
          <h3 class="side-label">Mana Curve</h3>
          <div class="curve">
            <div v-for="[cost, count] in costDistribution" :key="cost" class="curve-col">
              <span class="curve-num">{{ count }}</span>
              <div class="curve-track">
                <div class="curve-fill" :style="{ height: (count / maxCostCount) * 100 + '%' }"></div>
              </div>
              <span class="curve-lbl">{{ cost }}</span>
            </div>
          </div>
        </div>

        <div class="side-card" v-reveal>
          <h3 class="side-label">Composition</h3>
          <div class="comp-rows">
            <div class="comp-row">
              <span class="comp-key">Attacks</span>
              <div class="comp-bar"><div class="comp-fill" :style="{ width: ((typeBreakdown.Attack ?? 0) / totalCards * 100) + '%' }"></div></div>
              <span class="comp-val">{{ typeBreakdown.Attack }}</span>
            </div>
            <div class="comp-row">
              <span class="comp-key">Skills</span>
              <div class="comp-bar"><div class="comp-fill comp-fill--skill" :style="{ width: ((typeBreakdown.Skill ?? 0) / totalCards * 100) + '%' }"></div></div>
              <span class="comp-val">{{ typeBreakdown.Skill }}</span>
            </div>
            <div class="comp-row">
              <span class="comp-key">Powers</span>
              <div class="comp-bar"><div class="comp-fill comp-fill--power" :style="{ width: ((typeBreakdown.Power ?? 0) / totalCards * 100) + '%' }"></div></div>
              <span class="comp-val">{{ typeBreakdown.Power }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <div v-else class="not-found">
    <h1>Deck not found</h1>
    <RouterLink to="/">Back to Home</RouterLink>
  </div>
</template>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2.5rem) 6rem;
}

.hero {
  position: relative;
  padding: clamp(2rem, 5vw, 4rem) 0 clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 3rem;
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

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
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

.edit-btn {
  appearance: none;
  border: 1px solid color-mix(in srgb, var(--c) 22%, var(--color-border));
  background: color-mix(in srgb, var(--c) 10%, rgba(255, 255, 255, 0.02));
  color: color-mix(in srgb, var(--c) 65%, #fff);
  padding: 0.55rem 0.95rem;
  border-radius: var(--radius-pill);
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 0.72rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.25s ease, background 0.25s ease;
}

.edit-btn:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--c) 40%, var(--color-border));
  background: color-mix(in srgb, var(--c) 14%, rgba(255, 255, 255, 0.03));
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

.content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
}

.glass-card {
  display: flex;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  transition: border-color 0.4s ease;
}

.glass-card:hover {
  border-color: color-mix(in srgb, var(--c) 20%, var(--color-border));
}

.gc-accent {
  width: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--c) 0%, color-mix(in srgb, var(--c) 30%, transparent) 100%);
}

.gc-body {
  padding: 2rem 2.25rem;
  flex: 1;
  min-width: 0;
}

.gc-label {
  font-family: var(--font-display);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c);
  margin: 0 0 1rem;
  opacity: 0.8;
}

.strategy-text {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.85;
  margin: 0;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cs-head {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.cs-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.cs-count {
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.cs-hint {
  font-size: var(--text-sm);
  color: var(--color-text-dim);
  margin: -0.25rem 0 0.25rem;
  line-height: 1.5;
}

.card-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0 16px;
}

.card-slot {
  position: relative;
  flex-shrink: 0;
  width: clamp(140px, 18vw, 200px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-slot:hover {
  transform: translateY(-6px) scale(1.05);
  z-index: 5;
}

.card-slot-img {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  transform: translate(calc(var(--i) * 6px), calc(var(--i) * 3px));
  z-index: calc(10 - var(--i));
  filter: brightness(calc(1 - var(--i) * 0.06))
          drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
  transition: filter 0.35s ease;
}

.card-slot:hover .card-slot-img:first-child {
  filter: brightness(1.05) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 12px color-mix(in srgb, var(--c) 20%, transparent));
}

.card-slot-img ~ .card-slot-img {
  position: absolute;
  top: 0;
  left: 0;
}

.card-slot-qty {
  position: absolute;
  bottom: -6px;
  right: -4px;
  z-index: 20;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  background: var(--c);
  min-width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  line-height: 1;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(0, 0, 0, 0.2);
}

.prio-group {
  margin-bottom: 1.5rem;
}

.prio-group:last-child {
  margin-bottom: 0;
}

.prio-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  margin-bottom: 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.prio-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.prio-num {
  opacity: 0.5;
  font-weight: 500;
}

.prio-attack {
  color: var(--color-attack);
  background: color-mix(in srgb, var(--color-attack) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-attack) 18%, transparent);
}

.prio-skill {
  color: var(--color-skill);
  background: color-mix(in srgb, var(--color-skill) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-skill) 18%, transparent);
}

.prio-power {
  color: var(--color-power);
  background: color-mix(in srgb, var(--color-power) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-power) 18%, transparent);
}

.sidebar {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.side-card {
  border-radius: var(--radius-xl);
  background:
    linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.025) 0%,
      rgba(255, 255, 255, 0.008) 100%
    );
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  transition: border-color 0.4s ease;
}

.side-card:hover {
  border-color: color-mix(in srgb, var(--c) 15%, var(--color-border));
}

.side-label {
  font-family: var(--font-display);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  margin: 0 0 1.25rem;
}

.curve {
  display: flex;
  gap: 0.4rem;
  align-items: flex-end;
  height: 90px;
}

.curve-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
}

.curve-num {
  font-family: var(--font-display);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.curve-track {
  flex: 1;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.curve-fill {
  width: 100%;
  border-radius: 6px;
  background: linear-gradient(
    180deg,
    var(--c) 0%,
    color-mix(in srgb, var(--c) 50%, transparent) 100%
  );
  transition: height 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 4px;
  box-shadow: 0 0 8px color-mix(in srgb, var(--c) 25%, transparent);
}

.curve-lbl {
  font-family: var(--font-display);
  font-size: 0.6rem;
  color: var(--color-text-dim);
  font-weight: 600;
}

.comp-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comp-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.comp-key {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  min-width: 52px;
}

.comp-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.comp-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--color-attack);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 6px color-mix(in srgb, var(--color-attack) 30%, transparent);
}

.comp-fill--skill {
  background: var(--color-skill);
  box-shadow: 0 0 6px color-mix(in srgb, var(--color-skill) 30%, transparent);
}

.comp-fill--power {
  background: var(--color-power);
  box-shadow: 0 0 6px color-mix(in srgb, var(--color-power) 30%, transparent);
}

.comp-val {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  min-width: 18px;
  text-align: right;
}

.not-found {
  text-align: center;
  padding: 5rem 2rem;
}

.not-found a {
  color: var(--c, var(--color-accent));
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--text-2xl);
  }

  .card-slot {
    width: 120px;
  }

  .sidebar {
    grid-template-columns: 1fr;
  }

  .gc-body {
    padding: 1.5rem;
  }
}
</style>

