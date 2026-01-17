import { render, fireEvent, screen, cleanup } from '@testing-library/vue'
import { vi, test, expect, afterEach, beforeEach } from 'vitest'
import CreateView from '../../views/CreateView.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/session', () => ({
  getActiveSessionId: () => 1,
}))

beforeEach(() => {
  vi.stubGlobal('alert', vi.fn())
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, frage: 'Test', antwort: 'Antwort' }),
    } as any),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test('erstellt eine Karteikarte', async () => {
  render(CreateView)

  await fireEvent.update(screen.getByPlaceholderText(/Frage/i), 'Was ist Vue?')
  await fireEvent.update(screen.getByPlaceholderText(/Antwort/i), 'Framework')
  await fireEvent.click(screen.getByRole('button', { name: /Erstellen/i }))

  expect(fetch).toHaveBeenCalledTimes(1)

  expect(fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/sessions\/1\/cards$/),
    expect.objectContaining({
      method: 'POST',
      headers: expect.any(Object),
    }),
  )

  expect(alert).toHaveBeenCalled()
})
