<template>
  <div class="login-container py-3">
    <v-container fluid class="pa-0 mb-5 mb-lg-0">
      <div class="d-block d-lg-flex align-start ga-lg-15">
        <v-btn class="text-sm font-weight-medium border margin-inline-start" style="text-transform: none"
          prepend-icon="mdi-arrow-left" to="/login" color="white" variant="elevated">
          {{ $t('auth.forgotPassword.backToLogin') }}
        </v-btn>
      </div>
    </v-container>

    <v-container class="pa-0 mt-5">
      <v-row no-gutters class="min-h-screen" justify="center">
        <v-col cols="11" lg="4" md="6" sm="11" align-self="start" class="mx-auto">
          <v-form ref="formRef" @submit.prevent="otpStep ? handleReset() : handleSubmit()">
            <v-card class="glass-light pa-6 h-100 border" elevation="24" rounded="xl">
              <div class="text-center mb-4">
                <h2 class="text-2xl font-weight-bold">
                  {{ $t('auth.forgotPassword.title') }}
                </h2>
                <p class="text-muted text-sm mb-6">
                  {{ $t('auth.forgotPassword.subtitle') }}
                </p>
              </div>

              <!-- Email -->
              <div class="form-group">
                <v-label class="text-xs text-black font-weight-bold" for="email">
                  {{ $t('auth.forgotPassword.email') }}
                </v-label>
                <v-text-field v-model="email" id="email" :placeholder="$t('auth.forgotPassword.email')"
                  prepend-inner-icon="mdi-email" variant="outlined" color="primary" :flat="false" rounded="lg"
                  type="email" class="mb-4" :rules="emailRules"
                  :disabled="authStore.isLoading || otpStep"></v-text-field>
              </div>

              <!-- Step 1: send OTP -->
              <template v-if="!otpStep">
                <v-btn type="submit" color="primary" variant="elevated" block class="text-sm font-weight-medium mb-4"
                  style="text-transform: none" rounded="lg" :loading="authStore.isLoading"
                  :disabled="authStore.isLoading || !email">
                  {{ $t('auth.forgotPassword.submit') }}
                </v-btn>
              </template>

              <!-- Step 2: enter OTP + new password -->
              <template v-else>
                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="otpCode">
                    {{ $t('auth.forgotPassword.otpCode') }}
                  </v-label>
                  <v-text-field v-model="otpCode" id="otpCode" :placeholder="$t('auth.forgotPassword.otpCode')"
                    prepend-inner-icon="mdi-shield-key-outline" variant="outlined" color="primary" :flat="false"
                    rounded="lg" type="tel" class="mb-4" :rules="validationRules.otp" maxlength="4"></v-text-field>
                </div>

                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="password">
                    {{ $t('register.form.password.label') }}
                  </v-label>
                  <v-text-field v-model="password" id="password" :placeholder="$t('register.form.password.placeholder')"
                    prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'" variant="outlined" color="primary" :flat="false"
                    rounded="lg" class="mb-4" :rules="validationRules.simplePassword"
                    @click:append-inner="showPassword = !showPassword"></v-text-field>
                </div>

                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="passwordConfirmation">
                    {{ $t('register.form.confirmPassword.label') }}
                  </v-label>
                  <v-text-field v-model="passwordConfirmation" id="passwordConfirmation"
                    :placeholder="$t('register.form.confirmPassword.placeholder')" prepend-inner-icon="mdi-lock-check"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showConfirmPassword ? 'text' : 'password'" variant="outlined" color="primary" :flat="false"
                    rounded="lg" class="mb-4" :rules="validationRules.passwordConfirmation(password)"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"></v-text-field>
                </div>

                <v-btn type="submit" color="primary" variant="elevated" block class="text-sm font-weight-medium mb-4"
                  style="text-transform: none" rounded="lg" :loading="authStore.isLoading"
                  :disabled="authStore.isLoading">
                  {{ $t('auth.forgotPassword.submit') }}
                </v-btn>
              </template>

              <div class="text-center">
                <router-link to="/login" class="text-primary text-decoration-none text-xs font-weight-medium">
                  {{ $t('auth.forgotPassword.backToLogin') }}
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
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { validationRules } from '@/utils/validation'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const emailRules = validationRules.email

const email = ref('')
const otpCode = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const otpStep = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formRef = ref(null)

const router = useRouter()

const handleSubmit = async () => {
  const response = await authStore.forgetPassword(email.value)
  if (response.success) {
    useToast().success(response.message)
    otpStep.value = true
  } else {
    useToast().error(response.message)
  }
}

const handleReset = async () => {

  const { valid } = await formRef.value.validate()

  if (!valid) {
    useToast().error('Please fill all fields correctly')
    return
  }

  const response = await authStore.resetPassword({
    email: email.value,
    otp_code: otpCode.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  })

  if (response.success) {
    useToast().success(response.message)
    router.replace('/login')
  } else {
    useToast().error(response.message)
  }
}
</script>
