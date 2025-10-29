<template>
  <header class="header">
    <div class="left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>Karteikarten-Lernsystem</h1>
    </div>
    <nav class="nav">
      <RouterLink to="/" exact-active-class="active">Home</RouterLink>
      <RouterLink to="/create" exact-active-class="active">Erstellen</RouterLink>
      <RouterLink to="/manage" exact-active-class="active">Verwalten</RouterLink>
      <RouterLink to="/learn" exact-active-class="active">Lernen</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;              /* über gesamte Bildschirmbreite */
  height: 80px;
  background: var(--header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-sizing: border-box;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 112px;
  height: 112px;
  object-fit: contain;
}

.nav {
  display: flex;
  gap: 2rem;
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
