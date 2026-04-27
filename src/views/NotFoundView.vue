<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const { t } = useI18n()

const goHome = () => {
  router.push({ name: 'home' })
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="not-found-page">
    <!-- Hero Section -->
    <v-container class="py-16">
      <v-row justify="center" align="center" class="min-height-screen">
        <v-col cols="12" lg="8" md="10" class="text-center">
          <!-- 404 Animation -->
          <div class="error-animation mb-8">
            <div class="error-number">
              <span class="gradient-title">4</span>
              <div class="floating-card">
                <v-card class="glass-light pa-4 border" elevation="0" rounded="xl">
                  <v-icon size="40" color="primary">mdi-card-account-details</v-icon>
                </v-card>
              </div>
              <span class="gradient-title">4</span>
            </div>
          </div>

          <!-- Error Message -->
          <v-chip class="mb-5" color="error" variant="elevated">
            {{ t('website.header.ultra') }}
          </v-chip>
          
          <h1 class="text-h2 font-weight-bold mb-4">
            <span class="gradient-title">Page Not Found</span>
          </h1>
          
          <p class="text-h6 text-muted mb-8 mx-auto" style="max-width: 600px;">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row justify-center align-center gap-4 mb-12">
            <v-btn
              @click="goHome"
              color="primary"
              size="large"
              variant="elevated"
              rounded="pill"
              class="px-8"
              prepend-icon="mdi-home"
            >
              Go to Homepage
            </v-btn>
            
            <v-btn
              @click="goBack"
              variant="outlined"
              size="large"
              rounded="pill"
              class="px-8"
              prepend-icon="mdi-arrow-left"
            >
              Go Back
            </v-btn>
          </div>

          <!-- Helpful Links -->
          <v-card class="glass-light pa-6 border mx-auto" elevation="0" rounded="xl" style="max-width: 500px;">
            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
              Popular Pages
            </h3>
            
            <v-row>
              <v-col cols="6" sm="3" class="text-center">
                <v-btn
                  :to="{ name: 'cards' }"
                  variant="text"
                  class="flex-column pa-4"
                  height="auto"
                  block
                >
                  <v-icon size="24" class="mb-2">mdi-card-multiple</v-icon>
                  <span class="text-caption">Cards</span>
                </v-btn>
              </v-col>
              
              <v-col cols="6" sm="3" class="text-center">
                <v-btn
                  :to="{ name: 'about' }"
                  variant="text"
                  class="flex-column pa-4"
                  height="auto"
                  block
                >
                  <v-icon size="24" class="mb-2">mdi-information</v-icon>
                  <span class="text-caption">About</span>
                </v-btn>
              </v-col>
              
              <v-col cols="6" sm="3" class="text-center">
                <v-btn
                  :to="{ name: 'contact' }"
                  variant="text"
                  class="flex-column pa-4"
                  height="auto"
                  block
                >
                  <v-icon size="24" class="mb-2">mdi-email</v-icon>
                  <span class="text-caption">Contact</span>
                </v-btn>
              </v-col>
              
              <v-col cols="6" sm="3" class="text-center">
                <v-btn
                  :to="{ name: 'login' }"
                  variant="text"
                  class="flex-column pa-4"
                  height="auto"
                  block
                >
                  <v-icon size="24" class="mb-2">mdi-login</v-icon>
                  <span class="text-caption">Login</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Background Elements -->
    <div class="background-elements">
      <div class="floating-element element-1">
        <v-icon size="20" color="primary" opacity="0.3">mdi-card-account-details</v-icon>
      </div>
      <div class="floating-element element-2">
        <v-icon size="16" color="secondary" opacity="0.2">mdi-qrcode</v-icon>
      </div>
      <div class="floating-element element-3">
        <v-icon size="18" color="info" opacity="0.25">mdi-share-variant</v-icon>
      </div>
      <div class="floating-element element-4">
        <v-icon size="14" color="success" opacity="0.2">mdi-account-circle</v-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.min-height-screen {
  min-height: 80vh;
}

.error-animation {
  position: relative;
  margin: 0 auto;
}

.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  gap: 1rem;
}

.floating-card {
  animation: float 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-element {
  position: absolute;
  animation: backgroundFloat 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.element-3 {
  top: 30%;
  right: 25%;
  animation-delay: 4s;
}

.element-4 {
  bottom: 30%;
  left: 20%;
  animation-delay: 1s;
}

@keyframes backgroundFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-15px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-5px);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .error-number {
    font-size: 5rem;
    gap: 0.5rem;
  }
  
  .floating-card {
    transform: scale(0.8);
  }
}

@media (max-width: 480px) {
  .error-number {
    font-size: 4rem;
  }
}

/* RTL Support */
[dir="rtl"] .error-number {
  direction: ltr; /* Keep 404 number in LTR */
}
</style>
