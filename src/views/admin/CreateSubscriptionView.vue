<template>
  <v-row justify="center" class="mb-16">
    <v-col cols="12" lg="8" md="10">
      <v-card class="glass-light border" elevation="0" rounded="xl">
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
          <div class="d-flex align-center ga-3">
            <v-btn icon="mdi-arrow-left" variant="text" :to="{ name: 'admin.subscriptions' }" />
            <div>
              <div class="text-lg font-weight-medium">Create New Subscription</div>
              <div class="text-caption text-muted">Assign a plan to a user with start and end dates</div>
            </div>
          </div>
        </div>

        <v-divider />

        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="handleCreateSubscription">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="user">
                  User
                </v-label>
                <v-select
                  v-model="form.user_id"
                  id="user"
                  :items="userItems"
                  item-title="label"
                  item-value="id"
                  placeholder="Select user"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  color="primary"
                  :flat="false"
                  rounded="lg"
                  density="comfortable"
                  :loading="usersLoading"
                  :disabled="usersLoading"
                  clearable
                  :error-messages="errors.user_id"
                  @update:model-value="errors.user_id = []"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="plan">
                  Plan
                </v-label>
                <v-select
                  v-model="form.plan_id"
                  id="plan"
                  :items="plans"
                  item-title="name"
                  item-value="id"
                  placeholder="Select plan"
                  prepend-inner-icon="mdi-crown-outline"
                  variant="outlined"
                  color="primary"
                  :flat="false"
                  rounded="lg"
                  density="comfortable"
                  :loading="plansLoading"
                  :disabled="plansLoading"
                  clearable
                  :error-messages="errors.plan_id"
                  @update:model-value="errors.plan_id = []"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="fromDate">
                  From
                </v-label>
                <v-text-field
                  v-model="form.from"
                  id="fromDate"
                  type="date"
                  prepend-inner-icon="mdi-calendar-start"
                  variant="outlined"
                  color="primary"
                  :flat="false"
                  rounded="lg"
                  density="comfortable"
                  :error-messages="errors.from"
                  @update:model-value="errors.from = []"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="text-xs text-black font-weight-bold" for="toDate">
                  To
                </v-label>
                <v-text-field
                  v-model="form.to"
                  id="toDate"
                  type="date"
                  prepend-inner-icon="mdi-calendar-end"
                  variant="outlined"
                  color="primary"
                  :flat="false"
                  rounded="lg"
                  density="comfortable"
                  :error-messages="errors.to"
                  @update:model-value="errors.to = []"
                />
              </v-col>

              <v-col cols="12">
                <div class="d-flex justify-end ga-3">
                  <v-btn variant="outlined" :to="{ name: 'admin.subscriptions' }">
                    Cancel
                  </v-btn>
                  <v-btn
                    :disabled="subscriptionsStore.isLoading"
                    :loading="subscriptionsStore.isLoading"
                    type="submit"
                    color="primary"
                    variant="elevated"
                  >
                    Create Subscription
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
import { ref, computed, onMounted } from 'vue'
import { subscriptionAPI, adminUserAPI } from '@/plugins/api/endpoints'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const subscriptionsStore = useSubscriptionsStore()
const router = useRouter()
const toast = useToast()

const form = ref({
  user_id: null,
  plan_id: null,
  from: '',
  to: '',
})

const errors = ref({
  user_id: [],
  plan_id: [],
  from: [],
  to: [],
})

const usersList = ref([])
const usersLoading = ref(false)
const usersPagination = ref({
  current_page: 1,
  per_page: 100,
  total: 0,
  last_page: 1,
})

const userItems = computed(() => {
  return usersList.value.map((u) => ({
    id: u.id,
    label: `${u.name} (${u.email})`,
  }))
})

const plans = ref([])
const plansLoading = ref(false)

const fetchUsers = async (page = 1) => {
  usersLoading.value = true
  try {
    const response = await adminUserAPI.getAllUsers({
      page,
      per_page: usersPagination.value.per_page,
    })
    const data = response?.data
    if (data?.users) {
      const usersData = data.users
      const list = usersData.data || []
      if (page === 1) {
        usersList.value = list
      } else {
        usersList.value = [...usersList.value, ...list]
      }
      usersPagination.value = {
        current_page: usersData.current_page || 1,
        per_page: usersData.per_page || 100,
        total: usersData.total || 0,
        last_page: usersData.last_page || 1,
      }
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    usersList.value = []
  } finally {
    usersLoading.value = false
  }
}

const fetchPlans = async () => {
  plansLoading.value = true
  try {
    const response = await subscriptionAPI.getPlans()
    const data = response?.data
    const list = data?.plans ?? data?.data ?? []
    plans.value = Array.isArray(list) ? list : []
  } catch (error) {
    console.error('Failed to fetch plans:', error)
    plans.value = []
  } finally {
    plansLoading.value = false
  }
}

onMounted(() => {
  fetchUsers(1)
  fetchPlans()
})

const formRef = ref()

const handleCreateSubscription = async () => {
  errors.value = { user_id: [], plan_id: [], from: [], to: [] }

  const payload = {
    user_id: form.value.user_id,
    plan_id: form.value.plan_id,
    from: form.value.from,
    to: form.value.to,
  }

  const hasEmpty = !payload.user_id || !payload.plan_id || !payload.from || !payload.to
  if (hasEmpty) {
    toast.error('Please fill in all required fields')
    if (!payload.user_id) errors.value.user_id = ['User is required']
    if (!payload.plan_id) errors.value.plan_id = ['Plan is required']
    if (!payload.from) errors.value.from = ['Start date is required']
    if (!payload.to) errors.value.to = ['End date is required']
    return
  }

  const response = await subscriptionsStore.createSubscription(payload)
  if (response.success) {
    toast.success(response.message)
    router.push({ name: 'admin.subscriptions' })
  } else {
    toast.error(response.message)
    const errBag = response.errors || {}
    errors.value = {
      user_id: Array.isArray(errBag.user_id) ? errBag.user_id : [],
      plan_id: Array.isArray(errBag.plan_id) ? errBag.plan_id : [],
      from: Array.isArray(errBag.from) ? errBag.from : [],
      to: Array.isArray(errBag.to) ? errBag.to : [],
    }
  }
}
</script>
