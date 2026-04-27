<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { t, locale, isRTL, changeLocale } = useI18n()

// Example form with validation
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  if (!email.value) {
    alert(t('validation.required', { field: t('common.email') }))
    return
  }
  alert(t('auth.login.success'))
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <!-- Header with language switcher -->
          <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-h4">{{ $t('common.appName') }}</h1>
            <LanguageSwitcher variant="menu" />
          </div>

          <v-divider class="mb-6"></v-divider>

          <!-- Example 1: Basic translations -->
          <v-card class="mb-6 pa-4" variant="tonal" color="primary">
            <h2 class="text-h6 mb-3">{{ $t('common.welcome') }}</h2>
            <p>
              Current locale: <strong>{{ locale }}</strong> |
              Is RTL: <strong>{{ isRTL }}</strong>
            </p>
          </v-card>

          <!-- Example 2: Login form with translations -->
          <v-card class="mb-6 pa-4" variant="outlined">
            <h3 class="text-h6 mb-4">{{ $t('auth.login.title') }}</h3>
            <p class="text-caption mb-4">{{ $t('auth.login.subtitle') }}</p>

            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                :label="$t('auth.login.email')"
                :placeholder="$t('auth.login.email')"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :label="$t('auth.login.password')"
                :placeholder="$t('auth.login.password')"
                type="password"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-btn type="submit" color="primary" block size="large">
                {{ $t('auth.login.submit') }}
              </v-btn>
            </v-form>

            <p class="text-center mt-3 text-caption">
              {{ $t('auth.login.noAccount') }}
              <a href="#">{{ $t('auth.login.signUp') }}</a>
            </p>
          </v-card>

          <!-- Example 3: Dashboard menu items -->
          <v-card class="mb-6 pa-4" variant="outlined">
            <h3 class="text-h6 mb-4">{{ $t('dashboard.menu.dashboard') }}</h3>
            <v-list density="compact">
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-view-dashboard</v-icon>
                </template>
                <v-list-item-title>{{ $t('dashboard.menu.dashboard') }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-card</v-icon>
                </template>
                <v-list-item-title>{{ $t('dashboard.menu.cardBuilder') }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-account-group</v-icon>
                </template>
                <v-list-item-title>{{ $t('dashboard.menu.contacts') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Example 4: Card builder fields -->
          <v-card class="mb-6 pa-4" variant="outlined">
            <h3 class="text-h6 mb-4">{{ $t('card.builder.title') }}</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :label="$t('card.fields.firstName')"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :label="$t('card.fields.lastName')"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="$t('card.fields.email')"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="$t('card.fields.phone')"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <!-- Example 5: Common actions -->
          <v-card class="pa-4" variant="outlined">
            <h3 class="text-h6 mb-4">{{ $t('common.actions') }}</h3>
            <div class="d-flex gap-2 flex-wrap">
              <v-btn color="primary">{{ $t('common.save') }}</v-btn>
              <v-btn color="secondary">{{ $t('common.cancel') }}</v-btn>
              <v-btn color="error">{{ $t('common.delete') }}</v-btn>
              <v-btn color="info">{{ $t('common.edit') }}</v-btn>
              <v-btn color="success">{{ $t('common.submit') }}</v-btn>
            </div>
          </v-card>

          <!-- Language switcher variants -->
          <v-divider class="my-6"></v-divider>
          <div class="text-center">
            <h3 class="text-h6 mb-4">Language Switcher Variants</h3>
            <div class="d-flex flex-column gap-4 align-center">
              <div>
                <p class="text-caption mb-2">Menu Variant:</p>
                <LanguageSwitcher variant="menu" />
              </div>
              <div>
                <p class="text-caption mb-2">Buttons Variant:</p>
                <LanguageSwitcher variant="buttons" />
              </div>
              <div>
                <p class="text-caption mb-2">Select Variant:</p>
                <LanguageSwitcher variant="select" />
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}
</style>
