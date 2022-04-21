import axios from 'axios';

const state = {

  eventOptions: '',

  codeActionOptions: '',
};

const getters = {

  eventOptions: state => {
    return state.eventOptions;
  },

  codeActionOptions: state => {
    return state.codeActionOptions;
  },

};

const actions = {

  fetchSubscriptionOptions({ commit }) {
    
    return axios.get('/api/v1/subscription/event_options/')
    .then(res => {
      console.log('fetchSubscriptionOptions', res);

      commit('setEventOptions', res.data.events);
      commit('setCodeActionOptions', res.data.code_actions);
      return res.status;
    })
    .catch(err => {
      console.log('error', err);
      return err.response.status;
    });
  },

  addSubscription({ commit }, data) {
    
    return axios.post('/api/v1/subscription/add/', data)
    .then(res => {
      console.log('addSubscription', res);

      // commit('setEventOptions', res.data.events);
      // commit('setCodeActionOptions', res.data.code_actions);
      return res.status;
    })
    .catch(err => {
      console.log('error', err);
      return err.response.status;
    });
  },
};

const mutations = {

  setEventOptions(state, eventOptions) {
    state.eventOptions = eventOptions;
  },

  setCodeActionOptions(state, codeActionOptions) {
    state.codeActionOptions = codeActionOptions;
  },

  // setTimeZone(state, clientTimeZone) {
  //   // res.data.time_zone will look sth like 'Europe/Berlin'
  //   if (clientTimeZone.includes('Europe')) {
  //     state.isEurope = true;
  //   } else {
  //     state.isEurope = false;
  //   }
  //   console.log('setTimeZone, state.isEurope ', state.isEurope);
  //   console.log('setTimeZone, state.isEurope ', typeof state.isEurope);
  // }

};

export default {
  state, getters, actions, mutations
}