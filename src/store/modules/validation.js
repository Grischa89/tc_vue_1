const state = {
  regexUsername: '',
  regexEmail: /^\S+@\S+\.\S+$/,
  regexPassword: {
    letter: /[a-zA-Z]/,
    digit: /\d/,
  },
  passwordRequirements: {
    validPassword: null,
    letter: {
        message: 'include at least one letter.',
        valid: false,
    },
    digit: {
        message: 'include at least one number.',
        valid: false,
    },
    length: {
        message: 'be at least 8 characters long.',
        valid: false,
    },
  },
  errors: {
    invalidPassword: '',
  },
};

const getters = {
  passwordRequirements: state => {
    return state.passwordRequirements;
  },

  invalidPassword: state => {
    return state.errors.invalidPassword;
  },

  regexEmail: state => {
    return state.regexEmail;
  },

  regexPassword: state => {
    return state.regexPassword;
  },
  
};

const actions = {
  validateOnInput({ state, commit }, password) {
    commit('validateLetter', password);
    commit('validateDigit', password);
    commit('validateLength', password);
  },

  validatePassword({ state, commit }, password) {
    if (!password || !state.passwordRequirements.letter.valid || !state.passwordRequirements.digit.valid || !state.passwordRequirements.length.valid) {
      commit('setPasswordInvalidMessage', 'Please enter a valid password.');
      return false;
    } else {
      commit('setPasswordValidity', true);
      commit('setPasswordInvalidMessage', '');
      return true;
    }
  }
};

const mutations = {
  validateLetter(state, password) {
    if (!state.regexPassword.letter.test(password)) {
      state.passwordRequirements.validPassword = false;
      state.passwordRequirements.letter.valid = false;
    } else {
      state.passwordRequirements.letter.valid = true;
    }
  },

  validateLength(state, password) {
    if (!state.regexPassword.digit.test(password)) {
      state.passwordRequirements.validPassword = false;
      state.passwordRequirements.digit.valid = false;
    } else {
      state.passwordRequirements.digit.valid = true;
    }
  },

  validateDigit(state, password) {
    if (password.length < 8) {
      state.passwordRequirements.validPassword = false;
      state.passwordRequirements.length.valid = false;
    } else {
      state.passwordRequirements.length.valid = true;
    }
  },

  setPasswordInvalidMessage(state, message) {
    state.errors.invalidPassword = message;
  },

  setPasswordValidity(state, boolean) {
    state.passwordRequirements.validPassword = boolean;
  }
};

export default {
  state, getters, actions, mutations
}