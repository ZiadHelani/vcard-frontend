<script setup>
import { ref } from 'vue'
import { useCardStore } from '@/stores/card.js'
import { useI18n } from '@/composables/useI18n'

const cardStore = useCardStore()
const expandedReview = ref(null)
const { t } = useI18n()

const addReview = () => {
  const newReview = { review: '', user_name: '', rating: 5 }
  cardStore.card.reviews.push(newReview)
  // Auto-expand the newly added review
  expandedReview.value = cardStore.card.reviews.length - 1
}

const removeReview = (idx) => {
  cardStore.card.reviews.splice(idx, 1)
  // Close expanded state if the removed review was expanded
  if (expandedReview.value === idx) {
    expandedReview.value = null
  } else if (expandedReview.value > idx) {
    expandedReview.value--
  }
}

const toggleReview = (idx) => {
  expandedReview.value = expandedReview.value === idx ? null : idx
}

const moveReviewUp = (idx) => {
  if (idx > 0) {
    const reviews = cardStore.card.reviews
    const temp = reviews[idx]
    reviews[idx] = reviews[idx - 1]
    reviews[idx - 1] = temp

    // Update expanded state
    if (expandedReview.value === idx) {
      expandedReview.value = idx - 1
    } else if (expandedReview.value === idx - 1) {
      expandedReview.value = idx
    }
  }
}

const moveReviewDown = (idx) => {
  const reviews = cardStore.card.reviews
  if (idx < reviews.length - 1) {
    const temp = reviews[idx]
    reviews[idx] = reviews[idx + 1]
    reviews[idx + 1] = temp

    // Update expanded state
    if (expandedReview.value === idx) {
      expandedReview.value = idx + 1
    } else if (expandedReview.value === idx + 1) {
      expandedReview.value = idx
    }
  }
}

const setRating = (reviewIdx, rating) => {
  cardStore.card.reviews[reviewIdx].rating = rating
}
</script>

<template>
  <div class="reviews-form">
    <!-- Empty State -->
    <div v-if="cardStore.card.reviews.length === 0" class="empty-state">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-star-outline</v-icon>
      <h3 class="text-h6 text-grey-darken-1 mb-2">{{ $t('dashboard.builder.forms.reviews.empty.title') }}</h3>
      <p class="text-body-2 text-grey mb-4">
        {{ $t('dashboard.builder.forms.reviews.empty.subtitle') }}
      </p>
    </div>

    <!-- Review Cards -->
    <div v-for="(review, idx) in cardStore.card.reviews" :key="idx" class="mb-4">
      <!-- Review Preview Card -->
      <v-card
        :ripple="false"
        :class="['border', { expanded: expandedReview === idx }]"
        elevation="0"
        rounded="xl"
        @click="toggleReview(idx)"
      >
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <!-- Review Preview -->
            <div class="d-flex align-center flex-grow-1">
              <v-avatar
                color="amber"
                variant="tonal"
                class="margin-inline-end"
                icon="mdi-star"
              >
              </v-avatar>
              <div class="flex-grow-1">
                <!-- Star Rating Display -->
                <div class="d-flex align-center mb-1">
                  <div class="star-rating mr-2">
                    <v-icon
                      v-for="star in 5"
                      :key="star"
                      :color="star <= (review.rating || 5) ? 'amber' : 'grey-lighten-2'"
                      size="16"
                      class="mr-1"
                    >
                      mdi-star
                    </v-icon>
                  </div>
                  <span class="text-xs text-muted">{{ review.rating || 5 }}/5</span>
                </div>
                <!-- Review Preview Text -->
                <h3 class="text-sm font-weight-bold mb-1">
                  {{ review.user_name || $t('dashboard.builder.forms.reviews.defaultCustomer', { n: idx + 1 }) }}
                </h3>
                <div class="text-xs text-muted review-text-preview">
                  {{ review.review ? (review.review.length > 60 ? review.review.substring(0, 60) + '...' : review.review) : $t('dashboard.builder.forms.reviews.noReviewText') }}
                </div>
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
                @click="moveReviewUp(idx)"
                class="action-btn"
              >
                <v-icon size="18">mdi-chevron-up</v-icon>
              </v-btn>

              <!-- Move Down -->
              <v-btn
                v-if="idx < cardStore.card.reviews.length - 1"
                size="small"
                variant="text"
                icon
                @click="moveReviewDown(idx)"
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
                @click="removeReview(idx)"
                class="action-btn"
              >
                <v-icon size="18">mdi-delete-outline</v-icon>
              </v-btn>

              <!-- Expand/Collapse Indicator -->
              <v-icon
                :class="['expand-icon', { rotated: expandedReview === idx }]"
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
          <div v-if="expandedReview === idx" class="edit-form" @click.stop>
            <v-divider></v-divider>
            <v-card-text class="pa-4 pt-6">
              <v-form class="ga-4">
                <!-- Customer Name Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    <v-icon size="16" class="mr-1">mdi-account-outline</v-icon>
                    {{ $t('dashboard.builder.forms.reviews.customerNameLabel') }}
                  </v-label>
                  <v-text-field
                    v-model="review.user_name"
                    :placeholder="$t('dashboard.builder.forms.reviews.customerNamePlaceholder')"
                    variant="outlined"
                    color="primary"
                    rounded="lg"
                    hide-details
                    class="mb-4"
                  />
                </div>

                <!-- Star Rating Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    <v-icon size="16" class="mr-1">mdi-star-outline</v-icon>
                    {{ $t('dashboard.builder.forms.reviews.ratingLabel') }}
                  </v-label>
                  <div class="rating-selector mb-4">
                    <v-btn
                      v-for="star in 5"
                      :key="star"
                      :variant="star <= (review.rating || 5) ? 'elevated' : 'outlined'"
                      :color="star <= (review.rating || 5) ? 'amber' : 'grey-lighten-2'"
                      size="small"
                      icon
                      class="mr-1"
                      @click="setRating(idx, star)"
                    >
                      <v-icon size="18" :color="star <= (review.rating || 5) ? 'white' : 'grey-lighten-1'">mdi-star</v-icon>
                    </v-btn>
                    <span class="text-sm text-muted ml-2">{{ $t('dashboard.builder.forms.reviews.ratingText', { rating: review.rating || 5 }) }}</span>
                  </div>
                </div>

                <!-- Review Text Field -->
                <div class="form-group">
                  <v-label class="text-sm font-weight-bold text-grey-darken-2 mb-2">
                    <v-icon size="16" class="mr-1">mdi-message-text-outline</v-icon>
                    {{ $t('dashboard.builder.forms.reviews.reviewTextLabel') }}
                  </v-label>
                  <v-textarea
                    v-model="review.review"
                    :placeholder="$t('dashboard.builder.forms.reviews.reviewTextPlaceholder')"
                    variant="outlined"
                    color="primary"
                    rounded="lg"
                    auto-grow
                    rows="3"
                    hide-details
                    class="review-textarea"
                  />
                </div>
              </v-form>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>

    <!-- Add Review Button -->
    <v-btn
      variant="outlined"
      color="primary"
      size="large"
      rounded="xl"
      @click="addReview"
      prepend-icon="mdi-plus"
      class="add-button w-100"
    >
      {{ $t('dashboard.builder.forms.reviews.addNew') }}
    </v-btn>
  </div>
