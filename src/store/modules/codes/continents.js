import axios from 'axios';

const state = {

  continentLoadStatus: null,
};

const getters = {

  continentLoadStatus: state => {
    return state.continentLoadStatus;
  },

};

const actions = {

  fetchContinentCodes({ commit, rootState }, continent) {

    commit('setContinentStatus', 'loading');
    commit('setURLMessage', '');

    axios.get(`/api/v1/codes/${continent}/`)
      .then(res => {
        // NOTE: If valid continent request res.data.new_cache_key: ''

        if (res.data.new_cache_key) {
          // 'recent_codes', incorrect continent slug (/asfa/)
          
          // TODO: Here not new_cache_key but recent codes or sth
          // NOTE: validSlug is here '/', Home
          const slugs = { 'invalidSlug': `/${continent}/`, 'validSlug': '/' };
          commit('setURLMessage', slugs);
          commit('setTableTitle', 'Recent Codes');
          window.document.title = 'Recent Codes From Around The World — trainercodes.net';
        } else {
          // correct url (/asia)
          window.document.title = `${res.data.data[0].continent} — Recent Codes From ${res.data.data[0].continent} — trainercodes.net`;
          commit('setTableTitle', res.data.data[0].continent);
        }

        commit('setBreadcrumb', '');

        return commit('setCodes', res.data.data);
      })
      .then(() => {
        commit('prettyCode', rootState.codes);
        commit('setContinentStatus', 'success');
      })
      .catch(err => {
        commit('setContinentStatus', 'error');
        console.log(err);
        console.log('An error occured in fetchContinentCodes.');
      })
  },

};

const mutations = {

  setContinentStatus(state, status) {
    state.continentLoadStatus = status;
  },

  prettyCode(state, codes) {
    for (let item of codes) {
      item.prettyCode = item.player_code.replace(/.{4}/g, '$& ').trim();
    }

    state.codes = codes;
  },

  // setLatestContinentCodes(state, continentCodes) {
  //   state.continentCodes = continentCodes;
  // },

};

export default {
  state, getters, actions, mutations
}