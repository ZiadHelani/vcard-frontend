<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import http from '@/plugins/api/http-common'
import { validationRules } from '@/utils/validation'
import { useI18n } from '@/composables/useI18n'

const authStore = useAuthStore()
const { t } = useI18n()
const { currentUser, userName, userEmail, userAvatar } = storeToRefs(authStore)
const toast = useToast()

const formRef = ref()
const isSubmitting = ref(false)

const form = ref({
  name: '',
  email: '',
  image: null,
})

const imagePreview = ref('')

const initFromStore = () => {
  form.value.name = userName.value || ''
  form.value.email = userEmail.value || ''
  imagePreview.value = userAvatar.value || '/avatar.jpg'
}

onMounted(async () => {
  if (!currentUser.value) {
    try {
      await authStore.refreshUser()
    } catch (e) {}
  }
  initFromStore()
})

const onImageSelected = (fileOrFiles) => {
  const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  form.value.image = file || null
  if (file) {
    try {
      imagePreview.value = URL.createObjectURL(file)
    } catch (e) {}
  } else {
    imagePreview.value = userAvatar.value || '/avatar.jpg'
  }
}

const nameRules = validationRules.name

const submit = async () => {
  const res = await formRef.value?.validate()
  if (!res?.valid) return

  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    // Do not send email; email is immutable via UI
    if (form.value.image) fd.append('image', form.value.image)

    await http.post('/user/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    await authStore.refreshUser()
    initFromStore()
    toast.success(t('dashboard.account.toast.updateSuccess'))
  } catch (e) {
    const msg = e?.response?.data?.message || t('dashboard.account.toast.updateError')
    toast.error(msg)
  } finally {
    isSubmitting.value = false
  }
}

// Change password dialog
const pwdDialog = ref(false)
const pwdFormRef = ref()
const pwdSubmitting = ref(false)
const pwd = ref({ new: '', confirm: '' })

const passwordRules = validationRules.password
const confirmRules = validationRules.passwordConfirmation(computed(() => pwd.value.new))

const openPwdDialog = () => {
  pwd.value = { new: '', confirm: '' }
  pwdDialog.value = true
}

const submitPassword = async () => {
  const r = await pwdFormRef.value?.validate()
  if (!r?.valid) return
  pwdSubmitting.value = true
  try {
    await http.patch('/user/change-password', {
      password: pwd.value.new,
      password_confirmation: pwd.value.confirm,
    })
    toast.success(t('dashboard.account.toast.passwordSuccess'))
    pwdDialog.value = false
  } catch (e) {
    const msg = e?.response?.data?.message || t('dashboard.account.toast.passwordError')
    toast.error(msg)
  } finally {
    pwdSubmitting.value = false
  }
}
</script>

<template>
  <div class="account-view">
    <v-container class="py-6">
      <h1 class="text-2xl font-weight-bold mb-1">{{ $t('dashboard.account.title') }}</h1>
      <p class="text-muted mb-6">{{ $t('dashboard.account.subtitle') }}</p>

      <v-card elevation="0" border class="rounded-xl">
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md="4">
                <div class="d-flex flex-column align-center">
                  <v-avatar size="110">
                    <v-img :src="imagePreview" alt="Avatar" cover></v-img>
                  </v-avatar>
                  <v-label class="text-xs text-black font-weight-bold mt-4" for="account-photo">
                    {{ $t('dashboard.account.photoLabel') }} (600x600)px
                  </v-label>
                  <v-file-upload
                    clearable
                    id="account-photo"
                    accept="image/*"
                    density="compact"
                    color="transparent"
                    show-size
                    rounded="lg"
                    class="mt-2 px-2"
                    @update:model-value="onImageSelected"
                  >
                  </v-file-upload>
                </div>
              </v-col>

              <v-col cols="12" md="8">
                <div class="form-group">
                  <v-label class="text-xs text-black font-weight-bold" for="name"
                    >{{ $t('dashboard.account.nameLabel') }}
                  </v-label>
                  <v-text-field
                    id="name"
                    v-model="form.name"
                    :rules="nameRules"
                    :placeholder="$t('dashboard.account.namePlaceholder')"
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
                  <v-label class="text-xs text-black font-weight-bold" for="email"
                    >{{ $t('dashboard.account.emailLabel') }}
                  </v-label>
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
                  <div class="text-xs text-muted">
                    {{ $t('dashboard.account.emailReadonlyNote') }}
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex ga-3">
                  <v-btn size="small" color="primary" :loading="isSubmitting" @click="submit">
                    <template #prepend>
                      <v-icon>mdi-content-save</v-icon>
                    </template>
                    {{ $t('dashboard.account.saveChanges') }}
                  </v-btn>
                  <v-btn size="small" color="white" class="border" @click="initFromStore">
                    {{ $t('dashboard.account.reset') }}
                  </v-btn>
                  <v-spacer />
                  <v-btn size="small" color="white" class="border" @click="openPwdDialog">
                    <template #prepend>
                      <v-icon>mdi-lock-reset</v-icon>
                    </template>
                    {{ $t('dashboard.account.resetPassword') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Change Password Dialog -->
      <v-dialog v-model="pwdDialog" max-width="520">
        <v-card>
          <v-card-title class="text-h6"
            >{{ $t('dashboard.account.dialog.changePassword') }}
          </v-card-title>
          <v-card-text>
            <v-form ref="pwdFormRef">
              <v-label class="text-xs text-black font-weight-bold" for="new-pwd">
                {{ $t('dashboard.account.dialog.newPassword') }}
              </v-label>
              <v-text-field
                id="new-pwd"
                v-model="pwd.new"
                :rules="passwordRules"
                type="password"
                placeholder="**********"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />
              <v-label class="text-xs text-black font-weight-bold" for="confirm-pwd">
                {{ $t('dashboard.account.dialog.confirmPassword') }}
              </v-label>
              <v-text-field
                id="confirm-pwd"
                v-model="pwd.confirm"
                :rules="confirmRules"
                placeholder="**********"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                density="comfortable"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="white" class="border" @click="pwdDialog = false">
              <span class="text-black">
                {{ $t('dashboard.account.dialog.cancel') }}
              </span>
            </v-btn>
            <v-btn color="primary" :loading="pwdSubmitting" @click="submitPassword">
              {{ $t('dashboard.account.dialog.updatePassword') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<style scoped>
.account-view .text-muted {
  color: rgba(0, 0, 0, 0.6);
}
</style>
