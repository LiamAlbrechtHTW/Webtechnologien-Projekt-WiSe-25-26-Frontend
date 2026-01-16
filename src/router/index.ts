import { createRouter, createWebHistory } from 'vue-router'

import SessionSelectView from '../views/SessionSelectView.vue'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'
import ManageView from '../views/ManageView.vue'
import LearnView from '../views/LearnView.vue'

import { getActiveSessionId } from '../session'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: SessionSelectView },
    { path: '/home', component: HomeView },
    { path: '/create', component: CreateView },
    { path: '/manage', component: ManageView },
    { path: '/learn', component: LearnView },
  ],
})

router.beforeEach((to) => {
  if (to.path === '/') return true

  const sessionId = getActiveSessionId()
  if (!sessionId) return '/'

  return true
})

export default router
