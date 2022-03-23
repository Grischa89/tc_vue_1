import axios from 'axios';

const state = {

  codes: null,

  testCodes: null,

  loadStatus: null,

};

const getters = {

  latestCodes: state => {
    return state.codes;
  },

  testCodes: state => {
    return state.testCodes;
  },

  loadStatus: state => {
    return state.loadStatus;
  }

};

const actions = {

  fetchLatestCodes({ state, commit }) {

    commit('setStatus', 'loading');

    axios.get('/api/v1/codes/')
      .then(res => {
        commit('addDataPositions', res.data);
        commit('prettyCode', res.data);
        commit('setStatus', 'success');
        // console.log('After setLatestCodes: ', res.data);
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured.');
        commit('setStatus', 'error');
      });
  },

  fetchTestCodes({ state, commit }) {
    axios.get('/api/v1/codes/')
      .then(res => {
        commit('setTestCodes', res.data);
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured in fetchTestCodes.');
        
      })
  },

  // fetchFeedQuestions({ commit }) {

  //   commit('setQuestionsStatus', 'loading');

  //   axios.get('/api/questions')
  //     .then(res => {
  //       commit('setQuestions', res.data);
  //       commit('setQuestionsStatus', 'success');
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       console.log('Unable to fetch questions');
  //       commit('setQuestionsStatus', 'error');

  //     });
  // },

  // fetchFeedQuestions1({commit, state}) {

  //   commit('setQuestionsStatus', 'loading');

  //   axios.get('/api/questions1')
  //     .then(res => {
  //       commit('setQuestions', res.data);
  //       commit('setQuestionsStatus', 'success');
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       console.log('Unable to fetch questions');
  //       commit('setQuestionsStatus', 'error');

  //     });
  // },

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

  // createQuestion({commit, state}) {
    
  //   commit('setQuestionsStatus', 'loading');

  //   axios.post('/api/questions', { title: state.questionTitle, description: state.questionDescription } )
  //     .then(res => {
  //       console.log(res.data);
  //       commit('pushQuestion', res.data);
  //       commit('createTitle', '');
  //       commit('createDescription', '');
  //     })
  //     .catch(err => {
  //       console.log(err, 'Unable to create question.')
  //     });

  // },

  // createAnswer({commit, state}, data) {

  //   axios.post('/api/questions/'+data.questionId+'/answer', { body: state.answerBody })
  //   .then(res => {
  //     commit('setAnswers', res.data.data);
  //     // console.log('setAnswerCount', res.data.answer_count);
  //     commit('setAnswerCount', res.data.answer_count);

  //   })
  //   .catch(err => {
  //     console.log(err, 'Unable to create answer.');
  //   });
  // },

};

const mutations = {

  setStatus(state, status) {
    state.loadStatus = status;
  },

  addDataPositions(state, codes) {
    // Check if codes array needs to be altered
    if (codes.length % 2 === 0) {
      console.log('This array\'s length is an even number!');
      codes = codes.slice(0, -1);
    }
    let len = codes.length;
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

    state.codes = codes;
  },

  setTestCodes(state, codes) {
    state.testCodes = codes;
  },

  prettyCode(state, codes) {
    for (let item of codes) {
      item.prettyCode = item.player_code.replace(/.{4}/g, '$& ').trim();
    }

    state.codes = codes;
  },

  // setQuestionsStatus(state, status) {
  //   state.questionsStatus = status;
  // },

  // createTitle(state, title) {
  //   state.questionTitle = title;
  // },

  // createDescription(state, description) {
  //   state.questionDescription = description;
  // },

  // pushQuestion(state, question) {
  //   state.questions.data.unshift(question);
  // },

  // setQuestion(state, question) {
  //   state.question = question;
  // },

  // setAnswers(state, answers) {
  //   state.answers = answers;
  // },

  // setAnswerCount(state, count) {
  //   state.answerCount = count;
  // },

  // createAnswerBody(state, answer) {
  //   state.answerBody = answer;
  // },

};

export default {
  state, getters, actions, mutations
}