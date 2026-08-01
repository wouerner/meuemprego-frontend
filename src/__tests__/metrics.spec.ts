import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMetricsStore } from '@/stores/metrics'
import type { MetricEvent } from '@/types'

vi.mock('@/services/meuemprego-api', () => ({
  metricsApi: {
    list: vi.fn(),
    track: vi.fn(),
  },
}))

import { metricsApi } from '@/services/meuemprego-api'

const mockEvents: MetricEvent[] = [
  {
    id: '1',
    timestamp: '2026-07-23T09:14:00',
    targetType: 'hunter',
    targetId: '1',
    targetName: 'Juliana Mendes',
    channel: 'whatsapp',
    initiatedByRole: 'candidato',
  },
  {
    id: '2',
    timestamp: '2026-07-23T09:30:00',
    targetType: 'candidate',
    targetId: '2',
    targetName: 'Carlos Eduardo',
    channel: 'linkedin',
    initiatedByRole: 'hunter',
  },
  {
    id: '3',
    timestamp: '2026-07-23T10:05:00',
    targetType: 'hunter',
    targetId: '3',
    targetName: 'Camila Vasconcelos',
    channel: 'whatsapp',
    initiatedByRole: 'candidato',
  },
]

describe('RF-006, RF-007 & RF-009: Store de Métricas, Redirecionamento e Paginação de Logs', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(metricsApi.list).mockImplementation(async () => structuredClone(mockEvents))
  })

  it('deve gerar link de WhatsApp pré-formatado corretamente (RF-006)', () => {
    const store = useMetricsStore()
    const url = store.createWhatsAppUrl('5511998765432', 'Olá Juliana, gostaria de saber mais.')

    expect(url).toContain('https://wa.me/5511998765432')
    expect(url).toContain('text=Ol%C3%A1%20Juliana%2C%20gostaria%20de%20saber%20mais.')
  })

  it('deve registrar o evento de transbordo e incrementar as métricas (RF-007)', async () => {
    const store = useMetricsStore()
    await store.fetchEvents()
    const initialTotal = store.totalInteractions

    const newEvent: MetricEvent = {
      id: '99',
      timestamp: '2026-07-31T12:00:00',
      targetType: 'hunter',
      targetId: '1',
      targetName: 'Juliana Mendes',
      channel: 'whatsapp',
      initiatedByRole: 'candidato',
    }
    vi.mocked(metricsApi.track).mockResolvedValue(newEvent)

    await store.trackInteraction('hunter', '1', 'Juliana Mendes', 'whatsapp', 'candidato')

    expect(store.totalInteractions).toBe(initialTotal + 1)
    expect(store.events[0].targetId).toBe('1')
    expect(store.events[0].channel).toBe('whatsapp')
    expect(store.events[0].initiatedByRole).toBe('candidato')
  })

  it('deve permitir a filtragem e cálculo de páginas para logs de transbordo (RF-009)', async () => {
    const store = useMetricsStore()
    await store.fetchEvents()

    store.selectedChannelFilter = 'whatsapp'

    const filtered = store.filteredEvents
    expect(filtered.every(e => e.channel === 'whatsapp')).toBe(true)
    expect(filtered.length).toBe(2)

    const itemsPerPage = 5
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    expect(totalPages).toBeGreaterThanOrEqual(1)
  })
})
