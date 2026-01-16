<template>
  <section class="manage">
    <h1>Karteikarten verwalten</h1>

    <div v-if="editingCard" class="edit-box">
      <h2>Karteikarte bearbeiten</h2>

      <input v-model.trim="editFrage" placeholder="Frage" />

      <textarea
        v-model.trim="editAntwort"
        placeholder="Antwort"
        rows="4"
      ></textarea>

      <p v-if="!isValidEdit" class="hint">
        Bitte Frage und Antwort ausfüllen.
      </p>

      <div class="edit-actions">
        <button class="save" :disabled="!isValidEdit" @click="saveEdit">
          Speichern
        </button>
        <button class="cancel" @click="cancelEdit">
          Abbrechen
        </button>
      </div>
    </div>

    <CardList
      v-else
      :cards="cards"
      @delete-card="handleDeleteCard"
      @edit-card="startEdit"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getActiveSessionId } from '../session'
import CardList from '../components/CardList.vue'

interface Karteikarte {
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

function cardsApiUrl(): string {
  const sessionId = requireSessionId()
  return import.meta.env.VITE_BACKEND_BASE_URL + `/api/sessions/${sessionId}/cards`
}

const cards = ref<Karteikarte[]>([])
const editingCard = ref<Karteikarte | null>(null)

const editFrage = ref('')
const editAntwort = ref('')

async function loadCards() {
  try {
    const API_URL = cardsApiUrl()
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Karteikarte[] = await res.json()
    cards.value = data
  } catch (e) {
    console.error('Fehler beim Laden:', e)
    alert('Karten konnten nicht geladen werden.')
  }
}

async function handleDeleteCard(id: number) {
  try {
    const API_URL = cardsApiUrl()
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    cards.value = cards.value.filter(c => c.id !== id)
  } catch (e) {
    console.error('Fehler beim Löschen:', e)
    alert('Karte konnte nicht gelöscht werden.')
  }
}

function startEdit(card: Karteikarte) {
  editingCard.value = card
  editFrage.value = card.frage
  editAntwort.value = card.antwort
}

function cancelEdit() {
  editingCard.value = null
  editFrage.value = ''
  editAntwort.value = ''
}

const isValidEdit = computed(() => {
  return editFrage.value.trim().length > 0 && editAntwort.value.trim().length > 0
})

async function saveEdit() {
  if (!editingCard.value) return
  if (!isValidEdit.value) return

  const id = editingCard.value.id

  try {
    const API_URL = cardsApiUrl()
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frage: editFrage.value.trim(),
        antwort: editAntwort.value.trim(),
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const updated: Karteikarte = await res.json()

    const index = cards.value.findIndex(c => c.id === id)
    if (index !== -1) cards.value[index] = updated

    cancelEdit()
  } catch (e) {
    console.error('Fehler beim Speichern:', e)
    alert('Änderungen konnten nicht gespeichert werden.')
  }
}

onMounted(loadCards)
</script>

<style scoped>
.manage {
  width: 900px;
  max-width: 100%;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

h1 {
  color: #f4cf0f;
  margin-bottom: 1.5rem;
  text-align: center;
}

.edit-box {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.edit-box input,
.edit-box textarea {
  width: 100%;
  margin-bottom: 0.8rem;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.hint {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

button {
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: 0.3s;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

button.save {
  background: #c2e184;
}

button.save:hover {
  background: #e5f3cc;
}

button.save:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

button.cancel {
  background: #9ca3af;
}

button.cancel:hover {
  background: #caced4;
}
</style>
