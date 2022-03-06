<template>
<div id="wrapper">
  <LastUpdatedInfoBanner />
  <Nav />
  
  <router-view :key="$route.fullPath" />

  <vue-cookie-comply
    class="cookie-comply--sticky"
    v-if="isEurope"
    :headerTitle="headerTitle"
    :headerDescription="headerDescription"
    :preferences="preferences"
    @on-accept-all-cookies="acceptedAll"
    @on-save-cookie-preferences="runPrefScripts"
  />

</div>
</template>

<script>
import LastUpdatedInfoBanner from './components/LastUpdatedInfoBanner.vue';
import Nav from './components/Nav.vue';

export default {
  name: 'App',

  components: {
    LastUpdatedInfoBanner,
    Nav,
  },

  data() {
    return {
      isEurope: false,
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

  created() {
    this.initCookieConsent();
  },

  methods: {
    initCookieConsent() {
      // Get 'cookie-comply' item from localStorage
      let cookieComply = JSON.parse(localStorage.getItem('cookie-comply'));
      let location;
      
      // If cookie-comply key exists in localStorage
      if (cookieComply) {
        const elapsedDays = this.checkDate();

        // If cookie-comply value is '[]' (user saved empty preferences)
        // if (cookieComply === '[]' && elapsedDays > 0.0001) {
        if (!cookieComply.length && elapsedDays > 0.0001) {

          // Make slate clean for cookie consent banner
          localStorage.removeItem('cookie-comply');
          localStorage.removeItem('answeredAt');

          this.isEurope = true;
        }
      } // When 'cookie-comply' is not set in localStorage (new user)
      else {
         // Save 'fetchClientLocation's response data
        location = this.$store.dispatch('fetchClientLocation');

        location
        .then(res => {
          // Get time zone
          let timeZoneEurope = res.time_zone.includes('Europe');
          
          // Check if time zone property includes 'Europe'
          if(timeZoneEurope) {
            console.log('EU, show banner.');
            this.isEurope = true;
          } // If fromEurope is false, set localStorage item and invoke runPrefScripts()
          else {
            console.log('NON-EU, no banner needed.');
            this.acceptedAll();
          }
        })
        .catch(err => {
          console.log('err in App.vue', err);
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
  // sticky position for consent banner
  position: sticky !important;
  margin: 1rem .5rem;
  z-index: 50;
}
</style>
