<script setup lang="ts">
import { CHARACTERS } from '@/lib/constants'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const ready = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
})

function selectChar(charId: string) {
  router.push(`/characters/${charId}`)
}
</script>

<template>
  <div class="home" :class="{ ready }">
    <!-- ===== FULL-SCREEN ACCORDION ===== -->
    <div class="roster">
      <div
        v-for="(char, idx) in CHARACTERS"
        :key="char.id"
        class="roster-col"
        :style="{ '--c': char.color, '--idx': idx, '--img-h': char.imageHeight, '--img-pos': char.imagePosition }"
        @click="selectChar(char.id)"
      >
        <img :src="`/images/characters/${char.id}.webp`" :alt="char.name" class="roster-img" />
        <div class="roster-scrim"></div>
        <div class="roster-glow"></div>
        <div class="roster-detail">
          <div class="roster-stat">
            <span class="stat-icon">&#9829;</span>
            <span class="stat-value">{{ char.hp }}</span>
            <span class="stat-label">HP</span>
          </div>
          <div class="roster-stat">
            <span class="stat-icon">&#9889;</span>
            <span class="stat-value">3</span>
            <span class="stat-label">Energy</span>
          </div>
          <div class="stat-divider"></div>
          <div class="roster-stat roster-stat--relic">
            <span class="stat-label">{{ char.relic.name }}</span>
            <span class="stat-sublabel">{{ char.relic.description }}</span>
          </div>
        </div>
        <div class="roster-info">
          <div class="roster-info-top">
            <h2 class="roster-name">{{ char.name }}</h2>
            <p class="roster-desc">{{ char.description }}</p>
          </div>
          <span class="roster-hint">View decks &#8594;</span>
        </div>
        <div class="roster-bar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin-top: -5rem;
  background: #050407;
}

/* ===== FULL-SCREEN ACCORDION ===== */
.roster {
  display: flex;
  width: 100%;
  height: 100%;
}

/* ===== INTRO ANIMATION ===== */
.roster-col {
  --slant: 40px;
  --delay: calc(var(--idx) * 120ms + 300ms);
  position: relative;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  cursor: pointer;
  transition: flex 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  clip-path: polygon(
    var(--slant) 0,
    100% 0,
    calc(100% - var(--slant)) 100%,
    0 100%
  );
  margin-left: calc(-1 * var(--slant));

  /* Hidden before ready */
  opacity: 0;
  transform: translateY(60px) scale(0.97);
}

.home.ready .roster-col {
  animation: col-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) forwards;
}

@keyframes col-enter {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Image starts darker, brightens on entry */
.roster-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: var(--img-h, 100%);
  object-fit: cover;
  object-position: var(--img-pos, 50% 0);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
  filter: brightness(0.15) saturate(0.5);
}

.home.ready .roster-img {
  animation: img-reveal 1.2s ease var(--delay) forwards;
}

@keyframes img-reveal {
  0% {
    filter: brightness(0.15) saturate(0.5);
    transform: scale(1.12);
  }
  100% {
    filter: brightness(0.55) saturate(0.9);
    transform: scale(1);
  }
}

/* Glow pulses on entry */
.roster-glow {
  position: absolute;
  bottom: 0;
  left: -20%;
  right: -20%;
  height: 50%;
  z-index: 2;
  background: radial-gradient(ellipse at 50% 100%, var(--c) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.home.ready .roster-glow {
  animation: glow-pulse 1.6s ease calc(var(--delay) + 400ms) forwards;
}

@keyframes glow-pulse {
  0% { opacity: 0; }
  40% { opacity: 0.35; }
  100% { opacity: 0.12; }
}

/* Name hidden, reveals after column lands */
/* ===== CHARACTER INFO (name + desc + hint at bottom) ===== */

.roster-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 12;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
}

.roster-info-top {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.home.ready .roster-info {
  animation: info-enter 0.6s ease calc(var(--delay) + 500ms) forwards;
}

@keyframes info-enter {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accent bar flashes on entry */
.roster-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--c);
  z-index: 13;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: opacity 0.4s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.home.ready .roster-bar {
  animation: bar-flash 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay) + 200ms) forwards;
}

@keyframes bar-flash {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
  100% {
    opacity: 0;
    transform: scaleX(1);
  }
}

