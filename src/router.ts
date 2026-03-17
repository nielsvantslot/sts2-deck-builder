import { createRouter, createWebHistory } from 'vue-router'
import { CHARACTER_MAP } from '@/lib/constants'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/decks/:deckId',
      name: 'featured-deck',
      component: () => import('@/pages/FeaturedDeckPage.vue'),
      props: true,
    },
    {
      path: '/share/:character',
      name: 'custom-deck',
      component: () => import('@/pages/CustomDeckPage.vue'),
      props: true,
      beforeEnter(to) {
        if (!CHARACTER_MAP[to.params.character as string]) {
          return { name: 'not-found', params: { pathMatch: [to.path.slice(1)] } }
        }
      },
    },
    {
      path: '/characters/:characterId',
      name: 'character',
      component: () => import('@/pages/CharacterPage.vue'),
      props: true,
      beforeEnter(to) {
        if (!CHARACTER_MAP[to.params.characterId as string]) {
          return { name: 'not-found', params: { pathMatch: [to.path.slice(1)] } }
        }
      },
    },
    {
      path: '/:character',
      name: 'deck-builder',
      component: () => import('@/pages/DeckBuilderPage.vue'),
      props: true,
      beforeEnter(to) {
        if (!CHARACTER_MAP[to.params.character as string]) {
          return { name: 'not-found', params: { pathMatch: [to.path.slice(1)] } }
        }

        const hasSharedDeck = typeof to.query.d === 'string' && to.query.d.length > 0
        const wantsEdit = to.query.edit === '1'
        if (hasSharedDeck && !wantsEdit) {
          return { name: 'custom-deck', params: { character: to.params.character }, query: { d: to.query.d } }
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})
