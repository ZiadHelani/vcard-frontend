import http from './http-common'
import axios from 'axios'

// CSRF endpoint (needs full URL, not API prefix)
export const csrfAPI = {
  getCookie: () =>
    axios.get(`${import.meta.env.VITE_CSRF_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    }),
}

// Authentication endpoints
export const authAPI = {
  // Login user
  login: (credentials) => {
    return http.post('/auth/login', credentials)
  },

  // Register user
  register: (userData) => {
    return http.post('/auth/register', userData)
  },

  // Logout user
  logout: () => {
    return http.post('/auth/logout')
  },

  // Get current user profile
  me: () => {
    return http.get('/user/profile')
  },

  // Refresh token
  refresh: () => {
    return http.post('/auth/refresh')
  },

  // Forgot password
  forgotPassword: (email) => {
    return http.post('/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword: (data) => {
    return http.put('/auth/reset-password', data)
  },

  // Verify email
  verifyEmail: (token) => {
    return http.post('/auth/verify-email', { token })
  },

  // Resend verification email
  resendVerification: () => {
    return http.post('/auth/resend-verification')
  },
}

export const DashboardApi = {
  getDashboardData: () => {
    return http.get('/home/data')
  },

  removeMedia: (mediaId) => {
    return http.delete(`/media/destroy/${mediaId}`)
  },

  removeQrCodeLogo: (slug) => {
    return http.delete(`/cards/remove-qrcode-logo/${slug}`)
  },
}

// User management endpoints
export const userAPI = {
  // Get user profile
  getProfile: () => {
    return http.get('/user/profile')
  },

  // Update user profile
  updateProfile: (data) => {
    return http.put('/user/profile', data)
  },

  // Update password
  updatePassword: (data) => {
    return http.put('/user/password', data)
  },

  // Upload avatar
  uploadAvatar: (formData) => {
    return http.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete account
  deleteAccount: () => {
    return http.delete('/user/account')
  },
}

// VCard endpoints
export const vcardAPI = {
  // Get all user's cards
  getCards: () => {
    return http.get('/cards')
  },

  // Get all cards (list for table)
  getAllCards: (params = {}) => {
    return http.get('/cards/get-all', { params })
  },

  // Get single card
  getCard: (slug) => {
    return http.get(`/cards/show/${slug}`)
  },

  // Create new card
  createCard: (data) => {
    return http.post('/cards/store', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update card
  updateCard: (slug, data) => {
    return http.post(`/cards/update/${slug}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete card
  deleteCard: (slug) => {
    return http.delete(`/cards/delete/${slug}`)
  },

  // Publish card
  publishCard: (slug) => {
    return http.post(`/cards/${slug}/publish`)
  },

  // Unpublish card
  unpublishCard: (slug) => {
    return http.post(`/cards/${slug}/unpublish`)
  },

  // Update published status
  updateCardPublished: (slug, published) => {
    return http.put(`/cards/update/${slug}/status`, { published })
  },

  // Get card analytics
  getCardAnalytics: (slug) => {
    return http.get(`/cards/${slug}/analytics`)
  },

  // Download vcard
  downloadVCard: (slug) => {
    return http.get(`/cards/download-vcard/${slug}`)
  },

  // Submit Contact Form in card
  submitContactForm: (slug, data) => {
    return http.post(`/cards/send-mail/${slug}`, data)
  },
}

// Subscription endpoints
export const subscriptionAPI = {
  // Get available plans
  getPlans: () => {
    return http.get('/plans/get-all')
  },

  // Get user's subscriptions
  getSubscriptions: () => {
    return http.get('/subscriptions')
  },

  // Subscribe to plan
  subscribe: (planId, paymentData) => {
    return http.post('/subscriptions', { plan_id: planId, ...paymentData })
  },

  // Cancel subscription
  cancelSubscription: (subscriptionId) => {
    return http.delete(`/subscriptions/${subscriptionId}`)
  },

  // Get subscription details
  getSubscription: (subscriptionId) => {
    return http.get(`/subscriptions/${subscriptionId}`)
  },
}

// File upload endpoints
export const fileAPI = {
  // Upload image
  uploadImage: (formData) => {
    return http.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete image
  deleteImage: (imageId) => {
    return http.delete(`/upload/image/${imageId}`)
  },
}

// Analytics endpoints
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: () => {
    return http.get('/analytics/dashboard')
  },

  // Get card views
  getCardViews: (slug, period = '30d') => {
    return http.get(`/analytics/cards/${slug}/views?period=${period}`)
  },

  // Track card view
  trackCardView: (slug) => {
    return http.post(`/analytics/cards/${slug}/view`)
  },
}

// Generic reorder endpoint
export const reorderAPI = {
  // Reorder any model items
  reorder: (model, data) => {
    // Expects `data` to be an array of objects [{ model_id, order }, ...]
    return http.post(`/reorder/data/${model}`, data)
  },
}

// Contact endpoints
export const contactAPI = {
  // Get all contacts with pagination
  getContacts: (params = {}) => {
    return http.get('/contacts/get-all', { params })
  },

  // Get single contact
  getContact: (id) => {
    return http.get(`/contacts/show-single-contact/${id}`)
  },

  // Create new contact
  createContact: (data) => {
    return http.post('/contacts/store', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update contact
  updateContact: (id, data) => {
    return http.post(`/contacts/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete contact
  deleteContact: (id) => {
    return http.delete(`/contacts/delete/${id}`)
  },

  // Toggle contact active status
  toggleContactActive: (id) => {
    return http.patch(`/contacts/toggle-active/${id}`)
  },
}

// Support endpoints
export const supportAPI = {
  // Create support ticket
  createSupport: (data) => {
    return http.post('/support/store', data)
  },
}

// Admin User endpoints
export const adminUserAPI = {
  // Get all users with pagination
  getAllUsers: (params = {}) => {
    return http.get('/users/get-all', { params })
  },

  // Create user
  createUser: (data) => {
    return http.post('/users/store', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete user
  deleteUser: (id) => {
    return http.delete(`/users/delete/${id}`)
  },

  // Toggle user verification status
  toggleUserVerification: (id) => {
    return http.patch(`/users/${id}/toggle-verification`)
  },
}

// Admin Subscription endpoints
export const adminSubscriptionAPI = {
  // Get all subscriptions with pagination
  getAllSubscriptions: (params = {}) => {
    return http.get('/admin/subscriptions/get-all', { params })
  },

  // Create (store) subscription
  storeSubscription: (data) => {
    return http.post('/admin/subscriptions/store', data)
  },

  // Get single subscription
  getSubscription: (id) => {
    return http.get(`/admin/subscriptions/${id}`)
  },

  // Update subscription
  updateSubscription: (id, data) => {
    return http.put(`/admin/subscriptions/${id}`, data)
  },

  // Delete subscription
  deleteSubscription: (id) => {
    return http.delete(`/admin/subscriptions/delete/${id}`)
  },

  // Toggle subscription status
  toggleSubscriptionStatus: (id) => {
    return http.patch(`/admin/subscriptions/${id}/toggle-status`)
  },
}

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  vcard: vcardAPI,
  subscription: subscriptionAPI,
  file: fileAPI,
  analytics: analyticsAPI,
  dashboardApi: DashboardApi,
  contact: contactAPI,
  support: supportAPI,
  reorder: reorderAPI,
  adminUser: adminUserAPI,
  adminSubscription: adminSubscriptionAPI,
}
