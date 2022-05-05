import axios from 'axios';

const state = {

  continentNames: [
    { name: 'Africa', slug: 'africa' },
    { name: 'Asia', slug: 'asia'},
    { name: 'Europe', slug: 'europe'},
    { name: 'North America', slug: 'north-america'},
    { name: 'Oceania', slug: 'oceania'},
    { name: 'South America', slug: 'south-america'},
  ],

  lastUpdated: '',

};

const getters = {

  continentNames: state => {
    return state.continentNames;
  },

  elapsedInfo: state => {
    const now = new Date().getTime();
    const lastUpdated = new Date(state.lastUpdated).getTime();
    console.log(now, lastUpdated);

    const msElapsed = now - lastUpdated;

    const secInMs = 1000;
    const minInMs = 60000;
    const hInMs = 3600000;
    const dayInMs = 86400000;

    if (msElapsed > dayInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
      console.log('elapsed in days', elapsed);

      return elapsed <= 1 ? `${elapsed} day` : `${elapsed} days`;

    } else if (msElapsed > hInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60 * 60));
      console.log('elapsed in hours', elapsed);

      return elapsed <= 1 ? `${elapsed} hour` : `${elapsed} hours`;

    } else if (msElapsed > minInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60));
      console.log('elapsed in minutes');
      
      return elapsed <= 1 ? `${elapsed} minute` : `${elapsed} minutes`;

    } else if (msElapsed > secInMs) {
      const elapsed = Math.floor(msElapsed / 1000);
      console.log('elapsed in seconds');

      return elapsed <= 1 ? `${elapsed} second` : `${elapsed} seconds`;
    } else {
      console.log('elapsed in else');
      return '';
    }
  }

};

const actions = {
  fetchLastUpdated({ commit }) {

    axios.get('/api/v1/codes/')
      .then(res => {
        console.log('res1', res.data.data[0].time_of_scrape);
        commit('setLastUpdated', res.data.data[0].time_of_scrape)
      })
      .catch(err => {
        console.log('err in fetchLastUpdated');
      });
  }
};

const mutations = {
  setLastUpdated(state, timestamp) {
    state.lastUpdated = timestamp;
  }
};

export default {
  state, getters, actions, mutations
}