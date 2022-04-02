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

    console.log('continent', continent);
    commit('setContinentStatus', 'loading');

    axios.get(`/api/v1/codes/${continent}/`)
      .then(res => {
        console.log(res);
        // TODO: What if new_cache_key is empty? ''
        if (res.data.new_cache_key) {
          console.log('new_cache_key set in res fetchContinentCodes');
          // TODO: Here not new_cache_key but recent codes or sth
          const slugs = { 'invalidSlug': `/${continent}`, 'validSlug': res.data.new_cache_key };
          commit('setURLMessage', slugs);
        }

        window.document.title = res.data.new_cache_key ? 'Recent Codes From Around The World | trainercodes.net' : `${res.data.data[0].continent} | Recent Codes From ${res.data.data[0].continent} | trainercodes.net`;

        return commit('addDataPositions', res.data.data);
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