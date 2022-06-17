<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <!-- <div> -->
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
    <CitySuggestionsSkeleton />
  </div>

  <AsyncErrorFetchingData v-if="loadStatus === 'error'">
    <template #title>
      Sorry &#128533;
    </template>

    <template #text>
      {{ errorRetrievingCity }}
    </template>

    <template #action>
      <button class="error__page__btn error__page__btn--action">
        <router-link :to="{ name: 'Home' }">Back to Home</router-link>
      </button>
    </template>
  </AsyncErrorFetchingData>

  <div v-if="loadStatus === 'success' && cityCodes">
    <Breadcrumb
      	v-if="breadcrumb"
        :breadcrumb="breadcrumb" />

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

    <AsyncInvalidSlug
      v-if="invalidURLMessage"
      :message="invalidURLMessage" />

    <Table 
      :title="tableTitle"
      :codes="cityCodes"
      :isCity="isCity" />

    <CitySuggestions
      v-if="citySuggestions && citySuggestions.length > 0"
      :citySuggestions="citySuggestions" />

    <!-- <CardCarousel
      :codes="cityCodes"
      :isCity="isCity" /> -->

  </div>
</template>

<script>
import Table from '../components/Table.vue';
// import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
// import CardCarouselSkeleton from '../components/skeletons/CardCarouselSkeleton.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import CitySuggestions from '../components/CitySuggestions.vue';
import CitySuggestionsSkeleton from '../components/skeletons/CitySuggestionsSkeleton.vue';
import CallToActionInline from '../components/cta/CallToActionInline.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'City',

  data() {
    return {
      errorRetrievingCity: 'Something went wrong retrieving recent Trainer Codes for this city.',
    }
  },

  components: {
    Table,
    // CardCarousel,
    TableSkeleton,
    // CardCarouselSkeleton,
    Breadcrumb,
    CitySuggestions,
    CitySuggestionsSkeleton,
    CallToActionInline,
  },

  created() {
    this.$store.dispatch('fetchCityCodes', { continent: this.$route.params.continent, country: this.$route.params.country, city: this.$route.params.city });
    console.log('After dispatching fetchCityCodes');
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
      isCity: 'isCity',
      cityCodes: 'codeGetter',
      tableTitle: 'tableTitle',
      loadStatus: 'cityLoadStatus',
      invalidURLMessage: 'invalidURLMessage',
      breadcrumb: 'breadcrumb',
      citySuggestions: 'citySuggestions',
      open: 'modalOpen',
      userExists: 'userExists',
    })
  },

}
</script>


