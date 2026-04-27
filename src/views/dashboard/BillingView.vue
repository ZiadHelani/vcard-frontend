<script setup>

</script>

<template>
  <div class="billing">
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" class="mb-5 mb-lg-0">
        <h1 class="text-3xl gradient-title mb-0">{{ $t('dashboard.billing.title') }}</h1>
        <p class="text-muted text-sm">{{ $t('dashboard.billing.subtitle') }}</p>
      </v-col>
    </v-row>

    <!-- Pricing Cards -->
    <v-row justify="center" class="mb-16">
      <!-- Free Plan -->
      <v-col cols="12" md="4" lg="3" class="mb-6">
        <v-card class="pricing-card glass-light pa-6 h-100 border" elevation="0" rounded="xl">
          <div class="text-center">
            <h2 class="text-5xl font-weight-bold mb-0">🚀</h2>
            <h2 class="text-2xl font-weight-bold mb-0">{{ $t('dashboard.billing.plans.free.name') }}</h2>
            <div class="price-section mb-0">
              <span class="text-4xl font-weight-bold">{{ $t('dashboard.billing.plans.free.price') }}</span><span class="text-sm text-muted">{{ $t('dashboard.billing.plans.free.per') }}</span>
            </div>
            <p class="text-sm text-medium-emphasis mb-6">{{ $t('dashboard.billing.plans.free.desc') }}</p>

            <!-- Features List -->
            <div class="features-list text-left mb-8">
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.free.features.cards') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.free.features.templates') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.free.features.qrcode') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.free.features.analytics') }}</span>
              </div>
            </div>

            <v-btn
              color="dark"
              variant="outlined"
              block
              disabled
              class="text-sm font-weight-medium border"
              style="text-transform: none"
            >
              {{ $t('dashboard.billing.plans.free.button') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Pro Plan (Most Popular with Glow) -->
      <v-col cols="12" md="4" lg="3" class="mb-6">
        <div class="position-relative">
          <!-- Most Popular Badge -->
          <div class="most-popular-badge">
            <v-chip color="primary" size="small" variant="elevated" class="font-weight-bold"> {{ $t('dashboard.billing.badges.mostPopular') }} </v-chip>
          </div>

          <v-card
            class="pricing-card border-md border-primary border-opacity-100 pricing-card-pro glass-light pa-6 h-100 border glow-card"
            elevation="0"
            rounded="xl"
          >
            <div class="text-center">
              <h2 class="text-5xl font-weight-bold mb-0">⭐</h2>
              <h2 class="text-2xl font-weight-bold mb-0">{{ $t('dashboard.billing.plans.pro.name') }}</h2>
              <div class="price-section mb-0">
                <span class="text-4xl font-weight-bold">{{ $t('dashboard.billing.plans.pro.price') }}</span><span class="text-sm text-muted">{{ $t('dashboard.billing.plans.pro.per') }}</span>
              </div>
              <p class="text-sm text-medium-emphasis mb-6">{{ $t('dashboard.billing.plans.pro.desc') }}</p>

              <!-- Features List -->
              <div class="features-list text-left mb-8">
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon color="success" size="20" class="mr-3"
                  >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <span class="text-sm">{{ $t('dashboard.billing.plans.pro.features.unlimitedCards') }}</span>
                </div>
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon color="success" size="20" class="mr-3"
                  >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <span class="text-sm">{{ $t('dashboard.billing.plans.pro.features.premiumTemplates') }}</span>
                </div>
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon color="success" size="20" class="mr-3"
                  >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <span class="text-sm">{{ $t('dashboard.billing.plans.pro.features.advancedAnalytics') }}</span>
                </div>
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon color="success" size="20" class="mr-3"
                  >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <span class="text-sm">{{ $t('dashboard.billing.plans.pro.features.customBranding') }}</span>
                </div>
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon color="success" size="20" class="mr-3"
                  >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <span class="text-sm">{{ $t('dashboard.billing.plans.pro.features.teamCollaboration') }}</span>
                </div>
              </div>

              <v-btn
                color="primary"
                variant="elevated"
                block
                class="text-sm font-weight-medium glow-btn"
                style="text-transform: none"
              >
                {{ $t('dashboard.billing.plans.pro.button') }}
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- Business Plan -->
      <v-col cols="12" md="4" lg="3" class="mb-6">
        <v-card class="pricing-card glass-light pa-6 h-100 border" elevation="0" rounded="xl">
          <div class="text-center">
            <h2 class="text-5xl font-weight-bold mb-0">💎</h2>
            <h2 class="text-2xl font-weight-bold mb-0">{{ $t('dashboard.billing.plans.business.name') }}</h2>
            <div class="price-section mb-0">
              <span class="text-4xl font-weight-bold mb-0">{{ $t('dashboard.billing.plans.business.price') }}</span><span class="text-sm text-muted">{{ $t('dashboard.billing.plans.business.per') }}</span>
            </div>
            <p class="text-sm text-medium-emphasis mb-6">{{ $t('dashboard.billing.plans.business.desc') }}</p>

            <!-- Features List -->
            <div class="features-list text-left mb-8">
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.business.features.everythingInPro') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.business.features.advancedTeam') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.business.features.apiAccess') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.business.features.integrations') }}</span>
              </div>
              <div class="feature-item d-flex align-center mb-3">
                <v-icon color="success" size="20" class="mr-3"
                >mdi-checkbox-marked-circle-outline</v-icon
                >
                <span class="text-sm">{{ $t('dashboard.billing.plans.business.features.prioritySupport') }}</span>
              </div>
            </div>

            <v-btn
              color="success"
              block
              class="text-sm text-white font-weight-medium border"
              style="text-transform: none"
            >
              {{ $t('dashboard.billing.plans.business.button') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Invoices and Payment Method -->
    <v-row justify="center" class="mb-16">
      <!-- Recent Invoices -->
      <v-col cols="12" md="6" lg="6" class="mb-6">
        <v-card class="glass-light shadow-on-hover float-on-hover pa-6 h-100 border" elevation="0" rounded="xl">
          <h2 class="text-lg font-weight-medium mb-4">{{ $t('dashboard.billing.invoicesList.title') }}</h2>

          <div class="invoice-row">
            <div class="left">
              <div class="title">Pro Monthly</div>
              <div class="meta text-sm text-muted">Jan 15, 2024</div>
            </div>
            <div class="right">
              <div class="amount text-md font-weight-medium">$9.00</div>
              <div class="status paid text-xs text-success">{{ $t('dashboard.billing.invoicesList.paid') }}</div>
            </div>
          </div>

          <div class="invoice-row">
            <div class="left">
              <div class="title">Pro Monthly</div>
              <div class="meta text-sm text-muted">Dec 15, 2023</div>
            </div>
            <div class="right">
              <div class="amount text-md font-weight-medium">$9.00</div>
              <div class="status paid text-xs text-success">Paid</div>
            </div>
          </div>

          <div class="invoice-row no-divider">
            <div class="left">
              <div class="title">Pro Monthly</div>
              <div class="meta text-sm text-muted">Nov 15, 2023</div>
            </div>
            <div class="right">
              <div class="amount text-md font-weight-medium">$9.00</div>
              <div class="status paid text-xs text-success">{{ $t('dashboard.billing.invoicesList.paid') }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Payment Method -->
      <v-col cols="12" md="6" lg="6" class="mb-6">
        <v-card class="glass-light shadow-on-hover float-on-hover pa-6 h-100 border" elevation="0" rounded="xl">
          <h2 class="text-lg font-weight-medium mb-4">{{ $t('dashboard.billing.payment.title') }}</h2>

          <div class="method-pill d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-3">
              <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold py-5 px-4" rounded="lg">VISA</v-chip>
              <div class="d-flex flex-column">
                <div class="text-md font-weight-medium">•••• •••• •••• 4242</div>
                <div class="text-xs text-muted">{{ $t('dashboard.billing.payment.expires', { date: '12/27' }) }}</div>
              </div>
            </div>
            <v-btn variant="text" color="primary" class="text-sm px-2" style="text-transform:none">{{ $t('dashboard.billing.payment.edit') }}</v-btn>
          </div>

          <v-btn
            variant="flat"
            color="grey-lighten-4"
            block
            class="payment-add-btn text-md font-weight-medium mt-4"
            style="text-transform: none"
          >
            {{ $t('dashboard.billing.payment.add') }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>
