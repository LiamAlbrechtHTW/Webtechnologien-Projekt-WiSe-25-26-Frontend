
ManageView: <template>
  <section class="manage">
    <h1>Karteikarten verwalten</h1>
    <CardList :cards="cards" @delete-card="deleteCard" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'
const API_URL = 'https://webtechnologien-projekt-wise-25-26.onrender.com/apis/cards'

interface Card {
  id: number
  frage: string
  antwort: string
}
const cards = ref<Card[]>([])
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(HTTP ${res.status})
    cards.value = await res.json()
  } catch (err: any) {
    console.error('Fehler beim Laden:', err)
    error.value = 'Karten konnten nicht geladen werden.'
  }
})

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
