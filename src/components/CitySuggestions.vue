<template>
  <div class="suggestions">
    <!-- <h2 class="suggestions__title">Popular Cities</h2> -->
    <div class="suggestions__grid">
      <div
        v-for="(city, i) in slicedSuggestions"
        :key="i"
        class="suggestions__grid__item">
          <router-link class="suggestions__grid__item__link" :to="`/${city.continent_slug}/${city.country_slug}/${city.city_slug}`">{{ city.city }}</router-link>
      </div>
    </div>
    <!-- <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div>
    <div class="suggestions__item">City</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
      if (this.citySuggestions) {
        // Sort citySuggestions array in descending order by city_ranking
        const sortByCityRanking = this.citySuggestions.sort((a, b) => b.city_ranking - a.city_ranking);
        return sortByCityRanking.slice(0, 6);
      }
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
  width: 90%;
  margin: 1rem auto;

  // &__title {

  // }

  &__grid {
    display: grid;
    gap: .5rem;
    height: 100%;
    margin: .5rem auto;
    // padding: 2rem 1rem;
    grid-template-columns: repeat(6, 1fr);
    background: hsla(0, 0%, 100%, 1);
    // background: linear-gradient($primary-gradient);
    // background: -webkit-linear-gradient($primary-gradient);
    // background: -moz-linear-gradient($primary-gradient);

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    padding: .25rem .5rem;
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