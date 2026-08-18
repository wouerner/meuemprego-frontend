<template>
  <div>
    <!-- Header Banner -->
    <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl mb-6" elevation="0">
      <v-row align="center" class="text-center text-md-start">
        <v-col cols="12" md="8">
          <h1 class="text-h3 font-weight-black gradient-text mb-2">
            Vitrine de Perfis Profissionais
          </h1>
          <p class="text-subtitle-1 text-grey-lighten-1 mb-0 mx-auto mx-md-0 max-w-650">
            Lista de profissionais em busca de acelerar ou redirecionar a carreira. Job Hunters credenciados podem iniciar contato direto via LinkedIn ou WhatsApp.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-end mt-4 mt-md-0">
          <v-btn
            to="/cadastro"
            class="glass-btn-primary px-6 w-100 w-md-auto"
            size="large"
            rounded="pill"
            prepend-icon="mdi-bullhorn-outline"
          >
            Quero Ser Abordado
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Pending Hunter Warning -->
    <v-alert
      v-if="authStore.currentRole === 'hunter' && currentHunter && currentHunter.status !== 'Aprovado'"
      type="warning"
      variant="tonal"
      rounded="xl"
      class="mb-6 font-weight-bold"
      icon="mdi-shield-alert-outline"
    >
      Seu perfil de Job Hunter está <strong>{{ currentHunter.status }}</strong>. Enquanto o administrador não aprovar seu cadastro, você não poderá enviar solicitações de acesso aos perfis profissionais.
    </v-alert>

    <!-- Monthly Access Request Limit Warning -->
    <v-alert
      v-if="authStore.currentRole === 'hunter' && accessLimitReached"
      type="error"
      variant="tonal"
      rounded="xl"
      class="mb-6 font-weight-bold"
      icon="mdi-alert-octagon-outline"
    >
      Você atingiu o limite de <strong>{{ MAX_ACCESS_REQUESTS_PER_MONTH }} solicitações de acesso por mês</strong>. O contador reinicia no dia 1º de cada mês.
    </v-alert>
    <v-alert
      v-else-if="authStore.currentRole === 'hunter' && requestsSentThisMonth > 0"
      type="info"
      variant="tonal"
      rounded="xl"
      class="mb-6 font-weight-bold"
      icon="mdi-counter"
    >
      Solicitações de acesso este mês: <strong>{{ requestsSentThisMonth }} de {{ MAX_ACCESS_REQUESTS_PER_MONTH }}</strong>.
    </v-alert>

    <!-- Hunter Tabs: Vitrine / Meus Pedidos -->
    <v-card
      v-if="authStore.currentRole === 'hunter'"
      class="glass-panel pa-4 rounded-2xl mb-6"
      elevation="0"
    >
      <v-tabs v-model="pageTab" color="primary" align-tabs="start" class="pt-1">
        <v-tab value="vitrine" class="font-weight-bold">
          <v-icon icon="mdi-account-group-outline" start></v-icon>
          Vitrine de Profissionais
        </v-tab>
        <v-tab value="meus-pedidos" class="font-weight-bold">
          <v-badge :content="huntersStore.sentAccessRequests.length" color="primary" class="mr-2" inline>
            Meus Pedidos de Acesso
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-card>

    <v-window v-model="pageTab">
      <v-window-item value="vitrine">
      <!-- Filters Section -->
      <v-card class="glass-panel pa-5 rounded-2xl mb-6" elevation="0">
        <v-row density="comfortable" align="center">
          <!-- Search Input -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="candidatesStore.searchQuery"
              placeholder="Pesquisar por nome, objetivo..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-text-field>
          </v-col>
  
          <!-- Area Filter -->
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="candidatesStore.selectedArea"
              :items="AREA_OPTIONS"
              label="Área de Atuação"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-select>
          </v-col>
  
          <!-- Seniority Filter -->
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="candidatesStore.selectedSeniority"
              :items="SENIORITY_OPTIONS"
              label="Senioridade"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-select>
          </v-col>
  
          <!-- Professional Moment Filter -->
          <v-col cols="12" sm="4" md="2">
            <v-select
              v-model="candidatesStore.selectedMoment"
              :items="MOMENT_OPTIONS"
              label="Momento"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-select>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- Results Count Bar -->
      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <div class="text-subtitle-2 text-grey">
          Exibindo <strong class="text-white">{{ paginatedCandidates.length }}</strong> de <strong class="text-white">{{ candidatesStore.filteredCandidates.length }}</strong> perfis profissionais
        </div>
        <div class="text-caption text-grey d-flex align-center">
          <v-icon icon="mdi-shield-lock-outline" color="secondary" class="mr-1" size="16"></v-icon>
          Página {{ page }} de {{ totalPages || 1 }}
        </div>
      </div>
  
      <!-- Candidates Grid -->
      <v-row v-if="paginatedCandidates.length > 0">
        <v-col
          v-for="candidate in paginatedCandidates"
          :key="candidate.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="glass-panel glass-panel-hover pa-6 rounded-2xl h-100 d-flex flex-column" elevation="0">
            <div class="d-flex align-start mb-4">
              <div class="flex-grow-1">
                <h3
                  class="text-h6 font-weight-bold gradient-text-subtle pa-0 ma-0 cursor-pointer"
                  @click="openDetailModal(candidate)"
                >
                  {{ candidate.name }}
                </h3>
                <v-chip
                  size="x-small"
                  variant="flat"
                  :color="getMomentColor(candidate.professionalMoment)"
                  class="font-weight-bold my-1"
                >
                  {{ candidate.professionalMoment }}
                </v-chip>
                <div class="text-caption text-grey">{{ candidate.area }} • {{ candidate.seniority }}</div>
              </div>
            </div>
  
            <div class="mb-3">
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">
                {{ candidate.headline }}
              </div>
            </div>
  
            <div class="glass-panel pa-3 rounded-xl mb-4 bg-surface-variant flex-grow-1">
              <div class="text-caption text-secondary font-weight-bold mb-1">Objetivo de Carreira:</div>
              <p class="text-caption text-grey-lighten-1 mb-0 italic">
                "{{ candidate.careerGoal }}"
              </p>
            </div>
  
            <v-divider class="my-3 opacity-20"></v-divider>
  
            <!-- Contact Buttons for Job Hunters -->
            <div class="d-flex flex-column flex-sm-row gap-2 w-100">
              <v-btn
                v-if="isApprovedHunter"
                color="primary"
                variant="tonal"
                rounded="pill"
                class="flex-grow-1 font-weight-bold"
                prepend-icon="mdi-file-document-plus-outline"
                :disabled="accessLimitReached"
                @click="openAccessRequestDialog(candidate)"
              >
                Solicitar Acesso
              </v-btn>
  
              <div v-if="hasAcceptedAccessTo(candidate.id)" class="d-flex flex-column flex-sm-row gap-2 w-100">
                <v-btn
                  color="success"
                  variant="flat"
                  rounded="pill"
                  class="flex-grow-1 font-weight-bold w-100"
                  prepend-icon="mdi-whatsapp"
                  @click="openWhatsAppModal(candidate)"
                >
                  WhatsApp
                </v-btn>
              </div>
  
              <v-btn
                color="info"
                variant="outlined"
                rounded="pill"
                class="flex-grow-1 font-weight-bold border-glass w-100"
                prepend-icon="mdi-linkedin"
                @click="contactCandidateLinkedIn(candidate)"
              >
                LinkedIn
              </v-btn>
  
              <v-btn
                icon="mdi-information-outline"
                variant="text"
                size="small"
                title="Ver detalhes"
                class="align-self-end align-self-sm-auto"
                @click="openDetailModal(candidate)"
              ></v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Empty State -->
      <v-card v-else class="glass-panel pa-12 text-center rounded-2xl" elevation="0">
        <v-icon icon="mdi-account-search-outline" size="64" color="grey" class="mb-3"></v-icon>
        <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum perfil profissional encontrado</h3>
        <p class="text-body-2 text-grey mb-4">Tente alterar os termos da busca ou os filtros ativados.</p>
        <v-btn
          variant="outlined"
          rounded="pill"
          @click="resetFilters"
        >
          Limpar Filtros
        </v-btn>
      </v-card>
  
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
        <v-pagination
          v-model="page"
          :length="totalPages"
          rounded="circle"
          active-color="primary"
          color="white"
          elevation="0"
          class="glass-panel pa-1 rounded-pill"
        ></v-pagination>
      </div>
      </v-window-item>

      <v-window-item value="meus-pedidos">
        <v-card class="glass-panel pa-4 rounded-2xl mb-4" elevation="0">
          <v-tabs v-model="sentTab" color="primary" align-tabs="start" class="pt-1">
            <v-tab value="pending" class="font-weight-bold">
              <v-badge :content="sentRequestsByStatus('pending').length" color="warning" class="mr-2" inline>
                Pendentes
              </v-badge>
            </v-tab>
            <v-tab value="accepted" class="font-weight-bold">
              <v-badge :content="sentRequestsByStatus('accepted').length" color="success" class="mr-2" inline>
                Aceitos
              </v-badge>
            </v-tab>
            <v-tab value="rejected" class="font-weight-bold">
              <v-badge :content="sentRequestsByStatus('rejected').length" color="error" class="mr-2" inline>
                Recusados
              </v-badge>
            </v-tab>
          </v-tabs>
        </v-card>

        <v-window v-model="sentTab">
          <v-window-item
            v-for="status in ['pending', 'accepted', 'rejected'] as AccessRequestStatus[]"
            :key="status"
            :value="status"
          >
            <v-row v-if="sentRequestsByStatus(status).length > 0" class="pt-4">
              <v-col
                v-for="req in paginatedSentRequestsByStatus(status)"
                :key="req.id"
                cols="12"
                md="6"
              >
                <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
                  <div class="d-flex align-start mb-4">
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold gradient-text-subtle pa-0 ma-0">
                        {{ candidateFor(req)?.name || 'Perfil Profissional' }}
                      </h3>
                      <div class="text-caption text-grey-lighten-1 mb-1">{{ candidateFor(req)?.headline }}</div>
                      <div class="text-caption text-grey">
                        <v-icon icon="mdi-calendar" size="14" class="mr-1"></v-icon>
                        Solicitado em {{ formatDateBR(req.requestedAt) }}
                      </div>
                    </div>
                  </div>

                  <div class="glass-panel pa-4 rounded-xl mb-4 bg-surface-variant">
                    <div class="text-caption text-secondary font-weight-bold mb-1">Sua mensagem:</div>
                    <p class="text-body-2 text-grey-lighten-1 mb-0 italic">"{{ req.message }}"</p>
                  </div>

                  <div v-if="status === 'accepted'" class="d-flex flex-column flex-sm-row gap-2">
                    <v-btn
                      color="success"
                      variant="flat"
                      rounded="pill"
                      class="flex-grow-1 font-weight-bold"
                      prepend-icon="mdi-whatsapp"
                      @click="whatsappFromRequest(req)"
                    >
                      WhatsApp
                    </v-btn>
                    <v-btn
                      color="info"
                      variant="outlined"
                      rounded="pill"
                      class="flex-grow-1 font-weight-bold border-glass"
                      prepend-icon="mdi-linkedin"
                      @click="linkedinFromRequest(req)"
                    >
                      LinkedIn
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card v-else class="glass-panel pa-12 text-center rounded-2xl mt-4" elevation="0">
              <v-icon :icon="getRequestEmptyIcon(status)" size="64" color="grey" class="mb-3"></v-icon>
              <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">{{ getRequestEmptyTitle(status) }}</h3>
              <p class="text-body-2 text-grey mb-4">{{ getRequestEmptyText(status) }}</p>
              <v-btn
                color="primary"
                variant="tonal"
                rounded="pill"
                prepend-icon="mdi-account-search-outline"
                @click="pageTab = 'vitrine'"
              >
                Ver Vitrine
              </v-btn>
            </v-card>

            <div v-if="sentRequestsTotalPages(status) > 1" class="d-flex justify-center mt-6">
              <v-pagination
                :model-value="sentRequestsPage[status]"
                @update:model-value="setSentRequestsPage(status, $event)"
                :length="sentRequestsTotalPages(status)"
                rounded="circle"
                active-color="primary"
                color="white"
                elevation="0"
                class="glass-panel pa-1 rounded-pill"
              ></v-pagination>
            </div>
          </v-window-item>
        </v-window>
      </v-window-item>
    </v-window>

    <!-- WhatsApp Pre-Formatted Message Dialog -->
    <WhatsAppContactModal
      v-model="showWhatsAppDialog"
      :target-profile="selectedCandidate"
      target-type="candidate"
    />

    <!-- Access Request Dialog -->
    <v-dialog v-model="showAccessRequestDialog" max-width="520">
      <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold gradient-text">Solicitar Acesso ao Perfil</h3>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showAccessRequestDialog = false"></v-btn>
        </div>
        <p class="text-body-2 text-grey-lighten-1 mb-1">
          Enviar pedido de acesso para
          <strong class="text-white">{{ selectedAccessCandidate?.name }}</strong>
        </p>
        <p class="text-caption text-grey mb-4">
          O profissional precisará aceitar o pedido para que você possa visualizar seus dados de contato.
        </p>
        <v-textarea
          v-model="accessRequestMessage"
          label="Mensagem de apresentação *"
          placeholder="Olá! Vi seu perfil na vitrine e acredito que posso ajudar na sua transição de carreira..."
          rows="4"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-4"
          :rules="[rules.required]"
        ></v-textarea>
        <v-alert
          v-if="accessRequestError"
          type="error"
          variant="tonal"
          rounded="xl"
          closable
          class="mb-4 font-weight-bold"
          @click:close="accessRequestError = ''"
        >
          {{ accessRequestError }}
        </v-alert>
        <div class="d-flex justify-end gap-2">
          <v-btn variant="text" rounded="pill" @click="showAccessRequestDialog = false">Cancelar</v-btn>
          <v-btn
            class="glass-btn-primary"
            rounded="pill"
            prepend-icon="mdi-send"
            :disabled="!accessRequestMessage"
            @click="sendAccessRequest"
          >
            Enviar Pedido
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Candidate Detail Dialog -->
    <v-dialog v-model="showDetailDialog" max-width="600">
      <v-card class="glass-panel pa-6 rounded-2xl" elevation="0" v-if="selectedCandidate">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <h3 class="text-h6 font-weight-bold gradient-text pa-0 ma-0">{{ selectedCandidate.name }}</h3>
            <div class="text-caption text-grey">{{ selectedCandidate.area }} • {{ selectedCandidate.seniority }}</div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showDetailDialog = false"></v-btn>
        </div>

        <div class="mb-4">
          <div class="text-subtitle-2 font-weight-bold text-white mb-1">Headline</div>
          <p class="text-body-2 text-grey-lighten-1">{{ selectedCandidate.headline }}</p>
        </div>

        <div class="mb-4">
          <div class="text-subtitle-2 font-weight-bold text-white mb-1">Objetivo de Carreira</div>
          <p class="text-body-2 text-grey-lighten-1">{{ selectedCandidate.careerGoal }}</p>
        </div>

        <div class="d-flex justify-end gap-2">
          <v-btn variant="text" rounded="pill" @click="showDetailDialog = false">Fechar</v-btn>
          <v-btn
            v-if="selectedCandidate && hasAcceptedAccessTo(selectedCandidate.id)"
            color="success"
            rounded="pill"
            prepend-icon="mdi-whatsapp"
            @click="showDetailDialog = false; openWhatsAppModal(selectedCandidate)"
          >
            WhatsApp
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCandidatesStore } from '@/stores/candidates'
import { useHuntersStore } from '@/stores/hunters'
import { useMetricsStore } from '@/stores/metrics'
import { useAuthStore } from '@/stores/auth'
import WhatsAppContactModal from '@/components/WhatsAppContactModal.vue'
import { AREA_OPTIONS, SENIORITY_OPTIONS, MOMENT_OPTIONS } from '@/constants/options'
import type { CandidateProfile, CandidateStatus, HunterAccessRequest, AccessRequestStatus } from '@/types'
import { formatDateBR } from '@/types'

