// import axios from 'axios';

const state = {

  continentNames: [
    { name: 'Africa', slug: 'africa' },
    { name: 'Asia', slug: 'asia'},
    { name: 'Europe', slug: 'europe'},
    { name: 'North America', slug: 'north-america'},
    { name: 'Oceania', slug: 'oceania'},
    { name: 'South America', slug: 'south-america'},
  ],

};

const getters = {

  continentNames: state => {
    return state.continentNames;
  },

};

const actions = {

};

const mutations = {

};

export default {
  state, getters, actions, mutations
}