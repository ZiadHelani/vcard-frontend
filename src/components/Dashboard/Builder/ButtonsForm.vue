<script setup>
import { ref } from 'vue'
import { useCardStore } from '@/stores/card.js'
import MdiIconSelect from '@/components/common/MdiIconSelect.vue'
import { useI18n } from '@/composables/useI18n'
import { Icon } from '@iconify/vue'
const cardStore = useCardStore()
const expandedButton = ref(null)
const { t } = useI18n()

const addButton = () => {
  const newButton = {
    title: '',
    icon: 'nimbus:link',
    link: '',
    color: '#1976d2',
    font_family: 'Roboto, sans-serif',
    font_size: '14px'
  }
  cardStore.card.buttons.push(newButton)
  // Auto-expand the newly added button
  expandedButton.value = cardStore.card.buttons.length - 1
}

const removeButton = (idx) => {
  cardStore.card.buttons.splice(idx, 1)
  // Close expanded state if the removed button was expanded
  if (expandedButton.value === idx) {
    expandedButton.value = null
  } else if (expandedButton.value > idx) {
    expandedButton.value--
  }
}

const toggleButton = (idx) => {
  expandedButton.value = expandedButton.value === idx ? null : idx
}

const moveButtonUp = (idx) => {
  if (idx > 0) {
    const buttons = cardStore.card.buttons
    const temp = buttons[idx]
    buttons[idx] = buttons[idx - 1]
    buttons[idx - 1] = temp

    // Update expanded state
    if (expandedButton.value === idx) {
      expandedButton.value = idx - 1
    } else if (expandedButton.value === idx - 1) {
      expandedButton.value = idx
    }
  }
}

const moveButtonDown = (idx) => {
  const buttons = cardStore.card.buttons
  if (idx < buttons.length - 1) {
    const temp = buttons[idx]
    buttons[idx] = buttons[idx + 1]
    buttons[idx + 1] = temp

    // Update expanded state
    if (expandedButton.value === idx) {
      expandedButton.value = idx + 1
    } else if (expandedButton.value === idx + 1) {
      expandedButton.value = idx
    }
  }
}
</script>

