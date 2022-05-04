import { createApp, defineAsyncComponent  } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './tailwind.css'

import VueCookieComply from 'vue-cookie-comply'
import 'vue-cookie-comply/dist/style.css'

const AsyncErrorFetchingData = defineAsyncComponent(() => import('./components/errors/ErrorFetchingData.vue'));
const AsyncInvalidSlug = defineAsyncComponent(() => import('./components/errors/InvalidSlug.vue'));

axios.defaults.baseURL = 'https://api.trainercodes.tk/'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/'
createApp(App).use(store).use(router, axios).use(VueCookieComply).component('AsyncErrorFetchingData', AsyncErrorFetchingData).component('AsyncInvalidSlug', AsyncInvalidSlug).mount('#app')