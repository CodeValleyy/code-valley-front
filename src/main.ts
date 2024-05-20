import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(createPinia())

app.mount('#app')
