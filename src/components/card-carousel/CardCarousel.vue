<template>
  <div class="carousel">
    <h1 class="carousel__title"><span class="line-behind--card-title">QR Codes</span></h1>
    <ul class="carousel__list" ref="carouselList" @click="registerClick" @touchstart="captureTouchstart" @touchend="captureTouchend">

      <CardCarouselSlide
        class="carousel__item"
        v-for="(code, i) in codes"
        :key="i"
        :code="code"
        ref="carouselItems"
        :index="i"
        :data-pos="code.dataPos"
        :isCity="isCity" />

    </ul>

    <CardCarouselControls
      @prev="prevSlide"
      @next="nextSlide" />
  </div>
</template>

<script>
import CardCarouselSlide from './CardCarouselSlide.vue';
import CardCarouselControls from './CardCarouselControls.vue';

export default {
  name: 'CardCarousel',

  props: {
    codes: {
      type: Array,
      required: true,
    },

    isCity: {
      type: Boolean,
      required: false,
    }
  },

  components: {
    CardCarouselSlide,
    CardCarouselControls,
  },

  data() {
    return {
      carouselList: '',
      carouselItems: '',
      elems: '',
      arrLength: '',
      limit: '',
      newActive: '',
      clickedElem: '',
      touchRect: '',
      touchstartX: '',
      touchstartY: '',
      touchendX: '',
      touchendY: '',
    }
  },

  mounted() {
    const state = {};
    // Parent to list elements
    this.carouselList = this.$refs.carouselList;
    // List items, NodeList then Array
    this.carouselItems = document.querySelectorAll('.carousel__item');
    this.elems = Array.from(this.carouselItems);

    this.touchRect = this.carouselList;
  },

  methods: {

    captureTouchstart(e) {
      this.touchstartX = e.changedTouches[0].screenX;
      this.touchstartY = e.changedTouches[0].screenY;
    },

    captureTouchend(e) {
      this.touchendX = e.changedTouches[0].screenX;
      this.touchendY = e.changedTouches[0].screenY;

      this.handleSwipe(e);
    },

    handleSwipe() {
      // Thanks to peterver https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d?permalink_comment_id=2335244#gistcomment-2335244

      // Get width and height of carousel__list ul
      const { width, height } = this.touchRect.getBoundingClientRect();

      // Get horizontal and vertical ratios of touch gesture
      const ratioHorizontal = (this.touchendX - this.touchstartX) / width;
      const ratioVertical = (this.touchendY - this.touchstartY) / height;

      // If horizontal ratio of touch gesture is bigger than vertical and exceeds certain threshold (has certain length)
      if (ratioHorizontal > ratioVertical && ratioHorizontal > 0.15) {
        // Swipe right
        this.prevSlide();
      } else if (ratioHorizontal < ratioVertical && ratioHorizontal < -0.15) {
        // Swipe left
        this.nextSlide();
      } 
      // else {
      //   return false;
      // }
    },

    registerClick(event) {
      // Delegate newActive to alsways be closest li item (no matter where click happened)
      this.newActive = event.target.closest('.carousel__item');
      // console.log('this.newActive', this.newActive);

      // If click was outside of an li item OR on li item with pos value 0 (front)
      if (!this.newActive || this.newActive.classList.contains('carousel__item_active')) {
        // console.log('No item or item already in front!');
        return;
      };
      
      this.updatePos(this.newActive);
    },

    updatePos(newActive) {
      // console.log('newActive', newActive);
      // Get pos value of clicked item
      const newActivePos = newActive.dataset.pos;
      // console.log('newActivePos', newActivePos);

      if (!newActivePos) {
        // console.log('Has now data-pos set!');
        return;
      }

      // Get front element (data-pos="0") and remove active class
      const current = this.elems.find((elem) => elem.dataset.pos == 0);
      current.classList.remove('carousel__item_active');
    
      // Assign new pos values for each li item
      this.elems.forEach(item => {
        // Get current for each items pos value
        const itemPos = item.dataset.pos;

        // Assign new pos value with return value of getPos
        item.dataset.pos = this.getPos(itemPos, newActivePos);
      });
    },

    getPos(currentItemPos, activeItemPos) {
      // The pos value of the clicked item will determine the distance for other items
      // Clicked on pos value 2: 2 - 2 = 0
      const newPos = currentItemPos - activeItemPos;

      // const borderPos = (this.arrLength - 1) / 2;
      // Handle invalid pos values (> / < than last pos values @border)
      // If greater than positive border
      if (newPos > this.limit) {
        return newPos - this.arrLength;
      } 
      // If less than negative border
      else if (newPos < -this.limit) {
        return newPos + this.arrLength;
      }

      return newPos;
    },

    prevSlide() {
      // console.log('Previous button was clicked!');
      const prevSlide = this.elems.find((elem) => elem.dataset.pos == -1);

      this.updatePos(prevSlide);
    },

    nextSlide() {
      // console.log('Next button was clicked!');
      const nextSlide = this.elems.find((elem) => elem.dataset.pos == 1);

      this.updatePos(nextSlide);
    },
    
  },
}
</script>

