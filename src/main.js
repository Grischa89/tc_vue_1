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
    
    console.log('%cInvalid refresh token! ', 'color: red; font-weight: bold;', error.response.status, error.config.baseURL);

    // Refresh JWT failed
    // Treat user as unknown and log them out
    await store.dispatch('logout');

    console.log('%crouter', 'color: plum; font-weight: bold;', router);

    // Get meta info of current route
    const routeRequiresAuth = router.currentRoute.value.meta.requiresAuth;
    if (routeRequiresAuth) {
      // If current route requires a logged in user
      // Let user enter credentials again
      router.push({ name: 'LogIn' });

      return Promise.reject(error);
    }

    // If routeRequiresAuth is undefined, refresh the current route for request can be send without JWT and refresh was expired
    // IMPORTANT: The error needs to be returned also (or anything for that matter) - otherwise 'Unsuccessful refresh JWT, refreshSuccess:' (below) will will try to return undefined res.data + might retry originalRequest with undefined as JWT, ~ just NASTY ~, simply reject error here!!!
    // NOTE: I wanted to avoid router.go(), but apparently at this point the routing has already happened (still with false and not needed JWT in header) and the only solution I see at this point is reloading the page so the data can be requested anew without a JWT
    router.go();
    return Promise.reject(error);
  }

  // Error returned from login() / createUser() / requestPasswortReset() / resetPasswordConfirm() / resendActivationEmail() / activate() - should be handled as intended (e.g. let user know that no account with the entered credentials was found)
  if (error.config.url === '/api/v1/accounts/auth/jwt/create/' || error.config.url === '/api/v1/accounts/auth/users/' || error.config.url ===  '/api/v1/accounts/auth/users/reset_password/' || error.config.url === '/api/v1/accounts/auth/users/reset_password_confirm/' || error.config.url === '/api/v1/accounts/auth/users/resend_activation/' || error.config.url === '/api/v1/accounts/auth/users/activation/') {
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
        console.log('%cWe got a new token for a GET method: ', 'color: orange; font-weight: bold;', access, typeof access);

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

        return Promise.reject(error);
      });
    } else {
      // Handle all errors of requests with method GET which are not a 401
      console.log('%cWe are rejecting the GET error, status: ', 'color: orange; font-weight: bold;', error.response.status);

      // Reject error as intended, let display be handled by vue (e.g. 404 when trying to retrieve codes should display async error component for user)
      return Promise.reject(error);
    }
    
  } // Handle errors of non-GET methods
  else if (error.config.method !== 'get' && !originalRequest._retry) {
    console.log('%cWe have another method: ', 'color: orange; font-weight: bold;', error.config.method, error.config.url);
    // originalRequest.url should not be repeated (no loop)
    originalRequest._retry = true;

    if (error.config.url === '/api/v1/codes/' && error.response.status === 404) {
      return Promise.reject(error);
    }

    // Return e.g. 'image required' error (POST)
    if (error.config.url === '/api/v1/articles/draggable/add/' && error.response.status === 400) {
      return Promise.reject(error);
    }

    // Return e.g. 'image required' or 'file size too large' (PUT)
    if (error.config.url.includes('/api/v1/articles/draggable') && error.response.status === 400) {
      return Promise.reject(error);
    }

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

      return Promise.reject(error);
    });
  }
  
});

axios.defaults.baseURL = 'https://api.abramov.app/'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/'

createApp(App).use(store).use(router, axios).use(VueCookieComply).component('AsyncErrorFetchingData', AsyncErrorFetchingData).component('AsyncInvalidSlug', AsyncInvalidSlug).mount('#app')