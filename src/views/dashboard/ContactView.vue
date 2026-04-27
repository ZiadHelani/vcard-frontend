<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import { storeToRefs } from 'pinia'
import SkeletonLoader from '@/components/Dashboard/Loading/SkeletonLoader.vue'
import ContactAddDrawer from '@/components/Dashboard/Contacts/ContactAddDrawer.vue'
import { useI18n } from '@/composables/useI18n'

// Store
const contactsStore = useContactsStore()
const { contacts, isLoading, pagination, stats, searchQuery, isTogglingActive } = storeToRefs(contactsStore)

// i18n
const { t } = useI18n()

// Search
const search = ref('')
const showAddDrawer = ref(false)

// Handle drawer close and refresh
const handleDrawerClose = async (created) => {
  showAddDrawer.value = false
  // Refetch contacts after successful creation to ensure data consistency
  if (created) {
    await contactsStore.fetchContacts()
  }
}

// Table headers
const headers = computed(() => ([
  { title: '', key: 'data-table-select' },
  { title: t('dashboard.contacts.table.headers.contact'), key: 'contact', sortable: true },
  { title: t('dashboard.contacts.table.headers.company'), key: 'company', sortable: true },
  { title: t('dashboard.contacts.table.headers.status'), key: 'is_active', sortable: true, align: 'center' },
  { title: t('dashboard.contacts.table.headers.tags'), key: 'tags', sortable: false },
  { title: t('dashboard.contacts.table.headers.lastContact'), key: 'lastContact', sortable: true },
  { title: t('dashboard.contacts.table.headers.actions'), key: 'actions', sortable: false, align: 'end' },
]))

