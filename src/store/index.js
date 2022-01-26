import { createStore } from 'vuex';
import codes from './modules/codes';
import continents from './modules/continents';
import countries from './modules/countries';
import nav from './modules/nav';

export default createStore({
  
  state: {
  },

  mutations: {
  },

  actions: {
  },

  modules: {
    codes,
    continents,
    countries,
    nav
  },

});
