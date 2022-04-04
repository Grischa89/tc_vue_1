<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <div v-if="loadStatus === 'success' && countryCodes">
    <AsyncInvalidSlug
      v-if="invalidURLMessage"
      :message="invalidURLMessage" />

    <Table
    :title="tableTitle"
    :codes="countryCodes" />

    <CardCarousel
    :codes="countryCodes" />
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Country',

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
  },

  mounted() {
    this.$store.dispatch('fetchCountryCodes', { continent: this.$route.params.continent, country: this.$route.params.country });
  },
  
  computed: {
    ...mapGetters({
      countryCodes: 'codeGetter',
      tableTitle: 'tableTitle',
      loadStatus: 'countryLoadStatus',
      invalidURLMessage: 'invalidURLMessage',
    })
  },
}
</script>

<style>

</style>