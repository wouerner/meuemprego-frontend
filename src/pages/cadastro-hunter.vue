<template>
  <div>
    <!-- Header Banner -->
    <v-card class="glass-panel pa-6 pa-md-8 rounded-2xl mb-6" elevation="0">
      <v-row align="center" class="text-center text-md-start">
        <v-col cols="12" md="8">
          <h1 class="text-h3 font-weight-black gradient-text mb-2">
            Cadastro de Job Hunter
          </h1>
          <p class="text-subtitle-1 text-grey-lighten-1 mb-0 mx-auto mx-md-0 max-w-650">
            Credencie-se como Job Hunter para acessar a vitrine de profissionais, solicitar contato e encontrar talentos qualificados para suas vagas e projetos.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-end mt-4 mt-md-0">
          <v-chip color="secondary" variant="flat" size="large" class="font-weight-bold px-4">
            <v-icon icon="mdi-target" start size="18"></v-icon>
            Job Hunter
          </v-chip>
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
                  Perfil de Job Hunter
                </h2>
                <div class="text-caption text-grey">Preencha os campos obrigatórios (*) para criar seu login e cadastrar seu perfil de Job Hunter.</div>
              </div>
              <v-avatar color="secondary" size="48">
                <v-icon icon="mdi-target" size="28"></v-icon>
              </v-avatar>
            </div>

            <!-- Error Banner for Duplicate CPF -->
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
                  label="E-mail Profissional *"
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
                  label="CPF (Obrigatório - Anti-Duplicidade) *"
                  placeholder="000.000.000-00"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hint="Protegido por criptografia sob LGPD"
                  persistent-hint
                  :rules="[rules.required, rules.cpfValid, rules.cpfNotDuplicate]"
                  @input="handleCpfInput"
                ></v-text-field>
              </v-col>

              <!-- PASSWORD & CONFIRM PASSWORD -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.password"
                  label="Senha de Acesso *"
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required, rules.minLength]"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirmar Senha *"
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required, rules.passwordMatch]"
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

              <!-- LGPD & CPF PRIVACY CONSENT -->
              <v-col cols="12" class="mt-2">
                <div class="glass-panel pa-4 rounded-xl border-accent">
                  <v-checkbox
                    v-model="formData.lgpdConsent"
                    color="success"
                    hide-details
                    :rules="[rules.mustBeTrue]"
                  >
                    <template #label>
                      <div class="text-caption text-grey-lighten-1">
                        Li e concordo com os <a class="text-secondary cursor-pointer" @click.stop="showLgpdModal = true">Termos de Privacidade e Proteção de Dados (LGPD)</a>. O meu CPF será utilizado exclusivamente para validação anti-duplicidade e NUNCA será exibido publicamente.
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-6 opacity-20"></v-divider>

            <!-- Form Actions -->
            <div class="d-flex justify-end">
              <v-btn
                type="submit"
                class="glass-btn-primary px-6 w-100 w-sm-auto"
                size="large"
                rounded="pill"
                :disabled="!isFormValid"
                prepend-icon="mdi-check-circle-outline"
              >
                Cadastrar Perfil de Job Hunter
              </v-btn>
            </div>
          </v-form>
        </v-card>

        <!-- Post-registration Info Card -->
        <v-card class="glass-panel pa-5 pa-md-6 rounded-2xl mt-6" elevation="0">
          <div class="d-flex align-center gap-3 mb-2">
            <v-icon icon="mdi-information-outline" color="secondary" size="24"></v-icon>
            <h3 class="text-subtitle-1 font-weight-bold text-white pa-0 ma-0">O que acontece depois?</h3>
          </div>
          <ul class="text-body-2 text-grey-lighten-1 ma-0 px-4 space-y-2">
            <li>Seu perfil entra em análise pela equipe de curadoria (status <strong class="text-white">Pendente</strong>).</li>
            <li>Após a aprovação, você poderá navegar pela <strong class="text-white">Vitrine de Profissionais</strong> e solicitar acesso aos perfis com consentimento.</li>
            <li>Aborde os talentos diretamente via WhatsApp e LinkedIn para acelerar recolocação e preenchimento de vagas.</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSnackbar" color="success" timeout="3000" rounded="pill">
      <v-icon icon="mdi-check-circle" start></v-icon>
      Perfil de Job Hunter cadastrado com sucesso!
    </v-snackbar>

    <!-- LGPD Modal Dialog -->
    <v-dialog v-model="showLgpdModal" max-width="600">
      <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold gradient-text">Termos de Privacidade e Validação de CPF</h3>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showLgpdModal = false"></v-btn>
        </div>

        <div class="text-body-2 text-grey-lighten-1 space-y-3 mb-4 max-h-350 overflow-y-auto pr-2">
          <p>
            <strong>1. Coleta de Dados e CPF:</strong> Coletamos seu nome, CPF, e-mail, perfil do LinkedIn e WhatsApp para validar a autenticidade e evitar a criação de perfis duplicados na plataforma meuemprego.pro.
          </p>
          <p>
            <strong>2. Sigilo Absoluto do CPF:</strong> Seu CPF é um dado protegido. Ele é utilizado unicamente em rotinas internas de verificação de unicidade e Jamais será compartilhado ou exposto para terceiros.
          </p>
          <p>
            <strong>3. Direitos do Titular:</strong> Você tem o direito de solicitar a exclusão de seu cadastro e dados associados a qualquer momento.
          </p>
        </div>

        <div class="d-flex justify-end">
          <v-btn class="glass-btn-primary" rounded="pill" @click="showLgpdModal = false">Compreendi</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHuntersStore } from '@/stores/hunters'
