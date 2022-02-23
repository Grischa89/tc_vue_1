<template>
  <div class="carousel__control">
    <button @click="$emit('prev', $event)"
      class="carousel__control__button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="$emit('next', $event)"
      class="carousel__control__button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CardCarouselControls',

  emits: ['prev', 'next'],
}
</script>

<style lang="scss" scoped>
.carousel__control__button {
  border: none;
  display: inline-block;
  margin: 0 1rem;
  height: 50px;
  color: #000;
  cursor: pointer;

  & svg {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>