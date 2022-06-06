<template>
  <div class="suggestions">
    <div class="suggestions__header">
      <h2 v-if="currentRouteName === 'City'" class="suggestions__header__title">Explore More Cities&nbsp;&mdash;</h2>
    </div>
    <div class="suggestions__grid">
      <div
        v-for="(city, i) in slicedSuggestions"
        :key="i"
        class="suggestions__grid__item">
          <router-link class="suggestions__grid__item__link" :to="`/${city.continent_slug}/${city.country_slug}/${city.city_slug}`">{{ city.city }}</router-link>
      </div>
    </div>
    <div v-if="currentRouteName === 'City'" class="suggestions__footer">
      <router-link class="suggestions__footer__link" :to="`/${countrySuggestion.continentSlug}/${countrySuggestion.countrySlug}`">
        Show Codes from  {{ countrySuggestion.name }}
      </router-link>
    </div>
    <!-- <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div> -->
  </div>
</template>

<script>
export default {
  name: 'CitySuggestions',

  props: {
    citySuggestions: {
      type: Array,
      required: true,
    }
  },

  computed: {
    slicedSuggestions() {
      // Don't suggest the city on whose route we currently are
      if (this.currentRouteName === 'City') {
        const citiesDifferentFromRoute = this.citySuggestions.filter(item => item.city_slug !== this.$route.params.city);
        const sortByCityRanking = citiesDifferentFromRoute.sort((a, b) => b.city_ranking - a.city_ranking);
        return sortByCityRanking.slice(0, 6);
      }
      // Sort citySuggestions array in descending order by city_ranking
      const sortByCityRanking = this.citySuggestions.sort((a, b) => b.city_ranking - a.city_ranking);
      return sortByCityRanking.slice(0, 6);
    },

    currentRouteName() {
      return this.$route.name;
    },

    countrySuggestion() {
      return { name: this.citySuggestions[0].country, countrySlug: this.citySuggestions[0].country_slug, continentSlug: this.citySuggestions[0].continent_slug }
    }
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

    @include tablet-landscape {
      width: 80%;
    }

    @include tablet-landscape {
      width: 60%;
    }

    &__title {
      font-size: $mobile-subheading;
      letter-spacing: .0625rem;
      box-shadow: $line-behind-light;
      -webkit-box-shadow: $line-behind-light; 
      -moz-box-shadow: $line-behind-light;
    }

  }

  &__footer {
    display: flex;
    justify-content: flex-start;
    margin-left: auto;
    margin-right: auto;
    width: 100%;

    @include tablet-landscape {
      width: 80%;
    }

    @include tablet-landscape {
      width: 60%;
    }

    &__link {
      display: flex;
      align-items: center;
      margin-top: 1.25rem;
      font-size: $mobile-body;
      font-weight: bold;
      text-decoration: underline;

      &::after {
        content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="show-country-codes"><title id="show-country-codes">Show Codes from Country</title><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>');
        display: block;
        height: 1rem;
        width: 1rem;
        margin-left: .25rem;
      }
    }
  }

  &__grid {
    display: grid;
    justify-items: stretch;
    gap: .5rem;
    height: 100%;
    width: 100%;
    grid-template-columns: repeat(6, 1fr);
    // grid-template-rows: repeat(2, 1fr);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1rem;

    @include tablet-landscape {
      width: 80%;
    }

    @include tablet-landscape {
      width: 60%;
    }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    padding: .25rem .75rem;
    border-radius:2rem;
    // border-radius: .75rem;
    grid-column: span 2;
    min-height: 3rem;
    word-break: break-all;
    word-wrap: break-word;

    // background: hsla(33, 91%, 62%, 1);
    // background: linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);
    // background: -webkit-linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);
    // background: -moz-linear-gradient(90deg, hsla(33, 91%, 62%, 1) 10%, hsla(33, 91%, 50%, 1) 80%);

    background-color: $primary;
    // box-shadow: 0 0 0 1px $in-between;
    border: solid $in-between 1px; 
    box-shadow: 2px 2px 5px rgba($black, 0.1); 
    -webkit-box-shadow: 2px 2px 5px rgba($black, 0.1); 
    -moz-box-shadow: 2px 2px 5px rgba($black, 0.1); 
    color: $black;
    font-weight: 600;
    font-size: $mobile-body;
    // text-transform: uppercase;
    

    &__link {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      overflow: hidden;

      &:hover {
        text-decoration: underline;
      }
    }
    
    // box-shadow: $card-shadow rgba($black, 0.2); 
    // -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    // -moz-box-shadow: $card-shadow rgba($black, 0.2);

    // @for $i from 0 to 6 {
    //   &:nth-child(#{$i}) {

    //   }
    // }
  }
}
}
</style>