<template>
  <div class="contact">
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0">
        <h1 class="text-3xl gradient-title mb-0">Contact Management</h1>
        <p class="text-muted text-sm">Manage your professional connections and leads</p>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0 text-end">
        <div class="d-flex align-center ga-3 justify-end h-100">
          <v-btn size="small" color="success" class="float-on-hover" id="add-contact-btn" @click="openDrawer">
            <template #prepend>
              <v-icon class="text-white">mdi-plus</v-icon>
            </template>
            <span class="text-capitalize text-white"> Add Contact </span>
          </v-btn>
          <v-btn size="small" color="white" class="border" prepend-icon="mdi-download">
            <span class="text-capitalize"> Import </span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <AddContactDrawer v-model="drawer" @contact-added="fetchContacts" />

    <SkeletonLoader v-if="isLoading" />
    <v-row class="mt-2" align="stretch" v-if="!isLoading">
      <!-- Analytics Metric Cards -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">Total Contacts</div>
              <div class="text-xl font-weight-bold">{{ stats.totalContacts || 0 }}</div>
              <div class="text-muted text-success text-sm mt-1">+15%</div>
            </div>
            <v-avatar size="44" variant="tonal" color="primary">
              <v-icon icon="mdi-account-multiple-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <!-- Other metric cards... -->
    </v-row>

    <v-card elevation="0" border class="rounded-xl mt-6">
      <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
        <div class="text-lg font-weight-medium">All Contacts ({{ filtered.length }})</div>
        <div class="d-flex align-center ga-2">
          <v-text-field
            color="primary"
            v-model="search"
            density="comfortable"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="search-field"
            placeholder="Search contacts..."
          />
          <v-btn color="white" class="border" prepend-icon="mdi-filter-variant">
            <span class="text-capitalize text-sm">Filters</span>
          </v-btn>
          <v-btn color="white" class="border" append-icon="mdi-chevron-down">
            <span class="text-capitalize text-sm">All Sources</span>
          </v-btn>
        </div>
      </div>

      <v-divider></v-divider>

      <v-data-table
        color="primary"
        :headers="headers"
        :items="filtered"
        item-key="id"
        class="contacts-table"
        :items-per-page="pagination.per_page"
        :loading="isLoading"
        hide-default-footer
        show-select
        hover
        density="comfortable"
        loading-text="Loading contacts..."
      >
        <!-- Data table templates... -->
      </v-data-table>

      <!-- Pagination -->
      <v-card-actions v-if="pagination.total > pagination.per_page" class="justify-center">
        <v-pagination
          v-model="pagination.current_page"
          :length="pagination.last_page"
          :total-visible="7"
          @update:model-value="handlePageChange"
          :disabled="isLoading"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import { storeToRefs } from 'pinia'
import SkeletonLoader from '@/components/Dashboard/Loading/SkeletonLoader.vue'
import AddContactDrawer from '@/components/Dashboard/Contact/AddContactDrawer.vue'

const contactsStore = useContactsStore()
const { contacts, isLoading, pagination, stats } = storeToRefs(contactsStore)

const drawer = ref(false)
const search = ref('')

// Fetch contacts on component mount
onMounted(async () => {
  await fetchContacts()
})

// Fetch contacts function
const fetchContacts = async () => {
  try {
    await contactsStore.fetchContacts()
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
  }
}

// Open drawer function
const openDrawer = () => {
  drawer.value = true
}

// Handle pagination change
const handlePageChange = async (page) => {
  await contactsStore.fetchContacts({ page })
}

// Filtered contacts computed property
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return contacts.value
  return contacts.value.filter(contact =>
    [contact.name, contact.company, contact.title]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
})
</script>

<style scoped>
.contact .text-muted {
  color: rgba(0, 0, 0, 0.54);
}
</style>