import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(createPinia())

app.mount('#app')
