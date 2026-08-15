<template>
  <v-row v-if="requests.length > 0">
    <v-col
      v-for="req in requests"
      :key="req.id"
      cols="12"
      md="6"
    >
      <v-card class="glass-panel pa-6 rounded-2xl" elevation="0">
        <div class="d-flex align-start mb-4">
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
              <template v-if="mode === 'accepted'">
                <v-icon icon="mdi-check-decagram" size="14" color="success" class="mr-1"></v-icon>
                Acesso concedido em {{ formatDateBR(req.requestedAt) }}
              </template>
              <template v-else>
                <v-icon icon="mdi-calendar" size="14" class="mr-1"></v-icon>
                Solicitado em {{ formatDateBR(req.requestedAt) }}
              </template>
            </div>
          </div>
        </div>

        <div class="glass-panel pa-4 rounded-xl mb-4 bg-surface-variant">
          <div class="text-caption text-secondary font-weight-bold mb-1">Mensagem do Hunter:</div>
          <p class="text-body-2 text-grey-lighten-1 mb-0 italic">
            "{{ req.message }}"
          </p>
        </div>

        <template v-if="mode === 'accepted'">
          <div class="d-flex flex-column flex-sm-row gap-2">
            <v-btn
              color="success"
              variant="flat"
              rounded="pill"
              class="flex-grow-1 font-weight-bold"
              prepend-icon="mdi-whatsapp"
              @click="$emit('whatsapp', req)"
            >
              WhatsApp
            </v-btn>
            <v-btn
              color="info"
              variant="outlined"
              rounded="pill"
              class="flex-grow-1 font-weight-bold border-glass"
              prepend-icon="mdi-linkedin"
              @click="$emit('linkedin', req)"
            >
              LinkedIn
            </v-btn>
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-column flex-sm-row gap-2">
            <v-btn
              color="success"
              variant="flat"
              rounded="pill"
              class="flex-grow-1 font-weight-bold w-100 w-sm-auto"
              prepend-icon="mdi-check-circle-outline"
              @click="$emit('accept', req.id)"
            >
              Aceitar Acesso
            </v-btn>
            <div class="d-flex gap-2 w-100 w-sm-auto">
              <v-btn
                color="info"
                variant="outlined"
                rounded="pill"
                class="flex-grow-1 font-weight-bold border-glass"
                prepend-icon="mdi-linkedin"
                @click="$emit('linkedin', req)"
              >
                LinkedIn
              </v-btn>
              <v-btn
                color="error"
                variant="outlined"
                rounded="pill"
                class="flex-grow-1 font-weight-bold border-glass"
                prepend-icon="mdi-close-circle-outline"
                @click="$emit('reject', req.id)"
              >
                Recusar
              </v-btn>
            </div>
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <v-card v-else class="glass-panel pa-12 text-center rounded-2xl mt-4" elevation="0">
    <template v-if="mode === 'accepted'">
      <v-icon icon="mdi-account-tie-outline" size="64" color="grey" class="mb-3"></v-icon>
      <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum Job Hunter aceito ainda</h3>
      <p class="text-body-2 text-grey mb-4">Quando você aceitar um pedido de acesso, o hunter aparecerá aqui para contato direto.</p>
    </template>
    <template v-else>
      <v-icon icon="mdi-check-circle-outline" size="64" color="success" class="mb-3"></v-icon>
      <h3 class="text-h6 font-weight-bold gradient-text-subtle mb-2">Nenhum pedido pendente</h3>
      <p class="text-body-2 text-grey mb-4">Você não possui solicitações de acesso de Job Hunters no momento.</p>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import type { HunterAccessRequest } from '@/types'
import { formatDateBR } from '@/types'

defineProps<{
  requests: HunterAccessRequest[]
  mode: 'pending' | 'accepted'
}>()

defineEmits<{
  accept: [id: string]
  reject: [id: string]
  whatsapp: [req: HunterAccessRequest]
  linkedin: [req: HunterAccessRequest]
}>()
</script>