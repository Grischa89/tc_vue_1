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

// NOTE: If tc_user is not set yet in localStorage we set the truthy fallback {}
const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

// Since tc_user is of type Object either way because of || {} no TypeError
// (TypeError: Cannot read properties of null (reading 'access')) will be thrown 
// in ternary op because tc_user.access will return undefined instead
axios.defaults.headers.common['Authorization'] = tc_user.access ? `JWT ${tc_user.access}` : null;
axios.defaults.baseURL = 'https://api.trainercodes.tk/'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/'

createApp(App).use(store).use(router, axios).use(VueCookieComply).component('AsyncErrorFetchingData', AsyncErrorFetchingData).component('AsyncInvalidSlug', AsyncInvalidSlug).mount('#app')