<template>
  <div>
    <!-- Header Banner -->
    <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl mb-6" elevation="0">
      <v-row align="center" class="text-center text-md-start">
        <v-col cols="12" md="8">
          <h1 class="text-h3 font-weight-black gradient-text mb-2">
            Perfil do Job Hunter
          </h1>
          <p class="text-subtitle-1 text-grey-lighten-1 mb-0 mx-auto mx-md-0 max-w-650">
            Gerencie seu perfil de consultor de carreira para aparecer no catálogo de referências para profissionais do meuemprego.pro.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-end mt-4 mt-md-0">
          <div class="d-flex justify-center justify-md-end">
            <v-chip :color="statusChipColor" variant="flat" size="large" class="font-weight-bold px-4">
              <v-icon :icon="statusChipIcon" start size="16"></v-icon>
              {{ authStore.hunterUser.status }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl" elevation="0">
          <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
            <!-- Form Header -->
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h2 class="text-h5 font-weight-bold gradient-text-subtle">
                  Dados Profissionais
                </h2>
                <div class="text-caption text-grey">
                  Preencha as informações abaixo para manter seu perfil atualizado e visível no catálogo.
                </div>
              </div>
              <v-avatar color="secondary" size="48">
                <v-icon icon="mdi-account-tie" size="28"></v-icon>
              </v-avatar>
            </div>

            <!-- Error Banner -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              rounded="xl"
              class="mb-4 font-weight-bold"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Status Info -->
            <v-alert
              v-if="authStore.hunterUser.status === 'Pendente'"
              type="warning"
              variant="tonal"
              rounded="xl"
              class="mb-4 font-weight-bold"
            >
              Seu perfil está em análise. Depois de aprovado, você poderá enviar solicitações de acesso na Vitrine de Profissionais.
            </v-alert>

            <v-row density="comfortable">
              <!-- Name, Email & CPF -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.name"
                  label="Nome Completo *"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.email"
                  label="E-mail de Login *"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.cpf"
                  label="CPF (Anti-Duplicidade) *"
                  placeholder="000.000.000-00"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hint="Protegido sob LGPD"
                  persistent-hint
                  :rules="[rules.required, rules.cpfValid]"
                  @input="handleCpfInput"
                ></v-text-field>
              </v-col>

              <!-- PASSWORD & CONFIRM PASSWORD -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.password"
                  label="Nova Senha"
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hint="Deixe em branco para manter a atual"
                  persistent-hint
                  :rules="[rules.minLength]"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirmar Nova Senha"
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.passwordMatch]"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>

              <!-- Headline -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.headline"
                  label="Título Profissional (Headline) *"
                  placeholder="Ex: Executive Headhunter & Coach de Carreira Tech"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <!-- Bio -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.bio"
                  label="Biografia e Metodologia *"
                  placeholder="Conte aos profissionais como você atua, sua experiência e como conduz o processo de recolocação."
                  rows="3"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-textarea>
              </v-col>

              <!-- MANDATORY CONTACT LINKS -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.linkedInUrl"
                  label="URL do Perfil no LinkedIn (Obrigatório) *"
                  placeholder="https://www.linkedin.com/in/seu-perfil"
                  prepend-inner-icon="mdi-linkedin"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required, rules.url]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.whatsappNumber"
                  label="Número do WhatsApp com DDD (Obrigatório) *"
                  placeholder="5511999998888"
                  prepend-inner-icon="mdi-whatsapp"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hint="Apenas números incluindo código do país (55)"
                  persistent-hint
                  :rules="[rules.required, rules.phone]"
                ></v-text-field>
              </v-col>

              <!-- HUNTER SPECIFIC FIELDS -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.specialties"
                  :items="SPECIALTY_OPTIONS"
                  label="Especialidades Atendidas *"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.senioritiesServed"
                  :items="SENIORITY_OPTIONS"
                  label="Senioridades Atendidas *"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.serviceModel"
                  :items="SERVICE_MODEL_OPTIONS"
                  label="Modelo de Serviço *"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-6 opacity-20"></v-divider>

            <!-- Form Actions -->
            <div class="d-flex justify-end gap-3">
              <v-btn
                type="submit"
                class="glass-btn-primary px-8"
                size="large"
                rounded="pill"
                :disabled="!isFormValid"
                prepend-icon="mdi-check-circle-outline"
              >
                Salvar Perfil
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSnackbar" color="success" timeout="3000" rounded="pill">
      <v-icon icon="mdi-check-circle" start></v-icon>
      Perfil atualizado com sucesso!
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHuntersStore } from '@/stores/hunters'
import { isValidCPF, formatCPF } from '@/types'
import { SPECIALTY_OPTIONS, SENIORITY_OPTIONS, SERVICE_MODEL_OPTIONS } from '@/constants/options'