import { isValidCPF, formatCPF } from '@/types'
import { SPECIALTY_OPTIONS, SENIORITY_OPTIONS, SERVICE_MODEL_OPTIONS } from '@/constants/options'

const router = useRouter()
const authStore = useAuthStore()
const huntersStore = useHuntersStore()

const formRef = ref()
const isFormValid = ref(false)
const showSnackbar = ref(false)
const showLgpdModal = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = reactive({
  name: authStore.hunterUser.name,
  cpf: authStore.hunterUser.cpf || '',
  email: authStore.hunterUser.email,
  password: '',
  confirmPassword: '',
  headline: authStore.hunterUser.headline,
  bio: authStore.hunterUser.bio,
  specialties: [...authStore.hunterUser.specialties],
  senioritiesServed: [...authStore.hunterUser.senioritiesServed],
  serviceModel: authStore.hunterUser.serviceModel,
  linkedInUrl: authStore.hunterUser.linkedInUrl,
  whatsappNumber: authStore.hunterUser.whatsappNumber,
  lgpdConsent: true,
})

function handleCpfInput() {
  formData.cpf = formatCPF(formData.cpf)
}

function isHunterRegistered() {
  if (!formData.cpf) return false
  return huntersStore.isCpfRegistered(formData.cpf)
}

const rules = {
  required: (v: any) => (Array.isArray(v) ? v.length > 0 || 'Selecione pelo menos uma opção' : !!v || 'Campo obrigatório'),
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo de 6 caracteres',
  passwordMatch: (v: string) => v === formData.password || 'As senhas não coincidem',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  url: (v: string) => /https?:\/\/.+/.test(v) || 'URL precisa iniciar com http:// ou https://',
  phone: (v: string) => /^\d{10,13}$/.test(v.replace(/\D/g, '')) || 'Informe apenas números com DDD (ex: 5511999998888)',
  cpfValid: (v: string) => isValidCPF(v) || 'CPF inválido. Verifique os dígitos digitados.',
  cpfNotDuplicate: (v: string) => {
    if (!v || !isValidCPF(v)) return true
    return (!isHunterRegistered() || v === authStore.hunterUser.cpf) || 'Este CPF já está cadastrado para outro Job Hunter.'
  },
  mustBeTrue: (v: boolean) => v === true || 'É necessário aceitar os termos da LGPD',
}

async function submitForm() {
  errorMessage.value = ''
  if (isHunterRegistered() && !authStore.hunterUser.id) {
    errorMessage.value = 'Este CPF já está cadastrado para outro Job Hunter.'
    return
  }

  try {
    if (!authStore.isAuthenticated) {
      await authStore.register(formData.name, formData.email, formData.password, 'hunter')
    }
    authStore.setRole('hunter')

    await authStore.updateHunterProfile({
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      headline: formData.headline,
      bio: formData.bio,
      specialties: formData.specialties,
      senioritiesServed: formData.senioritiesServed as any,
      serviceModel: formData.serviceModel as any,
      linkedInUrl: formData.linkedInUrl,
      whatsappNumber: formData.whatsappNumber,
    })

    showSnackbar.value = true
    setTimeout(() => router.push('/candidatos'), 800)
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.error || err.message || 'Erro ao realizar cadastro.'
  }
}
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.max-w-650 { max-width: 650px; }
.max-h-350 { max-height: 350px; }
.border-accent {
  border: 1px solid rgba(139, 92, 246, 0.4) !important;
}
</style>