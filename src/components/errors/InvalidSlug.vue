<template>
  <div class="user__info user__info--info">{{ message }}</div>
</template>

<script>
export default {
  name: 'InvalidSlug',

  props: {
    message: {
      type: String,
    }
  }

}
</script>

<style lang="scss">
.user__info {
  font-size: $mobile-help;
  text-align: left;
  // max-width: 24.3076923rem;
  width: 90%;
  margin: 1rem auto;
  padding: .5rem;
  border-radius: .25rem;
  background-color: rgba($help, .1);
  box-shadow: 0 0 0 2px $help-shadow;

    &--info {
      background-color: rgba($info, .15);
      box-shadow: 0 0 0 2px $info-shadow;
    }

    &--error {
      background-color: rgba($error, .15);
      box-shadow: 0 0 0 2px $error-shadow;
    }

    &--success {
      background-color: rgba($success, .15);
      box-shadow: 0 0 0 2px $success-shadow;
    }

    &--highlight {
        font-weight: bold;
    }

    &__link {
        font-weight: bold;
    }
}
</style>