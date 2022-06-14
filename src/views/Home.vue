<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
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
    <CallToActionInline v-if="!userExists">
      <template #body>
        <p>
          Ready to add your own Trainer Code?
        </p>
      </template>
      <template #footer>
        <button type="button" class="cta-inline__footer__button">
          Sign up!
        </button>
      </template>
    </CallToActionInline>

    <Table 
      :title="tableTitle"
      :codes="latestCodes" />
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';
import CallToActionInline from '../components/cta/CallToActionInline.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Home',

  data() {
    return {
      tableTitle: 'Recent Codes',
      errorRetrievingRecent: 'Something went wrong retrieving recent Trainer Codes.',
    }
  },

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
    CallToActionInline,
  },

  created() {
    this.$store.dispatch('fetchRecentCodes');
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
      latestCodes: 'codeGetter',
      loadStatus: 'recentLoadStatus',
      open: 'modalOpen',
      userExists: 'userExists',
    })
  },

}
</script>


