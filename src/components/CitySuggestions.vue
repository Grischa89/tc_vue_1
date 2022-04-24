<template>
  <div class="suggestions">
    <!-- {{ slicedSuggestions }} -->
    <div
      v-for="(city, i) in slicedSuggestions"
      :key="i"
      class="suggestions__item">
        <router-link :to="`/${city.continent_slug}/${city.country_slug}/${city.city_slug}`">{{ city.city }}</router-link>
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
      // required: true,
    }
  },

  computed: {
    slicedSuggestions() {
      if (this.citySuggestions) return this.citySuggestions.slice(0, 6);
    }
  }

}
</script>

<style lang="scss">
// $color-picker: $primary, $primary-darker, $in-between, $secondary-lighter;

.suggestions {
  display: grid;
  gap: .5rem;
  height: 100%;
  // width: 90%;
  margin: 1rem auto;
  padding: 2rem 1rem;
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
    padding: 1rem;
    border-radius:2rem;
    grid-column: span 2;
    word-break: break-word;
    // word-wrap: break-word;
    -webkit-line-clamp: 2;
    overflow: hidden;
    min-height: 4rem;
    background-color: $white;
    color: $secondary-lighter;
    font-weight: bold;
    line-height: 100%;
    text-transform: uppercase;
    box-shadow: 0 0 0 1px $primary-darker;

    &__link {
      

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
</style>