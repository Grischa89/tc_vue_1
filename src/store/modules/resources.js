import axios from 'axios';

const state = {

  eventOptions: '',

  codeActionOptions: '',

  subscriptions: '',

  subscriptionLoadStatus: null,

  subscriptionToDelete: '',

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
        sub.prettyCode = sub.player_code.replace(/.{4}/g, '$& ').trim();
        sub.isActive = false;

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
            console.log('%cUnknown action!', 'color: red; font-weight: bold;', sub.action);
            sub.message = `We have a new action!`;
            break;
        }
      });

      return state.subscriptions.sort((a, b) => b.start_date_in_user_timezone.localeCompare(a.start_date_in_user_timezone));
    }
    // return state.subscriptions;
  },

  subscriptionLoadStatus: state => {
    return state.subscriptionLoadStatus;
  },

  subscriptionToDelete: state => {
    return state.subscriptionToDelete;
  },

  userCodes: state => {
    if (state.userCodes) {

      state.userCodes.forEach(code => {
        code.prettyCode = code.player_code.replace(/.{4}/g, '$& ').trim();
      });

      return state.userCodes.sort((a, b) => b.time_of_scrape.localeCompare(a.time_of_scrape));
    }
  },

  userCodeLoadStatus: state => {
    return state.userCodeLoadStatus;
  },

};

const actions = {

  fetchSubscriptionOptions({ commit }) {
    
    return axios.get('/api/v1/subscriptions/event_options/')
    .then(res => {
      commit('setEventOptions', res.data.events);
      commit('setCodeActionOptions', res.data.code_actions);
      return res.status;
    })
    .catch(err => {
      console.log('error fetchSubscriptionOptions', err);
      return err.response.status;
    });
  },

  fetchAllSubscriptions({ commit }, user) {

    commit('setSubscriptionStatus', 'loading');

    return axios.get('/api/v1/subscriptions/list_subscriptions/')
      .then(res => {
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
    
    return axios.post('/api/v1/subscriptions/add/', data)
    .then(res => {

      return res.status;
    })
    .catch(err => {
      console.log('error addSubscription', err);
      return err.response.status;
    });
  },

  updateSubscription({ commit }, data) {

    return axios.patch(`/api/v1/subscriptions/${data.pk}/`, data.data)
      .then(res => {
        commit('setUpdatedSubscriptions', { index: data.index, item: res.data });
        return res.status;
      })
      .catch(err => {
        console.log('err in editSubscription', err)
        return err.response.status;
      });
  },

  deleteSubscription({ commit }, data) {

    // TODO: Turn on before deployment
    return axios.delete(`/api/v1/subscriptions/${data.pk}/`)
      .then(res => {
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
    state.subscriptions.splice(data.index, 1, data.item);
  },

  setDeletedSubscriptions(state, index) {
    state.subscriptions.splice(index, 1);
  },

  setUserCodes(state, userCodes) {
    state.userCodes = userCodes;
  },

  setUserCodeStatus(state, status) {
    state.userCodeLoadStatus = status;
  },

  setSubscriptionToDelete(state, subscription) {
    state.subscriptionToDelete = subscription;
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