const candidatesStore = useCandidatesStore()
const huntersStore = useHuntersStore()
const metricsStore = useMetricsStore()
const authStore = useAuthStore()

onMounted(() => {
  if (!candidatesStore.loaded) candidatesStore.fetchCandidates()
  if (!huntersStore.loaded) huntersStore.fetchHunters()
  if (authStore.currentRole === 'hunter') huntersStore.fetchSentAccessRequests()
})

// WhatsApp só é liberado após o candidato aceitar o pedido de acesso (LinkedIn fica sempre visível)
function hasAcceptedAccessTo(candidateId: string): boolean {
  return huntersStore.sentAccessRequests.some(r => r.status === 'accepted' && r.candidateId === candidateId)
}

// Limite de 5 solicitações de acesso por mês por Job Hunter
const MAX_ACCESS_REQUESTS_PER_MONTH = 5

const requestsSentThisMonth = computed(() => {
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return huntersStore.sentAccessRequests.filter(r => r.requestedAt.startsWith(yearMonth)).length
})

const accessLimitReached = computed(() => requestsSentThisMonth.value >= MAX_ACCESS_REQUESTS_PER_MONTH)

const page = ref(1)
const itemsPerPage = ref(5)
const pageTab = ref('vitrine')
const sentTab = ref('pending')

