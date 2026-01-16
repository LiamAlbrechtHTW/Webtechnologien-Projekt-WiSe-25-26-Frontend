<template>
  <section class="home">
    <h1>Willkommen beim Karteikarten-Lernsystem</h1>
    <p>Hier kannst du Karteikarten erstellen, verwalten und lernen.</p>

    <nav class="nav">
      <router-link to="/create">Erstellen</router-link>
      <router-link to="/manage">Verwalten</router-link>
      <router-link to="/learn">Lernen</router-link>

      <a class="switch" href="#" @click.prevent="changeSession">Session wechseln</a>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { clearActiveSessionId } from '../session'

const router = useRouter()

function changeSession() {
  clearActiveSessionId()
  router.push('/')
}
</script>

<style scoped>
.home {
  background: var(--surface);
  border-radius: 12px;
  text-align: center;
  padding: 2rem 2rem 2rem;
  max-width: 900px;
  width: 100%;
  margin: 8rem auto 2rem;
  box-shadow: 20px 20px 20px rgba(0,0,0,0.05);
}

h1 {
  color: #f4cf0f;
  margin-bottom: 1.5rem;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.nav a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav a:hover {
  color: var(--accent-light);
}

.switch {
  opacity: 0.85;
}
</style>
