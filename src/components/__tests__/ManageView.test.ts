import { render, screen, cleanup } from '@testing-library/vue'
import { vi, test, expect, beforeEach, afterEach } from 'vitest'
import ManageView from '../../views/ManageView.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/session', () => ({
  getActiveSessionId: () => 1,
}))

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, frage: 'Q1', antwort: 'A1' }],
    } as any),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test('zeigt vorhandene Karten', async () => {
  render(ManageView)
  expect(await screen.findByText('Q1')).toBeInTheDocument()
})
