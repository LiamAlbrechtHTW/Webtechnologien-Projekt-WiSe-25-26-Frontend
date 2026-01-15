<template>
  <div class="card">
    <h3 ref="frageEl" class="frage">{{ card.frage }}</h3>
    <p ref="antwortEl" class="antwort">{{ card.antwort }}</p>

    <div class="actions">
      <button class="edit" @click="$emit('edit-card', card)">Bearbeiten</button>
      <button class="delete" @click="$emit('delete-card', card.id)">Löschen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ card: { id: number; frage: string; antwort: string } }>()
defineEmits(['delete-card', 'edit-card'])

const frageEl = ref<HTMLElement | null>(null)
const antwortEl = ref<HTMLElement | null>(null)

/**
 * Passt die Schriftgröße so an, dass der Text in die feste Box passt.
 * Funktioniert zuverlässig, weil wir eine feste Höhe für die Textzone vorgeben.
 */
function fitText(el: HTMLElement, minPx: number, maxPx: number) {
  // Startwert
  el.style.fontSize = `${maxPx}px`

  let size = maxPx
  const maxIterations = maxPx - minPx + 1

  for (let i = 0; i < maxIterations; i++) {
    const tooTall = el.scrollHeight > el.clientHeight
    const tooWide = el.scrollWidth > el.clientWidth

    if (!tooTall && !tooWide) break

    size -= 1
    el.style.fontSize = `${size}px`
    if (size <= minPx) break
  }
}

async function fitAll() {
  await nextTick()
  if (frageEl.value) fitText(frageEl.value, 14, 22)      // Frage
  if (antwortEl.value) fitText(antwortEl.value, 12, 16)  // Antwort
}

function onResize() {
  fitAll()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  fitAll()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})


watch(
  () => [props.card.frage, props.card.antwort],
  () => fitAll()
)
</script>

<style scoped>
.card {
  background: #2f2f2f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.2rem;

  display: flex;
  flex-direction: column;

  height: 200px;
  box-sizing: border-box;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}


.frage {
  margin: 0;
  color: #e5e7eb;

  height: 2.6em;
  overflow: hidden;

  line-height: 1.3;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.antwort {
  margin: 0;
  color: #cbd5e1;

  height: 3.9em;
  overflow: hidden;

  line-height: 1.3;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;

  margin-top: auto;
}


button {
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: 0.2s;
  color: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

button.edit {
  background: #3b82f6;
}

button.edit:hover {
  background: #2563eb;
}

button.delete {
  background: indianred;
}

button.delete:hover {
  background: #d77c7c;
}
</style>
