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
// import ProfileTest from '../profile/ProfileTest.vue'
import ProfileOverview from '../profile/views/ProfileOverview.vue'
import ProfileCodes from '../profile/views/ProfileCodes.vue'
import ProfileSubscriptions from '../profile/views/ProfileSubscriptions.vue'
import ProfileSettings from '../profile/ProfileSettings.vue'
import LogIn from '../auth/LogIn.vue'
import SignUp from '../auth/SignUp.vue'
import ResendActivationEmail from '../auth/account/ResendActivationEmail.vue'
// import ResendSuccess from '../auth/ResendSuccess.vue'
import RequestPasswordReset from '../auth/password/RequestPasswordReset.vue'
import ResetPassword from '../auth/password/ResetPassword.vue'
import RequestSuccess from '../auth/_shared/RequestSuccess.vue'
import AddSubscription from '../views/AddSubscription.vue'

// Sorry, this page isn't available.
// The link you followed may be broken, or the page may have been removed. Go back to Instagram.

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
    },
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
    children: [
      {
        path: '',
        name: 'ProfileOverview',
        component: ProfileOverview,
        meta: { transition: 'fade' },
      },
      {
        path: 'codes',
        name: 'ProfileCodes',
        component: ProfileCodes,
        meta: {
          title: 'Your Trainer Codes',
          transition: 'fade'
        },
      },
      {
        path: 'subscriptions',
        name: 'ProfileSubscriptions',
        component: ProfileSubscriptions,
        meta: {
          title: 'Your Subscriptions',
          transition: 'fade' 
        },
      }]
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
];

const scrollBehavior = (to, from, savedPosition) => {
  // console.log('%cto / from', 'color: plum; font-weight: bold;', to, from);
  if (savedPosition) {
    // console.log('%cIFto.name', 'color: aqua; font-weight: bold;', to.name);
    return savedPosition;
  } else if (to.name === 'ProfileOverview' || to.name === 'ProfileCodes' || to.name === 'ProfileSubscriptions') {
    // console.log('%cELSE IF to.name', 'color: aqua; font-weight: bold;', to.name);
    // In order for site not to scroll to top if nav link was clicked
    return false;
  } else {
    // console.log('%cELSE to.name', 'color: aqua; font-weight: bold;', to.name);
    return { top: 0 };
  }
  
  // else {
  //   const position = {};
  //   if (to.hash) {
  //     // console.log('%cWE ARE IN TO.HASH', 'color: plum; font-weight: bold;');
  //     position.selector = to.hash;
  //     if (to.hash === '#profile__nav') {
  //       // console.log('%c& TO.HASH IS PROFILE__NAV', 'color: plum; font-weight: bold;');
  //       position.offset = { y: 250 };
  //     }
  //     if (document.querySelector(to.hash)) {
  //       // console.log('%c& EL WITH TO.HASH EXISTS', 'color: plum; font-weight: bold;');
  //       return position;
  //     }
  //     return false;
  //   }
  //   // console.log('%cWE DONT HAVE A TO.HASH', 'color: plum; font-weight: bold;');

  //   return { top: 0 };
  // }
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
})

router.beforeEach((to, from, next) => {
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const isAuthenticated = store.state.auth.isAuthenticated;

  console.log('Router isAuthenticated', isAuthenticated);

  // TODO: How to concatenate unicode with string: https://www.compart.com/en/unicode/U+2014
  window.document.title = to.meta && to.meta.title ? (to.meta.title += ` — trainercodes.net`) : 'trainercodes.net';

  if (to.redirectedFrom && to.redirectedFrom.name) {
    store.commit('setToRouteName', to.redirectedFrom.name);
  }

  if(requiresAuth && !isAuthenticated) {

    console.log('%cROUTER requiresAuth && !isAuthenticated ', 'color: plum; font-weight: bold;', requiresAuth, isAuthenticated);

    // NOTE: Changed from next() to router.push() due to "expected" error:
    // Navigating to /profile while being !isAuthenticated should redirect to /log-in --
    // Vue router threw an error because the resolving of the route /profile didn't go as expected, but was redirected
    // router.push({ name: 'LogIn' });
    // to.redirectedFrom object was not available when using router.push, switching back to next()
    // NOTE: to.redirectedFrom is crucial fo redirecting user to a route they intended to visit
    next({ name: 'LogIn' });

  } else if (requiresGuest && isAuthenticated) {
    console.log('%cROUTER requiresGuest && isAuthenticated ', 'color: plum; font-weight: bold;', requiresGuest, isAuthenticated);

    // NOTE: See notice above
    router.push({ name: 'ProfileOverview' });
  } 
  else {
    // console.log('router.beforeEach else', isAuthenticated, requiresAuth, requiresGuest);
    next();
  }
})
// why is this better ? https://router.vuejs.org/guide/advanced/meta.html

export default router
