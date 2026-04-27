import { createRouter, createWebHistory } from 'vue-router'
import middlewarePipeline from './middlewarePipeline'
import adminMiddleware from '@/middleware/adminMiddleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const element = document.querySelector(to.hash)
          if (element) {
            const headerHeight = 64
            resolve({
              el: to.hash,
              top: -headerHeight - 10,
              behavior: 'smooth',
            })
          } else {
            resolve({ top: 0, behavior: 'smooth' })
          }
        }, 100)
      })
    }

    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/card',
      component: () => import('@/layouts/CardPreviewLayout.vue'),
      children: [
        {
          path: ':slug/preview',
          name: 'card.show',
          component: () => import('@/views/CardShowView.vue'),
          props: true,
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/WebsiteLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue'),
        },
        {
          path: 'forget-password',
          name: 'forget-password',
          component: () => import('@/views/auth/ForgetPassword.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/ContactView.vue'),
        },
        {
          path: 'cards',
          name: 'cards',
          component: () => import('@/views/CardsShowcaseView.vue'),
        },
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import('@/views/PrivacyPolicyView.vue'),
        },
        {
          path: 'terms',
          name: 'terms',
          component: () => import('@/views/TermsView.vue'),
        },
      ],
    },

    {
      path: '/dashboard',
      redirect: '/dashboard/index',
    },

    {
      name: 'dashboard',
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      children: [
        {
          path: '/dashboard/index',
          name: 'dashboard.index',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: '/dashboard/card-builder',
          name: 'dashboard.card-builder',
          component: () => import('@/views/dashboard/CardBuilderView.vue'),
        },
        {
          path: '/dashboard/card-builder/:slug',
          name: 'dashboard.card-builder.edit',
          component: () => import('@/views/dashboard/CardBuilderView.vue'),
          props: true,
        },
        {
          path: '/dashboard/cards',
          name: 'dashboard.cards',
          component: () => import('@/views/dashboard/CardsView.vue'),
        },
        {
          path: '/dashboard/contacts',
          name: 'dashboard.contacts',
          component: () => import('@/views/dashboard/ContactView.vue'),
        },
        {
          path: '/dashboard/billings',
          name: 'dashboard.billings',
          component: () => import('@/views/dashboard/BillingView.vue'),
        },
        {
          path: '/dashboard/support',
          name: 'dashboard.support',
          component: () => import('@/views/dashboard/SupportView.vue'),
        },
        {
          path: '/dashboard/profile',
          name: 'dashboard.profile',
          component: () => import('@/views/dashboard/AccountView.vue'),
        },
      ],
    },

    // Admin Routes
    {
      name: 'admin',
      path: '/admin',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: {
        middleware: [adminMiddleware],
      },
      children: [
        {
          path: '/admin/users',
          name: 'admin.users',
          component: () => import('@/views/admin/UsersView.vue'),
          meta: {
            middleware: [adminMiddleware],
          },
        },
        {
          path: '/admin/subscriptions',
          name: 'admin.subscriptions',
          component: () => import('@/views/admin/SubscriptionsView.vue'),
          meta: {
            middleware: [adminMiddleware],
          },
        },
        {
          path: '/admin/users/create',
          name: 'admin.users.create',
          component: () => import('@/views/admin/CreateUserView.vue'),
          meta: {
            middleware: [adminMiddleware],
          },
        },
        {
          path: '/admin/subscriptions/create',
          name: 'admin.subscriptions.create',
          component: () => import('@/views/admin/CreateSubscriptionView.vue'),
          meta: {
            middleware: [adminMiddleware],
          },
        },
      ],
    },

    // 404 Not Found - Catch all routes
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware

  const context = { to, from, next }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  })
})

export default router
