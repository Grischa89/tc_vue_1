<template>
  <div v-if="codes">

    <Table
      :codes="codes"
      :title="continentCodesTitle" />
    
    <CardCarousel
    v-if="codes"
    :codes="codes" />

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  components: {
    Table,
    CardCarousel,
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
      codes: 'codes',
      continentCodesTitle: 'continentCodesTitle',
    })
  },
}
</script>

<style>

</style>