const state = {
  regexUsername: '',
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
    invalidRePassword: '',
  },
};

const getters = {
  passwordRequirements: state => {
    return state.passwordRequirements;
  },

  passwordErrors: state => {
    return state.errors;
  },

  regexPassword: state => {
    return state.regexPassword;
  },
  
};

const actions = {
  validateOnInput({ commit }, password) {
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
  },

  validateRePassword({ commit }, data) {
    console.log('data', data);
    if (!data.re_password) {
      commit('setRePasswordInvalidMessage', 'Please repeat the password.');
      return false;
    } else if (data.re_password !== data.password) {
      commit('setRePasswordInvalidMessage', 'The passwords do not match.');
      return false;
    } else {
      commit('setRePasswordInvalidMessage', '');
      return true;
    }
  },

  validateLoginPassword({ commit }, password) {
    if (!password) {
      commit('setPasswordInvalidMessage', 'Please enter your password.');
      return false;
    } else {
      commit('setPasswordValidity', true);
      commit('setPasswordInvalidMessage', '');
      return true;
    }
  },

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
  },

  setRePasswordInvalidMessage(state, message) {
    state.errors.invalidRePassword = message;
  }
  
};

export default {
  state, getters, actions, mutations
}