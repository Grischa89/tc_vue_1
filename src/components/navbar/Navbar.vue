<template>
  <!-- Container should not have height, since expanded menu will not be cover in bg-color ov nav-container 
  EDIT: From lg-breakpoint on container will have height of 12 in order to optically not expand when the dropdown gets expanded-->
  <!-- transition ease-in-out duration-300 -->
  <div class="navbar-wrapper"
    :class="{'navbar-wrapper--scrolled': !atTop }">
    <!-- NOTE: Binding multiple classes to single variable with ternary operator would work as well:
    :class="!atTop ? ['bg-white', 'border-b', 'border-gray-300', 'shadow-sm'] : []"> -->

    <!-- flex-wrap: Wraps the (hidden) menu list items on next line when menu gets expanded
    lg:relative: From lg-breakpoint on this div gets position: relative in order to position an absolute element in it -->
    <div class="navbar">

      <!-- From lg-breakpoint on this div gets positioned absolute with top: 0.125rem and left: 0px
      in order for it to stay at that position even when the ropdown gets expanded (and expands the whole navbar with it)  -->
      <div class="navbar__logo">
          <router-link to="/" class="navbar__logo__link">
            trainercodes
          </router-link>
      </div>

      <div class="navbar__toggle-menu">

        <!-- Either menu button or X will not be schown when breakpoint is > lg (lg:hidden) -->
        <!-- Show Menu button, when menu is NOT expanded -->
        <template v-if="!showMenu">
          <button class="navbar__toggle-menu__btn" type="button" @click="toggleNavbar" data-toggle-menu>
            <svg xmlns="http://www.w3.org/2000/svg" class="navbar__toggle-menu__btn__size" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </template>

        <!-- Show X button, when menu IS expanded -->
        <template v-else>
          <button class="navbar__toggle-menu__btn" type="button" @click="toggleNavbar" data-toggle-menu>
            <svg xmlns="http://www.w3.org/2000/svg" class="navbar__toggle-menu__btn__size" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </template>

      </div>

      <!-- Initially showMenu is false, so the hidden class gets attached to next div,
      but when breakpoint is > lg flex is applied and menu items get shown in a row on right side of navbar.
      When breakpoint is < lg the menu button with toggleNavbar method is shown.
      toggleNavbar will set showMenu to true and set flex class also for lower breakpoints. -->
      <div :class="{'navbar__menu-wrapper--hide': !showMenu }" class="navbar__menu-wrapper">
        <ul class="navbar__menu">
          <li class="navbar__menu__item">
            <NavbarDropdownMenu
              ref="dropdownContinents"
              v-if="continentNames"
              @close-dropdown-menu="closeDropdown"
              :dropdownItems="continentNames" />
          </li>

          <li class="navbar__menu__item">
            <router-link :to="{ name: 'AddCode' }" class="navbar__menu__item__link" @click="toggleNavbar" data-toggle-menu>Add Your Code</router-link>
          </li>

          <template v-if="!isAuthenticated">
            <li class="navbar__menu__item">
              <router-link :to="{ name: 'LogIn' }" class="navbar__menu__item__link" @click="toggleNavbar" data-toggle-menu>Login</router-link>
            </li>
            <li class="navbar__menu__item">
              <router-link :to="{ name: 'SignUp' }" class="navbar__menu__item__link" @click="toggleNavbar" data-toggle-menu>Signup</router-link>
            </li>
          </template>

          <template v-if="isAuthenticated">
            <li class="navbar__menu__item">
              <router-link :to="{ name: 'ProfileOverview' }" class="navbar__menu__item__link" @click="toggleNavbar" data-toggle-menu>Profile</router-link>
            </li>

            <li class="navbar__menu__item">
              <button class="navbar__menu__item__link" @click="logout" data-toggle-menu>Logout</button>
            </li>
          </template>
        </ul>

      </div>

    </div>
  </div>
</template>

<script>
import NavbarDropdownMenu from './NavbarDropdownMenu.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',

  components: {
    NavbarDropdownMenu,
  },

  props: {
    isAuthenticated: {
      type: Boolean,
      // required: true,
    },
  },

  data() {
    return {
      showMenu: false,
      atTop: true,
    }
  },

  beforeMount() { 
    // Add onscroll listener to window
    // onsroll execute detectScroll method
    window.onscroll = this.detectScroll;
  },

  methods: {
    // Depending on value of atTop on the navbar a class will be toggled
    detectScroll() {
      // Check wether user scrolled in Y direction (vertical)
      // Change number value if effect should happen later
      if (window.scrollY > 0) {
        // If atTop is true, set it to false
        if (this.atTop) {
          this.atTop = false;
        }
      } else { // If Y scroll position 0 (or above the threshold you choose)
        // If atTop is false, set it to true
        if (!this.atTop) {
          this.atTop = true;
        }
      }
    },

    toggleNavbar(e) {
      // console.log('e.target', e.target);
      // const canToggle = e.target.closest('[data-toggle-menu]');
      // // const canToggle = e.target.dataset;
      // console.log('canToggle', canToggle);
      // if (!canToggle) return;

      this.showMenu = !this.showMenu;
    },

    closeDropdown() {
      // TODO: This is good for now. Maybe in future (with more dropdown menus)
      // use vuex to store ref and trigger action
      const dropdownCheckbox = this.$refs.dropdownContinents.$refs.dropdown;
      dropdownCheckbox.checked = false;
      this.toggleNavbar();
    },

    logout() {
      this.toggleNavbar();

      this.$store.dispatch('logout')
        .then(() => {
            this.$router.push(`/`);
        })
        .catch(err => { // TODO: How to catch failed logout
            console.log('err in Navbar logout()', err);
        });
    },
    
  },

  computed: {
    ...mapGetters({
      continentNames: 'continentNames',
    })
  },

}
</script>

