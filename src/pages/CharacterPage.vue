<script setup lang="ts">
import { computed } from 'vue'
import { CHARACTER_MAP } from '@/lib/constants'
import { FEATURED_DECKS } from '@/data/decks'
import { STARTER_DECKS } from '@/lib/starter-decks'
import type { Card } from '@/lib/types'
import allCards from '@/data/cards.json'
import CardImage from '@/components/CardImage.vue'
import CharacterIcon from '@/components/CharacterIcon.vue'

const props = defineProps<{ characterId: string }>()

const char = computed(() => CHARACTER_MAP[props.characterId] ?? null)

const decks = computed(() =>
  FEATURED_DECKS.filter((d) => d.characterId === props.characterId),
)

const starter = computed(() => STARTER_DECKS[props.characterId] ?? null)

const starterTotal = computed(() =>
  starter.value ? starter.value.cards.reduce((s, c) => s + c.count, 0) : 0,
)

const starterCards = computed<{ card: Card; count: number }[]>(() => {
  if (!starter.value) return []
  const charName = props.characterId.charAt(0).toUpperCase() + props.characterId.slice(1)
  const pool = (allCards as Card[]).filter((c) => c.character === charName)
  return starter.value.cards
    .map((entry) => {
      const card = pool.find((c) => c.title === entry.title)
      return card ? { card, count: entry.count } : null
    })
    .filter((e): e is { card: Card; count: number } => e !== null)
})

function totalDeckCards(deck: (typeof FEATURED_DECKS)[number]) {
  const s = STARTER_DECKS[deck.characterId]
  const sTotal = s ? s.cards.reduce((sum, c) => sum + c.count, 0) : 0
  return sTotal + deck.pickups.reduce((sum, c) => sum + c.count, 0)
}

function corePickupCards(deck: (typeof FEATURED_DECKS)[number]): Card[] {
  const charName = deck.characterId.charAt(0).toUpperCase() + deck.characterId.slice(1)
  const pool = (allCards as Card[]).filter((c) => c.character === charName)
  return deck.pickups
    .filter((p) => p.priority === 'core')
    .slice(0, 3)
    .map((p) => pool.find((c) => c.title === p.title))
    .filter((c): c is Card => c !== undefined)
}
</script>

