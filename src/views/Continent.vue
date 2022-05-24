<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <div v-if="loadStatus === 'success' && continentCodes">
    <AsyncInvalidSlug
      v-if="invalidURLMessage"
      :message="invalidURLMessage" />
      
    <Table
      :codes="continentCodes"
      :title="tableTitle" />
    
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

  beforeRouteLeave (to, from) {
    if (this.open === true) {
      document.body.style.overflow = 'auto';
      this.$store.commit('toggleModal', false);
      return false;
    }
    return true
  },
  
  computed: {
    ...mapGetters({
      continentCodes: 'codeGetter',
      tableTitle: 'tableTitle',
      loadStatus: 'continentLoadStatus',
      invalidURLMessage: 'invalidURLMessage',
      open: 'modalOpen',
    })
  },
}
</script>

<style>

</style>