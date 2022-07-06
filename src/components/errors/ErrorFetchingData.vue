<template>
  <div class="error__page">

    <h1 class="error__page__title">
      <slot name="title"></slot>
    </h1>
    <!-- Sorry &#128533; -->

    <h2 class="error__page__text">
      <slot name="text">{{ defaultMessage }}</slot>
    </h2>

    <div class="error__page__btn__container">
      
      <slot name="action">
        <!-- <router-link :to="{ name: 'Home' }">Back to Home</router-link> -->
      </slot>
    
      <button class="error__page__btn error__page__btn--refresh" @click="refreshPage">
        Try Again
      </button>    
    </div>

  </div>
</template>

<script>
export default {
  name: 'ErrorFetchingData',

  data() {
    return {
      defaultMessage: 'Something went wrong retrieving data.',
    }
  },

  methods: {
    refreshPage() {
      this.$router.go();
    },
  }
}
</script>

<style lang="scss">
.error__page {
  // background-color: var(--surface4);
  border-radius: 0.75em;
  width: 90%;
  padding: 2rem;
  margin: auto;

  @media(min-width: 1024px) {
    width: 50%;
    max-width: 24.3076923rem;
  }

  &__title {
    // TODO: Better name
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  &__text {
    margin: 1.5rem auto;
    // TODO: heading
    font-size: $mobile-heading;
    // font-weight: bold;
    // text-transform: uppercase;
    width: 80%;
  }

  &__btn__container {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
  }

  &__btn {
    margin: .5rem auto;
    padding: .75em 2.5em;
    text-transform: uppercase;
    font-size: $mobile-body;
    letter-spacing: .05rem;
    font-weight: bold;
    border-radius: 25px;
    -webkit-tap-highlight-color: transparent;

    &:active {
      // outline: none;
      // box-shadow: 0 0 0 2px $help-shadow;
      -webkit-tap-highlight-color: transparent;
    }

    &--action {
      color: var(--textInverse);
      background-color: var(--text);
    }

    &--reload {
      color: var(--text);
      background: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

}
</style>