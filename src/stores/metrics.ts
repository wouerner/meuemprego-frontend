import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MetricEvent, UserRole } from '@/types'
import { metricsApi } from '@/services/meuemprego-api'

export const useMetricsStore = defineStore('metrics', () => {
  const events = ref<MetricEvent[]>([])
  const isLoading = ref(false)

  async function fetchEvents() {
    isLoading.value = true
    try {
      events.value = await metricsApi.list()
    } finally {
      isLoading.value = false
    }
  }

  // Filters for metrics report
  const selectedChannelFilter = ref<string | null>(null)
  const selectedTargetTypeFilter = ref<string | null>(null)

  // Computed Filtered Events
  const filteredEvents = computed(() => {
    return events.value.filter(e => {
      const matchChannel = !selectedChannelFilter.value || e.channel === selectedChannelFilter.value
      const matchTarget = !selectedTargetTypeFilter.value || e.targetType === selectedTargetTypeFilter.value
      return matchChannel && matchTarget
    })
  })

  // Computed Totals (RF-007)
  const totalInteractions = computed(() => events.value.length)

  const whatsappClicks = computed(() => {
    return events.value.filter(e => e.channel === 'whatsapp').length
  })

  const linkedinClicks = computed(() => {
    return events.value.filter(e => e.channel === 'linkedin').length
  })

  const candidateToHunterClicks = computed(() => {
    return events.value.filter(e => e.targetType === 'hunter').length
  })

  const hunterToCandidateClicks = computed(() => {
    return events.value.filter(e => e.targetType === 'candidate').length
  })

  async function trackInteraction(
    targetType: 'hunter' | 'candidate',
    targetId: string,
    targetName: string,
    channel: 'whatsapp' | 'linkedin',
    initiatedByRole: UserRole | 'visitante'
  ) {
    const event = await metricsApi.track({ targetType, targetId, targetName, channel, initiatedByRole })
    events.value.unshift(event)
    return event
  }

  // Format pre-formatted WhatsApp URLs (RF-006)
  function createWhatsAppUrl(phone: string, textMessage: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedText = encodeURIComponent(textMessage)
    return `https://wa.me/${cleanPhone}?text=${encodedText}`
  }

  // Trigger Redirection with Metric Tracking (RF-006 & RF-007)
  async function triggerContactRedirection(
    targetType: 'hunter' | 'candidate',
    targetId: string,
    targetName: string,
    channel: 'whatsapp' | 'linkedin',
    contactUrlOrPhone: string,
    customMessage: string,
    initiatedByRole: UserRole | 'visitante'
  ) {
    try {
      await trackInteraction(targetType, targetId, targetName, channel, initiatedByRole)
    } catch {
      // Metrics tracking must not block the redirect
    }

    let finalUrl = contactUrlOrPhone
    if (channel === 'whatsapp') {
      finalUrl = createWhatsAppUrl(contactUrlOrPhone, customMessage)
    }

    if (typeof window !== 'undefined') {
      window.open(finalUrl, '_blank', 'noopener,noreferrer')
    }
    return finalUrl
  }

  // Export Metrics as CSV Report (RF-007 Enhancement)
  function exportMetricsCsv() {
    const headers = 'ID,Timestamp,Destinatario,Tipo,Canal,IniciadoPor\n'
    const rows = events.value.map(e =>
      `"${e.id}","${e.timestamp}","${e.targetName}","${e.targetType}","${e.channel}","${e.initiatedByRole}"`
    ).join('\n')

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows)
    if (typeof window !== 'undefined') {
      const link = document.createElement('a')
      link.setAttribute('href', csvContent)
      link.setAttribute('download', `relatorio_transbordo_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return {
    events,
    isLoading,
    fetchEvents,
    selectedChannelFilter,
    selectedTargetTypeFilter,
    filteredEvents,
    totalInteractions,
    whatsappClicks,
    linkedinClicks,
    candidateToHunterClicks,
    hunterToCandidateClicks,
    trackInteraction,
    createWhatsAppUrl,
    triggerContactRedirection,
    exportMetricsCsv,
  }
})
