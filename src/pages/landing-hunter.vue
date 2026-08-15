<template>
  <div>
    <!-- SEÇÃO 1: HERO GLASSMORPHIC (MOBILE FIRST) -->
    <v-card class="glass-panel pa-5 pa-sm-8 pa-md-12 rounded-3xl mb-6 mb-sm-10 relative overflow-hidden" elevation="0">
      <v-row align="center">
        <v-col cols="12" lg="7" class="text-center text-lg-start">
          <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-black gradient-text mb-4 leading-tight">
            Sua Vitrine Exclusiva de Talentos Qualificados
          </h1>

          <p class="text-body-1 text-sm-h6 text-grey-lighten-1 mb-6 mb-sm-8 max-w-650 mx-auto mx-lg-0 font-weight-regular">
            Acesse perfis profissionais <strong class="text-white font-weight-bold">validados e com consentimento LGPD</strong> para suas vagas e processos de recolocação. Conexão direta, transparente e sem intermediários.
          </p>

          <!-- DUAL CTA -->
          <div class="d-flex flex-column flex-md-row justify-center justify-lg-start gap-3 gap-md-4 mb-6">
            <v-btn
              class="glass-btn-primary px-4 w-100 w-md-auto hero-cta-btn"
              size="large"
              rounded="pill"
              prepend-icon="mdi-account-group-outline"
              @click="navigateToShowcase"
            >
              Explorar Vitrine de Profissionais
            </v-btn>

            <v-btn
              variant="outlined"
              size="large"
              rounded="pill"
              class="text-white border-glass px-4 w-100 w-md-auto font-weight-bold hero-cta-btn"
              prepend-icon="mdi-account-tie"
              @click="navigateToRegister"
            >
              Criar Perfil de Job Hunter
            </v-btn>
          </div>

          <div class="d-flex align-center justify-center justify-lg-start text-caption text-grey gap-3 gap-sm-4 flex-wrap">
            <span class="d-flex align-center"><v-icon icon="mdi-check" color="success" class="mr-1"></v-icon> Profissionais com opt-in explícito</span>
            <span class="d-flex align-center"><v-icon icon="mdi-check" color="success" class="mr-1"></v-icon> CPF protegido sob LGPD</span>
          </div>
        </v-col>

        <v-col cols="12" lg="5" class="text-center position-relative mt-6 mt-lg-0">
          <div class="hero-visual-card glass-panel pa-4 pa-sm-6 rounded-2xl elevation-12">
            <div class="d-flex align-center justify-space-between mb-4">
              <span class="text-caption font-weight-bold text-secondary text-uppercase">Vitrine em Tempo Real</span>
              <span class="glass-badge text-success">Live</span>
            </div>

            <div class="glass-mini-card pa-4 rounded-xl mb-3 text-start">
              <div>
                <div class="text-subtitle-2 font-weight-bold text-white pa-0 ma-0">Carlos Eduardo</div>
                <div class="text-caption text-grey">Engenheiro Staff (Perfil Profissional)</div>
              </div>
              <div class="d-flex align-center justify-space-between mt-3 flex-wrap gap-2">
                <span class="text-caption text-secondary">Opt-in Vitrine Ativo</span>
                <v-btn size="x-small" color="success" rounded="pill" prepend-icon="mdi-whatsapp">Abordar</v-btn>
              </div>
            </div>

            <div class="glass-mini-card pa-4 rounded-xl text-start">
              <div class="d-flex align-center gap-3">
                <v-avatar size="42" color="secondary">
                  <v-icon icon="mdi-account-tie" color="white" size="20"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-white pa-0 ma-0">Juliana Mendes</div>
                  <div class="text-caption text-grey">Job Hunter Sênior Tech</div>
                </div>
              </div>
              <div class="text-caption text-accent mt-2">Assessoria Completa · Sênior/C-Level</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- SEÇÃO 2: PROVA SOCIAL & MÉTRICAS DE IMPACTO -->
    <v-row class="mb-6 mb-sm-10">
      <v-col cols="6" sm="6" md="3">
        <v-card class="glass-panel pa-4 pa-sm-6 text-center rounded-2xl h-100" elevation="0">
          <div class="text-h4 text-sm-h3 font-weight-black gradient-text mb-1">+1.450</div>
          <div class="text-caption text-sm-subtitle-2 text-grey">Conexões Diretas Realizadas</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card class="glass-panel pa-4 pa-sm-6 text-center rounded-2xl h-100" elevation="0">
          <div class="text-h4 text-sm-h3 font-weight-black text-secondary mb-1">+380</div>
          <div class="text-caption text-sm-subtitle-2 text-grey">Job Hunters Credenciados</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card class="glass-panel pa-4 pa-sm-6 text-center rounded-2xl h-100" elevation="0">
          <div class="text-h4 text-sm-h3 font-weight-black text-accent mb-1">98.4%</div>
          <div class="text-caption text-sm-subtitle-2 text-grey">Satisfação de Profissionais</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card class="glass-panel pa-4 pa-sm-6 text-center rounded-2xl h-100" elevation="0">
          <div class="text-h4 text-sm-h3 font-weight-black text-success mb-1">&lt; 1h</div>
          <div class="text-caption text-sm-subtitle-2 text-grey">Tempo Médio até Primeira Abordagem</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- SEÇÃO 3: COMO FUNCIONA PARA O JOB HUNTER -->
    <v-card class="glass-panel pa-5 pa-sm-8 rounded-3xl mb-6 mb-sm-10" elevation="0">
      <div class="text-center mb-6 mb-sm-8">
        <span class="glass-badge text-secondary mb-2">Simplicidade & Autonomia</span>
        <h2 class="text-h4 text-sm-h3 font-weight-black gradient-text-subtle mb-2">Como Funciona Para o Job Hunter</h2>
        <p class="text-body-2 text-sm-subtitle-1 text-grey max-w-600 mx-auto">Acesso qualificado a talentos prontos para o mercado.</p>
      </div>

      <v-row justify="center">
        <v-col cols="12" md="8">
          <div class="glass-panel pa-5 pa-sm-6 rounded-2xl h-100 border-secondary-glow">
            <div class="mb-4">
              <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold text-white pa-0 ma-0">Para Job Hunters</h3>
              <span class="text-caption text-secondary">Da vitrine ao contato direto</span>
            </div>

            <v-timeline density="compact" align="start" class="px-1 px-sm-2">
              <v-timeline-item dot-color="secondary" size="x-small">
                <div class="font-weight-bold text-white text-caption text-sm-body-2">1. Crie seu Perfil de Job Hunter</div>
                <div class="text-caption text-grey">Credencie-se com suas especialidades, senioridades atendidas e modelo de serviço.</div>
              </v-timeline-item>
              <v-timeline-item dot-color="secondary" size="x-small">
                <div class="font-weight-bold text-white text-caption text-sm-body-2">2. Solicite Acesso à Vitrine</div>
                <div class="text-caption text-grey">Cada profissional pode aceitar ou recusar seu pedido — você sempre respeita o consentimento do talento.</div>
              </v-timeline-item>
              <v-timeline-item dot-color="secondary" size="x-small">
                <div class="font-weight-bold text-white text-caption text-sm-body-2">3. Aborde por WhatsApp e LinkedIn</div>
                <div class="text-caption text-grey">Após a aprovação, conecte-se diretamente e acelere seus processos de recolocação e preenchimento de vagas.</div>
              </v-timeline-item>
            </v-timeline>

            <v-btn
              to="/cadastro-hunter"
              block
              class="glass-btn-primary mt-4 hero-cta-btn"
              rounded="pill"
              prepend-icon="mdi-account-tie-outline"
            >
              Quero Credenciar Meu Perfil
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- SEÇÃO 4: BENEFÍCIOS DO JOB HUNTER -->
    <v-row class="mb-6 mb-sm-10">
      <v-col cols="12" md="6" lg="3">
        <v-card class="glass-panel pa-5 rounded-2xl h-100" elevation="0">
          <v-avatar color="primary" size="48" class="mb-3">
            <v-icon icon="mdi-shield-check-outline" color="white"></v-icon>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold text-white mb-1">Perfis Curados</h3>
          <p class="text-caption text-grey mb-0">Profissionais com objetivo de carreira, senioridade e momento claros — prontos para serem abordados.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="glass-panel pa-5 rounded-2xl h-100" elevation="0">
          <v-avatar color="secondary" size="48" class="mb-3">
            <v-icon icon="mdi-account-plus-outline" color="white"></v-icon>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold text-white mb-1">Talentos Sob Demanda</h3>
          <p class="text-caption text-grey mb-0">Tenha acesso imediato a talentos de Tecnologia, Finanças, Vendas e muito mais, sem garimpar redes sociais.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="glass-panel pa-5 rounded-2xl h-100" elevation="0">
          <v-avatar color="accent" size="48" class="mb-3">
            <v-icon icon="mdi-whatsapp" color="white"></v-icon>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold text-white mb-1">Contato Direto</h3>
          <p class="text-caption text-grey mb-0">Sem plataforma de intermediários: WhatsApp e LinkedIn formatados com um clique para você acelerar o processo.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="glass-panel pa-5 rounded-2xl h-100" elevation="0">
          <v-avatar color="success" size="48" class="mb-3">
            <v-icon icon="mdi-lock-check-outline" color="white"></v-icon>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold text-white mb-1">LGPD em Primeiro Lugar</h3>
          <p class="text-caption text-grey mb-0">Só entra em contato quem for autorizado. O CPF do profissional permanece sempre sigiloso.</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- SEÇÃO 5: PERGUNTAS FREQUENTES (FAQ) -->
    <v-card class="glass-panel pa-5 pa-sm-8 rounded-3xl mb-6 mb-sm-10" elevation="0">
      <div class="text-center mb-6">
        <h2 class="text-h5 text-sm-h4 font-weight-bold gradient-text">Dúvidas Frequentes de Job Hunters</h2>
      </div>

      <v-expansion-panels variant="accordion" class="bg-transparent">
        <v-expansion-panel class="glass-panel mb-2 rounded-xl" title="Como me credencio como Job Hunter na plataforma?">
          <v-expansion-panel-text class="text-grey-lighten-1 text-body-2">
            Basta criar seu perfil de Job Hunter informando suas especialidades, senioridades atendidas e modelo de serviço. Seu perfil passa por uma análise de curadoria antes de ser aprovado.
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel class="glass-panel mb-2 rounded-xl" title="Como funciona a vitrine de profissionais?">
          <v-expansion-panel-text class="text-grey-lighten-1 text-body-2">
            A vitrine lista perfis profissionais que ativaram a opção "Solicitar contato de Hunters". Para ver os dados completos e abordar o talento, você envia um pedido de acesso que o profissional pode aceitar ou recusar.
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel class="glass-panel rounded-xl" title="Há custo para Job Hunters utilizarem a plataforma?">
          <v-expansion-panel-text class="text-grey-lighten-1 text-body-2">
            O cadastro do perfil de Job Hunter é gratuito. A plataforma prioriza a transparência e a conexão direta entre profissionais e Job Hunters, funcionando como vitrine qualificada.
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- SEÇÃO 6: CTA FINAL -->
    <v-card class="glass-panel pa-6 pa-sm-10 text-center rounded-3xl" elevation="0">
      <h2 class="text-h4 text-sm-h3 font-weight-black gradient-text mb-3">Seu próximo talento pode estar a um clique</h2>
      <p class="text-body-2 text-sm-subtitle-1 text-grey mb-6 max-w-600 mx-auto">
        Junte-se a centenas de Job Hunters que encontram talentos qualificados e prontos para o mercado no meuemprego.pro.
      </p>
      <div class="d-flex justify-center flex-column flex-md-row gap-3 gap-md-4">
        <v-btn
          class="glass-btn-primary px-6 w-100 w-md-auto hero-cta-btn"
          size="large"
          rounded="pill"
          prepend-icon="mdi-account-group-outline"
          @click="navigateToShowcase"
        >
          Explorar Vitrine de Profissionais
        </v-btn>
        <v-btn
          to="/cadastro-hunter"
          variant="outlined"
          size="large"
          rounded="pill"
          class="text-white border-glass px-6 w-100 w-md-auto font-weight-bold hero-cta-btn"
          prepend-icon="mdi-account-tie-outline"
        >
          Criar Perfil de Job Hunter
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function navigateToRegister() {
  authStore.setRole('hunter')
  router.push('/cadastro-hunter')
}

async function navigateToShowcase() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (authStore.currentRole === 'hunter' || authStore.currentRole === 'admin') {
    router.push('/candidatos')
    return
  }
  router.push('/login')
}
</script>

<style scoped>
.leading-tight { line-height: 1.15; }

.hero-cta-btn {
  white-space: normal !important;
  word-break: break-word;
  height: auto !important;
  min-height: 50px;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  font-size: 0.95rem !important;
  line-height: 1.25 !important;
}

@media (min-width: 600px) {
  .hero-cta-btn {
    font-size: 1.05rem !important;
    min-height: 54px;
  }
}

.border-secondary-glow {
  border: 1px solid rgba(6, 182, 212, 0.4) !important;
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15) !important;
}
.hero-visual-card {
  background: rgba(15, 23, 42, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px) !important;
}
.glass-mini-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>