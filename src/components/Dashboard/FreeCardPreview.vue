<script setup>
import { computed, onMounted } from 'vue'
import { useCardStore } from '@/stores/card'
import useAuthStore from '@/stores/auth.js'
import { MotionComponent } from '@vueuse/motion'
import { Icon } from '@iconify/vue'
import { useHead } from '@vueuse/head'
import useI18n from '@/composables/useI18n'

const cardStore = useCardStore()
const authStore = useAuthStore()
const { t } = useI18n()

// إزالة الـ HTML من النصوص (للاسم و الـ bio)
function stripHtml(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

// تحويل أي URL نسبي إلى مطلق (مهم لمواقع التواصل)
function getAbsoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${baseUrl}${cleanUrl}`
  }
  return url
}

// البيانات المستخدمة في الـ meta tags
const pageTitle = computed(
  () => stripHtml(cardStore.card.personal_details.name) || 'Digital Business Card',
)

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

// تعريف الـ meta tags (العنوان + الوصف + الصورة + OG + Twitter)
useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    {
      property: 'og:title',
      content: pageTitle,
    },
    {
      property: 'og:description',
      content: pageDescription,
    },
    {
      property: 'og:image',
      content: pageImage,
    },
    {
      property: 'og:url',
      content: pageUrl,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
    {
      property: 'og:image:height',
      content: '630',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: pageTitle,
    },
    {
      name: 'twitter:description',
      content: pageDescription,
    },
    {
      name: 'twitter:image',
      content: pageImage,
    },
  ],
  link: [
    {
      rel: 'icon',
      href: pageImage,
    },
  ],
})

// Sort buttons by order property (كما كانت)
const sortedButtons = computed(() => {
  if (!cardStore.card.buttons) return []
  return [...cardStore.card.buttons].sort((a, b) => {
    const orderA = a.order || 0
    const orderB = b.order || 0
    return orderA - orderB
  })
})
</script>

<template>
  <div class="preview-card-wrapper">
    <MotionComponent :initial="{ opacity: 0, y: -50 }" :enter="{
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
      <div class="cover"></div>
    </MotionComponent>
    <div class="content px-3">
      <div class="logo float-end">
        <MotionComponent :initial="{
          y: 100,
          opacity: 0,
        }" :enter="{
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
          <v-img :src="cardStore.card.personal_details.profile_image || '/user-placeholder.png'" width="90"
            class="py-3"></v-img>
        </MotionComponent>
      </div>

      <div class="profile-content">
        <div class="personal-details px-5 py-3">
          <MotionComponent :initial="{ opacity: 0, x: -30 }" :enter="{
            x: 0,
            opacity: 1,
            transition: {
              x: {
                delay: 200,
              },
              opacity: {
                duration: 2000,
              },
            },
          }">
            <p class="text-3xl font-weight-bold" v-html="cardStore.card.personal_details.name"></p>
          </MotionComponent>
          <MotionComponent :initial="{ opacity: 0, x: -50 }" :enter="{
            x: 0,
            opacity: 1,
            transition: {
              x: {
                delay: 200,
              },
              opacity: {
                duration: 2000,
              },
            },
          }">
            <p class="text-lg font-weight-medium" v-html="cardStore.card.personal_details.bio"></p>
          </MotionComponent>
          <MotionComponent :initial="{ opacity: 0, x: -80 }" :enter="{
            x: 0,
            opacity: 1,
            transition: {
              x: {
                delay: 200,
              },
              opacity: {
                duration: 2000,
              },
            },
          }">
            <p class="text-lg text-muted" v-html="cardStore.card.personal_details.conclusion"></p>
          </MotionComponent>
        </div>
        <div class="about py-3">
          <MotionComponent :initial="{ opacity: 0, x: -100 }" :enter="{
            x: 0,
            opacity: 1,
            transition: {
              x: {
                delay: 200,
              },
              opacity: {
                duration: 2000,
              },
            },
          }">
            <p class="text-lg font-weight-light" v-html="cardStore.card.personal_details.about"></p>
          </MotionComponent>
        </div>
        <div class="buttons py-3">
          <div class="social-buttons-container">
            <div v-for="(button, i) in sortedButtons" :key="i">
              <MotionComponent class="social-button-wrapper" :initial="{ opacity: 0, x: -50 }" :enter="{
                x: 0,
                opacity: 1,
                transition: {
                  x: {
                    delay: 200,
                  },
                  opacity: {
                    duration: 2000,
                  },
                },
              }">
                <a :href="button.link" target="_blank" rel="noopener noreferrer" class="social-button" :style="{
                  backgroundColor: button.color || '#3b82f6',
                  fontFamily: button.font_family || 'inherit',
                  fontSize: button.font_size ? button.font_size + 'px' : '14px',
                }">
                  <Icon :icon="button.icon" color="white" size="20" />
                </a>
                <span class="button-label" :style="{
                  fontFamily: button.font_family || 'inherit',
                  fontSize: button.font_size ? button.font_size - 2 + 'px' : '12px',
                  color: '#374151',
                }">
                  {{ button.title }}
                </span>
              </MotionComponent>
            </div>
          </div>
        </div>
      </div>

      <MotionComponent :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 2500, ease: 'easeOut' }">
        <div class="footer pt-5 d-flex align-center justify-center ga-1">
          <p class="text-xs text-center text-muted mb-0">
            {{ t('cards.preview.poweredBy') }}
            <a class="text-decoration-none" href="https://ultratech.co.il" target="_blank">Ultra Tech</a>
          </p>
          <img src="/logo.svg" alt="Ultra tech logo" style="width: 25px !important" />
        </div>
      </MotionComponent>
    </div>
  </div>
</template>

<style scoped>
.cover {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%);
  position: relative;
  overflow: hidden;
}

.cover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: #ffffff;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  transform: scaleX(1.2);
}

.profile-content {
  position: relative;
}

.personal-details {
  border-inline-start: 2px dashed #8b5cf6;
}

/* Social Buttons Styling */
.social-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px;
}

.social-button-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-label {
  font-weight: 500;
  line-height: 1.2;
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .social-buttons-container {
    padding: 0 16px;
    gap: 12px;
  }

  .social-button {
    width: 44px;
    height: 44px;
  }

  .social-button-wrapper {
    gap: 10px;
  }
}
</style>
