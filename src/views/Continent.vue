<template>
  <div>

    <Table 
    v-if="continentCodes"
    :codes="continentCodes"
    :title="continentCodesTitle"
     />

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  components: {
    Table,
  },

  mounted() {
    this.$store.dispatch('fetchLatestContinentCodes', this.$route.params.continent);
    console.log('After dispatching fetchLatestContinentCodes in Continent');
  },

  // watch: {
  //   $route(to, from) {
  //     this.$store.dispatch('fetchLatestContinentCodes', this.$route.params.continent);
  //     console.log('After dispatching fetchLatestContinentCodes in Continent');
  //   }
  // },
  
  computed: {
    ...mapGetters({
      continentCodes: 'continentCodes',
      continentCodesTitle: 'continentCodesTitle',
    })
  },
}
</script>

<style>

</style>