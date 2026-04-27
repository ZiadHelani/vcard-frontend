<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, tm } = useI18n()

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
  phone: ''
})

// Form validation and states
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errors = ref({})

// Form validation rules
const rules = {
  name: [
    v => !!v || t('contact.form.validation.nameRequired'),
    v => (v && v.length >= 2) || t('contact.form.validation.nameMin')
  ],
  email: [
    v => !!v || t('contact.form.validation.emailRequired'),
    v => /.+@.+\..+/.test(v) || t('contact.form.validation.emailValid')
  ],
  subject: [
    v => !!v || t('contact.form.validation.subjectRequired'),
    v => (v && v.length >= 5) || t('contact.form.validation.subjectMin')
  ],
  message: [
    v => !!v || t('contact.form.validation.messageRequired'),
    v => (v && v.length >= 10) || t('contact.form.validation.messageMin')
  ]
}

// Contact information from translations
const contactInfo = computed(() => {
  try {
    const items = tm('contact.methods.items')
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }
    const icons = ['mdi-email', 'mdi-phone', 'mdi-map-marker']
    const colors = ['primary', 'success', 'warning']
    const actions = ['mailto:hello@ultratech.com', 'tel:+972503941341', 'https://maps.app.goo.gl/EDpCYE17RSc58vuh6']
    return items.map((item, index) => ({
      ...item,
      id: index + 1,
      icon: icons[index] || 'mdi-information',
      color: colors[index] || 'primary',
      action: actions[index] || '#'
    }))
  } catch (error) {
    console.error('Error loading contact info:', error)
    return []
  }
})

// FAQ data from translations
const faqs = computed(() => {
  try {
    const items = tm('contact.faq.items')
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }
    return items.map((item, index) => ({
      ...item,
      id: index + 1
    }))
  } catch (error) {
    console.error('Error loading FAQs:', error)
    return []
  }
})

// Form validation
const isFormValid = computed(() => {
  return form.name &&
    form.email &&
    /.+@.+\..+/.test(form.email) &&
    form.subject &&
    form.message &&
    form.name.length >= 2 &&
    form.subject.length >= 5 &&
    form.message.length >= 10
})

// Clear form
const clearForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  errors.value = {}
  isSubmitted.value = false
}

// Submit form
const submitForm = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errors.value = {}

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Success
    isSubmitted.value = true

    // Show success message and clear form after delay
    setTimeout(() => {
      clearForm()
    }, 3000)

  } catch (error) {
    errors.value = { general: 'Failed to send message. Please try again.' }
  } finally {
    isSubmitting.value = false
  }
}

// Handle contact action
const handleContactAction = (action) => {
  if (action.startsWith('mailto:') || action.startsWith('tel:') || action.startsWith('https:')) {
    window.open(action, '_blank')
  }
}
</script>

