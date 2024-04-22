import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app';

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: "AIzaSyAJ85l4Nyb5lY6WHCPMwKYOM_btY4rrQJE",
  authDomain: "code-valley-41667.firebaseapp.com",
  projectId: "code-valley-41667",
  storageBucket: "code-valley-41667.appspot.com",
  messagingSenderId: "731322420619",
  appId: "1:731322420619:web:162398b843f15661adf38e"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
