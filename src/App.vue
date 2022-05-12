<template>
  <LastUpdatedInfoBanner
    v-if="elapsedInfo"
    :elapsedInfo="elapsedInfo" />
  <Navbar
    :isAuthenticated="isAuthenticated" />
  
  <div class="main-wrapper">
    <router-view :key="$route.fullPath" />
  </div>

  <Footer />

  <vue-cookie-comply
    class="cookie-comply--sticky"
    v-if="consentNeeded"
    :headerTitle="headerTitle"
    :headerDescription="headerDescription"
    :preferences="preferences"
    @on-accept-all-cookies="acceptedAll"
    @on-save-cookie-preferences="runPrefScripts"
  >
    <!-- <template v-slot:header>
      <header>Custom header</header>
    </template>

    <template v-slot:modal-header>
      <h3>My custom modal header</h3>
    </template>

    <template v-slot:modal-body="{ preference, index }">
      <div>{{ preference.title }}</div>
    </template>

    <template v-slot:modal-footer>
      <footer>
        My custom modal footer
      </footer>
    </template> -->
  </vue-cookie-comply>
</template>

<script>
import LastUpdatedInfoBanner from './components/LastUpdatedInfoBanner.vue';
import Navbar from './components/navbar/Navbar.vue';
import Footer from './components/Footer.vue';

