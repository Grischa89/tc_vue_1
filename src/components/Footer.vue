<template>
  <footer class="footer" :class="{ 'footer--with-cta': !userExists }">
    <div class="footer__container">
      <div class="footer__container__item">
        <router-link :to="{ name: 'About' }" class="footer__container__item__link">About</router-link>
      </div>
      <div class="footer__container__item">
        <router-link :to="{ name: 'Contact' }" class="footer__container__item__link">Contact</router-link>
      </div>
      <div class="footer__container__item">
        <router-link :to="{ name: 'LegalNotice' }" class="footer__container__item__link">Legal Notice</router-link>
      </div>
      <!-- <div class="footer__container__item">
        <router-link to="#" class="footer__container__item__link">Privacy Policy</router-link>
      </div> -->
    </div>

    <div class="footer__container">
      <div class="footer__container__item">
        <a href="https://twitter.com/TrainerCodesNet" target="_blank" rel="external">
          <!-- From Twitter - GitHub, Apache License 2.0, https://commons.wikimedia.org/w/index.php?curid=112280645 -->
          <svg version="1.1" id="Logo" xmlns="http://www.w3.org/2000/svg" class="footer__container__item__prepend" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 248 204" style="enable-background:new 0 0 248 204;fill:#1D9BF0;" xml:space="preserve" aria-labelledby="twitter twitter-reference">
            <title id="twitter">Twitter Logo</title>
            <desc id="twitter-reference">From Twitter - GitHub, Apache License 2.0, https://commons.wikimedia.org/w/index.php?curid=112280645</desc>
            <g id="Logo_1_">
              <path id="white_background" class="st0" d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04   C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66   c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64   c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76   c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26   c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"/>
            </g>
          </svg>
        </a>
      </div>
    </div>

    <div class="footer__container">
      <div class="footer__container__item">
        Trainer Codes {{ currentYear }}
      </div>
      <div class="footer__container__item">
        <span class="footer__container__item__emoji">&#129505;</span>&nbsp;From trainers for trainers.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',

  props: {
    userExists: Boolean,
  },

  data() {
    return {
      currentYear: '',
    }
  },

  created() {
    this.currentYear = new Date().getFullYear();
  }

}
</script>

<style lang="scss">
.footer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: var(--footer);
  padding-top: 2rem;
  padding-bottom: 2rem;

  &--with-cta {
    padding-top: 7rem;
    padding-bottom: 3rem;
  }

  @media(min-width: 550px) { // TODO width wenn copyright steht
    .footer {
      grid-template-columns: repeat(2, 1fr);

      &__container {
        grid-column: span 1;

        &:nth-child(1) {
          grid-row: span 2;
        }

        &:last-of-type, &:nth-child(2) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          grid-column: span 1;
        }
      }

    }
  }

  @media(min-width: 900px) { // TODO width wenn copyright steht
    .footer {
      grid-template-columns: repeat(2, 1fr);

      &__container {
        grid-column: span 1;

        &:nth-child(1) {
          grid-row: span 1;
          flex-direction: row;
        }

        &:last-of-type {
          grid-column: span 2;
        }
      }
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    grid-column: span 2;

    &:last-of-type {
      grid-column: span 2;

      .footer__container__item {
        font-family: Monaco, monospace;
        font-size: .75rem;
        line-height: 110%;
        color: rgba($white, .5);
        margin: 0;

        &__emoji {
          color: rgba($white, 1);
        }
      }
    }

    &__item {
      display: flex;
      align-items: center;
      font-size: $mobile-help;
      color: rgba($white, 1);
      text-align: left;
      margin: .5rem auto;

      &__link:hover {
        -webkit-tap-highlight-color: $primary;
        text-decoration: underline;
      }

      &__prepend {
        height: $mobile-body;
        width: $mobile-body;
        margin-right: .25rem;
        color: $secondary;
      }

    }
  }
}
</style>