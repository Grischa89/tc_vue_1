import { whileStatement } from '@babel/types';
import axios from 'axios';

const state = {
  user: {},
  isAuthenticated: false,
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

    return axios.post("/api/v1/accounts/auth/users/", userCreateData)
      .then(res => {
        console.log("res in createUser", res);

        return res.status;
      })
      .catch(err => {
        // TODO: Oder err.response.status ausgeben?
        console.log('err', err);
        console.log('err.response', err.response);
        return err.response.status;
    });
  },

  activate({ commit }, formData) {

    console.log('formData in auth.js activate', formData);

    return axios.post(`/api/v1/accounts/auth/users/activation/`, formData)
      .then(res => {
        console.log('res.status after auth/users/activation/', res.status);
        // set state.user zu res.data??? stein: this.user = response.data (in component)

        return res.status;
      })
      .catch(err => {
        // NOTE: Stein hat hier zu /sign-up weitergeleitet

        return err.response.request.status;
      });

  },

  resendActivationEmail({ commit }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/resend_activation/`, formData)
      .then(res => {
        console.log('res.status after auth/users/activation/', res.status);

        commit('setRequestEmail', formData.email);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js activate', err.response);

        return err.response.status;
      });
  },

  requestPasswordReset({ commit }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/reset_password/`, formData)
      .then(res => {
        console.log('res.status after reset_password', res.status);

        commit('setRequestEmail', formData.email);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js reset_password', err.response);

        return err.response.status;
      });
  },

  resetPasswordConfirm({ confirm }, formData) {

    return axios.post(`/api/v1/accounts/auth/users/reset_password_confirm/`, formData)
      .then(res => {
        console.log('reset_password_confirm', res.status);

        return res.status;
      })
      .catch(err => {
        console.log('error in reset_password_confirm', err.response.status);
        return err.response.status;
      });
  },

  verifyJWT({ commit }, access) {

    return axios.post(`/api/v1/accounts/auth/jwt/verify/`,  {"token": access})
      .then(res => {

        sessionStorage.isAuthenticated = JSON.stringify(true);
        commit('setAuthenticated', true);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err inn auth.js activate jwt/verify/', err.response);
        if (err.response.request.status === 401 || (err.response.request.status === 400)){
          console.log('err inn auth.js activate jwt/verify/', err.response);
          console.log("error code for activate: ", err.response.status)
          return  err.response.status
        } else {
          return 'Did not expect this status code.'
        }
        

         // 'Something went wrong. Please enter your email address again.';
      });
  },

  refreshJWT({ commit }, refresh) {

    // If tc_user in App.vue is an empty object, refresh (tc_user.refresh) will be undefined
    return axios.post(`api/v1/accounts/auth/jwt/refresh/`, {"refresh": refresh})
      .then(res => {
        console.log('res.status afterapi/v1/accounts/auth/jwt/refresh/', res.status);

        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
        tc_user.access = res.data.access;
        localStorage.tc_user = JSON.stringify(tc_user);
        sessionStorage.isAuthenticated = JSON.stringify(true);

        axios.defaults.headers.common['Authorization'] = `JWT ${res.data.access}`;

        commit('setAccess', res.data);
        commit('setAuthenticated', true);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js auth/jwt/refresh/', err.response);

        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('tc_user');

        if (err.response.request.status === 401){
          return err.response.request.status
        } else {
          return 'Did not expect this status code.'
        }

      });
  },

  login({ commit }, formData) {

    return axios.post('/api/v1/accounts/auth/jwt/create/', formData)
      .then(res => {
        console.log("login:: ", res.data);

        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
        tc_user.access = res.data.access;
        tc_user.refresh = res.data.refresh;
        localStorage.tc_user = JSON.stringify(tc_user);
        
        sessionStorage.isAuthenticated = JSON.stringify(true);

        axios.defaults.headers.common['Authorization'] = `JWT ${res.data.access}`;

        commit('setToken', res.data);
        commit('setAuthenticated', true);
        return res.status;
      })
      .catch(err => {
        console.log('err in auth.js login()', err.data, err.response);
        // TODO: Alternativ ganzes err.response mitgeben und status code überprüfen? 401
        return err.response.status;
      });
  },

  getUserProfile({ commit }, email) {

    return axios.get(`/api/v1/accounts/profile/${email}/`)
      .then(res => {
        console.log('res.data in getUserProfile', res.data);

        const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
        tc_user.username = res.data.username;
        tc_user.is_active = res.data.is_active;
        localStorage.tc_user = JSON.stringify(tc_user);
        
        // NOTE / TODO: This mutation uses the whole res.data object while in localSTorage
        // only username and is_active are set
        commit('setUser', res.data);
        
        return res.status;
      })
      .catch(err => {
        console.log('err in auth.js /api/v1/accounts/profile', err.data, err.response);
        // TODO: Alternativ ganzes err.response mitgeben und status code überprüfen? 401
        // return err.response.data.detail;
        return err.response.status;
      });
  },

  logout({ commit }) {
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

    delete tc_user.access;
    delete tc_user.refresh;

    // Still re-set tc_user with username and is_active
    localStorage.tc_user = JSON.stringify(tc_user);
    sessionStorage.removeItem('isAuthenticated');

    delete axios.defaults.headers.common['Authorization'];

    commit('setAuthenticated', false);

    // TODO: removeToken mutation not needed
    commit('removeToken');
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
