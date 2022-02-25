<template>
  <div class="flex flex-col justify-around items-center">

    <h1 v-if="title" class="text-lg font-bold uppercase tracking-wider my-2">{{ title }}</h1>
    <h1 v-else class="text-lg font-bold uppercase tracking-wider my-2">Default title</h1>

    <!-- For small devices table has width of 11/12, from sm-breakpoint on has max-width of md (448px) -->
    <div class="flex flex-col mx-auto my-2 py-1 bg-white rounded shadow border-b border-gray-300 w-10/12 sm:max-w-md">
      <!-- Alternative width proportions: w-10/12 sm:w-8/12 md:w-6/12 lg:max-w-md -->
      
      <table class="table-fixed text-sm">
        <thead class="border-b border-gray-300">
          <tr class="thead-row">
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase">Country</th>
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase">Trainercode</th>
            <!-- <th scope="col" class="w-1/5 py-2 px-4 text-left">Copy!</th> -->
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr v-for="(code, i) in codes" :key="i" class="">
            <td class="py-4 px-4 text-left font-bold">
                <router-link :to="`/${code.continent_slug}/${code.country_slug}`">{{ code.country }}</router-link>
                <!-- <router-link :to="{ name: country, params: { continent: code.continent_slug, country: country_slug } }">{{ code.country }}</router-link> -->
            </td>
            <td class="py-4 px-4"
              :data-code="code.player_code"
              @click="copyCodeToClipboard($event)">

              <div class="flex justify-between items-center">
                <div class="mr-4 copy-code cursor-pointer"
                  id="code-playercode"
                  >{{ code.player_code }}</div>

                <CopyButton />
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import CopyButton from './copy-button/CopyButton.vue';

export default {
  name: 'Table',

  components: {
    CopyButton,
  },

  // Maybe list props as object, props: { latestCodes: { type: Array, required: true } }
  props: {
    codes: {
      type: Array,
      // required: true,
    },

    title: {
      type: String,
      // required: true,
    },
  },

  methods: {
    
    copyCodeToClipboard(e) {
      this.$store.dispatch('copyCodeToClipboard', e.currentTarget.dataset.code);
    },

  },
 
}
</script>

<style scoped>

  /* tr:nth-of-type(odd) {
    //background: rgb(209, 213, 219);
    //background: rgb(255, 227, 192);
    // background: #fed7aa;
  } */
  thead .thead-row {
    background: white;
  }
  
</style>