<template>
  <div class="home">
    Home

      <div class="columns is-multiline">
      <div class="column is-12">
          <h2 class="is-size-2 has-text-centered">Latest TrainerCodes</h2>
      </div>

      <!-- <ProductBox 
        v-for="product in latestCodes"
        v-bind:key="product.id"
        v-bind:product="product" /> -->
        {{latestCodes}}
        v-for="item in latestCodes"
        v-bind:key="item.id"
        v-bind:item="item"
        item
    </div>

  </div>
</template>

<script>
import axios from 'axios'
// import ProductBox from '@/components/ProductBox'
export default {
  name: 'Home',
  data() {
    return {
      latestCodes: []
    }
  },
  components: {
    // ProductBox
  },
  mounted() {
    this.getlatestCodes()
    document.title = 'Home | TrainerCodes'
  },
  methods: {
    async getlatestCodes() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/codes/')
        .then(response => {
          this.latestCodes = response.data
        })
        .catch(error => {
          console.log(error)
        })
      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>


