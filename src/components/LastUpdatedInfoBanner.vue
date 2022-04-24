<template>
  <div class="last-updated__banner">
    <div class="last-updated__banner__help">
      Last updated 12 minutes ago.
    </div>
  </div>
</template>

<script>
export default {

  name: 'LastUpdatedInfoBanner',

}
</script>

<style lang="scss">
.last-updated__banner {
  background-color: $primary-darker;

  &__help {
    font-size: $mobile-help;
    padding: .25rem;
  }
}
</style>