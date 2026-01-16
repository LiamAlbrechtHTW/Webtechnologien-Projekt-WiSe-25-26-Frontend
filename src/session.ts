const KEY = 'activeSessionId'

export function getActiveSessionId(): number | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export function setActiveSessionId(id: number) {
  localStorage.setItem(KEY, String(id))
}

export function clearActiveSessionId() {
  localStorage.removeItem(KEY)
}
