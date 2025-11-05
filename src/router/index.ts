import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LearnView from '../views/LearnView.vue'
import CreateView from '../views/CreateView.vue'
import ManageView from '../views/ManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/learn', name: 'learn', component: LearnView },
    { path: '/create', name: 'create', component: CreateView },
    { path: '/manage', name: 'manage', component: ManageView },
  ],
})

export default router
