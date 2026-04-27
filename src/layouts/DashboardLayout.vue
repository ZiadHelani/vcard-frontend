<template>
  <div class="dashboard-layout">
    <!-- Sidebar Component -->
    <Sidebar/>

    <div class="dashboard-content">
      <!-- Header Component -->
      <Header/>

      <!-- Main Content Area -->
      <v-main class="dashboard-main pa-6 mt-14">
        <RouterView />
      </v-main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Dashboard/Header.vue'
import Sidebar from '@/components/Dashboard/Sidebar.vue'
import { RouterView } from 'vue-router'

// Controls the sidebar rail (mini) vs expanded state
const isRail = ref(false)
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-main {
  flex: 1;
  overflow-y: auto;
  background-color: rgb(var(--v-theme-background));
}
</style>