<template>
  <div class="buttons-form">
    <!-- Empty State -->
    <div v-if="cardStore.card.buttons.length === 0" class="empty-state">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-gesture-tap-button</v-icon>
      <h3 class="text-h6 text-grey-darken-1 mb-2">{{ $t('dashboard.builder.forms.buttons.empty.title') }}</h3>
      <p class="text-body-2 text-grey mb-4">{{ $t('dashboard.builder.forms.buttons.empty.subtitle') }}</p>
    </div>

    <!-- Button Cards -->
    <div v-for="(button, idx) in cardStore.card.buttons" :key="idx" class="button-card mb-4">
      <!-- Button Preview Card -->
      <v-card :ripple="false" :class="['border', { 'expanded': expandedButton === idx }]" elevation="0" rounded="xl"
        @click="toggleButton(idx)">
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <!-- Button Preview -->
            <div class="d-flex align-center flex-grow-1">
              <div class="button-preview-icon" :style="{ backgroundColor: button.color || '#1976d2' }">
                <Icon class="text-white" :icon="button.icon || 'nimbus:link'" size="20" />
              </div>
              <div class="flex-grow-1">
                <div class="text-sm font-weight-bold">
                  {{ button.title || $t('dashboard.builder.forms.buttons.defaultTitle', { n: idx + 1 }) }}
                </div>
                <div class="text-xs text-muted">
                  {{ button.link || $t('dashboard.builder.forms.buttons.defaultLink') }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex align-center ga-1" @click.stop>
              <!-- Move Up -->
              <v-btn v-if="idx > 0" size="small" variant="text" icon @click="moveButtonUp(idx)" class="action-btn">
                <v-icon size="18">mdi-chevron-up</v-icon>
              </v-btn>

              <!-- Move Down -->
              <v-btn v-if="idx < cardStore.card.buttons.length - 1" size="small" variant="text" icon
                @click="moveButtonDown(idx)" class="action-btn">
                <v-icon size="18">mdi-chevron-down</v-icon>
              </v-btn>

              <!-- Delete -->
              <v-btn size="small" variant="text" icon color="error" @click="removeButton(idx)" class="action-btn">
                <v-icon size="18">mdi-delete-outline</v-icon>
              </v-btn>

              <!-- Expand/Collapse Indicator -->
              <v-icon :class="['expand-icon', { 'rotated': expandedButton === idx }]" size="20" color="grey-darken-1">
                mdi-chevron-down
              </v-icon>
            </div>
          </div>
        </v-card-text>

        <!-- Expanded Edit Form -->
        <v-expand-transition>
          <div v-if="expandedButton === idx" class="edit-form" @click.stop>
            <v-divider></v-divider>
            <v-card-text class="pa-4 pt-6">
              <v-form class="ga-4">
                <!-- Title Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.titleLabel') }}
                  </v-label>
                  <v-text-field v-model="button.title"
                    :placeholder="$t('dashboard.builder.forms.buttons.titlePlaceholder')" variant="outlined"
                    color="primary" rounded="lg" hide-details class="mb-4" />
                </div>

                <!-- Icon Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.iconLabel') }}
                  </v-label>
                  <MdiIconSelect v-model="button.icon"
                    :placeholder="$t('dashboard.builder.forms.buttons.iconSearchPlaceholder')" class="mb-4" />
                </div>

                <!-- Link Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.linkLabel') }}
                  </v-label>
                  <v-text-field v-model="button.link"
                    :placeholder="$t('dashboard.builder.forms.buttons.linkPlaceholder')" variant="outlined"
                    color="primary" rounded="lg" hide-details class="mb-4" />
                </div>

                <!-- Color Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.colorLabel') }}
                  </v-label>
                  <v-color-picker v-model="button.color" mode="hexa" rounded="lg" elevation="0"
                    class="color-picker w-100" />
                </div>

                <!-- Font Family Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.fontFamilyLabel') }}
                  </v-label>
                  <v-select v-model="button.font_family" :items="[
                    { title: $t('dashboard.builder.forms.buttons.fontFamilies.roboto'), value: 'Roboto, sans-serif' },
                    { title: 'Arial', value: 'Arial, sans-serif' },
                    { title: 'Helvetica', value: 'Helvetica, sans-serif' },
                    { title: 'Times New Roman', value: 'Times New Roman, serif' },
                    { title: 'Georgia', value: 'Georgia, serif' },
                    { title: 'Courier New', value: 'Courier New, monospace' },
                    { title: 'Verdana', value: 'Verdana, sans-serif' },
                    { title: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
                    { title: 'Impact', value: 'Impact, sans-serif' },
                    { title: 'Palatino', value: 'Palatino, serif' }
                  ]" variant="outlined" color="primary" rounded="lg" hide-details class="mb-4" />
                </div>

                <!-- Font Size Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.buttons.fontSizeLabel') }}
                  </v-label>
                  <v-select v-model="button.font_size" :items="[
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.xs'), value: '10px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.sm'), value: '12px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.default'), value: '14px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.md'), value: '16px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.lg'), value: '18px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.xl'), value: '20px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.xxl'), value: '22px' },
                    { title: $t('dashboard.builder.forms.buttons.fontSizes.xxxl'), value: '24px' }
                  ]" variant="outlined" color="primary" rounded="lg" hide-details class="mb-4" />
                </div>
              </v-form>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>

    <!-- Add Button -->
    <v-btn variant="outlined" color="primary" size="large" rounded="xl" @click="addButton" prepend-icon="mdi-plus"
      class="add-button w-100">
      {{ $t('dashboard.builder.forms.buttons.addNew') }}
    </v-btn>
  </div>
</template>

<style scoped>
.buttons-form {
  max-width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.button-card {
  position: relative;
}

.button-preview-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.button-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(25, 118, 210, 0.2);
}

.button-preview-card.expanded {
  border-color: rgba(25, 118, 210, 0.3);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15) !important;
}

.button-preview-icon {
  margin-inline-end: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.action-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.action-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.expand-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 8px;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.edit-form {
  background: linear-gradient(145deg, #fafbfc, #ffffff);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group .v-label {
  display: block;
  margin-bottom: 8px;
}

.color-picker {
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.add-button {
  height: 56px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  border: 2px dashed #1976d2;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  transition: all 0.3s ease;
}

.add-button:hover {
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-color: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

/* Animation for new buttons */
.button-card {
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .button-preview-card .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-btn {
    min-width: 32px;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}

/* Focus states for accessibility */
.button-preview-card:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.action-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
