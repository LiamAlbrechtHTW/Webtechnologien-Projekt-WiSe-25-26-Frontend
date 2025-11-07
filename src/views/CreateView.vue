<template>
  <section class="create">
    <h1>Karteikarten erstellen</h1>
    <CardForm @add-card="addCard" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardForm from '../components/CardForm.vue'

interface Card {
  id: number
  frage: string
  antwort: string
}

const cards = ref<Card[]>([])

function addCard(card: { frage: string; antwort: string }) {
  cards.value.push({ id: Date.now(), ...card })
  alert('Karte hinzugefügt!')
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
