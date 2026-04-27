// stores/card.js
import { defineStore } from 'pinia'
import { DashboardApi, vcardAPI } from '@/plugins/api/endpoints.js'
import { useToast } from 'vue-toastification'
import router from '@/router/index.js'

export const useCardStore = defineStore('card', {
  state: () => ({
    // List of cards (for tables)
    cards: [],
    // Pagination for list
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
    },

    card: {
      pro_mode: false,
      card_details: {
        name: 'Your name',
        type: 'Personal',
        color: '#FFFFFF',
        contact_button_color: '#000000',
        published: false,
        qrcode_logo: '',
      },
      personal_details: {
        name: 'Your name',
        phone: '',
        bio: 'Your Bio.',
        about: 'Your About.',
        conclusion: 'Conclusion',
        // Images (blob URLs for preview)
        cover_image: '/test.jpg',
        cover_image_id: null,
        profile_image: '/user-placeholder.png',
        profile_image_id: null,
        background_image: '',
        background_image_id: null,
        contact_details_background: '',
        contact_details_background_id: null,
      },
      // Actual File objects for backend submission
      files: {
        cover_image: null,
        profile_image: null,
        background_image: null,
        contact_details_background: null,
        qrcode_logo: null,
      },
      faqs: [],
      buttons: [],
      reviews: [],
      gallery: [],
    },

    // Loading states
    isCreating: false,
    isUpdating: false,
    isLoading: false,
    isListLoading: false,
    // Per-row toggle loading map keyed by card slug
    togglingPublished: {},
    // Per-row deleting map keyed by card slug
    deleting: {},

    // Error handling
    error: null,

    // Success state
    lastCreatedCard: null,
  }),

  getters: {
    // Check if required fields are valid
    isCardValid: (state) => {
      // Required fields validation
      const cardDetailsValid =
        state.card.card_details.name.trim() !== '' && state.card.card_details.type.trim() !== ''
      const personalDetailsValid =
        state.card.personal_details.name.trim() !== '' &&
        state.card.personal_details.phone.trim() !== ''

      return cardDetailsValid && personalDetailsValid
    },

    // Get validation errors
    validationErrors: (state) => {
      const errors = {}

      // Card details validation
      if (state.card.card_details.name.trim() === '') {
        errors.card_name = 'Card name is required'
      }
      if (state.card.card_details.type.trim() === '') {
        errors.card_type = 'Card type is required'
      }

      // Personal details validation
      if (state.card.personal_details.name.trim() === '') {
        errors.personal_name = 'Personal name is required'
      }

      if (state.card.personal_details.phone.trim() === '') {
        errors.phone = 'Phone number is required'
      }

      return errors
    },
  },

  actions: {
    // Fetch all cards for list/datatable
    async fetchAllCards(params = {}) {
      this.isListLoading = true
      this.error = null

      try {
        const response = await vcardAPI.getAllCards({ ...params })

        // Try to infer structure: array, {cards: array}, or paginated {cards: {data, ...}} or plain {data, ...}
        let payload = response.data?.cards ?? response.data

        if (Array.isArray(payload)) {
          // Plain array
          this.cards = payload
          // Reset pagination for non-paginated
          this.pagination = {
            current_page: 1,
            per_page: payload.length || 15,
            total: payload.length || 0,
            last_page: 1,
            from: 0,
            to: payload.length || 0,
          }
        } else if (payload && Array.isArray(payload.data)) {
          // Paginated
          this.cards = payload.data
          this.pagination = {
            current_page: payload.current_page || 1,
            per_page: payload.per_page || 15,
            total: payload.total || payload.data.length || 0,
            last_page: payload.last_page || 1,
            from: payload.from || 0,
            to: payload.to || 0,
          }
        } else {
          // Unknown shape, try best-effort
          this.cards = []
        }

        return this.cards
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cards'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isListLoading = false
      }
    },

    // Update an existing card
    async updateCard(slug) {
      this.isUpdating = true
      this.error = null
      try {
        // Validate required fields before submission
        if (!this.validateCard()) {
          const toast = useToast()
          toast.error('Please fill in all required fields')
          throw new Error('Validation failed')
        }

        const cardData = this.prepareCardData()
        const response = await vcardAPI.updateCard(slug, cardData)

        const toast = useToast()
        toast.success('Card updated successfully!')

        // Navigate back to cards list
        router.push({ name: 'dashboard.index' })
        this.resetCard()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to update card'
        if (error.message !== 'Validation failed') {
          const toast = useToast()
          toast.error(this.error)
        }
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    // Reset list state
    resetCardsList() {
      this.cards = []
      this.pagination = {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
      }
    },

    // Load a single card for editing
    async loadCard(slug) {
      this.isLoading = true
      this.error = null
      this.resetCard()
      try {
        const res = await vcardAPI.getCard(slug)
        const card = res.data?.card || res.data
        if (!card) throw new Error('Invalid card response')

        // Map API data to store structure
        this.card = {
          id: card.id,
          uuid: card.uuid,
          slug: card.slug,
          pro_mode: card.pro_mode || false,
          card_details: {
            name: card.name || '',
            type:
              (card.type || 'personal').charAt(0).toUpperCase() +
              (card.type || 'personal').slice(1),
            color: card.color || '#FFFFFF',
            contact_button_color: card.contact_button_color || '#000000',
            published: !!card.published,
            qrcode_logo: card.qrcode_logo || '',
            qrcode_logo_path: card.qrcode_logo_path || null,
          },
          personal_details: {
            name: card.personal_details?.name || '',
            phone: card.personal_details?.phone || '',
            bio: card.personal_details?.bio || '',
            about: card.personal_details?.about || '',
            conclusion: card.personal_details?.conclusion || '',
            profile_image: card.personal_details?.profile_image || '/user-placeholder.png',
            profile_image_id: card.personal_details?.profile_image_id || null,
            cover_image: card.personal_details?.cover_image || '/test.jpg',
            cover_image_id: card.personal_details?.cover_image_id || null,
            background_image: card.personal_details?.background_image || '',
            background_image_id: card.personal_details?.background_image_id || null,
            contact_details_background: card.personal_details?.contact_details_background || '',
            contact_details_background_id:
              card.personal_details?.contact_details_background_id || null,
          },
          // Initialize files object for new file uploads
          files: {
            cover_image: null,
            profile_image: null,
            background_image: null,
            contact_details_background: null,
            qrcode_logo: null,
          },
          faqs: card.faqs || [],
          buttons: card.buttons || [],
          reviews: card.reviews || [],
          gallery: card.gallery || [],
        }

        return this.card
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load card'
        const toast = useToast()
        toast.error(this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete a card by slug
    async deleteCard(slug) {
      const toast = useToast()
      const idx = this.cards.findIndex((c) => c.slug === slug)
      if (idx === -1) return

      this.deleting = { ...this.deleting, [slug]: true }
      try {
        await vcardAPI.deleteCard(slug)
        // Remove from list
        this.cards.splice(idx, 1)
        // Adjust pagination counts if present
        if (this.pagination && typeof this.pagination.total === 'number') {
          this.pagination.total = Math.max(0, (this.pagination.total || 1) - 1)
        }
        const remaining = this.cards.length
        if (remaining === 0 && this.pagination.current_page > 1) {
          // Optionally refetch previous page
          this.pagination.current_page = this.pagination.current_page - 1
          await this.fetchAllCards({ page: this.pagination.current_page })
        }
        toast.success('Card deleted successfully')
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete card'
        toast.error(message)
        throw error
      } finally {
        const { [slug]: _, ...rest } = this.deleting
        this.deleting = rest
      }
    },

    // Toggle published status for a card (by slug)
    async toggleCardPublished(slug, nextValue) {
      const toast = useToast()
      // Find card index
      const idx = this.cards.findIndex((c) => c.slug === slug)
      if (idx === -1) return
      // Default nextValue to opposite if not provided
      const target = this.cards[idx]
      const desired = typeof nextValue === 'boolean' ? nextValue : !Boolean(target.published)

      // Optimistic update
      const prev = Boolean(target.published)
      this.togglingPublished = { ...this.togglingPublished, [slug]: true }
      this.cards = this.cards.map((c, i) => (i === idx ? { ...c, published: desired } : c))

      try {
        await vcardAPI.updateCardPublished(slug, desired)
        toast.success(`Card ${desired ? 'published' : 'unpublished'} successfully`)
      } catch (error) {
        // Revert on failure
        this.cards = this.cards.map((c, i) => (i === idx ? { ...c, published: prev } : c))
        const message = error.response?.data?.message || 'Failed to update card status'
        toast.error(message)
        throw error
      } finally {
        const { [slug]: _, ...rest } = this.togglingPublished
        this.togglingPublished = rest
      }
    },
    addFaq(question, answer, background_color) {
      this.card.faqs.push({ question, answer, background_color })
    },

    removeFaq(index) {
      if (index >= 0 && index < this.card.faqs.length) {
        this.card.faqs.splice(index, 1)
      }
    },

    updateFaq(index, newData) {
      if (index >= 0 && index < this.card.faqs.length) {
        this.card.faqs[index] = { ...this.card.faqs[index], ...newData }
      }
    },

    // Gallery actions
    addGalleryItem(src, cols = 1, rows = 1, image, order = 1) {
      this.card.gallery.push({ src, cols, rows, image, order })
    },

    removeGalleryItem(index) {
      if (index >= 0 && index < this.card.gallery.length) {
        this.card.gallery.splice(index, 1)
      }
    },

    updateGalleryItem(index, newData) {
      if (index >= 0 && index < this.card.gallery.length) {
        this.card.gallery[index] = { ...this.card.gallery[index], ...newData }
      }
    },

    reorderGalleryItems(newOrder) {
      this.card.gallery = newOrder
    },

    // Prepare card data for API submission
    prepareCardData() {
      const formData = new FormData()

      // Add basic card data
      formData.append('name', this.card.card_details.name)
      formData.append('type', this.card.card_details.type.toLowerCase() || 'personal')
      formData.append('color', this.card.card_details.color)
      formData.append('contact_button_color', this.card.card_details.contact_button_color)
      formData.append('published', this.card.card_details.published)
      formData.append('pro_mode', this.card.pro_mode)

      // Add personal details (text fields)
      formData.append('personal_details[name]', this.card.personal_details.name)
      formData.append('personal_details[phone]', this.card.personal_details.phone)
      formData.append('personal_details[bio]', this.card.personal_details.bio || '')
      formData.append('personal_details[about]', this.card.personal_details.about || '')
      formData.append('personal_details[conclusion]', this.card.personal_details.conclusion || '')

      // Add image files if they exist
      if (this.card.files.cover_image && this.card.files.cover_image instanceof File) {
        formData.append('personal_details[cover_image]', this.card.files.cover_image)
      }
      if (this.card.files.profile_image && this.card.files.profile_image instanceof File) {
        formData.append('personal_details[profile_image]', this.card.files.profile_image)
      }
      if (this.card.files.background_image && this.card.files.background_image instanceof File) {
        formData.append('personal_details[background_image]', this.card.files.background_image)
      }
      if (
        this.card.files.contact_details_background &&
        this.card.files.contact_details_background instanceof File
      ) {
        formData.append(
          'personal_details[contact_details_background]',
          this.card.files.contact_details_background,
        )
      }
      if (this.card.files.qrcode_logo && this.card.files.qrcode_logo instanceof File) {
        formData.append('qrcode_logo', this.card.files.qrcode_logo)
      }

      // Add FAQs
      if (this.card.faqs && this.card.faqs.length > 0) {
        this.card.faqs.forEach((faq, index) => {
          formData.append(`faqs[${index}][question]`, faq.question)
          formData.append(`faqs[${index}][answer]`, faq.answer)
          formData.append(`faqs[${index}][background_color]`, faq.background_color)
        })
      }

      // Add Buttons
      if (this.card.buttons && this.card.buttons.length > 0) {
        this.card.buttons.forEach((button, index) => {
          formData.append(`buttons[${index}][title]`, button.title)
          formData.append(`buttons[${index}][icon]`, button.icon || '')
          formData.append(`buttons[${index}][link]`, button.link)
          if (button.color) {
            formData.append(`buttons[${index}][color]`, button.color)
          }
          if (button.font_family) {
            formData.append(`buttons[${index}][font_family]`, button.font_family)
          }
          if (button.font_size) {
            formData.append(`buttons[${index}][font_size]`, button.font_size)
          }
        })
      }

      // Add Reviews
      if (this.card.reviews && this.card.reviews.length > 0) {
        this.card.reviews.forEach((review, index) => {
          formData.append(`reviews[${index}][review]`, review.review)
          formData.append(`reviews[${index}][user_name]`, review.user_name)
          formData.append(`reviews[${index}][rating]`, review.rating)
        })
      }

      // Add Gallery
      if (this.card.gallery && this.card.gallery.length > 0) {
        this.card.gallery.forEach((item, index) => {
          if (item.image && item.image instanceof File) {
            formData.append(`gallery[${index}][image]`, item.image)
          }
          formData.append(`gallery[${index}][id]`, item.id || null)
          formData.append(`gallery[${index}][cols]`, item.cols || 1)
          formData.append(`gallery[${index}][rows]`, item.rows || 1)
          formData.append(`gallery[${index}][order]`, item.order || 1)
        })
      }

      return formData
    },

    // Validate required fields
    validateCard() {
      const errors = this.validationErrors

      if (Object.keys(errors).length > 0) {
        this.error = 'Please fill in all required fields'
        return false
      }

      return true
    },

    // Store card to backend
    async storeCard() {
      this.isCreating = true
      this.error = null

      try {
        // Validate required fields before submission
        if (!this.validateCard()) {
          const toast = useToast()
          toast.error('Please fill in all required fields')
          throw new Error('Validation failed')
        }

        // Prepare data for API
        const cardData = this.prepareCardData()

        // Make API call
        const response = await vcardAPI.createCard(cardData)

        // Store the created card response
        this.lastCreatedCard = response.data

        // Show success message
        const toast = useToast()
        toast.success('Card created successfully!')

        // Navigate to dashboard index
        router.push({ name: 'dashboard.index' })
        this.resetCard()
        // Return the response for further processing
        return response.data
      } catch (error) {
        // Handle error
        this.error = error.response?.data?.message || error.message || 'Failed to create card'

        // Show error message (only if not already shown)
        if (error.message !== 'Validation failed') {
          const toast = useToast()
          toast.error(this.error)
        }

        // Re-throw error for component handling
        throw error
      } finally {
        this.isCreating = false
      }
    },

    // Clear error state
    clearError() {
      this.error = null
    },

    // Reset card to default state
    resetCard() {
      this.card = {
        card_details: {
          name: 'Your name',
          type: 'Personal',
          color: '#FFFFFF',
          contact_button_color: '#000000',
          published: false,
          qrcode_logo: '',
        },
        personal_details: {
          name: 'Your name',
          phone: '',
          bio: 'Your Bio.',
          about: 'Your About.',
          conclusion: 'Conclusion',
          profile_image: '/user-placeholder.png',
          profile_image_id: null,
          cover_image: '/test.jpg',
          cover_image_id: null,
          background_image: '',
          background_image_id: null,
          contact_details_background: '',
        },
        // Reset files object
        files: {
          cover_image: null,
          profile_image: null,
          background_image: null,
          qrcode_logo: null,
          contact_details_background: null,
        },
        faqs: [],
        buttons: [],
        reviews: [],
        gallery: [],
      }
      this.clearError()
    },

    copyCardUrl(card) {
      const toast = useToast()
      if (!card || !card.slug) {
        toast.error('Invalid card data')
        return
      }
      const baseUrl = window.location.origin
      const baseUrl2 = import.meta.env.VITE_CSRF_BASE_URL
      const cardUrl = `${baseUrl2}/cards/${card.slug}`

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(cardUrl).then(
          () => {
            toast.success('Card URL copied to clipboard!')
          },
          () => {
            toast.error('Failed to copy URL. Please try manually.')
          },
        )
      } else {
        // Fallback for browsers without navigator.clipboard
        const textarea = document.createElement('textarea')
        textarea.value = cardUrl
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          toast.success('Card URL copied to clipboard!')
        } catch (err) {
          toast.error('Failed to copy URL. Please try manually.')
        }
        document.body.removeChild(textarea)
      }
    },

    async removeMedia(mediaId) {
      const response = await DashboardApi.removeMedia(mediaId)
      return response
    },

    async removeQrCodeLogo(slug) {
      const response = await DashboardApi.removeQrCodeLogo(slug)
      return response
    },

    async donwloadVCard(slug) {
      try {
        this.isLoading = true
        const response = await vcardAPI.downloadVCard(slug)
        const blob = new Blob([response.data], { type: 'text/vcard' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${slug}.vcf`
        a.click()
        window.URL.revokeObjectURL(url)
        this.isLoading = false
        return response.data
      } catch (error) {
        this.isLoading = false
        this.error = error.response?.data?.message || 'Failed to download vcard'
        const toast = useToast()
        toast.error(this.error)
        throw error
      }
    },

    async submitContactForm(slug, data) {
      try {
        this.isLoading = true
        const response = await vcardAPI.submitContactForm(slug, data)
        const toast = useToast()
        toast.success(response.data.message)
        return response
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
