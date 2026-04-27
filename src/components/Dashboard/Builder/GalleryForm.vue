<script setup>
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/card.js'
import { useI18n } from '@/composables/useI18n'

const cardStore = useCardStore()
const { t } = useI18n()

// Form state
const newImageFile = ref(null)
const newImageCols = ref(1)
const newImageRows = ref(1)
const editingIndex = ref(-1)
const editForm = ref({
  src: '',
  file: null,
  cols: 1,
  rows: 1,
  id: null,
  order: null,
})

// Computed
const gallery = computed(() => cardStore.card.gallery)

// File handling functions
function toSingleFile(fileOrFiles) {
  if (Array.isArray(fileOrFiles)) return fileOrFiles[0] || null
  return fileOrFiles || null
}

function onImageSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  newImageFile.value = file
}

function onEditImageSelected(fileOrFiles) {
  const file = toSingleFile(fileOrFiles)
  if (!file) {
    editForm.value.file = null
    return
  }

  // Revoke previous blob URL if exists
  const prev = editForm.value.src
  if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(prev)
    } catch (e) { }
  }

  editForm.value.file = file
  editForm.value.src = URL.createObjectURL(file)
}

// Methods
function addImage() {
  if (!newImageFile.value) return

  const imageUrl = URL.createObjectURL(newImageFile.value)
  cardStore.addGalleryItem(imageUrl, newImageCols.value, newImageRows.value, newImageFile.value)

  // Reset form
  newImageFile.value = null
  newImageCols.value = 1
  newImageRows.value = 1
}

async function removeImage(index, media_id = null) {
  if (media_id) {
    await cardStore.removeMedia(media_id)
  }
  cardStore.removeGalleryItem(index)
}

function startEdit(index) {
  editingIndex.value = index
  const item = gallery.value[index]
  editForm.value = { ...item }
}

function saveEdit() {
  if (editingIndex.value >= 0) {
    cardStore.updateGalleryItem(editingIndex.value, editForm.value)
    cancelEdit()
  }
}

function cancelEdit() {
  editingIndex.value = -1
  editForm.value = { src: '', cols: 1, rows: 1 }
}

function galleryItemKey(item) {
  return item?.id ?? item?.src_id ?? item?.src ?? null
}

function normalizeGalleryOrders(items) {
  // Ensure every item has a numeric order, then normalize to 1..n
  items.forEach((it, idx) => {
    const n = Number(it?.order)
    if (!Number.isFinite(n) || n <= 0) it.order = idx + 1
    else it.order = n
  })

  items.sort((a, b) => {
    const ao = Number(a?.order)
    const bo = Number(b?.order)
    if (ao !== bo) return ao - bo
    // Stable tie-breaker for duplicate orders
    const ak = String(galleryItemKey(a) ?? '')
    const bk = String(galleryItemKey(b) ?? '')
    return ak.localeCompare(bk)
  })

  items.forEach((it, idx) => {
    it.order = idx + 1
  })

  console.log(items)

  return items
}

function moveUp(index) {
  if (index > 0) {
    const editedKey =
      editingIndex.value >= 0 ? galleryItemKey(gallery.value[editingIndex.value]) : null

    const items = gallery.value.map((it) => ({ ...it }))
    normalizeGalleryOrders(items)

    const current = items[index]
    const prev = items[index - 1]
    const tmp = current.order
    current.order = prev.order
    prev.order = tmp

    normalizeGalleryOrders(items)
    cardStore.reorderGalleryItems(items)

    if (editedKey) {
      const newIdx = items.findIndex((it) => galleryItemKey(it) === editedKey)
      editingIndex.value = newIdx
    }
  }
}

function moveDown(index) {
  if (index < gallery.value.length - 1) {
    const editedKey =
      editingIndex.value >= 0 ? galleryItemKey(gallery.value[editingIndex.value]) : null

    const items = gallery.value.map((it) => ({ ...it }))
    normalizeGalleryOrders(items)

    const current = items[index]
    const next = items[index + 1]
    const tmp = current.order
    current.order = next.order
    next.order = tmp

    normalizeGalleryOrders(items)
    cardStore.reorderGalleryItems(items)

    if (editedKey) {
      const newIdx = items.findIndex((it) => galleryItemKey(it) === editedKey)
      editingIndex.value = newIdx
    }
  }
}

// Validation rules
const fileRules = [
  (v) => !!v || t('dashboard.builder.forms.gallery.validation.fileRequired'),
  (v) => !v || v.size < 5000000 || t('dashboard.builder.forms.gallery.validation.fileSize'),
  (v) => !v || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(v.type) || t('dashboard.builder.forms.gallery.validation.fileType')
]

const colsRules = [(v) => (v >= 1 && v <= 4) || t('dashboard.builder.forms.gallery.validation.colsRange')]

const rowsRules = [(v) => (v >= 1 && v <= 3) || t('dashboard.builder.forms.gallery.validation.rowsRange')]
</script>

