<template>
  <div class="card">
    <h3>{{ card.frage }}</h3>
    <p>{{ card.antwort }}</p>
    <button @click="$emit('delete-card', card.id)">Löschen</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ card: { id: number; frage: string; antwort: string } }>()
defineEmits(['delete-card'])
</script>

<style scoped>
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
h3 {
  color: var(--color-primary);
  margin: 0 0 0.5rem;
}
p {
  flex-grow: 1;
}
button {
  align-self: flex-end;
  background: var(--color-card);
  color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border: 1px solid indianred;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: #d77c7c;
}
</style>
