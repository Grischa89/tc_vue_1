import { createStore } from 'vuex';
import location from './modules/location';
import recentCodes from './modules/codes';
import continents from './modules/continents';
import countries from './modules/countries';
import nav from './modules/nav';
import copy from './modules/copy';
import addCodes from './modules/add-codes';
import auth from './modules/auth';

export default createStore({
  
  state: {

    codes: null,

    invalidSlug: null,

    validSlug: null,

  },

  getters: {

    codeGetter: state => {
      return state.codes;
    },

    invalidURLMessage: state => {
      return `No match was found for the URL you entered (${state.invalidSlug}). Displaying codes for ${state.validSlug} instead.`
    },

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
      state.invalidSlug = slugs.invalidSlug;
      state.validSlug = slugs.validSlug;
    },

  },

  actions: {
  },

  modules: {
    location,
    recentCodes,
    continents,
    countries,
    nav,
    copy,
    addCodes,
    auth
  },

});
