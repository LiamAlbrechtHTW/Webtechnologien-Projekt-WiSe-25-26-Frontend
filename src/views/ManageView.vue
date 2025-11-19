<template>
  <section class="manage">
    <h1>Karteikarten verwalten</h1>

    <div v-if="loading" class="status">Karten werden geladen...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <CardList
      v-else
      :cards="cards"
      @delete-card="deleteCard"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'

interface Karteikarte {
  id: number
  frage: string
  antwort: string
}


const API_URL = import.meta.env.VITE_BACKEND_BASE_URL + '/api/cards'

const cards = ref<Karteikarte[]>([])
const loading = ref(true)
const error = ref<string | null>(null)


async function loadCards() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    cards.value = await res.json()
  } catch (err: any) {
    console.error('Fehler beim Laden:', err)
    error.value = 'Karten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function deleteCard(id: number) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    cards.value = cards.value.filter(c => c.id !== id)
  } catch (err) {
    console.error('Fehler beim Löschen:', err)
    alert('Karte konnte nicht gelöscht werden.')
  }
}


onMounted(loadCards)
</script>

<style scoped>
.manage {
  max-width: 1000px;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.status {
  text-align: center;
  color: var(--muted);
  margin: 2rem 0;
}

.status.error {
  color: #ff6b6b;
}
</style>
