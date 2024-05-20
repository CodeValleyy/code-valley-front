import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/code',
    name: 'code',
    component: () => import('../views/CodeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('../views/ProfileOverview.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/ProfileSettings.vue'),
        children: [
          {
            path: 'change-password',
            component: () => import('../views/ChangePassword.vue')
          },
          {
            path: 'change-email',
            component: () => import('../views/ChangeEmail.vue')
          }
        ]
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getToken()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'profile' })
  } else {
    next()
  }
})

export default router