const sentRequestsPage = ref<Record<AccessRequestStatus, number>>({ pending: 1, accepted: 1, rejected: 1 })
const sentRequestsPerPage = 5

function setSentRequestsPage(status: AccessRequestStatus, value: number | null) {
  if (value && value > 0) sentRequestsPage.value[status] = value
}

function sentRequestsTotalPages(status: AccessRequestStatus): number {
  return Math.ceil(sentRequestsByStatus(status).length / sentRequestsPerPage)
}

function paginatedSentRequestsByStatus(status: AccessRequestStatus): HunterAccessRequest[] {
  const list = sentRequestsByStatus(status)
  const start = (sentRequestsPage.value[status] - 1) * sentRequestsPerPage
  return list.slice(start, start + sentRequestsPerPage)
}

const totalPages = computed(() => Math.ceil(candidatesStore.filteredCandidates.length / itemsPerPage.value))

const paginatedCandidates = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return candidatesStore.filteredCandidates.slice(start, end)
})

const showWhatsAppDialog = ref(false)
const showDetailDialog = ref(false)
const selectedCandidate = ref<CandidateProfile | null>(null)

// Access request state
const showAccessRequestDialog = ref(false)
const accessRequestMessage = ref('')
const accessRequestError = ref('')
const selectedAccessCandidate = ref<CandidateProfile | null>(null)

