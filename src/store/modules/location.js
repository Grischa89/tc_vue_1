import axios from 'axios';

const state = {

  clientLocation: '',

  isEurope: undefined,
};

const getters = {

  clientLocation: state => {
    return state.clientLocation;
  },

  clientTimeZone: state => {
    return state.clientLocation.time_zone;
  },

  isEurope: state => {
    return state.isEurope;
  }

};

const actions = {

  fetchClientLocation({ commit }) {
    
    return axios.get(`https://api.freegeoip.app/json/?apikey=${process.env.VUE_APP_GEO_API_KEY}`)
    .then(res => {
      // console.log('res.data', res.data);
      return res.data;
    })
    .catch(err => {
      console.log('error', err);
    });
  },
};

const mutations = {

  // setClientLocation(state, clientLocation) {
  //   state.clientLocation = clientLocation;
  // },

  // setTimeZone(state, clientTimeZone) {
  //   // res.data.time_zone will look sth like 'Europe/Berlin'
  //   if (clientTimeZone.includes('Europe')) {
  //     state.isEurope = true;
  //   } else {
  //     state.isEurope = false;
  //   }
  //   console.log('setTimeZone, state.isEurope ', state.isEurope);
  //   console.log('setTimeZone, state.isEurope ', typeof state.isEurope);
  // }

};

export default {
  state, getters, actions, mutations
}