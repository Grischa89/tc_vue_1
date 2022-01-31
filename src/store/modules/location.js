import axios from 'axios';

const state = {

  clientLocation: '',

  clientInEurope: false,
};

const getters = {

  clientLocation: state => {
    return state.clientLocation;
  },

  clientTimeZone: state => {
    return state.clientLocation.time_zone;
  },

  clientInEurope: state => {
    return state.clientInEurope;
  }

};

const actions = {

  fetchClientLocation({ commit }) {
    
    axios.get(`https://api.freegeoip.app/json/?apikey=${process.env.VUE_APP_GEO_API_KEY}`)
    .then(res => {
      console.log('res.data', res.data);
      // let location = res.data;
      // return location;
      commit('setClientLocation', res.data);
      commit('setTimeZone', res.data.time_zone);
    })
    .catch(err => {
      console.log('err', err);
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

  setClientLocation(state, clientLocation) {
    state.clientLocation = clientLocation;
  },

  setTimeZone(state, clientTimeZone) {
    // res.data.time_zone will look sth like 'Europe/Berlin'
    if (clientTimeZone.includes('Europe')) {
      state.clientInEurope = true;
      console.log('setTimeZone, state.clientInEurope ', state.clientInEurope);
      console.log('setTimeZone, state.clientInEurope ', typeof state.clientInEurope);
    }
  }

};

export default {
  state, getters, actions, mutations
}