<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <!-- <div> -->
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <AsyncErrorFetchingData v-if="loadStatus === 'error'">
    <template #title>
      Sorry &#128533;
    </template>

    <template #text>
      {{ errorRetrievingRecent }}
    </template>
  </AsyncErrorFetchingData>

  <div v-if="loadStatus === 'success' && latestCodes">
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
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Home',

  data() {
    return {
      tableTitle: 'Latest Codes',
      errorRetrievingRecent: 'Something went wrong retrieving recent Trainer Codes.',
    }
  },

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
  },

  created() {
    this.$store.dispatch('fetchRecentCodes');
    console.log('After dispatching fetchRecentCodes in Home');
  },
  
  computed: {
    ...mapGetters({
      latestCodes: 'codeGetter',
      loadStatus: 'recentLoadStatus',
    })
  },

}
</script>


