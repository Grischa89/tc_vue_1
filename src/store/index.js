import { createStore } from 'vuex';
import location from './modules/location';
import codes from './modules/codes';
import continents from './modules/continents';
import countries from './modules/countries';
import nav from './modules/nav';
import copy from './modules/copy';
import addCodes from './modules/add-codes';

export default createStore({
  
  state: {
  },

  mutations: {
  },

  actions: {
  },

  modules: {
    location,
    codes,
    continents,
    countries,
    nav,
    copy,
    addCodes
  },

});
