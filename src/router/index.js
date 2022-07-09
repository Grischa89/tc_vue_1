import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const Home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue');
const Continent = () => import(/* webpackChunkName: "continent" */ '../views/Continent.vue');
const Country = () => import(/* webpackChunkName: "country" */ '../views/Country.vue');
const City = () => import(/* webpackChunkName: "city" */ '../views/City.vue');


const Profile = () => import(/* webpackChunkName: "profile" */ '../profile/Profile.vue');
const ProfileOverview = () => import(/* webpackChunkName: "profileOverview" */ '../profile/views/ProfileOverview.vue');
const ProfileCodes = () => import(/* webpackChunkName: "profileCodes" */ '../profile/views/ProfileCodes.vue');
const ProfileSubscriptions = () => import(/* webpackChunkName: "profileSubscriptions" */ '../profile/views/ProfileSubscriptions.vue');
const ProfileSettings = () => import(/* webpackChunkName: "profileSettings" */ '../profile/ProfileSettings.vue');


const LogIn = () => import(/* webpackChunkName: "login" */ '../auth/LogIn.vue');
const SignUp = () => import(/* webpackChunkName: "signup" */ '../auth/SignUp.vue');
const ResendActivationEmail = () => import(/* webpackChunkName: "resendActivationMail" */ '../auth/account/ResendActivationEmail.vue');
const RequestPasswordReset = () => import(/* webpackChunkName: "requestPasswordReset" */ '../auth/password/RequestPasswordReset.vue');
const ResetPassword = () => import(/* webpackChunkName: "resetPassword" */ '../auth/password/ResetPassword.vue');
const RequestSuccess = () => import(/* webpackChunkName: "requestSuccess" */ '../auth/_shared/RequestSuccess.vue');
const ActivateUser = () => import(/* webpackChunkName: "activateUser" */ '../auth/account/ActivateUser.vue');

const AddCode = () => import(/* webpackChunkName: "addCode" */ '../views/AddCode.vue');
const AddSubscription = () => import(/* webpackChunkName: "addSubscription" */ '../views/AddSubscription.vue');

const CreateArticle = () => import(/* webpackChunkName: "createArticle" */ '../views/articles/CreateArticle.vue');
const ListArticles = () => import(/* webpackChunkName: "listArticles" */ '../views/articles/ListArticles.vue');
const ShowArticle = () => import(/* webpackChunkName: "showArticle" */ '../views/articles/ShowArticle.vue');

const About = () => import(/* webpackChunkName: "about" */ '../views/articles/_static/About.vue');
const PrivacyPolicy = () => import(/* webpackChunkName: "privacy" */ '../views/articles/_static/PrivacyPolicy.vue');
const PageNotFound = () => import(/* webpackChunkName: "pageNotFound" */ '../views/PageNotFound.vue');

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

  // {
  //   path: '/codes',
  //   component: Home,
  //   children: [
  //     {
  //       path: ':continent',
  //       name: 'Continent',
  //       component: Continent,
  //       children: [
  //         {
  //           path: ':country',
  //           name: 'Country',
  //           component: Country,
  //           children: [
  //             {
  //               path: ':city',
  //               name: 'City',
  //               component: City
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // },

  {
    path: '/articles',
    name: 'ListArticles',
    component: ListArticles,
  },

  {
    path: '/articles/create',
    name: 'CreateArticle',
    component: CreateArticle,
  },

  {
    path: '/articles/:slug',
    name: 'ShowArticle',
    component: ShowArticle,
  },

  {
    path: '/codes',
    component: Home,
  },

  {
    path: '/codes/:continent',
    name: 'Continent',
    component: Continent
  },

  {
    path: '/codes/:continent/:country',
    name: 'Country',
    component: Country
  },

  {
    path: '/codes/:continent/:country/:city',
    name: 'City',
    component: City
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  },

  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  },

  {
    path: '/:notFound(.*)*',
    name: 'PageNotFound',
    component: PageNotFound,
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
