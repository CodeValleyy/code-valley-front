import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CodeView from '@/views/CodeView.vue'
import LoginView from '@/views/LoginView.vue'
import NewsFeed from '@/views/NewsFeed.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileOverview from '@/views/ProfileOverview.vue'
import ProfileSettings from '@/views/ProfileSettings.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import ChangeEmail from '@/views/ChangeEmail.vue'
import SearchView from '@/views/SearchView.vue'
import NotificationsView from '@/views/NotificationsView.vue'

import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresGuest: true }
  },
  {
    path: '/newsfeed',
    name: 'newsfeed',
    meta: { requiresAuth: true },
    component: NewsFeed
  },
  {
    path: '/search',
    name: 'search',
    meta: { requiresAuth: true },
    component: SearchView
  },
  {
    path: '/notifications',
    name: 'notifications',
    meta: { requiresAuth: true },
    component: NotificationsView
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
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
    next({ name: 'newsfeed' })
  } else {
    next()
  }
})

export default router