const currentHunter = computed(() => {
  if (authStore.currentRole !== 'hunter') return null
  return huntersStore.hunters.find(h => h.name === authStore.hunterUser.name) || null
})

const isApprovedHunter = computed(() => {
  const hunter = currentHunter.value
  return hunter?.status === 'Aprovado'
})

function candidateFor(req: HunterAccessRequest): CandidateProfile | null {
  return req.candidateId ? candidatesStore.candidates.find(c => c.id === req.candidateId) || null : null
}

function sentRequestsByStatus(status: AccessRequestStatus): HunterAccessRequest[] {
  return huntersStore.sentAccessRequests.filter(r => r.status === status)
}

function getRequestEmptyTitle(status: AccessRequestStatus): string {
  if (status === 'accepted') return 'Nenhum pedido aceito'
  if (status === 'rejected') return 'Nenhum pedido recusado'
  return 'Nenhum pedido pendente'
}

function getRequestEmptyText(status: AccessRequestStatus): string {
  if (status === 'accepted') return 'Quando um profissional aceitar seu pedido de acesso, ele aparecerá aqui para contato direto.'
  if (status === 'rejected') return 'Nenhum profissional recusou seus pedidos de acesso até o momento.'
  return 'Seus pedidos de acesso aguardando aprovação aparecerão aqui.'
}

