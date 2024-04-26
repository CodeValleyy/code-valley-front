import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HelpView from '@/views/HelpView.vue'
import CodeView from '@/views/CodeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/code',
      name: 'code',
      component: CodeView
    },
    {
      path: '/help',
      name: 'help',
      component: HelpView
    }
  ]
})

export default router
