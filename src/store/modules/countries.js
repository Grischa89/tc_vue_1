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

    // axios.get(`/api/v1/codes/asia/japan/`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/`)
      .then(res => {
        console.log('res', res);
        if (res.data.new_cache_key) {
          console.log('new_cache_key set in res fetchCountryCodes');
          const slugs = { 'invalidSlug': `/${data.continent}/${data.country}`, 'validSlug': res.data.new_cache_key };
          commit('setURLMessage', slugs);
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