<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '@/stores/card.js'
import SkeletonLoader from '@/components/Dashboard/Loading/SkeletonLoader.vue'
import { useConfigStore } from '@/stores/config'
import { useI18n } from '@/composables/useI18n'

// Store
const cardStore = useCardStore()
const { cards, isListLoading, pagination, error } = storeToRefs(cardStore)

const configStore = useConfigStore()

// Search
const search = ref('')

// i18n
const { t } = useI18n()

// Table headers (similar style to ContactView)
const headers = computed(() => ([
  { title: '', key: 'data-table-select' },
  { title: t('dashboard.cards.headers.qrCode'), key: 'qrcode', sortable: false, align: 'center' },
  { title: t('dashboard.cards.headers.card'), key: 'card', sortable: true },
  { title: t('dashboard.cards.headers.type'), key: 'type', sortable: true },
  { title: t('dashboard.cards.headers.stats'), key: 'stats', sortable: false },
  { title: t('dashboard.cards.headers.published'), key: 'published', sortable: true, align: 'center' },
  { title: t('dashboard.cards.headers.created'), key: 'created_at', sortable: true },
  { title: t('dashboard.cards.headers.actions'), key: 'actions', sortable: false, align: 'end' },
]))

// Transform server data to match UI expectations
const transformedCards = computed(() => {
  return (cards.value || []).map((c) => ({
    id: c.id,
    uuid: c.uuid,
    slug: c.slug,
    name: c.name || 'Untitled',
    type: c.type || 'personal',
    color: c.color || '#FFFFFF',
    total_views: c.total_views ?? 0,
    total_saves: c.total_saves ?? 0,
    qrcode: c.qrcode || null,
    published: !!c.published,
    link: c.link,
    created_at: c.created_at || '-',
    updated_at: c.updated_at || '-',
    personal_details: c.personal_details || {},
  }))
})

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return transformedCards.value
  return transformedCards.value.filter((item) =>
    [
      item.name,
      item.type,
      item.link,
      item.slug,
      item.created_at,
      item.updated_at,
      item.personal_details?.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})

// Fetch on mount
onMounted(async () => {
  try {
    await cardStore.fetchAllCards()
  } catch (e) {
    console.error('Failed to fetch cards', e)
  }
})

// Handlers
const handlePageChange = async (page) => {
  try {
    await cardStore.fetchAllCards({ page })
  } catch (e) {
    console.error('Failed to change page', e)
  }
}

const baseUrl = import.meta.env.VITE_CSRF_BASE_URL
const viewCard = (slug) => {
  window.open(`${baseUrl}/cards/${slug}`, '_blank')
}

const onTogglePublished = async (slug, value) => {
  try {
    await cardStore.toggleCardPublished(slug, value)
  } catch (e) {
    console.error('Failed to toggle published', e)
  }
}

