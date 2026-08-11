import type { CandidateStatus, SeniorityLevel } from '@/types'

export const AREA_OPTIONS: string[] = [
  'Tecnologia da Informação',
  'Produtos & Design',
  'Finanças',
  'Vendas / Comercial',
  'Recursos Humanos',
  'Data & Analytics',
]

export const SPECIALTY_OPTIONS: string[] = [
  'Tecnologia da Informação',
  'Produtos & Design',
  'Finanças',
  'Vendas / Comercial',
  'Recursos Humanos',
  'Carreira Internacional',
  'Data & Analytics',
]

export const SENIORITY_OPTIONS: SeniorityLevel[] = [
  'Junior',
  'Pleno',
  'Senior',
  'Especialista',
  'Liderança / C-Level',
]

export const MOMENT_OPTIONS: CandidateStatus[] = [
  'Ativo',
  'Em Transição',
  'Buscando recolocação',
  'Aberto a Propostas',
]

export const SERVICE_MODEL_OPTIONS = [
  'Assessoria Completa',
  'Mentoria de Carreira',
  'Revisão de LinkedIn/CV',
  'Sessão Individual',
] as const
