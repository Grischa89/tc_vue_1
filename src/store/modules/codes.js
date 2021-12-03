import axios from 'axios';

const state = {

  codes: null,

};

const getters = {

  latestCodes: state => {
    return state.codes;
  },

};

const actions = {

  fetchLatestCodes({ commit }) {

    axios.get('/api/v1/codes/europe/united-kingdom/')
      .then(res => {
        commit('setLatestCodes', res.data);
        console.log('After setLatestCodes: ', res.data);
      })
      .catch(err => {
        console.log(err);
        console.log('An error occured.');
        
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

  setLatestCodes(state, codes) {
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