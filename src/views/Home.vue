<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <div v-if="latestCodes">
    <Table 
      :title="tableTitle"
      :codes="latestCodes" />

    <CardCarousel
      :codes="latestCodes" />

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Home',

  data() {
    return {
      tableTitle: 'Latest Codes',
    }
  },

  components: {
    Table,
    CardCarousel,
  },

  created() {
    this.$store.dispatch('fetchLatestCodes');
    console.log('After dispatching fetchLatestCodes in Home');
  },
  
  computed: {
    ...mapGetters({
      latestCodes: 'latestCodes',
    })
  },

}
</script>


