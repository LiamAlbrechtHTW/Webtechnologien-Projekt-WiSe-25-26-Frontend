<template>
  <section class="list">
    <div v-if="cards.length === 0" class="empty">Noch keine Karten vorhanden.</div>

    <div v-else class="grid">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
        @delete-card="(id) => emit('delete-card', id)"
        @edit-card="(card) => emit('edit-card', card)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import CardItem from './CardItem.vue'

type Karteikarte = { id: number; frage: string; antwort: string }

defineProps<{ cards: Karteikarte[] }>()

const emit = defineEmits<{
  (e: 'delete-card', id: number): void
  (e: 'edit-card', card: Karteikarte): void
}>()
</script>

<style scoped>
.list {
  width: 900px;
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
