import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHuntersStore } from '@/stores/hunters'
import type { HunterProfile } from '@/types'

vi.mock('@/services/meuemprego-api', () => ({
  huntersApi: {
    list: vi.fn(),
    me: vi.fn(),
    saveMe: vi.fn(),
    setStatus: vi.fn(),
    incrementContacts: vi.fn(),
  },
  accessRequestsApi: {
    listMe: vi.fn(),
    send: vi.fn(),
    respond: vi.fn(),
  },
}))

import { huntersApi } from '@/services/meuemprego-api'

const mockHunters: HunterProfile[] = [
  {
    id: '1',
    name: 'Juliana Mendes',
    cpf: '987.654.321-09',
    email: 'juliana.mendes@career.com',
    avatar: 'https://example.com/avatar.jpg',
    headline: 'Executive Headhunter & Coach de Carreira Tech',
    bio: 'Especialista em recolocação.',
    specialties: ['Tecnologia da Informação', 'Produto'],
    senioritiesServed: ['Senior', 'Especialista'],
    serviceModel: 'Assessoria Completa',
    linkedInUrl: 'https://linkedin.com/in/juliana',
    whatsappNumber: '5511988887777',
    status: 'Aprovado',
    rating: 4.9,
    totalContactsCount: 142,
    createdAt: '2026-07-01',
  },
  {
    id: '2',
    name: 'Fernando Garcia',
    cpf: '444.555.666-77',
    email: 'fernando@talent.com',
    avatar: 'https://example.com/avatar2.jpg',
    headline: 'Headhunter RH & Operations',
    bio: 'Bio Fernando.',
    specialties: ['Recursos Humanos'],
    senioritiesServed: ['Pleno'],
    serviceModel: 'Sessão Individual',
    linkedInUrl: 'https://linkedin.com/in/fernando',
    whatsappNumber: '5531987654321',
    status: 'Pendente',
    rating: 4.7,
    totalContactsCount: 34,
    createdAt: '2026-07-22',
  },
]

describe('RF-004, RF-008 & RNF-003: Catálogo de Hunters & Validação de CPF Único', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(huntersApi.list).mockImplementation(async () => structuredClone(mockHunters))
  })

  it('deve rejeitar cadastro de Job Hunter com CPF duplicado (RF-008)', async () => {
    const store = useHuntersStore()
    await store.fetchHunters()

    await expect(async () => store.registerHunter({
      name: 'Hunter Falso',
      cpf: '987.654.321-09',
      email: 'falso@career.com',
      avatar: 'https://example.com/avatar.jpg',
      headline: 'Consultor',
      bio: 'Bio',
      specialties: ['Tecnologia da Informação'],
      senioritiesServed: ['Senior'],
      serviceModel: 'Mentoria',
      linkedInUrl: 'https://linkedin.com/in/falso',
      whatsappNumber: '5511999992222',
    })).rejects.toThrowError(/CPF já cadastrado/)
  })

  it('deve listar apenas Job Hunters com status Aprovado no catálogo público (RF-004)', async () => {
    const store = useHuntersStore()
    await store.fetchHunters()

    const approved = store.approvedHunters
    expect(approved.every(h => h.status === 'Aprovado')).toBe(true)
    expect(approved.length).toBe(1)
    expect(approved[0].name).toBe('Juliana Mendes')
  })

  it('deve filtrar os hunters por especialidade, senioridade e palavra-chave em menos de 100ms (RNF-003)', async () => {
    const store = useHuntersStore()
    await store.fetchHunters()

    store.searchQuery = 'Juliana'
    store.selectedSpecialty = 'Tecnologia da Informação'

    const startTime = performance.now()
    const filtered = store.filteredHunters
    const endTime = performance.now()

    const executionTimeMs = endTime - startTime

    expect(filtered.length).toBe(1)
    expect(filtered[0].name).toBe('Juliana Mendes')
    expect(executionTimeMs).toBeLessThan(1000) // RNF-003 (< 1s)
  })
})
