<template>
  <v-navigation-drawer permanent color="white" width="280" :rail="configStore.rail" rail-width="80"
    class="sidebar-drawer border border-end-0 position-relative" elevation="1">
    <div class="sidebar-rail">
      <v-btn @click="configStore.toggleRail()" :ripple="false" class="sidebar-rail-btn"
        :icon="configStore.rail ? 'mdi-checkbox-blank-circle' : 'mdi-checkbox-blank-circle-outline'" size="small"
        variant="text" color="primary"></v-btn>
    </div>

    <!-- App Logo and Title -->
    <router-link :to="{ name: 'home' }" class="text-decoration-none">
      <div class="d-flex align-center pa-4">
        <v-img src="/logo.svg" width="32" height="32" class="margin-inline-end"></v-img>
        <div class="line-height-1" v-if="!configStore.rail">
          <h2 class="gradient-title text-xl font-weight-bold text-white mb-1" style="line-height: 1.7;">{{
            $t('website.header.ultra') }}</h2>
          <p class="text-sm text-muted mb-0">{{ $t('dashboard.sidebar.tagline') }}</p>
        </div>
      </div>
    </router-link>

    <v-divider class="border-opacity-25"></v-divider>

    <!-- Navigation Items -->
    <v-list nav density="compact" class="pa-5">
      <SidebarItem :title="$t('dashboard.sidebar.menu.dashboard')" value="dashboard" icon="mdi-view-dashboard-outline"
        :subtitle="$t('dashboard.sidebar.subtitle.dashboard')" to="/dashboard/index" />
      <SidebarItem :title="$t('dashboard.sidebar.menu.cardBuilder')" value="cards" icon="mdi-card"
        :subtitle="$t('dashboard.sidebar.subtitle.cardBuilder')" to="/dashboard/card-builder" />
      <SidebarItem :title="$t('dashboard.sidebar.menu.cards')" value="cards-list" icon="mdi-cards-outline"
        :subtitle="$t('dashboard.sidebar.subtitle.cards')" to="/dashboard/cards" />
      <SidebarItem :title="$t('dashboard.sidebar.menu.contacts')" value="contacts" icon="mdi-account-group"
        :subtitle="$t('dashboard.sidebar.subtitle.contacts')" to="/dashboard/contacts" />
      <!-- <SidebarItem :title="$t('dashboard.sidebar.menu.billing')" value="billing" icon="mdi-currency-usd"
        :subtitle="$t('dashboard.sidebar.subtitle.billing')" to="/dashboard/billings" /> -->
      <SidebarItem :title="$t('dashboard.sidebar.menu.support')" value="support" icon="mdi-comment-question-outline"
        :subtitle="$t('dashboard.sidebar.subtitle.support')" to="/dashboard/support" />

      <!-- Admin Section -->
      <template v-if="authStore.user?.role === 'admin'">
        <v-list-subheader v-if="!configStore.rail" class="text-xs text-muted font-weight-bold px-0 mb-2">
          {{ $t('dashboard.sidebar.adminPanel') }}
        </v-list-subheader>
        <SidebarItem :title="$t('dashboard.sidebar.menu.usersManagement')" value="admin-users" icon="mdi-shield-account"
          :subtitle="$t('dashboard.sidebar.subtitle.usersManagement')" to="/admin/users" />
        <SidebarItem :title="$t('dashboard.sidebar.menu.subscriptions')" value="admin-subscriptions" icon="mdi-crown"
          :subtitle="$t('dashboard.sidebar.subtitle.subscriptions')" to="/admin/subscriptions" />
      </template>
    </v-list>

    <v-divider class="border-opacity-25"></v-divider>
    <div class="pa-4">
      <v-btn variant="tonal" color="error" rounded="lg" class="float-on-hover" block @click="logout">
        <v-icon v-if="configStore.rail">mdi-logout-variant</v-icon>
        <template #prepend v-if="!configStore.rail">
          <v-icon>mdi-logout-variant</v-icon>
        </template>
        <span class="text-sm text-capitalize" v-if="!configStore.rail">{{ $t('dashboard.sidebar.signOut') }}</span>
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-rail-btn {
  position: absolute;
  top: 18px;
  inset-inline-end: -20px;
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import SidebarItem from './common/SidebarItem.vue'
import { useConfigStore } from '@/stores/config.js'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const configStore = useConfigStore()


const authStore = useAuthStore()

const logout = async () => {
  try {
    await authStore.logout()
  } finally {
    router.push({ name: 'login' })
  }
}
</script>
