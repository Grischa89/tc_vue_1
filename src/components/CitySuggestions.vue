<template>
  <div class="suggestions">
    <div v-if="currentRouteName === 'City'" class="suggestions__header">
      <h2 class="suggestions__header__title">Explore More Cities&nbsp;&mdash;</h2>
    </div>
    <div class="suggestions__main">
        <div class="suggestions__main__nav" @scroll="handleScroll">
          <!-- @scroll="handleScroll"> -->
          <div
            v-for="(city, i) in suggestions"
            :key="i"
            class="suggestions__main__nav__pill">
              <router-link class="suggestions__main__nav__pill__link" :to="{ name: 'City', params: { continent: city.continent_slug, country: city.country_slug, city: city.city_slug } }">{{ city.city }}</router-link>
          </div>
          <div class="suggestions__main__nav__indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="suggestions__main__nav__indicator__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div :class="{ 'suggestions__main__indicator suggestions__main__indicator--right': !scrollEnd }">
          <svg v-if="!scrollEnd" @click="scrollNav" xmlns="http://www.w3.org/2000/svg" class="suggestions__main__indicator__icon suggestions__main__indicator__icon--right" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-direction="next">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div :class="{ 'suggestions__main__indicator suggestions__main__indicator--left': !scrollStart }">
          <svg v-if="!scrollStart" @click="scrollNav" xmlns="http://www.w3.org/2000/svg" class="suggestions__main__indicator__icon suggestions__main__indicator__icon--left" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-direction="prev">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
    </div>
    <div v-if="currentRouteName === 'City' && countrySuggestion" class="suggestions__footer">
      <router-link class="suggestions__footer__link" :to="{ name: 'Country', params: { continent: countrySuggestion.continentSlug, country: countrySuggestion.countrySlug } }">
        <span class="suggestions__footer__link__text">Show all Codes from  {{ countrySuggestion.name }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="suggestions__footer__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="show-country-codes"><title id="show-country-codes">Show Codes from Country</title><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CitySuggestions',

  data() {
    return {
      scrollStart: true,
      scrollEnd: false,
      scrollStep: 50,
      scrollWidth: 0,
      clientWidth: 0,
      scrollX: 0,
      isMobile: null,
      suggestionsNav: null,
    }
  },

  created() {
    this.$store.dispatch('fetchCountryForCitySuggestions', { continent: this.$route.params.continent, country: this.$route.params.country } );
  },

  updated() {
    const suggestionsNav = document.querySelector('.suggestions__main__nav');
    this.scrollEnd = suggestionsNav.clientWidth === suggestionsNav.scrollWidth ? true : false;
  },

  computed: {
    ...mapGetters({
      citySuggestions: 'citySuggestions'
    }),

    suggestions() {
      if (this.citySuggestions) {
        // Don't suggest the city on whose route we currently are
        if (this.currentRouteName === 'City') {
          const citiesDifferentFromRoute = this.citySuggestions.filter(item => item.city_slug !== this.$route.params.city);
          const sortByCityRanking = citiesDifferentFromRoute.sort((a, b) => b.city_ranking - a.city_ranking);
          return sortByCityRanking.slice(0, 6);
        }

        // Sort citySuggestions array in descending order by city_ranking
        const sortByCityRanking = this.citySuggestions.sort((a, b) => b.city_ranking - a.city_ranking);
        // return sortByCityRanking.slice(0, 6);
        return sortByCityRanking;
      }
      return []
    },

    currentRouteName() {
      return this.$route.name;
    },

    countrySuggestion() {
      if (this.citySuggestions) return { name: this.citySuggestions[0].country, countrySlug: this.citySuggestions[0].country_slug, continentSlug: this.citySuggestions[0].continent_slug }
    },
  },

  methods: {
    handleScroll() {
      const suggestionsNav = document.querySelector('.suggestions__main__nav');
      const scrollX = suggestionsNav.scrollLeft;
      const scrollWidth = suggestionsNav.scrollWidth;
      const clientWidth = suggestionsNav.clientWidth;

      this.scrollStart = scrollX < 50 ? true : false;
      this.scrollEnd = Math.floor(scrollX) === Math.floor(scrollWidth - clientWidth) ? true : false;
    },

    scrollNav(e) {
      const suggestionsNav = document.querySelector('.suggestions__main__nav');
      const scrollWidth = suggestionsNav.scrollWidth;
      const clientWidth = suggestionsNav.clientWidth;
      // Scroll 70% of clientWidth
      const scrollStep = clientWidth * .7;
      const direction = e.currentTarget.dataset.direction;

      // TODO: Fix scrollLeft /scrollWidth 'leftover' problem - How to choose scrollStep width so that there willl be no leftover at the end that is too small?
      suggestionsNav.scrollLeft = direction === 'next' ? suggestionsNav.scrollLeft += scrollStep : suggestionsNav.scrollLeft -= scrollStep;
    },
  }

}
</script>

