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

  async fetchClientLocation({ commit }) {

    const timezone = await Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Promise((resolve, reject) => {

      if (timezone) {
        resolve(timezone);
      } else {
        reject('No timezone');
      }
    });
  },
};

const mutations = {

  setClientLocation(state, clientLocation) {
    state.clientLocation = clientLocation;
  },

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