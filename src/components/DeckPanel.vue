<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card } from '@/lib/types'
import type { DeckEntry } from '@/composables/useDeck'

const props = defineProps<{
  entries: DeckEntry[]
  deckSize: number
  stats: {
    types: Record<string, number>
    costs: Record<string, number>
  }
  shareStatus: 'idle' | 'copied'
}>()

const emit = defineEmits<{
  add: [card: Card]
  remove: [card: Card]
  clear: []
  share: []
}>()

const confirmingClear = ref(false)
let clearTimer: ReturnType<typeof setTimeout> | undefined

function confirmClear() {
  if (confirmingClear.value) {
    confirmingClear.value = false
    clearTimeout(clearTimer)
    emit('clear')
  } else {
    confirmingClear.value = true
    clearTimer = setTimeout(() => { confirmingClear.value = false }, 2000)
  }
}

const costDistribution = computed(() => {
  const entries: [string, number][] = []
  for (let i = 0; i <= 6; i++) {
    entries.push([String(i), props.stats.costs[String(i)] || 0])
  }
  if (props.stats.costs['X']) {
    entries.push(['X', props.stats.costs['X']])
  }
  return entries
})

const maxCostCount = computed(() => Math.max(...costDistribution.value.map(([, c]) => c), 1))
</script>

