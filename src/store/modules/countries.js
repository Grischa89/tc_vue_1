import axios from 'axios';

const state = {

  countryCodes: null,
};

const getters = {

  countryCodes: state => {
    return state.countryCodes;
  }
};

const actions = {

  fetchLatestCountryCodes({ commit }, data) {

    console.log('data', data.continent, data.country);
    

    // axios.get(`/api/v1/codes/asia/japan`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/`)
      .then(res => {
        commit('setLatestCountryCodes', res.data);
        console.log('After setLatestContinentCodes: ', res.data);
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured.');
        
      })
  },

  // fetchQuestion({ commit }, questionId) {

  //   axios.get('/api/questions/' + questionId)
  //     .then(res => {
  //       commit('setQuestion', res.data);
  //       commit('setAnswers', res.data.data.attributes.answers.data);
  //       console.log('setAnswerCount', res.data.data.attributes.answers.answer_count);
  //       commit('setAnswerCount', res.data.data.attributes.answers.answer_count);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       console.log('Unable to fetch question.');
  //     })
  // },

};

const mutations = {

  setLatestCountryCodes(state, countryCodes) {
    state.countryCodes = countryCodes;
  },

};

export default {
  state, getters, actions, mutations
}