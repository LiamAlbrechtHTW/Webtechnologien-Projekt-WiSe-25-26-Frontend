<template>
  <section class="learn">
    <h1>Lernmodus</h1>

    <div v-if="loading" class="status">Karten werden geladen...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else>
      <div v-if="pot.length === 0" class="done">
        <h2>Fertig!</h2>
        <p>Du hast alle Karten richtig beantwortet.</p>
        <button @click="restart">Neu starten</button>
      </div>

      <div v-else class="card">
        <div class="learning-progress">
          <div class="lp-top">
            <span class="lp-label">Lernfortschritt</span>
            <span class="lp-value">{{ progressPercent }}%</span>
          </div>

          <div
            class="lp-bar"
            role="progressbar"
            :aria-valuenow="progressPercent"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="lp-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <div class="lp-sub">
            <span>{{ finishedCount }} / {{ total }} richtig</span>
          </div>
        </div>

        <p class="side-indicator">
          {{ showAnswer ? 'Antwort' : 'Frage' }}
        </p>

        <div class="card-body" ref="cardBodyEl" @click="flip">
          <div class="face" :class="{ hidden: showAnswer }">
            <h2 class="text" ref="frageEl">{{ current?.frage }}</h2>
          </div>

          <div class="face" :class="{ hidden: !showAnswer }">
            <h2 class="text" ref="antwortEl">{{ current?.antwort }}</h2>
          </div>

          <p class="hint">Klicken zum Umblättern</p>
        </div>

        <div class="actions">
          <button class="wrong" :disabled="!showAnswer" @click="markWrong">
            Falsch
          </button>
          <button class="right" :disabled="!showAnswer" @click="markRight">
            Richtig
          </button>
        </div>

        <p class="note" :class="{ hiddenNote: showAnswer }">
          Hinweis: Bitte zuerst umblättern, dann markieren.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getActiveSessionId } from '../session'

interface Karteikarte {
  id: number
  frage: string
  antwort: string
}

const router = useRouter()

function requireSessionId(): number {
  const sessionId = getActiveSessionId()
  if (!sessionId) {
    router.push('/')
    throw new Error('No active session selected')
  }
  return sessionId
}

function cardsApiUrl(): string {
  const sessionId = requireSessionId()
  return import.meta.env.VITE_BACKEND_BASE_URL + `/api/sessions/${sessionId}/cards`
}

const loading = ref(true)
const error = ref<string | null>(null)

const pot = ref<Karteikarte[]>([])
const done = ref<Karteikarte[]>([])
const showAnswer = ref(false)

const total = computed(() => pot.value.length + done.value.length)
const current = computed(() => pot.value[0])

const finishedCount = computed(() => done.value.length)
const progressPercent = computed(() => {
  if (total.value === 0) return 0
  return Math.round((finishedCount.value / total.value) * 100)
})

const cardBodyEl = ref<HTMLElement | null>(null)
const frageEl = ref<HTMLElement | null>(null)
const antwortEl = ref<HTMLElement | null>(null)

function fitTextToBox(
  el: HTMLElement,
  box: HTMLElement,
  opts?: { minPx?: number; maxPx?: number; safetyBottomPx?: number }
) {
  const minPx = opts?.minPx ?? 14
  const maxPxStart = opts?.maxPx ?? 32
  const safetyBottomPx = opts?.safetyBottomPx ?? 40

  el.style.fontSize = `${maxPxStart}px`

  let size = maxPxStart
  const maxIterations = maxPxStart - minPx + 1

  for (let i = 0; i < maxIterations; i++) {
    const tooTall = el.scrollHeight > box.clientHeight - safetyBottomPx
    const tooWide = el.scrollWidth > box.clientWidth
    if (!tooTall && !tooWide) break
    size -= 1
    el.style.fontSize = `${size}px`
    if (size <= minPx) break
  }
}

async function fitCurrentSide() {
  await nextTick()
  if (!cardBodyEl.value) return

  const box = cardBodyEl.value
  const activeEl = showAnswer.value ? antwortEl.value : frageEl.value
  if (!activeEl) return

  fitTextToBox(activeEl, box, { minPx: 11, maxPx: 26, safetyBottomPx: 36 })
}

async function loadCards() {
  loading.value = true
  error.value = null
  try {
    const API_URL = cardsApiUrl()
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Karteikarte[] = await res.json()

    pot.value = [...data]
    done.value = []
    showAnswer.value = false

    await fitCurrentSide()
  } catch (e) {
    console.error(e)
    error.value = 'Karten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function flip() {
  if (pot.value.length === 0) return
  showAnswer.value = !showAnswer.value
  fitCurrentSide()
}

function markRight() {
  if (pot.value.length === 0) return
  if (!showAnswer.value) return

  const card = pot.value.shift()!
  done.value.push(card)
  showAnswer.value = false
  fitCurrentSide()
}

function markWrong() {
  if (pot.value.length === 0) return
  if (!showAnswer.value) return

  const card = pot.value.shift()!
  pot.value.push(card)
  showAnswer.value = false
  fitCurrentSide()
}

function restart() {
  const all = [...done.value]
  done.value = []
  pot.value = shuffle(all)
  showAnswer.value = false
  fitCurrentSide()
}

function shuffle(arr: Karteikarte[]): Karteikarte[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

watch([showAnswer, () => current.value?.id], () => {
  fitCurrentSide()
})

function onResize() {
  fitCurrentSide()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  loadCards()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.learn {
  max-width: 2000px;
  width: 900px;
  height: 600px;
  margin: 8rem auto 3rem;
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #f4cf0f;
}

.status {
  text-align: center;
  color: var(--muted);
  margin: 2rem 0;
}

.status.error {
  color: #ff6b6b;
}

.card {
  background: var(--surface-2);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  height: 425px;
}

.learning-progress {
  margin: 0 0 0.9rem;
}

.lp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.35rem;
}

.lp-label {
  color: var(--muted);
  font-size: 0.85rem;
  letter-spacing: 0.03em;
}

.lp-value {
  color: #f4cf0f;
  font-weight: 700;
  font-size: 0.9rem;
}

.lp-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
}

.lp-fill {
  height: 100%;
  border-radius: 999px;
  background: #22c55e;
  transition: width 0.25s ease;
}

.lp-sub {
  margin-top: 0.35rem;
  display: flex;
  justify-content: flex-end;
  color: var(--muted);
  font-size: 0.85rem;
}

.side-indicator {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent-light);
  text-align: center;
}

.card-body {
  width: 100%;
  max-width: 700px;
  height: 250px;
  margin: 0 auto;

  position: relative;
  overflow: hidden;

  padding: 1.6rem;
  box-sizing: border-box;

  background: #2f2f2f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;

  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.card-body:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.45);
}

.face {
  position: absolute;
  inset: 0;
  padding: 1.6rem;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: opacity 0.15s ease;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}

.text {
  margin: 0;
  color: #e5e7eb;

  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;

  line-height: 1.05;
  letter-spacing: -0.01em;
}

.hint {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  margin: 0;
  color: var(--accent-light);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1.2rem;
}

button {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.right {
  background: #22c55e;
}

button.wrong {
  background: #ef4444;
}

.note {
  margin-top: 0.8rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.hiddenNote {
  visibility: hidden;
}

.done {
  text-align: center;
  padding: 2rem;
}

.done button {
  margin-top: 1rem;
  background: #3b82f6;
}
</style>
