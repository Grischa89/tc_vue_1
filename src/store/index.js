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
import resources from './modules/resources';
import articles from './modules/articles';

export default createStore({
  
  state: {

    codes: [],

    invalidURLMessage: null,

    tableTitle: null,

    breadcrumb: null,

    modalCode: null,

    modalOpen: false,

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
    },

    modalOpen: state => {
      return state.modalOpen;
    },

  },

  mutations: {

    setCodes(state, codes) {  
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
    },

    toggleModal(state, visibility) {
      state.modalOpen = visibility;
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
    resources,
    articles,
  },

});
