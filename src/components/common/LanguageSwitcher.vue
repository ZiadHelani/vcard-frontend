<script setup>
import { useI18n } from '@/composables/useI18n'

const { locale, availableLocales, changeLocale, localeConfig } = useI18n()

import { useLocale } from 'vuetify'
const { current } = useLocale()

const props = defineProps({
  // Display style: 'menu' | 'buttons' | 'select'
  variant: {
    type: String,
    default: 'menu',
    validator: (value) => ['menu', 'buttons', 'select'].includes(value),
  },
  // Show flag emoji
  showFlag: {
    type: Boolean,
    default: true,
  },
  // Show language name
  showName: {
    type: Boolean,
    default: true,
  },
  // Icon color
  color: {
    type: String,
    default: 'primary',
  },
  // Size: 'small' | 'default' | 'large'
  size: {
    type: String,
    default: 'default',
  },
})

const handleLocaleChange = (localeCode) => {
  current.value = localeCode
  changeLocale(localeCode)
}
</script>

<template>
  <!-- Menu variant (dropdown) -->
  <v-menu v-if="variant === 'menu'" offset-y>
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        :color="color"
        variant="text"
        :size="size"
        class="language-switcher-btn"
      >
        <span v-if="showFlag" class="me-2">{{ localeConfig.flag }}</span>
        <span v-if="showName">{{ localeConfig.name }}</span>
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="lang in availableLocales"
        :key="lang.code"
        :active="locale === lang.code"
        @click="handleLocaleChange(lang.code)"
      >
        <template #prepend>
          <span v-if="showFlag" class="me-2">{{ lang.flag }}</span>
        </template>
        <v-list-item-title>{{ lang.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- Buttons variant (inline buttons) -->
  <v-btn-toggle
    v-else-if="variant === 'buttons'"
    :model-value="locale"
    mandatory
    :color="color"
    class="language-switcher-buttons"
    @update:model-value="handleLocaleChange"
  >
    <v-btn
      v-for="lang in availableLocales"
      :key="lang.code"
      :value="lang.code"
      :size="size"
    >
      <span v-if="showFlag" class="me-1">{{ lang.flag }}</span>
      <span v-if="showName">{{ lang.name }}</span>
    </v-btn>
  </v-btn-toggle>

  <!-- Select variant (dropdown select) -->
  <v-select
    v-else-if="variant === 'select'"
    :model-value="locale"
    :items="availableLocales"
    item-title="name"
    item-value="code"
    :color="color"
    variant="outlined"
    density="compact"
    hide-details
    class="language-switcher-select"
    @update:model-value="handleLocaleChange"
  >
    <template #selection="{ item }">
      <span v-if="showFlag" class="me-2">{{ item.raw.flag }}</span>
      <span v-if="showName">{{ item.raw.name }}</span>
    </template>
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <span v-if="showFlag" class="me-2">{{ item.raw.flag }}</span>
        </template>
        <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped>
.language-switcher-btn {
  text-transform: none;
}

.language-switcher-buttons {
  border-radius: 8px;
  overflow: hidden;
}

.language-switcher-select {
  min-width: 150px;
}
</style>