<template>
  <aside class="sidebar">
    <!-- ===== DECK HEADER ===== -->
    <div class="side-card side-card--header">
      <div class="deck-header">
        <div class="deck-title-row">
          <h2 class="deck-title">Your Deck</h2>
          <span class="deck-count">{{ deckSize }}</span>
        </div>
        <div v-if="deckSize" class="deck-actions">
          <button class="action-pill action-pill--share" :class="{ copied: shareStatus === 'copied' }" @click="emit('share')">
            <svg v-if="shareStatus === 'idle'" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 10l4-4M13 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM13 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ shareStatus === 'copied' ? 'Copied!' : 'Share' }}
          </button>
          <button class="action-pill action-pill--clear" :class="{ confirming: confirmingClear }" @click="confirmClear">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            {{ confirmingClear ? 'Confirm?' : 'Clear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== COMPOSITION ===== -->
    <div v-if="deckSize" class="side-card">
      <h3 class="side-label">Composition</h3>
      <div class="comp-rows">
        <div class="comp-row">
          <span class="comp-key">Attacks</span>
          <div class="comp-bar"><div class="comp-fill comp-fill--attack" :style="{ width: ((stats.types.Attack || 0) / deckSize * 100) + '%' }"></div></div>
          <span class="comp-val">{{ stats.types.Attack || 0 }}</span>
        </div>
        <div class="comp-row">
          <span class="comp-key">Skills</span>
          <div class="comp-bar"><div class="comp-fill comp-fill--skill" :style="{ width: ((stats.types.Skill || 0) / deckSize * 100) + '%' }"></div></div>
          <span class="comp-val">{{ stats.types.Skill || 0 }}</span>
        </div>
        <div class="comp-row">
          <span class="comp-key">Powers</span>
          <div class="comp-bar"><div class="comp-fill comp-fill--power" :style="{ width: ((stats.types.Power || 0) / deckSize * 100) + '%' }"></div></div>
          <span class="comp-val">{{ stats.types.Power || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- ===== MANA CURVE ===== -->
    <div v-if="deckSize" class="side-card">
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

    <!-- ===== CARD LIST ===== -->
    <div class="side-card side-card--entries">
      <h3 v-if="deckSize" class="side-label">Cards</h3>

      <div v-if="deckSize" class="entry-list">
        <div
          v-for="entry in entries"
          :key="entry.card.title"
          class="entry"
          :class="`entry-${entry.card.type.toLowerCase()}`"
        >
          <span class="entry-pip"></span>
          <span class="entry-qty">{{ entry.count }}x</span>
          <span class="entry-name">{{ entry.card.title }}</span>
          <span class="entry-cost">{{ entry.card.energyCost }}</span>
          <div class="entry-btns">
            <button @click="emit('add', entry.card)" title="Add one" aria-label="Add one">+</button>
            <button @click="emit('remove', entry.card)" title="Remove one" aria-label="Remove one">&minus;</button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style="opacity: 0.15; margin-bottom: 0.75rem;">
          <rect x="4" y="2" width="22" height="28" rx="3" stroke="currentColor" stroke-width="1.5"/>
          <rect x="10" y="8" width="22" height="28" rx="3" stroke="currentColor" stroke-width="1.5" fill="var(--color-bg)"/>
          <path d="M17 22v-6M14 19h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p class="empty-title">No cards yet</p>
        <p class="empty-hint">Click <strong>+</strong> on cards to start building</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ===== SIDEBAR LAYOUT ===== */
.sidebar {
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== SIDE CARDS ===== */
.side-card {
  border-radius: var(--radius-xl);
  background:
    linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.025) 0%,
      rgba(255, 255, 255, 0.008) 100%
    );
  border: 1px solid var(--color-border);
  padding: 1.25rem;
  backdrop-filter: blur(12px);
  transition: border-color 0.4s ease;
}

.side-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.side-label {
  font-family: var(--font-display);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  margin: 0 0 1rem;
}

/* ===== DECK HEADER ===== */
.deck-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.deck-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.deck-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.deck-count {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  line-height: 1.3;
}

.deck-actions {
  display: flex;
  gap: 0.4rem;
}

.action-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-dim);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-pill--share:hover {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: rgba(139, 92, 246, 0.2);
}

.action-pill--share.copied {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: rgba(139, 92, 246, 0.35);
}

.action-pill--clear:hover {
  color: var(--color-attack);
  background: rgba(244, 63, 94, 0.08);
  border-color: rgba(244, 63, 94, 0.15);
}

.action-pill--clear.confirming {
  color: var(--color-attack);
  border-color: rgba(244, 63, 94, 0.4);
  background: rgba(244, 63, 94, 0.1);
  animation: pulse-border 1s ease infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(244, 63, 94, 0.4); }
  50% { border-color: rgba(244, 63, 94, 0.7); }
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
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.comp-fill--attack {
  background: var(--color-attack);
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

/* ===== MANA CURVE ===== */
.curve {
  display: flex;
  gap: 0.4rem;
  align-items: flex-end;
  height: 80px;
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
  font-size: 0.55rem;
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
    var(--color-accent) 0%,
    color-mix(in srgb, var(--color-accent) 50%, transparent) 100%
  );
  transition: height 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 4px;
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

.curve-lbl {
  font-family: var(--font-display);
  font-size: 0.55rem;
  color: var(--color-text-dim);
  font-weight: 600;
}

/* ===== CARD ENTRIES ===== */
.side-card--entries {
  max-height: 50vh;
  display: flex;
  flex-direction: column;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  flex: 1;
}

.entry {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.5rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  background: transparent;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.entry:hover {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.04);
}

.entry-pip {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  flex-shrink: 0;
}

.entry-attack .entry-pip { background: var(--color-attack); }
.entry-skill .entry-pip { background: var(--color-skill); }
.entry-power .entry-pip { background: var(--color-power); }

.entry-qty {
  color: var(--color-text-dim);
  font-weight: 700;
  min-width: 1.4rem;
  font-variant-numeric: tabular-nums;
}

.entry-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: var(--text-xs);
}

.entry-cost {
  color: var(--color-text-dim);
  font-size: 0.6rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.12rem 0.35rem;
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
}

.entry-btns {
  display: flex;
  gap: 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.entry:hover .entry-btns,
.entry:focus-within .entry-btns {
  opacity: 1;
}

.entry-btns button {
  border: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.3);
  color: var(--color-text-muted);
  width: 1.3rem;
  height: 1.3rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s ease;
}

.entry-btns button:hover {
  color: var(--color-text);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* ===== EMPTY STATE ===== */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
}

.empty-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  margin: 0 0 0.25rem;
}

.empty-hint {
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  margin: 0;
  line-height: 1.5;
}

.empty-hint strong {
  color: var(--color-accent);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 960px) {
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .side-card--header {
    grid-column: 1 / -1;
  }

  .side-card--entries {
    grid-column: 1 / -1;
    max-height: none;
  }
}
</style>
