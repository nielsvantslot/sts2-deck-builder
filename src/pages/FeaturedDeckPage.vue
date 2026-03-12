<script setup lang="ts">
import { computed } from 'vue'
import { FEATURED_DECKS, resolveDeckCards, resolveStarterCards } from '@/data/decks'
import { CHARACTER_MAP } from '@/lib/constants'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'
import CharacterIcon from '@/components/CharacterIcon.vue'
import CardImage from '@/components/CardImage.vue'

const props = defineProps<{ deckId: string }>()

const deck = computed(() => FEATURED_DECKS.find((d) => d.id === props.deckId))
const charInfo = computed(() => (deck.value ? CHARACTER_MAP[deck.value.characterId] : null))

const resolvedCards = computed(() => {
  if (!deck.value) return []
  return resolveDeckCards(deck.value, allCards as Card[])
})

const starterCards = computed(() => {
  if (!deck.value) return []
  return resolveStarterCards(deck.value, allCards as Card[])
})

const pickupGroups = computed(() => {
  const groups = [
    { key: 'core' as const, label: 'Core — Must Have', cards: [] as typeof resolvedCards.value },
    { key: 'high' as const, label: 'High Priority', cards: [] as typeof resolvedCards.value },
    { key: 'situational' as const, label: 'Situational', cards: [] as typeof resolvedCards.value },
  ]
  for (const entry of resolvedCards.value) {
    const group = groups.find((g) => g.key === entry.priority)
    if (group) group.cards.push(entry)
  }
  return groups.filter((g) => g.cards.length > 0)
})

const removals = computed(() => deck.value?.removals ?? [])

const allDeckCards = computed(() => [...starterCards.value, ...resolvedCards.value])

const totalCards = computed(() => allDeckCards.value.reduce((sum, e) => sum + e.count, 0))
const pickupCount = computed(() => resolvedCards.value.reduce((sum, e) => sum + e.count, 0))
const starterCount = computed(() => starterCards.value.reduce((sum, e) => sum + e.count, 0))

const typeBreakdown = computed(() => {
  const types: Record<string, number> = { Attack: 0, Skill: 0, Power: 0 }
  for (const { card, count } of allDeckCards.value) {
    types[card.type] = (types[card.type] || 0) + count
  }
  return types
})

const costDistribution = computed(() => {
  const costs: Record<string, number> = {}
  for (const { card, count } of allDeckCards.value) {
    costs[card.energyCost] = (costs[card.energyCost] || 0) + count
  }
  return Object.entries(costs).sort(([a], [b]) => {
    if (a === 'X') return 1
    if (b === 'X') return -1
    return Number(a) - Number(b)
  })
})

const maxCostCount = computed(() => Math.max(...costDistribution.value.map(([, c]) => c), 1))
</script>

