<script setup>
import { ref } from 'vue'
import { useCardStore } from '@/stores/card.js'
import QuillEditor from '@/components/common/QuillEditor.vue'
import { useI18n } from '@/composables/useI18n'

const cardStore = useCardStore()
const expandedFaq = ref(null)
const { t } = useI18n()

const addFaq = () => {
  const newFaq = { question: '', answer: '', background_color: '#f6f6f6' }
  cardStore.card.faqs.push(newFaq)
  // Auto-expand the newly added FAQ
  expandedFaq.value = cardStore.card.faqs.length - 1
}

const removeFaq = (idx) => {
  cardStore.card.faqs.splice(idx, 1)
  // Close expanded state if the removed FAQ was expanded
  if (expandedFaq.value === idx) {
    expandedFaq.value = null
  } else if (expandedFaq.value > idx) {
    expandedFaq.value--
  }
}

const toggleFaq = (idx) => {
  expandedFaq.value = expandedFaq.value === idx ? null : idx
}

const moveFaqUp = (idx) => {
  if (idx > 0) {
    const faqs = cardStore.card.faqs
    const temp = faqs[idx]
    faqs[idx] = faqs[idx - 1]
    faqs[idx - 1] = temp

    // Update expanded state
    if (expandedFaq.value === idx) {
      expandedFaq.value = idx - 1
    } else if (expandedFaq.value === idx - 1) {
      expandedFaq.value = idx
    }
  }
}

const moveFaqDown = (idx) => {
  const faqs = cardStore.card.faqs
  if (idx < faqs.length - 1) {
    const temp = faqs[idx]
    faqs[idx] = faqs[idx + 1]
    faqs[idx + 1] = temp

    // Update expanded state
    if (expandedFaq.value === idx) {
      expandedFaq.value = idx + 1
    } else if (expandedFaq.value === idx + 1) {
      expandedFaq.value = idx
    }
  }
}
</script>

<template>
  <div class="faqs-form">
    <!-- Empty State -->
    <div v-if="cardStore.card.faqs.length === 0" class="empty-state">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-help-circle-outline</v-icon>
      <h3 class="text-h6 text-grey-darken-1 mb-2">{{ $t('dashboard.builder.forms.faqs.empty.title') }}</h3>
      <p class="text-body-2 text-grey mb-4">
        {{ $t('dashboard.builder.forms.faqs.empty.subtitle') }}
      </p>
    </div>

    <!-- FAQ Cards -->
    <div v-for="(faq, idx) in cardStore.card.faqs" :key="idx" class="mb-4">
      <!-- FAQ Preview Card -->
      <v-card
        :ripple="false"
        :class="['border', { expanded: expandedFaq === idx }]"
        elevation="0"
        rounded="xl"
        @click="toggleFaq(idx)"
      >
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <!-- FAQ Preview -->
            <div class="d-flex align-center flex-grow-1">
              <v-avatar
                color="primary"
                variant="tonal"
                class="margin-inline-end"
                icon="mdi-help-circle"
              >
              </v-avatar>
              <div class="flex-grow-1">
                <h3 class="text-sm font-weight-bold mb-0">
                  <span v-if="faq.question" v-html="faq.question"></span>
                  <span v-else>{{ $t('dashboard.builder.forms.faqs.defaultQuestion', { n: idx + 1 }) }}</span>
                </h3>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex align-center ga-1" @click.stop>
              <!-- Move Up -->
              <v-btn
                v-if="idx > 0"
                size="small"
                variant="text"
                icon
                @click="moveFaqUp(idx)"
                class="action-btn"
              >
                <v-icon size="18">mdi-chevron-up</v-icon>
              </v-btn>

              <!-- Move Down -->
              <v-btn
                v-if="idx < cardStore.card.faqs.length - 1"
                size="small"
                variant="text"
                icon
                @click="moveFaqDown(idx)"
                class="action-btn"
              >
                <v-icon size="18">mdi-chevron-down</v-icon>
              </v-btn>

              <!-- Delete -->
              <v-btn
                size="small"
                variant="text"
                icon
                color="error"
                @click="removeFaq(idx)"
                class="action-btn"
              >
                <v-icon size="18">mdi-delete-outline</v-icon>
              </v-btn>

              <!-- Expand/Collapse Indicator -->
              <v-icon
                :class="['expand-icon', { rotated: expandedFaq === idx }]"
                size="20"
                color="grey-darken-1"
              >
                mdi-chevron-down
              </v-icon>
            </div>
          </div>
        </v-card-text>

        <!-- Expanded Edit Form -->
        <v-expand-transition>
          <div v-if="expandedFaq === idx" class="edit-form" @click.stop>
            <v-divider></v-divider>
            <v-card-text class="pa-4 pt-6">
              <v-form class="ga-4">
                <!-- Question Field -->
                <div class="form-group">
                  <QuillEditor
                    v-model="faq.question"
                    :label="$t('dashboard.builder.forms.faqs.questionLabel')"
                    :placeholder="$t('dashboard.builder.forms.faqs.questionPlaceholder')"
                    min-height="80px"
                  />
                </div>

                <!-- Answer Field -->
                <div class="form-group">
                  <QuillEditor
                    v-model="faq.answer"
                    :label="$t('dashboard.builder.forms.faqs.answerLabel')"
                    :placeholder="$t('dashboard.builder.forms.faqs.answerPlaceholder')"
                    min-height="120px"
                  />
                </div>

                <!-- BG Color Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    {{ $t('dashboard.builder.forms.faqs.bgColorLabel') }}
                  </v-label>
                  <v-color-picker
                    v-model="faq.background_color"
                    mode="hexa"
                    rounded="lg"
                    elevation="0"
                    class="color-picker w-100"
                  />
                </div>
              </v-form>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>

    <!-- Add FAQ Button -->
    <v-btn
      variant="outlined"
      color="primary"
      size="large"
      rounded="xl"
      @click="addFaq"
      prepend-icon="mdi-plus"
      class="add-button w-100"
    >
      {{ $t('dashboard.builder.forms.faqs.addNew') }}
    </v-btn>
  </div>
</template>

<style scoped>
.faqs-form {
  max-width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.faq-card {
  position: relative;
}

.faq-card .v-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e0e0e0;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.faq-card .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(25, 118, 210, 0.2);
}

.faq-card .v-card.expanded {
  border-color: rgba(25, 118, 210, 0.3);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15) !important;
}

.faq-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.faq-answer-preview {
  line-height: 1.4;
  opacity: 0.8;
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
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.answer-textarea {
  font-family: inherit;
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

/* Animation for new FAQs */
.faq-card {
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

/* FAQ-specific styling */
.faq-card .v-card-text {
  position: relative;
}

.faq-card .v-card-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #1976d2, #42a5f5);
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.faq-card .v-card.expanded .v-card-text::before {
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .faq-card .d-flex {
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

  .faq-answer-preview {
    font-size: 0.75rem;
  }
}

/* Focus states for accessibility */
.faq-card .v-card:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.action-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Enhanced visual hierarchy */
.faq-card .text-subtitle-2 {
  color: #1a1a1a;
  line-height: 1.3;
}

.faq-card.expanded .faq-icon {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(25, 118, 210, 0.3));
  transform: scale(1.05);
}
</style>