<style lang="scss" scoped>

.carousel {
  margin: 2rem auto;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  background: hsla(0, 0%, 100%, 1);
  background: linear-gradient($primary-gradient);
  background: -webkit-linear-gradient($primary-gradient);
  background: -moz-linear-gradient($primary-gradient);

  &__title {
    // margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    // TODO: heading
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;

    .line-behind--card-title {
      box-shadow: $line-behind;
      padding: 0 .5rem;
    }
  }

  &__list {
    display: flex;
    list-style: none;
    position: relative;
    width: 100%;
    min-height: 26.5rem; //31.25rem; // 500px
    // height: 100%; // 300px
    align-items: center;
    justify-content: center;
    perspective: 300px;
  }
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: $mobile-subheading;
    width: 15.625rem; // 250px
    height: 25rem; // 400px
    border-radius: 12px;
    // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
    box-shadow: $card-shadow rgba($black, 0.2); 
    -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    -moz-box-shadow: $card-shadow rgba($black, 0.2);
    position: absolute;
    transition: all .1s ease-in;
    background: #FFF;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    
    &[data-pos="0"] {
      z-index: 5;
      cursor: default;
    }
    
    &[data-pos="-1"],
    &[data-pos="1"] {
      opacity: 0.7;
      filter: blur(1.2px) grayscale(20%);
    }
    
    &[data-pos="-1"] {
      transform: translateX(-20%) scale(.9);
      z-index: 4;
    }
    
    &[data-pos="1"] {
      transform: translateX(20%) scale(.9);
      z-index: 4;
    }

    @media (min-width: 500px) { // 31.25rem
      &[data-pos="-2"],
      &[data-pos="2"] {
        opacity: 0.4;
        filter: blur(1px) grayscale(20%);
      }

      &[data-pos="-2"] {
        transform: translateX(-40%) scale(.8);
        z-index: 3;
      }
      
      &[data-pos="2"] {
        transform: translateX(40%) scale(.8);
        z-index: 3;
      }
    }
    
    // only visible for @desktop
    // &[data-pos="-2"],
    // &[data-pos="2"] {
    //   opacity: 0.4;
    //   filter: blur(1px) grayscale(20%);
    // }
    
    // &[data-pos="-2"] {
    //   transform: translateX(-70%) scale(.8);
    //   z-index: 3;
    // }
    
    // &[data-pos="2"] {
    //   transform: translateX(70%) scale(.8);
    //   z-index: 3;
    // }

    @for $j from -100 through 100 {
      &[data-pos="#{$j}"] {
        @if $j < -2 or $j > 2 {opacity: 0; box-shadow: none; }
      }
    }

  }

}
</style>