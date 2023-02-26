import axios from 'axios';

const state = {

  countries: null,

  cities: null,

  codeToRepost: null,

};

const getters = {

  countries: state => {
    return state.countries;
  },

  cities: state => {
    return state.cities;
  },

  codeToRepost: state => {
    return state.codeToRepost;
  }

};

const actions = {

  getCountries({ commit }) {
    return axios.get('/api/v1/codes/all-countries-cached/')
      .then(res => {
        commit('setCountries', res.data);
        return res.status;
      })
      .catch(err => {
        return err.response.status;
      });
  },

  getCities({ commit }, selectedCountry) {
    return axios.get('/api/v1/codes/ajax/load-cities/?country=' + selectedCountry)
      .then(res => {
        commit('setCities', res.data.cities);
        return res.status;
      })
      .catch(err => {
        return err.response.status;
      });
  },

  addCode({ commit }, data) {
    return axios.post('/api/v1/codes/add/', data)
      .then(res => {
        return res.status;
      })
      .catch(err => {
        console.log(err.message);
        console.log('An error occured in addCode.');
        return err.response.status;
      });
  }

};

const mutations = {

  setCountries(state, countries) {
    state.countries = countries;
  },

  setCities(state, cities) {
    state.cities = cities;
  },

  setCodeToRepost(state, code) {
    state.codeToRepost = code;
  }

};

export default {
  state, getters, actions, mutations
}