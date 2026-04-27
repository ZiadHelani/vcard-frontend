<script setup>
import { ref } from 'vue'

import { useCardStore } from '@/stores/card.js'
import validation from '@/utils/validation.js'
import QuillEditor from '@/components/common/QuillEditor.vue'
import useAuthStore from '@/stores/auth.js'
import { useI18n } from '@/composables/useI18n'

const cardStore = useCardStore()
const authStore = useAuthStore()
const { t } = useI18n()

// Validation rules
const nameRules = [
  v => !!v || t('dashboard.builder.forms.personalDetails.validation.nameRequired'),
  v => (v && v.trim().length > 0) || t('dashboard.builder.forms.personalDetails.validation.nameEmpty')
]

function toSingleFile(fileOrFiles) {
  if (Array.isArray(fileOrFiles)) return fileOrFiles[0] || null
  return fileOrFiles || null
}

async function onCoverSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    cardStore.card.personal_details.cover_image = '/test.jpg'
    cardStore.card.files.cover_image = null
    if (cardStore.card.personal_details.cover_image_id) {
      await cardStore.removeMedia(cardStore.card.personal_details.cover_image_id)
      cardStore.card.personal_details.cover_image_id = null
    }
    return
  }
  const prev = cardStore.card.personal_details.cover_image
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }
  // Store blob URL for preview
  cardStore.card.personal_details.cover_image = URL.createObjectURL(file)
  // Store actual File object for backend submission
  cardStore.card.files.cover_image = file
}

async function onProfileSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    cardStore.card.personal_details.profile_image = '/user-placeholder.png'
    cardStore.card.files.profile_image = null
    if (cardStore.card.personal_details.profile_image_id) {
      await cardStore.removeMedia(cardStore.card.personal_details.profile_image_id)
      cardStore.card.personal_details.profile_image_id = null
    }
    return
  }
  const prev = cardStore.card.personal_details.profile_image
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }
  // Store blob URL for preview
  cardStore.card.personal_details.profile_image = URL.createObjectURL(file)
  // Store actual File object for backend submission
  cardStore.card.files.profile_image = file
}

async function onBackgroundSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    cardStore.card.personal_details.background_image = ''
    cardStore.card.files.background_image = null
    if (cardStore.card.personal_details.background_image_id) {
      await cardStore.removeMedia(cardStore.card.personal_details.background_image_id)
      cardStore.card.personal_details.background_image_id = null
    }
    return
  }
  const prev = cardStore.card.personal_details.background_image
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }
  // Store blob URL for preview
  cardStore.card.personal_details.background_image = URL.createObjectURL(file)
  // Store actual File object for backend submission
  cardStore.card.files.background_image = file
}
async function onContactDetailsBackgroundSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    cardStore.card.personal_details.contact_details_background = ''
    cardStore.card.files.contact_details_background = null
    if (cardStore.card.personal_details.contact_details_background_id) {
      await cardStore.removeMedia(cardStore.card.personal_details.contact_details_background_id)
      cardStore.card.personal_details.contact_details_background_id = null
    }
    return
  }
  const prev = cardStore.card.personal_details.contact_details_background
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }
  // Store blob URL for preview
  cardStore.card.personal_details.contact_details_background = URL.createObjectURL(file)
  // Store actual File object for backend submission
  cardStore.card.files.contact_details_background = file
}
</script>

