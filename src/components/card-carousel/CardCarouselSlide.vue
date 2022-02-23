<template>
  <!-- data-pos crucial for sliding to work (getting and re-calculating item position) -->
  <li
    :data-pos="code.dataPos"
  >
    <p class="carousel__item__heading">{{ code.country }}</p>

    <qrcode-vue :value="code.player_code" level="H"/>

    <p class="carousel__item__code">{{ code.player_code }}</p>

    <!-- TODO: Remove for productiion: -->
    <p id="carousel__item__index">{{ index }}</p>

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
    },
  },

}
</script>

<style lang="scss" scoped>
.carousel__item {
  & p {
    font-size: .875rem;
    word-wrap: break-word;
    line-height: 1.25rem;
    margin-top: .75rem;
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    max-width: 80%;
  }

  &__heading {
    font-weight: 700;
    letter-spacing: 0.05em;
  }
}

// TODO: Remove before production:
#carousel__item__index {
  position: absolute;
  right: 1rem;
  bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  font-size: .5rem;
  color: #808080;
}
</style>