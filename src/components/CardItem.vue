<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/lib/types'
import CardImage from './CardImage.vue'

const props = defineProps<{
  card: Card
  count?: number
}>()

const emit = defineEmits<{
  add: [card: Card]
  remove: [card: Card]
}>()

const cardRef = ref<HTMLElement | null>(null)
const tiltStyle = ref('')

function onPointerMove(e: PointerEvent) {
  const el = cardRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  tiltStyle.value = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.04)`
}

function onPointerLeave() {
  tiltStyle.value = ''
}
</script>

<template>
  <div
    ref="cardRef"
    class="card-item"
    :class="{ 'in-deck': count }"
    :style="{ transform: tiltStyle }"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="card-visual">
      <CardImage :card="card" />
      <div class="card-actions">
        <button class="btn-add" @click.stop="emit('add', card)" title="Add to deck" aria-label="Add to deck">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </button>
        <span v-if="count" class="card-count">{{ count }}x</span>
        <button
          v-if="count"
          class="btn-remove"
          @click.stop="emit('remove', card)"
          title="Remove from deck"
          aria-label="Remove from deck"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M1 7h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  position: relative;
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
  border-radius: 10px;
}

.card-item:hover {
  z-index: 5;
}

.card-item.in-deck::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid var(--color-accent);
  border-radius: 10px;
  pointer-events: none;
  opacity: 0.6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
}

.card-visual {
  position: relative;
  cursor: pointer;
}

.card-actions {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
}

.card-visual:hover .card-actions,
.card-visual:focus-within .card-actions {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.btn-add,
.btn-remove {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(5, 4, 7, 0.85);
  color: #f0e6d2;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-spring);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.btn-add:hover {
  background: rgba(16, 185, 129, 0.7);
  border-color: rgba(16, 185, 129, 0.9);
  transform: scale(1.15);
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.3);
}

.btn-remove:hover {
  background: rgba(244, 63, 94, 0.7);
  border-color: rgba(244, 63, 94, 0.9);
  transform: scale(1.15);
  box-shadow: 0 0 24px rgba(244, 63, 94, 0.3);
}

.card-count {
  font-size: 0.88rem;
  font-weight: 800;
  color: #f0e6d2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
  min-width: 1.5rem;
  text-align: center;
}
</style>
