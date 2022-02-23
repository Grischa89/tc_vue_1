<template>
  <div v-if="countryCodes">
    <Table
    :title="countryCodesTitle"
    :codes="countryCodes" />

    <CardCarousel
    :codes="countryCodes" />
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Country',

  components: {
    Table,
    CardCarousel,
  },

  mounted() {
    this.$store.dispatch('fetchLatestCountryCodes', { continent: this.$route.params.continent, country: this.$route.params.country });
  },
  
  computed: {
    ...mapGetters({
      countryCodes: 'countryCodes',
      countryCodesTitle: 'countryCodesTitle',
    })
  },
}
</script>

<style>

</style>