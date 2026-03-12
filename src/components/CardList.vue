<script setup lang="ts">
import type { Card } from '@/lib/types'
import CardItem from './CardItem.vue'

defineProps<{
  cards: Card[]
  getCount: (card: Card) => number
}>()

const emit = defineEmits<{
  add: [card: Card]
  remove: [card: Card]
}>()
</script>

<template>
  <div class="card-list-meta">
    <span class="meta-count">{{ cards.length }} cards</span>
  </div>
  <div class="card-grid">
    <CardItem
      v-for="(card, i) in cards"
      :key="card.title"
      :card="card"
      :count="getCount(card)"
      :style="{ animationDelay: `${Math.min(i * 30, 400)}ms` }"
      class="card-enter"
      @add="emit('add', $event)"
      @remove="emit('remove', $event)"
    />
  </div>
  <div v-if="!cards.length" class="empty-state">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="opacity: 0.2">
      <rect x="5" y="3" width="24" height="32" rx="4" stroke="currentColor" stroke-width="1.5"/>
      <rect x="11" y="9" width="24" height="32" rx="4" stroke="currentColor" stroke-width="1.5" fill="var(--color-surface-solid)"/>
    </svg>
    <p>No cards match your filters.</p>
  </div>
</template>

<style scoped>
.card-list-meta {
  display: flex;
  align-items: center;
}

.meta-count {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1.25rem;
}

.card-enter {
  animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-dim);
  text-align: center;
  padding: 5rem 1rem;
  font-size: var(--text-sm);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-xl);
}
</style>
