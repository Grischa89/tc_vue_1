import { createRouter, createWebHistory } from 'vue-router'
// import store from 'store/modules/auth.js'
import store from '../store'
// import auth from '../store/modules/auth'

import Home from '../views/Home.vue'
import Continent from '../views/Continent.vue'
import Country from '../views/Country.vue'
import City from '../views/City.vue'
import AddCode from '../views/AddCode.vue'
import CardCarousel from '../views/CardCarousel.vue'
import ActivateUser from '../auth/account/ActivateUser.vue'
import Profile from '../profile/Profile.vue'
import ProfileSettings from '../profile/ProfileSettings.vue'
import LogIn from '../auth/LogIn.vue'
import SignUp from '../auth/SignUp.vue'
import ResendActivationEmail from '../auth/account/ResendActivationEmail.vue'
// import ResendSuccess from '../auth/ResendSuccess.vue'
import RequestPasswordReset from '../auth/password/RequestPasswordReset.vue'
import ResetPassword from '../auth/password/ResetPassword.vue'
import RequestSuccess from '../auth/_shared/RequestSuccess.vue'
import AddSubscription from '../views/AddSubscription.vue'
import SubscriptionsAll from '../views/subscriptions/SubscriptionsAll.vue'

// Sorry, this page isn't available.
// The link you followed may be broken, or the page may have been removed. Go back to Instagram.

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
    }
  },

  {
    path: '/codes/add',
    name: 'AddCode',
    component: AddCode,
    meta: {
      requiresAuth: true, //, TODO: REMOVE before push
      title: 'Add Your Own Code',
    },
  },

  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: {
      requiresGuest: true,
      title: 'Sign Up',
    },
  },

  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn,
    meta: {
      requiresGuest: true,
      title: 'Log In',
    },
  },

  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: 'Your Profile',
    },
  },

  {
    path: '/profile/settings',
    name: 'ProfileSettings',
    component: ProfileSettings,
    meta: {
      requiresAuth: true,
      title: 'View and Change Your Profile Settings',
    },
  },

  {
    path: '/resend-activation',
    name: 'ResendActivationEmail',
    component: ResendActivationEmail, // TODO: Braucht es hier meta? requiresGuest: true,
    meta: {
      title: 'Resend Activation Email',
    },
  },

  // {
  //   path: '/resend-success',
  //   name: 'ResendSuccess',
  //   component: ResendSuccess,
  //   meta: {
  //     requiresGuest: true,
  //     title: 'Resend Successfull',
  //   },
  // },

  {
    path: '/request-password-reset',
    name: 'RequestPasswordReset',
    component: RequestPasswordReset,
    meta: {
      requiresGuest: true,
      title: 'Request Password Reset',
    },
  },

  {
    path: '/request-success',
    name: 'RequestSuccess',
    component: RequestSuccess,
    meta: {
      requiresGuest: true,
      title: 'Request Successful',
    },
  },

  {
    path: '/password/reset/confirm/:uid/:token', // TODO: What's url here? see below activate GREG
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      requiresGuest: true,
      title: 'Reset Password',
    },
  },

  {
    path: '/activate/:uid/:token',
    name: 'ActivateUser',
    component: ActivateUser,
    meta: {
      title: 'Activate User Account',
    },
  },

  {
    path: '/subscriptions/add',
    name: 'AddSubscription',
    component: AddSubscription,
    meta: {
      requiresAuth: true,
      title: 'Add A Subscription',
    },
  },

  {
    path: '/subscriptions/all',
    name: 'SubscriptionsAll',
    component: SubscriptionsAll,
    meta: {
      requiresAuth: true,
      title: 'All Your Subscriptions',
    },
  },

  {
    path: '/carousel',
    name: 'CardCarousel',
    component: CardCarousel
  },

  {
    path: '/:continent',
    name: 'Continent',
    component: Continent
  },

  {
    path: '/:continent/:country',
    name: 'Country',
    component: Country
  },

  {
    path: '/:continent/:country/:city',
    name: 'City',
    component: City
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const isAuthenticated = store.state.auth.isAuthenticated;

  console.log('Router isAuthenticated', isAuthenticated);

  // TODO: How to concatenate unicode with string: https://www.compart.com/en/unicode/U+2014
  window.document.title = to.meta && to.meta.title ? (to.meta.title += ` — trainercodes.net`) : 'trainercodes.net';

  if(requiresAuth && !isAuthenticated) {

    console.log('%cROUTER requiresAuth && !isAuthenticated ', 'color: plum; font-weight: bold;', requiresAuth, isAuthenticated);

    // NOTE: Changed from next() to router.push() due to "expected" error:
    // Navigating to /profile while being !isAuthenticated should redirect to /log-in --
    // Vue router threw an error because the resolving of the route /profile didn't go as expected
    // but was redirected
    router.push({ name: 'LogIn' });
    // TODO: weiterleitung zu vorheriger seite const toPath = this.$route.query.to || '/cart'

  } else if (requiresGuest && isAuthenticated) {
    console.log('%cROUTER requiresGuest && isAuthenticated ', 'color: plum; font-weight: bold;', requiresGuest, isAuthenticated);

    // NOTE: See notice above
    router.push({ name: 'Profile' });
  } 
  else {
    // console.log('router.beforeEach else', isAuthenticated, requiresAuth, requiresGuest);
    next();
  }
})
// why is this better ? https://router.vuejs.org/guide/advanced/meta.html

export default router
