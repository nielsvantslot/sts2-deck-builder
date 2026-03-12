<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/lib/types'
import type { DeckEntry } from '@/composables/useDeck'

defineProps<{
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

function maxCostCount(costs: Record<string, number>): number {
  const vals = Object.values(costs)
  return vals.length ? Math.max(...vals, 1) : 1
}
</script>

<template>
  <aside class="deck-panel">
    <div class="panel-header">
      <h2 class="panel-title">
        Deck
        <span class="panel-count">{{ deckSize }}</span>
      </h2>
      <div class="header-actions">
        <button v-if="deckSize" class="btn-share" :class="{ copied: shareStatus === 'copied' }" @click="emit('share')">
          <svg v-if="shareStatus === 'idle'" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 10l4-4M13 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM13 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ shareStatus === 'copied' ? 'Copied!' : 'Share' }}
        </button>
        <button v-if="deckSize" class="btn-clear" :class="{ confirming: confirmingClear }" @click="confirmClear">
          {{ confirmingClear ? 'Confirm?' : 'Clear' }}
        </button>
      </div>
    </div>

    <template v-if="deckSize">
      <!-- Stats row -->
      <div class="stat-row">
        <div class="stat stat-atk">
          <span class="stat-val">{{ stats.types.Attack || 0 }}</span>
          <span class="stat-lbl">ATK</span>
        </div>
        <div class="stat stat-skl">
          <span class="stat-val">{{ stats.types.Skill || 0 }}</span>
          <span class="stat-lbl">SKL</span>
        </div>
        <div class="stat stat-pwr">
          <span class="stat-val">{{ stats.types.Power || 0 }}</span>
          <span class="stat-lbl">PWR</span>
        </div>
      </div>

      <!-- Mana curve -->
      <div class="curve-section">
        <span class="curve-title">Mana Curve</span>
        <div class="curve-row">
          <div v-for="i in 7" :key="i - 1" class="curve-col">
            <span class="curve-num">{{ stats.costs[String(i - 1)] || 0 }}</span>
            <div class="curve-track">
              <div class="curve-fill" :style="{ height: `${((stats.costs[String(i - 1)] || 0) / maxCostCount(stats.costs)) * 100}%` }"></div>
            </div>
            <span class="curve-lbl">{{ i - 1 }}</span>
          </div>
          <div class="curve-col">
            <span class="curve-num">{{ stats.costs['X'] || 0 }}</span>
            <div class="curve-track">
              <div class="curve-fill" :style="{ height: `${((stats.costs['X'] || 0) / maxCostCount(stats.costs)) * 100}%` }"></div>
            </div>
            <span class="curve-lbl">X</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>
    </template>

    <!-- Card entries -->
    <div class="entry-list">
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
          <button @click="emit('add', entry.card)" title="Add one">+</button>
          <button @click="emit('remove', entry.card)" title="Remove one">&minus;</button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!deckSize" class="empty">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="opacity: 0.2; margin-bottom: 0.5rem;">
        <rect x="4" y="2" width="20" height="26" rx="3" stroke="currentColor" stroke-width="1.5"/>
        <rect x="8" y="6" width="20" height="26" rx="3" stroke="currentColor" stroke-width="1.5" fill="var(--color-surface)"/>
        <path d="M14 19v-6M11 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p>Click <strong>+</strong> on cards to build your deck</p>
    </div>
  </aside>
</template>

<style scoped>
.deck-panel {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  height: fit-content;
  position: sticky;
  top: 5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 0.35rem;
}

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-dim);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-share:hover {
  color: var(--color-accent);
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.15);
}

.btn-share.copied {
  color: var(--color-accent);
  border-color: rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.1);
}

.panel-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.panel-count {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-dim);
  background: var(--color-surface);
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
}

.btn-clear {
  padding: 0.25rem 0.65rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-dim);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-clear:hover {
  color: var(--color-attack);
  background: rgba(244, 63, 94, 0.08);
  border-color: rgba(244, 63, 94, 0.15);
}

.btn-clear.confirming {
  color: var(--color-attack);
  border-color: rgba(244, 63, 94, 0.4);
  background: rgba(244, 63, 94, 0.1);
  animation: pulse-border 1s ease infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(244, 63, 94, 0.4); }
  50% { border-color: rgba(244, 63, 94, 0.7); }
}

/* Stats */
.stat-row {
  display: flex;
  gap: 0.4rem;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.25rem;
  border-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border-subtle);
}

.stat-val {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
}

.stat-atk .stat-val { color: var(--color-attack); }
.stat-skl .stat-val { color: var(--color-skill); }
.stat-pwr .stat-val { color: var(--color-power); }

.stat-lbl {
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

/* Mana curve */
.curve-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.curve-title {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
}

.curve-row {
  display: flex;
  gap: 4px;
  height: 56px;
  align-items: flex-end;
}

.curve-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 2px;
}

.curve-num {
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
  min-height: 0.65rem;
}

.curve-track {
  flex: 1;
  width: 100%;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.curve-fill {
  width: 100%;
  background: var(--color-accent);
  border-radius: 3px 3px 0 0;
  min-height: 0;
  transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.7;
}

.curve-lbl {
  font-size: 0.5rem;
  color: var(--color-text-dim);
  font-weight: 600;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

/* Entries */
.entry-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 45vh;
  overflow-y: auto;
}

.entry {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.55rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  background: transparent;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.entry:hover {
  background: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.08);
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
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
}

.entry-btns {
  display: flex;
  gap: 3px;
  opacity: 0;
  transition: opacity var(--transition-fast);
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
  transition: all var(--transition-fast);
}

.entry-btns button:hover {
  color: var(--color-text);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text-dim);
  font-size: var(--text-sm);
  text-align: center;
  padding: 2.5rem 0;
}

.empty strong {
  color: var(--color-accent);
}
</style>
