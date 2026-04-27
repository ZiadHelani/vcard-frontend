<template>
  <v-list-item
    :value="value"
    :to="to"
    class="mb-1 rounded-lg"
    :class="{ 'py-3': !configStore.rail }"
    color="primary"
    variant="elevated"
    elevation="0"
    rounded="lg"
    active-class="sidebar-active"
  >
    <template #title v-if="!configStore.rail">
      <span class="text-sm"> {{ title }} </span>
    </template>
    <template #prepend>
      <v-icon size="20">{{ icon }}</v-icon>
    </template>
    <template #subtitle v-if="!configStore.rail">
      <span class="text-xs"> {{ subtitle }} </span>
    </template>
  </v-list-item>
</template>

<script setup>
import { useConfigStore } from '@/stores/config.js'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '#',
  },
})

const configStore = useConfigStore()

</script>
