<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'vue-toastification'

// Store
const usersStore = useUsersStore()
const toast = useToast()

// Reactive data
const search = ref('')
const searchTimeout = ref(null)
const selectedUsers = ref([])
const showDeleteDialog = ref(false)
const userToDelete = ref(null)

// DataTable headers
const headers = ref([
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true, width: '120px' },
  { title: 'Verified', key: 'is_verified', sortable: true, width: '100px' },
  { title: 'Subscription', key: 'has_active_subscription', sortable: true, width: '120px' },
  { title: 'Joined', key: 'created_at', sortable: true, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
])

// Computed properties
const transformedUsers = computed(() => {
  return usersStore.users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified,
    has_active_subscription: user.has_active_subscription,
    active_subscription_now: user.active_subscription_now || null,
    created_at: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
    image: user.image,
    raw: user // Keep original data for actions
  }))
})

// Methods
const fetchUsers = async () => {
  try {
    await usersStore.fetchUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
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
      await usersStore.searchUsers(search.value)
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }, 500)
}

const handlePageChange = async (page) => {
  usersStore.pagination.current_page = page
  await fetchUsers()
}


const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    await usersStore.deleteUser(userToDelete.value.id)
    showDeleteDialog.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const toggleUserStatus = async (user) => {
  try {
    await usersStore.toggleUserStatus(user.id)
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

const toggleUserVerification = async (user) => {
  try {
    await usersStore.toggleUserVerification(user.id)
  } catch (error) {
    console.error('Error toggling user verification:', error)
  }
}

const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'error'
    case 'user':
      return 'primary'
    default:
      return 'grey'
  }
}

const getSubscriptionColor = (hasSubscription) => {
  return hasSubscription ? 'warning' : 'grey'
}

// Watch for search changes
watch(search, handleSearch)

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <!-- Users DataTable -->
  <v-row justify="center" class="mb-16">
    <v-col cols="12">
      <v-card class="glass-light border" elevation="0" rounded="xl">
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
          <div class="text-lg font-weight-medium">All Users ({{ usersStore.users.length }})</div>
          <div class="d-flex align-center ga-2 w-50">
            <v-btn color="primary" variant="elevated" :to="{ name: 'admin.users.create' }" prepend-icon="mdi-plus">
              Create New User
            </v-btn>
            <v-text-field v-model="search" color="primary" label="Search users..." variant="outlined"
              prepend-inner-icon="mdi-magnify" clearable :loading="usersStore.isLoading" class="mb-0" />
          </div>
        </div>

        <v-data-table :headers="headers" :items="transformedUsers" :loading="usersStore.isLoading"
          :items-per-page="usersStore.pagination.per_page" :page="usersStore.pagination.current_page"
          :items-length="usersStore.pagination.total" class="users-table" @update:page="handlePageChange">
          <!-- ID Column -->
          <template #item.id="{ item }">
            <v-chip size="small" color="grey" variant="tonal">
              #{{ item.id }}
            </v-chip>
          </template>

          <!-- Name Column with Avatar -->
          <template #item.name="{ item }">
            <div class="d-flex align-center ga-3">
              <v-avatar size="32" :color="item.image ? undefined : 'primary'">
                <v-img v-if="item.image" :src="item.image" />
                <span v-else class="text-caption font-weight-bold">
                  {{ item.name.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.name }}</div>
              </div>
            </div>
          </template>

          <!-- Role Column -->
          <template #item.role="{ item }">
            <v-chip :color="getRoleColor(item.role)" size="small" variant="tonal">
              {{ item.role }}
            </v-chip>
          </template>

          <!-- Verified Column -->
          <template #item.is_verified="{ item }">
            <v-switch :model-value="item.is_verified" :loading="usersStore.isTogglingStatus" color="success"
              hide-details density="compact" @update:model-value="toggleUserVerification(item.raw)">
            </v-switch>
          </template>

          <!-- Subscription Column -->
          <template #item.has_active_subscription="{ item }">
            <v-chip :color="getSubscriptionColor(item.has_active_subscription)" size="small" variant="tonal">
              <v-icon size="16" class="mr-1">
                {{ item.has_active_subscription ? 'mdi-crown' : 'mdi-crown-outline' }}
              </v-icon>
              {{ item.has_active_subscription ? item.active_subscription_now?.plan_name : 'Free' }}
            </v-chip>
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-tooltip text="Delete User">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-delete" size="small" variant="text" color="error"
                    :loading="usersStore.isDeleting" @click="confirmDeleteUser(item)" />
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
                mdi-account-off
              </v-icon>
              <h3 class="text-h6 mb-2">No Users Found</h3>
              <p class="text-muted">
                {{ search ? 'Try adjusting your search criteria' : 'No users have been registered yet' }}
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
          <span class="text-lg font-weight-bold">Delete User</span>
        </div>
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <p class="text-muted mb-4">
          Are you sure you want to delete user
          <strong>{{ userToDelete?.name }}</strong>?
        </p>
        <v-alert type="warning" variant="tonal" class="mb-0">
          This action cannot be undone. All user data will be permanently deleted.
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn variant="outlined" @click="showDeleteDialog = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="elevated" :loading="usersStore.isDeleting" @click="deleteUser">
          Delete User
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.users-table :deep(.v-data-table__wrapper) {
  border-radius: 0 0 12px 12px;
}

.users-table :deep(.v-data-table-header) {
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.users-table :deep(.v-data-table-rows-no-data) {
  background-color: transparent;
}
</style>
