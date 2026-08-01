import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPageHome',
      component: () => import('@/pages/index.vue'),
    },
    {
      path: '/login',
      name: 'UserLogin',
      component: () => import('@/pages/login.vue'),
    },
    {
      path: '/hunters',
      name: 'HuntersCatalog',
      meta: { requiresAuth: true },
      component: () => import('@/pages/hunters.vue'),
    },
    {
      path: '/candidatos',
      name: 'CandidatesTalentPool',
      meta: { requiresAuth: true },
      component: () => import('@/pages/candidatos.vue'),
    },
    {
      path: '/cadastro',
      name: 'UserProfileForm',
      meta: { requiresAuth: true },
      component: () => import('@/pages/cadastro.vue'),
    },
    {
      path: '/admin',
      name: 'AdminModeration',
      meta: { requiresAuth: true },
      component: () => import('@/pages/admin.vue'),
    },
    {
      path: '/metricas',
      name: 'TraractionMetrics',
      meta: { requiresAuth: true },
      component: () => import('@/pages/metricas.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      return next('/login')
    }
  }
  next()
})

export default router
