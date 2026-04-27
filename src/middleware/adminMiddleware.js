import { useAuthStore } from '@/stores/auth'

export default function adminMiddleware({ next, to }) {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return next({ name: 'login' })
  }
  
  // Check if user has admin role
  if (authStore.user?.role !== 'admin') {
    // Redirect non-admin users to dashboard
    return next({ name: 'dashboard.index' })
  }
  
  return next()
}
