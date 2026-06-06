import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AOS from 'aos'
import { initializeSettings } from '@/composables/useSettings'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'aos/dist/aos.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/styles/main.css'

initializeSettings()

const app = createApp(App)

app.use(router).mount('#app')

AOS.init({
  duration: 650,
  easing: 'ease-out-cubic',
  once: true,
  offset: 70,
})

router.afterEach(() => {
  window.setTimeout(() => AOS.refresh(), 150)
})
