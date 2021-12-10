import axios from 'axios';

const state = {

  continentCodes: null,
};

const getters = {

  continentCodes: state => {
    return state.continentCodes;
  }
};

const actions = {

  fetchLatestContinentCodes({ commit }, continent) {

    console.log('continent', continent);
    

    axios.get(`/api/v1/codes/${continent}/`)
      .then(res => {
        commit('setLatestContinentCodes', res.data);
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

  setLatestContinentCodes(state, continentCodes) {
    state.continentCodes = continentCodes;
  },

};

export default {
  state, getters, actions, mutations
}