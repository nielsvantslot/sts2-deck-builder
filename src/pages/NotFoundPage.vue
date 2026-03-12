<template>
  <main class="not-found">
    <div class="glow"></div>
    <span class="code">404</span>
    <h1 class="title">Lost in the Spire</h1>
    <p class="desc">This path leads nowhere. The page you seek doesn't exist.</p>
    <RouterLink to="/" class="back-pill">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Back to Home
    </RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 80vh;
  padding: 4rem 2rem;
  position: relative;
}

.glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
  filter: blur(60px);
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}

.code {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #c084fc 0%, #8b5cf6 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
}

.desc {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  max-width: 340px;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.back-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--text-sm);
  padding: 0.55rem 1.4rem;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-pill);
  background: var(--color-accent-soft);
  transition: all var(--transition-smooth);
}

.back-pill:hover {
  background: rgba(139, 92, 246, 0.18);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.12);
  transform: translateY(-2px);
}
</style>
