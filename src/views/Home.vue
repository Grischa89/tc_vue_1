<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <div>
    <!-- <Table 
    :title="tableTitle" /> -->
    <!-- <Table 
    v-if="latestCodes"
    :title="tableTitle"
    :codes="latestCodes" /> -->

    <CardCarousel
      v-if="latestCodes"
      :codes="latestCodes"
     />

  </div>
</template>

<script>
// import Table from '../components/Table.vue';
import CardCarousel from '../components/card-carousel/CardCarousel.vue';
import { mapGetters } from 'vuex';

// import axios from 'axios'
// import ProductBox from '@/components/ProductBox'
export default {
  name: 'Home',

  data() {
    return {
      tableTitle: 'Latest Codes',
      // latestCodes: []
    }
  },

  components: {
    // Table,
    CardCarousel,
  },

  mounted() {
    this.$store.dispatch('fetchLatestCodes');
    console.log('After dispatching fetchLatestCodes in Home');
  },
  
  computed: {
    ...mapGetters({
      latestCodes: 'latestCodes',
    })
  },

  // methods: {
  //   async getlatestCodes() {
  //     this.$store.commit('setIsLoading', true)
  //     await axios
  //       .get('/api/v1/codes/')
  //       .then(response => {
  //         this.latestCodes = response.data
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })
  //     this.$store.commit('setIsLoading', false)
  //   }
  // },

}
</script>


