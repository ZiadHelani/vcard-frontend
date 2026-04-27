<template>
  <div>
    <AddContactDrawer @close="closeDrawer" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddContactDrawer from '@/components/Dashboard/Contact/AddContactDrawer.vue'

const isDrawerOpen = ref(false)

const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}
</script>

<style scoped>
/* Styles for the AddContactView can be added here if needed */
</style>