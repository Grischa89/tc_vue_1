<template>
  <div class="carousel">
    <ul class="carousel__list" ref="carouselList">

      <li v-for="i in 3"
        :key="i"
        class="carousel__item"
        :data-pos="dataPos[i-1]"
      >
        <div class="carousel__item__heading skeleton skeleton__heading"></div>

        <div class="skeleton skeleton__qrcode"></div>
        <!-- <qrcode-vue class="carousel__item__qrcode" :value="code.player_code" :size="size" level="H"/> -->

        <div class="carousel__item__code">
          <div class="skeleton skeleton__code"></div>
          <div class="skeleton skeleton__code"></div>
          <div class="skeleton skeleton__code"></div>
        </div>

      </li>

    </ul>
  </div>
</template>

<script>
export default {
  name: 'CardCarouselSkeleton',

  data() {
    return {
      size: 200,
      dataPos: [-1, 0, 1],
    }
  }

}
</script>

<style lang="scss" scoped>

.carousel {
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  // font-family: Arial;

  &__list {
    display: flex;
    list-style: none;
    position: relative;
    width: 100%;
    min-height: 31.25rem; // 500px
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
    font-size: 20px;
    width: 15.625rem; // 250px
    height: 25rem; // 400px
    border-radius: 12px;
    box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
    position: absolute;
    // transition: all .3s ease-in;
    background: #FFF;
    // cursor: pointer;
    
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

    &__code {
      display: flex;
    }

    // @media (min-width: 500px) { // 31.25rem
    //   &[data-pos="-2"],
    //   &[data-pos="2"] {
    //     opacity: 0.4;
    //     filter: blur(1px) grayscale(20%);
    //   }

    //   &[data-pos="-2"] {
    //     transform: translateX(-40%) scale(.8);
    //     z-index: 3;
    //   }
      
    //   &[data-pos="2"] {
    //     transform: translateX(40%) scale(.8);
    //     z-index: 3;
    //   }
    // }
    
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

    // @for $j from -100 through 100 {
    //   &[data-pos="#{$j}"] {
    //     @if $j < -2 or $j > 2 {opacity: 0; box-shadow: none; }
    //   }
    // }

  }

  .skeleton {
    opacity: .7;
    animation: skeleton-loading 1s linear infinite alternate;

    &__heading {
      height: 1.5rem;
      width: 50%;
      border-radius: .125rem;
    }

    &__qrcode {
      height: 200px;
      width: 200px;
      margin: 1.5rem auto;
    }

    &__code {
      height: .75rem;
      width: 2.125rem;
      margin: 0 .25rem;
    }

  }

  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 70%);
    }

    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }

}


// .carousel__item {
//   & div {
//     font-size: $mobile-subheading;
//     word-wrap: break-word;
//     line-height: 1.25rem;
//     margin-top: .75rem;
//     text-transform: uppercase;
//     max-width: 80%;
//   }

//   &__heading {
//     font-weight: 700;
//     letter-spacing: 0.05em;
//     margin-bottom: .75rem;
//   }

//   &__qrcode {
//     margin: 1.5rem auto;
//   }

//   &__code {
//     margin-bottom: .25rem;
//   }

//   .button {
//     margin-bottom: .75rem;
//   }

//   // TODO:
//   // Optional styling to hide copy buttons on all but [data-pos="0"]
//   // &:not([data-pos="0"]) {

//   //   .button {
//   //     display: none;
//   //   }
//   // }
// }
</style>