<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'

import { useCardStore } from '@/stores/card'
import { useConfigStore } from '@/stores/config.js'
import validationRules from '@/utils/validation'
import { MotionComponent } from '@vueuse/motion'
import { Icon } from '@iconify/vue'
import { useHead } from '@vueuse/head'
import useI18n from '@/composables/useI18n'
import http from '@/plugins/api/http-common'
import { vcardAPI } from '@/plugins/api/endpoints'

const cardStore = useCardStore()
const configStore = useConfigStore()
const route = useRoute()
const { t } = useI18n()

function stripHtml(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

// Helper function to ensure absolute URL
function getAbsoluteUrl(url) {
  if (!url) return ''
  // If already absolute URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // If relative URL, make it absolute
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin
    // Remove leading slash if present to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${baseUrl}${cleanUrl}`
  }
  return url
}

// Computed properties for meta tags
const pageTitle = computed(() => stripHtml(cardStore.card.personal_details.name) || 'Digital Business Card')
const pageDescription = computed(() => {
  const bio = stripHtml(cardStore.card.personal_details.bio)
  return bio || 'Professional Digital Business Card'
})
const pageImage = computed(() => {
  const imageUrl = cardStore.card.personal_details.profile_image || '/user-placeholder.png'
  return getAbsoluteUrl(imageUrl)
})
const pageUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

// Setup meta tags for social sharing
useHead({
  title: pageTitle,
  meta: [
    // Standard meta tags
    {
      name: 'description',
      content: pageDescription
    },
    // Open Graph meta tags
    {
      property: 'og:title',
      content: pageTitle
    },
    {
      property: 'og:description',
      content: pageDescription
    },
    {
      property: 'og:image',
      content: pageImage
    },
    {
      property: 'og:url',
      content: pageUrl
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    // Twitter Card meta tags
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: pageTitle
    },
    {
      name: 'twitter:description',
      content: pageDescription
    },
    {
      name: 'twitter:image',
      content: pageImage
    }
  ],
  link: [
    {
      rel: 'icon',
      href: pageImage
    }
  ]
})

// Computed property for dynamic text color
const textColor = computed(() => configStore.getTextColor(cardStore.card.card_details.color))
const mutedTextColor = computed(() => {
  const isDark = configStore.getTextColor(cardStore.card.card_details.color) === '#FFFFFF'
  return isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
})

// Rotating gallery header texts
const rotatingTexts = [
  'Natural beauty, enhanced with care',
  'Advanced treatments. Gentle touch.',
  'Glow with confidence',
]
const textIndex = ref(0)
const currentText = computed(() => rotatingTexts[textIndex.value])
let rotateTimer

// Gallery items from store
const gallery = computed(() => cardStore.card.gallery)

// Gallery grid ref for calculating square cells
const galleryGridRef = ref(null)
const gridRowHeight = ref('1fr')

// Calculate row height to match column width for square cells
function updateGridRowHeight() {
  if (!galleryGridRef.value) return
  const grid = galleryGridRef.value
  const gridWidth = grid.offsetWidth
  const gap = 8 // gap between items
  const numColumns = 4
  const columnWidth = (gridWidth - (gap * (numColumns - 1))) / numColumns
  // gridRowHeight.value = `${columnWidth}px`
  gridRowHeight.value = `auto`
}

onMounted(async () => {
  rotateTimer = setInterval(() => {
    textIndex.value = (textIndex.value + 1) % rotatingTexts.length
  }, 2500)

  // Update grid row height after mount and on resize
  // Use nextTick to ensure DOM is fully rendered
  await nextTick()
  updateGridRowHeight()
  window.addEventListener('resize', updateGridRowHeight)
})

onBeforeUnmount(() => {
  if (rotateTimer) clearInterval(rotateTimer)
  window.removeEventListener('resize', updateGridRowHeight)
})

const reviewSlide = ref(0)

// Contact Us form state and validation
const formRef = ref()
const contactValid = ref(false)
const submitting = ref(false)
const contact = ref({ name: '', phone: '', subject: '', message: '' })

