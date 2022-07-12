<template>
  <div class="breadcrumb">
    <router-link class="breadcrumb__link" :to="{ name: 'Continent', params: { continent: breadcrumb.continentSlug } }">
      {{ breadcrumb.continentName }}
    </router-link>
    &nbsp;&#47;&nbsp;

    <template v-if="breadcrumb && breadcrumb.countryName">
      <router-link class="breadcrumb__link" :to="{ name: 'Country', params: { continent: breadcrumb.continentSlug, country: breadcrumb.countrySlug } }">
        {{ breadcrumb.countryName }}
      </router-link>
      &nbsp;&#47;&nbsp;
    </template>

    <!-- <template v-if="breadcrumb && breadcrumb.cityName">
      &nbsp;/&nbsp;
      
      <router-link class="breadcrumb__link" :to="`/${breadcrumb.continentSlug}/${breadcrumb.countrySlug}`">
        {{ breadcrumb.countryName }}
      </router-link>
    </template> -->
  </div>
</template>

<script>
export default {

  name: 'Breadcrumb',

  props: {
    breadcrumb: {
      type: Object,
      required: true,
    },
  },

}
</script>

<style lang="scss">
.breadcrumb {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  max-width: 70ch;
  margin-left: auto;
    margin-right: auto;

  // @include tablet-landscape {
  //   margin-left: auto;
  //   margin-right: auto;
  // }

  &__link {
    font-size: $mobile-body;
    font-weight: 600;
    
    &:hover, &:active, &:focus {
      text-decoration: underline;
      -webkit-tap-highlight-color: $primary;
    }
  }
}
</style>