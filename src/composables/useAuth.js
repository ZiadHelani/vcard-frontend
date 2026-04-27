import axios from 'axios'
import { computed, reactive, ref } from 'vue'

const state = reactive({
  authenticated: false,
  user: {},
})

export default function useAuth() {
  const authenticated = computed(() => state.authenticated)
  const user = computed(() => state.user)

  const errors = ref({})

  const setAuthenticated = (authenticated) => {
    state.authenticated = authenticated
  }

  const setUser = (user) => {
    state.user = user
  }

  const attempt = async () => {
    try {
      let response = await axios.get('/api/user')
      setAuthenticated(true)
      setUser(response.data)
      return response
    } catch (error) {
      setAuthenticated(false)
      setUser({})
      console.log(error)
    }
  }

  const login = async (credentials) => {
    await axios.get('/sanctum/csrf-cookie')
    try {
      const response = await axios.post('/login', credentials)
      return attempt()
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response?.data?.errors

        return Promise.reject(null)
      }
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post('/logout')

      setAuthenticated(false)
      setUser({})

      return response
    } catch (error) {
      return Promise.reject(null)
    }
  }

  return {
    authenticated,
    user,
    setAuthenticated,
    setUser,
    login,
    attempt,
    errors,
    logout,
  }
}
