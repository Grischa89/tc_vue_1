<template>
  <div>
    Hello, this is the country view!
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import { mapGetters } from 'vuex';

export default {

name: 'Country',

  data() {
    return {
    }
  },

  components: {
    Table,
  },

  mounted() {
    this.$store.dispatch('fetchLatestCountryCodes', { continent: this.$route.params.continent, country: this.$route.params.country });
    console.log('Route Params', this.$route.params);
    
    console.log('After dispatching fetchLatestCountryCodes in Country');
    
    // this.getlatestCodes()
    // document.title = 'Home | TrainerCodes'
  },
  
  computed: {
    // ...mapGetters({
    //   latestCodes: 'latestCodes',
    // })
  },
}
</script>

<style>

</style>