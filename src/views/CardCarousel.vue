<template>
  <div v-if="testCodes">
    <TestCardCarousel
      :testCodes="testCodes" />
  </div>
</template>

<script>
import TestCardCarousel from '../components/test-card-carousel/TestCardCarousel.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'CardCarousel',
  
  components: {
    TestCardCarousel,
  },

  created() {
    this.$store.dispatch('fetchTestCodes');
  },

  computed: {
    ...mapGetters({
      testCodes: 'testCodes',
    })
  },
    
}
</script>

<style lang="scss" scoped>
</style>