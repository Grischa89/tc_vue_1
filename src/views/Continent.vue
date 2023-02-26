<template>
  <div v-if="loadStatus === 'loading'">
    <TableSkeleton />
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
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import TableSkeleton from '../components/skeletons/TableSkeleton.vue';
import CallToActionInline from '../components/cta/CallToActionInline.vue';

import { mapGetters } from 'vuex';

export default {

name: 'Continent',

  components: {
    Table,
    TableSkeleton,
    CallToActionInline,
  },

  mounted() {
    this.$store.dispatch('fetchContinentCodes', this.$route.params.continent);
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