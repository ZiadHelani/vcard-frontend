<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t, tm } = useI18n()

// Mobile detection for responsive video
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 960 // Vuetify's md breakpoint
}

const videoSource = computed(() => {
  return isMobile.value ? '/home-banner-mobile.mp4' : '/home-banner.mp4'
})

// Handle hash navigation for smooth scrolling
const scrollToHashSection = () => {
  if (route.hash) {
    nextTick(() => {
      const sectionId = route.hash.replace('#', '')
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 100) // Small delay to ensure page is fully rendered
      }
    })
  }
}

// Testimonials data from translations
const testimonials = computed(() => {
  try {
    const items = tm('home.testimonials.items')
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }
    return items
  } catch (error) {
    console.error('Error loading testimonials:', error)
    return []
  }
})

onMounted(() => {
  checkMobile() // Check initial screen size
  window.addEventListener('resize', checkMobile)
  scrollToHashSection() // Handle hash navigation on page load
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const counters = computed(() => [
  {
    title: '1K',
    subtitle: t('home.counters.happyActiveUser'),
  },
  {
    title: '1,1K',
    subtitle: t('home.counters.cardsCreated'),
  },
  {
    title: '7K',
    subtitle: t('home.counters.connectionsMade'),
  },
])

// Testimonial data for 3D avatar sliders
const testimonialData = computed(() => [
  {
    name: t('home.testimonialData.fredWill.name'),
    text: t('home.testimonialData.fredWill.text'),
    image: '/reviews/1.png',
  },
  {
    name: t('home.testimonialData.faresSalim.name'),
    text: t('home.testimonialData.faresSalim.text'),
    image: '/reviews/2.png',
  },
  {
    name: t('home.testimonialData.sarahJamil.name'),
    text: t('home.testimonialData.sarahJamil.text'),
    image: '/reviews/3.png',
  },
  {
    name: t('home.testimonialData.tamimYounis.name'),
    text: t('home.testimonialData.tamimYounis.text'),
    image: '/reviews/4.png',
  },
  {
    name: t('home.testimonialData.ibrahimPr.name'),
    text: t('home.testimonialData.ibrahimPr.text'),
    image: '/reviews/5.png',
  },
  {
    name: t('home.testimonialData.mayaChen.name'),
    text: t('home.testimonialData.mayaChen.text'),
    image: '/reviews/4.png',
  },
])

// Reversed testimonial data for bottom slider
const testimonialDataReversed = computed(() => {
  return [...testimonialData.value].reverse()
})
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
  {
    title: t('home.featuresData.mobileFirstDesign.title'),
    subtitle: t('home.featuresData.mobileFirstDesign.subtitle'),
    image: '/features/mobile-design.jpg',
  },
  {
    title: t('home.featuresData.smartQrCodes.title'),
    subtitle: t('home.featuresData.smartQrCodes.subtitle'),
    image: '/features/qr-code.jpg',
  },
])

// Pricing plans data from translations
const pricingPlans = computed(() => [
  {
    id: 'free',
    name: t('home.pricing.free.name'),
    price: t('home.pricing.free.price'),
    description: t('home.pricing.free.description'),
    features: tm('home.pricing.free.features'),
    buttonColor: 'black',
    buttonText: t('home.cta.joinNow'),
    video: '/pricing/free.mp4',
    isPopular: false,
    hasGlow: false,
    isContact: false
  },
  {
    id: 'pro',
    name: t('home.pricing.pro.name'),
    price: t('home.pricing.pro.price'),
    description: t('home.pricing.pro.description'),
    features: tm('home.pricing.pro.features'),
    buttonColor: 'primary',
    buttonText: t('home.cta.joinNow'),
    video: '/pricing/biss.mp4',
    isPopular: true,
    hasGlow: true,
    isContact: false
  },
  {
    id: 'business',
    name: t('home.pricing.business.name'),
    price: t('home.pricing.business.price'),
    description: t('home.pricing.business.description'),
    features: tm('home.pricing.business.features'),
    buttonColor: 'warning',
    buttonText: t('home.cta.joinNow'),
    video: '/pricing/pro.mp4',
    isPopular: false,
    hasGlow: false,
    isContact: false
  },
  // {
  //   id: 'enterprise',
  //   name: t('home.pricing.enterprise.name'),
  //   price: t('home.pricing.enterprise.price'),
  //   description: t('home.pricing.enterprise.description'),
  //   features: tm('home.pricing.enterprise.features'),
  //   buttonColor: 'warning',
  //   buttonText: t('website.header.nav.contact'),
  //   video: '/pricing/4.mp4',
  //   isPopular: false,
  //   hasGlow: false,
  //   isContact: true
  // },
])
</script>

