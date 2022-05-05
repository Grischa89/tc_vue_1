<template>
  <div class="last-updated__banner">
    <div class="last-updated__banner__help">
      Last updated {{ elapsedInfo }} ago.
    </div>
  </div>
</template>

<script>
export default {

  name: 'LastUpdatedInfoBanner',

  props: {
    elapsedInfo: {
      // type: String,
      required: false,
    }
  }

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