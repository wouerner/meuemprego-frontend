import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'LandingSelector',
      component: () => import('@/pages/index.vue'),
    },
    {
      path: '/profissional',
      name: 'ProfessionalLanding',
      component: () => import('@/pages/landing-profissional.vue'),
    },
    {
      path: '/job-hunter',
      name: 'HunterLanding',
      component: () => import('@/pages/landing-hunter.vue'),
    },
    {
      path: '/login',
      name: 'UserLogin',
      component: () => import('@/pages/login.vue'),
    },
    {
      path: '/redefinir-senha',
      name: 'ResetPassword',
      component: () => import('@/pages/redefinir-senha.vue'),
    },
    {
      path: '/hunters',
      name: 'HuntersCatalog',
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
      path: '/cadastro-hunter',
      name: 'HunterProfileRegistration',
      component: () => import('@/pages/cadastro-hunter.vue'),
    },
    {
      path: '/perfil-hunter',
      name: 'HunterProfileForm',
      meta: { requiresAuth: true, requiresRole: ['hunter'] as const },
      component: () => import('@/pages/perfil-hunter.vue'),
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
      ? auth.resolveRole(auth.user as { email: string; role?: string })
      : auth.currentRole
    if (!requiredRoles.includes(role)) {
      return next('/')
    }
  }
  next()
})

export default router
