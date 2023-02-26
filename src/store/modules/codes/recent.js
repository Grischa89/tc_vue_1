import axios from 'axios';

const state = {

  recentLoadStatus: null,

};

const getters = {

  recentLoadStatus: state => {
    return state.recentLoadStatus;
  },

};

const actions = {

  fetchRecentCodes({ state, commit, rootState }) {

    commit('setRecentStatus', 'loading');
    commit('setURLMessage', '');

    axios.get('/api/v1/codes/')
      .then(res => {
        window.document.title = 'Recent Codes From Around The World | trainercodes.net';
        commit('setBreadcrumb', '');
        return commit('addDataPositions', res.data.data);
      })
      .then(() => {
        commit('prettyCode', rootState.codes);
        commit('setRecentStatus', 'success');
      })
      .catch(err => {
        // TODO: Ist es hier überhaupt wichtig, Ob ein 404 ausgegeben wird oder wollen wir bei jedem error code dieselbe antwort haben?
        commit('setRecentStatus', 'error');
      });
  },

};

const mutations = {

  setRecentStatus(state, status) {
    state.recentLoadStatus = status;
  },

};

export default {
  state, getters, actions, mutations
}