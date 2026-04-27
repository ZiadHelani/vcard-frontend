import { defineStore } from 'pinia'
import { authAPI, csrfAPI } from '@/plugins/api/endpoints'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Authentication state
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    // User permissions and subscription info
    permissions: [],
    subscription: null,

    // Login/logout tracking
    lastLoginAt: null,
    loginAttempts: 0,
    maxLoginAttempts: 5,

    // Remember me functionality
    rememberMe: false,

    // Error handling
    authError: null,

    // Session management
    sessionExpiry: null,
    refreshTokenTimeout: null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user && !!state.token,

    currentUser: (state) => state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userAvatar: (state) => state.user?.image || '/avatar.jpg',
    userId: (state) => state.user?.id || null,
    role: (state) => state.role || 'user',

    hasActiveSubscription: (state) => state.user?.has_active_subscription || false,
    currentSubscription: (state) => state.user?.active_subscription_now || null,
    subscriptionStatus: (state) => state.user?.active_subscription_now?.status || 'inactive',
    subscriptionPlan: (state) => state.user?.active_subscription_now?.plan_name || null,

    isEmailVerified: (state) => state.user?.is_verified || false,
    needsEmailVerification: (state) => state.isAuthenticated && !state.user?.is_verified,

    hasPermission: (state) => (permission) => state.permissions.includes(permission),
    hasAnyPermission: (state) => (permissions) =>
      permissions.some((p) => state.permissions.includes(p)),
    hasAllPermissions: (state) => (permissions) =>
      permissions.every((p) => state.permissions.includes(p)),

    isSessionExpired: (state) => {
      if (!state.sessionExpiry) return false
      return new Date() > new Date(state.sessionExpiry)
    },

    canAttemptLogin: (state) => state.loginAttempts < state.maxLoginAttempts,
    remainingLoginAttempts: (state) => Math.max(0, state.maxLoginAttempts - state.loginAttempts),

    authToken: (state) => state.token,
    authHeaders: (state) => (state.token ? { Authorization: `Bearer ${state.token}` } : {}),
  },

  actions: {
    // Initialize authentication from stored data
    async initializeAuth() {
      try {
        const storedAuth = localStorage.getItem('auth')
        const storedToken = localStorage.getItem('token')

        if (storedAuth && storedToken) {
          const authData = JSON.parse(storedAuth)

          // Restore authentication state
          this.user = authData.user.user
          this.token = storedToken
          this.isAuthenticated = true
          this.lastLoginAt = authData.lastLoginAt
          this.rememberMe = authData.rememberMe || false

          console.log('user: ', this.user)

          // Set session expiry if not exists
          if (!this.sessionExpiry) {
            this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }

          // Setup token refresh
          this.setupTokenRefresh()

          // Verify token in background (don't clear auth if it fails)
          this.verifyTokenSilently()
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Don't clear auth on initialization error - just log it
      }
    },

    // Login action
    async login(credentials, rememberMe = false) {
      const toast = useToast()

      if (!this.canAttemptLogin) {
        const error = `Too many login attempts. Please try again later.`
        toast.error(error)
        throw new Error(error)
      }

      this.isLoading = true
      this.authError = null

      try {
        // First, fetch CSRF cookie from Laravel Sanctum
        await csrfAPI.getCookie()

        const response = await authAPI.login(credentials)

        if (response.data) {
          const { access_token, user } = response.data

          // Update store state
          this.user = user
          this.token = access_token
          this.isAuthenticated = true
          this.lastLoginAt = new Date().toISOString()
          this.rememberMe = rememberMe
          this.loginAttempts = 0 // Reset login attempts on success

          // Store in localStorage
          this.persistAuth()

          // Set session expiry (24 hours from now)
          this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

          // Setup auto-refresh token
          this.setupTokenRefresh()

          toast.success(`Welcome back, ${user.name}!`)

          return { success: true, user, token: access_token }
        }
      } catch (error) {
        this.loginAttempts++
        this.authError = error.response?.data?.message || 'Login failed'

        // Handle different error types
        if (error.response?.status === 401) {
          toast.error('Invalid email or password. Please try again.')
        } else if (error.response?.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            Object.values(errors)
              .flat()
              .forEach((errorMessage) => {
                toast.error(errorMessage)
              })
          } else {
            toast.error(error.response.data.message || 'Validation failed')
          }
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        } else {
          toast.error(error.response?.data?.message || 'Login failed. Please try again.')
        }

        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Logout action
    async logout(showMessage = true) {
      const toast = useToast()

      try {
        // Call logout API if token exists
        if (this.token) {
          await authAPI.logout()
        }
      } catch (error) {
        console.error('Logout API call failed:', error)
        // Continue with logout even if API call fails
      }

      // Clear authentication state
      this.clearAuth()

      if (showMessage) {
        toast.info('You have been logged out successfully')
      }
    },

    // Register action
    async register(userData) {
      const toast = useToast()
      this.isLoading = true
      this.authError = null

      try {
        // First, fetch CSRF cookie from Laravel Sanctum
        await csrfAPI.getCookie()

        const response = await authAPI.register(userData)

        if (response.data) {
          const { access_token, user } = response.data

          // Update store state
          this.user = user
          this.token = access_token
          this.isAuthenticated = true
          this.lastLoginAt = new Date().toISOString()

          // Store in localStorage
          this.persistAuth()

          toast.success(`Welcome to VCardPro, ${user.name}!`)

          return { success: true, user, token: access_token }
        }
      } catch (error) {
        this.authError = error.response?.data?.message || 'Registration failed'

        if (error.response?.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            Object.values(errors)
              .flat()
              .forEach((errorMessage) => {
                toast.error(errorMessage)
              })
          }
        } else {
          toast.error(this.authError)
        }

        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Update user profile
    async updateProfile(profileData) {
      const toast = useToast()
      this.isLoading = true

      try {
        const response = await authAPI.me() // Get updated user data from /user/profile

        if (response.data) {
          this.user = { ...this.user, ...response.data }
          this.persistAuth()
          toast.success('Profile updated successfully')
          return response.data
        }
      } catch (error) {
        toast.error('Failed to update profile')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Refresh user data
    async refreshUser() {
      if (!this.token) return

      try {
        const response = await authAPI.me() // Uses /user/profile endpoint
        if (response.data) {
          console.log('Ref:', response.data)
          this.user = response.data.user
          this.persistAuth()
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error)
        if (error.response?.status === 401) {
          this.clearAuth()
        }
      }
    },

    // Verify token validity
    async verifyToken() {
      if (!this.token) {
        this.clearAuth()
        return false
      }

      try {
        const response = await authAPI.me() // Uses /user/profile endpoint
        if (response.data) {
          this.user = response.data
          this.persistAuth()
          return true
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        this.clearAuth()
        return false
      }
    },

    // Verify token silently (don't clear auth on failure)
    async verifyTokenSilently() {
      if (!this.token) return false

      try {
        const response = await authAPI.me() // Uses /user/profile endpoint
        if (response.data) {
          this.user = response.data.user
          this.persistAuth()
          return true
        }
      } catch (error) {
        console.error('Silent token verification failed:', error)
        // Don't clear auth - just return false
        return false
      }
    },

    // Setup automatic token refresh
    setupTokenRefresh() {
      // Clear existing timeout
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout)
      }

      // Set refresh for 23 hours (1 hour before expiry)
      this.refreshTokenTimeout = setTimeout(
        async () => {
          try {
            await this.refreshUser()
            this.setupTokenRefresh() // Setup next refresh
          } catch (error) {
            console.error('Auto token refresh failed:', error)
            this.clearAuth()
          }
        },
        23 * 60 * 60 * 1000,
      ) // 23 hours
    },

    // Clear authentication state
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.permissions = []
      this.subscription = null
      this.lastLoginAt = null
      this.authError = null
      this.sessionExpiry = null
      this.rememberMe = false

      // Clear stored data
      localStorage.removeItem('auth')
      localStorage.removeItem('token')

      // Clear refresh timeout
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout)
        this.refreshTokenTimeout = null
      }
    },

    // Persist authentication data
    persistAuth() {
      if (this.user && this.token) {
        const authData = {
          user: this.user,
          isAuthenticated: this.isAuthenticated,
          lastLoginAt: this.lastLoginAt,
          rememberMe: this.rememberMe,
        }

        localStorage.setItem('auth', JSON.stringify(authData))
        localStorage.setItem('token', this.token)
      }
    },

    // Reset login attempts (for admin or after time delay)
    resetLoginAttempts() {
      this.loginAttempts = 0
    },

    // Set authentication error
    setAuthError(error) {
      this.authError = error
    },

    // Clear authentication error
    clearAuthError() {
      this.authError = null
    },

    // Check if user has specific subscription plan
    hasSubscriptionPlan(planName) {
      return this.currentSubscription?.plan_name === planName
    },

    // Check if subscription is active
    isSubscriptionActive() {
      return this.hasActiveSubscription && this.subscriptionStatus === 'active'
    },

    // Update subscription data
    updateSubscription(subscriptionData) {
      if (this.user) {
        this.user.active_subscription_now = subscriptionData
        this.user.has_active_subscription =
          !!subscriptionData && subscriptionData.status === 'active'
        this.persistAuth()
      }
    },

    // Forget password
    async forgetPassword(email) {
      this.isLoading = true

      try {
        const response = await authAPI.forgotPassword(email)
        if (response.data && response.status === 200) {
          return { success: true, message: response.data.message || 'OTP sent to your email' }
        }
      } catch (error) {
        console.error('Failed to forget password:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to send OTP to your email',
        }
      } finally {
        this.isLoading = false
      }
    },

    // Reset password
    async resetPassword(data) {
      this.isLoading = true

      try {
        const response = await authAPI.resetPassword(data)
        if (response.data && response.status === 200) {
          return { success: true, message: response.data.message }
        }
      } catch (error) {
        console.error('Failed to reset password:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to reset password',
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useAuthStore
