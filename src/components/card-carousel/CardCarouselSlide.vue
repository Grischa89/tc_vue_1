<template>
  <!-- data-pos crucial for sliding to work (getting and re-calculating item position) -->
  <li
    :data-pos="code.dataPos"
    :data-code="code.player_code"
  >
    <div class="carousel__item__heading">{{ code.country }}</div>

    <qrcode-vue class="carousel__item__qrcode" :value="code.player_code" :size="size" level="H"/>

    <div class="carousel__item__code">{{ code.player_code }}</div>

    <CopyButton 
      @click="copyCodeToClipboard($event)" />

    <!-- TODO: Remove for productiion: -->
    <p id="carousel__item__index">{{ index }}</p>

  </li>

</template>

<script>
import QrcodeVue from 'qrcode.vue';
import CopyButton from '../copy-button/CopyButton.vue';

export default {
  name: 'CardCarouselSlide',

  components: {
      QrcodeVue,
      CopyButton,
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

  data() {
    return {
      size: 200,
    }
  },

  methods: {
    copyCodeToClipboard(e) {
      const currentSlide = e.target.closest('.carousel__item');
      this.$store.dispatch('copyCodeToClipboard', currentSlide.dataset.code);
    }
  }

}
</script>

<style lang="scss" scoped>
.carousel__item {
  & div {
    font-size: $mobile-subheading;
    word-wrap: break-word;
    line-height: 1.25rem;
    margin-top: .75rem;
    text-transform: uppercase;
    max-width: 80%;
  }

  &__heading {
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: .75rem;
  }

  &__qrcode {
    margin: 1.5rem auto;
  }

  &__code {
    margin-bottom: .25rem;
  }

  .button {
    margin-bottom: .75rem;
  }

  // TODO:
  // Optional styling to hide copy buttons on all but [data-pos="0"]
  // &:not([data-pos="0"]) {

  //   .button {
  //     display: none;
  //   }
  // }
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