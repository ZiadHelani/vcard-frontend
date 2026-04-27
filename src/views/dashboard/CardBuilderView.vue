<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CardPreview from '@/components/Dashboard/CardPreview.vue'
import CardDetailsForm from '@/components/Dashboard/Builder/CardDetailsForm.vue'
import PersonalDetailsForm from '@/components/Dashboard/Builder/PersonalDetailsForm.vue'
import FaqsForm from '@/components/Dashboard/Builder/FaqsForm.vue'
import ButtonsForm from '@/components/Dashboard/Builder/ButtonsForm.vue'
import ReviewsForm from '@/components/Dashboard/Builder/ReviewsForm.vue'
import { useConfigStore } from '@/stores/config.js'
import GalleryForm from '@/components/Dashboard/Builder/GalleryForm.vue'
import { useCardStore } from '@/stores/card.js'
import FreeCardPreview from '@/components/Dashboard/FreeCardPreview.vue'
import useAuthStore from '@/stores/auth.js'
import auth from '@/stores/auth.js'
import { MotionComponent } from '@vueuse/motion'

const device = ref('desktop')

const setDevice = (val) => (device.value = val)
const activeTab = ref(0)

const configStore = useConfigStore()
const cardStore = useCardStore()
const authStore = useAuthStore()

// Validation computed properties
const isCardValid = computed(() => cardStore.isCardValid)
const validationErrors = computed(() => cardStore.validationErrors)
const route = useRoute()
const isEditing = computed(() => Boolean(route.params.slug))
const isCreating = computed(() => cardStore.isCreating)
const isUpdating = computed(() => cardStore.isUpdating)
const isSaving = computed(() => (isEditing.value ? isUpdating.value : isCreating.value))
const card = computed(() => cardStore.card)

// Handle save with validation feedback
const handleSave = async () => {
  try {
    if (isEditing.value) {
      await cardStore.updateCard(route.params.slug)
    } else {
      await cardStore.storeCard()
    }
  } catch (error) {
    // Error is already handled in the store
    console.error('Card save failed:', error)
  }
}

onMounted(async () => {
  configStore.rail = true
  cardStore.resetCard()
  if (isEditing.value && route.params.slug) {
    try {
      await cardStore.loadCard(route.params.slug)
    } catch (e) {
      // handled in store
    }
  }
})
</script>