<style lang="scss">
.navbar-wrapper {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  // align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: .5rem 1rem;
  margin-bottom: .75rem;
  background-color: transparent;
  transition: all 300ms ease-in-out;

  &--scrolled {
    background-color: #fff;
    border-bottom: 1px solid rgba(209, 213, 219, 1);
    -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); 
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  @media (min-width: 1024px) {
    // Needed in order for navbar-wrapper not to expand when dropdown is opened
    max-height: 2.5rem; // 42px
  }

}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 200ch;

  @media(min-width: 200ch) {
    margin-left: auto;
    margin-right: auto;
  }

  &__logo {
    display: flex;
    align-items: center;
    width: 50%; // former auto? / 50%

    &__link {
      // TODO: Ensure accessibility for links!
      // TODO: flex mr-4 whitespace-nowrap (former)
      font-size: $mobile-heading;
      // font-size: 1.25rem; // 20px
      line-height: 1.75rem; /* 28px */
      font-weight: bold;
    }

    @media (min-width: 1024px) {
      // position absolute helper to avoid dislocation (moving down in container)
      // because of dropdown expansion
      // TODO: Könnte man umgehen, indem man zwei separate container hat? Einen
      // für das Logo und einen anderen für das Menu?
      position: absolute;
      top: -0.125rem; // -2px
      left: 0;
      width: auto;
    }

  }

  &__toggle-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
  }

  @media (min-width: 1024px) {
    // to position __logo absolute @lg
    position: relative;
    flex-wrap: nowrap;
  }

}

.navbar__toggle-menu__btn {
  // display: block;
  // outline: 2px solid transparent;
  // outline-offset: 2px;
  font-size: 1.125rem; // 18px
  line-height: 1.75rem; // 28px
  color: rgba(31, 41, 55, 1);
  cursor: pointer;

  // &:focus {
    // outline: 2px solid transparent;
    // outline-offset: 2px;
  // }

  &__size {
    height: 1.5rem; // 24px
    width: 1.5rem; // 24px
  }

  @media (min-width: 1024px) {
    display: none;
  }
}

.navbar__menu-wrapper {
  // justify-center bg-white mx-auto w-1/2
  // align-items: center; // hatten wir so zuvor
  // width: 100%; // max-w
  margin-left: auto; // max-w
  margin-right: auto; // max-w 
  // background-color: #fff; // max-w

  &--hide {
    display: none;
  }

  @media (min-width: 1024px) {
    display: flex;
    flex-grow: 1;
  }
}

.navbar__menu {
  // justify-center items-center mx-auto
  display: flex;
  flex-direction: column;
  align-items: center; // max-w
  margin-left: auto; // max-w
  margin-right: auto; // max-w 
  list-style-type: none;
  margin-left: auto;
  // width: 50%;

  &__item__link {
    display: flex;
    align-items: flex-start;
    padding: .5rem 0; // 8px
    color: rgba(31, 41, 55, 1);
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 0.05em;
    cursor: pointer;
    white-space: nowrap;
    // TODO: Ensure accessibility for links!
    outline: none;
    box-shadow: none;
    -webkit-tap-highlight-color: transparent;

  }

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    margin-left: auto;
    margin-right: 0;

    &__item__link {
      padding: 0;
      margin-left: 0.75rem; // 12px
    }
  }

}

// .dropdown__toggle-menu {
//   display: none;
// }

// .dropdown__toggle-menu__btn {
//   height: 1.25rem; // 20px
//   width: 1.25rem; // 20px
//   margin-left: .25rem; // 4px
// }

// .dropdown__menu {
//   display: none;
//   padding-bottom: .5rem; // 8px
//   background-color: rgb(255 255 255 / 0.7);
//   // font-size: 0.875rem/* 14px */;
//   // line-height: 1.25rem/* 20px */;
//   border-radius: 0.25rem/* 4px */;
//   z-index: 60;

//   &__item__link{
//     // py-1 text-md inline-flex items-center justify-content
//     display: inline-flex;
//     padding: .25rem 0; // 4px
//   }
// }
// /* When hidden input[type=checkbox] gets checked, the ul with .dropdown
// gets attached the display block property and is therfor visible. */
// input:checked~ul.dropdown__menu {
//   display: block;
// }
</style>