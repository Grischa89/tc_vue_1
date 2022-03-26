<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <div v-if="loadStatus === 'success' && continentCodes">
    <Table
      :codes="continentCodes"
      :title="continentCodesTitle" />
    
    <CardCarousel
    :codes="continentCodes" />
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
  },

  mounted() {
    this.$store.dispatch('fetchContinentCodes', this.$route.params.continent);
    console.log('After dispatching fetchContinentCodes in Continent');
  },

  // watch: {
  //   $route(to, from) {
  //     this.$store.dispatch('fetchLatestContinentCodes', this.$route.params.continent);
  //     console.log('After dispatching fetchLatestContinentCodes in Continent');
  //   }
  // },
  
  computed: {
    ...mapGetters({
      continentCodes: 'codeGetter',
      continentCodesTitle: 'continentCodesTitle',
      loadStatus: 'continentLoadStatus',
    })
  },
}
</script>

<style>

</style>