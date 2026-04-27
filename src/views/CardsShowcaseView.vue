<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, tm, locale } = useI18n()

// Card templates data from translations
const cardTemplates = computed(() => {
  try {
    const items = tm('cards.templates.items')
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }

    const colors = ['primary', 'purple', 'success', 'info', 'warning', 'error']
    const bgColors = ['#1976D2', '#9C27B0', '#4CAF50', '#2196F3', '#FF9800', '#F44336']
    const avatars = [
      { name: 'John Anderson', title: 'Chief Executive Officer', company: 'TechCorp Solutions' },
      { name: 'Sarah Chen', title: 'UI/UX Designer', company: 'Design Studio' },
      { name: 'Mike Rodriguez', title: 'Sales Director', company: 'Growth Partners' },
      { name: 'Dr. Emily Watson', title: 'Cardiologist', company: 'Medical Center' },
      { name: 'David Kim', title: 'Real Estate Agent', company: 'Prime Properties' },
      { name: 'Maria Gonzalez', title: 'Restaurant Owner', company: 'Bella Vista' },
    ]

    return items.map((item, index) => ({
      ...item,
      id: index + 1,
      color: colors[index] || 'primary',
      preview: {
        ...avatars[index],
        bgColor: bgColors[index] || '#1976D2',
      },
    }))
  } catch (error) {
    console.error('Error loading card templates:', error)
    return []
  }
})

// Card features data from translations
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

// Current template showcase
const currentTemplate = ref(0)
let templateInterval = null

// Auto-advance template showcase
const startTemplateRotation = () => {
  templateInterval = setInterval(() => {
    const templates = cardTemplates.value
    if (Array.isArray(templates) && templates.length > 0) {
      currentTemplate.value = (currentTemplate.value + 1) % templates.length
    }
  }, 4000) // Change every 4 seconds
}

const stopTemplateRotation = () => {
  if (templateInterval) {
    clearInterval(templateInterval)
    templateInterval = null
  }
}

const goToTemplate = (index) => {
  currentTemplate.value = index
  stopTemplateRotation()
  // Restart rotation after manual navigation
  setTimeout(startTemplateRotation, 3000)
}

// Video player state
const isVideoPlaying = ref(false)
const videoRef = ref(null)

// Compute video source based on current locale
// he -> use Hebrew video, otherwise fallback to English
const videoSrc = computed(() =>
  locale.value === 'he' ? '/cards/cards-video-he.mp4' : '/cards/cards-video-en.mp4',
)

onMounted(() => {
  startTemplateRotation()
})

onUnmounted(() => {
  stopTemplateRotation()
})
</script>

<template>
  <!-- Video Demo Section -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="error" :text="$t('cards.video.badge')"></VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('cards.video.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('cards.video.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" lg="8" md="10">
        <div class="video-container position-relative text-center">
          <!-- Actual video element (hidden by default) -->
          <video :src="videoSrc" ref="videoRef" autoplay class="rounded-xl border border-lg border-primary" muted loop
            playsinline preload="auto" width="500" height="500" poster="/test.jpg"></video>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Card Templates Grid -->
  <v-container class="bg-mixed">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="purple" :text="$t('cards.allTemplates.badge')"></VChip>
        <p class="text-sm mb-5">
          <span class="gradient-text-purple">{{ $t('cards.allTemplates.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('cards.allTemplates.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <!-- Templates Grid -->
    <v-row justify="center" class="mb-16">
      <v-col v-for="(template, index) in cardTemplates" :key="template.id" cols="12" sm="6" md="4" lg="4" class="mb-6">
        <v-card class="template-card glass-light pa-6 h-100 border" elevation="0" rounded="xl">
          <!-- Mini Card Preview -->
          <div class="d-flex justify-center mb-4">
            <v-img :src="`/cards/card-${index + 1}.webp`" height="300"></v-img>
          </div>

          <!-- Template Details -->
          <div class="text-center">
            <h4 class="text-lg font-weight-bold mb-2">{{ template.name }}</h4>
            <v-chip :color="template.color" size="small" class="mb-3">
              {{ template.category }}
            </v-chip>
            <p class="text-sm text-muted mb-4">{{ template.description }}</p>

            <!-- Features List -->
            <div class="features-list mb-4" v-if="template.features && template.features.length > 0">
              <div v-for="feature in template.features.slice(0, 3)" :key="feature"
                class="d-flex align-center justify-start mb-1">
                <v-icon size="16" color="success" class="mr-2">mdi-check-circle</v-icon>
                <span class="text-xs">{{ feature }}</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Card Features Section -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="info" :text="$t('cards.features.badge')"></VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('cards.features.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('cards.features.subtitle') }}
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
</template>

<style scoped>
.business-card-preview {
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mini-card-preview {
  transition: all 0.3s ease;
}

.template-card {
  transition: all 0.3s ease;
}

.template-card:hover {
  transform: translateY(-4px);
}

.template-card:hover .mini-card-preview {
  transform: scale(1.05);
}

.video-container {
  overflow: hidden;
}

.video-placeholder {
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-placeholder:hover {
  transform: scale(1.02);
}

.featured-card {
  transition: all 0.3s ease;
}

.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.features-list {
  text-align: left;
}

.text-xxs {
  font-size: 0.625rem;
  line-height: 1.2;
}
</style>