async function submitContact() {
  const validateForm = await formRef.value?.validate()
  if (!validateForm?.valid) return

  submitting.value = true

  try {
    const response = await cardStore.submitContactForm(
      cardStore.card.slug,
      contact.value
    )

    formRef.value?.reset()

  } catch (error) {
    console.error("error:", error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="preview-card-wrapper pb-2" :style="{
    backgroundColor: cardStore.card.card_details.color,
  }">
    <div class="personal-details-section fancy-bg" :style="{
      '--bg-image': cardStore.card.personal_details.background_image
        ? `url('${cardStore.card.personal_details.background_image}')`
        : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }">
      <!-- Profile Images-->
      <div class="profile position-relative">
        <MotionComponent :initial="{ opacity: 0, y: 100 }" :enter="{
          opacity: 1,
          y: 0,
          transition: {
            opacity: {
              duration: 500,
            },
            y: {
              duration: 1000,
            }
          },
        }">
          <v-img class="cover-image polygon-bottom" :src="cardStore.card.personal_details.cover_image || '/test.jpg'"
            width="100%" height="300" cover></v-img>
          <v-img :src="cardStore.card.personal_details.profile_image || '/user-placeholder.png'" width="180"
            height="180" class="avatar profile-image"></v-img>
        </MotionComponent>
      </div>
      <div class="px-2" style="padding-top: 150px;">
        <!-- Profile Details-->
        <div class="profile-details">
          <MotionComponent :initial="{ opacity: 0 }" :enter="{
            opacity: 1,
            transition: {
              opacity: {
                duration: 4000,
              },
            },
          }">
            <h2 class="text-4xl text-center" v-html="cardStore.card.personal_details.name"></h2>
            <v-container>
              <v-row justify="center">
                <v-col cols="10">
                  <div style="overflow-wrap: anywhere;">
                    <div class="ql-editor" v-html="cardStore.card.personal_details.bio"></div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </MotionComponent>
          <!-- Buttons -->
          <div class="actions my-6">
            <div v-for="(a, i) in cardStore.card.buttons" :key="i" class="action">
              <MotionComponent :initial="{ opacity: 0, x: 200 }" :enter="{
                x: 0,
                opacity: 1,
                transition: {
                  x: {
                    duration: 1000,
                  },
                  opacity: {
                    duration: 1500,
                  },
                },
              }">
                <v-btn :href="a.link" class="circle-btn" rounded="circle" variant="outlined" :color="a.color" size="60">
                  <Icon :icon="a.icon" width="26" height="26" />
                </v-btn>
                <div class="action-label" :style="{
                  color: a.color,
                  fontFamily: a.font_family || 'Roboto, sans-serif',
                  fontSize: a.font_size || '14px',
                }">
                  {{ a.title }}
                </div>
              </MotionComponent>
            </div>
          </div>
          <!-- Download VCF Button-->
          <div class="text-center">
            <MotionComponent :initial="{ opacity: 0, x: -200 }" :enter="{
              x: 0,
              opacity: 1,
              transition: {
                x: {
                  duration: 2500,
                },
                opacity: {
                  duration: 2000,
                },
              },
            }">
              <v-btn class="download-vcf-btn" prepend-icon="mdi-plus" rounded="xl" :loading="cardStore.isLoading"
                @click="cardStore.donwloadVCard(cardStore.card.slug)"
                :color="cardStore.card.card_details.contact_button_color" variant="elevated">
                <span class="text-capitalize">
                  {{ t('cards.preview.keepInContacts') }}
                </span>
              </v-btn>
            </MotionComponent>
          </div>
          <!-- About Me-->
          <div class="about-me my-6">
            <h3 class="text-capitalize text-center text-lg font-weight-bold text-decoration-underline mb-3"
              :style="{ color: textColor }">
              {{ t('cards.preview.aboutMeTitle') }}
            </h3>
            <v-container>
              <v-row justify="center">
                <v-col cols="10">
                  <div style="overflow-wrap: anywhere;">
                    <div class="ql-editor" v-html="cardStore.card.personal_details.about"></div>
                  </div>
                </v-col>
              </v-row>
            </v-container>

          </div>
          <!-- FAQs-->
          <div class="faqs my-8 mx-2">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(f, i) in cardStore.card.faqs" :key="i" class="faq-panel"
                :bg-color="f.background_color" elevation="0">
                <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus" class="faq-title">
                  <div class="d-flex align-center ga-3">
                    <div class="text-subtitle-1 font-weight-medium ql-editor" v-html="f.question"></div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="text-start">
                  <div class="ql-editor" v-html="f.answer"></div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content-->
    <div class="profile-content text-center pt-0 px-0">
      <!-- Gallery-->
      <div class="gallery my-8">
        <!-- Decorative rotating header -->
        <div class="gallery-header">
          <div class="line" :style="{ backgroundColor: textColor }"></div>
          <transition name="soft-fade" mode="out-in">
            <div :key="currentText" :style="{ color: textColor }" class="header-text">
              {{ currentText }}
            </div>
          </transition>
          <div class="line" :style="{ backgroundColor: textColor }"></div>
        </div>

        <!-- CSS Grid gallery where each item controls its span -->
        <div ref="galleryGridRef" class="gallery-grid px-1" :style="{ gridAutoRows: gridRowHeight }">
          <div v-for="(img, idx) in gallery" :key="idx" class="gallery-item"
            :style="{ gridColumn: `span ${img.cols}`, gridRow: `span ${img.rows}` }">
            <img :src="img.src" class="gallery-img" />
          </div>
        </div>
      </div>
      <!-- Customer Reviews-->
      <div class="reviews my-10" v-if="cardStore.card.reviews.length > 0">
        <div class="reviews-header text-center">
          <h3 class="text-3xl font-weight-bold mb-2" :style="{ color: textColor }">
            {{ t('cards.preview.customersRecommend') }}
          </h3>
          <div class="underline mx-auto"></div>
        </div>

        <v-carousel v-model="reviewSlide" height="240" cycle hide-delimiter-background class="review-carousel"
          show-arrows interval="5000" delimiter-icon="mdi-square">
          <template v-slot:prev="{ props }">
            <v-btn color="primary" variant="tonal" size="40" icon="mdi-arrow-left" @click="props.onClick"></v-btn>
          </template>
          <template v-slot:next="{ props }">
            <v-btn color="primary" variant="tonal" size="40" icon="mdi-arrow-right" @click="props.onClick"></v-btn>
          </template>
          <v-carousel-item v-for="(r, i) in cardStore.card.reviews" :key="i">
            <div class="h-100 d-flex flex-column align-center justify-center text-center px-6">
              <div class="quote mb-3" :style="{ color: textColor }">“{{ r.review }}”</div>
              <div class="author text-sm mt-1" :style="{ color: mutedTextColor }">
                {{ r.user_name }}
              </div>
              <div class="star-rating mr-2">
                <v-icon v-for="star in 5" :key="star" :color="star <= (r.rating || 5) ? 'amber' : 'grey-lighten-2'"
                  size="16" class="mr-1">
                  mdi-star
                </v-icon>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </div>
      <v-divider></v-divider>
      <div class="contact-details pb-2 fancy-bg" :style="{
        '--bg-image': cardStore.card.personal_details.contact_details_background
          ? `url('${cardStore.card.personal_details.contact_details_background}')`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }">
        <!-- Conclusion-->
        <div class="advise mb-6 pt-6">
          <v-container>
            <v-row justify="center">
              <v-col cols="10">
                <div style="overflow-wrap: anywhere;">
                  <MotionComponent :initial="{ opacity: 0, y: -100 }" :enter="{
                    y: 0,
                    opacity: 1,
                    transition: {
                      y: {
                        delay: 200,
                      },
                      opacity: {
                        duration: 2000,
                      },
                    },
                  }">
                    <div class="ql-editor" v-html="cardStore.card.personal_details.conclusion"></div>
                    <v-btn :href="`https://wa.me/${cardStore.card.personal_details.phone}`" target="_blank"
                      class="shake" size="60" color="success" variant="tonal" icon="mdi-whatsapp"></v-btn>
                  </MotionComponent>

                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-divider></v-divider>
        <!-- Contact Us Form-->
        <div class="contact-us my-6 px-4">
          <h2 class="text-lg" :style="{ color: textColor }">
            {{ t('cards.preview.leaveDetails') }}
          </h2>
          <!-- Contact Us Form-->
          <div class="contact-card mt-4">
            <v-form ref="formRef" v-model="contactValid" @submit.prevent="submitContact">
              <v-row class="text-start">
                <v-col class="pb-0" lg="6" md="6" sm="12" col="12">
                  <v-text-field color="primary" v-model="contact.name" label="Name" :rules="validationRules.name"
                    prepend-inner-icon="mdi-account-outline" variant="outlined" density="comfortable"
                    hide-details="auto" required />
                </v-col>
                <v-col class="pb-0" lg="6" md="6" sm="12" col="12">
                  <v-text-field color="primary" v-model="contact.phone" label="Phone" :rules="validationRules.phone"
                    prepend-inner-icon="mdi-phone-outline" variant="outlined" density="comfortable" hide-details="auto"
                    required />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field color="primary" v-model="contact.subject" label="Subject"
                    :rules="validationRules.subject" prepend-inner-icon="mdi-text-short" variant="outlined"
                    density="comfortable" class="mt-3" hide-details="auto" required />
                </v-col>
                <v-col cols="12">
                  <v-textarea color="primary" v-model="contact.message" label="Message" :rules="validationRules.message"
                    prepend-inner-icon="mdi-message-text-outline" variant="outlined" auto-grow rows="4" class="mt-3"
                    hide-details="auto" required />
                </v-col>
              </v-row>

              <div class="form-actions mt-4 d-flex align-center justify-space-between">
                <v-btn type="submit" :loading="submitting" block color="primary" rounded="xl">
                  <span class="text-capitalize"> Send message </span>
                </v-btn>
              </div>
            </v-form>
          </div>
        </div>
        <!-- Share Buttons-->
        <div class="share my-6">
          <MotionComponent :initial="{ opacity: 0, y: -100 }" :enter="{
            y: 0,
            opacity: 1,
            transition: {
              y: {
                delay: 200,
              },
              opacity: {
                duration: 2000,
              },
            },
          }">
            <h2 class="text-lg text-decoration-underline mb-3" :style="{ color: textColor }">
              {{ t('cards.preview.shareCard') }}
            </h2>
            <div class="share-buttons d-flex align-center ga-2 justify-center">
              <v-btn variant="elevated" color="success" elevation="0" size="50" rounded="circle" class="text-white"
                icon="mdi-whatsapp"></v-btn>
              <v-btn variant="elevated" color="error" elevation="0" size="50" rounded="circle" class="text-white"
                icon="mdi-email-outline"></v-btn>
              <v-btn variant="elevated" color="warning" elevation="0" size="50" rounded="circle" class="text-white"
                icon="mdi-message-outline"></v-btn>
            </div>
          </MotionComponent>
        </div>
      </div>
    </div>

    <MotionComponent :initial="{ opacity: 0, y: 100 }" :enter="{
      y: 0,
      opacity: 1,
      transition: {
        y: {
          delay: 200,
        },
        opacity: {
          duration: 2000,
        },
      },
    }">
      <div class="footer pt-5 d-flex align-center justify-center ga-1">
        <p class="text-xs text-center text-muted mb-0">
          {{ t('cards.preview.poweredBy') }}
          <a href="https://ultratech.co.il" target="_blank">Ultra Tech</a>
        </p>
        <img src="/logo.svg" alt="Ultra tech logo" style="width: 25px !important" />
      </div>
    </MotionComponent>
  </div>
