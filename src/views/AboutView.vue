<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, tm, hasTranslation } = useI18n()

// Team members data from translations
const teamMembers = computed(() => {
  try {
    const members = tm('about.team.members')
    if (!Array.isArray(members) || members.length === 0) {
      return []
    }
    return members
  } catch (error) {
    console.error('Error loading team members:', error)
    return []
  }
})

const features = computed(() => {
  try {
    const items = tm('about.values.items')
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }
    return items
  } catch (error) {
    console.error('Error loading values items:', error)
    return []
  }
})

const storyParagraphs = computed(() => {
  try {
    const paragraphs = tm('about.story.paragraphs')
    if (Array.isArray(paragraphs) && paragraphs.length > 0) return paragraphs
    const keys = [
      'about.story.paragraph1',
      'about.story.paragraph2',
      'about.story.paragraph3',
      'about.story.paragraph4',
    ]
    return keys.filter((k) => hasTranslation(k)).map((k) => t(k))
  } catch (error) {
    const keys = [
      'about.story.paragraph1',
      'about.story.paragraph2',
      'about.story.paragraph3',
      'about.story.paragraph4',
    ]
    return keys.filter((k) => hasTranslation(k)).map((k) => t(k))
  }
})

const timelineMilestones = computed(() => {
  try {
    const m = tm('about.timeline.milestones')
    if (!Array.isArray(m) || m.length === 0) return []
    return m
  } catch (error) {
    console.error('Error loading timeline milestones:', error)
    return []
  }
})

// Auto-rotating team member showcase
const currentMember = ref(0)
let memberInterval = null

const startMemberRotation = () => {
  memberInterval = setInterval(() => {
    const members = teamMembers.value
    if (Array.isArray(members) && members.length > 0) {
      currentMember.value = (currentMember.value + 1) % members.length
    }
  }, 5000) // Change every 5 seconds
}

const stopMemberRotation = () => {
  if (memberInterval) {
    clearInterval(memberInterval)
    memberInterval = null
  }
}

const goToMember = (index) => {
  currentMember.value = index
  stopMemberRotation()
  // Restart rotation after manual navigation
  setTimeout(startMemberRotation, 3000)
}

onMounted(() => {
  startMemberRotation()
})

onUnmounted(() => {
  stopMemberRotation()
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="info" :text="$t('about.story.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('about.story.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('about.story.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="10" lg="8">
        <p v-for="(p, idx) in storyParagraphs" :key="idx" class="text-md text-muted mb-4">
          {{ p }}
        </p>
      </v-col>
    </v-row>
  </v-container>

  <!-- Our Values Section -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="info" :text="$t('about.values.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('about.values.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('about.values.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="6" lg="3" class="mb-6" v-for="(feature, idx) in features" :key="idx">
        <div class="relative">
          <div class="square"></div>

          <v-card class="feature-card glass-light pa-6 h-100 w-100 border" elevation="0" rounded="xl">
            <div class="feature-icon mb-4" v-if="feature.image">
              <v-img :src="feature.image" width="35" height="35"></v-img>
            </div>
            <h3 class="text-lg font-weight-bold mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ feature.description }}
            </p>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Meet Our Team Section -->
  <v-container class="bg-mixed">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="purple" :text="$t('about.team.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-text-purple">{{ $t('about.team.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('about.team.subtitle') }}
        </p>
        <p class="text-muted text-md mb-5" v-if="hasTranslation('about.team.description')">
          {{ $t('about.team.description') }}
        </p>
        <v-btn color="primary" variant="flat" size="large" v-if="hasTranslation('about.team.cta.label')">
          {{ $t('about.team.cta.label') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Team Grid -->
    <v-row justify="center" class="mb-16">
      <v-col v-for="member in teamMembers" :key="member.id" cols="12" sm="6" md="4" lg="3" class="mb-6">
        <v-card class="team-member-card glass-light pa-6 h-100 border" elevation="0" rounded="xl">
          <div class="text-center">
            <v-avatar size="100" class="mb-4" color="grey-lighten-3" :image="member.image">
            </v-avatar>
            <h4 class="text-lg font-weight-bold mb-1">{{ member.name }}</h4>
            <p class="text-sm text-primary font-weight-medium mb-3">{{ member.title }}</p>
            <p class="text-xs text-muted">{{ member.bio }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Our Journey Timeline Section -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12" class="text-center mb-10">
        <VChip class="mb-5" color="primary" :text="$t('about.timeline.badge')"> </VChip>
        <p class="text-sm mb-5">
          <span class="gradient-title">{{ $t('about.timeline.title') }}</span>
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('about.timeline.subtitle') }}
        </p>
        <p class="text-muted text-md mb-5">
          {{ $t('about.timeline.description') }}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="10" lg="8">
        <div class="timeline">
          <div v-for="(item, idx) in timelineMilestones" :key="idx" class="timeline-item d-flex align-start mb-8">
            <div class="timeline-year me-6">
              <v-chip color="primary" variant="flat" size="large">{{ item.year }}</v-chip>
            </div>
            <v-card class="milestone-card glass-light pa-6 h-100 border" elevation="0" rounded="xl">
              <h4 class="text-lg font-weight-bold mb-2">{{ item.title }}</h4>
              <p class="text-sm text-muted">{{ item.description }}</p>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  inset-block-start: 60px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgb(var(--v-theme-primary)), transparent);
  opacity: 0.3;
}

.timeline-item {
  position: relative;
}

.timeline-year {
  position: relative;
  z-index: 1;
}

.milestone-card {
  transition: all 0.3s ease;
}

.milestone-card:hover {
  transform: translateY(-2px);
}

.team-card {
  transition: all 0.3s ease;
}

.team-member-card {
  transition: all 0.3s ease;
}

.team-member-card:hover {
  transform: translateY(-4px);
}
</style>
