import axios from 'axios';

const state = {

  continentNames: [
    { name: 'Africa', slug: '/codes/africa' },
    { name: 'Asia', slug: '/codes/asia'},
    { name: 'Europe', slug: '/codes/europe'},
    { name: 'North America', slug: '/codes/north-america'},
    { name: 'Oceania', slug: '/codes/oceania'},
    { name: 'South America', slug: '/codes/south-america'},
  ],

  lastUpdated: '',

  scrollYPosition: 0,

};

const getters = {

  continentNames: state => {
    return state.continentNames;
  },

  elapsedInfo: state => {
    // TODO: Async componente aus LastUpdatedBanner machen?
    const now = new Date().getTime();
    const lastUpdated = new Date(state.lastUpdated).getTime();

    const msElapsed = now - lastUpdated;

    const secInMs = 1000;
    const minInMs = 60000;
    const hInMs = 3600000;
    const dayInMs = 86400000;

    if (msElapsed > dayInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));

      return elapsed <= 1 ? `${elapsed} day` : `${elapsed} days`;
    } else if (msElapsed > hInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60 * 60));

      return elapsed <= 1 ? `${elapsed} hour` : `${elapsed} hours`;
    } else if (msElapsed > minInMs) {
      const elapsed = Math.floor(msElapsed / (1000 * 60));
      
      return elapsed <= 1 ? `${elapsed} minute` : `${elapsed} minutes`;

    } else if (msElapsed > secInMs) {
      const elapsed = Math.floor(msElapsed / 1000);

      return elapsed <= 1 ? `${elapsed} second` : `${elapsed} seconds`;
    } else {
      return '';
    }
  },

  scrollYPosition: state => {
    return state.scrollYPosition;
  }

};

const actions = {
  fetchLastUpdated({ commit }) {

    axios.get('/api/v1/codes/')
      .then(res => {
        // console.log('res1', res.data.data[0].time_of_scrape);
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
  },

  showBackToTopButton(state, visibility) {
    state.backToTopButton = visibility;
  },

  setScrollYPosition(state, position) {
    state.scrollYPosition = position;
  }
};

export default {
  state, getters, actions, mutations
}