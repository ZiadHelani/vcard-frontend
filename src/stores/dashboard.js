import { defineStore } from 'pinia'
import { DashboardApi } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    isLoading: false,
  }),

  getters: {},

  actions: {
    async getDashboardData() {
      try {
        this.isLoading = true
        const response = await DashboardApi.getDashboardData()
        if (response.data) {
          return response.data
        }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useDashboardStore
