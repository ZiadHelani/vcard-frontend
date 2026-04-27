<script setup>
import { RouterView } from 'vue-router'
import { Header, Footer } from '@/components/Website/index.js'
import { VApp, VMain } from 'vuetify/components'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const routeName = computed(() => route.name)
</script>

<template>
  <Header v-if="routeName !== 'login' && routeName !== 'register' && routeName !== 'card.show'" />
  <v-main :class="routeName === 'login' || routeName === 'register' ? 'main grid-pattern' : 'main'">
    <RouterView />
  </v-main>
  <Footer v-if="routeName !== 'login' && routeName !== 'register' && routeName !== 'card.show'" />
</template>