<template>
  <div class="card-builder">
    <div class="d-flex align-center ga-2">
      <v-switch color="primary" :disabled="!authStore.hasActiveSubscription" v-model="cardStore.card.pro_mode"
        :label="cardStore.card.pro_mode ? $t('dashboard.builder.proMode') : $t('dashboard.builder.freeMode')"
        hide-details inset></v-switch>
      <!-- <MotionComponent :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 1, ease: 'easeOut' }">
        <router-link v-if="!authStore.hasActiveSubscription"
          class="text-sm text-primary font-weight-medium text-decoration-none" :to="{ name: 'dashboard.billings' }">{{
            $t('dashboard.builder.subscribeNow') }}
        </router-link>
      </MotionComponent> -->
    </div>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="12" md="4" lg="4" class="mb-6 px-0">
        <div class="d-flex justify-center my-8" v-if="cardStore.isLoading">
          <v-progress-circular indeterminate color="primary" size="40" />
        </div>
        <v-card v-else class="glass-light pa-4 border builder-sidebar" elevation="0" rounded="xl">
          <div class="d-flex align-center justify-space-between mb-1">
            <div>
              <h2 class="text-xl font-weight-bold mb-0 gradient-title">{{ $t('dashboard.builder.title') }}</h2>
              <div class="text-sm text-muted">{{ $t('dashboard.builder.subtitle') }}</div>
            </div>
            <v-btn @click="handleSave" icon variant="outlined" size="small" class="border"
              :color="isCardValid ? 'success' : 'warning'" :loading="isSaving" :disabled="isSaving"
              :aria-label="$t('dashboard.builder.saveAria')">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </div>

          <!-- Validation Alert -->
          <v-alert v-if="!isCardValid" type="warning" variant="tonal" class="mb-3" density="compact">
            <template #title>
              <span class="text-sm font-weight-medium">{{ $t('dashboard.builder.validation.title') }}</span>
            </template>
            <div class="text-xs">
              <div v-if="validationErrors.card_name">{{ $t('dashboard.builder.validation.cardName') }}</div>
              <div v-if="validationErrors.card_type">{{ $t('dashboard.builder.validation.cardType') }}</div>
              <div v-if="validationErrors.personal_name">{{ $t('dashboard.builder.validation.personalName') }}</div>
              <div v-if="validationErrors.phone">{{ $t('dashboard.builder.validation.phone') }}</div>
            </div>
          </v-alert>

          <v-tabs v-model="activeTab" color="primary" density="compact" class="mb-4">
            <v-tab size="small" :value="0">
              <div class="d-flex align-center ga-1">
                <span>{{ $t('dashboard.builder.tabs.cardDetails') }}</span>
                <v-icon v-if="validationErrors.card_name || validationErrors.card_type" size="12" color="warning">
                  mdi-alert-circle
                </v-icon>
              </div>
            </v-tab>
            <v-tab size="small" :value="1">
              <div class="d-flex align-center ga-1">
                <span>{{ $t('dashboard.builder.tabs.personalDetails') }}</span>
                <v-icon v-if="validationErrors.personal_name || validationErrors.phone" size="12" color="warning">
                  mdi-alert-circle
                </v-icon>
              </div>
            </v-tab>
            <v-tab size="small" :value="4">{{ $t('dashboard.builder.tabs.buttons') }}</v-tab>
            <v-tab :disabled="!authStore.hasActiveSubscription || !cardStore.card.pro_mode" size="small" :value="2">{{
              $t('dashboard.builder.tabs.faqs') }}</v-tab>
            <v-tab :disabled="!authStore.hasActiveSubscription || !cardStore.card.pro_mode" size="small" :value="3">{{
              $t('dashboard.builder.tabs.gallery') }}</v-tab>
            <v-tab :disabled="!authStore.hasActiveSubscription || !cardStore.card.pro_mode" size="small" :value="5">{{
              $t('dashboard.builder.tabs.reviews') }}</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mb-7">
            <v-window-item :value="0">
              <CardDetailsForm />
            </v-window-item>

            <v-window-item :value="1">
              <PersonalDetailsForm />
            </v-window-item>

            <v-window-item :value="2">
              <FaqsForm />
            </v-window-item>

            <v-window-item :value="3">
              <GalleryForm />
            </v-window-item>

            <v-window-item :value="4">
              <ButtonsForm />
            </v-window-item>

            <v-window-item :value="5">
              <ReviewsForm />
            </v-window-item>
          </v-window>
          <v-divider color="primary" thickness="10" class="mb-3"></v-divider>
        </v-card>
      </v-col>

      <!-- Preview Area -->
      <v-col cols="12" md="8" :lg="device === 'mobile' ? 4 : 8" class="mb-6">
        <v-card class="glass-light pa-4 border px-0 pt-0" elevation="0" rounded="xl">
          <div class="d-flex align-center justify-space-between px-4 py-3">
            <h3 class="text-md font-weight-medium mb-0">{{ $t('dashboard.builder.preview.title') }}</h3>
            <div class="d-flex ga-2">
              <v-btn :variant="device === 'mobile' ? 'elevated' : 'outlined'" color="primary" size="small"
                @click="setDevice('mobile')">
                <v-icon start>mdi-cellphone</v-icon>
                <span class="text-capitalize">{{ $t('dashboard.builder.preview.mobile') }}</span>
              </v-btn>
              <v-btn :variant="device === 'desktop' ? 'elevated' : 'outlined'" color="primary" size="small"
                @click="setDevice('desktop')">
                <v-icon start>mdi-monitor</v-icon>
                <span class="text-capitalize">{{ $t('dashboard.builder.preview.desktop') }}</span>
              </v-btn>
            </div>
          </div>

          <v-divider class="my-0"></v-divider>

          <div class="builder-canvas">
            <div class="d-flex justify-center my-8" v-if="cardStore.isLoading">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
            <div v-else>
              <CardPreview v-if="cardStore.card.pro_mode && authStore.hasActiveSubscription" />
              <FreeCardPreview v-if="!cardStore.card.pro_mode" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.builder-sidebar {
  position: sticky;
  height: 85vh;
  overflow-y: scroll;
  top: 2px;
}

.builder-field {
  margin-bottom: 12px;
}

.builder-field .label {
  font-size: 0.8rem;
  color: #6b7280;
}

.builder-field .value {
  font-weight: 500;
}

.device-frame.mobile {
  width: 390px;
}

.device-frame.desktop {
  width: 720px;
}

@media (max-width: 600px) {
  .device-frame.mobile {
    width: 100%;
  }
}

.v-slide-group {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 15px;
}
</style>
