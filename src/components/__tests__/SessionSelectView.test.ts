import { render, screen, fireEvent, cleanup } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SessionSelectView from '../../views/SessionSelectView.vue'

const pushMock = vi.fn()
const setActiveSessionIdMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/session', () => ({
  setActiveSessionId: (id: number) => setActiveSessionIdMock(id),
}))


vi.mock('@/api/sessions', () => ({
  fetchSessions: vi.fn().mockResolvedValue([{ id: 1, name: 'Mathe' }]),
  createSession: vi.fn().mockResolvedValue({ id: 2, name: 'Bio' }),
  deleteSession: vi.fn().mockResolvedValue(undefined),
}))


import { fetchSessions, createSession } from '../../api/sessions'

describe('SessionSelectView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('lädt Sessions und zeigt sie an', async () => {
    render(SessionSelectView)

    expect(fetchSessions).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Mathe')).toBeInTheDocument()
  })

  it('erstellt eine Session über das Formular', async () => {
    render(SessionSelectView)

    const input = screen.getByRole('textbox')
    await fireEvent.update(input, 'Bio')

    const btn = screen.getByRole('button', { name: 'Erstellen' })
    await fireEvent.click(btn)

    expect(createSession).toHaveBeenCalledWith('Bio')
  })

  it('setzt aktive Session und navigiert zu /home beim Klick auf Sessionname', async () => {
    render(SessionSelectView)

    const title = (await screen.findAllByText('Mathe'))[0]
    await fireEvent.click(title)

    expect(setActiveSessionIdMock).toHaveBeenCalledWith(1)
    expect(pushMock).toHaveBeenCalledWith('/home')
  })
})
