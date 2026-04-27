<script setup>

import { useCardStore } from '@/stores/card'
import useAuthStore from '@/stores/auth.js'
import { useI18n } from '@/composables/useI18n'

const cardStore = useCardStore()
const authStore = useAuthStore()
const { t } = useI18n()

function toSingleFile(fileOrFiles) {
  if (Array.isArray(fileOrFiles)) return fileOrFiles[0] || null
  return fileOrFiles || null
}

async function onQRCodeLogoSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    cardStore.card.card_details.qrcode_logo = '/test.jpg'
    cardStore.card.files.qrcode_logo = null
    cardStore.card.card_details.qrcode_logo_path = null
    await cardStore.removeQrCodeLogo(cardStore.card.slug)
    cardStore.card.personal_details.cover_image_id = null
    return
  }

  const prev = cardStore.card.card_details.qrcode_logo
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }
  cardStore.card.card_details.qrcode_logo = URL.createObjectURL(file)
  cardStore.card.files.qrcode_logo = file
}

// Validation rules
const nameRules = [
  v => !!v || t('dashboard.builder.forms.cardDetails.validation.nameRequired'),
  v => (v && v.trim().length > 0) || t('dashboard.builder.forms.cardDetails.validation.nameEmpty')
]

const typeRules = [
  v => !!v || t('dashboard.builder.forms.cardDetails.validation.typeRequired')
]

</script>

<template>
  <div class="mt-8">
    <v-form class="ga-4">

      <div class="form-group">
        <v-label class="text-xs text-black font-weight-bold" for="name">{{
          $t('dashboard.builder.forms.cardDetails.nameLabel') }}</v-label>
        <v-text-field v-model="cardStore.card.card_details.name" id="name"
          :placeholder="$t('dashboard.builder.forms.cardDetails.namePlaceholder')" variant="outlined" color="primary"
          :flat="false" rounded="lg" :rules="nameRules" class="mb-4"></v-text-field>
      </div>

      <div class="form-group">
        <v-switch :label="$t('dashboard.builder.forms.cardDetails.published')" color="primary"
          v-model="cardStore.card.card_details.published"></v-switch>
      </div>

      <div class="form-group">
        <v-label class="text-xs text-black font-weight-bold" for="type">{{
          $t('dashboard.builder.forms.cardDetails.typeLabel') }}</v-label>
        <v-select v-model="cardStore.card.card_details.type" :items="[
          { title: $t('dashboard.builder.forms.cardDetails.types.personal'), value: 'personal' },
          { title: $t('dashboard.builder.forms.cardDetails.types.business'), value: 'business' },
        ]" id="type" variant="outlined" color="primary" rounded="lg" :rules="typeRules" class="mb-4" />
      </div>

      <div class="form-group" v-if="authStore.hasActiveSubscription && cardStore.card.pro_mode">
        <v-label class="text-xs text-black font-weight-bold" for="type">{{
          $t('dashboard.builder.forms.cardDetails.bgColorLabel') }}</v-label>
        <v-color-picker v-model="cardStore.card.card_details.color" mode="hexa" rounded="lg" elevation="0"
          class="color-picker w-100 mb-4" />
      </div>

      <div class="form-group" v-if="authStore.hasActiveSubscription && cardStore.card.pro_mode">
        <v-label class="text-xs text-black font-weight-bold" for="contact-button-color">{{
          $t('dashboard.builder.forms.cardDetails.contactButtonColor') }}</v-label>
        <v-color-picker v-model="cardStore.card.card_details.contact_button_color" mode="hexa" rounded="lg"
          elevation="0" class="color-picker w-100 mb-4" />
      </div>

      <div class="form-group" v-if="authStore.hasActiveSubscription">
        <v-label class="text-xs text-black font-weight-bold" for="qrcode-logo">{{
          $t('dashboard.builder.forms.cardDetails.qrLabel') }} (300x300)px</v-label>
        <v-file-upload clearable id="qrcode-logo" accept="image/*" density="compact" color="transparent" rounded="lg"
          class="mb-4" @update:model-value="onQRCodeLogoSelected" />

        <v-list-item v-if="cardStore.card.card_details.qrcode_logo_path" class="border rounded-lg py-3 mb-4">
          <template #title>
            <span class="mx-3 text-sm">
              {{ $t('dashboard.builder.forms.cardDetails.qrCodeLabel') }}
            </span>
          </template>
          <template #prepend>
            <img :src="cardStore.card.card_details.qrcode_logo" width="40px" height="40px" class="rounded-lg" />
          </template>
          <template #append>
            <v-btn size="x-sm" icon="mdi-close" @click="onQRCodeLogoSelected(null)"></v-btn>
          </template>
        </v-list-item>

      </div>
    </v-form>
  </div>
</template>

<style scoped></style>
