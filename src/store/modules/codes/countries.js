import axios from 'axios';

const state = {

  countryLoadStatus: null,

};

const getters = {

  countryLoadStatus: state => {
    return state.countryLoadStatus;
  },

  // countryCodesTitle: state => {
  //   return state.countryCodes[0].country;
  // }

};

const actions = {

  fetchCountryCodes({ commit, rootState }, data) {

    console.log('data', data.continent, data.country);
    commit('setCountryStatus', 'loading');
    commit('setURLMessage', '');

    // axios.get(`/api/v1/codes/asia/japan/`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/`)
      .then(res => {
        console.log('res', res);
        // NOTE: If valid continent request res.data.new_cache_key: ''

        if (res.data.new_cache_key) {
          console.log('new_cache_key set in res fetchCountryCodes');

          if (res.data.new_cache_key === 'recent_codes') {
            // 'recent_codes', both slugs incorrect (/asfa/jpna/)
            const slugs = { 'invalidSlug': `/${continent}/`, 'validSlug': '/' };
            commit('setURLMessage', slugs);
            commit('setTableTitle', 'Recent Codes');
            window.document.title = 'Recent Codes From Around The World — trainercodes.net';
          } else {
            // continent-slug, only country incorrect (/asia/jpna/)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}`, 'validSlug': res.data.new_cache_key };
            commit('setURLMessage', slugs);
            commit('setTableTitle', res.data.data[0].continent);
            window.document.title = `${res.data.data[0].continent} — Recent Codes From ${res.data.data[0].continent} — trainercodes.net`;
          }
        } else {
          // correct url (/asia/japan/)
          window.document.title = `${res.data.data[0].country} — Recent Codes From ${res.data.data[0].country} — trainercodes.net`;
          commit('setTableTitle', res.data.data[0].country);
        }

        // TODO: if new_cache_key { if === 'recent_codes' document.title = recent_codes, else document.title = value} else document.title = requested value
        // TODO: Make global mutation that sets document title mit getter in beforeEach?

        return commit('addDataPositions', res.data.data);
      })
      .then(() => {
        console.log('rootState.myCodes', rootState.codes);
        commit('prettyCode', rootState.codes);
        commit('setCountryStatus', 'success');
      })
      .catch(err => {
        commit('setCountryStatus', 'error');
        console.log(err);
        console.log('An error occured.');
        
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

  setCountryStatus(state, status) {
    state.countryLoadStatus = status;
  }

  // setLatestCountryCodes(state, countryCodes) {
  //   state.countryCodes = countryCodes;
  // },

};

export default {
  state, getters, actions, mutations
}