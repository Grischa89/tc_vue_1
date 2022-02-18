<template>

  <button @click="$emit('prev')"
    class="carousel-control prev bg-black opacity-50 border-none inline-block absolute left-0 text-gray-200 cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <button @click="$emit('next')"
    class="carousel-control next bg-black opacity-50 border-none inline-block absolute right-0 text-gray-200 cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>  
  </button>

</template>

<script>
export default {
  name: 'CarouselControls',

  emits: ['prev', 'next'],
}
</script>

<style scoped>
.carousel-control {
  /* background-color: rgba(0, 0, 0, .5);
  border: none;
  display: inline-block;
  position: absolute; */
  height: 50px;
  /* width: 70px; */
  top: calc(50% - 25px);
  /* top: 0;
  color: #f3f3f3;
  cursor: pointer; */
}

/* .prev {
  left: 0;
} */

/* .next {
  right: 0;
} */
</style>