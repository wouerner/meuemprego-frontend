<template>
  <div>
    <!-- ==================== CANDIDATE VIEW: Access Requests ==================== -->
    <template v-if="authStore.currentRole === 'candidato'">
      <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl mb-6" elevation="0">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-black gradient-text mb-2">
              Pedidos de Acesso de Job Hunters
            </h1>
            <p class="text-subtitle-1 text-grey-lighten-1 mb-0 max-w-650">
              Job Hunters solicitaram acesso ao seu perfil profissional. Aceite para que possam ver seus dados e entrar em contato, ou recuse se não tiver interesse.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-md-end">
            <v-btn
              to="/cadastro"
              variant="outlined"
              class="border-glass px-6"
              size="large"
              rounded="pill"
              prepend-icon="mdi-bullhorn-outline"
            >
              Editar Meu Perfil
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
        <v-tabs v-model="accessTab" color="primary" align-tabs="start">
          <v-tab value="pending" class="font-weight-bold">
            <v-badge :content="huntersStore.candidateAccessRequests.length" color="warning" class="mr-2" inline>
              Pedidos Pendentes
            </v-badge>
          </v-tab>
          <v-tab value="accepted" class="font-weight-bold">
            <v-badge :content="huntersStore.acceptedAccessRequests.length" color="success" class="mr-2" inline>
              Hunters Aceitos
            </v-badge>
          </v-tab>
        </v-tabs>

        <v-window v-model="accessTab">
          <v-window-item value="pending">
            <v-row v-if="huntersStore.candidateAccessRequests.length > 0" class="pt-4">
              <v-col
                v-for="req in huntersStore.candidateAccessRequests"
                :key="req.id"
                cols="12"
                md="6"
              >
                <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
                  <div class="d-flex align-start gap-3 mb-4">
                    <v-avatar size="64" class="elevation-4 border-glass">
                      <v-img :src="req.hunterAvatar" :alt="req.hunterName"></v-img>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold gradient-text-subtle pa-0 ma-0">
                        {{ req.hunterName }}
                      </h3>
                      <div class="text-caption text-grey-lighten-1 mb-2">{{ req.hunterHeadline }}</div>
                      <div class="d-flex flex-wrap gap-1 mb-2">
                        <span
                          v-for="spec in req.hunterSpecialties"
                          :key="spec"
                          class="glass-badge text-caption py-1 px-3"
                        >
                          {{ spec }}
                        </span>
                      </div>
                      <div class="text-caption text-grey">
                        <v-icon icon="mdi-calendar" size="14" class="mr-1"></v-icon>
                        Solicitado em {{ req.requestedAt }}
                      </div>
                    </div>
                  </div>

                  <div class="glass-panel pa-4 rounded-xl mb-4 bg-surface-variant">
                    <div class="text-caption text-secondary font-weight-bold mb-1">Mensagem do Hunter:</div>
                    <p class="text-body-2 text-grey-lighten-1 mb-0 italic">
                      "{{ req.message }}"
                    </p>
                  </div>

                  <div class="d-flex gap-3 flex-wrap">
                    <v-btn
                      color="success"
                      variant="flat"
                      rounded="pill"
                      class="flex-grow-1 font-weight-bold"
                      prepend-icon="mdi-check-circle-outline"
                      @click="acceptRequest(req.id)"
                    >
                      Aceitar Acesso
                    </v-btn>
                    <v-btn
                      color="info"
                      variant="outlined"
                      rounded="pill"
                      class="font-weight-bold border-glass"
                      prepend-icon="mdi-linkedin"
                      @click="contactPendingLinkedIn(req)"
                    >
                      Ver LinkedIn
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="outlined"
                      rounded="pill"
                      class="font-weight-bold border-glass"
                      prepend-icon="mdi-close-circle-outline"
                      @click="rejectRequest(req.id)"
                    >
                      Recusar
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card v-else class="glass-panel pa-12 text-center rounded-2xl mt-4" elevation="0">
              <v-icon icon="mdi-check-circle-outline" size="64" color="success" class="mb-3"></v-icon>
              <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum pedido pendente</h3>
              <p class="text-body-2 text-grey mb-4">Você não possui solicitações de acesso de Job Hunters no momento.</p>
            </v-card>
          </v-window-item>

          <v-window-item value="accepted">
            <v-row v-if="huntersStore.acceptedAccessRequests.length > 0" class="pt-4">
              <v-col
                v-for="req in huntersStore.acceptedAccessRequests"
                :key="req.id"
                cols="12"
                md="6"
              >
                <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
                  <div class="d-flex align-start gap-3 mb-4">
                    <v-avatar size="64" class="elevation-4 border-glass">
                      <v-img :src="req.hunterAvatar" :alt="req.hunterName"></v-img>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold gradient-text-subtle pa-0 ma-0">
                        {{ req.hunterName }}
                      </h3>
                      <div class="text-caption text-grey-lighten-1 mb-2">{{ req.hunterHeadline }}</div>
                      <div class="d-flex flex-wrap gap-1 mb-2">
                        <span
                          v-for="spec in req.hunterSpecialties"
                          :key="spec"
                          class="glass-badge text-caption py-1 px-3"
                        >
                          {{ spec }}
                        </span>
                      </div>
                      <div class="text-caption text-grey">
                        <v-icon icon="mdi-check-decagram" size="14" color="success" class="mr-1"></v-icon>
                        Acesso concedido em {{ req.requestedAt }}
                      </div>
                    </div>
                  </div>

                  <div class="glass-panel pa-4 rounded-xl mb-4 bg-surface-variant">
                    <div class="text-caption text-secondary font-weight-bold mb-1">Mensagem do Hunter:</div>
                    <p class="text-body-2 text-grey-lighten-1 mb-0 italic">
                      "{{ req.message }}"
                    </p>
                  </div>

                  <div class="d-flex gap-2">
                    <v-btn
                      color="success"
                      variant="flat"
                      rounded="pill"
                      class="flex-grow-1 font-weight-bold"
                      prepend-icon="mdi-whatsapp"
                      @click="openAcceptedWhatsApp(req)"
                    >
                      Chamar no WhatsApp
                    </v-btn>
                    <v-btn
                      color="info"
                      variant="outlined"
                      rounded="pill"
                      class="font-weight-bold border-glass"
                      prepend-icon="mdi-linkedin"
                      @click="contactAcceptedLinkedIn(req)"
                    >
                      LinkedIn
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card v-else class="glass-panel pa-12 text-center rounded-2xl mt-4" elevation="0">
              <v-icon icon="mdi-account-tie-outline" size="64" color="grey" class="mb-3"></v-icon>
              <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum Job Hunter aceito ainda</h3>
              <p class="text-body-2 text-grey mb-4">Quando você aceitar um pedido de acesso, o hunter aparecerá aqui para contato direto.</p>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>

      <WhatsAppContactModal v-model="showWhatsAppDialog" :target-profile="selectedHunter" target-type="hunter" />
    </template>

    <!-- ==================== HUNTER VIEW: Catalog (existing) ==================== -->
    <template v-else>
      <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl mb-6" elevation="0">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center gap-2 mb-2">
              <span class="glass-badge text-primary">Catálogo Público</span>
              <span class="glass-badge text-secondary">Duplo Fluxo Gratuito</span>
              <span class="glass-badge text-success">
                <v-icon icon="mdi-flash-outline" size="14" start></v-icon>
                Busca em &lt; 100ms
              </span>
            </div>
            <h1 class="text-h3 font-weight-black gradient-text mb-2">
              Encontre seu Job Hunter Ideal
            </h1>
            <p class="text-subtitle-1 text-grey-lighten-1 mb-0 max-w-650">
              Conecte-se diretamente via LinkedIn ou WhatsApp com consultores de carreira especializados na sua área e nível de senioridade.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-md-end">
            <v-btn
              to="/candidatos"
              variant="outlined"
              class="border-glass px-6"
              size="large"
              rounded="pill"
              prepend-icon="mdi-account-group-outline"
            >
              Ver Vitrine de Profissionais
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Filters Section -->
      <v-card class="glass-panel pa-5 rounded-2xl mb-6" elevation="0">
        <v-row density="comfortable" align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="huntersStore.searchQuery"
              placeholder="Pesquisar por nome, especialidade..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="huntersStore.selectedSpecialty"
              :items="SPECIALTY_OPTIONS"
              label="Especialização"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="huntersStore.selectedSeniority"
              :items="SENIORITY_OPTIONS"
              label="Senioridade Atendida"
              variant="outlined"
              density="compact"
              hide-details
              rounded="pill"
              clearable
              @update:model-value="page = 1"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <v-select
              v-model="huntersStore.selectedServiceModel"
              :items="SERVICE_MODEL_OPTIONS"
              label="Modelo"
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

      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <div class="text-subtitle-2 text-grey">
          Exibindo <strong class="text-white">{{ paginatedHunters.length }}</strong> de <strong class="text-white">{{ huntersStore.filteredHunters.length }}</strong> Job Hunters
        </div>
        <div class="text-caption text-grey d-flex align-center">
          <v-icon icon="mdi-shield-check" color="success" class="mr-1" size="16"></v-icon>
          Página {{ page }} de {{ totalPages || 1 }}
        </div>
      </div>

      <v-row v-if="paginatedHunters.length > 0">
        <v-col
          v-for="hunter in paginatedHunters"
          :key="hunter.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="glass-panel glass-panel-hover pa-6 rounded-2xl h-100 d-flex flex-column" elevation="0">
            <div class="d-flex align-start gap-3 mb-4">
              <v-avatar size="64" class="elevation-4 border-glass cursor-pointer" @click="openDetailModal(hunter)">
                <v-img :src="hunter.avatar" :alt="hunter.name"></v-img>
              </v-avatar>
              <div class="flex-grow-1">
                <h3
                  class="text-h6 font-weight-bold gradient-text-subtle pa-0 ma-0 cursor-pointer"
                  @click="openDetailModal(hunter)"
                >
                  {{ hunter.name }}
                </h3>
                <div class="text-caption text-secondary font-weight-bold mb-1">{{ hunter.serviceModel }}</div>
                <div class="d-flex align-center text-caption text-amber-accent-2">
                  <v-icon icon="mdi-star" size="14" class="mr-1"></v-icon>
                  <span class="font-weight-bold mr-2">{{ hunter.rating }}</span>
                  <span class="text-grey">({{ hunter.totalContactsCount }} abordagens)</span>
                </div>
              </div>
            </div>
            <p class="text-body-2 text-grey-lighten-1 mb-4 flex-grow-1">{{ hunter.headline }}</p>
            <div class="mb-4 d-flex flex-wrap gap-1">
              <span v-for="spec in hunter.specialties" :key="spec" class="glass-badge text-caption py-1 px-3">{{ spec }}</span>
            </div>
            <div class="mb-5">
              <div class="text-caption text-grey mb-1 font-weight-bold">Senioridades Atendidas:</div>
              <div class="d-flex flex-wrap gap-1">
                <v-chip v-for="sen in hunter.senioritiesServed" :key="sen" size="x-small" variant="outlined" color="secondary" class="font-weight-medium">{{ sen }}</v-chip>
              </div>
            </div>
            <v-divider class="my-3 opacity-20"></v-divider>
            <div class="d-flex gap-2">
              <v-btn flex="1" color="success" variant="flat" rounded="pill" class="flex-grow-1 font-weight-bold" prepend-icon="mdi-whatsapp" @click="openWhatsAppModal(hunter)">WhatsApp</v-btn>
              <v-btn color="info" variant="outlined" rounded="pill" class="font-weight-bold border-glass" prepend-icon="mdi-linkedin" @click="contactHunterLinkedIn(hunter)">LinkedIn</v-btn>
              <v-btn icon="mdi-information-outline" variant="text" size="small" title="Ver detalhes" @click="openDetailModal(hunter)"></v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card v-else class="glass-panel pa-12 text-center rounded-2xl" elevation="0">
        <v-icon icon="mdi-account-search-outline" size="64" color="grey" class="mb-3"></v-icon>
        <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum Job Hunter encontrado</h3>
        <p class="text-body-2 text-grey mb-4">Tente ajustar os filtros de busca ou especialização.</p>
        <v-btn variant="outlined" rounded="pill" @click="resetFilters">Limpar Filtros</v-btn>
      </v-card>

      <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
        <v-pagination v-model="page" :length="totalPages" rounded="circle" active-color="primary" color="white" elevation="0" class="glass-panel pa-1 rounded-pill"></v-pagination>
      </div>

      <WhatsAppContactModal v-model="showWhatsAppDialog" :target-profile="selectedHunter" target-type="hunter" />

      <v-dialog v-model="showDetailDialog" max-width="600">
        <v-card class="glass-panel pa-6 rounded-2xl" elevation="0" v-if="selectedHunter">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center gap-3">
              <v-avatar size="64" class="elevation-4"><v-img :src="selectedHunter.avatar"></v-img></v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold gradient-text pa-0 ma-0">{{ selectedHunter.name }}</h3>
                <div class="text-caption text-secondary font-weight-bold">{{ selectedHunter.serviceModel }}</div>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" size="small" @click="showDetailDialog = false"></v-btn>
          </div>
          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold text-white mb-1">Headline</div>
            <p class="text-body-2 text-grey-lighten-1">{{ selectedHunter.headline }}</p>
          </div>
          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold text-white mb-1">Biografia e Metodologia</div>
            <p class="text-body-2 text-grey-lighten-1">{{ selectedHunter.bio }}</p>
          </div>
          <div class="d-flex justify-end gap-2">
            <v-btn variant="text" rounded="pill" @click="showDetailDialog = false">Fechar</v-btn>
            <v-btn color="success" rounded="pill" prepend-icon="mdi-whatsapp" @click="showDetailDialog = false; openWhatsAppModal(selectedHunter)">Chamar no WhatsApp</v-btn>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useHuntersStore } from '@/stores/hunters'
