<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()

const authStore = useAuthStore()
const toast = useToast()


onMounted(() => {
  /* global google */
  google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  })

  google.accounts.id.renderButton(
    document.getElementById('googleButton'),
    {
      theme: 'outline',
      size: 'large',
      width: 250,
    }
  )
})

async function handleCredentialResponse(response) {
  try {
    const { data } = await axios.post('/auth/login/google', {
      token: response.credential
    })

    authStore.user = data.user
    authStore.token = data.access_token
    authStore.isAuthenticated = true
    authStore.lastLoginAt = new Date().toISOString()
    authStore.rememberMe = true
    authStore.loginAttempts = 0 // Reset login attempts on success

    // Store in localStorage
    authStore.persistAuth()

    // Set session expiry (24 hours from now)
    authStore.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Setup auto-refresh token
    authStore.setupTokenRefresh()

    axios.defaults.headers.common['Authorization'] =
      `Bearer ${data.access_token}`

    toast.success(`Welcome back, ${data.user.name}!`)

    const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
    router.push(redirectPath)

  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div id="googleButton"></div>
</template>
