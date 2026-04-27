<template>
  <div class="login-container py-3">
    <v-container fluid class="pa-0">
      <div class="d-block d-lg-flex align-start ga-lg-15">
        <v-btn class="text-sm font-weight-medium border margin-inline-start" style="text-transform: none"
          prepend-icon="mdi-arrow-left" to="/" color="white" variant="elevated">
          {{ $t('login.backToHome') }}
        </v-btn>
        <v-row class="my-5 my-lg-0">
          <v-col cols="12" lg="6" md="6" sm="12">
            <div class="d-flex align-center">
              <img style="mix-blend-mode: multiply; width: 100px !important;" alt="Ultra Technology" src="/logo.svg" />
              <div class="line-height-2">
                <h2 class="text-4xl font-weight-bold pa-0 gradient-title mb-0"
                  style="text-transform: none; line-height: 1.7;">
                  {{ $t('website.footer.brandName') }}
                </h2>
                <p class="text-md text-muted">{{ $t('website.footer.description') }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <v-container class="pa-0 mt-5">
      <v-row no-gutters class="min-h-screen" justify="center">
        <v-col class="mx-auto d-none d-lg-block" cols="12" lg="5" md="6" sm="12">
          <div class="mb-16">
            <h4 class="text-4xl font-weight-bold mb-7 line-height-2">
              {{ $t('login.hero.title') }} <span class="gradient-title">{{ $t('login.hero.titleHighlight') }}</span>
            </h4>
            <p class="text-muted text-lg">
              {{ $t('login.hero.subtitle') }}
            </p>
          </div>
          <video src="/auth-video.mp4" class="bg-transparent rounded-xl" style="width: 100%;" autoplay muted loop
            playsinline preload="auto"></video>
        </v-col>
        <v-col cols="11" lg="4" md="6" sm="11" align-self="start" class="mx-auto">
          <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
            <v-card class="glass-light pa-6 h-100 border" elevation="24" rounded="xl">
              <div class="text-center mb-4">
                <h2 class="text-2xl font-weight-bold">{{ $t('login.form.title') }}</h2>
                <p class="text-muted text-sm mb-6">
                  {{ $t('login.form.subtitle') }}
                </p>
              </div>
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="email">{{ $t('login.form.email.label')
                }}</v-label>
                <v-text-field v-model="email" id="email" :placeholder="$t('login.form.email.placeholder')"
                  prepend-inner-icon="mdi-email" variant="outlined" color="primary" :flat="false" rounded="lg"
                  type="email" class="mb-4" :rules="emailRules" required :disabled="loading"></v-text-field>
              </div>
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="password">{{ $t('login.form.password.label')
                }}
                </v-label>
                <v-text-field v-model="password" id="password" :placeholder="$t('login.form.password.placeholder')"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined" color="primary" :flat="false" rounded="lg" class="mb-4"
                  :type="showPassword ? 'text' : 'password'" :rules="passwordRules" required :disabled="loading"
                  @click:append-inner="showPassword = !showPassword"></v-text-field>
                <div class="text-end">
                  <router-link :to="{ name: 'forget-password' }"
                    class="text-primary text-decoration-none text-xs font-weight-medium">
                    {{ $t('login.form.forgetPassword') }}
                  </router-link>
                </div>
              </div>
              <div class="form-group d-flex align- justify-space-between">
                <v-checkbox v-model="rememberMe" :label="$t('login.form.rememberMe')" color="primary"
                  :disabled="loading">
                  <template v-slot:label>
                    <span class="text-xs text-muted">{{ $t('login.form.rememberMe') }}</span>
                  </template>
                </v-checkbox>
              </div>
              <v-btn type="submit" color="primary" variant="elevated" block class="text-sm font-weight-medium mb-6"
                style="text-transform: none" rounded="lg" :loading="loading" :disabled="loading || !isFormValid"
                @click="handleLogin">
                <span v-if="!loading">{{ $t('login.form.signIn') }}</span>
                <span v-else>{{ $t('login.form.signingIn') }}</span>
              </v-btn>

              <!-- Divider -->
              <div class="text-center mb-6">
                <span class="divider-text text-xs text-muted font-weight-bold">{{ $t('login.form.orContinueWith')
                }}</span>
              </div>

              <!-- Social Login Buttons -->
              <div class="d-flex justify-center gap-3 mb-6">
                <!-- <v-btn color="white" block class="text-sm border" style="text-transform: none" rounded="lg"
                  @click="loginWithGoogle">
                  <v-img src="https://developers.google.com/identity/images/g-logo.png" class="mx-2" width="14"></v-img>
                  <span class="text-black"> {{ $t('login.form.google') }} </span>
                </v-btn> -->


                <google-login-component />
              </div>

              <!-- Sign Up Link -->
              <div class="text-center">
                <span class="text-xs text-muted">{{ $t('login.form.noAccount') }} </span>
                <router-link to="/register" class="text-primary text-decoration-none text-xs font-weight-medium">
                  {{ $t('login.form.signUpFree') }}
                </router-link>
              </div>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formValidations } from '@/utils/validation'
import { useI18n } from '@/composables/useI18n'
import GoogleLoginComponent from '@/components/auth/GoogleLoginComponent.vue'

const features = computed(() => [
  {
    title: t('home.featuresData.freeDesign.title'),
    subtitle: t('home.featuresData.freeDesign.subtitle'),
    image: '/features/free-design.jpg',
  },
  {
    title: t('home.featuresData.globalReach.title'),
    subtitle: t('home.featuresData.globalReach.subtitle'),
    image: '/features/global-reach.jpg',
  },
])


const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)
const formRef = ref()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Form validation using centralized rules
const valid = ref(false)
const emailRules = formValidations.login.email
const passwordRules = formValidations.login.password

// Computed properties
const isFormValid = computed(() => {
  return email.value &&
    password.value &&
    /.+@.+\..+/.test(email.value) &&
    password.value.length >= 6
})

// Use loading state from auth store
const loading = computed(() => authStore.isLoading)

// Methods
const handleLogin = async () => {
  // Validate form first
  const { valid: isValid } = await formRef.value?.validate()
  if (!isValid) {
    return
  }

  try {
    const credentials = {
      email: email.value,
      password: password.value
    }

    // Use auth store login method
    await authStore.login(credentials, rememberMe.value)

    // Redirect to dashboard on success
    const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
    await router.push(redirectPath)

  } catch (error) {
    // Error handling is done in the auth store
    console.error('Login failed:', error)
  }
}

const loginWithGoogle = () => {
  // TODO: Implement Google OAuth
  console.log('Google login coming soon!')
}

const loginWithMicrosoft = () => {
  // TODO: Implement Microsoft OAuth
  console.log('Microsoft login coming soon!')
}
</script>
