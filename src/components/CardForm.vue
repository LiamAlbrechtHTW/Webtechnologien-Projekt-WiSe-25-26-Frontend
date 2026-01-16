<template>
  <form @submit.prevent="submit" class="card-form">
    <label>Frage:</label>
    <textarea
      v-model="frage"
      placeholder="Frage eingeben..."
      rows="4"
      required
    ></textarea>

    <label>Antwort:</label>
    <textarea
      v-model="antwort"
      placeholder="Antwort eingeben..."
      rows="4"
      required
    ></textarea>

    <button type="submit">Erstellen</button>
  </form>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const frage = ref('')
const antwort = ref('')


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
.card-form {
  background: var(--surface-2);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;

  height: 425px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: space-between;


  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 8px 24px rgba(0, 0, 0, 0.25);

  transition: box-shadow 0.2s ease, transform 0.2s ease;
}



.card-form label {
  color: white;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.card-form textarea {
  width: 100%;
  box-sizing: border-box;

  padding: 0.75rem 1rem;
  margin: 0;
  resize: none;

  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-family: inherit;
  color: var(--text);
  background: #2f2f2f;

  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.25);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-form textarea:focus {
  outline: none;
  border-color: #c2e184;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(194, 225, 132, 0.6);
}

.card-form textarea::placeholder {
  color: #9ca3af;
}

.card-form button {
  align-self: flex-end;
  background: #c2e184;
  border: none;
  color: #1f2937;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;

  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.card-form button:hover {
  background: #a1c558;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
}
</style>

