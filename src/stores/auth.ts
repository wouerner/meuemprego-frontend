import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole, CandidateProfile, HunterProfile } from '@/types'
import { useCandidatesStore } from '@/stores/candidates'
import { candidatesApi, huntersApi } from '@/services/meuemprego-api'
import api from '@/services/api'

function emptyCandidateProfile(): CandidateProfile {
  return {
    id: '',
    name: '',
    cpf: '',
    email: '',
    password: '',
    headline: '',
    seniority: 'Pleno',
    area: '',
    careerGoal: '',
    professionalMoment: 'Aberto a Propostas',
    requestHunterContact: true,
    linkedInUrl: '',
    whatsappNumber: '',
    lgpdConsent: false,
    createdAt: '',
    isApproved: false,
  }
}

function emptyHunterProfile(): HunterProfile {
  return {
    id: '',
    name: '',
    cpf: '',
    email: '',
    password: '',
    headline: '',
    bio: '',
    specialties: [],
    senioritiesServed: [],
    serviceModel: 'Assessoria Completa',
    linkedInUrl: '',
    whatsappNumber: '',
    status: 'Pendente',
    rating: 0,
    totalContactsCount: 0,
    createdAt: '',
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<{ id: number; name: string; email: string; role?: string; created_at?: string } | null>(
    JSON.parse(localStorage.getItem('auth_user') || 'null'),
  )
  const currentRole = ref<UserRole>('visitante')
  const isLoading = ref(false)
  const profilesLoaded = ref(false)

  const candidateUser = ref<CandidateProfile>(emptyCandidateProfile())
  const hunterUser = ref<HunterProfile>(emptyHunterProfile())

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function loadProfiles() {
    if (!isAuthenticated.value || profilesLoaded.value) return
    try {
      const [candidate, hunter] = await Promise.all([
        candidatesApi.me(),
        huntersApi.me(),
      ])
      if (candidate) candidateUser.value = candidate
      if (hunter) hunterUser.value = hunter
    } catch {
      // Profile loading is non-blocking
    } finally {
      profilesLoaded.value = true
    }
  }

  const currentUser = computed(() => {
    if (isAuthenticated.value && user.value) {
      const profile = currentRole.value === 'hunter' ? hunterUser.value : candidateUser.value
      return {
        id: String(user.value.id),
        name: user.value.name,
        email: user.value.email,
        headline: profile.headline || '',
        linkedInUrl: profile.linkedInUrl || '',
        whatsappNumber: profile.whatsappNumber || '',
        createdAt: user.value.created_at || new Date().toISOString(),
        cpf: profile.cpf || '',
      }
    }
    if (currentRole.value === 'hunter') return hunterUser.value
    if (currentRole.value === 'candidato') return candidateUser.value
    return {
      id: 'admin-1',
      name: 'Administrador da Plataforma',
      cpf: '000.000.000-00',
      email: 'admin@meuemprego.pro',
    }
  })

  function detectRole(email: string): UserRole {
    const lower = email.toLowerCase()
    if (lower.includes('admin')) return 'admin'
    if (lower.includes('hunter')) return 'hunter'
    return 'candidato'
  }

  // Priority: role from server (authoritative) → email fallback (dev convenience).
  function resolveRole(userPayload: { email: string; role?: string }): UserRole {
    if (userPayload.role === 'admin' || userPayload.role === 'hunter' || userPayload.role === 'candidato') {
      return userPayload.role
    }
    return detectRole(userPayload.email)
  }

  function persistAuth(payload: { token: string; user: { id: number; name: string; email: string; role?: string } }) {
    token.value = payload.token
    user.value = payload.user
    localStorage.setItem('auth_token', payload.token)
    localStorage.setItem('auth_user', JSON.stringify(payload.user))
    currentRole.value = resolveRole(payload.user)
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      persistAuth({ token: data.token, user: data.user })
      await loadProfiles()
      return data
    } finally {
      isLoading.value = false
    }
  }

  async function register(name: string, email: string, password: string, role?: 'candidato' | 'hunter') {
    isLoading.value = true
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      persistAuth({ token: data.token, user: data.user })
      await loadProfiles()
      return data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    try {
      const { data } = await api.get('/users/me')
      const payload = { id: data.id, name: data.name, email: data.email, role: data.role }
      user.value = payload
      localStorage.setItem('auth_user', JSON.stringify(payload))
      currentRole.value = resolveRole(payload)
      await loadProfiles()
      return data
    } catch {
      logout()
      return null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    currentRole.value = 'visitante'
    profilesLoaded.value = false
    candidateUser.value = emptyCandidateProfile()
    hunterUser.value = emptyHunterProfile()
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  async function init() {
    if (token.value && !user.value) {
      await fetchMe()
    }
    if (token.value && user.value && currentRole.value === 'visitante') {
      currentRole.value = resolveRole(user.value)
    }
    await loadProfiles()
  }

  function setRole(role: UserRole) {
    currentRole.value = role
  }

  async function updateCandidateProfile(updated: Partial<CandidateProfile>) {
    const merged = { ...candidateUser.value, ...updated }
    candidateUser.value = merged
    const candidatesStore = useCandidatesStore()
    const saved = await candidatesApi.saveMe({
      name: merged.name,
      cpf: merged.cpf,
      email: merged.email,
      password: merged.password || undefined,
      headline: merged.headline,
      seniority: merged.seniority,
      area: merged.area,
      career_goal: merged.careerGoal,
      professional_moment: merged.professionalMoment,
      request_hunter_contact: merged.requestHunterContact,
      lgpd_consent: merged.lgpdConsent,
      linkedin_url: merged.linkedInUrl,
      whatsapp_number: merged.whatsappNumber,
    })
    candidateUser.value = saved
    candidatesStore.updateCandidateInStore(saved.id, saved)
  }

  async function toggleCandidateContactRequest(enabled: boolean) {
    await updateCandidateProfile({ requestHunterContact: enabled })
  }

  async function updateHunterProfile(updated: Partial<HunterProfile>) {
    const merged = { ...hunterUser.value, ...updated }
    hunterUser.value = merged
    const saved = await huntersApi.saveMe({
      name: merged.name,
      cpf: merged.cpf,
      email: merged.email,
      password: merged.password || undefined,
      headline: merged.headline,
      bio: merged.bio,
      specialties: merged.specialties,
      seniorities_served: merged.senioritiesServed,
      service_model: merged.serviceModel,
      linkedin_url: merged.linkedInUrl,
      whatsapp_number: merged.whatsappNumber,
    })
    hunterUser.value = saved
  }

  return {
    token,
    user,
    currentRole,
    candidateUser,
    hunterUser,
    profilesLoaded,
    isAuthenticated,
    isLoading,
    currentUser,
    login,
    register,
    fetchMe,
    logout,
    init,
    loadProfiles,
    setRole,
    detectRole,
    resolveRole,
    updateCandidateProfile,
    toggleCandidateContactRequest,
    updateHunterProfile,
  }
})
