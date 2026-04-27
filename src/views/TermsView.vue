<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, tm } = useI18n()

const sections = computed(() => [
  tm('terms.sections.introduction'),
  tm('terms.sections.definitions'),
  tm('terms.sections.registration'),
  tm('terms.sections.payment'),
  tm('terms.sections.userContent'),
  tm('terms.sections.copyright'),
  tm('terms.sections.security'),
  tm('terms.sections.liability'),
  tm('terms.sections.contact'),
  tm('terms.sections.changes'),
  tm('terms.sections.law'),
])
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <VChip class="mb-5" color="info">{{ t('terms.hero.title') }}</VChip>
        <v-divider class="mb-10" color="primary"></v-divider>
        <div v-for="(section, idx) in sections" :key="'section-' + idx" class="mb-6">
          <h3 class="text-lg font-weight-bold mb-3">{{ section.title }}</h3>
          <ul>
            <li v-for="(item, i) in section.content" :key="'item-' + i" class="text-md text-muted mb-2">
              {{ item }}
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
