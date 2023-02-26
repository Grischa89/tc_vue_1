<template>
  <div v-if="loadStatus === 'loading'">
    <CitySuggestionsSkeleton />
    <TableSkeleton />
    <!-- <CardCarouselSkeleton /> -->
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

    <CitySuggestions />

    <Table
    :title="tableTitle"
    :codes="countryCodes" />
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import CitySuggestions from '../components/CitySuggestions.vue';
import CitySuggestionsSkeleton from '../components/skeletons/CitySuggestionsSkeleton.vue';
import CallToActionInline from '../components/cta/CallToActionInline.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Country',

  components: {
    Table,
    TableSkeleton,
    Breadcrumb,
    CitySuggestions,
    CitySuggestionsSkeleton,
    CallToActionInline,
  },

  data() {
    return {
      errorRetrievingCountry: 'Something went wrong retrieving recent Trainer Codes for this country.',
    }
  },

  mounted() {
    this.$store.dispatch('fetchCountryCodes', { continent: this.$route.params.continent, country: this.$route.params.country });
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
      countryCodes: 'codeGetter',
      tableTitle: 'tableTitle',
      loadStatus: 'countryLoadStatus',
      invalidURLMessage: 'invalidURLMessage',
      breadcrumb: 'breadcrumb',
      citySuggestions: 'citySuggestions',
      open: 'modalOpen',
      userExists: 'userExists',
    }),
  },
}
</script>

<style>

</style>