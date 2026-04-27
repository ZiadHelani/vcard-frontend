<template>
  <div class="dashboard">
    <v-row>
      <SkeletonLoader v-if="dashboardStore.isLoading" lg="6" count="1" type="paragraph" />
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0" v-if="!dashboardStore.isLoading">
        <h1 class="text-3xl mb-0">{{ $t('dashboard.overview.welcomeBack', {
          name: authStore.currentUser?.name || 'User'
        }) }}</h1>
        <p class="text-muted text-sm">
          {{ $t('dashboard.overview.subtitle') }}
        </p>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0 text-end">
        <div class="d-flex align-center ga-3 justify-end h-100">
          <v-btn :to="{ name: 'dashboard.card-builder' }" size="small" color="primary" prepend-icon="mdi-plus">
            <span class="text-capitalize"> {{ $t('dashboard.cards.create') }} </span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Analytics Metric Cards -->
    <SkeletonLoader v-if="dashboardStore.isLoading" />
    <v-row class="mt-2" align="stretch" v-if="!dashboardStore.isLoading">
      <!-- Total Cards -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.overview.totalCards') }}</div>
              <div class="text-xl font-weight-bold">{{ data.cards_count }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="primary">
              <v-icon icon="mdi-credit-card-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Total Views -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.overview.totalViews') }}</div>
              <div class="text-xl font-weight-bold">{{ data.total_views_count }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="success">
              <v-icon icon="mdi-eye-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Contacts Gained -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.contacts.title') }}</div>
              <div class="text-xl font-weight-bold">{{ data.contacts_count }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="purple">
              <v-icon icon="mdi-account-multiple-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Shares -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.overview.shares') }}</div>
              <div class="text-xl font-weight-bold">{{ data.shares_count }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="error">
              <v-icon icon="mdi-share-variant"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- My Cards Here-->
    <v-row class="mt-6" align="start">
      <!-- My Cards -->
      <v-col cols="12" md="8" lg="8">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-xl mb-0">{{ $t('dashboard.cards.title') }}</h2>
          <v-btn :to="{ name: 'dashboard.card-builder' }" color="white" class="border" size="small"
            prepend-icon="mdi-plus">
            <span class="text-capitalize">{{ $t('dashboard.cards.create') }}</span>
          </v-btn>
        </div>

        <SkeletonLoader v-if="dashboardStore.isLoading" :count="2" lg="6" />
        <v-row v-if="!dashboardStore.isLoading">
          <v-col cols="12" md="6" v-for="card in data.cards" :key="card.id">
            <v-card elevation="0" border class="rounded-xl shadow-on-hover overflow-hidden">
              <div class="position-relative">
                <v-img :src="card.personal_details.cover_image || '/test.jpg'" height="225" cover></v-img>
                <v-img :src="card.personal_details.profile_image || '/user-placeholder.png'" width="80" height="80"
                  cover rounded="circle"
                  style="position: absolute; bottom: -35px; inset-inline-end: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"></v-img>
                <v-chip v-if="card.published" color="primary" variant="elevated" elevation="0" size="small"
                  class="position-absolute ma-3" style="top: 0; right: 0">
                  {{ $t('dashboard.cards.published') }}
                </v-chip>
                <v-chip v-if="!card.published" color="error" variant="elevated" elevation="0" size="small"
                  class="position-absolute ma-3" style="top: 0; right: 0">
                  {{ $t('dashboard.cards.unpublished') }}
                </v-chip>
              </div>

              <v-card-text class="pt-4 pb-2">
                <div class="text-md font-weight-medium">{{ card.name }}</div>
                <div class="text-xs text-muted">
                  <v-chip color="primary" size="small" class="text-capitalize">
                    {{ card.type }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text class="py-3">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center ga-4">
                    <div class="d-flex align-center ga-1 text-medium-emphasis">
                      <v-icon size="15" icon="mdi-eye-outline"></v-icon>
                      <span class="text-muted text-xs">{{ card.total_views }}</span>
                    </div>
                    <div class="d-flex align-center ga-1 text-medium-emphasis">
                      <v-icon size="15" icon="mdi-account-multiple-outline"></v-icon>
                      <span class="text-muted text-xs">{{ card.total_saves }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-btn @click="showQRCode(card.qrcode)" color="dark" size="x-small" variant="text"
                      icon="mdi-qrcode"></v-btn>
                    <!-- put link from .env -->
                    <v-btn @click="viewCard(card.slug)" color="dark" size="x-small" variant="text"
                      icon="mdi-open-in-new"></v-btn>
                    <v-btn @click="cardStore.copyCardUrl(card)" color="dark" size="x-small" variant="text"
                      icon="mdi-share-variant"></v-btn>
                    <v-btn :to="{ name: 'dashboard.card-builder.edit', params: { slug: card.slug } }" color="dark"
                      size="x-small" variant="text" icon="mdi-pencil"></v-btn>
                  </div>
                </div>
                <div class="text-xs text-muted mt-3">{{ card.updated_at }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4" lg="4">
        <v-row>
          <SkeletonLoader v-if="dashboardStore.isLoading" :count="1" lg="12" />
          <!--          <v-col cols="12" v-if="!dashboardStore.isLoading">-->
          <!--            <h2 class="text-xl mb-4">{{ $t('dashboard.activity.title') }}</h2>-->
          <!--            <v-card elevation="0" border class="rounded-xl">-->
          <!--              <v-card-text class="pb-0">-->
          <!--                <div class="text-md font-weight-medium mb-1">{{ $t('dashboard.activity.feedTitle') }}</div>-->
          <!--                <div class="text-sm text-muted mb-4">{{ $t('dashboard.activity.feedSubtitle') }}</div>-->
          <!--              </v-card-text>-->
          <!--              <v-divider></v-divider>-->
          <!--              <v-list lines="two" density="comfortable">-->
          <!--                <v-list-item v-for="activity in data.activities" :key="activity.id">-->
          <!--                  <template #prepend>-->
          <!--                    <v-icon :color="activity.activity_type" size="10">mdi-checkbox-blank-circle</v-icon>-->
          <!--                  </template>-->
          <!--                  <v-list-item-title class="text-sm">{{ activity.activity }}</v-list-item-title>-->
          <!--                  <v-list-item-subtitle class="text-xs">{{ activity.created_at }}</v-list-item-subtitle>-->
          <!--                </v-list-item>-->
          <!--              </v-list>-->
          <!--            </v-card>-->
          <!--          </v-col>-->
          <v-col cols="12">
            <v-card elevation="0" border class="rounded-xl">
              <v-card-text class="pb-0">
                <div class="text-md font-weight-medium mb-3">{{ $t('dashboard.quick.title') }}</div>
              </v-card-text>
              <v-divider></v-divider>
              <div class="quick-actions pa-5 d-flex flex-column ga-3">
                <v-btn :to="{ name: 'dashboard.card-builder' }" width="80" rounded="lg" block size="small"
                  prepend-icon="mdi-plus" color="white" class="border">
                  <span class="text-capitalize"> {{ $t('dashboard.cards.create') }} </span>
                </v-btn>
                <v-btn :to="{ name: 'dashboard.contacts' }" width="80" rounded="lg" block size="small"
                  prepend-icon="mdi-account-multiple-outline" color="white" class="border">
                  <span class="text-capitalize"> {{ $t('dashboard.contacts.manage') }} </span>
                </v-btn>
                <!-- <v-btn :to="{ name: 'dashboard.billings' }" width="80" rounded="lg" block size="small"
                  prepend-icon="mdi-crown" color="white" class="border">
                  <span class="text-capitalize"> {{ $t('dashboard.billing.upgrade') }} </span>
                </v-btn> -->
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-dialog v-model="showQrDialog" max-width="400">
      <v-card class="rounded-lg">
        <v-card-text>
          <v-img width="100%" :src="qrCodeUrl" contain></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import useDashboardStore from '@/stores/dashboard.js'
import { onMounted, ref } from 'vue'
import SkeletonLoader from '@/components/Dashboard/Loading/SkeletonLoader.vue'
import { useCardStore } from '@/stores/card'


const baseUrl = import.meta.env.VITE_CSRF_BASE_URL
const viewCard = (slug) => {
  window.open(`${baseUrl}/cards/${slug}`, '_blank')
}
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const cardStore = useCardStore()
const data = ref({
  cards_count: 0,
  total_views_count: 0,
  contacts_count: 0,
  shares_count: 0,
  cards: [],
  activities: [],
})
const showQrDialog = ref(false)
const qrCodeUrl = ref('')
onMounted(async () => {
  data.value = await dashboardStore.getDashboardData()
})

function showQRCode(cardQrcodeUrl) {
  qrCodeUrl.value = cardQrcodeUrl
  showQrDialog.value = true
}
</script>
