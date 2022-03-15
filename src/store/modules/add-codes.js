import axios from 'axios';

const state = {

  countries: null,

  cities: null,

};

const getters = {

  countries: state => {
    return state.countries;
  },

  cities: state => {
    return state.cities;
  }

};

const actions = {

  getCountries({ commit }) {
    axios.get('/api/v1/codes/all-countries/')
      .then(res => {
        commit('setCountries', res.data);
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured in getCountries.');
      });
  },

  getCities({ commit }, selectedCountry) {
    return axios.get('/api/v1/codes/ajax/load-cities/?country=' + selectedCountry)
      .then(res => {
        commit('setCities', res.data.cities);
        return res.data;
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured in getCities.');
      });
  },

  addCode({ commit }, data) {
    axios.post('/api/v1/codes/add/', data)
      .then(res => {
        console.log('addCode res', res);
        console.log('addCode res.data', res.data);
      })
      .catch(err => {
        console.log(err.message);
        console.log('An error occured in addCode.');
      });
  }

  // createQuestion({commit, state}) {
    
  //   commit('setQuestionsStatus', 'loading');

  //   axios.post('/api/questions', { title: state.questionTitle, description: state.questionDescription } )
  //     .then(res => {
  //       console.log(res.data);
  //       commit('pushQuestion', res.data);
  //       commit('createTitle', '');
  //       commit('createDescription', '');
  //     })
  //     .catch(err => {
  //       console.log(err, 'Unable to create question.')
  //     });

  // },

};

const mutations = {

  setCountries(state, countries) {
    state.countries = countries;
  },

  setCities(state, cities) {
    state.cities = cities;
  }

};

export default {
  state, getters, actions, mutations
}