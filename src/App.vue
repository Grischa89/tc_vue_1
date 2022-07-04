<template>
  <LastUpdatedInfoBanner
    v-if="elapsedInfo"
    :elapsedInfo="elapsedInfo" />
  <Navbar
    :isAuthenticated="isAuthenticated"
    :darkMode="darkMode" />

    {{ darkMode }}
  
  <div class="main-wrapper">
    <router-view :key="$route.fullPath" />

    <!-- <BackToTopButton /> -->
  </div>

  <CallToAction v-if="!userExists">
    <template #header>
      <h2>Find subscriptions<br>that meet your needs</h2>
    </template>

    <template #body>
      <ol class="cta__body__list">
        <li class="cta__body__list__item">Receive the latest Trainer Codes per mail</li>
        <li class="cta__body__list__item">Share your Trainer Code on social media for a certain event</li>
      </ol>
    </template>

    <template #footer>
      <button type="button" class="cta__footer__button">
        <router-link :to="{ name: 'SignUp' }">Sign up!</router-link>
      </button>

      <router-link to="#" class="cta__footer__link">
        <span class="cta__footer__link__text">About Subscriptions</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="cta__footer__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="about-subscriptions">
              <title id="about-subscriptions">About Subscriptions</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
      </router-link>
    </template>
  </CallToAction>

  <Footer :userExists="userExists" />

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
// import BackToTopButton from './components/navbar/BackToTopButton.vue';
import Footer from './components/Footer.vue';
import CallToAction from './components/cta/CallToAction.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: {
    LastUpdatedInfoBanner,
    Navbar,
    Footer,
    // BackToTopButton,
    CallToAction,
  },

  data() {
    return {
      darkMode: false,
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

    window.addEventListener('scroll', () => {
      this.$store.commit('setScrollYPosition', window.scrollY);
    })
  },

  created() {
    this.initCookieConsent();
    this.$store.dispatch('fetchLastUpdated');
    this.setMode();

    let docWidth = document.documentElement.offsetWidth;

    [].forEach.call(
      document.querySelectorAll('*'),
      function(el) {
        if (el.offsetWidth > docWidth) {
          console.log('%cel', 'color: crimson; font-weight: bold;', el);
        }
      }
    );
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated',
      elapsedInfo: 'elapsedInfo',
      userExists: 'userExists',
    }),
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
    },

    setMode() {
      const tc_colorMode = JSON.parse(localStorage.getItem('tc_colorMode')) || '';

      console.log('%cThis is true if tc_colorMode not set in localStorage: ', 'color: orange; font-weight: bold;', tc_colorMode == false);
      console.log('%cOS dark mode set to: ', 'color: orange; font-weight: bold;', window.matchMedia('(prefers-color-scheme: dark)').matches);

      // TODO This is how it should be (Check os mode preference, but let localStorage setting still take precedence)
      // if (tc_colorMode === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !tc_colorMode)) {
      // TODO This is just for testing
      if (tc_colorMode === 'dark') {
        document.documentElement.setAttribute('color-mode', 'dark');
        this.darkMode = true;
      }
    }

  },

}
</script>


