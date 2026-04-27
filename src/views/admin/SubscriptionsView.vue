<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useToast } from 'vue-toastification'

// Store
const subscriptionsStore = useSubscriptionsStore()
const toast = useToast()

// Reactive data
const search = ref('')
const searchTimeout = ref(null)
const showDeleteDialog = ref(false)
const subscriptionToDelete = ref(null)

// DataTable headers
const headers = ref([
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'User', key: 'user_name', sortable: true },
  { title: 'Plan', key: 'plan_name', sortable: true, width: '150px' },
  { title: 'Price', key: 'price', sortable: true, width: '100px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Start Date', key: 'start_at', sortable: true, width: '120px' },
  { title: 'End Date', key: 'end_at', sortable: true, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
])

// Computed properties
const transformedSubscriptions = computed(() => {
  return subscriptionsStore.subscriptions.map(subscription => ({
    id: subscription.id,
    user_name: subscription.user?.name || 'N/A',
    user_email: subscription.user?.email || 'N/A',
    plan_name: subscription.plan_name || 'N/A',
    price: subscription.price ? `$${subscription.price}` : 'N/A',
    status: subscription.status,
    start_at: subscription.start_at ? new Date(subscription.start_at).toLocaleDateString() : 'N/A',
    end_at: subscription.end_at ? new Date(subscription.end_at).toLocaleDateString() : 'N/A',
    is_active: subscription.status === 'active',
    raw: subscription // Keep original data for actions
  }))
})

// Methods
const fetchSubscriptions = async () => {
  try {
    await subscriptionsStore.fetchSubscriptions()
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  }
}

const handleSearch = () => {
  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Set new timeout for debounced search
  searchTimeout.value = setTimeout(async () => {
    try {
      await subscriptionsStore.searchSubscriptions(search.value)
    } catch (error) {
      console.error('Error searching subscriptions:', error)
    }
  }, 500)
}

const handlePageChange = async (page) => {
  subscriptionsStore.pagination.current_page = page
  await fetchSubscriptions()
}

const confirmDeleteSubscription = (subscription) => {
  subscriptionToDelete.value = subscription
  showDeleteDialog.value = true
}

const deleteSubscription = async () => {
  if (!subscriptionToDelete.value) return

  try {
    await subscriptionsStore.deleteSubscription(subscriptionToDelete.value.id)
    showDeleteDialog.value = false
    subscriptionToDelete.value = null
  } catch (error) {
    console.error('Error deleting subscription:', error)
  }
}

const toggleSubscriptionStatus = async (subscription) => {
  try {
    await subscriptionsStore.toggleSubscriptionStatus(subscription.id)
  } catch (error) {
    console.error('Error toggling subscription status:', error)
  }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success'
    case 'inactive':
    case 'cancelled':
      return 'error'
    case 'pending':
      return 'warning'
    case 'expired':
      return 'grey'
    default:
      return 'grey'
  }
}

const getPlanColor = (planName) => {
  switch (planName?.toLowerCase()) {
    case 'premium':
    case 'pro':
      return 'warning'
    case 'basic':
      return 'primary'
    case 'enterprise':
      return 'purple'
    default:
      return 'grey'
  }
}

// Watch for search changes
watch(search, handleSearch)

// Lifecycle
onMounted(() => {
  fetchSubscriptions()
})
</script>

<template>
  <!-- Subscriptions DataTable -->
  <v-row justify="center" class="mb-16">
    <v-col cols="12">
      <v-card class="glass-light border" elevation="0" rounded="xl">
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
          <div class="text-lg font-weight-medium">All Subscriptions ({{ subscriptionsStore.subscriptions.length }})</div>
          <div class="d-flex align-center ga-2 w-50">
            <v-btn color="primary" variant="elevated" :to="{ name: 'admin.subscriptions.create' }" prepend-icon="mdi-plus">
              Create New Subscription
            </v-btn>
            <v-text-field
              v-model="search"
              color="primary"
              label="Search subscriptions..."
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              :loading="subscriptionsStore.isLoading"
              class="mb-0"
            />
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="transformedSubscriptions"
          :loading="subscriptionsStore.isLoading"
          :items-per-page="subscriptionsStore.pagination.per_page"
          :page="subscriptionsStore.pagination.current_page"
          :items-length="subscriptionsStore.pagination.total"
          class="subscriptions-table"
          @update:page="handlePageChange"
        >
          <!-- ID Column -->
          <template #item.id="{ item }">
            <v-chip size="small" color="grey" variant="tonal">
              #{{ item.id }}
            </v-chip>
          </template>

          <!-- User Column -->
          <template #item.user_name="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.user_name }}</div>
              <div class="text-caption text-muted">{{ item.user_email }}</div>
            </div>
          </template>

          <!-- Plan Column -->
          <template #item.plan_name="{ item }">
            <v-chip
              :color="getPlanColor(item.plan_name)"
              size="small"
              variant="tonal"
            >
              <v-icon size="16" class="mr-1">mdi-crown</v-icon>
              {{ item.plan_name }}
            </v-chip>
          </template>

          <!-- Price Column -->
          <template #item.price="{ item }">
            <span class="font-weight-medium text-success">{{ item.price }}</span>
          </template>

          <!-- Status Column -->
          <template #item.status="{ item }">
            <v-switch
              :model-value="item.is_active"
              :loading="subscriptionsStore.isTogglingStatus"
              color="success"
              hide-details
              density="compact"
              @update:model-value="toggleSubscriptionStatus(item.raw)"
            />
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-tooltip text="Delete Subscription">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    :loading="subscriptionsStore.isDeleting"
                    @click="confirmDeleteSubscription(item)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>

          <!-- Loading slot -->
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>

          <!-- No data slot -->
          <template #no-data>
            <div class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">
                mdi-crown-off
              </v-icon>
              <h3 class="text-h6 mb-2">No Subscriptions Found</h3>
              <p class="text-muted">
                {{ search ? 'Try adjusting your search criteria' : 'No subscriptions have been created yet' }}
              </p>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="500">
    <v-card class="glass-light border" rounded="xl">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center ga-3">
          <v-icon color="error" size="28">mdi-delete-alert</v-icon>
          <span class="text-lg font-weight-bold">Delete Subscription</span>
        </div>
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <p class="text-muted mb-4">
          Are you sure you want to delete subscription
          <strong>#{{ subscriptionToDelete?.id }}</strong> for
          <strong>{{ subscriptionToDelete?.user_name }}</strong>?
        </p>
        <v-alert type="warning" variant="tonal" class="mb-0">
          This action cannot be undone. The subscription will be permanently deleted.
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="showDeleteDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          :loading="subscriptionsStore.isDeleting"
          @click="deleteSubscription"
        >
          Delete Subscription
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.subscriptions-table :deep(.v-data-table__wrapper) {
  border-radius: 0 0 12px 12px;
}

.subscriptions-table :deep(.v-data-table-header) {
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.subscriptions-table :deep(.v-data-table-rows-no-data) {
  background-color: transparent;
}
</style>