.roster-col:first-child {
  margin-left: 0;
  clip-path: polygon(
    0 0,
    100% 0,
    calc(100% - var(--slant)) 100%,
    0 100%
  );
}

.roster-col:last-child {
  clip-path: polygon(
    var(--slant) 0,
    100% 0,
    100% 100%,
    0 100%
  );
}

.roster-col:hover {
  flex: 2.5;
}

/* ===== CHARACTER IMAGE (hover only — base handled by animation) ===== */
.roster-col:hover .roster-img {
  transform: scale(1.05);
  filter: brightness(0.8) saturate(1.15);
}

/* ===== COLOR GLOW (hover only — base handled by animation) ===== */
.roster-col:hover .roster-glow {
  opacity: 0.3;
}

/* ===== SCRIM ===== */
.roster-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to top, rgba(5, 4, 7, 0.8) 0%, rgba(5, 4, 7, 0.15) 30%, transparent 55%);
  pointer-events: none;
}

/* ===== DETAIL PANEL (minimal stats, hover only) ===== */
.roster-detail {
  position: absolute;
  left: 2rem;
  bottom: 10rem;
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1.1rem;
  pointer-events: none;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s;
  background: rgba(5, 4, 7, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 2px solid var(--c);
  border-radius: 4px 12px 12px 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.roster-col:hover .roster-detail {
  opacity: 1;
  transform: translateY(0);
}

/* ===== STAT ITEMS ===== */
.roster-stat {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.roster-stat--relic {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.stat-icon {
  font-size: var(--text-sm);
  line-height: 1;
}

.roster-stat:first-child .stat-icon {
  color: #ef4444;
}

.roster-stat:nth-child(2) .stat-icon {
  color: #facc15;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
}

.stat-divider {
  width: 1px;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
}

.stat-sublabel {
  font-size: 0.6rem;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.3);
}

.roster-stat--relic .stat-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--c);
  text-transform: none;
  letter-spacing: 0;
}

/* ===== CHARACTER NAME ===== */

.roster-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1;
  margin: 0;
  transition: color 0.4s ease, font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              letter-spacing 0.4s ease;
}

.roster-col:hover .roster-name {
  color: #fff;
  font-size: var(--text-3xl);
  letter-spacing: -0.01em;
}

/* Stats row — removed, replaced by roster-stat items */

/* Description (now inside roster-info, next to name) */
.roster-desc {
  font-size: var(--text-xs);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0);
  margin: 0;
  max-width: 280px;
  transition: color 0.4s ease 0.15s;
}

.roster-col:hover .roster-desc {
  color: rgba(255, 255, 255, 0.45);
}

.roster-hint {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0);
  margin-top: 0.25rem;
  transition: color 0.4s ease 0.25s, letter-spacing 0.4s ease 0.25s;
}

.roster-col:hover .roster-hint {
  color: var(--c);
  letter-spacing: 0.1em;
}

/* ===== BOTTOM ACCENT BAR (hover only — base handled by animation) ===== */
.roster-col:hover .roster-bar {
  opacity: 1;
  transform: scaleX(1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 800px) {
  .roster {
    flex-direction: column;
  }

  .roster-col {
    --slant: 20px;
    flex: 1 !important;
    margin-left: 0;
    margin-top: calc(-1 * var(--slant));
    clip-path: polygon(
      0 var(--slant),
      100% 0,
      100% calc(100% - var(--slant)),
      0 100%
    );
  }

  .roster-col:first-child {
    margin-top: 0;
    clip-path: polygon(
      0 0,
      100% 0,
      100% calc(100% - var(--slant)),
      0 100%
    );
  }

  .roster-col:last-child {
    clip-path: polygon(
      0 var(--slant),
      100% 0,
      100% 100%,
      0 100%
    );
  }

  .roster-col:hover {
    flex: 4 !important;
  }

  .roster-info {
    padding: 1.25rem 1.5rem;
  }

  .roster-name {
    font-size: var(--text-base);
  }

  .roster-col:hover .roster-name {
    font-size: var(--text-xl);
  }
}

@media (max-width: 500px) {
  .roster-name {
    font-size: var(--text-lg);
  }
}
</style>
