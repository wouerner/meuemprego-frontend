<template>
  <div class="d-flex align-center justify-center min-h-screen py-8">
    <v-card class="glass-panel pa-8 pa-md-10 rounded-3xl w-100 max-w-500 relative overflow-hidden" elevation="0">
      <!-- Top Brand Icon & Title -->
      <div class="text-center mb-8">
        <v-avatar color="teal-accent-4" size="64" class="elevation-6 mb-4">
          <v-icon icon="mdi-key-change" color="white" size="32"></v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-black gradient-text mb-1">Definir Nova Senha</h1>
        <p class="text-subtitle-2 text-grey">Escolha uma nova senha para a sua conta</p>
      </div>

      <!-- Token Expired / Invalid Alert -->
      <v-alert v-if="!tokenValid" type="error" variant="tonal" rounded="xl" class="mb-4 font-weight-bold">
        Link de redefinição inválido ou expirado. Solicite um novo pela tela de login.
      </v-alert>

      <!-- Reset Form -->
      <v-form v-else ref="formRef" v-model="isFormValid" @submit.prevent="handleReset">
        <!-- Error Alert -->
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

        <!-- New Password Field -->
        <v-text-field
          v-model="password"
          label="Nova Senha *"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-3"
          :rules="[rules.required, rules.minLength]"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>

        <!-- Confirm Password Field -->
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar Nova Senha *"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-check-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-4"
          :rules="[rules.required, rules.match]"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>

        <!-- Submit Button -->
        <v-btn
          type="submit"
          block
          class="glass-btn-primary py-4 text-subtitle-1 mb-4"
          size="large"
          rounded="pill"
          :loading="submitting"
          :disabled="!isFormValid || submitting"
          prepend-icon="mdi-check"
        >
          Salvar Nova Senha
        </v-btn>

        <div class="text-center text-body-2 text-grey">
          Lembrou a senha?
          <router-link to="/login" class="text-secondary font-weight-bold text-decoration-none">
            Faça login
          </router-link>
        </div>
      </v-form>
    </v-card>

    <!-- Success Toast -->
    <v-snackbar v-model="showToast" color="success" timeout="3000" rounded="pill">
      <v-icon icon="mdi-check-circle" start></v-icon>
      {{ toastMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = ref('')
const tokenValid = ref(false)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const showToast = ref(false)
const toastMessage = ref('')

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo de 6 caracteres',
  match: (v: string) => v === password.value || 'As senhas não coincidem',
}

onMounted(() => {
  token.value = String(route.query.token || '')
  tokenValid.value = token.value.length > 0
})

async function handleReset() {
  if (!tokenValid.value) return
  errorMessage.value = ''
  submitting.value = true

  try {
    await authStore.resetPassword(token.value, password.value)
    toastMessage.value = 'Senha atualizada com sucesso. Faça login com a nova senha.'
    showToast.value = true
    setTimeout(() => router.push('/login'), 800)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Erro ao redefinir a senha. Tente novamente.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 80vh;
}
.max-w-500 {
  max-width: 500px;
}
</style>