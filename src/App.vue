<script setup>
import { watch, onMounted, nextTick } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useRtl, useLocale } from 'vuetify'

const { locale, isRTL, localeConfig } = useI18n()
const { isRtl } = useRtl()
const { current: vuetifyLocale } = useLocale()

// Function to apply RTL/LTR to the entire document
const applyDirection = (dir, lang) => {
  // Ensure DOM is ready
  if (document.documentElement) {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }
  if (document.body) {
    document.body.setAttribute('dir', dir)
  }

  // Update Vuetify RTL state
  isRtl.value = dir === 'rtl'

  // Sync Vuetify locale with i18n locale
  vuetifyLocale.value = lang

  // Also add a class for CSS targeting
  document.documentElement.classList.remove('rtl', 'ltr')
  document.documentElement.classList.add(dir)
}

// Initialize direction on mount - ensure it runs after DOM is ready
onMounted(() => {
  nextTick(() => {
    const direction = localeConfig.value.dir || 'ltr'
    const currentLang = locale.value
    applyDirection(direction, currentLang)
  })
})

// Watch for locale changes and apply direction
watch(
  [locale, localeConfig],
  ([newLocale, newConfig]) => {
    const direction = newConfig?.dir || 'ltr'
    nextTick(() => {
      applyDirection(direction, newLocale)
    })
  },
  { immediate: true },
)
</script>

<template>
  <v-app :dir="localeConfig.dir">
    <RouterView />
  </v-app>
</template>
