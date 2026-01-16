<template>
  <section class="create">
    <h1>Karteikarten erstellen</h1>
    <CardForm @add-card="addCard" />
  </section>
</template>

<script setup lang="ts">
import CardForm from '../components/CardForm.vue'
import { useRouter } from 'vue-router'
import { getActiveSessionId } from '../session'

interface Card {
  id: number
  frage: string
  antwort: string
}

const router = useRouter()

function requireSessionId(): number {
  const sessionId = getActiveSessionId()
  if (!sessionId) {
    router.push('/')
    throw new Error('No active session selected')
  }
  return sessionId
}

async function addCard(card: { frage: string; antwort: string }) {
  try {
    const sessionId = requireSessionId()
    const API_URL =
      import.meta.env.VITE_BACKEND_BASE_URL + `/api/sessions/${sessionId}/cards`

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const savedCard: Card = await res.json()
    console.log('Gespeichert in DB:', savedCard)
    alert('Karteikarte erfolgreich gespeichert!')
  } catch (err) {
    console.error('Fehler beim Speichern:', err)
    alert('Karteikarte konnte nicht gespeichert werden.')
  }
}
</script>

<style scoped>
.create {
  max-width: 2000px;
  width: 900px;
  height: 600px;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}

h1 {
  color: #f4cf0f;
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>
