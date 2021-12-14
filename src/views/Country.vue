<template>
  <div>
    Hello, this is the country view!

    <Table 
    :codes="countryCodes"
    :title="countryCodesTitle"
     />
    <!-- :title="countryCodes[0].country" /> -->

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import { mapGetters } from 'vuex';

export default {

name: 'Country',

  // data() {
  //   return {
  //   }
  // },

  components: {
    Table,
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