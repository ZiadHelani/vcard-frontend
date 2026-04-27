import { defineStore } from 'pinia'
import { contactAPI } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    // Contacts data
    contacts: [],
    total_contacts: 0,
    total_contacts_in_this_week: 0,
    active_contacts: 0,
    conversion_rate: 0,
    currentContact: null,

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
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isTogglingActive: false,

    // Search and filters
    searchQuery: '',
    filters: {
      source: null,
      tags: [],
      dateRange: null,
    },

    // Error handling
    error: null,

    // Statistics
    stats: {
      totalContacts: 0,
      newThisWeek: 0,
      activeContacts: 0,
      conversionRate: 0,
    },
  }),

  getters: {
    // Get filtered contacts based on search query
    filteredContacts: (state) => {
      if (!state.searchQuery) return state.contacts

      const query = state.searchQuery.toLowerCase().trim()
      return state.contacts.filter((contact) => {
        const searchableFields = [
          contact.name,
          contact.company,
          contact.title,
          contact.emails?.map((e) => e.email).join(' '),
          contact.phones?.map((p) => p.phone).join(' '),
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

    // Get contact by ID
    getContactById: (state) => (id) => {
      return state.contacts.find((contact) => contact.id === id)
    },
  },

  actions: {
    // Fetch all contacts with pagination
    async fetchContacts(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await contactAPI.getContacts({
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          search: this.searchQuery,
          ...params,
        })

        if (response.data && response.data.contacts) {
          const contactsData = response.data.contacts
          this.contacts = contactsData.data || []

          // Update pagination info
          this.pagination = {
            current_page: contactsData.current_page || 1,
            per_page: contactsData.per_page || 15,
            total: contactsData.total || 0,
            last_page: contactsData.last_page || 1,
            from: contactsData.from || 0,
            to: contactsData.to || 0,
          }

          // Update stats
          this.stats.totalContacts = response.data.total_contacts || 0
          this.stats.newThisWeek = response.data.total_contacts_in_this_week || 0
          this.stats.activeContacts = response.data.active_contacts || 0
          this.stats.conversionRate = response.data.conversion_rate || 0
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch contacts'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Fetch single contact
    async fetchContact(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await contactAPI.getContact(id)
        this.currentContact = response.data.contact
        return response.data.contact
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch contact'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Create new contact
    async createContact(contactData) {
      this.isCreating = true
      this.error = null

      try {
        const formData = new FormData()

        // Append basic contact data
        Object.keys(contactData).forEach((key) => {
          if (key === 'emails') {
            // Append emails with proper array notation for Laravel
            contactData[key].forEach((email, index) => {
              formData.append(`emails[${index}][email]`, email.email || '')
              formData.append(`emails[${index}][label]`, email.label || '')
            })
          } else if (key === 'phones') {
            // Append phones with proper array notation for Laravel
            contactData[key].forEach((phone, index) => {
              formData.append(`phones[${index}][phone]`, phone.phone || '')
              formData.append(`phones[${index}][ext]`, phone.ext || '')
              formData.append(`phones[${index}][label]`, phone.label || '')
            })
          } else if (contactData[key] !== null && contactData[key] !== undefined) {
            formData.append(key, contactData[key])
          }
        })

        const response = await contactAPI.createContact(formData)

        // Add new contact to the beginning for immediate feedback
        // Parent component will refetch to ensure full data consistency
        this.contacts.unshift(response.data.contact)
        
        const toast = useToast()
        toast.success('Contact created successfully')

        return response.data.contact
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create contact'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isCreating = false
      }
    },

    // Update contact
    async updateContact(id, contactData) {
      this.isUpdating = true
      this.error = null

      try {
        const formData = new FormData()

        // Append updated contact data
        Object.keys(contactData).forEach((key) => {
          if (key === 'emails') {
            // Append emails with proper array notation for Laravel
            contactData[key].forEach((email, index) => {
              formData.append(`emails[${index}][email]`, email.email || '')
              formData.append(`emails[${index}][label]`, email.label || '')
            })
          } else if (key === 'phones') {
            // Append phones with proper array notation for Laravel
            contactData[key].forEach((phone, index) => {
              formData.append(`phones[${index}][phone]`, phone.phone || '')
              formData.append(`phones[${index}][ext]`, phone.ext || '')
              formData.append(`phones[${index}][label]`, phone.label || '')
            })
          } else if (contactData[key] !== null && contactData[key] !== undefined) {
            formData.append(key, contactData[key])
          }
        })

        const response = await contactAPI.updateContact(id, formData)

        // Update contact in the list
        const index = this.contacts.findIndex((contact) => contact.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data.contact
        }

        // Update current contact if it's the same
        if (this.currentContact?.id === id) {
          this.currentContact = response.data.contact
        }

        const toast = useToast()
        toast.success('Contact updated successfully')

        return response.data.contact
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update contact'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    // Delete contact
    async deleteContact(id) {
      this.isDeleting = true
      this.error = null

      try {
        await contactAPI.deleteContact(id)

        // Remove contact from the list
        this.contacts = this.contacts.filter((contact) => contact.id !== id)
        this.stats.totalContacts--

        // Clear current contact if it's the deleted one
        if (this.currentContact?.id === id) {
          this.currentContact = null
        }

        const toast = useToast()
        toast.success('Contact deleted successfully')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete contact'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    // Toggle contact active status
    async toggleContactActive(id) {
      this.isTogglingActive = true
      this.error = null

      try {
        const response = await contactAPI.toggleContactActive(id)

        // Update contact in the list
        const index = this.contacts.findIndex((contact) => contact.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data.contact
        }

        // Update current contact if it's the same
        if (this.currentContact?.id === id) {
          this.currentContact = response.data.contact
        }

        const toast = useToast()
        const status = response.data.is_active ? 'activated' : 'deactivated'
        toast.success(`Contact ${status} successfully`)

        return response.data.contact
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle contact status'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isTogglingActive = false
      }
    },

    // Search contacts
    async searchContacts(query) {
      this.searchQuery = query
      this.pagination.current_page = 1 // Reset to first page
      await this.fetchContacts()
    },

    // Load more contacts (for pagination)
    async loadMoreContacts() {
      if (!this.hasMorePages || this.isLoading) return

      this.pagination.current_page++
      const response = await this.fetchContacts()

      // Append new contacts to existing list
      if (response.contacts?.data) {
        this.contacts.push(...response.contacts.data)
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
        source: null,
        tags: [],
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
      this.contacts = []
      this.currentContact = null
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
