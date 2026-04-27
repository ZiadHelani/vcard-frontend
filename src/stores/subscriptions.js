import { defineStore } from 'pinia'
import { adminSubscriptionAPI } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    // Subscriptions data
    subscriptions: [],
    currentSubscription: null,

    // Pagination
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
    },

    // Loading states
    isLoading: false,
    isUpdating: false,
    isDeleting: false,
    isTogglingStatus: false,

    // Search and filters
    searchQuery: '',
    filters: {
      status: null,
      plan: null,
      dateRange: null,
    },

    // Error handling
    error: null,
  }),

  getters: {
    // Get filtered subscriptions based on search query
    filteredSubscriptions: (state) => {
      if (!state.searchQuery) return state.subscriptions

      const query = state.searchQuery.toLowerCase().trim()
      return state.subscriptions.filter((subscription) => {
        const searchableFields = [
          subscription.user_name,
          subscription.user_email,
          subscription.plan_name,
          subscription.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableFields.includes(query)
      })
    },

    // Check if there are more pages to load
    hasMorePages: (state) => {
      return state.pagination.current_page < state.pagination.last_page
    },

    // Get subscription by ID
    getSubscriptionById: (state) => (id) => {
      return state.subscriptions.find((subscription) => subscription.id === id)
    },
  },

  actions: {
    // Fetch all subscriptions with pagination
    async fetchSubscriptions(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await adminSubscriptionAPI.getAllSubscriptions({
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          search: this.searchQuery,
          ...params,
        })

        if (response.data && response.data.subscriptions) {
          const subscriptionsData = response.data.subscriptions
          this.subscriptions = subscriptionsData.data || []

          // Update pagination info
          this.pagination = {
            current_page: subscriptionsData.current_page || 1,
            per_page: subscriptionsData.per_page || 15,
            total: subscriptionsData.total || 0,
            last_page: subscriptionsData.last_page || 1,
            from: subscriptionsData.from || 0,
            to: subscriptionsData.to || 0,
          }
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch subscriptions'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete subscription
    async deleteSubscription(id) {
      this.isDeleting = true
      this.error = null

      try {
        await adminSubscriptionAPI.deleteSubscription(id)

        // Remove subscription from the list
        this.subscriptions = this.subscriptions.filter((subscription) => subscription.id !== id)

        // Clear current subscription if it's the deleted one
        if (this.currentSubscription?.id === id) {
          this.currentSubscription = null
        }

        const toast = useToast()
        toast.success('Subscription deleted successfully')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete subscription'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    // Toggle subscription status
    async toggleSubscriptionStatus(id) {
      this.isTogglingStatus = true
      this.error = null

      try {
        const response = await adminSubscriptionAPI.toggleSubscriptionStatus(id)

        // Update subscription in the list
        const index = this.subscriptions.findIndex((subscription) => subscription.id === id)
        if (index !== -1) {
          this.subscriptions[index] = response.data.subscription
        }

        // Update current subscription if it's the same
        if (this.currentSubscription?.id === id) {
          this.currentSubscription = response.data.subscription
        }

        const toast = useToast()
        const status = response.data.subscription.status === 'active' ? 'activated' : 'deactivated'
        toast.success(`Subscription ${status} successfully`)

        return response.data.subscription
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle subscription status'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isTogglingStatus = false
      }
    },

    // Create subscription
    async createSubscription(data) {
      this.isLoading = true
      this.error = null

      try {
        const response = await adminSubscriptionAPI.storeSubscription(data)
        if (response.status === 201) {
          return { success: true, message: response.data?.message || 'Subscription created successfully' }
        }
        return { success: false, message: response.data?.message || 'Failed to create subscription' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create subscription'
        const errBag = error.response?.data?.errors || {}
        const message = Object.keys(errBag).length
          ? Object.values(errBag).flat().join(' ')
          : this.error
        return { success: false, message, errors: errBag }
      } finally {
        this.isLoading = false
      }
    },

    // Search subscriptions
    async searchSubscriptions(query) {
      this.searchQuery = query
      this.pagination.current_page = 1 // Reset to first page
      await this.fetchSubscriptions()
    },

    // Load more subscriptions (for pagination)
    async loadMoreSubscriptions() {
      if (!this.hasMorePages || this.isLoading) return

      this.pagination.current_page++
      const response = await this.fetchSubscriptions()

      // Append new subscriptions to existing list
      if (response.subscriptions?.data) {
        this.subscriptions.push(...response.subscriptions.data)
      }
    },

    // Reset pagination
    resetPagination() {
      this.pagination.current_page = 1
    },

    // Clear search and filters
    clearFilters() {
      this.searchQuery = ''
      this.filters = {
        status: null,
        plan: null,
        dateRange: null,
      }
      this.resetPagination()
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Reset store state
    resetState() {
      this.subscriptions = []
      this.currentSubscription = null
      this.pagination = {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
      }
      this.searchQuery = ''
      this.clearFilters()
      this.clearError()
    },
  },
})
