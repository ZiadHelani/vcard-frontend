import { defineStore } from 'pinia'
import { supportAPI } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useSupportStore = defineStore('support', {
  state: () => ({
    // Loading states
    isSubmitting: false,

    // Form data
    form: {
      subject: '',
      message: '',
    },

    // Error handling
    error: null,
    validationErrors: {},

    // Success state
    isSubmitted: false,
  }),

  getters: {
    // Check if form is valid
    isFormValid: (state) => {
      return state.form.subject.trim() !== '' && state.form.message.trim() !== ''
    },

    // Check if form has any data
    hasFormData: (state) => {
      return state.form.subject.trim() !== '' || state.form.message.trim() !== ''
    },
  },

  actions: {
    // Submit support ticket
    async submitSupport(supportData = null) {
      this.isSubmitting = true
      this.error = null
      this.validationErrors = {}

      try {
        // Use provided data or form data
        const data = supportData || {
          subject: this.form.subject.trim(),
          message: this.form.message.trim(),
        }

        // Validate required fields
        if (!data.subject || !data.message) {
          throw new Error('Subject and message are required')
        }

        const response = await supportAPI.createSupport(data)

        // Reset form on success
        this.resetForm()
        this.isSubmitted = true

        const toast = useToast()
        toast.success('Support ticket submitted successfully! We will get back to you soon.')

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to submit support ticket'
        
        // Handle validation errors
        if (error.response?.data?.errors) {
          this.validationErrors = error.response.data.errors
        }

        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    // Update form field
    updateFormField(field, value) {
      if (this.form.hasOwnProperty(field)) {
        this.form[field] = value
        
        // Clear validation error for this field
        if (this.validationErrors[field]) {
          delete this.validationErrors[field]
        }
        
        // Clear general error when user starts typing
        if (this.error) {
          this.error = null
        }
      }
    },

    // Set form data
    setFormData(data) {
      this.form = {
        subject: data.subject || '',
        message: data.message || '',
      }
      this.clearErrors()
    },

    // Reset form
    resetForm() {
      this.form = {
        subject: '',
        message: '',
      }
      this.clearErrors()
      this.isSubmitted = false
    },

    // Clear all errors
    clearErrors() {
      this.error = null
      this.validationErrors = {}
    },

    // Clear success state
    clearSuccessState() {
      this.isSubmitted = false
    },

    // Reset entire store state
    resetState() {
      this.resetForm()
      this.clearErrors()
      this.isSubmitting = false
    },
  },
})
