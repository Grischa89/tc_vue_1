import { createStore } from 'vuex';
import location from './modules/location';
import recent from './modules/codes/recent';
import continents from './modules/codes/continents';
import countries from './modules/codes/countries';
import cities from './modules/codes/cities';
import nav from './modules/nav';
import copy from './modules/copy';
import add from './modules/codes/add';
import auth from './modules/auth';
import password from './modules/validation/password';
import email from './modules/validation/email';
import username from './modules/validation/username';
import subscriptions from './modules/subscriptions';

export default createStore({
  
  state: {

    codes: null,

    invalidURLMessage: null,

    tableTitle: null,

    breadcrumb: null,

    modalCode: null,

  },

  getters: {

    codeGetter: state => {
      return state.codes;
    },

    invalidURLMessage: state => {
      return state.invalidURLMessage;
    },

    tableTitle: state => {
      return state.tableTitle;
    },

    breadcrumb: state => {
      return state.breadcrumb;
    },

    modalCode: state => {
      return state.modalCode;
    }

  },

  mutations: {

    addDataPositions(state, codes) {
      // Check if codes array needs to be altered
      if (codes.length % 2 === 0) {
        console.log('This array\'s length is an even number!');
        codes = codes.slice(0, -1);
      }
      let len = codes.length;
      // Set middle value value of array length
      let limit = (len - 1) / 2;
  
      // Set iterators
      let i = 0
      let j = limit;
  
      while (i < len) {
  
        // Assign positive positional values to elements until limit
        if (i <= limit){
          codes[i].dataPos = i;
          i++;
        } else {
          // Assign negative positional values
          // For array elements with index greater than limit
          codes[i].dataPos = -j;
          j--;
          i++;
        }
      }
  
      state.codes = codes;
    },

    prettyCode(state, codes) {
      for (let item of codes) {
        item.prettyCode = item.player_code.replace(/.{4}/g, '$& ').trim();
      }
  
      state.myCodes = codes;
    },

    setURLMessage(state, slugs) {
      // state.invalidSlug = slugs.invalidSlug;
      // state.validSlug = slugs.validSlug;
      // if (slugs === '') {
      //   state.invalidURLMessage
      // }
      slugs === '' ? state.invalidURLMessage = '' : state.invalidURLMessage = `No match was found for the entered URL: ${slugs.invalidSlug}. Instead displaying codes for ${slugs.validSlug}.`;
    },

    setTableTitle(state, title) {
      state.tableTitle = title;
    },

    setBreadcrumb(state, breadcrumb) {
      state.breadcrumb = breadcrumb;
    },

    setModalCode(state, code) {
      state.modalCode = code;
    }

  },

  actions: {
  },

  modules: {
    location,
    recent,
    continents,
    countries,
    cities,
    nav,
    copy,
    add,
    auth,
    password,
    email,
    username,
    subscriptions,
  },

});
