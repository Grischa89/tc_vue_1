<template>
  <!-- Container should not have height, since expanded menu will not be cover in bg-color ov nav-container 
  EDIT: From lg-breakpoint on container will have height of 12 in order to optically not expand when the dropdown gets expanded-->
  <div class="flex flex-wrap sticky top-0 z-50 items-center justify-center lg:h-12 py-2 px-4 mb-3 border-b border-gray-300 shadow-sm bg-white">

    <!-- flex-wrap: Wraps the (hidden) menu list items on next line when menu gets expanded
    lg:relative: From lg-breakpoint on this div gets position: relative in order to position an absolute element in it -->
    <div class="lg:relative flex items-center flex-wrap w-full justify-between">

      <!-- From lg-breakpoint on this div gets positioned absolute with top: 0.125rem and left: 0px
      in order for it to stay at that position even when the ropdown gets expanded (and expands the whole navbar with it)  -->
      <div class="w-1/2 lg:w-auto lg:absolute lg:top-0.5 lg:left-0">
        <div class="flex items-center">
          <router-link to="/" class="flex text-lg font-bold mr-4 whitespace-nowrap">
            trainercodes
          </router-link>
        </div>
      </div>

      <div class="flex items-center justify-end w-1/2">

        <!-- Either menu button or X will not be schown when breakpoint is > lg (lg:hidden) -->
        <!-- Show Menu button, when menu is NOT expanded -->
        <template v-if="!showMenu">
          <button class="text-gray-800 cursor-pointer text-lg leading-none block lg:hidden outline-none focus:outline-none" type="button" @click="toggleNavbar()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </template>

        <!-- Show X button, when menu IS expanded -->
        <template v-else>
          <button class="text-gray-800 cursor-pointer text-lg leading-none block lg:hidden outline-none focus:outline-none" type="button" @click="toggleNavbar()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </template>

      </div>

      <!-- Initially showMenu is false, so the hidden class gets attached to next div,
      but when breakpoint is > lg flex is applied and menu items get shown in a row on right side of navbar.
      When breakpoint is < lg the menu button with toggleNavbar method is shown.
      toggleNavbar will set showMenu to true and set flex class also for lower breakpoints. -->
      <div :class="{'hidden': !showMenu, 'flex': showMenu}" class="lg:flex lg:flex-grow items-center">

        <ul class="flex flex-col lg:flex-row list-none ml-auto">
          <li>
            <router-link to="/" class="py-2 pr-3 flex items-start text-md font-bold text-gray-800" @click="toggleNavbar()">Hello</router-link>
          </li>

          <li>
            <router-link to="/" class="py-2 pr-3 flex items-start text-md font-bold text-gray-800" @click="toggleNavbar()">Great</router-link>
          </li>

          <li>
            <!-- Hidden (display: none;) checkbox element that registers the click through which the dropdown list gets expanded -->
            <input type="checkbox" id="dropdown" name="dropdown" class="hidden">
            <label for="dropdown" class="py-2 pr-3 flex items-start items-center text-md font-bold text-gray-800 cursor-pointer">
              <span class="mr-1">Continents</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>

            <!-- Click on dropdown link closes dropdown and navbar when expanded -->
            <ul v-if="continentNames" class="dropdown hidden text-sm bg-white border border-gray-300 shadow-sm z-55 rounded" @click="closeDropdown()">
              <!-- Hardcoded slugs and nav item names -->
              <!-- <li><router-link to="/africa" class="py-1 ml-3 flex items-start text-md">Africa</router-link></li>
              <li><router-link to="/asia" class="py-1 ml-3 flex items-start text-md">Asia</router-link></li>
              <li><router-link to="/europe" class="py-1 ml-3 flex items-start text-md">Europe</router-link></li>
              <li><router-link to="/north-america" class="py-1 ml-3 flex items-start text-md">North America</router-link></li>
              <li><router-link to="/oceania" class="py-1 ml-3 flex items-start text-md">Oceania</router-link></li>
              <li><router-link to="/south-america" class="py-1 ml-3 flex items-start text-md">South America</router-link></li> -->

              <!-- Dynamially create list items and add slugs and names from mapGetters array of objects - continentNames (nav.js module) -->
              <li v-for="(continent, i) in continentNames" :key="i"><router-link :to="`/${continent.slug}`" class="py-1 ml-3 flex items-start text-md">{{ continent.name }}</router-link></li>
            </ul>

          </li>

          <li>
            <router-link to="/" class="py-2 pr-3 flex items-start text-md font-bold text-gray-800" @click="toggleNavbar()">Thanks</router-link>
          </li>
        </ul>

      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Nav',

  data() {
    return {
      showMenu: false,
    }
  },

  methods: {
    toggleNavbar() {
      this.showMenu = !this.showMenu;
    },

    closeDropdown() {
      document.getElementById('dropdown').checked = false;
      this.toggleNavbar();
    }
  },

  computed: {
    ...mapGetters({
      continentNames: 'continentNames',
    })
  },

}
</script>

<style>
  /* When hidden input[type=checkbox] gets checked, the ul with .dropdown
  gets attached the display block property and is therfor visible. */
  input:checked~ul.dropdown {
    display: block;
  }
</style>