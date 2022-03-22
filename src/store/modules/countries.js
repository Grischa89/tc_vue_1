import axios from 'axios';

const state = {

  countryCodes: null,

};

const getters = {

  countryCodes: state => {
    return state.countryCodes;
  },

  countryCodesTitle: state => {
    return state.countryCodes[0].country;
  }

};

const actions = {

  fetchLatestCountryCodes({ commit }, data) {

    console.log('data', data.continent, data.country);
    

    // axios.get(`/api/v1/codes/asia/japan`)
    axios.get(`/api/v1/codes/${data.continent}/${data.country}/`)
      .then(res => {
        commit('countryAddDataPositions', res.data);
        console.log('After countryAddDataPositions: ', res.data);
      })
      .catch(err => {
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

  countryAddDataPositions(state, codes) {
    // Check if codes array needs to be altered
    if (codes.length % 2 === 0) {
      console.log('This array\'s length is an even number!');
      codes = codes.slice(0, -1);
    }
    let len = codes.length;
    console.log('codes.length', codes.length)
    // Set middle value value of array length
    let limit = (len - 1) / 2;

    // Set iterators
    let i = 0
    let j = limit;

    while (i < len) {

      // Assign positive positional values to elements until limit
      if (i <= limit){
        codes[i].dataPos = i;
        i++;
      } else {
        // Assign negative positional values
        // For array elements with index greater than limit
        codes[i].dataPos = -j;
        j--;
        i++;
      }
    }

    console.log('Inside countryAddDataPositions', codes);
    state.countryCodes = codes;
  },

  // setLatestCountryCodes(state, countryCodes) {
  //   state.countryCodes = countryCodes;
  // },

};

export default {
  state, getters, actions, mutations
}