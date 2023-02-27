import axios from 'axios';

const state = {

  cityLoadStatus: null,

  isCity: false,

  citySuggestions: null,

};

const getters = {

  cityLoadStatus: state => {
    return state.cityLoadStatus;
  },

  isCity: state => {
    return state.isCity;
  },

  citySuggestions: state => {
    if (state.citySuggestions) {
      const citiesNotNull = state.citySuggestions.filter(item => item.city != null);

      const citiesUnique = citiesNotNull.filter((item, i) => citiesNotNull.findIndex(a => (a['city'] === item['city'])) === i);

      return citiesUnique;
    }
  },
};

const actions = {

  fetchCityCodes({ commit, rootState }, data) {

    commit('setCityStatus', 'loading');
    commit('setURLMessage', '');

    // axios.get(`/api/v1/codes/europe/spain/madrid-madrid/`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/${data.city}/`)
      .then(res => {
        // NOTE: If valid continent request res.data.new_cache_key: ''

        if (res.data.new_cache_key) {

          if (res.data.new_cache_key === 'recent_codes') {
            // 'recent_codes', both slugs incorrect (/eruop/span/madrid-madr)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}/${data.city}/`, 'validSlug': '/' };
            commit('setURLMessage', slugs);
            commit('setTableTitle', 'Recent Codes');
            commit('setBreadcrumb', '');
            window.document.title = 'Recent Codes From Around The World — trainercodes.net';
          } else {
            // correct continent and/or country, only city incorrect (/europe/spain/madr/ || /euro/spain/madr)
            const slugs = { 'invalidSlug': `/${data.continent}/${data.country}/${data.city}/`, 'validSlug': res.data.new_cache_key };
            commit('setURLMessage', slugs);

            // Check if new_cache_key contains more than 2 / (is country: /europe/spain/madr || /euro/spain/)
            if ((res.data.new_cache_key.match(/\//g) || []).length > 2) {
              commit('setTableTitle', res.data.data[0].country);
              commit('setBreadcrumb', { continentName: res.data.data[0].continent, continentSlug: res.data.data[0].continent_slug });
              window.document.title = `${res.data.data[0].country} — Recent Codes From ${res.data.data[0].country} — trainercodes.net`;
            } else {
              // (is continent: /europe/span/madr)
              commit('setTableTitle', res.data.data[0].continent);
              commit('setBreadcrumb', '');
              window.document.title = `${res.data.data[0].continent} — Recent Codes From ${res.data.data[0].continent} — trainercodes.net`;
            } 
          }
        } else {
          // correct url (/europe/spain/madrid-madrid) or only correct city slug
          window.document.title = `${res.data.data[0].city} — Recent Codes From ${res.data.data[0].city} — trainercodes.net`;
          commit('setTableTitle', res.data.data[0].city);
          commit('setBreadcrumb', { continentName: res.data.data[0].continent, continentSlug: res.data.data[0].continent_slug, countryName: res.data.data[0].country, countrySlug: res.data.data[0].country_slug });
          commit('setIsCity', true);
        }

        // // TODO: Make global mutation that sets document title mit getter in beforeEach?

        return commit('setCodes', res.data.data);
      })
      .then(() => {
        commit('prettyCode', rootState.codes);
        commit('setCityStatus', 'success');
      })
      .catch(err => {
        commit('setCityStatus', 'error');
        console.log(err);
        console.log('An error occured. fetchCityCodes');
        
      })
  },

  fetchCountryForCitySuggestions({ commit }, data) {

    axios.get(`/api/v1/codes/${data.continent}/${data.country}/`)
      	.then(res => {
          commit('setCitySuggestions', res.data.data)
        })
        .catch(err => {
          console.log('%cerr in fetchCountryForCitySuggestions', 'color: red; font-weight: bold;', err);
        });
  },

};

const mutations = {

  setCityStatus(state, status) {
    state.cityLoadStatus = status;
  },

  setIsCity(state, isCity) {
    state.isCity = isCity;
  },

  setCitySuggestions(state, cities) {
    state.citySuggestions = cities;
  },

};

export default {
  state, getters, actions, mutations
}