<template>
  <div class="page" v-if="deck" :style="{ '--c': charInfo?.color }">
    <!-- ===== CINEMATIC HERO ===== -->
    <header class="hero">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <RouterLink :to="`/characters/${deck.characterId}`" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ deck.character }}
        </RouterLink>

        <div class="hero-badge">
          <CharacterIcon :character="deck.characterId" :size="20" />
          <span>{{ deck.character }}</span>
        </div>
        <h1 class="hero-title">{{ deck.name }}</h1>

        <div class="hero-chips">
          <div class="chip"><span class="chip-val">{{ totalCards }}</span><span class="chip-key">Cards</span></div>
          <div class="chip"><span class="chip-val">{{ typeBreakdown.Attack }}</span><span class="chip-key">Attacks</span></div>
          <div class="chip"><span class="chip-val">{{ typeBreakdown.Skill }}</span><span class="chip-key">Skills</span></div>
          <div class="chip"><span class="chip-val">{{ typeBreakdown.Power }}</span><span class="chip-key">Powers</span></div>
        </div>
      </div>
    </header>

    <!-- ===== CONTENT ===== -->
    <div class="content">
      <!-- MAIN COLUMN -->
      <main class="main">
        <!-- STRATEGY -->
        <section class="glass-card" v-reveal>
          <div class="gc-accent"></div>
          <div class="gc-body">
            <h2 class="gc-label">Strategy Overview</h2>
            <p class="strategy-text">{{ deck.strategy }}</p>
          </div>
        </section>

        <!-- STARTER DECK -->
        <section class="card-section" v-reveal>
          <div class="cs-head">
            <h2 class="cs-title">Starter Deck</h2>
            <span class="cs-count">{{ starterCount }} cards</span>
          </div>
          <p class="cs-hint">Every {{ deck.character }} run begins with these cards.</p>
          <div class="card-showcase">
            <div v-for="entry in starterCards" :key="entry.card.title" class="card-slot" :class="{ 'is-stacked': entry.count > 1 }" :style="{ '--stack': Math.min(entry.count, 5), marginRight: entry.count > 1 ? (Math.min(entry.count, 5) - 1) * 6 + 'px' : '0' }">
              <CardImage v-for="i in Math.min(entry.count, 5)" :key="i" :card="entry.card" class="card-slot-img" :style="{ '--i': i - 1 }" />
              <span v-if="entry.count > 1" class="card-slot-qty">{{ entry.count }}</span>
            </div>
          </div>
        </section>

        <!-- PICKUP CARDS -->
        <section class="card-section" v-reveal>
          <div class="cs-head">
            <h2 class="cs-title">Cards to Pick Up</h2>
            <span class="cs-count">{{ pickupCount }} cards</span>
          </div>
          <p class="cs-hint">Focus on adding these cards during your run, by priority.</p>
          <div v-for="group in pickupGroups" :key="group.key" class="prio-group">
            <div class="prio-bar" :class="`prio-${group.key}`">
              <span class="prio-dot"></span>
              <span class="prio-text">{{ group.label }}</span>
              <span class="prio-num">{{ group.cards.reduce((s, c) => s + c.count, 0) }}</span>
            </div>
            <div class="card-showcase">
              <div v-for="entry in group.cards" :key="entry.card.title" class="card-slot" :class="{ 'is-stacked': entry.count > 1 }" :style="{ '--stack': Math.min(entry.count, 5), marginRight: entry.count > 1 ? (Math.min(entry.count, 5) - 1) * 6 + 'px' : '0' }">
                <CardImage v-for="i in Math.min(entry.count, 5)" :key="i" :card="entry.card" class="card-slot-img" :style="{ '--i': i - 1 }" />
                <span v-if="entry.count > 1" class="card-slot-qty">{{ entry.count }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- KEY COMBOS -->
        <section class="card-section" v-reveal>
          <div class="cs-head">
            <h2 class="cs-title">Key Combos</h2>
          </div>
          <div class="combos">
            <article v-for="combo in deck.combos" :key="combo.name" class="combo">
              <div class="combo-accent"></div>
              <div class="combo-body">
                <h3 class="combo-name">{{ combo.name }}</h3>
                <p class="combo-desc">{{ combo.description }}</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <!-- MANA CURVE -->
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

        <!-- COMPOSITION -->
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

        <!-- REMOVALS -->
        <div v-if="removals.length" class="side-card side-card--removals" v-reveal>
          <h3 class="side-label side-label--red">Cards to Remove</h3>
          <div class="removals">
            <div v-for="r in removals" :key="r.title" class="removal">
              <div class="removal-icon">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
              <div>
                <span class="removal-name">{{ r.title }}</span>
                <span class="removal-reason">{{ r.reason }}</span>
              </div>
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
/* ========================================
   PREMIUM DECK DETAIL – MILLION-DOLLAR FIT
   ======================================== */

.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2.5rem) 6rem;
}

/* ===== CINEMATIC HERO ===== */
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

/* ===== MAIN COLUMN ===== */
.main {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
}

/* ===== GLASS CARD (Strategy) ===== */
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

/* ===== CARD SECTIONS (Starter, Pickups, Combos) ===== */
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

/* ===== CARD SHOWCASE ===== */
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

/* ===== PRIORITY GROUPS ===== */
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

.prio-text {
  color: inherit;
}

.prio-num {
  opacity: 0.5;
  font-weight: 500;
}

.prio-core {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.12);
}

.prio-high {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.06);
  border: 1px solid rgba(96, 165, 250, 0.12);
}

.prio-situational {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.06);
  border: 1px solid rgba(167, 139, 250, 0.12);
}

/* ===== COMBOS ===== */
.combos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.combo {
  display: flex;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.012);
  border: 1px solid var(--color-border);
  transition: all 0.35s ease;
}

.combo:hover {
  border-color: color-mix(in srgb, var(--c) 30%, var(--color-border));
  background: rgba(255, 255, 255, 0.025);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
              0 0 0 1px color-mix(in srgb, var(--c) 8%, transparent);
  transform: translateX(4px);
}

.combo-accent {
  width: 3px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--c) 40%, transparent);
  transition: background 0.35s ease;
}

.combo:hover .combo-accent {
  background: var(--c);
}

.combo-body {
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-width: 0;
}

.combo-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.combo-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0;
}

/* ===== SIDEBAR ===== */
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

.side-label--red {
  color: #f43f5e;
}

/* ===== MANA CURVE ===== */
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

/* ===== COMPOSITION BARS ===== */
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

/* ===== REMOVALS ===== */
.side-card--removals {
  border-color: rgba(244, 63, 94, 0.08);
  background: linear-gradient(
    165deg,
    rgba(244, 63, 94, 0.03) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
}

.side-card--removals:hover {
  border-color: rgba(244, 63, 94, 0.15);
}

.removals {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.removal {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.removal-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  margin-top: 1px;
}

.removal-name {
  display: block;
  font-weight: 700;
  color: #fb7185;
  font-size: var(--text-sm);
  line-height: 1.3;
}

.removal-reason {
  display: block;
  font-size: 0.7rem;
  color: var(--color-text-dim);
  line-height: 1.5;
  margin-top: 2px;
}

/* ===== NOT FOUND ===== */
.not-found {
  text-align: center;
  padding: 5rem 2rem;
}

.not-found a {
  color: var(--c, var(--color-accent));
}

/* ===== RESPONSIVE ===== */
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

  .side-card--removals {
    grid-column: 1 / -1;
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

  .combo-body {
    padding: 1rem;
  }

  .chip {
    padding: 0.3rem 0.7rem;
  }
}
</style>