<template>
  <v-form class="ga-4">
    <div class="form-group" v-if="authStore.hasActiveSubscription && cardStore.card.pro_mode">
      <v-label class="text-xs text-black font-weight-bold" for="cover-image">{{
        $t('dashboard.builder.forms.personalDetails.coverLabel') }} (1230x575)px</v-label>
      <v-file-upload clearable id="cover-image" accept="image/*" color="transparent" density="compact"
        @update:model-value="onCoverSelected" class="mb-4" />
      <v-list-item v-if="cardStore.card.personal_details.cover_image_id" class="border rounded-lg py-3 mb-4">
        <template #title>
          <span class="mx-3 text-sm">
            {{ $t('dashboard.builder.forms.personalDetails.coverLabel') }}
          </span>
        </template>
        <template #prepend>
          <img :src="cardStore.card.personal_details.cover_image" width="40px" height="40px" class="rounded-lg" />
        </template>
        <template #append>
          <v-btn size="x-sm" icon="mdi-close" @click="onCoverSelected(null)"></v-btn>
        </template>
      </v-list-item>
    </div>

    <div class="form-group">
      <v-label class="text-xs text-black font-weight-bold" for="profile-image">{{
        $t('dashboard.builder.forms.personalDetails.profileLabel') }} (600x600)px</v-label>
      <v-file-upload clearable id="profile-image" accept="image/*" color="transparent" density="compact"
        @update:model-value="onProfileSelected" class="mb-4" />
      <v-list-item v-if="cardStore.card.personal_details.profile_image_id" class="border rounded-lg py-3 mb-4">
        <template #title>
          <span class="mx-3 text-sm">
            {{ $t('dashboard.builder.forms.personalDetails.profileLabel') }}
          </span>
        </template>
        <template #prepend>
          <img :src="cardStore.card.personal_details.profile_image" width="40px" height="40px" class="rounded-lg" />
        </template>
        <template #append>
          <v-btn size="x-sm" icon="mdi-close" @click="onProfileSelected(null)"></v-btn>
        </template>
      </v-list-item>

    </div>

    <div class="form-group" v-if="authStore.hasActiveSubscription && cardStore.card.pro_mode">
      <v-label class="text-xs text-black font-weight-bold" for="background-image">{{
        $t('dashboard.builder.forms.personalDetails.backgroundLabel') }} (800x800)px</v-label>
      <v-file-upload clearable id="background-image" accept="image/*" color="transparent" density="compact"
        @update:model-value="onBackgroundSelected" class="mb-4" />
      <v-list-item v-if="cardStore.card.personal_details.background_image_id" class="border rounded-lg py-3 mb-4">
        <template #title>
          <span class="mx-3 text-sm">
            {{ $t('dashboard.builder.forms.personalDetails.backgroundLabel') }}
          </span>
        </template>
        <template #prepend>
          <img :src="cardStore.card.personal_details.background_image" width="40px" height="40px" class="rounded-lg" />
        </template>
        <template #append>
          <v-btn size="x-sm" icon="mdi-close" @click="onBackgroundSelected(null)"></v-btn>
        </template>
      </v-list-item>
    </div>

    <div class="form-group" v-if="authStore.hasActiveSubscription && cardStore.card.pro_mode">
      <v-label class="text-xs text-black font-weight-bold" for="contact-details-background">{{
        $t('dashboard.builder.forms.personalDetails.contactDetailsBackgroundLabel') }} (800x800)px</v-label>
      <v-file-upload clearable id="contact-details-background" accept="image/*" color="transparent" density="compact"
        @update:model-value="onContactDetailsBackgroundSelected" class="mb-4" />
      <v-list-item v-if="cardStore.card.personal_details.contact_details_background_id"
        class="border rounded-lg py-3 mb-4">
        <template #title>
          <span class="mx-3 text-sm">
            {{ $t('dashboard.builder.forms.personalDetails.contactDetailsBackgroundLabel') }}
          </span>
        </template>
        <template #prepend>
          <img :src="cardStore.card.personal_details.contact_details_background" width="40px" height="40px"
            class="rounded-lg" />
        </template>
        <template #append>
          <v-btn size="x-sm" icon="mdi-close" @click="onContactDetailsBackgroundSelected(null)"></v-btn>
        </template>
      </v-list-item>
    </div>

    <div class="form-group">
      <QuillEditor v-model="cardStore.card.personal_details.name"
        :label="$t('dashboard.builder.forms.personalDetails.fullNameLabel')"
        :placeholder="$t('dashboard.builder.forms.personalDetails.fullNamePlaceholder')" min-height="120px" />
    </div>

    <div class="form-group">
      <v-label class="text-xs text-black font-weight-bold" for="full-name">{{
        $t('dashboard.builder.forms.personalDetails.phoneLabel') }}</v-label>
      <v-text-field v-model="cardStore.card.personal_details.phone" id="full-name"
        :placeholder="$t('dashboard.builder.forms.personalDetails.phonePlaceholder')" variant="outlined" color="primary"
        :flat="false" rounded="lg" :rules="validation.phone" class="mb-4" />
    </div>

    <div class="form-group">
      <QuillEditor v-model="cardStore.card.personal_details.bio"
        :label="$t('dashboard.builder.forms.personalDetails.bioLabel')"
        :placeholder="$t('dashboard.builder.forms.personalDetails.bioPlaceholder')" min-height="120px" />
    </div>

    <div class="form-group">
      <QuillEditor v-model="cardStore.card.personal_details.about"
        :label="$t('dashboard.builder.forms.personalDetails.aboutLabel')"
        :placeholder="$t('dashboard.builder.forms.personalDetails.aboutPlaceholder')" min-height="150px" />
    </div>

    <div class="form-group">
      <QuillEditor v-model="cardStore.card.personal_details.conclusion"
        :label="$t('dashboard.builder.forms.personalDetails.conclusionLabel')"
        :placeholder="$t('dashboard.builder.forms.personalDetails.conclusionPlaceholder')" min-height="100px" />
    </div>
  </v-form>
</template>

<style scoped></style>
