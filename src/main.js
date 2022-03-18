import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './tailwind.css'

import VueCookieComply from 'vue-cookie-comply'
import 'vue-cookie-comply/dist/style.css'

axios.defaults.baseURL = 'https://api.trainercodes.tk/'

createApp(App).use(store).use(router, axios).use(VueCookieComply).mount('#app')