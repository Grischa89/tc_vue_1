<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <!-- <div> -->
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <AsyncCodesNotFound v-if="loadStatus === 'error'" />

  <div v-if="loadStatus === 'success' && cityCodes">
    <Breadcrumb
      	v-if="breadcrumb"
        :breadcrumb="breadcrumb" />

    <AsyncInvalidSlug
      v-if="invalidURLMessage"
      :message="invalidURLMessage" />

    <Table 
      :title="tableTitle"
      :codes="cityCodes"
      :isCity="isCity" />

    <CitySuggestions
      v-if="citySuggestions"
      :citySuggestions="citySuggestions" />

    <CardCarousel
      :codes="cityCodes"
      :isCity="isCity" />

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import CitySuggestions from '../components/CitySuggestions.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'City',

  // data() {
  //   return {
  //     tableTitle: 'Latest Codes',
  //   }
  // },

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
    Breadcrumb,
    CitySuggestions,
  },

  created() {
    this.$store.dispatch('fetchCityCodes', { continent: this.$route.params.continent, country: this.$route.params.country, city: this.$route.params.city });
    console.log('After dispatching fetchCityCodes');
  },
  
  computed: {
    ...mapGetters({
      isCity: 'isCity',
      cityCodes: 'codeGetter',
      tableTitle: 'tableTitle',
      loadStatus: 'cityLoadStatus',
      invalidURLMessage: 'invalidURLMessage',
      breadcrumb: 'breadcrumb',
      citySuggestions: 'citySuggestions',
    })
  },

}
</script>