<style lang="scss">
:root[color-mode="light"] {
  --surface1: #fef9f3;
  --surface2: #fefbf7;
  --surface3: #ffffff;
  --surface4: #ffffff;
  --surfaceQR: #ffffff;
  
  --hover-surface: hsla(33, 91%, 73%, .04); // Derived froom $in-between, Light Orange: #fcdcb6ff;
  // --hover-surface1: hsla(0, 3%, 14%, .04); // Derived from $black, Raisin Black: #252323ff;
  --hover-button: hsla(33, 91%, 73%, .4);
  --focus-button: hsla(33, 91%, 73%, .6);

  --primary: #fef6ec; // $primary
  --primary1: #fcdcb6; // $primary-darker
  --primary2: #f9c07b; // $in-between
  --primary3: #f6a746; // $secondary-lighter
  --primary4: #f48b0b; // $secondary
  --secondary: hsla(33, 91%, 50%, 1);
  --accent: #5f32dc;

  --help: hsla(0, 3%, 14%, .66);
  --help-shadow: hsla(0, 3%, 14%, .33);

  --error: #b00020;
  --error-shadow: hsla(349, 100%, 35%, .4);

  --success: #177d34;
  --success-shadow: hsla(137, 69%, 29%, .4);

  --info: #2d6ec8;
  --info-shadow: hsla(215, 63%, 48%, .4);

  --divider: hsla(0, 3%, 14%, .1);
  --border: #e1e1e1;
  --border-input: #d5d5d5;

  --text: #252323;
  --textHelp: hsla(0, 3%, 14%, .66);
  --textInverse: hsla(0, 0%, 100%, .87);
  --textBackdrop: #f9c07b; // $in-between
  --textBackdropLight: #fcdcb6; // $primary-darker

  --tooltip: hsla(0, 3%, 14%, .8);
  --banner: #fcdcb6; // $primary-darker
  --footer: #252323;

  --ctaGradient: radial-gradient(circle, hsla(33, 100%, 96%, 1) 22%, hsla(345, 33%, 93%, 1) 72%, hsla(323, 28%, 91%, 1) 100%);
  // radial-gradient(circle, #160f29 22%, #1a1523 72%, #3c3939 100%);
  // radial-gradient(circle, hsla(33, 100%, 96%, 1) 22%, hsla(345, 33%, 93%, 1) 72%, hsla(323, 28%, 91%, 1) 100%);
  
  --ctaInlineGradient: linear-gradient(90deg, #f9efeb 0%, #f3e7ea 72%, #eee2ea 100%);
  // linear-gradient(90deg, hsla(16, 56%, 95%, 1) 0%, hsla(345, 33%, 93%, 1) 72%, hsla(323, 28%, 91%, 1) 100%);

  --first: #fce2c2;
  --second: #f7ae54;
  --third: #5f32dc;
}

:root[color-mode="dark"] {
  color-scheme: dark;
  --surface1: #100F0F;
  // --surface1: #252323;
  --surface2: #1d1d1d;
  // --surface2: #383535;
  --surface3: #212121;
  // --surface3: #3D3A3A;
  --surface4: #252323;
  // --surface5: #4D2523234949;
  --surfaceModal: #3f3f3f;
  
  --hover-surface: hsla(33, 91%, 73%, .04); // Derived froom $in-between, Light Orange: #fcdcb6ff;
  // --hover-surface1: hsla(0, 0%, 100%, .04); // Derived from --text

  --hover-button: hsla(33, 91%, 73%, .4);
  --focus-button: hsla(33, 91%, 73%, .6);
  
  --primary: #3c332f; // Same as lightest color in gradient
  --primary1: #fac98c; // $primary-darker
  --primary2: #d4a97e; // $in-between
  // --primary2: #f9c07b; // $in-between
  --primary3: #f6a746; // $secondary-lighter
  --primary4: #f48b0b; // $secondary
  // --accent: #5f32dc;
  --accent: #745eb0;
  --secondary: #d37f17;
  // --secondary: #e8a34f;
  // --secondary: #d5a162;

  --help: hsla(0, 0%, 100%, .66);
  --help-shadow: hsla(0, 0%, 100%, .5);

  --error: #e1566f;
  --error-shadow: hsla(349, 70%, 61%, .4);

  --success: #5dc87b;
  --success-shadow: hsla(137, 49%, 57%, .4);

  --info: #8caad2;
  --info-shadow: hsla(214, 44%, 69%, .4);

  --divider: #494949; // hsla(0, 3%, 14%, .96);
  --border: #494949;
  --border-input: #757575;
  --border-cta: #3c332f;

  --text: hsla(0, 0%, 100%, .87);
  --textHelp: hsla(0, 0%, 100%, .66);
  --textInverse: #252323;
  --textBackdrop: transparent;
  --textBackdropLight: transparent;

  --tooltip: hsla(33, 90%, 96%, .8);
  --banner: transparent;
  --footer: #252323;

  --ctaGradient: radial-gradient(circle, #3c332f 22%, #392f2f 72%, #372f34 100%);
  
  //radial-gradient(circle, #160f29 22%, #1a1523 72%, #3c3939 100%);
  // radial-gradient(circle, hsla(256, 46%, 11%, 1) 22%, hsla(261, 25%, 11%, 1) 72%, hsla(0, 3%, 23%, 1) 100%);
  // radial-gradient(circle, hsla(33, 100%, 7%, 1) 0%, hsla(344, 32%, 14%, 1) 72%, hsla(319, 27%, 14%, 1) 100%);

  --ctaInlineGradient: linear-gradient(90deg, #3c332f 0%, #392f2f 72%, #372f34 100%);
  // #454141;
  // --ctaInlineGradient: #c68739;
;
  // linear-gradient(90deg, #1d1b1b 0%, #1a1523 72%, #160f29 100%);
  //linear-gradient(90deg, #140a06 0%, #0c051f 72%, #181325 100%);
  //linear-gradient(90deg, #140a06 0%, #180c0f 0%, #3a2232 100%);
  // linear-gradient(90deg, hsla(17, 54%, 5%, 1) 0%, hsla(345, 33%, 7%, 1) 0%, hsla(320, 26%, 18%, 1) 100%);

  --first: #fce2c2;
  --second: #f7ae54;
  --third: #8f70e7;
}

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
  color: var(--text);
  background-color: var(--surface1);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  // position: relative;
  // min-height: 100vh;
  text-align: center;
  // background-color: rgba($primary, .3);

  // background-image: linear-gradient(to right bottom, #fefefa, #fdfcf3, #fcf9ec, #fcf6e5, #fdf3de, #fcedd0, #fce6c3, #fddfb6, #fcd39f, #fcc689, #fbb974, #fbab60);
}

.main-wrapper {
  flex: 1;
  padding: 5%;
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
  z-index: 2;
}

.cookie-comply__modal {
  // fixed position for modal (pop up after @click preferences)
  position: fixed !important;
}
</style>