import { useMetricsStore } from '@/stores/metrics'
import { useAuthStore } from '@/stores/auth'
import WhatsAppContactModal from '@/components/WhatsAppContactModal.vue'
import { SPECIALTY_OPTIONS, SENIORITY_OPTIONS, SERVICE_MODEL_OPTIONS } from '@/constants/options'
import type { HunterProfile, HunterAccessRequest } from '@/types'

const huntersStore = useHuntersStore()
const metricsStore = useMetricsStore()
const authStore = useAuthStore()

onMounted(() => {
  if (!huntersStore.loaded) huntersStore.fetchHunters()
  if (authStore.isAuthenticated) huntersStore.fetchAccessRequests()
})

const page = ref(1)
const itemsPerPage = ref(6)

const accessTab = ref('pending')

const totalPages = computed(() => Math.ceil(huntersStore.filteredHunters.length / itemsPerPage.value))

const paginatedHunters = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return huntersStore.filteredHunters.slice(start, end)
})

const showWhatsAppDialog = ref(false)
const showDetailDialog = ref(false)
const selectedHunter = ref<HunterProfile | null>(null)

function resetFilters() {
  huntersStore.searchQuery = ''
  huntersStore.selectedSpecialty = null
  huntersStore.selectedSeniority = null
  huntersStore.selectedServiceModel = null
  page.value = 1
}

