<script setup lang="ts">
import type { SortField } from '@/composables/useCards'

const search = defineModel<string>('search', { default: '' })
const type = defineModel<string>('type', { default: '' })
const rarity = defineModel<string>('rarity', { default: '' })
const cost = defineModel<string>('cost', { default: '' })
const sort = defineModel<SortField>('sort', { default: 'name' })

defineEmits<{
  clear: []
}>()

const types = ['Attack', 'Skill', 'Power']
const rarities = ['Starter', 'Common', 'Uncommon', 'Rare']
const costs = ['0', '1', '2', '3', '4', '5', '6', 'X']
</script>

<template>
  <div class="filters">
    <div class="search-row">
      <div class="search-field">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search cards..."
        />
      </div>
      <button class="btn-reset" @click="$emit('clear')" title="Reset filters">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="filter-bar">
      <select v-model="type" class="f-select" aria-label="Filter by type">
        <option value="">All Types</option>
        <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="rarity" class="f-select" aria-label="Filter by rarity">
        <option value="">All Rarities</option>
        <option v-for="r in rarities" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-model="cost" class="f-select" aria-label="Filter by cost">
        <option value="">All Costs</option>
        <option v-for="c in costs" :key="c" :value="c">{{ c }} Energy</option>
      </select>
      <select v-model="sort" class="f-select" aria-label="Sort cards">
        <option value="name">Name</option>
        <option value="cost">Cost</option>
        <option value="type">Type</option>
        <option value="rarity">Rarity</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-xl);
  background:
    linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.025) 0%,
      rgba(255, 255, 255, 0.008) 100%
    );
  border: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  transition: border-color 0.4s ease;
}

.filters:focus-within {
  border-color: rgba(255, 255, 255, 0.1);
}

.search-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-field {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-dim);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.search-field:focus-within .search-icon {
  color: var(--color-accent);
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.85rem 0.6rem 2.4rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: rgba(0, 0, 0, 0.25);
  color: var(--color-text);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.search-input::placeholder {
  color: var(--color-text-dim);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
  background: rgba(0, 0, 0, 0.35);
}

.btn-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-dim);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.btn-reset:hover {
  color: var(--color-attack);
  border-color: rgba(244, 63, 94, 0.3);
  background: rgba(244, 63, 94, 0.08);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.f-select {
  padding: 0.4rem 1.6rem 0.4rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235d5878' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.55rem center;
}

.f-select:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.f-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}
</style>
