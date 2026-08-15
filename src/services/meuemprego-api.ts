import type { CandidateProfile, HunterProfile, HunterAccessRequest, MetricEvent, UserRole } from '@/types'
import api from './api'

export interface CandidatePayload {
  name: string
  cpf: string
  email: string
  password?: string
  headline: string
  seniority: string
  area: string
  career_goal: string
  professional_moment: string
  request_hunter_contact: boolean
  lgpd_consent: boolean
  linkedin_url: string
  whatsapp_number: string
}

export interface HunterPayload {
  name: string
  cpf: string
  email: string
  password?: string
  headline: string
  bio: string
  specialties: string[]
  seniorities_served: string[]
  service_model: string
  linkedin_url: string
  whatsapp_number: string
}

function mapCandidate(data: any): CandidateProfile {
  return {
    id: String(data.id),
    user_id: data.user_id ?? null,
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    headline: data.headline || '',
    seniority: data.seniority,
    area: data.area,
    careerGoal: data.career_goal || '',
    professionalMoment: data.professional_moment,
    requestHunterContact: data.request_hunter_contact,
    lgpdConsent: data.lgpd_consent,
    isApproved: data.is_approved,
    linkedInUrl: data.linkedin_url || '',
    whatsappNumber: data.whatsapp_number || '',
    createdAt: data.created_at ? data.created_at.slice(0, 10) : '',
  }
}

function mapHunter(data: any): HunterProfile {
  return {
    id: String(data.id),
    user_id: data.user_id ?? null,
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    headline: data.headline || '',
    bio: data.bio || '',
    specialties: data.specialties || [],
    senioritiesServed: data.seniorities_served || [],
    serviceModel: data.service_model,
    status: data.status,
    rating: data.rating ?? 0,
    totalContactsCount: data.total_contacts_count ?? 0,
    linkedInUrl: data.linkedin_url || '',
    whatsappNumber: data.whatsapp_number || '',
    createdAt: data.created_at ? data.created_at.slice(0, 10) : '',
  }
}

function mapAccessRequest(data: any): HunterAccessRequest {
  return {
    id: String(data.id),
    hunterId: String(data.hunter_id),
    candidateId: data.candidate_id ? String(data.candidate_id) : undefined,
    hunterName: data.hunter_name,
    hunterHeadline: data.hunter_headline || '',
    hunterSpecialties: data.hunter_specialties || [],
    message: data.message,
    status: data.status,
    requestedAt: data.requested_at ? data.requested_at.slice(0, 10) : '',
  }
}

function mapMetricEvent(data: any): MetricEvent {
  return {
    id: String(data.id),
    targetType: data.target_type,
    targetId: data.target_id,
    targetName: data.target_name,
    channel: data.channel,
    timestamp: data.timestamp,
    initiatedByRole: data.initiated_by_role as UserRole,
  }
}

export const candidatesApi = {
  list: async (): Promise<CandidateProfile[]> => {
    const { data } = await api.get('/candidates')
    return (data as any[]).map(mapCandidate)
  },
  me: async (): Promise<CandidateProfile | null> => {
    try {
      const { data } = await api.get('/candidates/me')
      return mapCandidate(data)
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  },
  saveMe: async (payload: CandidatePayload): Promise<CandidateProfile> => {
    const { data } = await api.put('/candidates/me', payload)
    return mapCandidate(data)
  },
  setApproval: async (id: string, approved: boolean): Promise<CandidateProfile> => {
    const { data } = await api.patch(`/candidates/${id}`, { approved })
    return mapCandidate(data)
  },
}

export const huntersApi = {
  list: async (): Promise<HunterProfile[]> => {
    const { data } = await api.get('/hunters')
    return (data as any[]).map(mapHunter)
  },
  me: async (): Promise<HunterProfile | null> => {
    try {
      const { data } = await api.get('/hunters/me')
      return mapHunter(data)
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  },
  saveMe: async (payload: HunterPayload): Promise<HunterProfile> => {
    const { data } = await api.put('/hunters/me', payload)
    return mapHunter(data)
  },
  setStatus: async (id: string, status: string): Promise<HunterProfile> => {
    const { data } = await api.patch(`/hunters/${id}/status`, { status })
    return mapHunter(data)
  },
  incrementContacts: async (id: string): Promise<HunterProfile> => {
    const { data } = await api.post(`/hunters/${id}/contacts`)
    return mapHunter(data)
  },
}

export const accessRequestsApi = {
  listMe: async (): Promise<HunterAccessRequest[]> => {
    const { data } = await api.get('/access-requests/me')
    return (data as any[]).map(mapAccessRequest)
  },
  listSent: async (): Promise<HunterAccessRequest[]> => {
    const { data } = await api.get('/access-requests/sent')
    return (data as any[]).map(mapAccessRequest)
  },
  send: async (candidateId: string, message: string): Promise<HunterAccessRequest> => {
    const { data } = await api.post('/access-requests', { candidate_id: Number(candidateId), message })
    return mapAccessRequest(data)
  },
  respond: async (id: string, status: 'accepted' | 'rejected'): Promise<HunterAccessRequest> => {
    const { data } = await api.patch(`/access-requests/${id}`, { status })
    return mapAccessRequest(data)
  },
}

export const metricsApi = {
  list: async (): Promise<MetricEvent[]> => {
    const { data } = await api.get('/metrics')
    return (data as any[]).map(mapMetricEvent)
  },
  track: async (event: Omit<MetricEvent, 'id' | 'timestamp'>): Promise<MetricEvent> => {
    const { data } = await api.post('/metrics', {
      target_type: event.targetType,
      target_id: event.targetId,
      target_name: event.targetName,
      channel: event.channel,
      initiated_by_role: event.initiatedByRole,
    })
    return mapMetricEvent(data)
  },
}