</template>

<style scoped>
.profile-image {
  border-radius: 50%;
  aspect-ratio: 1/1;
  position: absolute;
  bottom: -140px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

/* Pointed bottom (V shape) */
.cover-image.polygon-bottom {
  --depth: 50px;
  clip-path: polygon(0 0,
      100% 0,
      100% calc(100% - var(--depth)),
      50% 100%,
      0 calc(100% - var(--depth)));
}

.actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.circle-btn {
  border-width: 2px !important;
}

.action-label {
  margin-top: 8px;
  font-size: 0.95rem;
  line-height: 1.2rem;
}

.download-vcf-btn {
  transition: 0.4s ease-in-out;
}

.download-vcf-btn:hover {
  transform: scale(1.2);
}

/* FAQs styling */
.faq-panels {
  background: transparent;
}

.faq-panel {
  border-radius: 18px;
  overflow: hidden;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.015), transparent);
}

.faq-panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.faq-title {
  padding: 14px 18px !important;
}

.faq-text {
  padding: 0 18px 16px 46px;
}

/* Gallery styling */
.gallery-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.gallery-header .line {
  height: 1px;
  background: rgba(0, 0, 0, 0.18);
}

.header-text {
  padding: 6px 14px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--v-theme-primary) 12%, transparent);
  color: var(--v-theme-primary);
  font-weight: 600;
  letter-spacing: 0.4px;
}