const downloadQrCode = async (item) => {
  const src = item?.qrcode
  if (!src) return

  const fallbackName = item?.slug || item?.uuid || item?.id || 'card'
  const filenameBase = `qrcode-${fallbackName}`

  const triggerDownload = (href, filename) => {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // If backend returns a data URL, we can download directly.
  if (typeof src === 'string' && src.startsWith('data:')) {
    const mimeMatch = src.match(/^data:([^;]+)/)
    const mime = mimeMatch?.[1] || 'image/png'
    const ext = mime === 'image/svg+xml' ? 'svg' : (mime.split('/')[1] || 'png')
    triggerDownload(src, `${filenameBase}.${ext}`)
    return
  }

  // Otherwise, fetch as blob (supports authenticated/cookie requests).
  try {
    const res = await fetch(src, { credentials: 'include' })
    if (!res.ok) throw new Error(`Failed to fetch QR code: ${res.status}`)

    const blob = await res.blob()
    const mime = blob.type || 'image/png'
    const ext = mime === 'image/svg+xml' ? 'svg' : (mime.split('/')[1] || 'png')

    const objectUrl = URL.createObjectURL(blob)
    try {
      triggerDownload(objectUrl, `${filenameBase}.${ext}`)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  } catch (e) {
    console.error(e)
    // Last resort: open in new tab so user can save it manually.
    window.open(src, '_blank')
  }
}

// Delete handling with confirmation
const confirmDeleteUuid = ref(null)
const openDeleteConfirm = (slug) => {
  confirmDeleteUuid.value = slug
}
const closeDeleteConfirm = () => {
  confirmDeleteUuid.value = null
}
const confirmDelete = async () => {
  if (!confirmDeleteUuid.value) return
  try {
    await cardStore.deleteCard(confirmDeleteUuid.value)
  } catch (e) {
    console.error('Failed to delete card', e)
  } finally {
    closeDeleteConfirm()
  }
}
</script>

<template>
  <div class="cards">
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0">
        <h1 class="text-3xl gradient-title mb-0">{{ $t('dashboard.cards.title') }}</h1>
        <p class="text-muted text-sm">{{ $t('dashboard.cards.subtitle') }}</p>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0 text-end">
        <div class="d-flex align-center ga-3 justify-end h-100">
          <v-btn :to="{ name: 'dashboard.card-builder' }" size="small" color="success" class="float-on-hover">
            <template #prepend>
              <v-icon class="text-white">mdi-plus</v-icon>
            </template>
            <span class="text-capitalize text-white"> {{ $t('dashboard.cards.new') }} </span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <SkeletonLoader v-if="isListLoading" />

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="comfortable">
      {{ error }}
    </v-alert>

    <v-card elevation="0" border class="rounded-xl mt-6" v-if="!isListLoading">
      <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3">
        <div class="text-lg font-weight-medium">{{ $t('dashboard.cards.all') }} ({{ filtered.length }})</div>
        <div class="d-flex align-center ga-2">
          <v-text-field color="primary" v-model="search" density="comfortable" variant="outlined" hide-details
            prepend-inner-icon="mdi-magnify" class="search-field"
            :placeholder="$t('dashboard.cards.searchPlaceholder')" />
        </div>
      </div>

      <v-divider></v-divider>

      <v-data-table color="primary" :headers="headers" :items="filtered" item-key="id" class="cards-table"
        :items-per-page="pagination.per_page" :loading="isListLoading" hide-default-footer show-select hover
        density="comfortable" :loading-text="$t('dashboard.cards.loading')">
        <template #item.qrcode="{ item }">
          <div class="d-flex justify-center py-2">
            <v-avatar size="56" class="border qr-download" rounded="lg" role="button" tabindex="0"
              @click.stop="downloadQrCode(item)" @keydown.enter.stop="downloadQrCode(item)"
              @keydown.space.prevent.stop="downloadQrCode(item)">
              <v-img v-if="item.qrcode" :src="item.qrcode" alt="QR Code" cover></v-img>
              <v-icon v-else color="grey">mdi-qrcode</v-icon>
            </v-avatar>
          </div>
        </template>
        <template #item.card="{ item }">
          <div class="d-flex align-center ga-3 py-3">
            <v-avatar elevation="2" size="36" :style="{ backgroundColor: item.color }">
              <v-icon :color="configStore.getTextColor(item.color)">mdi-card-account-details-outline</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-muted text-caption">
                <v-chip size="x-small" class="ml-1" :color="item.published ? 'success' : 'grey'" variant="tonal">
                  {{ item.published ? $t('dashboard.cards.published') : $t('dashboard.cards.draft') }}
                </v-chip>
              </div>
            </div>
          </div>
        </template>

        <template #item.type="{ item }">
          <v-chip size="small" color="primary" variant="tonal" class="text-capitalize">
            {{ item.type }}
          </v-chip>
        </template>

        <template #item.stats="{ item }">
          <div class="d-flex align-center ga-2">
            <v-chip size="x-small" color="primary" variant="tonal">
              <v-icon size="14" class="mr-1">mdi-eye-outline</v-icon>{{ item.total_views }}
            </v-chip>
            <v-chip size="x-small" color="secondary" variant="tonal">
              <v-icon size="14" class="mr-1">mdi-content-save-outline</v-icon>{{ item.total_saves }}
            </v-chip>
          </div>
        </template>

        <template #item.published="{ item }">
          <div class="d-flex justify-center py-2">
            <v-switch color="success" hide-details density="compact" :model-value="item.published"
              :loading="cardStore.togglingPublished[item.slug] === true"
              :disabled="cardStore.togglingPublished[item.slug] === true"
              @update:model-value="(val) => onTogglePublished(item.slug, val)" />
          </div>
        </template>

        <template #item.created_at="{ item }">
          <span class="text-sm">{{ item.created_at }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-end ga-1">
            <v-btn @click="cardStore.copyCardUrl(item)" color="dark" size="x-small" variant="text"
              icon="mdi-share-variant"></v-btn>
            <v-btn icon variant="text" color="dark" size="x-small" @click="viewCard(item.slug)">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="dark" size="x-small"
              :to="{ name: 'dashboard.card-builder.edit', params: { slug: item.slug } }">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" size="x-small" :loading="cardStore.deleting[item.slug] === true"
              :disabled="cardStore.deleting[item.slug] === true" @click="openDeleteConfirm(item.slug)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-card-actions v-if="pagination.total > pagination.per_page" class="justify-center">
        <v-pagination v-model="pagination.current_page" :length="pagination.last_page" :total-visible="7"
          @update:model-value="handlePageChange" :disabled="isListLoading" />
      </v-card-actions>
    </v-card>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="confirmDeleteUuid" max-width="420">
      <v-card>
        <v-card-title class="text-h6">{{ $t('dashboard.cards.deleteDialog.title') }}</v-card-title>
        <v-card-text>
          {{ $t('dashboard.cards.deleteDialog.body') }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDeleteConfirm">{{ $t('dashboard.cards.deleteDialog.cancel') }}</v-btn>
          <v-btn :disabled="cardStore.deleting[confirmDeleteUuid] === true"
            :loading="cardStore.deleting[confirmDeleteUuid] === true" color="error" @click="confirmDelete">{{
              $t('dashboard.cards.deleteDialog.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cards .text-muted {
  color: rgba(0, 0, 0, 0.54);
}

.cards-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.cards-table :deep(.v-data-table__tr:hover) {
  background: rgba(0, 0, 0, 0.02);
}

.cards-table {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.search-field {
  min-width: 260px;
}

.qr-download {
  cursor: pointer;
}

@media (max-width: 960px) {
  .search-field {
    min-width: 180px;
  }
}
</style>
