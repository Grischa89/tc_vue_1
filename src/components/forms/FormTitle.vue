<template>
  <h2 class="form__title">{{ title }}</h2>
</template>

<script>
export default {
  name: 'FormTitle',

  props: {
    title: String,
  }
}
</script>

<style lang="scss">
  .form__title {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    // TODO: heading
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;
  }
</style>