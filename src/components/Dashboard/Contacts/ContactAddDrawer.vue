<script setup>
import { ref, computed, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import useAuth from '@/composables/useAuth'
import validationRules from '@/utils/validation.js'
import { useCardStore } from '@/stores/card'

// Props & Emits
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'created'])

// Stores
const contactsStore = useContactsStore()
const cardStore = useCardStore()
const { user } = useAuth()

// Local form state
const formRef = ref(null)
const isSubmitting = computed(() => contactsStore.isCreating)
const isCardsLoading = computed(() => cardStore.isListLoading)
const cardOptions = computed(() => {
  return (cardStore.cards || []).map((c) => ({
    title: c.name || c.card_details?.name || 'Untitled',
    value: c.id ?? c.uuid,
  }))
})

const form = ref({
  image: null, // File
  logo: null, // File
  user_id: null, // set from auth
  name: '',
  title: '',
  company: '',
  department: '',
  is_active: true,
  associated_card_id: null,
  emails: [
    { email: '', label: '' },
  ],
  phones: [
    { phone: '', ext: '', label: '' },
  ],
})

// Preview URLs for images
const imagePreview = ref('')
const logoPreview = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      // set user id from auth when opening
      form.value.user_id = user?.value?.id ?? null
      // fetch cards for select if empty
      if (!cardStore.cards || cardStore.cards.length === 0) {
        cardStore.fetchAllCards().catch(() => {})
      }
    }
  },
  { immediate: true }
)

const resetForm = () => {
  // Cleanup blob URLs to prevent memory leaks
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
  }
  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = ''
  }
  
  form.value = {
    image: null,
    logo: null,
    user_id: user?.value?.id ?? null,
    name: '',
    title: '',
    company: '',
    department: '',
    is_active: true,
    associated_card_id: null,
    emails: [{ email: '', label: '' }],
    phones: [{ phone: '', ext: '', label: '' }],
  }
  formRef.value?.resetValidation?.()
}

const close = () => emit('update:modelValue', false)

// Dynamic lists handlers
const addEmail = () => form.value.emails.push({ email: '', label: '' })
const removeEmail = (idx) => form.value.emails.splice(idx, 1)

const addPhone = () => form.value.phones.push({ phone: '', ext: '', label: '' })
const removePhone = (idx) => form.value.phones.splice(idx, 1)


// Submit
const onSubmit = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid.valid) return

  try {
    // Clean up empty emails/phones
    const payload = { ...form.value }
    payload.emails = (payload.emails || []).filter((e) => e.email?.trim())
    payload.phones = (payload.phones || []).filter((p) => p.phone?.trim())

    console.log(payload)

    await contactsStore.createContact(payload)
    emit('created') // Emit created event to parent
    close()
    resetForm()
  } catch (e) {
    // error toast handled in store
  }
}

// File handlers with preview
const onFileChange = (e, key) => {
  const files = e.target.files
  const file = files && files[0] ? files[0] : null
  
  if (key === 'image') {
    // Cleanup previous blob URL
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    // Set file and create preview
    form.value.image = file
    imagePreview.value = file ? URL.createObjectURL(file) : ''
  } else if (key === 'logo') {
    // Cleanup previous blob URL
    if (logoPreview.value) {
      URL.revokeObjectURL(logoPreview.value)
    }
    // Set file and create preview
    form.value.logo = file
    logoPreview.value = file ? URL.createObjectURL(file) : ''
  }
}

// Remove image handler
const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
  }
  form.value.image = null
}

