<template>
<!-- From sm-breakpoint onwards tables will be displayed in two columns 
NOTE: This should only be applied when there's more than one table,
otherwise no classes -->
  <div class="home grid sm:grid-cols-2 sm:justify-center sm:gap-0">
    <Table />
      <!-- <ProductBox 
        v-for="product in latestCodes"
        v-bind:key="product.id"
        v-bind:product="product" /> -->
        <!-- {{latestCodes}}
        v-for="item in latestCodes"
        v-bind:key="item.id"
        v-bind:item="item"
        item -->

  </div>
</template>

<script>
import Table from '../components/Table.vue';
import { mapGetters } from 'vuex';

// import axios from 'axios'
// import ProductBox from '@/components/ProductBox'
export default {
  name: 'Home',

  data() {
    return {
      // latestCodes: []
    }
  },

  components: {
    Table,
  },

  mounted() {
    this.$store.dispatch('fetchLatestCodes');
    console.log('After dispatching fetchLatestCodes in Home');
    
    // this.getlatestCodes()
    // document.title = 'Home | TrainerCodes'
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


