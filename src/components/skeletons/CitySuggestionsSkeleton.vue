<template>
  <div class="suggestions">
   <h2 v-if="currentRouteName === 'City'" class="skeleton skeleton__heading" :class="{ loading: loading }"></h2>
    <div class="suggestions__main">
      <div class="skeleton__nav">
        <div
        v-for="i in 3"
        :key="i"
        class="skeleton skeleton__nav__pill" :class="{ loading: loading }">
      </div>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'CitySuggestionsSkeleton',

  data() {
    return {
      loading: true,
    }
  },

  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },

}
</script>

<style lang="scss" scoped>
.loading {
  animation: skeleton-loading .9s linear infinite alternate;
}

.skeleton {
  opacity: .7;
  // animation: skeleton-loading 1s linear infinite alternate;
  border-radius: .125rem;
  box-shadow: $card-shadow rgba($black, 0.2); 
  -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
  -moz-box-shadow: $card-shadow rgba($black, 0.2);

  &__heading {
    height: 1.5rem;
    width: 30%;
    border-radius: .125rem;
    max-width: 60ch;
    margin-bottom: 1rem;
  }

  &__table__head {
    height: 1rem;
    width: 65%;
    // padding: auto 1rem;
  }

  &__table__data {
    height: .75rem;
    width: 80%;
  }

  &__code {
    height: .75rem;
    width: 25%;
    margin: 0 .25rem;
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: .5rem;

    &__pill {
      height: 2.5rem;
      width: 32%;
      border-radius: 1.5rem;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }

  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

// @keyframes skeleton-loading-fade {
//   0% {
//     background-color: hsl(200, 20%, 95%);
//     opacity: .5;
//   }

//   100% {
//     background-color: hsl(200, 20%, 100%);
//     opacity: .5;
//   }
// }
</style>