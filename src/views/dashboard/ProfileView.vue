<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import http from '@/plugins/api/http-common'
import { validationRules } from '@/utils/validation'

const authStore = useAuthStore()
const { currentUser, userName, userEmail, userAvatar } = storeToRefs(authStore)
const toast = useToast()

const formRef = ref()
const isSubmitting = ref(false)

const form = ref({
  name: '',
  email: '',
  image: null, // File
})

const imagePreview = ref('')

const initFromStore = () => {
  form.value.name = userName.value || ''
  form.value.email = userEmail.value || ''
  imagePreview.value = userAvatar.value || '/avatar.jpg'
}

onMounted(async () => {
  if (!currentUser.value) {
    try { await authStore.refreshUser() } catch (e) {}
  }
  initFromStore()
})

const onImageSelected = (fileOrFiles) => {
  const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  form.value.image = file || null
  if (file) {
    try { imagePreview.value = URL.createObjectURL(file) } catch (e) {}
  } else {
    imagePreview.value = userAvatar.value || '/avatar.jpg'
  }
}

const nameRules = validationRules.name
const emailRules = validationRules.email

const submit = async () => {
  const res = await formRef.value?.validate()
  if (!res?.valid) return

  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    // Email is not editable from UI; do not send email here
    if (form.value.image) fd.append('image', form.value.image)

    await http.post('/user/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    await authStore.refreshUser()
    initFromStore()
    toast.success('Profile updated successfully')
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to update profile'
    toast.error(msg)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="profile-view">
    <v-container class="py-6">
      <h1 class="text-2xl font-weight-bold mb-1">My Profile</h1>
      <p class="text-muted mb-6">Update your personal information and profile image</p>

      <v-card elevation="0" border class="rounded-xl">
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md="4">
                <div class="d-flex flex-column align-center">
                  <v-avatar size="110">
                    <v-img :src="imagePreview" alt="Avatar" cover></v-img>
                  </v-avatar>
                  <v-label class="text-xs text-black font-weight-bold mt-4" for="profile-image">Profile Image (600x600)px</v-label>
                  <v-file-input
                    id="profile-image"
                    accept="image/*"
                    prepend-inner-icon="mdi-account"
                    color="primary"
                    variant="outlined"
                    density="comfortable"
                    :show-size="true"
                    :clearable="true"
                    rounded="lg"
                    :flat="false"
                    class="mt-2"
                    @update:model-value="onImageSelected"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="8">
                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="name">Full Name</v-label>
                  <v-text-field
                    id="name"
                    v-model="form.name"
                    :rules="nameRules"
                    placeholder="Enter your name"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    color="primary"
                    :flat="false"
                    rounded="lg"
                    density="comfortable"
                    class="mb-4"
                  />
                </div>

                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="email">Email</v-label>
                  <v-text-field
                    id="email"
                    v-model="form.email"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    color="primary"
                    :flat="false"
                    rounded="lg"
                    density="comfortable"
                    class="mb-1"
                    readonly
                    disabled
                  />
                  <div class="text-xs text-muted">Email changes require support. Please contact support to update your email.</div>
                </div>

                <div class="d-flex ga-3 mt-4">
                  <v-btn size="small" color="primary" :loading="isSubmitting" @click="submit">
                    <template #prepend><v-icon>mdi-content-save</v-icon></template>
                    Save Changes
                  </v-btn>
                  <v-btn size="small" color="white" class="border" @click="initFromStore">Reset</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.profile-view .text-muted { color: rgba(0,0,0,0.6); }
</style>
