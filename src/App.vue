<template>
<div id="wrapper">
  <LastUpdatedInfoBanner />
  <Nav />
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/recent-codes">recent-codes</router-link> |
    <router-link to="/japan">japan</router-link> |
  </div> -->
  
  <router-view :key="$route.fullPath" />

</div>
</template>

<script>
import LastUpdatedInfoBanner from './components/LastUpdatedInfoBanner.vue';
import Nav from './components/Nav.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: {
    LastUpdatedInfoBanner,
    Nav,
  },

  created() {
    this.$store.dispatch('fetchClientLocation');
  },

  computed: {
    ...mapGetters({
      clientInEurope: 'clientInEurope',
    })
  }

}
</script>


<style lang="scss">
// @import '../node_modules/bulma';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