<style lang="scss">
.suggestions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 1rem auto;

  &__header {
    display: flex;
    justify-content: flex-start;
    margin: 1.25rem auto;
    padding: 0 .25rem;
    width: 100%;
    max-width: 70ch;

    &__title {
      font-size: $mobile-subheading;
      letter-spacing: .0625rem;
      box-shadow: inset 0 -.625rem 0 0 var(--textBackdropLight);
    }

  }

  &__footer {
    display: flex;
    justify-content: flex-start;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 70ch;

    &__link {
      display: flex;
      align-items: center;
      margin-top: 1.25rem;
      font-size: $mobile-body;
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }

      // &__text {
      // }

      &__append {
        display: block;
        height: 1rem;
        width: 1rem;
        margin-left: .25rem;
      }
    }
  }

&__main {
    width: 100%;
    max-width: 70ch;
    margin-left: auto;
    margin-right: auto;
    position: relative;

    &__indicator {
      display: none;
    }

    @include tablet {
      &__indicator {
        display: flex;
        align-items: center;
        position: absolute;
        // z-index: 5;
        top: 0;
        bottom: 0;
        // background-image: linear-gradient(to right, rgba(255,255,255,0), var(--surface1) 95%);
        width: 15%;

        &--right {
          right: 0;
          background-image: linear-gradient(to right, rgba(255,255,255,0), var(--surface1) 75%);
        }

        &--left {
          left: 0;
          background-image: linear-gradient(to left, rgba(255,255,255,0), var(--surface1) 75%);
        }

        &__icon {
          position: absolute;
          height: 1rem;
          width: 1rem;
          align-self: center;
          // z-index: 2;
          cursor: pointer;

          &--right {
            right: 0;
          }

          &--left {
            left: 0;
          }
        }
      }
    }

    &__nav {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    // flex-wrap: nowrap;
    white-space: nowrap;
    position: relative;
    padding-bottom: .5rem;

    @include tablet {
      padding-bottom: 0;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__pill {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: left;
        // padding: .25rem .75rem;
        margin-top: .5rem;
        margin-bottom: .5rem;
        margin-right: .5rem;
        border-radius:2rem;
        min-height: 3rem;
        min-width: 15ch;
        word-break: break-all;
        word-wrap: break-word;
        background-color: var(--primary);
        border: .0625rem solid var(--primary2); 
        box-shadow: 2px 2px 5px rgba($black, 0.1); 
        -webkit-box-shadow: 2px 2px 5px rgba($black, 0.1); 
        -moz-box-shadow: 2px 2px 5px rgba($black, 0.1); 
        color: var(--text);
        font-weight: 600;
        font-size: $mobile-body;

        &:last-of-type {
            margin-right: 0;
        }

        &__link {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;  
            // overflow: hidden;

            &:hover {
                text-decoration: underline;
            }
        }
    }
  }
}

//   &__grid {
//     display: grid;
//     justify-items: stretch;
//     gap: .5rem;
//     height: 100%;
//     width: 100%;
//     max-width: 70ch;
//     grid-template-columns: repeat(6, 1fr);
//     // grid-template-rows: repeat(2, 1fr);
//     margin-left: auto;
//     margin-right: auto;
//     // margin-bottom: 1rem;

//     // @include tablet-landscape {
//     //   width: 80%;
//     // }

//     // @include tablet-landscape {
//     //   width: 60%;
//     // }

//   &__item {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     text-align: left;
//     padding: .25rem .75rem;
//     border-radius:2rem;
//     // border-radius: .75rem;
//     grid-column: span 2;
//     min-height: 3rem;
//     word-break: break-all;
//     word-wrap: break-word;

//     // background: hsla(33, 91%, 62%, 1);
//     // background: linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);
//     // background: -webkit-linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);
//     // background: -moz-linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);

//     background-color: var(--primary);
//     // box-shadow: 0 0 0 1px $in-between;
//     border: .0625rem solid var(--primary2); 
//     box-shadow: 2px 2px 5px rgba($black, 0.1); 
//     -webkit-box-shadow: 2px 2px 5px rgba($black, 0.1); 
//     -moz-box-shadow: 2px 2px 5px rgba($black, 0.1); 
//     color: var(--text);
//     font-weight: 600;
//     font-size: $mobile-body;
//     // text-transform: uppercase;
    

//     &__link {
//       display: -webkit-box;
//       -webkit-line-clamp: 1;
//       -webkit-box-orient: vertical;  
//       overflow: hidden;

//       &:hover {
//         text-decoration: underline;
//       }
//     }
    
    // box-shadow: $card-shadow rgba($black, 0.2); 
    // -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    // -moz-box-shadow: $card-shadow rgba($black, 0.2);

    // @for $i from 0 to 6 {
    //   &:nth-child(#{$i}) {

    //   }
    // }
//   }
// }
}
</style>