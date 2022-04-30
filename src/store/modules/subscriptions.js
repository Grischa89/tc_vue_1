import axios from 'axios';

const state = {

  eventOptions: '',

  codeActionOptions: '',

  subscriptions: '',
};

const getters = {

  eventOptions: state => {
    return state.eventOptions;
  },

  codeActionOptions: state => {
    return state.codeActionOptions;
  },

  subscriptions: state => {
    return state.subscriptions;
  }

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

  fetchAllSubscriptions({ commit }, user) {

    const accessToken = JSON.parse(localStorage.getItem('tcAccess'));

    // const config = {
    //   headers: {
    //      'Authorization': "JWT " + accessToken,
    //      'Content-Type': 'application/json',
    //   }
    // };

    return axios.get('/api/v1/subscription/list_subscriptions/')
      .then(res => {
        console.log('res in list_subscr', res);
        commit('setSubscriptions', res.data);
      })
      .catch(err => {
        console.log('err in list_subscr', err);
      })
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

  setSubscriptions(state, subscriptions) {
    state.subscriptions = subscriptions;
  }

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