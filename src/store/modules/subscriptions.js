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
    if (state.subscriptions) return state.subscriptions.sort((a, b) => b.created_at.localeCompare(a.created_at));
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
        // console.dir(res.data[4]);
        // console.dir(res.data[4].action);
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

  updateSubscription({ commit }, data) {

    return axios.patch(`/api/v1/subscription/${data.pk}/`, data.data)
      .then(res => {
        console.log('res in editSubscription', res);
        commit('setUpdatedSubscriptions', { index: data.index, item: res.data });
        return res.status;
      })
      .catch(err => {
        console.log('err in editSubscription', err)
        return err.response.status;
      })
  },

  deleteSubscription({ commit }, data) {

    return axios.delete(`/api/v1/subscription/${data.pk}/`)
      .then(res => {
        console.log('res in deleteSubscription', res);
        commit('setDeletedSubscriptions', data.index);
        return res.status;
      })
      .catch(err => {
        console.log('err in deleteSubscription', err);
        return err.response.status;
      })
  }
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
  },

  setUpdatedSubscriptions(state, data) {
    // TODO: data.index undefined auffangen mit Array.findIndex
    console.log('data in setEditedSubscriptions', data);
    state.subscriptions.splice(data.index, 1, data.item);
  },

  setDeletedSubscriptions(state, index) {
    // TODO: index undefined auffangen mit Array.findIndex
    state.subscriptions.splice(index, 1);
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