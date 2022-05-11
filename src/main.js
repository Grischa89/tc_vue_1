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

// TODO: tc_user probably not needed
// NOTE: If tc_user is not set yet in localStorage we set the truthy fallback {}
// const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Let response pass

  console.log('%cRequest worked: ', 'color: green; font-weight: bold;', response.config);
  if (response.data.access){
    console.log('%cWith this access our request worked: ', 'color: green; font-weight: bold;', response.data.access);
  }

  return response;
}, async function (error) {
  console.log('%cRequest error', 'color: red; font-weight: bold;', error.config);
  const originalRequest = error.config;

  // Handle error returned from refreshing JWT
  if (error.config.url === '/api/v1/accounts/auth/jwt/refresh/' && !originalRequest._retry) {
    // originalRequest.url should not be repeated (no loop)
    originalRequest._retry = true;
    
    console.log('%cInvalid refresh token! ', 'color: maroon; font-weight: bold;', error.response.status, error.config.url);

    // Refresh JWT failed
    // Treat user as unknown and log them out
    store.dispatch('logout')
    .then((logout) => {
      console.log('logout', logout);
      console.log('%crouter', 'color: fuchsia; font-weight: bold;', router, router.currentRoute._value.meta.requiresAuth, router.currentRoute.value.meta.requiresAuth);

      // Get meta info of current route
      const routeRequiresAuth = router.currentRoute.value.meta.requiresAuth;
      if (routeRequiresAuth) {
        // If current route requires a logged in user
        console.log('%cIF requiresAuth ', 'color: aqua; font-weight: bold;', routeRequiresAuth);

        // Let user nter credentials again
        router.push({ name: 'LogIn' });
        return Promise.reject(error); 
      } else {
        console.log('%cELSE requiresAuth ', 'color: aqua; font-weight: bold;', routeRequiresAuth);

        // Let route resolve normally since no authentication required
        return true;
      }
      
    });  
  }

  // Error returned from login() - should be handled as intended (e.g. let user know that no account with the entered credentials was found)
  if (error.config.url === '/api/v1/accounts/auth/jwt/create/') {
    return Promise.reject(error);
  }

  // Handle error returned from a GET method
  if (error.config.method === 'get' && !originalRequest._retry) {
    console.log('%cWe have a GET method: ', 'color: orange; font-weight: bold;', error.config.method);

    // Handle GET + 401 (e.g. getUserProfile)
    if (error.response.status === 401) {
      console.log('%cAnd a 401: ', 'color: orange; font-weight: bold;', error.response.status);
      // originalRequest.url should not be repeated (no loop)
      originalRequest._retry = true;

      // Try to refresh access token
      return store.dispatch('refreshJWT')
      .then((access) => {
        // New access token being returned
        console.log('%cWe got a new token for a GET method: ', 'color: orange; font-weight: bold;', access);

        console.log('%cThis is the GET request we want to repeat', 'color: orange; font-weight: bold;', originalRequest);
        // NOTE: Now for the original request the new access token needs to be set
        originalRequest.headers['Authorization'] = `JWT ${access}`;
        console.log('%cWe are trying the GET request again with this header: ', 'color: orange; font-weight: bold;', originalRequest.headers['Authorization']);

        // Repeat the original request
        return new Promise((resolve, reject) => {
          axios.request(originalRequest)
            .then(response => {
              // The original request passed with its new token
              console.log('%cGET Request with new token worked, url: ', 'color: orange; font-weight: bold;', error.config.url);

              resolve(response);
            })
            .catch((error) => {
              // The original request with new token got rejected
              console.log('%cGET Request with new token DID NOT work, url: ', 'color: red; font-weight: bold;', error.config.url);

              reject(error);
            });
        });

      })
      .catch((error) => {
        // Error with refreshing the access token
        console.log('%cUnsuccessful refresh JWT, refreshSuccess: ', 'color: red; font-weight: bold;', error);

        Promise.reject(error);
      });
    } else {
      // Handle all errors of requests with method GET which are not a 401
      console.log('%cWe are rejecting the GET error, status: ', 'color: orange; font-weight: bold;', error.response.status);

      // Reject error as intended, let display be handled by vue (e.g. 404 when trying to retrieve codes should display async error component for user)
      return new Promise((resolve, reject) => {
      reject(error);
    });
    }
    
  } // Handle errors of non-GET methods
  else if (error.config.method !== 'get' && !originalRequest._retry) {
    console.log('%cWe have another method: ', 'color: orange; font-weight: bold;', error.config.method);
    // originalRequest.url should not be repeated (no loop)
    originalRequest._retry = true;

    // Try to refresh access token
    return store.dispatch('refreshJWT')
    .then((access) => {
      // New access token being returned
      console.log('%cWe got a new token: ', 'color: slateblue; font-weight: bold;', access);
      
      // const originalRequest = error.config;
      console.log('%cThis is the request we want to repeat', 'color: slateblue; font-weight: bold;', originalRequest);

      // NOTE: Now for the original request the new access token needs to be set
      originalRequest.headers['Authorization'] = `JWT ${access}`;
      console.log('%cWe are trying the request again with this header: ', 'color: slateblue; font-weight: bold;', originalRequest.headers['Authorization']);

      // Repeat the original request
      return new Promise((resolve, reject) => {
        axios.request(originalRequest)
          .then(response => {
            // The original request passed with its new token
            console.log('%cRequest with new token worked, url: ', 'color: slateblue; font-weight: bold;', error.config.url);
            resolve(response);
          })
          .catch((error) => {
            // The original request with new token got rejected
            console.log('%cRequest with new token DID NOT work, url: ', 'color: red; font-weight: bold;', error.config.url);
            reject(error);
          });
      });

    })
    .catch((error) => {
      // Error with refreshing the access token
      console.log('%cUnsuccessful refresh JWT, refreshSuccess: ', 'color: red; font-weight: bold;', error);
      // sessionStorage.removeItem('isAuthenticated');

      Promise.reject(error);
    });
  }
  
});

axios.defaults.baseURL = 'https://api.trainercodes.tk/'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/'

createApp(App).use(store).use(router, axios).use(VueCookieComply).component('AsyncErrorFetchingData', AsyncErrorFetchingData).component('AsyncInvalidSlug', AsyncInvalidSlug).mount('#app')