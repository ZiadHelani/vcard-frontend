<script setup>
import { ref, computed } from 'vue'
import { useSupportStore } from '@/stores/support'
import { useI18n } from '@/composables/useI18n'

const supportStore = useSupportStore()
const { t, tm } = useI18n()


const subjectRef = ref(null)
const messageRef = ref(null)

// Computed properties
const isFormValid = computed(() => supportStore.isFormValid)
const isSubmitting = computed(() => supportStore.isSubmitting)
const isSubmitted = computed(() => supportStore.isSubmitted)
const validationErrors = computed(() => supportStore.validationErrors)


const handleSubjectChange = (value) => {
  supportStore.updateFormField('subject', value)
}

const handleMessageChange = (value) => {
  supportStore.updateFormField('message', value)
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    await supportStore.submitSupport()
  } catch (error) {
    console.error('Support submission failed:', error)
  }
}

// Reset form when component unmounts
const resetForm = () => {
  supportStore.resetForm()
}
</script>

<template>
  <div class="support">
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0">
        <h1 class="text-3xl gradient-title mb-0">{{ $t('dashboard.support.title') }}</h1>
        <p class="text-muted text-sm">{{ $t('dashboard.support.subtitle') }}</p>
      </v-col>
    </v-row>

    <!-- Support Cards -->
    <v-row class="mt-2" justify="start">
      <!-- Knowledge Base -->
      <v-col cols="12" md="6" lg="5" class="mb-6">
        <v-card class="glass-light shadow-on-hover float-on-hover pa-6 border" elevation="0" rounded="xl">
          <div class="d-flex align-center ga-1 mb-4">
            <span>
              📚
            </span>
            <h2 class="text-lg font-weight-medium mb-0">{{ $t('dashboard.support.knowledgeBase.title') }}</h2>
          </div>

          <v-list>
            <v-list-item v-for="(article, idx) in tm('dashboard.support.knowledgeBase.articles')" :key="idx">
              <template #title>
                <span class="text-sm">{{ article }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Contact Support -->
      <v-col cols="12" md="6" lg="5" class="mb-6">
        <v-card class="glass-light shadow-on-hover float-on-hover pa-6 border" elevation="0" rounded="xl">
          <div class="d-flex align-center ga-1 mb-4">
            <span>
              💬
            </span>
            <h2 class="text-lg font-weight-medium mb-0">{{ $t('dashboard.support.contact.title') }}</h2>
          </div>

          <!-- Success Message -->
          <v-alert
            v-if="isSubmitted"
            type="success"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="supportStore.clearSuccessState()"
          >
            <template #title>
              <span class="text-sm font-weight-medium">{{ $t('dashboard.support.contact.successTitle') }}</span>
            </template>
            <span class="text-sm">{{ $t('dashboard.support.contact.successBody') }}</span>
          </v-alert>

          <!-- Support Form -->
          <v-form v-if="!isSubmitted" @submit.prevent="handleSubmit">
            <label for="subject" class="mb-3 text-sm">{{ $t('dashboard.support.contact.subjectLabel') }} *</label>
            <v-text-field
              ref="subjectRef"
              :model-value="supportStore.form.subject"
              @update:model-value="handleSubjectChange"
              color="primary"
              id="subject"
              :placeholder="$t('dashboard.support.contact.subjectPlaceholder')"
              :error-messages="validationErrors.subject"
              :disabled="isSubmitting"
              class="mb-4"
              rounded="lg"
              required
            ></v-text-field>

            <label for="message" class="mb-3 text-sm">{{ $t('dashboard.support.contact.messageLabel') }} *</label>
            <v-textarea
              ref="messageRef"
              :model-value="supportStore.form.message"
              @update:model-value="handleMessageChange"
              color="primary"
              id="message"
              :placeholder="$t('dashboard.support.contact.messagePlaceholder')"
              auto-grow
              rows="3"
              :error-messages="validationErrors.message"
              :disabled="isSubmitting"
              class="mb-4"
              rounded="lg"
              required
            ></v-textarea>

            <div class="d-flex ga-3">
              <v-btn
                type="submit"
                color="primary"
                :loading="isSubmitting"
                :disabled="!isFormValid || isSubmitting"
                class="text-sm font-weight-medium px-6"
                style="text-transform:none"
              >
                {{ $t('dashboard.support.contact.send') }}
              </v-btn>

              <v-btn
                v-if="supportStore.hasFormData"
                variant="outlined"
                color="grey"
                :disabled="isSubmitting"
                @click="resetForm"
                class="text-sm font-weight-medium px-4"
                style="text-transform:none"
              >
                {{ $t('dashboard.support.contact.clear') }}
              </v-btn>
            </div>
          </v-form>

          <!-- Show Another Message Button -->
          <div v-if="isSubmitted" class="mt-4">
            <v-btn
              variant="outlined"
              color="primary"
              @click="supportStore.clearSuccessState()"
              class="text-sm font-weight-medium px-6"
              style="text-transform:none"
            >
              {{ $t('dashboard.support.contact.sendAnother') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
