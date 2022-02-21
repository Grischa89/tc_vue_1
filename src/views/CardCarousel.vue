<template>
  <div class="carousel">
  <ul class="carousel__list" ref="carouselList">
    <!-- <li class="carousel__item" data-pos="-3" ref="carouselItems">0</li>
    <li class="carousel__item" data-pos="-2" ref="carouselItems">1</li>
    <li class="carousel__item" data-pos="-1" ref="carouselItems">2</li>
    <li class="carousel__item" data-pos="0" ref="carouselItems">3</li>
    <li class="carousel__item" data-pos="1" ref="carouselItems">4</li>
    <li class="carousel__item" data-pos="2" ref="carouselItems">5</li>
    <li class="carousel__item" data-pos="3" ref="carouselItems">6</li> -->
    <li
      v-for="(card, i) in cards"
      :key="i"
      class="carousel__item"
      ref="carouselItems"
      :data-pos="card.dataPos"
      data-panda
      >
      {{ card.country }}
    </li>

  </ul>
</div>
</template>

<script>
export default {
  name: 'CardCarousel',

  data() {
    return {
      carouselList: '',
      carouselItems: '',
      elems: '',
      newActive: '',
      cards: [
        {
          trainercode: '111122223333',
          country: '1 Japan 1',
        },
        {
          trainercode: '111122223333',
          country: '2 B#r 2',
        },
        {
          trainercode: '111122223333',
          country: '3 Panda 3',
        },
        {
          trainercode: '111122223333',
          country: '4 Beagle 4',
        },
        {
          trainercode: '111122223333',
          country: '5 drrr 5',
        },
        {
          trainercode: '111122223333',
          country: '6 Grrrrrr 6',
        },
        {
          trainercode: '111122223333',
          country: '7 Ohana 7',
        },
        
      ]
    }
  },

  mounted() {
    const state = {};
    this.carouselList = this.$refs.carouselList;
    this.carouselItems = document.querySelectorAll('.carousel__item');
    this.elems = Array.from(this.carouselItems);

    const arrLength = this.cards.length;
    const splitValue = (arrLength - 1) / 2; // 3

    if (arrLength % 2 === 0) {
      this.cards = this.cards.slice(0, -1);
    }
    
    let i = 0
    let j = splitValue;

    while (i < arrLength) {

      if (i <= splitValue){
        this.cards[i].dataPos = i;
        i++;
      } else {
        this.cards[i].dataPos = -j;
        j--;
        i++;
      }

    }

    this.carouselList.addEventListener('click', (event) => {
      // NOTE: Warum ging 'function (event) {}' nicht?
      this.newActive = event.target;
      console.log(this.newActive);
      var isItem = this.newActive.closest('.carousel__item');
      console.log(isItem);

      if (!isItem || this.newActive.classList.contains('carousel__item_active')) {
        return;
      };
      
      this.update(this.newActive);
    });
  },

  methods: {
    update(newActive) {
      // console.log('newActive', newActive);
      const newActivePos = newActive.dataset.pos;
      console.log(newActive.dataset);

      const current = this.elems.find((elem) => elem.dataset.pos == 0);
      // const prev = this.elems.find((elem) => elem.dataset.pos == -1);
      // const next = this.elems.find((elem) => elem.dataset.pos == 1);
      // const first = this.elems.find((elem) => elem.dataset.pos == -2);
      // const last = this.elems.find((elem) => elem.dataset.pos == 2);
      // const first1 = this.elems.find((elem) => elem.dataset.pos == -3);
      // const last1 = this.elems.find((elem) => elem.dataset.pos == 3);
      
      // console.log('class', current.classList)
      
      current.classList.remove('carousel__item_active');
    
      this.elems.forEach(item => {
        var itemPos = item.dataset.pos;

        item.dataset.pos = this.getPos(itemPos, newActivePos)
      });
    },

    getPos(current, active) {
      const diff = current - active;

      if (diff > 3) {
        return diff - this.elems.length
      } else if (diff < -3) {
        return diff + this.elems.length
      }

      return diff;
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
    align-items: start;
    justify-content: start;
    color: #000;
    font-size: 20px;
    width: 150px;
    height: 250px;
    border-radius: 12px;
    box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.5);
    position: absolute;
    transition: all .3s ease-in;
    background: linear-gradient(45deg, #2D35EB 0%, #904ED4 100%);

    &:nth-child(2n) {
      background: linear-gradient(45deg, #2D35EB 0%, #fdbb2d 100%);
    }
    
    // &:nth-child(1) {
    //   background: linear-gradient(45deg, #2D35EB 0%, #904ED4 100%);
    // }
    // &:nth-child(2) {
    //   background: linear-gradient(45deg, #2D35EB 0%, #fdbb2d 100%);
    // }
    // &:nth-child(3) {
    //   background: linear-gradient(45deg, #2D35EB 0%, #22c1c3 100%);
    // }
    // &:nth-child(4) {
    //   background: linear-gradient(45deg, #fdbb2d 0%, #904ED4 100%);
    // }
    // &:nth-child(5) {
    //   background: linear-gradient(45deg, #22c1c3 0%, #904ED4 100%);
    // }
    
    &[data-pos="0"] {
      z-index: 5;
    }
    
    &[data-pos="-1"],
    &[data-pos="1"] {
      opacity: 0.7;
      filter: blur(1px) grayscale(10%);
    }
    
    &[data-pos="-1"] {
      transform: translateX(-40%) scale(.9);
      z-index: 4;
    }
    
    &[data-pos="1"] {
      transform: translateX(40%) scale(.9);
      z-index: 4;
      align-items: end;
      justify-content: end;
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
      align-items: end;
      justify-content: end;
    }

    // @for $j from -3 through 3 {
    //   &[data-pos="#{$j}"] {
    //     @if $j < -2 { transform: translateX(-90%) scale(.7); z-index: 2; opacity: .2; }
    //     @if $j > 2 { transform: translateX(90%) scale(.7); z-index: 2; opacity: .2; }
    //   }
    // }

    // &[data-pos="3"] {
    //   transform: translateX(90%) scale(.7);
    // }

    // @if [data-pos=""]

    // @function hide($i) {
    //   @if $i > 2 or $i < -2 { @return '90%' };
    // }

    // @for $i from -3 through 3 {
    //   &[data-pos="#{$i}"] { transform: translateX($i) scale(.7)}; 
    // }

    // @for $j from 1 through 5 {
    //   &[data-pos="$j"] {
    //     @if $j > 2 { transform: translateX(90%) }
    //   }
    // }


    
    // [data-pos=""] {
    // display: none;
    // }
    
    // &[data-pos="3"] {
    //  display: none;
    // }
  }

}
</style>