import axios from 'axios';

const state = {

  cityLoadStatus: null,

};

const getters = {

  cityLoadStatus: state => {
    return state.cityLoadStatus;
  },

  // countryCodesTitle: state => {
  //   return state.countryCodes[0].country;
  // }

};

const actions = {

  fetchCityCodes({ commit, rootState }, data) {

    console.log('data', data.continent, data.country, data.city);
    commit('setCityStatus', 'loading');
    commit('setURLMessage', '');

    // axios.get(`/api/v1/codes/europe/spain/madrid-madrid/`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/${data.city}/`)
      .then(res => {
        console.log('res', res, res.data.new_cache_key);
        // NOTE: If valid continent request res.data.new_cache_key: ''

        if (res.data.new_cache_key) {
          console.log('new_cache_key set in res fetchCityCodes');

          if (res.data.new_cache_key === 'recent_codes') {
            // 'recent_codes', both slugs incorrect (/eruop/span/madrid-madr)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}/${data.city}/`, 'validSlug': '/' };
            commit('setURLMessage', slugs);
            commit('setTableTitle', 'Recent Codes');
            window.document.title = 'Recent Codes From Around The World — trainercodes.net';
          } else {
            // correct continent and/or country, only city incorrect (/europe/spain/madr/ || /euro/spain/madr)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}/${data.city}/`, 'validSlug': res.data.new_cache_key };
            commit('setURLMessage', slugs);

            // Check if new_cache_key contains more than 2 / (is country: /europe/spain/madr || /euro/spain/)
            if ((res.data.new_cache_key.match(/\//g) || []).length > 2) {
              commit('setTableTitle', res.data.data[0].country);
              window.document.title = `${res.data.data[0].country} — Recent Codes From ${res.data.data[0].country} — trainercodes.net`;
            } else {
              // (is continent: /europe/span/madr)
              commit('setTableTitle', res.data.data[0].continent);
              window.document.title = `${res.data.data[0].continent} — Recent Codes From ${res.data.data[0].continent} — trainercodes.net`;
            } 
          }
        } else {
          // correct url (/europe/spain/madrid-madrid) or only correct city slug
          window.document.title = `${res.data.data[0].city} — Recent Codes From ${res.data.data[0].city} — trainercodes.net`;
         commit('setTableTitle', res.data.data[0].city);
        }
        
        // // TODO: Make global mutation that sets document title mit getter in beforeEach?

        return commit('addDataPositions', res.data.data);
      })
      .then(() => {
        console.log('rootState.myCodes', rootState.codes);
        commit('prettyCode', rootState.codes);
        commit('setCityStatus', 'success');
      })
      .catch(err => {
        commit('setCityStatus', 'error');
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

  setCityStatus(state, status) {
    state.cityLoadStatus = status;
  }

  // setLatestCountryCodes(state, countryCodes) {
  //   state.countryCodes = countryCodes;
  // },

};

export default {
  state, getters, actions, mutations
}