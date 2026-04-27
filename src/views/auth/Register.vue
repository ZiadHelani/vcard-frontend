<template>
  <div class="login-container py-3">
    <v-container fluid class="pa-0 mb-5 mb-lg-0">
      <div class="d-block d-lg-flex align-start ga-lg-15">
        <v-btn class="text-sm font-weight-medium border margin-inline-start" style="text-transform: none"
          prepend-icon="mdi-arrow-left" to="/" color="white" variant="elevated">
          {{ $t('register.backToHome') }}
        </v-btn>
      </div>
    </v-container>
    <v-container class="pa-0 mt-5">
      <v-row no-gutters class="min-h-screen" justify="center">
        <v-col cols="11" lg="4" md="6" sm="11" align-self="start" class="mx-auto">
          <v-form @submit.prevent="handleRegister">
            <v-card class="glass-light pa-6 h-100 border" elevation="24" rounded="xl">
              <div class="text-center mb-4">
                <h2 class="text-2xl font-weight-bold">{{ $t('register.form.title') }}</h2>
                <p class="text-muted text-sm mb-6">
                  {{ $t('register.form.subtitle') }}
                </p>
              </div>

              <!-- Name Field -->
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="name">{{ $t('register.form.name.label') }}
                </v-label>
                <v-text-field v-model="name" id="name" :placeholder="$t('register.form.name.placeholder')"
                  prepend-inner-icon="mdi-account" variant="outlined" color="primary" :flat="false" rounded="lg"
                  type="text" class="mb-4" :rules="nameRules"></v-text-field>
              </div>

              <!-- Email Field -->
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="email">{{ $t('register.form.email.label') }}
                </v-label>
                <v-text-field v-model="email" id="email" :placeholder="$t('register.form.email.placeholder')"
                  prepend-inner-icon="mdi-email" variant="outlined" color="primary" :flat="false" rounded="lg"
                  type="email" class="mb-4" :rules="emailRules"></v-text-field>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="password">
                  {{ $t('register.form.password.label') }}
                </v-label>
                <v-text-field v-model="password" id="password" :placeholder="$t('register.form.password.placeholder')"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'" variant="outlined" color="primary" :flat="false"
                  rounded="lg" class="mb-4" :rules="passwordRules"
                  @click:append-inner="showPassword = !showPassword"></v-text-field>
              </div>

              <!-- Confirm Password Field -->
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="confirmPassword">
                  {{ $t('register.form.confirmPassword.label') }}
                </v-label>
                <v-text-field v-model="confirmPassword" id="confirmPassword"
                  :placeholder="$t('register.form.confirmPassword.placeholder')" prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showConfirmPassword ? 'text' : 'password'" variant="outlined" color="primary" :flat="false"
                  rounded="lg" class="mb-4" :rules="confirmPasswordRules"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"></v-text-field>
              </div>

              <!-- Terms and Privacy Policy Checkbox -->
              <div class="form-group">
                <v-checkbox v-model="agreeToTerms" color="primary" :rules="termsRules">
                  <template v-slot:label>
                    <span class="text-xs text-muted">
                      {{ $t('register.form.agreeToTerms') }}
                      <a href="/terms" class="text-primary text-decoration-none font-weight-medium" target="_blank">
                        {{ $t('register.form.termsOfService') }}
                      </a>
                      {{ $t('register.form.and') }}
                      <a href="/privacy" class="text-primary text-decoration-none font-weight-medium" target="_blank">
                        {{ $t('register.form.privacyPolicy') }}
                      </a>
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <v-btn type="submit" color="primary" variant="elevated" block class="text-sm font-weight-medium mb-6"
                style="text-transform: none" rounded="lg" :loading="loading" :disabled="!isFormValid">
                {{ $t('register.form.createAccount') }}
              </v-btn>

              <!-- Divider -->
              <div class="text-center mb-6">
                <span class="divider-text text-xs text-muted font-weight-bold">{{
                  $t('register.form.orContinueWith')
                  }}</span>
              </div>

              <!-- Social Login Buttons -->
              <div class="d-flex gap-3 mb-6">
                <v-btn color="white" block class="text-sm border" style="text-transform: none" rounded="lg"
                  @click="registerWithGoogle">
                  <v-img src="https://developers.google.com/identity/images/g-logo.png" class="mx-2" width="14"></v-img>
                  <span class="text-black">{{ $t('register.form.google') }}</span>
                </v-btn>
              </div>

              <!-- Sign In Link -->
              <div class="text-center">
                <span class="text-xs text-muted">{{ $t('register.form.haveAccount') }} </span>
                <router-link to="/login" class="text-primary text-decoration-none text-xs font-weight-medium">
                  {{ $t('register.form.signIn') }}
                </router-link>
              </div>
            </v-card>
          </v-form>
        </v-col>
        <v-col class="mx-auto d-none d-lg-block" cols="12" lg="5" md="6" sm="12">
          <div class="d-flex align-center mb-6">
            <img style="mix-blend-mode: multiply; width: 100px" alt="ultratech" class="logo" src="/logo.svg" />
            <div class="line-height-2">
              <h2 class="text-4xl font-weight-bold pa-0 gradient-title mb-0"
                style="text-transform: none; line-height: 1.7;">
                {{ $t('website.footer.brandName') }}
              </h2>
              <p class="text-md text-muted">{{ $t('website.footer.description') }}</p>
            </div>
          </div>
          <div class="mb-6">
            <h4 class="text-4xl font-weight-bold mb-7 line-height-2">
              {{ $t('register.hero.title') }}
              <span class="gradient-title">{{ $t('register.hero.titleHighlight') }}</span>
              {{ $t('register.hero.titleSuffix') }}
            </h4>
            <p class="text-muted text-lg">
              {{ $t('register.hero.subtitle') }}
            </p>
          </div>

          <video src="/auth-video.mp4" class="bg-transparent rounded-xl" style="width: 100%;" autoplay muted loop
            playsinline preload="auto"></video>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import useAuthStore from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()

const authStore = useAuthStore()

// Form data
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

// Validation rules
const nameRules = [
  (v: string) => !!v || t('register.validation.nameRequired'),
  (v: string) => v.length >= 2 || t('register.validation.nameMin'),
]

const emailRules = [
  (v: string) => !!v || t('register.validation.emailRequired'),
  (v: string) => /.+@.+\..+/.test(v) || t('register.validation.emailInvalid'),
]

const passwordRules = [
  (v: string) => !!v || t('register.validation.passwordRequired'),
  (v: string) => v.length >= 8 || t('register.validation.passwordMin'),
]

const confirmPasswordRules = [
  (v: string) => !!v || t('register.validation.confirmPasswordRequired'),
  (v: string) => v === password.value || t('register.validation.passwordsNoMatch'),
]

const termsRules = [(v: boolean) => !!v || t('register.validation.termsRequired')]

// Form validation
const isFormValid = computed(() => {
  return (
    name.value.length >= 2 &&
    /.+@.+\..+/.test(email.value) &&
    password.value.length >= 8 &&
    confirmPassword.value === password.value &&
    agreeToTerms.value
  )
})

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })


    router.replace('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
  } finally {
    loading.value = false
  }
}

const registerWithGoogle = () => {
  // TODO: Implement Google OAuth registration
  console.log('Register with Google')
}
</script>
