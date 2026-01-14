<template>
  <section class="create">
    <h1>Karteikarten erstellen</h1>
    <CardForm @add-card="addCard" />
  </section>
</template>

<script setup lang="ts">
import CardForm from '../components/CardForm.vue'

interface Card {
  id: number
  frage: string
  antwort: string
}

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL + '/api/cards'

async function addCard(card: { frage: string; antwort: string }) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

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
  max-width: 1000px;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  text-align: center;
}

h1 {
  color: var(--text);
  margin-bottom: 1.5rem;
}
</style>
