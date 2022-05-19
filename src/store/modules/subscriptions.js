import axios from 'axios';

const state = {

  eventOptions: '',

  codeActionOptions: '',

  subscriptions: '',

  subscriptionLoadStatus: null,

  userCodes: '',

  userCodeLoadStatus: null,
};

const getters = {

  eventOptions: state => {
    return state.eventOptions;
  },

  codeActionOptions: state => {
    return state.codeActionOptions;
  },

  subscriptions: state => {
    // TODO: Time until event starts in usertime as new prop
    // const now = new Date().getTime();

    // Sort subscriptions in descending order created_at
    if (state.subscriptions) {
      state.subscriptions.forEach(sub => {
        // const eventUserTimeMs = new Date(sub.)
        sub.prettyCode = sub.player_code.replace(/.{4}/g, '$& ');

        switch (sub.action) {
          case 'POST_YOUR_CODE_ON_TWITTER':
            sub.message = `Post ${sub.prettyCode} on Twitter for ${sub.event_name}`;
            break;
          case 'POST_YOUR_CODE_ON_REDDIT':
            sub.message = `Post ${sub.prettyCode} on Reddit for ${sub.event_name}`;
            break;
          case 'GET_CODES_TO_YOUR_EMAIL':
            sub.message = `Get codes send to your email`;
            break;
          default:
            console.log('%cdefault', 'color: red; font-weight: bold;', sub.action);
            sub.message = `We have a new action!`;
            break;
        }
      });

    console.log('%creturned subs', 'color: darkseagreen; font-weight: bold;', state.subscriptions);
    return state.subscriptions.sort((a, b) => a.start_date_in_user_timezone.localeCompare(b.start_date_in_user_timezone));
  }
    // return state.subscriptions.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  subscriptionLoadStatus: state => {
    return state.subscriptionLoadStatus;
  },

  userCodes: state => {
    if (state.userCodes) {

      state.userCodes.forEach(code => {
        code.prettyCode = code.player_code.replace(/.{4}/g, '$& ');
      });

      return state.userCodes.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    // return state.userCodes;
  },

  userCodeLoadStatus: state => {
    return state.userCodeLoadStatus;
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

    commit('setSubscriptionStatus', 'loading');

    return axios.get('/api/v1/subscription/list_subscriptions/')
      .then(res => {
        console.log('%cres subs', 'color: darkseagreen; font-weight: bold;', res.data);
        commit('setSubscriptions', res.data);
        commit('setSubscriptionStatus', 'success');

        return res.status;
      })
      .catch(err => {
        commit('setSubscriptionStatus', 'error');

        if (err.response) return err.response.status;
      });
  },

  addSubscription({ commit }, data) {
    
    return axios.post('/api/v1/subscription/add/', data)
    .then(res => {
      console.log('addSubscription', res);

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
      });
  },

  deleteSubscription({ commit }, data) {

    // console.log('deleteSubscription dispatched! ', 'pk: ', data.pk, 'index: ', data.index);

    // TODO: Turn on before deployment
    return axios.delete(`/api/v1/subscription/${data.pk}/`)
      .then(res => {
        console.log('res in deleteSubscription', res);
        commit('setDeletedSubscriptions', data.index);
        return res.status;
      })
      .catch(err => {
        console.log('err in deleteSubscription', err);
        return err.response.status;
      });
  },

  fetchUserCodes({ commit }) {

    commit('setUserCodeStatus', 'loading');

    return axios.get('/api/v1/codes/users/list_my_codes/')
      .then(res => {
        commit('setUserCodes', res.data);
        commit('setUserCodeStatus', 'success');
        console.log('%cuser codes', 'color: orange; font-weight: bold;', res);
      })
      .catch(err => {
        commit('setUserCodeStatus', 'error');
        console.log('%cuser codes err', 'color: red; font-weight: bold;', err);      
      })
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
  },

  setSubscriptionStatus(state, status) {
    state.subscriptionLoadStatus = status;
  },

  setUpdatedSubscriptions(state, data) {
    // TODO: data.index undefined auffangen mit Array.findIndex
    console.log('data in setEditedSubscriptions', data);
    state.subscriptions.splice(data.index, 1, data.item);
  },

  setDeletedSubscriptions(state, index) {
    // TODO: index undefined auffangen mit Array.findIndex
    state.subscriptions.splice(index, 1);
  },

  setUserCodes(state, userCodes) {
    state.userCodes = userCodes;
  },

  setUserCodeStatus(state, status) {
    state.userCodeLoadStatus = status;
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