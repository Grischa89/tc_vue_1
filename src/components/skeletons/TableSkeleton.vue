<template>
  <div class="flex flex-col justify-around items-center">

    
    <h1 class="text-lg font-bold uppercase tracking-wider my-2 skeleton skeleton__heading" :class="{ loading: loading }"></h1>

    <!-- For small devices table has width of 11/12, from sm-breakpoint on has max-width of md (448px) -->
    <div class="flex flex-col mx-auto my-2 py-1 bg-white rounded shadow border-b border-gray-300 w-10/12 sm:max-w-md">
      <!-- Alternative width proportions: w-10/12 sm:w-8/12 md:w-6/12 lg:max-w-md -->
      
      <table class="table-fixed text-sm">
        <thead class="border-b border-gray-300">
          <tr class="thead-row">
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase ">
              <div class="skeleton skeleton__table__head" :class="{ loading: loading }"></div>
            </th>
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase">
              <div class="skeleton skeleton__table__head" :class="{ loading: loading }"></div>
            </th>
            <!-- <th scope="col" class="w-1/5 py-2 px-4 text-left">Copy!</th> -->
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr v-for="i in 3" :key="i">
            <td class="py-4 px-4 text-left font-bold">
                <div class="skeleton skeleton__table__data" :class="{ loading: loading }"></div>
                <!-- <router-link :to="{ name: country, params: { continent: code.continent_slug, country: country_slug } }">{{ code.country }}</router-link> -->
            </td>
            <td class="py-4 px-4 flex">
              <div class="skeleton skeleton__code" :class="{ loading: loading }"></div>
              <div class="skeleton skeleton__code" :class="{ loading: loading }"></div>
              <div class="skeleton skeleton__code" :class="{ loading: loading }"></div>
              <!-- <div class="flex justify-between items-center"> -->
                <!-- <div class="mr-4 copy-code cursor-pointer whitespace-nowrap"
                  id="code-playercode"
                  ></div> -->

                <!-- <CopyButton /> -->
              <!-- </div> -->

            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TableSkeleton',

  data() {
    return {
      loading: true,
    }
  },

}
</script>

<style lang="scss">
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
    width: 40%;
    border-radius: .125rem;

    @media(min-width: 512px) {
      max-width: 12.5rem;
    }
  }

  &__table__head {
    height: 1rem;
    width: 90%;
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

  // &__text {
  //   width: 100%;
  //   height: .5rem;
  //   margin-bottom: .25rem;
  //   border-radius: .125rem;

  //   &:last-child {
  //     margin-bottom: 0;
  //     width: 80%;
  //   }
  // }
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }

  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
</style>