<template>
  <div class="error__page">

    <h1 class="error__page__title error__page__title--big">Ooops! &#128533;</h1>

    <h2 class="error__page__title">Something went wrong retrieving codes.</h2>

    <div class="error__page__btn__container">
          <button class="error__page__btn error__page__btn--reload" @click="reloadPage">Try Again</button>

          <button class="error__page__btn error__page__btn--home" @click="loadHome">Back to Home</button>
    </div>

    
  </div>
</template>

<script>
export default {

    name: 'CodesNotFound',

    methods: {
        reloadPage() {
            this.$router.go();
        },

        loadHome() {
            this.$router.push('/');
        },
    }
}
</script>

<style lang="scss">
.error__page {
  background-color: #fff;
  // padding: .75rem 0;
  border-radius: 0.75em;
  // display: flex;
  // justify-content: center;
  width: 90%;
  padding: 2rem;
  // max-width: 24.3076923rem;
  // TODO: Come up with sth better than margin, centering container in middle of viewport
  margin: 3rem auto;

  @media(min-width: 1024px) {
    width: 40%;
    max-width: 24.3076923rem;
  }

  &__title {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    // TODO: heading
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;

    &--big {
      // TODO: Better name
      font-size: 2rem;
    }
    
  }

  &__btn__container {
    margin-top: 3rem;
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
      outline: none;
      box-shadow: 0 0 0 2px $input-shadow;
    }

    &--home {
      color: #fff;
      background-color: #000;
    }

    &--reload {
      color: #000;
      background-color: #fff;
    }
  }

}
</style>