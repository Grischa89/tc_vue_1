import axios from 'axios';

const state = {
  user: {},
  isAuthenticated: false,
  isStaff: false,
  accessToken: '',
  refreshToken: '',
  token: '',
  isLoading: false,
  requestEmail: '',
  prevRouteName: '',
  toRouteName: '',
};

const getters = {

  user: state => {
    return state.user;
  },

  isAuthenticated: state => {
    return state.isAuthenticated;
  },

  isStaff: state => {
    return state.isStaff;
  },

  userExists: state => {
    if (state.user?.username) {
      return true;
    }
    return false;
  },

  requestEmail: state => {
    return state.requestEmail;
  },

  prevRouteName: state => {
    return state.prevRouteName;
  },

  toRouteName: state => {
    return state.toRouteName;
  },

};

const actions = {
  createUser({ commit }, userCreateData) {

    return axios.post('/api/v1/accounts/auth/users/', userCreateData)
      .then(res => {
        return { status: res.status };
      })
      .catch(err => {
        if (err.response) console.log('%cerr.response', 'color: darkseagreen; font-weight: bold;', err.response);

        if (err.response) return { status: err.response.status, message: err.response.data.password[0] };
        return Promise.reject(err);
    });
  },

  activate({ commit }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/activation/`, formData)
      .then(res => {
        return res.status;
      })
      .catch(err => {
        console.log('err in auth.js activate', err);

        if (err.response) return err.response.status;
        return Promise.reject(err);
      });

  },

  resendActivationEmail({ commit }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/resend_activation/`, formData)
      .then(res => {

        commit('setRequestEmail', formData.email);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js resend_activation', err);

        if (err.response) return err.response.status;
        return Promise.reject(err);
      });
  },

  requestPasswordReset({ commit }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/reset_password/`, formData)
      .then(res => {

        commit('setRequestEmail', formData.email);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js reset_password', err);

        if (err.response) return err.response.status;
        return Promise.reject(err);
      });
  },

  resetPasswordConfirm({ confirm }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/reset_password_confirm/`, formData)
      .then(res => {

        return res.status;
      })
      .catch(err => {
        console.log('error in reset_password_confirm', err);
        if (err.response) return err.response.status;
        return Promise.reject(err);
      });
  },

  // TODOOOOOOOOOOOOOO: Überprüfen, ob isAuthenticated im session gesetzt wird
  // + kann  `JWT ${tc_user.access}`; durch  `JWT ${access}`; ersetzt werde, da mit übergeben
  verifyJWT({ commit, state }, access) {

    return axios.post(`/api/v1/accounts/auth/jwt/verify/`,  {"token": access})
      .then(res => {
        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

        axios.defaults.headers.common['Authorization'] = `JWT ${tc_user.access}`;
        commit('setAuthenticated', true);
        sessionStorage.isAuthenticated = JSON.stringify(true);
        
        return res.status;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },

  refreshJWT({ commit }) {
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

    return axios.post(`/api/v1/accounts/auth/jwt/refresh/`, {"refresh": tc_user.refresh})
      .then(res => {
        tc_user.access = res.data.access;
        localStorage.tc_user = JSON.stringify(tc_user);
        sessionStorage.isAuthenticated = JSON.stringify(true);

        axios.defaults.headers.common['Authorization'] = `JWT ${res.data.access}`;
        commit('setAuthenticated', true);

        return res.data.access;
      })
      .catch(err => {
        console.log('%cerr in refreshJWT in auth.js', 'color: red; font-weight: bold;', err);
        return Promise.reject(err);
      });
  },

  login({ commit }, formData) {

    return axios.post('/api/v1/accounts/auth/jwt/create/', formData)
      .then(res => {
        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
        tc_user.access = res.data.access;
        tc_user.refresh = res.data.refresh;
        localStorage.tc_user = JSON.stringify(tc_user);
        sessionStorage.isAuthenticated = JSON.stringify(true);

        axios.defaults.headers.common['Authorization'] = `JWT ${res.data.access}`;

        commit('setAuthenticated', true);

        return res.status;
      })
      .catch(err => {
        if (err.response) return err.response.status;
        return Promise.reject(err);
      });
  },

  getUserProfile({ commit }, email) {

    return axios.get(`/api/v1/accounts/profile/`)
      .then(res => {
        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
        tc_user.username = res.data.username;
        tc_user.is_active = res.data.is_active;
        tc_user.is_staff = res.data.is_staff;
        // For testing:
        // tc_user.is_staff = false;
        localStorage.tc_user = JSON.stringify(tc_user);

        // Set state.user to retrieved user
        commit('setUser', res.data);
        commit('setStaff', res.data.is_staff);
        
        return res.data;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },

  logout({ commit }) {
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

    delete tc_user.access;
    delete tc_user.refresh;
    delete tc_user.is_staff;

    // Still re-set tc_user with username and is_active
    localStorage.tc_user = JSON.stringify(tc_user);
    sessionStorage.removeItem('isAuthenticated');

    delete axios.defaults.headers.common['Authorization'];

    commit('setAuthenticated', false);
    commit('setStaff', false);

    return Promise.resolve(true);
  },

};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },

  setToken(state, token) {
    state.accessToken = token.access;
    state.refreshToken = token.refresh;
  },

  setAccess(state, token) {
    state.accessToken = token.access;
  },

  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },

  setStaff(state, isStaff) {
    state.isStaff = isStaff;
  },

  setActivated(state, isActivated) {
    state.isActivated = isActivated;
  },

  removeToken(state) {
    state.accessToken = '';
    state.refreshToken = '';
    state.isAuthenticated = false;
  },

  setRequestEmail(state, email) {
    state.requestEmail = email;
  },

  setPrevRouteName(state, prevRouteName) {
    state.prevRouteName = prevRouteName;
  },

  setToRouteName(state, toRouteName) {
    state.toRouteName = toRouteName;
  },
};

export default {
    state, getters, actions, mutations
}
