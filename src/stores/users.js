import { defineStore } from 'pinia'
import { adminUserAPI } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useUsersStore = defineStore('users', {
  state: () => ({
    // Users data
    users: [],
    currentUser: null,

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
      role: null,
      status: null,
      verified: null,
      subscription: null,
    },

    // Error handling
    error: null,
  }),

  getters: {
    // Get filtered users based on search query
    filteredUsers: (state) => {
      if (!state.searchQuery) return state.users

      const query = state.searchQuery.toLowerCase().trim()
      return state.users.filter((user) => {
        const searchableFields = [user.name, user.email, user.role]
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

    // Get user by ID
    getUserById: (state) => (id) => {
      return state.users.find((user) => user.id === id)
    },
  },

  actions: {
    // Fetch all users with pagination
    async fetchUsers(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await adminUserAPI.getAllUsers({
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          search: this.searchQuery,
          ...params,
        })

        if (response.data && response.data.users) {
          const usersData = response.data.users
          this.users = usersData.data || []

          // Update pagination info
          this.pagination = {
            current_page: usersData.current_page || 1,
            per_page: usersData.per_page || 15,
            total: usersData.total || 0,
            last_page: usersData.last_page || 1,
            from: usersData.from || 0,
            to: usersData.to || 0,
          }
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete user
    async deleteUser(id) {
      this.isDeleting = true
      this.error = null

      try {
        await adminUserAPI.deleteUser(id)

        // Remove user from the list
        this.users = this.users.filter((user) => user.id !== id)

        // Clear current user if it's the deleted one
        if (this.currentUser?.id === id) {
          this.currentUser = null
        }

        const toast = useToast()
        toast.success('User deleted successfully')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    // Toggle user verification status
    async toggleUserVerification(id) {
      this.isTogglingStatus = true
      this.error = null

      try {
        const response = await adminUserAPI.toggleUserVerification(id)

        // Update user in the list
        const index = this.users.findIndex((user) => user.id === id)
        if (index !== -1) {
          this.users[index] = response.data.user
        }

        // Update current user if it's the same
        if (this.currentUser?.id === id) {
          this.currentUser = response.data.user
        }

        const toast = useToast()
        const status = response.data.user.is_verified ? 'verified' : 'unverified'
        toast.success(`User ${status} successfully`)

        return response.data.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle user verification'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isTogglingStatus = false
      }
    },

    // Search users
    async searchUsers(query) {
      this.searchQuery = query
      this.pagination.current_page = 1 // Reset to first page
      await this.fetchUsers()
    },

    // Load more users (for pagination)
    async loadMoreUsers() {
      if (!this.hasMorePages || this.isLoading) return

      this.pagination.current_page++
      const response = await this.fetchUsers()

      // Append new users to existing list
      if (response.users?.data) {
        this.users.push(...response.users.data)
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
        role: null,
        status: null,
        verified: null,
        subscription: null,
      }
      this.resetPagination()
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Reset store state
    resetState() {
      this.users = []
      this.currentUser = null
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

    // Create user
    async createUser(data) {
      this.isLoading = true

      try {
        const response = await adminUserAPI.createUser(data)

        if (response.status === 201) {
          return { success: true, message: response.data.message }
        } else {
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
  },
})
