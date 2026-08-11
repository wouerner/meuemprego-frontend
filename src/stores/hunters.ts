import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HunterProfile, HunterApprovalStatus, SeniorityLevel, HunterAccessRequest, AccessRequestStatus } from '@/types'
import { huntersApi, accessRequestsApi, type HunterPayload } from '@/services/meuemprego-api'

export const useHuntersStore = defineStore('hunters', () => {
  const hunters = ref<HunterProfile[]>([])
  const accessRequests = ref<HunterAccessRequest[]>([])
  const sentAccessRequests = ref<HunterAccessRequest[]>([])
  const isLoading = ref(false)
  const loaded = ref(false)

  async function fetchHunters() {
    isLoading.value = true
    try {
      hunters.value = await huntersApi.list()
      loaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAccessRequests() {
    try {
      accessRequests.value = await accessRequestsApi.listMe()
    } catch {
      accessRequests.value = []
    }
  }

  async function fetchSentAccessRequests() {
    try {
      sentAccessRequests.value = await accessRequestsApi.listSent()
    } catch {
      sentAccessRequests.value = []
    }
  }

  const candidateAccessRequests = computed(() =>
    accessRequests.value.filter(r => r.status === 'pending'),
  )

  const acceptedAccessRequests = computed(() =>
    accessRequests.value.filter(r => r.status === 'accepted'),
  )

  async function respondToAccessRequest(id: string, newStatus: AccessRequestStatus) {
    const updated = await accessRequestsApi.respond(id, newStatus as 'accepted' | 'rejected')
    const index = accessRequests.value.findIndex(r => r.id === id)
    if (index !== -1) accessRequests.value[index] = updated
  }

  async function sendAccessRequest(candidateId: string, message: string) {
    const req = await accessRequestsApi.send(candidateId, message)
    sentAccessRequests.value.unshift(req)
    return req
  }

  // Filters State
  const searchQuery = ref('')
  const selectedSpecialty = ref<string | null>(null)
  const selectedSeniority = ref<SeniorityLevel | null>(null)
  const selectedServiceModel = ref<HunterProfile['serviceModel'] | null>(null)

  // Anti-Duplication Check (RF-008)
  function isCpfRegistered(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '')
    return hunters.value.some(h => h.cpf.replace(/\D/g, '') === cleanCPF)
  }

  // Approved Hunters Catálogo
  const approvedHunters = computed(() => {
    return hunters.value.filter(h => h.status === 'Aprovado')
  })

  // Filtered Hunters (< 1s execution time RNF-003)
  const filteredHunters = computed(() => {
    return approvedHunters.value.filter(h => {
      const matchesSearch = !searchQuery.value ||
        h.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        h.headline.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        h.specialties.some(s => s.toLowerCase().includes(searchQuery.value.toLowerCase()))

      const matchesSpecialty = !selectedSpecialty.value || h.specialties.includes(selectedSpecialty.value)
      const matchesSeniority = !selectedSeniority.value || h.senioritiesServed.includes(selectedSeniority.value)
      const matchesModel = !selectedServiceModel.value || h.serviceModel === selectedServiceModel.value

      return matchesSearch && matchesSpecialty && matchesSeniority && matchesModel
    })
  })

  // Pending Hunters for Admin Approval (RF-003)
  const pendingHunters = computed(() => {
    return hunters.value.filter(h => h.status === 'Pendente')
  })

  async function setHunterStatus(id: string, newStatus: HunterApprovalStatus) {
    const updated = await huntersApi.setStatus(id, newStatus)
    const index = hunters.value.findIndex(h => h.id === id)
    if (index !== -1) hunters.value[index] = updated
  }

  async function incrementHunterContact(id: string) {
    const updated = await huntersApi.incrementContacts(id)
    const index = hunters.value.findIndex(h => h.id === id)
    if (index !== -1) hunters.value[index] = updated
  }

  async function saveProfile(payload: HunterPayload): Promise<HunterProfile> {
    const saved = await huntersApi.saveMe(payload)
    const index = hunters.value.findIndex(h => h.id === saved.id)
    if (index !== -1) {
      hunters.value[index] = saved
    } else {
      hunters.value.unshift(saved)
    }
    return saved
  }

  function registerHunter(newHunter: Omit<HunterProfile, 'id' | 'status' | 'rating' | 'totalContactsCount' | 'createdAt'>) {
    if (isCpfRegistered(newHunter.cpf)) {
      throw new Error('CPF já cadastrado na plataforma para outro Job Hunter.')
    }
    return saveProfile({
      name: newHunter.name,
      cpf: newHunter.cpf,
      email: newHunter.email,
      password: newHunter.password,
      avatar: newHunter.avatar,
      headline: newHunter.headline,
      bio: newHunter.bio,
      specialties: newHunter.specialties,
      seniorities_served: newHunter.senioritiesServed,
      service_model: newHunter.serviceModel,
      linkedin_url: newHunter.linkedInUrl,
      whatsapp_number: newHunter.whatsappNumber,
    })
  }

  return {
    hunters,
    accessRequests,
    sentAccessRequests,
    isLoading,
    loaded,
    fetchHunters,
    fetchAccessRequests,
    fetchSentAccessRequests,
    candidateAccessRequests,
    acceptedAccessRequests,
    searchQuery,
    selectedSpecialty,
    selectedSeniority,
    selectedServiceModel,
    approvedHunters,
    filteredHunters,
    pendingHunters,
    isCpfRegistered,
    setHunterStatus,
    incrementHunterContact,
    saveProfile,
    registerHunter,
    respondToAccessRequest,
    sendAccessRequest,
  }
})
