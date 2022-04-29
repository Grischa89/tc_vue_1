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

    try {
      // throw new Error('No Timezone');
      let res = await Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (res) {
        return res;
      } else {
        throw new Error('No Timezone');
      }
    } catch(err) {
      return err.message;
    }

    // return 

    // return axios.get(`https://api.ipbase.com/v2/info?apikey=${process.env.VUE_APP_GEO_API_KEY}&ip=1.1.1.1`)
    // .then(res => {
    //   console.log('res.data', res.data.data);
    //   commit('setClientLocation', res.data.data);
    //   return res.data.data;
    // })
    
    // return axios.get(`https://api.ipbase.com/v2/info?apikey=${process.env.VUE_APP_GEO_API_KEY}&ip=1.1.1.1`)
    // .then(res => {
    //   console.log('res.data', res.data.data);
    //   commit('setClientLocation', res.data.data);
    //   return res.data.data;
    // })
    // .catch(err => {
    //   console.log('error', err);
    // });
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