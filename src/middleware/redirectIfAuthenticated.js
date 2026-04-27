import useAuth from '@/composables/useAuth'

export default function redirectIfAuthenticated({ next }) {
  const { authenticated } = useAuth()

  if (authenticated.value) {
    return next({ name: 'dashboard' })
  }

  return next()
}
