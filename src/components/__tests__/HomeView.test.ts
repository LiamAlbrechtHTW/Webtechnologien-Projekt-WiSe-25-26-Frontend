import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/create', component: { template: '<div />' } },
    { path: '/manage', component: { template: '<div />' } },
    { path: '/learn', component: { template: '<div />' } },
  ],
})

test('zeigt alle Navigationslinks', async () => {
  router.push('/')
  await router.isReady()

  render(HomeView, {
    global: { plugins: [router] },
  })

  expect(screen.getByText('Erstellen')).toBeInTheDocument()
  expect(screen.getByText('Verwalten')).toBeInTheDocument()
  expect(screen.getByText('Lernen')).toBeInTheDocument()
})