// Remove logo handler
const removeLogo = () => {
  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = ''
  }
  form.value.logo = null
}
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    location="right"
    width="520"
    temporary
    border
    elevation="2"
    class="contact-drawer"
  >
    <div class="d-flex align-center justify-space-between px-5 py-4">
      <div class="d-flex align-center ga-3">
        <v-avatar size="36" color="primary" variant="tonal">
          <v-icon>mdi-account-plus</v-icon>
        </v-avatar>
        <div>
          <div class="text-lg">{{ $t('dashboard.contacts.addDrawer.title') }}</div>
          <div class="text-sm text-muted">{{ $t('dashboard.contacts.addDrawer.subtitle') }}</div>
        </div>
      </div>
      <v-btn icon variant="text" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider></v-divider>

    <v-form ref="formRef" class="pa-5" @submit.prevent="onSubmit">
      <!-- Images -->
      <div class="mb-6">
        <div class="text-subtitle-2 mb-3">{{ $t('dashboard.contacts.addDrawer.images') }}</div>
        
        <!-- Profile Image -->
        <div class="mb-4">
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar size="48" color="grey-lighten-3">
              <v-img v-if="imagePreview" :src="imagePreview" cover />
              <v-icon v-else color="grey">mdi-account-circle</v-icon>
            </v-avatar>
            <div class="flex-1">
              <div class="text-sm font-weight-medium mb-1">{{ $t('dashboard.contacts.addDrawer.profileImage') }}</div>
              <div class="d-flex ga-2">
                <v-btn size="small" color="primary" @click="$refs.imageInput.click()" variant="tonal">
                  <v-icon size="16" class="mr-1">mdi-upload</v-icon>
                  {{ imagePreview ? $t('dashboard.contacts.addDrawer.change') : $t('dashboard.contacts.addDrawer.upload') }}
                </v-btn>
                <v-btn v-if="imagePreview" size="small" color="error" variant="tonal" @click="removeImage">
                  <v-icon size="16" class="mr-1">mdi-delete</v-icon>
                  {{ $t('dashboard.contacts.addDrawer.remove') }}
                </v-btn>
              </div>
            </div>
          </div>
          <input ref="imageInput" type="file" class="d-none" accept="image/*" @change="(e) => onFileChange(e, 'image')" />
        </div>

        <!-- Company Logo -->
        <div>
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar size="48" color="grey-lighten-3">
              <v-img v-if="logoPreview" :src="logoPreview" contain />
              <v-icon v-else color="grey">mdi-domain</v-icon>
            </v-avatar>
            <div class="flex-1">
              <div class="text-sm font-weight-medium mb-1">{{ $t('dashboard.contacts.addDrawer.companyLogo') }}</div>
              <div class="d-flex ga-2">
                <v-btn size="small" color="secondary" @click="$refs.logoInput.click()" variant="tonal">
                  <v-icon size="16" class="mr-1">mdi-upload</v-icon>
                  {{ logoPreview ? $t('dashboard.contacts.addDrawer.change') : $t('dashboard.contacts.addDrawer.upload') }}
                </v-btn>
                <v-btn v-if="logoPreview" size="small" color="error" variant="tonal" @click="removeLogo">
                  <v-icon size="16" class="mr-1">mdi-delete</v-icon>
                  {{ $t('dashboard.contacts.addDrawer.remove') }}
                </v-btn>
              </div>
            </div>
          </div>
          <input ref="logoInput" type="file" class="d-none" accept="image/*" @change="(e) => onFileChange(e, 'logo')" />
        </div>
      </div>

      <!-- Basic info -->
      <v-text-field v-model="form.name" :label="$t('dashboard.contacts.addDrawer.fullName')" :rules="validationRules.name" prepend-inner-icon="mdi-account" class="mb-3" />
      <v-text-field v-model="form.title" :label="$t('dashboard.contacts.addDrawer.title')" prepend-inner-icon="mdi-briefcase-outline" class="mb-3" />
      <v-text-field v-model="form.company" :label="$t('dashboard.contacts.addDrawer.company')" prepend-inner-icon="mdi-domain" class="mb-3" />
      <v-text-field v-model="form.department" :label="$t('dashboard.contacts.addDrawer.department')" prepend-inner-icon="mdi-account-group-outline" class="mb-3" />

      <div class="d-flex ga-3 align-center mb-4">
        <v-switch
          v-model="form.is_active"
          :label="form.is_active ? $t('dashboard.contacts.addDrawer.active') : $t('dashboard.contacts.addDrawer.inactive')"
          color="success"
          inset
          hide-details
          density="comfortable"
        />
        <v-spacer />
        <v-select
          v-model="form.associated_card_id"
          :items="cardOptions"
          :loading="isCardsLoading"
          :label="$t('dashboard.contacts.addDrawer.associatedCard')"
          item-title="title"
          item-value="value"
          clearable
          density="comfortable"
          style="max-width: 320px"
          prepend-inner-icon="mdi-card-account-details-outline"
        />
      </div>

      <!-- Emails -->
      <div class="mb-6">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-subtitle-1 font-weight-600">{{ $t('dashboard.contacts.addDrawer.emails') }}</div>
          <v-btn size="small" color="primary" variant="tonal" @click="addEmail" prepend-icon="mdi-plus">{{ $t('dashboard.contacts.addDrawer.addEmail') }}</v-btn>
        </div>
        <div class="d-flex flex-column ga-3">
          <div v-for="(item, idx) in form.emails" :key="'email-' + idx" class="d-flex ga-2 align-start">
            <v-text-field
              v-model="item.email"
              :label="$t('dashboard.contacts.addDrawer.email')"
              :rules="validationRules.email"
              class="flex-1"
              prepend-inner-icon="mdi-email-outline"
            />
            <v-text-field v-model="item.label" :label="$t('dashboard.contacts.addDrawer.label')" style="max-width: 220px" prepend-inner-icon="mdi-tag-outline" />
            <v-btn icon color="error" variant="text" @click="removeEmail(idx)" :disabled="form.emails.length === 1">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Phones -->
      <div class="mb-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-subtitle-1 font-weight-600">{{ $t('dashboard.contacts.addDrawer.phones') }}</div>
          <v-btn size="small" color="primary" variant="tonal" @click="addPhone" prepend-icon="mdi-plus">{{ $t('dashboard.contacts.addDrawer.addPhone') }}</v-btn>
        </div>
        <div class="d-flex flex-column ga-3">
          <div v-for="(item, idx) in form.phones" :key="'phone-' + idx" class="d-flex ga-2 align-start">
            <v-text-field
              v-model="item.phone"
              :label="$t('dashboard.contacts.addDrawer.phone')"
              class="flex-1"
              prepend-inner-icon="mdi-phone-outline"
            />
            <v-text-field v-model="item.ext" :label="$t('dashboard.contacts.addDrawer.ext')" style="max-width: 120px" prepend-inner-icon="mdi-dialpad" />
            <v-text-field v-model="item.label" :label="$t('dashboard.contacts.addDrawer.label')" style="max-width: 200px" prepend-inner-icon="mdi-tag-outline" />
            <v-btn icon color="error" variant="text" @click="removePhone(idx)" :disabled="form.phones.length === 1">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Actions -->
      <div class="d-flex ga-3">
        <v-btn color="primary" class="flex-1" :loading="isSubmitting" @click="onSubmit">
          <template #prepend><v-icon>mdi-content-save</v-icon></template>
          {{ $t('dashboard.contacts.addDrawer.save') }}
        </v-btn>
        <v-btn color="white" class="border" @click="close">{{ $t('dashboard.contacts.addDrawer.cancel') }}</v-btn>
      </div>
    </v-form>
  </v-navigation-drawer>
</template>

<style scoped>
.contact-drawer :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}
.d-none {
  display: none !important;
}
.font-weight-600 {
  font-weight: 600;
}
</style>
