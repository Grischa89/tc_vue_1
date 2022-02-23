<template>
  <div class="carousel">
    <ul class="carousel__list" ref="carouselList" @click="registerClick">

      <CardCarouselSlide
        class="carousel__item"
        v-for="(code, i) in unevenCodes"
        :key="i"
        :code="code"
        ref="carouselItems"
        :index="i"
        :data-pos="code.dataPos" />

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
    }
  },

  computed: {
    unevenCodes() {
      // Check if codes array needs to be altered
      if (this.codes.length % 2 === 0) {
        console.log('This array\'s length is an even number!')
        return this.codes.slice(0, -1);
      } else {
        return this.codes;
      }
    }
  },

  mounted() {
    const state = {};
    // Parent to list elements
    this.carouselList = this.$refs.carouselList;
    // List items, NodeList then Array
    this.carouselItems = document.querySelectorAll('.carousel__item');
    this.elems = Array.from(this.carouselItems);

    // Use unevenCodes length in case codes prop had even length
    this.arrLength = this.unevenCodes.length;

    // Set middle value value of array length
    this.limit = (this.arrLength - 1) / 2;
    
    // Set iterators
    let i = 0
    let j = this.limit;

    // NOTE: This is a solution for arrays with uneven array length (handled in computed)
    // For even arrays j must be adjusted (++/--) before assigning pos value i
    // Range of carousel is chosen to be from -limit to +limit
    // No second iterator (j) needed if pos value should be positive integers only
    while (i < this.arrLength) {

      // Assign positive positional values to elements until limit
      if (i <= this.limit){
        this.unevenCodes[i].dataPos = i;
        i++;
      } else {
        // Assign negative positional values
        // For array elements with index greater than limit
        this.unevenCodes[i].dataPos = -j;
        j--;
        i++;
      }

    }
  },

  methods: {

    registerClick(event) {
      // Handle click anywhere li (also child elements)
      // Get clicked element's tag name for switch case
      this.clickedElem = event.target.tagName.toLowerCase();

      // If click happened on other element than li
      // Set newActive to the event.target.parentElement (li)
      // Since data-pos is attached on li
      switch (this.clickedElem) {
        case 'canvas':
          this.newActive = event.target.parentElement;
          break;
        case 'p':
          this.newActive = event.target.parentElement;
          break;
        default:
          // Clicked element was li
          this.newActive = event.target;
          break;
      }

      // Make sure the clicked element was an 'item' and not outside
      const isItem = this.newActive.closest('.carousel__item');

      // If click was outside of an li item OR on li item with pos value 0 (front)
      if (!isItem || this.newActive.classList.contains('carousel__item_active')) {
        console.log('No item or item already in front!');
        return;
      };
      
      this.updatePos(this.newActive);
    },

    updatePos(newActive) {
      console.log('newActive', newActive);
      // Get pos value of clicked item
      const newActivePos = newActive.dataset.pos;
      console.log('newActivePos', newActivePos);

      if (!newActivePos) {
        console.log('Has now data-pos set!');
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
      console.log('Previous button was clicked!');
      const prevSlide = this.elems.find((elem) => elem.dataset.pos == -1);

      this.updatePos(prevSlide);
    },

    nextSlide() {
      console.log('Next button was clicked!');
      const nextSlide = this.elems.find((elem) => elem.dataset.pos == 1);

      this.updatePos(nextSlide);
    },
    
  },
}
</script>

<style lang="scss" scoped>

html,
body {
  padding: 0;
  margin: 0;
}

html {
  height: 100vh;
}

body {
  height: 100vh;
}

.carousel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  font-family: Arial;

  &__list {
    display: flex;
    list-style: none;
    position: relative;
    width: 100%;
    height: 300px;
    justify-content: center;
    perspective: 300px;
  }
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
    width: 150px;
    height: 250px;
    border-radius: 12px;
    box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.5);
    position: absolute;
    transition: all .3s ease-in;
    background: #FFF;
    cursor: pointer;
    
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
      transform: translateX(-35%) scale(.9);
      z-index: 4;
    }
    
    &[data-pos="1"] {
      transform: translateX(35%) scale(.9);
      z-index: 4;
    }
    
    &[data-pos="-2"],
    &[data-pos="2"] {
      opacity: 0.4;
      filter: blur(1px) grayscale(20%);
    }
    
    &[data-pos="-2"] {
      transform: translateX(-70%) scale(.8);
      z-index: 3;
    }
    
    &[data-pos="2"] {
      transform: translateX(70%) scale(.8);
      z-index: 3;
    }

    @for $j from -100 through 100 {
      &[data-pos="#{$j}"] {
        @if $j < -2 or $j > 2 {opacity: 0; box-shadow: none; }
      }
    }

  }

}
</style>