<template>
  <div class="page" v-if="char" :style="{ '--c': char.color }">
    <!-- ===== HERO ===== -->
    <header class="hero">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <RouterLink to="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          All Characters
        </RouterLink>

        <div class="hero-badge">
          <CharacterIcon :character="char.id" :size="28" />
          <span>{{ char.name }}</span>
        </div>

        <div class="hero-actions">
          <RouterLink :to="`/${char.id}`" class="action-btn action-btn--primary">
            <span>Browse All Cards</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ===== STARTER DECK ===== -->
    <section class="section" v-if="starter" v-reveal>
      <div class="section-head">
        <h2 class="section-title">Starter Deck</h2>
        <div class="section-chips">
          <span class="chip"><strong>{{ starter.energy }}</strong> Energy</span>
          <span class="chip"><strong>{{ starterTotal }}</strong> Cards</span>
          <span v-if="starter.secondaryResource" class="chip"><strong>{{ starter.secondaryResource.amount }}</strong> {{ starter.secondaryResource.name }}</span>
        </div>
      </div>
      <div class="card-showcase">
        <div
          v-for="entry in starterCards"
          :key="entry.card.title"
          class="card-slot"
          :style="{ '--stack': Math.min(entry.count, 5), marginRight: entry.count > 1 ? (Math.min(entry.count, 5) - 1) * 6 + 'px' : '0' }"
        >
          <CardImage
            v-for="i in Math.min(entry.count, 5)"
            :key="i"
            :card="entry.card"
            class="card-slot-img"
            :style="{ '--i': i - 1 }"
          />
          <span v-if="entry.count > 1" class="card-slot-qty">{{ entry.count }}</span>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED DECKS ===== -->
    <section class="section" v-if="decks.length" v-reveal>
      <div class="section-head">
        <h2 class="section-title">Featured Decks</h2>
        <span class="section-sub">{{ decks.length }} curated builds</span>
      </div>
      <div class="deck-grid">
        <RouterLink
          v-for="deck in decks"
          :key="deck.id"
          :to="`/decks/${deck.id}`"
          class="deck-box"
        >
          <div class="deck-box-fan">
            <CardImage
              v-for="(card, idx) in corePickupCards(deck)"
              :key="card.title"
              :card="card"
              class="deck-fan-card"
              :style="{ '--fan-i': idx, '--fan-total': corePickupCards(deck).length }"
            />
          </div>
          <div class="deck-box-body">
            <span class="deck-box-name">{{ deck.name }}</span>
            <span class="deck-box-strategy">{{ deck.strategy }}</span>
            <div class="deck-box-footer">
              <span class="deck-box-stat"><strong>{{ totalDeckCards(deck) }}</strong> cards</span>
              <span class="deck-box-stat"><strong>{{ deck.pickups.filter(p => p.priority === 'core').length }}</strong> core</span>
              <svg class="deck-box-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5.5M11 3v5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <h1>Character not found</h1>
    <RouterLink to="/">Back to Home</RouterLink>
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
  gap: 1rem;
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
  margin-bottom: 0.25rem;
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
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  background: linear-gradient(
    180deg,
    var(--color-text) 30%,
    color-mix(in srgb, var(--c) 40%, var(--color-text)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  font-size: var(--text-xs);
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn--primary {
  border: 1px solid color-mix(in srgb, var(--c) 50%, transparent);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  color: var(--c);
}

.action-btn--primary:hover {
  background: color-mix(in srgb, var(--c) 20%, transparent);
  border-color: var(--c);
  transform: translateX(4px);
}

.action-btn svg {
  transition: transform 0.3s ease;
}

.action-btn:hover svg {
  transform: translateX(3px);
}

/* ===== SECTIONS ===== */
.section {
  margin-bottom: 3rem;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.section-sub {
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.section-chips {
  display: flex;
  gap: 0.4rem;
}

.chip {
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--color-text-dim);
  letter-spacing: 0.02em;
  backdrop-filter: blur(8px);
}

.chip strong {
  font-weight: 700;
  color: var(--c);
  font-family: var(--font-display);
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
  width: clamp(140px, 18vw, 210px);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(0, 0, 0, 0.2);
}

/* ===== DECK GRID ===== */
.deck-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 10px 0 8px;
}

.deck-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 280px;
  flex-shrink: 0;
  text-decoration: none;
  color: var(--color-text);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.deck-box:hover {
  transform: translateY(-6px);
}

.deck-box-fan {
  display: flex;
  justify-content: center;
  padding: 0 0 6px;
}

.deck-fan-card {
  width: 100px;
  height: auto;
  flex-shrink: 0;
  margin-right: -14px;
  transform: rotate(calc((var(--fan-i) - (var(--fan-total) - 1) / 2) * 3deg));
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  position: relative;
  z-index: calc(10 - var(--fan-i));
}

.deck-fan-card:last-child {
  margin-right: 0;
}

.deck-box:hover .deck-fan-card {
  transform: rotate(calc((var(--fan-i) - (var(--fan-total) - 1) / 2) * 6deg)) translateY(-4px);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6));
}

.deck-box-body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.85rem 1rem 0.7rem;
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--c) 8%, rgba(18, 18, 28, 0.97)) 0%,
    rgba(14, 14, 22, 0.98) 100%
  );
  border: 1px solid color-mix(in srgb, var(--c) 15%, var(--color-border));
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.deck-box:hover .deck-box-body {
  border-color: color-mix(in srgb, var(--c) 35%, var(--color-border));
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.55),
    0 0 20px color-mix(in srgb, var(--c) 8%, transparent),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.deck-box-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.deck-box-strategy {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deck-box-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.2rem;
  padding-top: 0.45rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.deck-box-stat {
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--color-text-dim);
  white-space: nowrap;
}

.deck-box-stat strong {
  font-weight: 700;
  color: var(--c);
}

.deck-box-arrow {
  margin-left: auto;
  color: var(--color-text-dim);
  opacity: 0;
  transform: translate(-4px, 4px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.deck-box:hover .deck-box-arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--c);
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
@media (max-width: 768px) {
  .hero-badge {
    font-size: var(--text-2xl);
  }

  .card-slot {
    width: 120px;
  }

  .deck-box {
    width: 240px;
  }

  .deck-fan-card {
    width: 84px;
  }
}

@media (max-width: 500px) {
  .deck-grid {
    justify-content: center;
  }

  .card-slot {
    width: 100px;
  }
}
</style>
