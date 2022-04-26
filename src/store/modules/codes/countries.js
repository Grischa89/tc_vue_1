import axios from 'axios';

const state = {

  countryLoadStatus: null,

  suggestionCodes: null,

};

const getters = {

  countryLoadStatus: state => {
    return state.countryLoadStatus;
  },

  // countryCodesTitle: state => {
  //   return state.countryCodes[0].country;
  // }

  citySuggestions: state => {
    // return rootState.codes.filter(item => item.city !== null);

    // filter wil start with the first item in the array, then findIndex will iterate over that item
    // Once findIndex is at the end of its array, filter will increase the array index and findIndex will iterate over that item again
    // So it might be that a['city'] === item['city'] is true, but the index which findIndex will return will not match the filter method's criteria of === i
    // That way object with duplicate entries will have a different index (a['city'].index) from i
    // So only the first occurrence of item['city'] === a['city'] will meet the filter method's criteria since the index that is returned from findIndex === i
    if (state.suggestionCodes) return state.suggestionCodes.filter((item, i) => state.suggestionCodes.findIndex(a => (a['city'] === item['city']) && (a['city'] !== null)) === i);
  }

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
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}/`, 'validSlug': '/' };
            commit('setURLMessage', slugs);
            commit('setTableTitle', 'Recent Codes');
            commit('setBreadcrumb', '');
            window.document.title = 'Recent Codes From Around The World — trainercodes.net';
          } else {
            // continent-slug, only country incorrect (/asia/jpna/)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}`, 'validSlug': res.data.new_cache_key };
            commit('setURLMessage', slugs);
            commit('setTableTitle', res.data.data[0].continent);
            commit('setBreadcrumb', '');
            window.document.title = `${res.data.data[0].continent} — Recent Codes From ${res.data.data[0].continent} — trainercodes.net`;
          }
        } else {
          // completely correct url (/asia/japan/) or only correct country-slug (/asfa/japan/)
          window.document.title = `${res.data.data[0].country} — Recent Codes From ${res.data.data[0].country} — trainercodes.net`;
          commit('setTableTitle', res.data.data[0].country);
          commit('setBreadcrumb', { continentName: res.data.data[0].continent, continentSlug: res.data.data[0].continent_slug });
        }

        commit('setSuggestionCodes', res.data.data);

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
  },

  setSuggestionCodes(state, codes) {
    state.suggestionCodes = codes;
  },

  // setLatestCountryCodes(state, countryCodes) {
  //   state.countryCodes = countryCodes;
  // },

};

export default {
  state, getters, actions, mutations
}