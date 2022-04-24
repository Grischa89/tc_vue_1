import axios from 'axios';

const state = {

  recentLoadStatus: null,

};

const getters = {

  recentLoadStatus: state => {
    return state.recentLoadStatus;
  },

};

const actions = {

  fetchRecentCodes({ state, commit, rootState }) {

    commit('setRecentStatus', 'loading');
    commit('setURLMessage', '');

    axios.get('/api/v1/codes/')
      .then(res => {
        window.document.title = 'Recent Codes From Around The World | trainercodes.net';
        commit('setBreadcrumb', '');
        return commit('addDataPositions', res.data.data);
      })
      .then(() => {
        commit('prettyCode', rootState.codes);
        commit('setRecentStatus', 'success');
      })
      .catch(err => {
        // TODO: Ist es hier überhaupt wichtig, Ob ein 404 ausgegeben wird oder wollen wir bei jedem error code dieselbe antwort haben?
        commit('setRecentStatus', 'error');
      });
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

  setRecentStatus(state, status) {
    state.recentLoadStatus = status;
  },

  // pushQuestion(state, question) {
  //   state.questions.data.unshift(question);

};

export default {
  state, getters, actions, mutations
}