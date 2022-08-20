import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import auth from '../middleware/auth';
import staff from '../middleware/staff';
import guest from '../middleware/guest';
import test from '../middleware/test';

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
const ListArticlesUpdate = () => import(/* webpackChunkName: "listArticlesUpdate" */ '../views/articles/ListArticlesUpdate.vue');
const UpdateArticle = () => import(/* webpackChunkName: "updateArticle" */ '../views/articles/UpdateArticle.vue');

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
      middleware: auth, //, TODO: REMOVE before push
      title: 'Add Your Own Code',
    },
  },

  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: {
      middleware: guest,
      title: 'Sign Up',
    },
  },

  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn,
    meta: {
      middleware: guest,
      title: 'Log In',
    },
  },

  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      middleware: auth,
      title: 'Your Profile',
    },
    children: [
      {
        path: '',
        name: 'ProfileOverview',
        component: ProfileOverview,
        meta: { 
          transition: 'fade' 
        },
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
      middleware: auth,
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
      middleware: guest,
      title: 'Request Password Reset',
    },
  },

  {
    path: '/request-success',
    name: 'RequestSuccess',
    component: RequestSuccess,
    meta: {
      middleware: guest,
      title: 'Request Successful',
    },
  },

  {
    path: '/password/reset/confirm/:uid/:token', // TODO: What's url here? see below activate GREG
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      middleware: guest,
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
      middleware: auth,
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
    meta: {
      middleware: staff,
    },
  },

  {
    path: '/articles/:slug',
    name: 'ShowArticle',
    component: ShowArticle,
  },

  {
    path: '/articles/update',
    name: 'ListArticlesUpdate',
    component: ListArticlesUpdate,
    meta: {
      middleware: staff,
    },
  },

  {
    path: '/articles/update/:slug',
    name: 'UpdateArticle',
    component: UpdateArticle,
    meta: {
      middleware: staff,
    },
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
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
});

/* 
  Middleware logic adjusted based on this blog article
  https://markus.oberlehner.net/blog/implementing-a-simple-middleware-with-vue-router/

  Assuming an array of middleware like so: [log, auth]
*/

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  // If one route has more than one middleware to pass
  const subsequentMiddleware = middleware[index]; // middleware[1] === auth (since middleware[0] === log)
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  // Indefinite number of arguments as array (rest parameter syntax)
  // Collects individual arguments that you pass into a function and returns an array
  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    // next has been overwritten in line (A) and is now another nextFactory() call
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  // TODO: How to concatenate unicode with string: https://www.compart.com/en/unicode/U+2014
  window.document.title = to.meta && to.meta.title ? (to.meta.title += ` — trainercodes.net`) : 'trainercodes.net';

  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
        from,
        next,
        router,
        to,
      };

    // Using function expression (no hoisting, defined in line)
    const nextMiddleware = nextFactory(context, middleware, 1);

    // Run first middleware function of middleware array with arguments
    // Replacing next function with nextFactory(context, middleware, 1)
    return middleware[0]({ ...context, next: nextMiddleware }); // (A)
  }

  return next();
  
});
// why is this better ? https://router.vuejs.org/guide/advanced/meta.html

export default router
