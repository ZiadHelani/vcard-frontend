<template>
  <v-row class="my-2">
    <v-col cols="12" :lg="lg" :md="md" :sm="sm" v-for="n in count" :key="n">
      <v-skeleton-loader class="rounded-lg" elevation="0" :type="type"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'card',
  },
  count: {
    type: Number,
    default: 4,
  },
  lg: {
    type: Number,
    default: 3,
  },
  md: {
    type: Number,
    default: 6,
  },
  sm: {
    type: Number,
    default: 12,
  },
})
</script>
