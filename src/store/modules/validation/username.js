const state = {
  errors: {
    invalidUsername: '',
  },
};

const getters = {

  usernameErrors: state => {
    return state.errors;
  },
  
};

const actions = {

  validateUsername({ state, commit }, username) {
    if (!username) {
      commit('setUsernameInvalidMessage', 'Please enter a username.');
      return false;
    } else if (username.length < 3 || username.length > 12) {
      commit('setUsernameInvalidMessage', 'Please pick a username between 3 and 12 characters.');
      return false;
    } else {
      commit('setUsernameInvalidMessage', '');
      return true;
    }
},

};

const mutations = {
  setUsernameInvalidMessage(state, message) {
    state.errors.invalidUsername = message;
  },

};

export default {
  state, getters, actions, mutations
}