<template>
  <section class="list">
    <h2>Karteikarten</h2>
    <div v-if="cards.length === 0" class="empty">Noch keine Karten vorhanden.</div>
    <div v-else class="grid">
      <CardItem
          v-for="card in cards"
          :key="card.id"
          :card="card"
          @delete-card="$emit('delete-card', card.id)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import CardItem from './CardItem.vue'
defineProps<{ cards: Array<{ id: number; frage: string; antwort: string }> }>()
defineEmits(['delete-card'])
</script>

<style scoped>
.list {
  width: 900px;
}
h2 {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.empty {
  color: #64748b;
  font-style: italic;
}
</style>
