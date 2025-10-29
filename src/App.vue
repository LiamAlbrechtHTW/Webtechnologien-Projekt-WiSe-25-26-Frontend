<template>
  <div id="app">
    <HeaderBar />
    <RouterView />
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>
