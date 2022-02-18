<template>
  <transition :name="slideTransition">
    <!-- Show the item where index and currentSlide match -->
    <!-- justify-center items-center -->
      <div v-show="currentSlide === index"
        class="carousel-slide flex flex-col items-center justify-center border border-gray-300 bg-white rounded-lg">
          <div class="mt-2 mb-5">
            <!-- TODO: Zeilenumbruch bei langen Namen bedenken -->
            <h2 class="text-lg font-bold uppercase">{{ code.country }}</h2>
          </div>
          <div class="qrcode-wrapper">
            <qrcode-vue :value="code.player_code" :size="size" level="H" />
          </div>
          <div class="flex mt-5 mb-2">
            <!-- TODO: Zeilenumbruch bei langen Namen bedenken -->
            <h2 class="text-sm uppercase mx-1">
              {{ code.player_code }}
            </h2>

            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"  id="icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
        </div>
  </transition>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'CarouselSlide',

  components: {
      QrcodeVue,
  },

  data() {
    return {
      size: 150,
    }
  },

  props: [
    'code',
    'currentSlide',
    'index',
    'direction',
  ],

  computed: {
    slideTransition() {
      return this.direction === 'next' ? 'slide-out' : 'slide-in';
    }
  }

}
</script>

<style scoped>
.carousel-slide {
  position: absolute; 
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* width: 200px;
  height: 200px; */
}

.slide-in-enter-active,
.slide-in-leave-active,
.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 1s ease-in-out;
}

.slide-in-enter-from {
  transform: translateX(-100%);
}

.slide-in-leave-to {
  transform: translateX(100%);
}

.slide-out-enter-from {
  transform: translateX(100%);
}

.slide-out-leave-to {
  transform: translateX(-100%);
}
</style>