<template>
  <!-- Hero Section -->
  <v-container fluid class="hero-gradient">
    <v-row justify="center" class="">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="success" :text="$t('contact.hero.badge')">
          <template #prepend>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-mail w-4 h-4 mr-2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </template>
        </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('contact.hero.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('contact.hero.subtitle') }}
        </p>
        <div class="start-buttons d-flex align-center ga-5 justify-center">
          <v-btn prepend-icon="mdi-phone" color="white" class="font-weight-medium" style="text-transform: none"
            @click="handleContactAction('tel:+972503941341')">
            {{ $t('contact.hero.callUsNow') }}
          </v-btn>
        </div>
      </v-col>

      <!-- Response Time Stats -->
      <v-col cols="12" class="d-flex justify-center align-center flex-wrap ga-15 mb-10">
        <div class="stat-item text-center">
          <h2 class="text-2xl font-weight-bold text-primary mb-1">1 > Hr</h2>
          <p class="text-sm text-muted mb-0">{{ $t('contact.hero.stats.emailResponse') }}</p>
        </div>
        <div class="stat-item text-center">
          <h2 class="text-2xl font-weight-bold text-primary mb-1">24/7</h2>
          <p class="text-sm text-muted mb-0">{{ $t('contact.hero.stats.liveChatSupport') }}</p>
        </div>
        <div class="stat-item text-center">
          <h2 class="text-2xl font-weight-bold text-primary mb-1">99%</h2>
          <p class="text-sm text-muted mb-0">{{ $t('contact.hero.stats.satisfactionRate') }}</p>
        </div>
        <div class="stat-item text-center">
          <h2 class="text-2xl font-weight-bold text-primary mb-1">10+</h2>
          <p class="text-sm text-muted mb-0">{{ $t('contact.hero.stats.countriesServed') }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Contact Methods Section -->
  <v-container class="bg-mixed">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="info" :text="$t('contact.methods.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('contact.methods.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('contact.methods.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <!-- Contact Methods Grid -->
    <v-row justify="center" class="mb-16">
      <v-col v-for="contact in contactInfo" :key="contact.id" cols="12" sm="6" md="4" lg="3" class="mb-6">
        <v-card class="contact-card glass-light pa-6 h-100 border cursor-pointer" elevation="0" rounded="xl"
          @click="handleContactAction(contact.action)">
          <div class="text-center">
            <div class="contact-icon mb-4">
              <VChip :color="contact.color" size="large">
                <v-icon size="28" :color="contact.color">{{ contact.icon }}</v-icon>
              </VChip>
            </div>
            <h3 class="text-lg font-weight-bold mb-2">{{ contact.title }}</h3>
            <p dir="ltr" class="text-md font-weight-medium text-primary mb-2">{{ contact.value }}</p>
            <p class="text-sm text-muted">{{ contact.description }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Contact Form Section -->
  <v-container id="contact-section">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="primary" :text="$t('contact.form.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('contact.form.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('contact.form.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" lg="8" md="10">
        <v-card class="contact-form-card glass-light pa-8 border" elevation="0" rounded="xl">
          <v-form @submit.prevent="submitForm">
            <!-- Success Message -->
            <v-alert v-if="isSubmitted" type="success" variant="tonal" class="mb-6" prominent>
              <template #title>{{ $t('contact.form.success.title') }}</template>
              {{ $t('contact.form.success.message') }}
            </v-alert>

            <!-- Error Message -->
            <v-alert v-if="errors.general" type="error" variant="tonal" class="mb-6">
              {{ errors.general }}
            </v-alert>

            <v-row>
              <!-- Name Field -->
              <v-col cols="12" md="6">
                <v-text-field v-model="form.name" color="primary" :label="$t('contact.form.fields.name') + ' *'"
                  variant="outlined" :rules="rules.name" :disabled="isSubmitting" prepend-inner-icon="mdi-account"
                  class="mb-3" />
              </v-col>

              <!-- Email Field -->
              <v-col cols="12" md="6">
                <v-text-field v-model="form.email" :label="$t('contact.form.fields.email') + ' *'" color="primary"
                  type="email" variant="outlined" :rules="rules.email" :disabled="isSubmitting"
                  prepend-inner-icon="mdi-email" class="mb-3" />
              </v-col>

              <!-- Company Field -->
              <v-col cols="12" md="6">
                <v-text-field v-model="form.company" :label="$t('contact.form.fields.company')" color="primary"
                  variant="outlined" :disabled="isSubmitting" prepend-inner-icon="mdi-office-building" class="mb-3" />
              </v-col>

              <!-- Phone Field -->
              <v-col cols="12" md="6">
                <v-text-field v-model="form.phone" :label="$t('contact.form.fields.phone')" color="primary"
                  variant="outlined" :disabled="isSubmitting" prepend-inner-icon="mdi-phone" class="mb-3" />
              </v-col>

              <!-- Subject Field -->
              <v-col cols="12">
                <v-text-field v-model="form.subject" :label="$t('contact.form.fields.subject') + ' *'" color="primary"
                  variant="outlined" :rules="rules.subject" :disabled="isSubmitting" prepend-inner-icon="mdi-tag"
                  class="mb-3" />
              </v-col>

              <!-- Message Field -->
              <v-col cols="12">
                <v-textarea v-model="form.message" :label="$t('contact.form.fields.message') + ' *'" color="primary"
                  variant="outlined" :rules="rules.message" :disabled="isSubmitting"
                  prepend-inner-icon="mdi-message-text" rows="5" class="mb-6" />
              </v-col>

              <!-- Submit Button -->
              <v-col cols="12" class="text-center">
                <div class="d-flex ga-4 justify-center">
                  <v-btn type="submit" color="primary" variant="elevated" size="large" :loading="isSubmitting"
                    :disabled="!isFormValid || isSubmitting" class="text-sm font-weight-medium glow-btn px-8"
                    style="text-transform: none" prepend-icon="mdi-send">
                    {{ isSubmitting ? $t('contact.form.buttons.sending') : $t('contact.form.buttons.send') }}
                  </v-btn>

                  <v-btn variant="outlined" size="large" :disabled="isSubmitting"
                    class="text-sm font-weight-medium px-8" style="text-transform: none" @click="clearForm">
                    {{ $t('contact.form.buttons.clear') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- FAQ Section -->
  <v-container class="bg-mixed">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="warning" :text="$t('contact.faq.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('contact.faq.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('contact.faq.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" lg="8" md="10">
        <v-expansion-panels variant="accordion" class="faq-panels">
          <v-expansion-panel v-for="faq in faqs" :key="faq.id" class="glass-light border mb-4" rounded="xl">
            <v-expansion-panel-title class="text-lg font-weight-medium">
              {{ faq.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-muted">
              {{ faq.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>

  <!-- Call to Action Section -->
  <v-container class="py-10" fluid style="
      background-image: linear-gradient(
        to right,
        oklab(0.623083 -0.0332476 -0.185052 / 0.05) 0%,
        oklab(0.695873 -0.142158 0.0448781 / 0.05) 100%
      );
    ">
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="6" lg="5" class="text-center">
        <p class="text-sm mb-4">
          <span class="gradient-title">{{ $t('contact.cta.title') }}</span>
        </p>
        <p class="text-muted text-md mb-4">
          {{ $t('contact.cta.subtitle') }}
        </p>
      </v-col>
      <v-col cols="12">
        <div class="d-flex align-center ga-5 justify-center">
          <v-btn :to="{ name: 'register' }" append-icon="mdi-arrow-right" color="primary" variant="elevated"
            class="text-sm font-weight-medium glow-btn" style="text-transform: none">
            {{ $t('contact.cta.startFree') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.contact-card {
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.contact-form-card {
  transition: all 0.3s ease;
}

.faq-panels .v-expansion-panel {
  margin-bottom: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.contact-icon {
  transition: all 0.3s ease;
}

.contact-card:hover .contact-icon {
  transform: scale(1.1);
}
</style>
