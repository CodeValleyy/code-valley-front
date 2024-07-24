import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'
import NotificationsView from '@/views/NotificationsView.vue'
import PipelineView from '@/views/PipelineView.vue'

import { useAuth } from '@/composables/useAuth'

const { fetchMe, resetToken } = useAuth()

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/newsfeed',
    name: 'newsfeed',
    meta: { requiresAuth: true },
    component: () => import('@/views/NewsFeed.vue'),
  },
  {
    path: '/search',
    name: 'search',
    meta: { requiresAuth: true },
    component: () => import('@/views/SearchView.vue'),
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
    component: () => import('@/views/GroupsView.vue'),
  },
  {
    path: '/groups/new',
    name: 'groupCreate',
    meta: { requiresAuth: true },
    component: () => import('@/views/CreateGroupsView.vue'),
  },
  {
    path: '/groups/update/:id',
    name: 'groupUpdate',
    meta: { requiresAuth: true },
    component: () => import('@/views/UpdateGroupsView.vue'),
  },
  {
    path: '/groups/:id',
    name: 'groupDetails',
    meta: { requiresAuth: true },
    component: () => import('@/views/GroupDetailsView.vue'),
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/components/PostDetail.vue'),
    props: (route: RouteLocationNormalizedLoaded) => ({
      id: Number(route.params.id),
      showComment: route.query.showComment === 'true',
    }),
  },
  {
    path: '/code',
    name: 'code',
    meta: { requiresAuth: true },
    component: () => import('@/views/CodeView.vue'),
    props: (route: RouteLocationNormalizedLoaded) => ({
      code: route.query.code,
      language: route.query.language,
      outputType: route.query.outputType,
    }),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/profile/:username?',
    name: 'profile',
    component: () => import('@/views/ProfileOverview.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'profile-settings',
    component: () => import('@/views/ProfileSettings.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('@/views/ChangePassword.vue'),
      },
      {
        path: 'change-email',
        name: 'change-email',
        component: () => import('@/views/ChangeEmail.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  },
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
