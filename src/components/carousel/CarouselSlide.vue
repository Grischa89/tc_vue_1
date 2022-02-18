<template>
  <transition :name="slideTransition">
    <!-- Show the item where index and currentSlide match -->
      <div v-show="currentSlide === index"
        class="carousel-slide flex flex-col justify-center items-center border border-gray-300 bg-white">
          <div class="qrcode-wrapper">
            <qrcode-vue :value="code.player_code" :size="size" level="H" />
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