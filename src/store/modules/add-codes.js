import axios from 'axios';

const state = {

  countries: null,

};

const getters = {

  countries: state => {
    return state.countries;
  },

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
    console.log('selectedCountry', selectedCountry);
    return axios.get('/api/v1/codes/ajax/load-cities/?country=' + selectedCountry)
      .then(res => {
        // console.log('getCities', res.data);
        return res.data;
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured in getCities.');
      });
  },

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

};

export default {
  state, getters, actions, mutations
}