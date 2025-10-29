<template>
  <section class="manage">
    <h1>Karteikarten verwalten</h1>
    <CardList :cards="cards" @delete-card="deleteCard" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardList from '../components/CardList.vue'

const cards = ref([
  { id: 1, frage: 'Was ist Vue.js?', antwort: 'Ein JavaScript-Framework für Benutzeroberflächen.' },
  { id: 2, frage: 'Was macht v-for?', antwort: 'Rendert Listen dynamisch aus Arrays.' },
])

function deleteCard(id: number) {
  cards.value = cards.value.filter(c => c.id !== id)
}
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
</style>
