<template>
  <v-app-bar color="surface" height="64" class="dashboard-header px-4" :elevation="0">
    <v-container fluid class="d-flex align-center justify-space-between pa-0">
      <!-- Search Bar -->
      <v-text-field
        color="primary"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        :placeholder="$t('dashboard.header.searchPlaceholder')"
        base-color="grey"
        bg-color="grey-lighten-4"
        max-width="350"
        class="float-on-hover"
      >
        <template #append-inner>
          <v-icon class="border pa-3 rounded-lg" style="font-size: 12px !important"
            >mdi-apple-keyboard-command
          </v-icon>
        </template>
      </v-text-field>

      <!-- Right Side Actions -->
      <div class="d-flex align-center">
        <!-- Notifications -->
        <v-menu
          v-model="notificationsMenu"
          :close-on-content-click="false"
          location="bottom"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mr-2" variant="text">
              <v-badge
                class="text-sm"
                :content="notificationCount"
                :model-value="notificationCount > 0"
                location="top right"
                color="error"
              >
                <v-icon color="black" icon="mdi-bell-outline"></v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-card min-width="320" max-width="320" class="notifications-menu">
            <v-card-title class="d-flex justify-space-between align-center pa-4">
              <span class="text-lg">{{ $t('dashboard.header.notifications') }}</span>
              <v-btn variant="text" size="small" color="primary" @click="markAllAsRead">
                {{ $t('dashboard.header.markAllRead') }}
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-list class="notifications-list pa-0" max-height="400" overflow-y="auto">
              <template v-if="notifications.length > 0">
                <v-list-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="{ unread: !notification.read }"
                  class="notification-item"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="notification.color" size="36" class="mr-3">
                      <v-icon :icon="notification.icon" color="white"></v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-sm mb-0">
                    {{ notification.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-muted text-xs">
                    {{ notification.time }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
              <v-list-item v-else>
                <v-list-item-title class="text-center text-xs py-4">
                  {{ $t('dashboard.header.noNotifications') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions class="justify-center pa-3">
              <v-btn variant="text" color="primary" block @click="viewAllNotifications">
                {{ $t('dashboard.header.viewAllNotifications') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- Language Switcher -->
        <LanguageSwitcher variant="menu" class="mr-2" size="small" />

        <!-- User Profile -->
        <v-menu v-model="userMenu" :close-on-content-click="false" location="bottom end" offset-y>
          <template v-slot:activator="{ props }">
            <div class="d-flex align-center" v-bind="props" style="cursor: pointer">
              <v-avatar size="36" color="primary">
                <v-img v-if="userAvatar" :src="userAvatar" alt="User Avatar"></v-img>
                <span v-else class="text-h6 text-white">{{ userInitials }}</span>
              </v-avatar>
              <div class="text-right mr-3 d-none d-sm-block">
                <div class="text-sm font-weight-medium mx-2 mb-0">{{ userDisplayName }}</div>
                <div class="text-muted text-xs d-flex align-center">
                  <v-icon :color="planColor" size="14" class="mr-1">{{ planIcon }}</v-icon>
                  <span>{{ planLabel }}</span>
                </div>
              </div>
            </div>
          </template>

          <v-card min-width="200" max-width="300">
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar size="40" color="primary">
                    <v-img v-if="userAvatar" :src="userAvatar" alt="User Avatar"></v-img>
                    <span v-else class="text-h6 text-white">{{ userInitials }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-sm font-weight-medium">
                  {{ userDisplayName }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-xs">
                  {{ userDisplayEmail }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list density="compact">
              <v-list-item
                prepend-icon="mdi-account-outline"
                :title="$t('dashboard.header.myProfile')"
                to="/dashboard/profile"
              ></v-list-item>
              <v-list-item
                v-if="!authStore.hasActiveSubscription"
                prepend-icon="mdi-crown"
                :title="$t('dashboard.header.upgradePremium')"
                to="/dashboard/billings"
              ></v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-logout" :title="$t('dashboard.header.signOut')" @click="logout"></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const router = useRouter()
const search = ref('')
const notificationsMenu = ref(false)
const userMenu = ref(false)

// Auth store
const authStore = useAuthStore()
const { userName, userEmail, userAvatar, hasActiveSubscription, subscriptionPlan } =
  storeToRefs(authStore)

const userDisplayName = computed(() => userName.value || 'User')
const userDisplayEmail = computed(() => userEmail.value || '')
const planLabel = computed(() =>
  hasActiveSubscription.value ? subscriptionPlan.value || 'Pro' : 'Free',
)
const planIcon = computed(() => (hasActiveSubscription.value ? 'mdi-crown' : 'mdi-account'))
const planColor = computed(() => (hasActiveSubscription.value ? 'amber-darken-2' : 'grey'))

const userInitials = computed(() => {
  const name = userDisplayName.value.trim()
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.charAt(0) || ''
  const second = parts[1]?.charAt(0) || ''
  return (first + second).toUpperCase() || first.toUpperCase() || 'U'
})

// Notifications
const notifications = ref([
  // {
  //   id: 1,
  //   title: 'New connection request',
  //   message: 'Jane Smith wants to connect with you',
  //   time: '5 minutes ago',
  //   read: false,
  //   icon: 'mdi-account-plus',
  //   color: 'primary',
  // },
  // {
  //   id: 2,
  //   title: 'Card viewed',
  //   message: 'Your business card was viewed 10 times today',
  //   time: '2 hours ago',
  //   read: false,
  //   icon: 'mdi-eye',
  //   color: 'info',
  // },
  // {
  //   id: 3,
  //   title: 'Premium trial ending',
  //   message: 'Your premium trial ends in 3 days',
  //   time: '1 day ago',
  //   read: true,
  //   icon: 'mdi-crown',
  //   color: 'warning',
  // },
])

const notificationCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true
  })
}

const viewAllNotifications = () => {
  notificationsMenu.value = false
  router.push('/dashboard/notifications')
}

const logout = async () => {
  try {
    await authStore.logout()
  } finally {
    router.push({ name: 'login' })
  }
}
</script>

<style scoped>
.dashboard-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.search-field {
  max-width: 300px;
}

.notification-item {
  border-left: 3px solid transparent;
  transition: background-color 0.2s ease;
}

.notification-item.unread {
  border-left-color: var(--v-theme-primary);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.notification-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
