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
  background-color: rgba($help, .15);
  border: 2px solid rgba($help, .4);

    &--info {
      background-color: rgba($info, .15);
      border: 2px solid rgba($info, .4);
    }

    &--error {
      background-color: rgba($error, .15);
      border: 2px solid rgba($error, .4);;
    }

    &--success {
      background-color: rgba($success, .15);
      border: 2px solid rgba($success, .4);;
    }

    &--highlight {
        font-weight: bold;
    }

    &__link {
        font-weight: bold;
    }
}
</style>