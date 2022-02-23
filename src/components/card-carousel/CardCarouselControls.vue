<template>
  <div>
    <button @click="$emit('prev', $event)"
      class="carousel-control">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="$emit('next')"
      class="carousel-control">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
.carousel-control {
  display: inline-block;
  background-color: rgba(0, 0, 0, .5);
  border: none;
  display: inline-block;
  margin: 0 1rem;
  // align-items: center;
  // position: absolute;
  height: 50px;
  // width: 70px;
  // top: calc(50% - 25px);
  // bottom: 0;
  color: #f3f3f3;
  cursor: pointer;
}
</style>