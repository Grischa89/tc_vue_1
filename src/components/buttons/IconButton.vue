<template>
  <button class="button" type="button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'IconButton',

}
</script>

<style lang="scss">
.button {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // height: 1.25rem;
  // width: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  // background-color: $primary-darker;
  padding: .375rem;
  -webkit-tap-highlight-color: $primary;

  &__prepend {
    height: 1.25rem;
    width: 1.25em;

    &--small {
      color: $help;
      width: 1rem;
      height: 1rem;

      &:hover {
        background-color: transparent;
        color: rgba($black, .5);
      }
    }
  }

  &:hover, &:active {
    // color: #a6a8ac;
    -webkit-tap-highlight-color: $primary;
  }

  // TODO: Wenn Farben stehen für @mobile mehr suttle wählen als
  
  // &:active, {
  //   background-color: #E5E7EB;
  //   // transform: translateY(3px)
  // }

  // &:focus {
  //   color: white;
  // }
}

</style>
