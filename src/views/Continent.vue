<template>
  <div>
    Hello, this is the continent view!
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  data() {
    return {
    }
  },

  components: {
    Table,
  },

  mounted() {
    this.$store.dispatch('fetchLatestContinentCodes', this.$route.params.continent);
    console.log('After dispatching fetchLatestContinentCodes in Continent');
    
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