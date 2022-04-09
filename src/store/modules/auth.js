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

        // TODO: some mutation to set username?

        return res.status;
      })
      .catch(err => {
        // TODO: Oder err.response.status ausgeben?
        console.log('err', err);
        console.log('err.response', err.response);
        return 'Something went wrong. Please enter your information again.';
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

        return 'Something went wrong. Please enter your email address again.';
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

  verifyJWT({ commit }) {

    const accessToken = JSON.parse(localStorage.getItem('tcAccess'));

    const config = {
      headers: {
         'Authorization': "JWT " + accessToken,
         'Content-Type': 'application/json',
      }
    };

    return axios.post(`/api/v1/accounts/auth/jwt/verify/`,  {"token": accessToken})
      .then(res => {

        sessionStorage.setItem('isAuthenticated', JSON.stringify('true'));
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


  refreshJWT({ commit }) {
    const refreshToken = JSON.parse(localStorage.getItem('tcRefresh'));

    // const config = {
    //   headers: {
    //      'Authorization': "JWT " + refreshToken,
    //      'Content-Type': 'application/json',
    //   }
    // };
    return axios.post(`api/v1/accounts/auth/jwt/refresh/`, {"refresh": refreshToken})
      .then(res => {
        console.log('res.status afterapi/v1/accounts/auth/jwt/refresh/', res.status);

        localStorage.setItem('tcAccess', JSON.stringify(res.data.access));
        sessionStorage.setItem('isAuthenticated', JSON.stringify('true'));

        commit('setAccess', res.data);
        commit('setAuthenticated', true);

        return res.status;
      })
      .catch(err => {
        // TODO: Wohin weiterleiten bei 400?
        // Für user ausgeben: Diese email schon aktiviert errors.resendActivation
        console.log('err in auth.js auth/jwt/refresh/', err.response);

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

        // TODO: /users/me get user info
        console.log("login:: ", res.data)
        localStorage.setItem('tcAccess', JSON.stringify(res.data.access));
        localStorage.setItem('tcRefresh', JSON.stringify(res.data.refresh));
        sessionStorage.setItem('isAuthenticated', JSON.stringify('true'));

        commit('setToken', res.data);
        commit('setAuthenticated', true);
        return res.status;
      })
      .catch(err => {
        console.log('err in auth.js login()', err.data, err.response);
        // TODO: Alternativ ganzes err.response mitgeben und status code überprüfen? 401
        return err.response.data.detail;
      });
  },

  getUserProfile({ commit }, email) {

    const accessToken = JSON.parse(localStorage.getItem('tcAccess'));

    const config = {
      headers: {
         'Authorization': "JWT " + accessToken,
         'Content-Type': 'application/json',
      }
    };

    return axios.get(`/api/v1/accounts/profile/${email}/`, config)
      .then(res => {
        // const config = {
        //   headers: {
        //      'Authorization': "JWT " + accessToken,
        //      'Content-Type': 'application/json',
        //   }
        // };
        localStorage.user = JSON.stringify(res.data);
        commit('setUser', res.data);
        // localStorage.setItem('username', res.data.username);
        // localStorage.setItem('email', res.data.email);
        console.log('res.data in getUserProfile', res.data);
        return res.status;
      })
      .catch(err => {
        console.log('err in auth.js /api/v1/accounts/profile', err.data, err.response);
        // TODO: Alternativ ganzes err.response mitgeben und status code überprüfen? 401
        // return err.response.data.detail;
      });
  },

  logout({ commit }) {
    localStorage.removeItem('tcAccess');
    localStorage.removeItem('tcRefresh');
    sessionStorage.removeItem('isAuthenticated');

    commit('removeToken');
  },

  getAuthUser({ commit }) {
    console.log("getAuthUser")

    const accessToken = JSON.parse(localStorage.getItem('tcAccess'));
    console.log("accessToken", accessToken)

    const yourConfig = {
      headers: {
         'Authorization': "JWT " + accessToken,
         'Content-Type': 'application/json',
      }
    };

    // const yourConfig1 = {
    //   headers: {
    //      Authorization: accessToken
    //   }
    // };

    console.log("yourConfig", yourConfig)

   axios.put('/api/v1/accounts/auth/users/me/', {"username": 'gregorij.abramov@gmail.com'},  yourConfig)
    .then(res => {
      console.log("getAuthUser res: ", res)
    })
    .then(res => {
      console.log("111")
      axios.get('/api/v1/accounts/auth/users/me/', yourConfig)
      .then(res =>{
        console.log("getAuthUser with GET res: ", res)
      })
      console.log("222")
    })
    // .then(res => {
    //   console.log("333")
    //   axios.get('/api/v1/accounts/auth/users/me/',  yourConfig)
    //   console.log("444")
    // })
    .catch(err => {
      console.log('err in auth.js getAuthUser()', err);
    });
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
