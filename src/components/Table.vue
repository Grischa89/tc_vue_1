<template>
  <div class="flex flex-col justify-around items-center">
    Hi, I'm going to be a table component!

    <!-- For small devices table has width of 11/12, from sm-breakpoint on has max-width of md (448px) -->
    <div class="flex flex-col mx-auto my-4 bg-white rounded-lg shadow border-b border-gray-300 w-10/12 sm:max-w-md">
      <!-- Alternative width proportions: w-10/12 sm:w-8/12 md:w-6/12 lg:max-w-md -->
      <h1 class="text-lg font-bold uppercase tracking-wider my-4">Continent</h1>
      <table class="table-fixed text-sm">
        <thead>
          <tr class="thead-row">
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase">Country</th>
            <th scope="col" class="w-2/5 py-2 px-4 text-left uppercase">Trainercode</th>
            <!-- <th scope="col" class="w-1/5 py-2 px-4 text-left">Copy!</th> -->
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr v-for="i in 3" :key="i" class="">
            <td class="py-4 px-4 text-left">
                Germany
            </td>
            <td class="py-4 px-4">
              <div class="flex justify-between items-center">
                <div class="mr-4">111122223333</div>
                <div class="h-5 w-5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Table',

}
</script>

<style scoped>

  tr:nth-of-type(odd) {
    background: rgb(209, 213, 219);
  }
  thead .thead-row {
    background: white;
  }
  
</style>