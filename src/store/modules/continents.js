import axios from 'axios';

const state = {

  codes: null,
};

const getters = {

  codes: state => {
    return state.codes;
  },

  continentCodesTitle: state => {
    return state.codes[0].continent;
  }
};

const actions = {

  fetchLatestContinentCodes({ commit }, continent) {

    console.log('continent', continent);
    

    axios.get(`/api/v1/codes/${continent}/`)
      .then(res => {
        // commit('setLatestContinentCodes', res.data);
        commit('continentAddDataPositions', res.data);
        console.log('After continentAddDataPositions: ', res.data);
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

  continentAddDataPositions(state, codes) {
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

    console.log('Inside continentAddDataPositions', codes);
    state.codes = codes;
  },

  // setLatestContinentCodes(state, continentCodes) {
  //   state.continentCodes = continentCodes;
  // },

};

export default {
  state, getters, actions, mutations
}