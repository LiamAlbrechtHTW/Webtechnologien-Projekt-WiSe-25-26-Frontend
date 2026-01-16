import { getActiveSessionId } from '../session'

const BASE = import.meta.env.VITE_BACKEND_BASE_URL

function requireSessionId(): number {
  const id = getActiveSessionId()
  if (!id) throw new Error('No active session selected')
  return id
}

export interface Karteikarte {
  id: number
  frage: string
  antwort: string
}

export async function fetchCards(): Promise<Karteikarte[]> {
  const sessionId = requireSessionId()
  const res = await fetch(`${BASE}/api/sessions/${sessionId}/cards`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createCard(card: { frage: string; antwort: string }): Promise<Karteikarte> {
  const sessionId = requireSessionId()
  const res = await fetch(`${BASE}/api/sessions/${sessionId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteCard(id: number): Promise<void> {
  const sessionId = requireSessionId()
  const res = await fetch(`${BASE}/api/sessions/${sessionId}/cards/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function updateCard(
  id: number,
  payload: { frage: string; antwort: string }
): Promise<Karteikarte> {
  const sessionId = requireSessionId()
  const res = await fetch(`${BASE}/api/sessions/${sessionId}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
