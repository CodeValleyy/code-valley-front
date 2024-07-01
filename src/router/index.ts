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
import PipelineView from '@/views/PipelineView.vue'
import GroupsView from '@/views/GroupsView.vue'

import PostDetail from '@/components/PostDetail.vue'

import { useAuth } from '@/composables/useAuth'

const { fetchMe, resetToken } = useAuth()

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
    path: '/pipeline',
    name: 'pipeline',
    meta: { requiresAuth: true },
    component: PipelineView
  },
  {
    path: '/groups',
    name: 'groups',
    meta: { requiresAuth: true },
    component: GroupsView
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail
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
    path: '/profile/:username?',
    name: 'profile',
    component: ProfileOverview,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'profile-settings',
    component: ProfileSettings,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'change-password',
        name: 'change-password',
        component: ChangePassword
      },
      {
        path: 'change-email',
        name: 'change-email',
        component: ChangeEmail
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

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await fetchMe()
    .then(() => true)
    .catch(() => false)
  if (!isAuthenticated) {
    resetToken()
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'newsfeed' })
  } else {
    next()
  }
})

export default router
