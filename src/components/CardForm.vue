<template>
  <form @submit.prevent="submit" class="form">
    <h2>Neue Karteikarte</h2>
    <label>Frage:</label>
    <textarea v-model="frage" type="text" required placeholder="Frage eingeben..."></textarea>

    <label>Antwort:</label>
    <textarea v-model="antwort" required placeholder="Antwort eingeben..."></textarea>

    <button type="submit">Hinzufügen</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const frage = ref('')
const antwort = ref('')

// ✅ Typsichere Definition des Events + Payload
const emit = defineEmits<{
  (e: 'add-card', card: { frage: string; antwort: string }): void
}>()

function submit() {
  emit('add-card', { frage: frage.value, antwort: antwort.value })
  frage.value = ''
  antwort.value = ''
}
</script>


<style scoped>
.form {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  width: 600px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
h2 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}
input, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-family: inherit;
  resize: none;
  box-sizing: border-box;
}
button {
  align-self: flex-end;
  background: var(--color-primary);
  color: white;
  border: 1px solid yellowgreen;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 0.3rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: #c2e184;
}
</style>