/* soft fade transition */
.soft-fade-enter-active,
.soft-fade-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease,
    filter 0.45s ease;
}

.soft-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(2px);
}

.soft-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  filter: blur(2px);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  width: 100%;
  /* grid-auto-rows is set dynamically via JavaScript to match column width */
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  min-height: 0;
  /* Ensure items can shrink properly */
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.35s ease;
  /* Ensure image fills the container without distortion */
}

@media (max-width: 768px) {
  .gallery-img {
    object-fit: cover;
  }
}

.gallery-item:hover .gallery-img {
  transform: scale(1.04);
}

/* Reviews */
.reviews {
  position: relative;
  border-radius: 18px;
  padding: 18px 8px 8px;
  background:
    radial-gradient(90% 100% at 50% 0%, rgba(0, 0, 0, 0.03), transparent),
    linear-gradient(180deg, rgba(0, 0, 0, 0.02), transparent);
}

.quote {
  max-width: 920px;
  font-size: clamp(1rem, 2.2vw, 1.35rem);
  font-style: italic;
}

.author {
  font-weight: 600;
}

.fancy-bg {
  position: relative;
  overflow: hidden;
}

.fancy-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: var(--bg-image);
  opacity: 0.5;
  z-index: 1;
}

/* طبقة البلور */
.fancy-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  /* backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px); */

  z-index: 2;
}

/* المحتوى */
.fancy-bg>* {
  position: relative;
  z-index: 3;
}
</style>
