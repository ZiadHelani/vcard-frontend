import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withXSRFToken: true,
})

// Attach Authorization header if token exists (token-based Sanctum usage)
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on unauthorized
http.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('auth')
      localStorage.removeItem('token')
      // Avoid importing router to prevent circular deps
      const current = encodeURIComponent(window.location.pathname + window.location.search)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${current}`
      }
    }
    return Promise.reject(err)
  },
)

export default http