function openWhatsAppModal(hunter: HunterProfile) {
  selectedHunter.value = hunter
  showWhatsAppDialog.value = true
}

function openDetailModal(hunter: HunterProfile) {
  selectedHunter.value = hunter
  showDetailDialog.value = true
}

async function contactHunterLinkedIn(hunter: HunterProfile) {
  await huntersStore.incrementHunterContact(hunter.id)
  await metricsStore.triggerContactRedirection(
    'hunter',
    hunter.id,
    hunter.name,
    'linkedin',
    hunter.linkedInUrl,
    '',
    authStore.currentRole
  )
}

async function acceptRequest(id: string) {
  await huntersStore.respondToAccessRequest(id, 'accepted')
}

async function rejectRequest(id: string) {
  await huntersStore.respondToAccessRequest(id, 'rejected')
}

function hunterProfileFor(req: HunterAccessRequest): HunterProfile | null {
  return huntersStore.hunters.find(h => h.id === req.hunterId) || null
}

function openAcceptedWhatsApp(req: HunterAccessRequest) {
  const hunter = hunterProfileFor(req)
  if (hunter) openWhatsAppModal(hunter)
}

async function contactAcceptedLinkedIn(req: HunterAccessRequest) {
  const hunter = hunterProfileFor(req)
  if (hunter) await contactHunterLinkedIn(hunter)
}

async function contactPendingLinkedIn(req: HunterAccessRequest) {
  const hunter = hunterProfileFor(req)
  if (hunter) await contactHunterLinkedIn(hunter)
}
</script>
