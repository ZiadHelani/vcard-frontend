<template>
  <v-row justify="center" class="mb-16">
    <v-col cols="12" lg="8" md="10">
      <v-card class="glass-light border" elevation="0" rounded="xl">
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
          <div class="d-flex align-center ga-3">
            <v-btn icon="mdi-arrow-left" variant="text" :to="{ name: 'admin.users' }" />
            <div>
              <div class="text-lg font-weight-medium">Create New User</div>
              <div class="text-caption text-muted">Fill basic info and subscription plan</div>
            </div>
          </div>
        </div>

        <v-divider />

        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="handleCreateUser">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="name">
                  Name
                </v-label>
                <v-text-field v-model="form.name" id="name" placeholder="Full name" prepend-inner-icon="mdi-account"
                  variant="outlined" color="primary" :flat="false" rounded="lg" density="comfortable" />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="email">
                  Email
                </v-label>
                <v-text-field v-model="form.email" id="email" placeholder="Email address" prepend-inner-icon="mdi-email"
                  variant="outlined" color="primary" :flat="false" rounded="lg" density="comfortable" type="email" />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="password">
                  Password
                </v-label>
                <v-text-field v-model="form.password" id="password" placeholder="Min 8 characters"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'" variant="outlined" color="primary" :flat="false"
                  rounded="lg" density="comfortable" @click:append-inner="showPassword = !showPassword" />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="plan">
                  Plan
                </v-label>
                <v-select v-model="form.plan_id" id="plan" :items="plans" item-title="name" item-value="id"
                  placeholder="Select plan" prepend-inner-icon="mdi-crown-outline" variant="outlined" color="primary"
                  :flat="false" rounded="lg" density="comfortable" :loading="plansLoading" :disabled="plansLoading" />
              </v-col>

              <v-col cols="12" md="12">
                <v-label class="text-xs text-black font-weight-bold" for="image">
                  Image
                </v-label>
                <v-file-input v-model="form.image" id="image" accept="image/*" prepend-inner-icon="mdi-image"
                  variant="outlined" color="primary" rounded="lg" density="comfortable" show-size clearable />
              </v-col>



              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="fromDate">
                  From
                </v-label>
                <v-text-field v-model="form.from" id="fromDate" type="date" prepend-inner-icon="mdi-calendar-start"
                  variant="outlined" color="primary" :flat="false" rounded="lg" density="comfortable" />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="toDate">
                  To
                </v-label>
                <v-text-field v-model="form.to" id="toDate" type="date" prepend-inner-icon="mdi-calendar-end"
                  variant="outlined" color="primary" :flat="false" rounded="lg" density="comfortable" />
              </v-col>

              <v-col cols="12">
                <div class="d-flex justify-end ga-3">
                  <v-btn variant="outlined" :to="{ name: 'admin.users' }">
                    Cancel
                  </v-btn>
                  <v-btn :disabled="usersStore.isLoading" :loading="usersStore.isLoading" type="submit" color="primary"
                    variant="elevated">
                    Create User
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { subscriptionAPI } from '@/plugins/api/endpoints'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const usersStore = useUsersStore()
const router = useRouter()

const toast = useToast()

const showPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  image: null,
  plan_id: null,
  from: '',
  to: '',
})

const plans = ref([])
const plansLoading = ref(false)

const fetchPlans = async () => {
  plansLoading.value = true
  try {
    const response = await subscriptionAPI.getPlans()
    const data = response?.data

    // supports: { plans: { data: [...] } } or { data: [...] }
    const list = data?.plans || []
    plans.value = Array.isArray(list) ? list : []
  } catch (error) {
    console.error('Failed to fetch plans:', error)
    plans.value = []
  } finally {
    plansLoading.value = false
  }
}

onMounted(() => {
  fetchPlans()
})

const formRef = ref()

const handleCreateUser = async () => {
  const res = await formRef.value?.validate()
  if (!res.valid) {

    toast.error('Please fill in all required fields')
    return
  }
  console.log(form.value)

  const response = await usersStore.createUser(form.value)
  if (response.success) {
    toast.success(response.message)
    router.push({ name: 'admin.users' })
  } else {
    toast.error(response.message)
    return
  }
}
</script>
