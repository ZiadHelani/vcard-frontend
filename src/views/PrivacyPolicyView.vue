<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, tm, locale } = useI18n()

const sections = computed(() => [
  {
    title: t('privacy.sections.collection.title'),
    items: tm('privacy.sections.collection.items'),
  },
  {
    title: t('privacy.sections.usage.title'),
    items: tm('privacy.sections.usage.items'),
  },
  {
    title: t('privacy.sections.storage.title'),
    items: tm('privacy.sections.storage.items'),
  },
  {
    title: t('privacy.sections.rights.title'),
    items: tm('privacy.sections.rights.items'),
  },
  {
    title: t('privacy.sections.age.title'),
    items: tm('privacy.sections.age.items'),
  },
  {
    title: t('privacy.sections.changes.title'),
    items: tm('privacy.sections.changes.items'),
  },
  {
    title: t('privacy.sections.law.title'),
    items: tm('privacy.sections.law.items'),
  },
])
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <VChip class="mb-5" color="info">{{ t('privacy.hero.title') }}</VChip>
        <v-divider class="mb-10" color="primary"></v-divider>
        <div v-for="(section, idx) in sections" :key="idx" class="mb-6">
          <h3 class="text-lg font-weight-bold mb-3">{{ section.title }}</h3>
          <ul>
            <li v-for="(item, i) in section.items" :key="i" class="text-md text-muted mb-2">
              {{ item }}
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
