<script setup lang="ts">
defineProps<{
  character: string
  size?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 48"
    :height="size ?? 48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="character-icon"
    role="img"
    :aria-label="`${character} icon`"
  >
    <!-- Ironclad: Flame -->
    <g v-if="character === 'ironclad'">
      <path
        d="M24 6C24 6 16 16 16 26c0 4.4 3.6 8 8 8s8-3.6 8-8C32 16 24 6 24 6z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M24 6C24 6 16 16 16 26c0 4.4 3.6 8 8 8s8-3.6 8-8C32 16 24 6 24 6z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <path
        d="M24 18c0 0-4 5-4 10c0 2.2 1.8 4 4 4s4-1.8 4-4C28 23 24 18 24 18z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M20 42h8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- Silent: Dual Daggers -->
    <g v-else-if="character === 'silent'">
      <path
        d="M16 8L22 28L24 26L18 6z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 8L22 28"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M19 30L25 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M17 28L23 34"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M32 8L26 28L24 26L30 6z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M32 8L26 28"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M29 30L23 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M31 28L25 34"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle cx="24" cy="40" r="2" fill="currentColor" opacity="0.3" />
    </g>

    <!-- Defect: Lightning Orb -->
    <g v-else-if="character === 'defect'">
      <circle cx="24" cy="24" r="14" fill="currentColor" opacity="0.1" />
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="8"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-dasharray="3 3"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M26 16L22 24H27L21 32"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="34" cy="34" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="34" cy="14" r="1.5" fill="currentColor" opacity="0.3" />
    </g>

    <!-- Necrobinder: Skull -->
    <g v-else-if="character === 'necrobinder'">
      <path
        d="M24 6C16.3 6 10 12.3 10 20c0 5 2.5 9.3 6 12v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c3.5-2.7 6-7 6-12 0-7.7-6.3-14-14-14z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M24 6C16.3 6 10 12.3 10 20c0 5 2.5 9.3 6 12v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c3.5-2.7 6-7 6-12 0-7.7-6.3-14-14-14z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle cx="19" cy="20" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="29" cy="20" r="3" fill="currentColor" opacity="0.5" />
      <path
        d="M20 30v6M24 30v6M28 30v6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </g>

    <!-- Regent: Crown -->
    <g v-else-if="character === 'regent'">
      <path
        d="M8 34L12 14L20 22L24 10L28 22L36 14L40 34z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M8 34L12 14L20 22L24 10L28 22L36 14L40 34z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
        fill="none"
      />
      <path
        d="M8 34H40"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M10 38H38"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle cx="24" cy="10" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="36" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
    </g>

    <!-- Fallback: generic diamond -->
    <g v-else>
      <path
        d="M24 8L40 24L24 40L8 24z"
        stroke="currentColor"
        stroke-width="2"
        fill="currentColor"
        fill-opacity="0.15"
      />
    </g>
  </svg>
</template>

<style scoped>
.character-icon {
  flex-shrink: 0;
}
</style>
