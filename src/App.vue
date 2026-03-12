<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Analytics } from '@vercel/analytics/vue'
import BuyMeCoffee from '@/components/BuyMeCoffee.vue'

const route = useRoute()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.name,
  (name) => {
    const titles: Record<string, string> = {
      home: 'STS2 Deck Builder',
      'deck-builder': 'STS2 Deck Builder',
      'featured-deck': 'STS2 Deck Builder',
    }
    document.title = titles[name as string] ?? 'STS2 Deck Builder'
  },
  { immediate: true },
)
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <nav class="site-nav">
      <RouterLink to="/" class="nav-logo">
        <span class="logo-icon">&#9670;</span>
        <span class="logo-text">STS2</span>
      </RouterLink>
      <div class="nav-divider"></div>
      <RouterLink to="/" class="nav-link" :class="{ active: route.name === 'home' }">Home</RouterLink>
    </nav>
  </header>
  <main id="main-content">
    <RouterView />
  </main>
  <Analytics />
  <BuyMeCoffee />
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.site-header.scrolled {
  top: 0.75rem;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-glass);
  backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid var(--color-border);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.site-header.scrolled .site-nav {
  background: rgba(12, 11, 18, 0.85);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
}

.nav-logo:hover {
  background: rgba(255, 255, 255, 0.04);
}

.logo-icon {
  font-size: 0.9rem;
  color: var(--color-accent);
  line-height: 1;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.nav-divider {
  width: 1px;
  height: 16px;
  background: var(--color-border);
  margin: 0 0.15rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-dim);
  text-decoration: none;
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

#main-content {
  padding-top: 5rem;
}
</style>
