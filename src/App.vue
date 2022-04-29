<template>
  <LastUpdatedInfoBanner />
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

  // async beforeCreate() {
  //   console.log('beforeCreate');

  //   const isAuthenticated = Boolean(JSON.parse(sessionStorage.getItem('isAuthenticated')));
  //   const accessToken = JSON.parse(localStorage.getItem('tcAccess'));

  //   // known user + not closed tab
  //   if (isAuthenticated) {
  //     this.$store.commit('setAuthenticated', true);
  //   } else if (accessToken) {
  //     // known user + closed tab
  //     const verifyJWTSuccess = await this.$store.dispatch('verifyJWT');

  //     if (verifyJWTSuccess !== 200) {
  //       console.log('verifySuccess', verifyJWTSuccess);

  //       const refreshJWTSuccess = await this.$store.dispatch('refreshJWT');

  //       if (refreshJWTSuccess !== 200) {
  //         console.log('refreshSuccess', refreshJWTSuccess);
  //         this.$router.push('/log-in');
  //       }

  //     }
  //   } else {
  //     // not known / not logged in user
  //     this.$store.commit('removeToken');
  //   }

  //   if (localStorage.user !== null) {
  //     this.$store.commit('setUser', JSON.parse(localStorage.user));
  //     console.log('After setUser commit in App.vue!');
  //   }
  // },

  created() {
    this.initCookieConsent();
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated',
    })
  },

  methods: {
    initCookieConsent() {
      // Get 'cookie-comply' item from localStorage
      let cookieComply = JSON.parse(localStorage.getItem('cookie-comply'));
      
      // If cookie-comply key exists in localStorage
      if (cookieComply) {
        const elapsedDays = this.checkDate();

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

        this.$store.dispatch('fetchClientLocation')
          .then(res => {

            console.log('res', res.message);
            // Get time zone
            const userTimezone = res.time_zone.includes('Europe') || res.time_zone.includes('America/Los_Angeles') || res.includes('No Timezone');
            
            // Check if time zone property includes 'Europe'
            if(userTimezone) {
              console.log('EU/ CAL/ No Timezone, show banner.');
              this.consentNeeded = true;
            } // If fromEurope is false, set localStorage item and invoke runPrefScripts()
            else {
              console.log('NON-EU/ NON-CAL, no banner needed.');
              this.acceptedAll();
            }
          })
          .catch(err => {
            console.log(err);
            this.consentNeeded = true;
          });
          
      }
    },

    checkDate() {
      console.log('I need to check the date');

      // Compare local storage date with current date
      const answeredAt = localStorage.getItem('answeredAt');
      const elapsedTime = Date.now() - answeredAt;

      console.log('elapsedTime', elapsedTime);

      // (toSeconds * toMinutes * toHours * toDays)
      const elapsedDays = elapsedTime / (1000 * 60 * 60 * 24)
      console.log('elapsedDays', elapsedDays);

      return elapsedDays;
    },
    
    acceptedAll() {
      console.log('acceptedAll');
      // Hier JSON.stringify([new String('_ga','_hjid')]) TODO
      // Damit unten if else oder so möglich ist und loopens
      const allScripts = ['_ga','_hjid'];
      localStorage.setItem('cookie-comply', JSON.stringify(allScripts));
      this.runPrefScripts();
    },

    runPrefScripts() {
      const prefScripts = JSON.parse(localStorage.getItem('cookie-comply'));
      
      const answeredAt = Date.now();
      console.log('answeredAt', answeredAt);
      localStorage.setItem('answeredAt', answeredAt);

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
