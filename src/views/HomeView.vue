<template>
  <section class="home">
    <h1>Willkommen beim Karteikarten-Lernsystem</h1>
    <p>Hier kannst du Karteikarten erstellen, verwalten und lernen.</p>
    <nav class="nav">
      <RouterLink to="/create" exact-active-class="active">Erstellen</RouterLink>
      <RouterLink to="/manage" exact-active-class="active">Verwalten</RouterLink>
      <RouterLink to="/learn" exact-active-class="active">Lernen</RouterLink>
    </nav>
  </section>
</template>

<style scoped>
.home {
  background: var(--surface);
  border-radius: 12px;
  text-align: center;
  padding: 2rem 2rem 2rem;
  max-width: 1200px;
  margin: 8rem auto 2rem;
  box-shadow: 20px 20px 20px rgba(0,0,0,0.05);
}
.nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
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

.active {
  border-bottom: 2px solid var(--accent);
}
</style>
<script setup lang="ts">
</script>
