<template>
  <div>
    <!-- HERO: QUEM VOCÊ É -->
    <v-card class="glass-panel pa-5 pa-sm-8 pa-md-12 rounded-3xl mb-6 mb-sm-10 relative overflow-hidden" elevation="0">
      <v-row align="center">
        <v-col cols="12" class="text-center">
          <span class="glass-badge text-secondary mb-4">Conectamos Profissionais e Job Hunters</span>
          <h1 class="text-h3 text-sm-h3 text-md-h2 font-weight-black gradient-text mb-3 leading-tight">
            Como Você Quer Entrar na Plataforma?
          </h1>
          <p class="text-body-1 text-sm-h6 text-grey-lighten-1 mb-8 max-w-650 mx-auto font-weight-regular">
            Escolha o seu perfil abaixo e seja direcionado para a experiência ideal para o seu momento profissional.
          </p>

          <div class="d-flex flex-column flex-md-row justify-center gap-3 gap-md-4">
            <v-btn
              to="/profissional"
              class="glass-btn-primary px-4 w-100 w-md-auto hero-cta-btn"
              size="large"
              rounded="pill"
              prepend-icon="mdi-briefcase-account-outline"
            >
              Sou Profissional
            </v-btn>
            <v-btn
              to="/job-hunter"
              variant="outlined"
              size="large"
              rounded="pill"
              class="text-white border-glass px-4 w-100 w-md-auto font-weight-bold hero-cta-btn"
              prepend-icon="mdi-account-tie-outline"
            >
              Sou Job Hunter
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- SEÇÃO: DOIS CAMINHOS -->
    <v-row class="mb-6 mb-sm-10">
      <v-col cols="12" md="6">
        <v-card class="glass-panel pa-5 pa-sm-6 rounded-3xl h-100 glass-panel-hover cursor-pointer" elevation="0" @click="$router.push('/profissional')">
          <div class="d-flex align-center mb-4">
            <v-avatar color="primary" size="56" class="mr-4 elevation-6">
              <v-icon icon="mdi-briefcase-account-outline" color="white" size="28"></v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-black text-white pa-0 ma-0">Perfil Profissional</h3>
              <span class="text-caption text-grey">Busque oportunidades e seja encontrado</span>
            </div>
          </div>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            Coloque seu perfil na vitrine gratuitamente para que os melhores Job Hunters do mercado entrem em contato
            direto com você via WhatsApp e LinkedIn. Sem intermediários, no seu ritmo.
          </p>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> 100% gratuito</span>
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> Em conformidade com LGPD</span>
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> Contato direto</span>
          </div>
          <v-btn to="/profissional" variant="outlined" rounded="pill" class="font-weight-bold border-glass w-100" prepend-icon="mdi-arrow-right">
            Ver Página do Profissional
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-panel pa-5 pa-sm-6 rounded-3xl h-100 glass-panel-hover cursor-pointer" elevation="0" @click="$router.push('/job-hunter')">
          <div class="d-flex align-center mb-4">
            <v-avatar color="secondary" size="56" class="mr-4 elevation-6">
              <v-icon icon="mdi-account-tie-outline" color="white" size="28"></v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-black text-white pa-0 ma-0">Job Hunter</h3>
              <span class="text-caption text-grey">Acesse a vitrine e faça conexões</span>
            </div>
          </div>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            Credencie-se para navegar na vitrine de profissionais, solicitar acesso aos perfis e abordar talentos
            qualificados para suas vagas e projetos de recolocação.
          </p>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> Vitrine validada</span>
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> Talento sob demanda</span>
            <span class="glass-badge"><v-icon icon="mdi-check" size="14" color="success"></v-icon> Rede qualificada</span>
          </div>
          <v-btn to="/job-hunter" variant="outlined" rounded="pill" class="font-weight-bold border-glass w-100" prepend-icon="mdi-arrow-right">
            Ver Página do Job Hunter
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- SEÇÃO: MOTOR DA PLATAFORMA -->
    <v-card class="glass-panel pa-5 pa-sm-8 rounded-3xl" elevation="0">
      <div class="text-center mb-6">
        <span class="glass-badge text-secondary mb-2">Ecossistema Duplo Fluxo</span>
        <h2 class="text-h4 text-sm-h3 font-weight-black gradient-text-subtle mb-2">Uma só plataforma, dois objetivos</h2>
        <p class="text-body-2 text-sm-subtitle-1 text-grey max-w-600 mx-auto">
          Profissionais aceleram suas carreiras e Job Hunters encontram o talento certo — com transparência e sem intermediários.
        </p>
      </div>
      <v-timeline density="compact" align="start" class="px-1 px-sm-2">
        <v-timeline-item dot-color="primary" size="x-small">
          <div class="font-weight-bold text-white text-caption text-sm-body-2">Princípio 1 — Transparência Total</div>
          <div class="text-caption text-grey">Contato direto via WhatsApp e LinkedIn com consentimento explícito.</div>
        </v-timeline-item>
        <v-timeline-item dot-color="secondary" size="x-small">
          <div class="font-weight-bold text-white text-caption text-sm-body-2">Princípio 2 — Curadoria e Credibilidade</div>
          <div class="text-caption text-grey">Job Hunters passam por análise e profissionais optam pela visibilidade.</div>
        </v-timeline-item>
        <v-timeline-item dot-color="accent" size="x-small">
          <div class="font-weight-bold text-white text-caption text-sm-body-2">Princípio 3 — LGPD em Primeiro Lugar</div>
          <div class="text-caption text-grey">Dados protegidos e nunca expostos sem o seu consentimento.</div>
        </v-timeline-item>
      </v-timeline>
      <div class="d-flex justify-center mt-6">
        <v-btn to="/login" variant="outlined" rounded="pill" class="font-weight-bold border-glass px-6" prepend-icon="mdi-login">
          Já tenho conta — Entrar
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
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
  text-transform: none !important;
}

@media (min-width: 600px) {
  .hero-cta-btn {
    font-size: 1.05rem !important;
    min-height: 54px;
  }
}
</style>