<template>
  <div>
    <v-form class="gallery-form">

      <div class="form-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">{{ $t('dashboard.builder.forms.gallery.title') }}</h3>
        <p class="text-body-2 text-medium-emphasis">
          {{ $t('dashboard.builder.forms.gallery.subtitle') }}
        </p>
      </div>


      <v-card class="mb-6" elevation="2">
        <v-card-title class="bg-primary text-white">
          <v-icon class="me-2">mdi-plus-circle</v-icon>
          {{ $t('dashboard.builder.forms.gallery.addNewTitle') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-file-input clearable @update:model-value="onImageSelected"
                :label="$t('dashboard.builder.forms.gallery.selectImageLabel')" accept="image/*"
                prepend-inner-icon="mdi-image" color="primary" variant="outlined" density="comfortable"
                :show-size="true" :clearable="true" :rules="fileRules" hide-details="auto" />
            </v-col>
            <v-col cols="6">
              <v-select v-model="newImageCols" :label="$t('dashboard.builder.forms.gallery.gridColumnsLabel')"
                :items="[1, 2, 3]" :rules="colsRules" prepend-inner-icon="mdi-view-column" variant="outlined"
                density="comfortable" hide-details="auto" />
            </v-col>
            <v-col cols="6">
              <v-select v-model="newImageRows" :label="$t('dashboard.builder.forms.gallery.gridRowsLabel')"
                :items="[1, 2, 3]" :rules="rowsRules" prepend-inner-icon="mdi-view-grid" variant="outlined"
                density="comfortable" hide-details="auto" />
            </v-col>
          </v-row>
          <v-btn @click="addImage" :disabled="!newImageFile" color="primary" class="mt-4" prepend-icon="mdi-plus">
            {{ $t('dashboard.builder.forms.gallery.addImageButton') }}
          </v-btn>
        </v-card-text>
      </v-card>


      <v-card elevation="2">
        <v-card-title class="bg-secondary text-white">
          <v-icon class="me-2">mdi-view-gallery</v-icon>
          {{ $t('dashboard.builder.forms.gallery.currentGalleryTitle', { count: gallery.length }) }}
        </v-card-title>
        <v-card-text class="pa-0">
          <div v-if="gallery.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-image-off</v-icon>
            <p class="text-body-1 text-medium-emphasis">{{ $t('dashboard.builder.forms.gallery.empty.title') }}</p>
            <p class="text-body-2 text-disabled">{{ $t('dashboard.builder.forms.gallery.empty.subtitle') }}</p>
          </div>

          <v-list v-else class="pa-0">
            <v-list-item v-for="(item, index) in gallery" :key="index" class="gallery-item"
              :class="{ editing: editingIndex === index }">
              <!-- Normal View -->
              <div v-if="editingIndex !== index">
                <div>
                  <v-avatar size="60" rounded="xl" class="mb-1">
                    <v-img :src="item.src" cover />
                  </v-avatar>
                </div>

                <v-list-item-subtitle>
                  {{ $t('dashboard.builder.forms.gallery.gridLabel') }}: {{ item.cols }}×{{ item.rows }}
                </v-list-item-subtitle>

                <div>
                  <div class="d-flex align-center ga-1">
                    <!-- Move buttons -->
                    <v-btn @click="moveUp(index)" :disabled="index === 0" icon="mdi-arrow-up" size="small"
                      variant="text" color="primary" />
                    <v-btn @click="moveDown(index)" :disabled="index === gallery.length - 1" icon="mdi-arrow-down"
                      size="small" variant="text" color="primary" />

                    <!-- Edit button -->
                    <v-btn @click="startEdit(index)" icon="mdi-pencil" size="small" variant="text" color="warning" />

                    <!-- Delete button -->
                    <v-btn @click="removeImage(index, item.src_id)" icon="mdi-delete" size="small" variant="text"
                      color="error" />
                  </div>
                </div>
              </div>

              <!-- Edit View -->
              <div v-else>
                <div class="edit-form w-100 pa-2">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editForm.src" :label="$t('dashboard.builder.forms.gallery.imageUrlLabel')"
                        :rules="urlRules" prepend-inner-icon="mdi-image" variant="outlined" density="compact"
                        hide-details="auto" />
                    </v-col>
                    <v-col cols="6">
                      <v-select v-model="editForm.cols" :label="$t('dashboard.builder.forms.gallery.columnsLabel')"
                        :items="[1, 2, 3]" :rules="colsRules" prepend-inner-icon="mdi-view-column" variant="outlined"
                        density="compact" hide-details="auto" />
                    </v-col>
                    <v-col cols="6">
                      <v-select v-model="editForm.rows" :label="$t('dashboard.builder.forms.gallery.rowsLabel')"
                        :items="[1, 2, 3]" :rules="rowsRules" prepend-inner-icon="mdi-view-grid" variant="outlined"
                        density="compact" hide-details="auto" />
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-end ga-2 mt-2">
                    <v-btn @click="cancelEdit" variant="text" color="grey" size="small">
                      {{ $t('dashboard.builder.forms.gallery.cancelButton') }}
                    </v-btn>
                    <v-btn @click="saveEdit" variant="elevated" color="primary" size="small">
                      {{ $t('dashboard.builder.forms.gallery.saveButton') }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>


      <v-card v-if="gallery.length > 0" class="mt-6" elevation="2">
        <v-card-title class="bg-success text-white">
          <v-icon class="me-2">mdi-eye</v-icon>
          {{ $t('dashboard.builder.forms.gallery.previewTitle') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="gallery-preview">
            <div v-for="(img, idx) in gallery" :key="idx" class="preview-item"
              :style="{ gridColumn: `span ${img.cols}`, gridRow: `span ${img.rows}` }">
              <v-img :src="img.src" cover class="preview-img" />
              <div class="preview-overlay">
                <span class="preview-text">{{ img.cols }}×{{ img.rows }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<style scoped>
.gallery-form {
  max-width: 800px;
  margin: 0 auto;
}

.gallery-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s ease;
}

.gallery-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.gallery-item.editing {
  background-color: rgba(25, 118, 210, 0.04);
  /* border-left: 3px solid rgb(var(--v-theme-primary)); */
}

.edit-form {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
}

/* Gallery Preview Styles */
.gallery-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 80px;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 12px;
}

@media (max-width: 960px) {
  .gallery-preview {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 70px;
  }
}

@media (max-width: 600px) {
  .gallery-preview {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 60px;
  }
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-img {
  width: 100%;
  height: 100%;
}

.preview-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preview-text {
  font-size: 0.7rem;
}
</style>
