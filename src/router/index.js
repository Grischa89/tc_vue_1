import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Continent from '../views/Continent.vue'
import Country from '../views/Country.vue'
import Carousel2 from '../views/Carousel2.vue'
import CardCarousel from '../views/CardCarousel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/card-carousel',
    name: 'CardCarousel',
    component: CardCarousel
  },

  {
    path: '/carousel2',
    name: 'Carousel2',
    component: Carousel2
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
  routes
})

export default router
