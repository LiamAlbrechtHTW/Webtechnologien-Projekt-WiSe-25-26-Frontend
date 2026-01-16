<template>
  <section class="sessionSelect">
    <h1>Sessions</h1>

    <form class="new-session" @submit.prevent="onCreate">
      <input v-model.trim="name" placeholder="Session-Name (z. B. Mathe)" />
      <button :disabled="name.trim().length === 0">Erstellen</button>
    </form>

    <p v-if="loading" class="status">Sessions werden geladen...</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <div v-else>
      <p v-if="sessions.length === 0" class="empty">Noch keine Sessions vorhanden.</p>

      <div v-else class="grid">
        <div v-for="s in sessions" :key="s.id" class="session-card">
          <h3 class="session-title" @click="selectSession(s.id)">
            {{ s.name }}
          </h3>

          <button class="danger" @click="onDelete(s.id)">
            Session löschen
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSession, deleteSession, fetchSessions, type LernSession } from '../api/sessions'
import { setActiveSessionId } from '../session'

const router = useRouter()

const sessions = ref<LernSession[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const name = ref('')

async function load() {
  loading.value = true
  error.value = null
  try {
    sessions.value = await fetchSessions()
  } catch (e) {
    console.error(e)
    error.value = 'Sessions konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  try {
    await createSession(name.value.trim())
    name.value = ''
    await load()
  } catch (e) {
    console.error(e)
    alert('Session konnte nicht erstellt werden.')
  }
}

async function onDelete(id: number) {
  if (!confirm('Session wirklich löschen?')) return
  try {
    await deleteSession(id)
    await load()
  } catch (e) {
    console.error(e)
    alert('Session konnte nicht gelöscht werden.')
  }
}

function selectSession(id: number) {
  setActiveSessionId(id)
  router.push('/home')
}

onMounted(load)
</script>

<style scoped>
.sessionSelect {
  max-width: 900px;
  width: 100%;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #f4cf0f;
}

.new-session {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.new-session input {
  width: 520px;
  max-width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--surface-2);
  color: var(--text);
  box-sizing: border-box;
}

.status { text-align: center; color: var(--muted); }
.status.error { color: #ff6b6b; }
.empty { text-align: center; color: var(--muted); }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.session-card {
  background: var(--surface-2);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
}

.session-title {
  margin: 0 0 0.8rem;
  color: var(--text);
  cursor: pointer;
  display: inline-block;
  font-size: 1.1rem;

  transition: transform 0.15s ease, color 0.15s ease;
}

.session-title:hover {
  color: var(--accent-light);
  transform: translateY(-2px);
}


button {
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  color: white;
  width: 100%;
}

button:disabled { opacity: 0.6; cursor: not-allowed; }

.new-session button {
  background: #c2e184;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.new-session button:hover {
  background: #a1c558;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
  transform: translateY(-1px);
}

.new-session button:disabled {
  background: #bcd194;
  box-shadow: none;
  transform: none;
}

.danger {
  align-self: flex-end;
  background: #cd5c5c;
  border: none;
  color: var(--text);
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;

  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: background 0.2s ease, box-shadow 0.2s ease;

}

.danger:hover {
  background: #a94444;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
}
</style>