</template>

<style scoped>
.reviews-form {
  max-width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.review-card {
  position: relative;
}

.review-card .v-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e0e0e0;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.review-card .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(255, 193, 7, 0.3);
}

.review-card .v-card.expanded {
  border-color: rgba(255, 193, 7, 0.4);
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.2) !important;
}

.star-rating {
  display: flex;
  align-items: center;
}

.review-text-preview {
  line-height: 1.4;
  opacity: 0.8;
  font-style: italic;
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

.rating-selector {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.rating-selector .v-btn {
  transition: all 0.2s ease;
}

.rating-selector .v-btn:hover {
  transform: scale(1.1);
}

.review-textarea {
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

/* Animation for new reviews */
.mb-4 {
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

/* Review-specific styling */
.v-card-text {
  position: relative;
}

.v-card-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #ff9800, #ffc107);
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.v-card.expanded .v-card-text::before {
  opacity: 1;
}

/* Quote styling for review preview */
.review-text-preview::before {
  content: '"';
  color: #ff9800;
  font-size: 1.2em;
  font-weight: bold;
  margin-right: 2px;
}

.review-text-preview::after {
  content: '"';
  color: #ff9800;
  font-size: 1.2em;
  font-weight: bold;
  margin-left: 2px;
}

/* Enhanced star styling */
.star-rating .v-icon {
  filter: drop-shadow(0 1px 2px rgba(255, 193, 7, 0.3));
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .d-flex {
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

  .review-text-preview {
    font-size: 0.75rem;
  }

  .rating-selector {
    justify-content: flex-start;
  }
}

/* Focus states for accessibility */
.v-card:focus-visible {
  outline: 2px solid #ff9800;
  outline-offset: 2px;
}

.action-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.rating-selector .v-btn:focus-visible {
  outline: 2px solid #ff9800;
  outline-offset: 2px;
}

/* Enhanced visual hierarchy */
.text-sm.font-weight-bold {
  color: #1a1a1a;
  line-height: 1.3;
}

/* Avatar enhancement when expanded */
.v-card.expanded .v-avatar {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

/* Rating display enhancement */
.star-rating .v-icon[style*="color: rgb(255, 193, 7)"] {
  animation: starGlow 2s ease-in-out infinite alternate;
}

@keyframes starGlow {
  from {
    filter: drop-shadow(0 1px 2px rgba(255, 193, 7, 0.3));
  }
  to {
    filter: drop-shadow(0 1px 4px rgba(255, 193, 7, 0.6));
  }
}
</style>