<template>
  <v-container fluid class="px-0 py-0 position-relative" style="height: calc(100vh - 45px)">
    <video :src="videoSource" style="width: 100%; height: 100%; object-fit: fill" autoplay muted loop playsinline
      preload="auto"></video>
    <div class="h-full text-center line-height-1" style="
        z-index: 99 !important;
        top: 15%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -15%);
        width: 95%;
      ">
      <p class="text-5xl font-weight-bold mb-4">
        {{ $t('home.hero.videoSection.title') }}
      </p>
      <p class="text-lg font-weight-bold mb-4">
        {{ $t('home.hero.videoSection.subtitle') }}
      </p>
      <p class="text-lg font-weight-bold text-white mb-4">
        {{ $t('home.hero.videoSection.tagline') }}
      </p>
    </div>
  </v-container>
  <v-container>
    <v-row justify="space-between" class="mt-2">
      <v-col cols="12" md="12" lg="4" class="align-self-center">
        <div class="d-flex align-center ga-4">
          <div class="" style="background-color: #eee7fa; padding: 12px; border-radius: 50%">
            <v-icon color="black">mdi-checkbox-blank-circle-outline</v-icon>
          </div>
          <p class="text-xl font-weight-bold mb-4">
            <span>{{ $t('home.cta.title') }}</span>
            <router-link :to="{ name: 'register' }" class="text-decoration-none">
              {{ $t('home.cta.joinNow') }}
            </router-link>
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="8" lg="8" class="text-center">
        <div class="counters d-flex justify-end align-center ga-16 line-height-2">
          <div class="counter-item mb-lg-0 mb-1" v-for="counter in counters">
            <p class="mb-0 text-lg-h2 text-h5 font-weight-bold">{{ counter.title }}</p>
            <p class="mb-0 text-lg text-sm-h6 text-muted">{{ counter.subtitle }}</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-divider :thickness="3" class="border-opacity-100 mx-lg-16 my-8 mx-5" color="primary"></v-divider>

  <!--FEATURES-->
  <v-container id="features" class="bg-mixed">
    <v-row justify="center">
      <v-col cols="12" lg="12" md="12" sm="12" class="text-center mb-10">
        <p class="text-primary text-md font-weight-medium mb-0">
          {{ $t('home.sections.discoverHorizons') }}
        </p>
        <p class="font-weight-bold text-black text-lg-h3 text-xl mb-0">
          {{ $t('home.sections.oneTapOneCard') }}
        </p>
      </v-col>
    </v-row>

    <!-- Features Grid -->
    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="6" lg="3" class="mb-6" v-for="feature in features">
        <div class="relative">
          <div class="square"></div>

          <v-card class="feature-card glass-light pa-6 h-100 w-100 border" elevation="0" rounded="xl">
            <div class="feature-icon mb-4">
              <v-img :src="feature.image" width="35" height="35"></v-img>
            </div>
            <h3 class="text-lg font-weight-bold mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ feature.subtitle }}
            </p>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid id="reviews" class="testimonial-section py-0 px-0">
    <!-- Synchronized Testimonial Sliders -->
    <div class="testimonial-sliders-container">
      <v-row justify="center">
        <v-col cols="12" lg="12" md="12" sm="12" class="text-center mb-10">
          <p class="font-weight-bold text-black text-5xl mb-5">
            {{ $t('home.sections.customerReviews') }}
          </p>
        </v-col>
      </v-row>
      <!-- Top Slider (Left to Right) -->
      <div class="testimonial-slider testimonial-slider-ltr">
        <div class="testimonial-track testimonial-track-ltr">
          <!-- First set of cards -->
          <div class="testimonial-card" v-for="(testimonial, index) in testimonialData" :key="`ltr-1-${index}`">
            <div class="avatar-container">
              <div class="avatar-3d">
                <v-img :src="testimonial.image" />
              </div>
            </div>
            <div class="testimonial-content">
              <h4 class="testimonial-name">{{ testimonial.name }}</h4>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
          </div>
          <!-- Duplicate set for seamless loop -->
          <div class="testimonial-card" v-for="(testimonial, index) in testimonialData" :key="`ltr-2-${index}`">
            <div class="avatar-container">
              <div class="avatar-3d">
                <v-img :src="testimonial.image" />
              </div>
            </div>
            <div class="testimonial-content">
              <h4 class="testimonial-name">{{ testimonial.name }}</h4>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Slider (Right to Left) -->
      <div class="testimonial-slider testimonial-slider-rtl">
        <div class="testimonial-track testimonial-track-rtl">
          <!-- First set of cards -->
          <div class="testimonial-card" v-for="(testimonial, index) in testimonialDataReversed" :key="`rtl-1-${index}`">
            <div class="avatar-container">
              <div class="avatar-3d">
                <v-img :src="testimonial.image" />
              </div>
            </div>
            <div class="testimonial-content">
              <h4 class="testimonial-name">{{ testimonial.name }}</h4>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
          </div>
          <!-- Duplicate set for seamless loop -->
          <div class="testimonial-card" v-for="(testimonial, index) in testimonialDataReversed" :key="`rtl-2-${index}`">
            <div class="avatar-container">
              <div class="avatar-3d">
                <v-img :src="testimonial.image" />
              </div>
            </div>
            <div class="testimonial-content">
              <h4 class="testimonial-name">{{ testimonial.name }}</h4>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <v-container>
        <div class="mt-16" id="pricing">
          <p class="text-white text-center text-xl font-weight-medium mb-0">
            {{ $t('home.sections.subscriptionRegulations') }}
          </p>
          <div class="plans">
            <v-card v-for="plan in pricingPlans" :key="plan.id" :class="[
              'pricing-card glass-light m-0 p-0 h-100 border',
              { 'pricing-card-pro glow-card': plan.hasGlow },
            ]" elevation="0" rounded="xl">
              <div class="text-start pa-6 pb-0">
                <h2 class="text-2xl font-weight-bold mb-0">{{ plan.name }}</h2>
                <div class="price-section mb-0">
                  <span class="text-3xl font-weight-bold">{{ plan.price }}</span>
                </div>
                <p class="text-sm text-medium-emphasis mb-6">
                  {{ plan.description }}
                </p>

                <!-- Features List -->
                <div class="d-flex align-center justify-space-between">
                  <div class="features-list text-left mb-0">
                    <ul class="text-start mb-3" style="padding-inline-start: 12px"
                      v-for="(feature, index) in plan.features" :key="index">
                      <li class="text-sm font-weight-bold">{{ feature }}.</li>
                    </ul>
                  </div>
                </div>
                <div class="d-flex align-center justify-end">
                  <v-btn :to="plan.isContact ? '/contact#contact-section' : { name: 'register' }"
                    :color="plan.buttonColor" rounded="xl">
                    {{ plan.buttonText }}
                  </v-btn>
                </div>
              </div>
              <video :src="plan.video" style="width: 100%" autoplay muted loop playsinline preload="auto"></video>
            </v-card>
          </div>
        </div>
      </v-container>
    </div>
  </v-container>
</template>

<style>
.plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
}

.plans .pricing-card {
  margin: 0 5px;
}

@media (max-width: 1200px) {
  .plans {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .plans {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .plans {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