function getRequestEmptyIcon(status: AccessRequestStatus): string {
  if (status === 'accepted') return 'mdi-check-decagram-outline'
  if (status === 'rejected') return 'mdi-close-circle-outline'
  return 'mdi-clock-outline'
}

function whatsappFromRequest(req: HunterAccessRequest) {
  const candidate = candidateFor(req)
  if (candidate) openWhatsAppModal(candidate)
}

function linkedinFromRequest(req: HunterAccessRequest) {
  const candidate = candidateFor(req)
  if (candidate) contactCandidateLinkedIn(candidate)
}

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
}

function resetFilters() {
  candidatesStore.searchQuery = ''
  candidatesStore.selectedArea = null
  candidatesStore.selectedSeniority = null
  candidatesStore.selectedMoment = null
  page.value = 1
}

function getMomentColor(moment: CandidateStatus) {
  if (moment === 'Buscando recolocação') return 'error'
  if (moment === 'Em Transição') return 'warning'
  if (moment === 'Aberto a Propostas') return 'primary'
  return 'secondary'
}

function openWhatsAppModal(candidate: CandidateProfile) {
  selectedCandidate.value = candidate
  showWhatsAppDialog.value = true
}

function openDetailModal(candidate: CandidateProfile) {
  selectedCandidate.value = candidate
  showDetailDialog.value = true
}

function contactCandidateLinkedIn(candidate: CandidateProfile) {
  metricsStore.triggerContactRedirection(
    'candidate',
    candidate.id,
    candidate.name,
    'linkedin',
    candidate.linkedInUrl,
    '',
    authStore.currentRole
  )
}

function openAccessRequestDialog(candidate: CandidateProfile) {
  selectedAccessCandidate.value = candidate
  accessRequestMessage.value = ''
  accessRequestError.value = ''
  showAccessRequestDialog.value = true
}

async function sendAccessRequest() {
  const hunter = currentHunter.value
  const candidate = selectedAccessCandidate.value
  if (!hunter || !candidate) return
  if (!accessRequestMessage.value.trim()) {
    accessRequestError.value = 'Escreva uma mensagem de apresentação.'
    return
  }
  try {
    await huntersStore.sendAccessRequest(candidate.id, accessRequestMessage.value.trim())
    showAccessRequestDialog.value = false
    accessRequestMessage.value = ''
    accessRequestError.value = ''
  } catch (err: any) {
    accessRequestError.value = err?.response?.data?.error || err.message || 'Erro ao enviar solicitação de acesso.'
  }
}
</script>