// Transform server data to match UI expectations
const transformedContacts = computed(() => {
  return contacts.value.map(contact => ({
    id: contact.id,
    name: contact.name || t('dashboard.contacts.table.na'),
    email: contact.emails?.[0]?.email || t('dashboard.contacts.table.na'),
    phone: contact.phones?.[0]?.phone || t('dashboard.contacts.table.na'),
    avatar: contact.image || '',
    company: contact.company || t('dashboard.contacts.table.na'),
    title: contact.title || t('dashboard.contacts.table.na'),
    location: contact.department || t('dashboard.contacts.table.na'),
    is_active: contact.is_active || false,
    tags: [t('dashboard.contacts.table.tagDefault')], // Default tags
    lastContact: contact.created_at ? new Date(contact.created_at).toISOString().split('T')[0] : t('dashboard.contacts.table.na')
  }))
})

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return transformedContacts.value
  return transformedContacts.value.filter((c) =>
    [c.name, c.email, c.phone, c.company, c.title, c.location, ...(c.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})

// Fetch contacts on component mount
onMounted(async () => {
  try {
    await contactsStore.fetchContacts()
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
  }
})

// Watch search input and debounce API calls
watch(search, async (newValue) => {
  if (newValue.trim() !== searchQuery.value) {
    try {
      await contactsStore.searchContacts(newValue.trim())
    } catch (error) {
      console.error('Search failed:', error)
    }
  }
}, { debounce: 500 })

// Handle pagination change
const handlePageChange = async (page) => {
  try {
    await contactsStore.fetchContacts({ page })
  } catch (error) {
    console.error('Failed to load page:', error)
  }
}

// View contact details
const viewContact = async (contactId) => {
  try {
    await contactsStore.fetchContact(contactId)
    // You can add navigation to contact detail view here
    console.log('Viewing contact:', contactId)
  } catch (error) {
    console.error('Failed to load contact:', error)
  }
}

// Delete contact
const deleteContact = async (contactId) => {
  if (confirm(t('dashboard.contacts.deleteConfirm'))) {
    try {
      await contactsStore.deleteContact(contactId)
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }
}

// Toggle contact active status
const toggleContactActive = async (contactId) => {
  try {
    await contactsStore.toggleContactActive(contactId)
  } catch (error) {
    console.error('Failed to toggle contact status:', error)
  }
}
</script>

<template>
  <div class="contact">
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0">
        <h1 class="text-3xl gradient-title mb-0">{{ $t('dashboard.contacts.pageTitle') }}</h1>
        <p class="text-muted text-sm">{{ $t('dashboard.contacts.pageSubtitle') }}</p>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0 text-end">
        <div class="d-flex align-center ga-3 justify-end h-100">
          <v-btn size="small" color="success" class="float-on-hover" id="add-contact-btn" @click="showAddDrawer = true">
            <template #prepend>
              <v-icon class="text-white">mdi-plus</v-icon>
            </template>
            <span class="text-capitalize text-white"> {{ $t('dashboard.contacts.add') }} </span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <SkeletonLoader v-if="contactsStore.isLoading" />
    <!-- Analytics Metric Cards -->
    <v-row class="mt-2" align="stretch" v-if="!contactsStore.isLoading">
      <!-- Total Cards -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.contacts.metrics.total') }}</div>
              <div class="text-xl font-weight-bold">{{ stats.totalContacts || 0 }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="primary">
              <v-icon icon="mdi-account-multiple-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Total Views -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.contacts.metrics.newThisWeek') }}</div>
              <div class="text-xl font-weight-bold">{{ stats.newThisWeek || 0 }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="success">
              <v-icon icon="mdi-google-analytics"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Contacts Gained -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.contacts.metrics.active') }}</div>
              <div class="text-xl font-weight-bold">{{ stats.activeContacts || 0 }}</div>
            </div>
            <v-avatar size="44" variant="tonal" color="purple">
              <v-icon icon="mdi-check-circle-outline"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Shares -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="pa-5 rounded-xl h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-sm text-muted mb-0">{{ $t('dashboard.contacts.metrics.conversion') }}</div>
              <div class="text-xl font-weight-bold">{{ stats.conversionRate || 0 }}%</div>
            </div>
            <v-avatar size="44" variant="tonal" color="error">
              <v-icon icon="mdi-arrow-right-box"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contacts Here: Datatable -->
    <v-card elevation="0" border class="rounded-xl mt-6">
      <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
        <div class="text-lg font-weight-medium">{{ $t('dashboard.contacts.table.all') }} ({{ filtered.length }})</div>
        <div class="d-flex align-center ga-2">
          <v-text-field color="primary" v-model="search" density="comfortable" variant="outlined" hide-details
            prepend-inner-icon="mdi-magnify" class="search-field"
            :placeholder="$t('dashboard.contacts.table.searchPlaceholder')" />
        </div>
      </div>

      <v-divider></v-divider>

      <v-data-table color="primary" :headers="headers" :items="filtered" item-key="id" class="contacts-table"
        :items-per-page="pagination.per_page" :loading="isLoading" hide-default-footer show-select hover
        density="comfortable" :loading-text="$t('dashboard.contacts.table.loading')">
        <template #item.contact="{ item }">
          <div class="d-flex align-center ga-3 py-3">
            <v-avatar size="36">
              <v-img v-if="item.avatar" :src="item.avatar" cover></v-img>
              <v-icon v-else color="grey">mdi-account-circle</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-muted text-caption d-flex flex-column flex-wrap">
                <div class="d-flex align-center ga-1">
                  <v-icon size="14" color="grey">mdi-email-outline</v-icon>
                  <span>{{ item.email }}</span>
                </div>
                <div class="d-flex align-center ga-1">
                  <v-icon size="14" color="grey">mdi-phone-outline</v-icon>
                  <span>{{ item.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #item.company="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.company }}</div>
            <div class="text-muted d-flex flex-column flex-wrap">
              <div>
                <span>{{ item.title }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="16" color="grey">mdi-map-marker-outline</v-icon>
                <span>{{ item.location }}</span>
              </div>
            </div>
          </div>
        </template>

        <template #item.is_active="{ item }">
          <div class="d-flex justify-center">
            <v-switch :model-value="item.is_active" @update:model-value="toggleContactActive(item.id)"
              :loading="isTogglingActive" color="success" hide-details density="comfortable">
            </v-switch>
          </div>
        </template>

        <template #item.tags="{ item }">
          <div class="d-flex align-center flex-wrap ga-1">
            <v-chip v-for="(tag, idx) in item.tags" :key="idx" size="small"
              :variant="tag.startsWith('+') ? 'outlined' : 'tonal'" :color="tag.startsWith('+') ? 'grey' : 'secondary'"
              class="text-capitalize">
              {{ tag }}
            </v-chip>
          </div>
        </template>

        <template #item.lastContact="{ item }">
          <span class="text-sm">{{ item.lastContact }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-end ga-1">
            <!-- <v-btn icon variant="text" color="dark" size="x-small" @click="viewContact(item.id)">
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="dark" size="x-small">
              <v-icon>mdi-email-fast-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="dark" size="x-small">
              <v-icon>mdi-download</v-icon>
            </v-btn> -->
            <v-btn icon variant="text" color="error" size="x-small" @click="deleteContact(item.id)"
              :loading="contactsStore.isDeleting">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <!-- Pagination -->
      <v-card-actions v-if="pagination.total > pagination.per_page" class="justify-center">
        <v-pagination v-model="pagination.current_page" :length="pagination.last_page" :total-visible="7"
          @update:model-value="handlePageChange" :disabled="isLoading" />
      </v-card-actions>
    </v-card>
    <ContactAddDrawer v-model="showAddDrawer" @created="handleDrawerClose(true)" />
  </div>
</template>

<style scoped>
.contact .text-muted {
  color: rgba(0, 0, 0, 0.54);
}

.contacts-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.contacts-table :deep(.v-data-table__tr:hover) {
  background: rgba(0, 0, 0, 0.02);
}

.contacts-table {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.dot {
  opacity: 0.5;
}

.search-field {
  min-width: 260px;
}

@media (max-width: 960px) {
  .search-field {
    min-width: 180px;
  }
}

#add-contact-btn:hover {
  background-color: #1976d2 !important;
}
</style>
