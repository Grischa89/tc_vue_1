<template>
  <span class="tooltip__text">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'Tooltip',
}
</script>

<style lang="scss">
  .tooltip {
  position: relative;
  display: inline-block;

  &__text {
    visibility: hidden;
    background-color: rgba($black, .5);
    color: $white;
    text-align: center;
    white-space: nowrap;
    font-size: $mobile-help;
    padding: .25rem .5rem;
    border-radius:.375rem;
    transition-delay: 300ms;
    position: absolute;
    z-index: 1;
    bottom: 110%;
    left: 50%;
    min-width: 10ch;

    &::after {
      content: ' ';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: rgba($black, .5) transparent transparent transparent;
    }
  }
}
</style>