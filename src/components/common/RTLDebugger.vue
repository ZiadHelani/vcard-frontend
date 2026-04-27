<template>
  <div
    style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;"
  >
    <div><strong>🌐 RTL Debug Info</strong></div>
    <hr style="border-color: rgba(255,255,255,0.3); margin: 8px 0;">
    <div>Locale: <strong>{{ locale }}</strong></div>
    <div>Direction: <strong>{{ localeConfig.dir }}</strong></div>
    <div>isRTL: <strong>{{ isRTL }}</strong></div>
    <div>Vuetify RTL: <strong>{{ vuetifyRTL }}</strong></div>
    <div>HTML dir: <strong>{{ htmlDir }}</strong></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useRtl } from 'vuetify'

const { locale, isRTL, localeConfig } = useI18n()
const { isRtl: vuetifyRTL } = useRtl()

const htmlDir = computed(() => document.documentElement.getAttribute('dir') || 'none')
</script>
