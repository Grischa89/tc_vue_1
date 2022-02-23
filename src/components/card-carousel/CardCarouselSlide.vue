<template>
  <li
    :data-pos="code.dataPos"
  >
    <p class="font-bold text-sm uppercase mt-2 mb-5">{{ code.country }}</p>

    <qrcode-vue :value="code.player_code" level="H"/>

    <p class="text-sm uppercase mt-5 mb-2">{{ code.player_code }}</p>

    <p>{{ index }}</p>

  </li>

</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'CardCarouselSlide',

  components: {
      QrcodeVue,
  },

  props: {
    code: {
      type: Object,
    },

    dataPos: {
      type: Number,
    },

    index: {
      type: Number,
    }
  },

  mounted() {
    // console.log('code', typeof this.code);
  }
}
</script>

<style lang="scss" scoped>

</style>