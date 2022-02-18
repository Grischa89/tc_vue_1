<template>
  <!-- <div class="carousel-wrapper flex flex-col mx-auto"> items-center -->
  <div class="carousel-wrapper flex justify-center">
    <div class="carousel-inner relative overflow-hidden">

      <CarouselSlide
        v-for="(code, i) in codes"
        :key="i"
        :code="code"
        :currentSlide="currentSlide"
        :index="i"
        :direction="direction" />

      <CarouselControls
        @prev="prev"
        @next="next" />
        
      <!-- <div class="carousel-btn-next"></div>
      <div class="carousel-btn-prev"></div> -->
    </div>
</div>

  <!-- <qrcode-vue :value="value" :size="size" level="H" /> -->
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import CarouselSlide from './CarouselSlide.vue';
import CarouselControls from './CarouselControls.vue';

export default {
  name: 'Carousel',

  components: {
    QrcodeVue,
    CarouselSlide,
    CarouselControls,
  },

  props: {
    codes: {
      type: Array,
      // required: true,
    },

    // title: {
    //   type: String,
    //   // required: true,
    // },
  },

  data() {
    return {
      currentSlide: 0,
      slideInterval: null,
      direction: 'next',
    }
  },
    
  mounted() {
    // this.startSlideTimer();
  },

  beforeUnmount() {
    clearInterval(this.slideInterval);
  },

  methods: {
    setCurrentSlide(index) {
      this.currentSlide = index;
    },

    prev() {
      // this.codes.length - 1: slide from index 0 to index of codes.length - 1 (first to last slide)
      const index = this.currentSlide > 0 ? this.currentSlide - 1 : this.codes.length - 1;
      this.setCurrentSlide(index);
      this.direction = 'prev';
      // this.startSlideTimer();
    },

    next() {
      const index = this.currentSlide < this.codes.length - 1 ? this.currentSlide + 1 : 0;
      this.setCurrentSlide(index);
      this.direction = 'next';
      // this.startSlideTimer();
    },

    startSlideTimer() {
      this.slideInterval = setInterval(() => {
        this.next();
      }, 2000);
    },

  }
}
</script>

<style scoped>
/* .carousel-wrapper {
  display: flex;
  justify-content: center;
} */

.carousel-inner {
  /* position: relative;
  overflow: hidden; */
  width: 200px;
  height: 200px;
}






/* .carousel-wrapper {
  overflow: hidden;
  width: 90%;
} */

/* .carousel-wrapper * {
  box-sizing: border-box;
} */

/* .carousel {
  transform-style: preserve-3d;
} */

/* .carousel-slide {
  opacity: 0;
  position: absolute;
  top:0;
  width: 100%;
  margin: auto;
  padding: 1rem 4rem;
  z-index: 100;
  transition: transform .5s, opacity .5s, z-index .5s;
} */

/* .carousel-slide.initial,
.carousel-slide.active {
  opacity: 1;
  position: relative;
  z-index: 900;
} */

/* .carousel-slide.prev,
.carousel-slide.next {
  z-index: 800;
} */
/* .carousel-slide.prev {
  transform: translateX(-100%); 
} */
/* .carousel-slide.next {
  transform: translateX(100%); 
} */

/* .carousel-btn-prev,
.carousel-btn-next {
  position: absolute;
  top:50%;
  width: 3rem;
  height: 3rem;
  background-color: #FFF;
  transform: translateY(-50%);
  border-radius: 50%;
  cursor: pointer; 
  z-index: 1001; 
  border: 1px solid black;
} */
/* .carousel-btn-prev {
  left:0;
} */
/* .carousel-btn-next {
  right:0;
} */
/* .carousel-btn-prev::after,
.carousel-btn-next::after {
  content: " ";
  position: absolute;
  width: 10px;
  height: 10px;
  top: 50%;
  left: 54%;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  transform: translate(-50%, -50%) rotate(135deg);
} */
/* .carousel-btn-next::after {
  left: 47%;
  transform: translate(-50%, -50%) rotate(-45deg);
} */
</style>