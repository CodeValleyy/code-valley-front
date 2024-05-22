import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CodeView from '@/views/CodeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileOverview from '@/views/ProfileOverview.vue'
import ProfileSettings from '@/views/ProfileSettings.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import ChangeEmail from '@/views/ChangeEmail.vue'

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
    meta: { requiresAuth: true },
    component: CodeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: ProfileOverview
      },
      {
        path: 'settings',
        component: ProfileSettings,
        children: [
          {
            path: 'change-password',
            component: ChangePassword
          },
          {
            path: 'change-email',
            component: ChangeEmail
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
