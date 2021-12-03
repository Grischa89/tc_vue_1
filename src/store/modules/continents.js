import axios from 'axios';

const state = {
};

const getters = {

};

const actions = {

  // fetchLatestCodes({ commit }) {

  //   axios.get('/api/v1/codes/')
  //     .then(res => {
  //       commit('setLatestCodes', res.data);
  //       console.log('After setLatestCodes: ', res.data);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       console.log('An error occured.');
        
  //     })
  // },

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

  // setLatestCodes(state, codes) {
  //   state.codes = codes;
  // },

};

export default {
  state, getters, actions, mutations
}