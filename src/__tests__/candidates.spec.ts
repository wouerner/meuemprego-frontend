import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import { useAuthStore } from '@/stores/auth'
import { isValidCPF } from '@/types'
import type { CandidateProfile } from '@/types'

vi.mock('@/services/meuemprego-api', () => ({
  candidatesApi: {
    list: vi.fn(),
    me: vi.fn(),
    saveMe: vi.fn(),
    setApproval: vi.fn(),
  },
  huntersApi: {
    list: vi.fn(),
    me: vi.fn(),
    saveMe: vi.fn(),
    setStatus: vi.fn(),
    incrementContacts: vi.fn(),
  },
}))

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import { candidatesApi } from '@/services/meuemprego-api'

const mockCandidates: CandidateProfile[] = [
  {
    id: '1',
    name: 'Carlos Eduardo',
    cpf: '529.982.247-25',
    email: 'carlos.eduardo@email.com',
    headline: 'Engenheiro de Software Senior',
    seniority: 'Senior',
    area: 'Tecnologia da Informação',
    careerGoal: 'Transição para Tech Lead',
    professionalMoment: 'Aberto a Propostas',
    requestHunterContact: true,
    linkedInUrl: 'https://linkedin.com/in/carlos',
    whatsappNumber: '5511998765432',
    lgpdConsent: true,
    createdAt: '2026-07-20',
    isApproved: true,
  },
  {
    id: '2',
    name: 'Mariana Silva',
    cpf: '111.444.777-35',
    email: 'mariana.silva@email.com',
    headline: 'Product Manager Pleno',
    seniority: 'Pleno',
    area: 'Produtos & Design',
    careerGoal: 'Senior PM',
    professionalMoment: 'Em Transição',
    requestHunterContact: true,
    linkedInUrl: 'https://linkedin.com/in/mariana',
    whatsappNumber: '5511987654321',
    lgpdConsent: true,
    createdAt: '2026-07-18',
    isApproved: false,
  },
]

describe('RF-002, RF-005, RF-008, RF-010 & RNF-001: Candidates, LGPD, CPF e Pausa de Contatos', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(candidatesApi.list).mockImplementation(async () => structuredClone(mockCandidates))
  })

  it('deve validar algoritmicamente números de CPF (RF-008)', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false) // Dígitos repetidos
    expect(isValidCPF('123.456.789-00')).toBe(false) // Dígito verificador inválido
    expect(isValidCPF('123456789')).toBe(false) // Menos de 11 dígitos
    expect(isValidCPF('529.982.247-25')).toBe(true) // CPF Válido com algoritmo real
  })

  it('deve rejeitar cadastro duplicado com o mesmo CPF para outro candidato (RF-008)', async () => {
    const store = useCandidatesStore()
    await store.fetchCandidates()

    await expect(async () => store.registerCandidate({
      name: 'Tentativa Duplicada',
      cpf: '529.982.247-25', // CPF já existente no Carlos Eduardo
      email: 'outra.pessoa@email.com',
      headline: 'Developer',
      seniority: 'Pleno',
      area: 'Tecnologia da Informação',
      careerGoal: 'Nova Vaga',
      professionalMoment: 'Aberto a Propostas',
      requestHunterContact: true,
      linkedInUrl: 'https://linkedin.com/in/duplicado',
      whatsappNumber: '5511999991111',
      lgpdConsent: true,
    })).rejects.toThrowError(/CPF já cadastrado/)
  })

  it('deve ocultar o candidato da vitrine de talentos quando o mesmo pausar os contatos (RF-010)', async () => {
    const authStore = useAuthStore()
    const candidatesStore = useCandidatesStore()
    await candidatesStore.fetchCandidates()

    const initialVisible = candidatesStore.visibleTalentPool.length
    expect(candidatesStore.visibleTalentPool.some(c => c.id === '1')).toBe(true)

    // Candidato desativa/pausa solicitações de contato
    candidatesStore.updateCandidateInStore('1', { requestHunterContact: false })

    expect(candidatesStore.visibleTalentPool.length).toBe(initialVisible - 1)
    expect(candidatesStore.visibleTalentPool.some(c => c.id === '1')).toBe(false)
  })

  it('deve exibir na vitrine pública apenas candidatos que solicitaram contato de Hunters e possuem consentimento LGPD (RF-005, RNF-001)', async () => {
    const store = useCandidatesStore()
    await store.fetchCandidates()

    const pool = store.visibleTalentPool
    expect(pool.every(c => c.requestHunterContact && c.lgpdConsent && c.isApproved)).toBe(true)
    expect(pool.length).toBe(1)
  })

  it('deve permitir cadastro de novo candidato com CPF único e opt-in ativo (RF-002, RF-008)', async () => {
    const store = useCandidatesStore()
    await store.fetchCandidates()

    const saved = {
      ...mockCandidates[0],
      id: '99',
      name: 'Novo Talent',
      cpf: '999.888.777-66',
      email: 'novo.talent@email.com',
    }
    vi.mocked(candidatesApi.saveMe).mockResolvedValue(saved)

    const newCandidate = await store.registerCandidate({
      name: 'Novo Talent',
      cpf: '999.888.777-66', // CPF Único
      email: 'novo.talent@email.com',
      headline: 'Software Engineer',
      seniority: 'Senior',
      area: 'Tecnologia da Informação',
      careerGoal: 'Vaga de Staff Engineer',
      professionalMoment: 'Aberto a Propostas',
      requestHunterContact: true,
      linkedInUrl: 'https://linkedin.com/in/novotalent',
      whatsappNumber: '5511999990000',
      lgpdConsent: true,
    })

    expect(store.candidates.length).toBe(3)
    expect(newCandidate.id).toBe('99')
    expect(store.visibleTalentPool.some(c => c.id === '99')).toBe(true)
  })
})