const authStore = useAuthStore()
const huntersStore = useHuntersStore()

const formRef = ref()
const isFormValid = ref(false)
const showSnackbar = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const hunter = authStore.hunterUser

const formData = reactive({
  name: hunter.name,
  cpf: hunter.cpf || '',
  email: hunter.email,
  password: '',
  confirmPassword: '',
  headline: hunter.headline,
  bio: hunter.bio,
  specialties: [...hunter.specialties],
  senioritiesServed: [...hunter.senioritiesServed],
  serviceModel: hunter.serviceModel,
  linkedInUrl: hunter.linkedInUrl,
  whatsappNumber: hunter.whatsappNumber,
})

const statusChipColor = computed(() => {
  if (hunter.status === 'Aprovado') return 'success'
  if (hunter.status === 'Rejeitado') return 'error'
  return 'warning'
})

const statusChipIcon = computed(() => {
  if (hunter.status === 'Aprovado') return 'mdi-check-decagram'
  if (hunter.status === 'Rejeitado') return 'mdi-cancel'
  return 'mdi-clock-outline'
})

function handleCpfInput() {
  formData.cpf = formatCPF(formData.cpf)
}

const rules = {
  required: (v: any) => (Array.isArray(v) ? v.length > 0 || 'Selecione pelo menos uma opção' : !!v || 'Campo obrigatório'),
  minLength: (v: string) => !v || v.length >= 6 || 'Mínimo de 6 caracteres',
  passwordMatch: (v: string) => !formData.password || v === formData.password || 'As senhas não coincidem',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  url: (v: string) => /https?:\/\/.+/.test(v) || 'URL precisa iniciar com http:// ou https://',
  phone: (v: string) => /^\d{10,13}$/.test(v.replace(/\D/g, '')) || 'Informe apenas números com DDD (ex: 5511999998888)',
  cpfValid: (v: string) => isValidCPF(v) || 'CPF inválido. Verifique os dígitos digitados.',
  mustBeTrue: (v: boolean) => v === true || 'É necessário aceitar os termos da LGPD',
}

function isHunterRegistered() {
  if (!formData.cpf) return false
  return huntersStore.isCpfRegistered(formData.cpf)
}

async function submitForm() {
  errorMessage.value = ''

  try {
    const isNew = !authStore.hunterUser.id
    if (isNew && isHunterRegistered()) {
      throw new Error('CPF já cadastrado na plataforma para outro Job Hunter.')
    }

    const payload = {
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      password: formData.password || undefined,
      headline: formData.headline,
      bio: formData.bio,
      specialties: formData.specialties,
      senioritiesServed: formData.senioritiesServed,
      serviceModel: formData.serviceModel as any,
      linkedInUrl: formData.linkedInUrl,
      whatsappNumber: formData.whatsappNumber,
    }

    if (isNew) {
      await huntersStore.registerHunter(payload as any)
    } else {
      await authStore.updateHunterProfile(payload)
    }

    showSnackbar.value = true
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.error || err.message || 'Erro ao salvar o perfil.'
  }
}
</script>