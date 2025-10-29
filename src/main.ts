// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'      // Router importieren
import './assets/main.css'

createApp(App).use(router).mount('#app')  // Router registrieren und App mounten
