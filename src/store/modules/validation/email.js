const state = {
  regexEmail: /^\S+@\S+\.\S+$/,
  errors: {
    invalidEmail: '',
  },
};

const getters = {

  regexEmail: state => {
    return state.regexEmail;
  },

  emailErrors: state => {
    return state.errors;
  },
  
};

const actions = {

  validateEmail({ state, commit }, email) {
    if (!email) {
      commit('setEmailInvalidMessage', 'Please enter an email address.');
      return false;
    } else if (!state.regexEmail.test(email)) {
      commit('setEmailInvalidMessage', 'Please enter a valid email address.');
      return false;
    } else {
      commit('setEmailInvalidMessage', '');
      return true;
    }
  },

};

const mutations = {
  setEmailInvalidMessage(state, message) {
    state.errors.invalidEmail = message;
  },

};

export default {
  state, getters, actions, mutations
}