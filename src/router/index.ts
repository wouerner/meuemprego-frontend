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
      meta: { requiresAuth: true, requiresRole: ['admin', 'hunter'] as const },
      component: () => import('@/pages/candidatos.vue'),
    },
    {
      path: '/cadastro',
      name: 'UserProfileForm',
      component: () => import('@/pages/cadastro.vue'),
    },
    {
      path: '/admin',
      name: 'AdminModeration',
      meta: { requiresAuth: true, requiresRole: ['admin'] as const },
      component: () => import('@/pages/admin.vue'),
    },
    {
      path: '/metricas',
      name: 'TraractionMetrics',
      meta: { requiresAuth: true, requiresRole: ['admin'] as const },
      component: () => import('@/pages/metricas.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return next('/login')
    }
  }
  const requiredRoles = to.meta.requiresRole as readonly string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    const role = auth.currentRole === 'visitante' && auth.user
      ? auth.detectRole(auth.user.email)
      : auth.currentRole
    if (!requiredRoles.includes(role)) {
      return next('/')
    }
  }
  next()
})

export default router
