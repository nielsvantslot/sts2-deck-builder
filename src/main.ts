import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { vReveal } from './directives/vReveal'
import './styles/global.css'

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
