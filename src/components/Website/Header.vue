<template>
  <v-app-bar :elevation="0" color="surface" height="64" class="px-4">
    <v-container fluid class="d-flex align-center justify-lg-space-around justify-space-between pa-0">
      <!-- Logo Section -->
      <router-link :to="{ name: 'home' }" class="text-decoration-none">
        <div class="d-flex align-center">
          <v-img class="logo" src="/logo.svg" width="70"></v-img>
          <div class="line-height-2">
            <h2 class="text-xl font-weight-bold pa-0 gradient-title mb-0"
              style="text-transform: none; line-height: 1.6;">
              {{ $t('website.header.ultra') }}
            </h2>
            <p class="text-xs text-muted">
              {{ $t('website.header.tagline') }}
            </p>
          </div>
        </div>
      </router-link>


      <!-- Action Buttons - Desktop -->
      <div class="d-none d-md-flex align-center">
        <!-- Navigation Links - Desktop -->
        <div>
          <v-btn v-for="item in navigationItems" :key="item.title" variant="text" class="mx-2 text-sm"
            style="text-transform: none;" color="on-surface"
            @click="item.isRoute ? router.push(item.href) : scrollToSection(item.href)">
            {{ $t(item.i18nKey) }}
          </v-btn>
        </div>
        <v-btn v-if="authStore.isAuthenticated" :to="{ name: 'dashboard.index' }" variant="flat"
          class="mr-4 text-sm shadow-0" style="text-transform: none;" prepend-icon="mdi-view-dashboard" color="primary">
          {{ $t('website.header.dashboard') }}
        </v-btn>
        <v-btn v-if="!authStore.isAuthenticated" :to="{ name: 'login' }" variant="text" class="mr-4 text-sm shadow-0"
          style="text-transform: none;" color="on-surface">
          {{ $t('website.header.signIn') }}
        </v-btn>
        <v-btn v-if="!authStore.isAuthenticated" :to="{ name: 'register' }" color="primary" variant="elevated"
          class="text-sm font-weight-medium glow-btn" style="text-transform: none;">
          {{ $t('website.header.getStarted') }}
        </v-btn>

        <!-- Language Switcher - Desktop -->
        <LanguageSwitcher variant="menu" :show-flag="true" :show-name="false" class="ml-2" />
      </div>

      <!-- Mobile Menu Button -->
      <v-btn icon variant="text" class="d-md-none" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right" width="280" class="d-md-none">
    <v-list>
      <v-list-item v-for="item in navigationItems" :key="item.title" :title="$t(item.i18nKey)"
        @click="item.isRoute ? (router.push(item.href), drawer = false) : (scrollToSection(item.href), drawer = false)" />

      <v-divider class="my-4" />

      <v-list-item :to="{ name: 'login' }" :title="$t('website.header.signIn')" @click="drawer = false" />

      <!-- Language Switcher - Mobile -->
      <v-divider class="my-4" />
      <v-list-subheader>{{ $t('website.header.language') }}</v-list-subheader>
      <v-list-item class="px-4">
        <LanguageSwitcher variant="buttons" :show-flag="true" :show-name="false" size="small" />
      </v-list-item>

      <v-list-item class="px-4 mt-4">
        <v-btn color="primary" :to="{ name: 'register' }" variant="elevated" block
          class="text-body-2 font-weight-medium" style="text-transform: none;" rounded="lg" @click="drawer = false">
          {{ $t('website.header.getStarted') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthStore from '@/stores/auth.js'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

// Mobile drawer state
const drawer = ref(false)

// Navigation items
const navigationItems = [
  { i18nKey: 'website.header.nav.cards', href: '/cards', isRoute: true },
  { i18nKey: 'website.header.nav.about', href: '/about', isRoute: true },
  { i18nKey: 'website.header.nav.contact', href: '/contact', isRoute: true },
  { i18nKey: 'website.header.nav.features', href: '#features' },
  { i18nKey: 'website.header.nav.pricing', href: '#pricing' },
  { i18nKey: 'website.header.nav.reviews', href: '#reviews' }
]

// Smooth scroll to section
const scrollToSection = (href) => {
  const sectionId = href.replace('#', '')

  if (route.name !== 'home') {
    router.push({ name: 'home', hash: href })
    return
  }

  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-btn {
  letter-spacing: normal;
}
</style>
