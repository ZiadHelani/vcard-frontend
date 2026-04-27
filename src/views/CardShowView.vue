<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import CardPreview from '@/components/Dashboard/CardPreview.vue'
import FreeCardPreview from '@/components/Dashboard/FreeCardPreview.vue'

const route = useRoute()
const cardStore = useCardStore()

const load = async () => {
  const slug = route.params.slug
  if (!slug) return
  try {
    await cardStore.loadCard(slug)
  } catch (e) {
    // Error toast handled in store
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="card-show-page" :style="{ backgroundColor: cardStore.card.pro_mode ? '#f5f5f5' : '#fff' }">
    <v-container fluid class="py-0 px-0" :class="{ 'px-2': !cardStore.card.pro_mode }">
      <v-row justify="center" class="px-0">
        <v-col cols="12" md="10" lg="8" class="px-0">
          <div class="d-flex justify-center my-8" v-if="cardStore.isLoading">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>
          <div v-else>
            <CardPreview v-if="cardStore.card.pro_mode" />
            <FreeCardPreview v-else />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.card-show-page {
  min-height: 100vh;
}
</style>
