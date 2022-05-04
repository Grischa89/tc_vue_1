<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <AsyncErrorFetchingData v-if="loadStatus === 'error'">
    <template #title>
      Sorry &#128533;
    </template>

    <template #text>
      {{ errorRetrievingCountry }}
    </template>

    <template #action>
      <button class="error__page__btn error__page__btn--action">
        <router-link :to="{ name: 'Home' }">Back to Home</router-link>
      </button>
    </template>
  </AsyncErrorFetchingData>

  <div v-if="loadStatus === 'success' && countryCodes">
    <Breadcrumb
      v-if="breadcrumb"
      :breadcrumb="breadcrumb" />

    <AsyncInvalidSlug
      v-if="invalidURLMessage"
      :message="invalidURLMessage" />

    <CitySuggestions
      v-if="citySuggestions"
      :citySuggestions="citySuggestions" />

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
import Breadcrumb from '../components/Breadcrumb.vue';
import CitySuggestions from '../components/CitySuggestions.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Country',

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
    Breadcrumb,
    CitySuggestions,
  },

  data() {
    return {
      errorRetrievingCountry: 'Something went wrong retrieving recent Trainer Codes for this country.',
    }
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
      breadcrumb: 'breadcrumb',
      citySuggestions: 'citySuggestions',
    }),
  },
}
</script>

<style>

</style>