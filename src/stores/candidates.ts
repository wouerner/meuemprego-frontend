import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CandidateProfile, SeniorityLevel, CandidateStatus } from '@/types'
import { candidatesApi, type CandidatePayload } from '@/services/meuemprego-api'

export const useCandidatesStore = defineStore('candidates', () => {
  const candidates = ref<CandidateProfile[]>([])
  const isLoading = ref(false)
  const loaded = ref(false)

  // Filters State
  const searchQuery = ref('')
  const selectedArea = ref<string | null>(null)
  const selectedSeniority = ref<SeniorityLevel | null>(null)
  const selectedMoment = ref<CandidateStatus | null>(null)

  async function fetchCandidates() {
    isLoading.value = true
    try {
      candidates.value = await candidatesApi.list()
      loaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Anti-Duplication Check (RF-008)
  function isCpfRegistered(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '')
    return candidates.value.some(c => c.cpf.replace(/\D/g, '') === cleanCPF)
  }

  // Visible Talent Pool (Candidates requesting contact & approved & LGPD consent) RF-005 & RF-010
  const visibleTalentPool = computed(() => {
    return candidates.value.filter(c => c.requestHunterContact && c.isApproved && c.lgpdConsent)
  })

  // High Performance Filtered Candidates (< 1s RNF-003)
  const filteredCandidates = computed(() => {
    return visibleTalentPool.value.filter(c => {
      const matchesSearch = !searchQuery.value ||
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.headline.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.careerGoal.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesArea = !selectedArea.value || c.area === selectedArea.value
      const matchesSeniority = !selectedSeniority.value || c.seniority === selectedSeniority.value
      const matchesMoment = !selectedMoment.value || c.professionalMoment === selectedMoment.value

      return matchesSearch && matchesArea && matchesSeniority && matchesMoment
    })
  })

  async function toggleCandidateApproval(id: string) {
    const candidate = candidates.value.find(c => c.id === id)
    if (!candidate) return

    const updated = await candidatesApi.setApproval(id, !candidate.isApproved)
    const index = candidates.value.findIndex(c => c.id === id)
    if (index !== -1) candidates.value[index] = updated
  }

  async function updateCandidateInStore(id: string, updated: Partial<CandidateProfile>) {
    const candidate = candidates.value.find(c => c.id === id)
    if (candidate) {
      Object.assign(candidate, updated)
    }
  }

  async function saveProfile(payload: CandidatePayload): Promise<CandidateProfile> {
    const saved = await candidatesApi.saveMe(payload)
    const index = candidates.value.findIndex(c => c.id === saved.id)
    if (index !== -1) {
      candidates.value[index] = saved
    } else {
      candidates.value.unshift(saved)
    }
    return saved
  }

  function registerCandidate(newCandidate: Omit<CandidateProfile, 'id' | 'createdAt' | 'isApproved'>) {
    if (isCpfRegistered(newCandidate.cpf)) {
      throw new Error('CPF já cadastrado na plataforma para outro Profissional.')
    }
    return saveProfile({
      name: newCandidate.name,
      cpf: newCandidate.cpf,
      email: newCandidate.email,
      headline: newCandidate.headline,
      seniority: newCandidate.seniority,
      area: newCandidate.area,
      career_goal: newCandidate.careerGoal,
      professional_moment: newCandidate.professionalMoment,
      request_hunter_contact: newCandidate.requestHunterContact,
      lgpd_consent: newCandidate.lgpdConsent,
      linkedin_url: newCandidate.linkedInUrl,
      whatsapp_number: newCandidate.whatsappNumber,
    })
  }

  return {
    candidates,
    isLoading,
    loaded,
    searchQuery,
    selectedArea,
    selectedSeniority,
    selectedMoment,
    fetchCandidates,
    visibleTalentPool,
    filteredCandidates,
    isCpfRegistered,
    toggleCandidateApproval,
    updateCandidateInStore,
    saveProfile,
    registerCandidate,
  }
})
