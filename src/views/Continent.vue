<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CardCarouselSkeleton />
  </div>

  <div v-if="loadStatus === 'success' && continentCodes">
    <CallToActionInline v-if="!userExists">
      <template #body>
        <p>
          Ready to add your own Trainer Code?
        </p>
      </template>
      <template #footer>
        <button type="button" class="cta-inline__footer__button">
          <router-link :to="{ name: 'SignUp' }">Sign up!</router-link>
        </button>
      </template>
    </CallToActionInline>

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
import CallToActionInline from '../components/cta/CallToActionInline.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  components: {
    Table,
    CardCarousel,
    TableSkeleton,
    CardCarouselSkeleton,
    CallToActionInline,
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
      userExists: 'userExists',
    })
  },
}
</script>

<style>

</style>