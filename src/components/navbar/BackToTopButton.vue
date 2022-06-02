<template>
  <button type="button" class="back-to-top-button" :class="{ 'back-to-top-button--show': scrollYPosition >= backToTopButtonLimit }">
    <svg xmlns="http://www.w3.org/2000/svg" class="back-to-top-button__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BackToTopButton',

  data() {
    return {
      backToTopButtonLimit: 300,
    }
  },

  computed: {
    ...mapGetters({
      scrollYPosition: 'scrollYPosition',
    })
  },

}
</script>

<style lang="scss" scoped>
.back-to-top-button {
  position: fixed;
  bottom: 5%;
  right: -5%;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba($black, .5);
  text-align: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: all 300ms ease-in-out;

  &--show {
    opacity: 1;
    right: 5%;
  }

  &__icon {
    width: $mobile-heading;
    height: $mobile-heading;
    color: $primary;
    margin: auto auto;
  }

  &:hover {
    background-color: $black;
  }
}
</style>