import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'App',

  components: {
    LastUpdatedInfoBanner,
    Navbar,
    Footer,
  },

  data() {
    return {
      consentNeeded: false,
      headerTitle: 'Cookie consent',
      headerDescription: 'We use cookies to ensure you get the best experience on our website. You can opt-out or customize the cookie settings under \"Preferences\".',
      preferences: [
        {
          title: 'Performance',
          description:
            'Bla bla serviços que podemos oferecer erviços que podemos oferecer erviços que podemos oferecer erviços que podemos oferecer serviços que podemos oferecer.',
          // items: [{ label: 'Active', value: 'performance', isRequired: true }],
          items: [{ label: 'Active', value: 'performance' }],
        },
        {
          title: 'Analytics',
          description:
            'Bla bla serviços que podemos oferecer erviços que podemos oferecer erviços que podemos oferecer erviços que podemos oferecer serviços que podemos oferecer.',
          items: [
            { label: 'GoogleAnalytics', value: '_ga' },
            { label: 'Hotjar', value: '_hjid' },
            //{ label: 'New Relic', value: 'newRelic', isEnable: true },
          ],
        },
      ],
    }
  },

  async beforeCreate() {
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};
    
    if (tc_user.refresh) {
      // "known / not logged out user"

      // Setting isAuthenticated true so relevant data is already set + router beforeEach will NOT redirect us to Login
      // In cas refreshJWT resolves with new access token this is what we want
      // If refreshJWT gets rejected due to invalid token the redirect gets handled in response interceptor in main.js
      this.$store.commit('setAuthenticated', true);
      
      console.log('%cknown, not logged out user + closed session - tc_user.access:', 'color: green; font-weight: bold;', tc_user.refresh);

      this.$store.dispatch('refreshJWT');

    } else {
      // "not known / logged out user"
      console.log('%cnot known / logged out user - tc_user.access:', 'color: green; font-weight: bold;', tc_user.refresh);

      this.$store.dispatch('logout');
    }

    // If tc_user has keys (no empty object) set 
    if (Object.keys(tc_user).length !== 0 && tc_user.constructor === Object) {
      console.log('%cWe have a user object in localStorage', 'color: aqua; font-weight: bold;', tc_user);
      this.$store.commit('setUser', tc_user);
    }
  },

  created() {
    this.initCookieConsent();
    this.$store.dispatch('fetchLastUpdated');
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated',
      elapsedInfo: 'elapsedInfo',
    })
  },

  methods: {
    async initCookieConsent() {
      // Get 'cookie-comply' item from localStorage
      const cookieComply = JSON.parse(localStorage.getItem('cookie-comply'));
      console.log('%cAfter JSON.pars in initCookieConsent', 'color: red; font-weight: bold; background-color: white;', cookieComply);
      
      // If cookie-comply key exists in localStorage
      if (cookieComply) {
        const elapsedDays = this.checkDate();

        // TODO Set limit for banner to be shown again (90 days?)
        // If cookie-comply value is '[]' (user saved empty preferences)
        // if (cookieComply === '[]' && elapsedDays > 0.0001) {
        if (!cookieComply.length && elapsedDays > 0.0001) {

          // Make slate clean for cookie consent banner
          localStorage.removeItem('cookie-comply');
          localStorage.removeItem('answeredAt');

          this.consentNeeded = true;
        }
      } // When 'cookie-comply' is not set in localStorage (new user)
      else {

        try {
          const userTimezone = await this.$store.dispatch('fetchClientLocation');

          if (userTimezone.includes('Europe') || userTimezone.includes('America/Los_Angeles')) {
            console.log('EU/ CAL/ No Timezone, show banner.');
            this.consentNeeded = true;
          } else {
            console.log('NON-EU/ NON-CAL, no banner needed.');
            this.acceptedAll();
          }

        } catch (err) {
          console.log('err in try catch', err);
          this.consentNeeded = true;
        }
      }
    },

    checkDate() {
      console.log('I need to check the date');

      // Compare local storage date with current date
      // Get 'answeredAt' item from localStorage, or fallback Jan 2022, or 0
      const answeredAt = JSON.parse(localStorage.getItem('answeredAt') || Date.parse('01 Jan 2022 00:00:00 GMT') || '0');
      const elapsedTime = Date.now() - answeredAt;

      // (toSeconds * toMinutes * toHours * toDays)
      const elapsedDays = elapsedTime / (1000 * 60 * 60 * 24)
      console.log('elapsedDays', elapsedDays);

      return elapsedDays;
    },
    
    acceptedAll() {
      console.log('acceptedAll');
      // Extend allScripts array if new script shall be included
      const allScripts = ['_ga','_hjid'];
      localStorage.setItem('cookie-comply', JSON.stringify(allScripts));
      this.runPrefScripts();
    },

    runPrefScripts() {
      // If user chooses no script, an empty array [] is saved to cookie-comply
      const prefScripts = JSON.parse(localStorage.getItem('cookie-comply')) || [];
      console.log('%cAfter JSON.pars in runPrefScripts', 'color: red; font-weight: bold; background-color: white;', prefScripts);
      
      const answeredAt = Date.now();
      localStorage.answeredAt = JSON.stringify(answeredAt);

      if (!prefScripts.length) return

      for (let item of prefScripts) {
        console.log(item);
        if (item === '_ga') {
          this._ga();
        }
        if (item === '_hjid') {
          this._hjid();
        }
      }      
    },

    _ga() {
      console.log('_ga script executed');
    },

    _hjid() {
      console.log('_hjid script executed');
    }

  },

}
</script>


<style lang="scss">
* {
  ::selection, &::-webkit-selection {
    background-color: $selection;
    color: $black;
  }

  -webkit-tap-highlight-color: $primary;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  // font-family: Helvetica, sans-serif;
  // font-family: Monaco, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $black;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  // position: relative;
  // min-height: 100vh;
  text-align: center;
  background-color: $white;
  // background-image: linear-gradient(to right bottom, #fefefa, #fdfcf3, #fcf9ec, #fcf6e5, #fdf3de, #fcedd0, #fce6c3, #fddfb6, #fcd39f, #fcc689, #fbb974, #fbab60);
}

.main-wrapper {
  flex: 1;
  margin-bottom: 5rem;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.cookie-comply--sticky {
  // fixed position for consent banner
  position: fixed !important;
  margin: .5rem;
}

.cookie-comply__modal {
  // fixed position for modal (pop up after @click preferences)
  position: fixed !important;
}
</style>
