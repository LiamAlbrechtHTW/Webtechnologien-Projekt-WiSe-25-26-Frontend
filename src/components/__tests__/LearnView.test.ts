import { render, fireEvent, screen, cleanup } from '@testing-library/vue'
import { vi, test, expect, beforeEach, afterEach } from 'vitest'
import LearnView from '../../views/LearnView.vue'

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
      json: async () => [{ id: 1, frage: 'Frage?', antwort: 'Antwort!' }],
    } as any),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test('flippt Karte bei Klick', async () => {
  render(LearnView)


  const frage = await screen.findByText('Frage?')
  await fireEvent.click(frage)

  expect(await screen.findByText('Antwort!')).toBeInTheDocument()
})
