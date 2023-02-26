<template>
  <FormTemplate>
    <div class="form__container">
    
      <!-- NOTE: div instead of form prevents form submit from numpad @mobile "Go" button -->
      <form class="form" @submit.prevent="submitForm">
        <h2 class="form__title">Add Subscription</h2>

        <div v-if="errors.loadSubscriptionOptions" class="form__info form__info--error">
          {{ errors.loadSubscriptionOptions }}
        </div>
        <div v-if="errors.loadCountries" class="form__info form__info--error">
          {{ errors.loadCountries }}
        </div>
        <div v-if="errors.submitFailure" class="form__info form__info--error">
          {{ errors.submitFailure }}
        </div>

        <div class="form__group">
          <label class="form__group__label" :class="{'form__group__label--error': errors.invalidCode}" for="trainercode">Trainercode</label>
          <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidCode}" type="number" step="1" id="trainercode" name="trainercode" placeholder="0000 1111 2222" v-model="data.player_code" @keydown="restrictKeys($event)" @keyup="typeCode($event)" @paste="pasteCode($event)" @blur="validateCode(data.player_code)">

          
          <span v-if="formatCode" class="form__group__help">Your Trainer Code: {{ formatCode }}</span>
          <span v-if="errors.invalidCode" class="form__group__help" :class="{'form__group__help--error': errors.invalidCode}">{{ errors.invalidCode }}</span>
        </div>

        <div class="form__group">
          <label class="form__group__label" for="eventOptions">Event</label>
          <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidEvent}" name="eventOptions" id="eventOptions" @blur="validateEvent(data.event)" v-model="data.event" :disabled="!eventOptions">
            <option value selected disabled >Choose An Event</option>
            <option
              v-for="(event, i) in eventOptions"
              :key="i"
              :value="event.id">{{ event.name }}</option>
          </select>
          
          <span v-if="errors.invalidEvent" class="form__group__help" :class="{'form__group__help--error': errors.invalidEvent}">{{ errors.invalidEvent }}</span>
        </div>

        <div class="form__group">
          <label class="form__group__label" for="codeActions">
            Subscription Type
            <IconButton @click.stop="openInfo = !openInfo">
              <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend--small" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </IconButton>
          </label>
          <span v-if="openInfo" class="form__group__help form__group__help--normal">
            {{ subscriptionTypeInfo }}
          </span>
          <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCodeAction}" name="codeActions" id="codeActions" @blur="validateCodeAction(data.action)" v-model="data.action" :disabled="!codeActionOptions">
            <option value selected disabled>Choose A Subscription Type</option>
            <option 
              v-for="(action, i) in codeActionOptions"
              :key="i" 
              :value="action[0]">{{ action[1] }}
            </option>
          </select>

          <span v-if="errors.invalidCodeAction" class="form__group__help" :class="{'form__group__help--error': errors.invalidCodeAction}" >{{ errors.invalidCodeAction }}</span>
        </div>

        <div v-if="countries && !data.user_timezone" class="form__group">
          <div v-if="errors.loadTimezone" class="form__group__help form__group__help--error">
            {{ errors.loadTimezone }}
          </div>
          <label class="form__group__label" for="country">Country</label>
          <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCountry}" name="country" id="country" @blur="validateCountry(data.country)" v-model="data.country">
            <option value selected disabled >Choose A Country</option>
            <option
              v-for="(country, i) in countries"
              :key="i"
              :value="country.slug">{{ country.name }}</option>
          </select>
          
          <span v-if="errors.invalidCountry" class="form__group__help" :class="{'form__group__help--error': errors.invalidCountry}">{{ errors.invalidCountry }}</span>
        </div>

        <div class="form__btn__container">
          <button class="form__btn form__btn--submit" type="submit">Submit</button>
          <!-- <button class="form__btn form__btn--cancel" type="button" @click="cancelForm">Cancel</button> -->
        </div>
      </form>
      
    </div>
  </FormTemplate>
</template>

<script>
import FormTemplate from '../components/templates/FormTemplate.vue';
import IconButton from '../components/buttons/IconButton.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'AddSubscription',

  data() {
    return {
      data: {
        player_code: '',
        event: '',
        action: '',
        user_timezone: '',
        country: ''
      },
      errors: {
        invalidCode: '',
        invalidEvent: '',
        invalidCodeAction: '',
        invalidCountry: '',
        loadSubscriptionOptions: '',
        loadTimezone: '',
        loadCountries: '',
        submitFailure: '',
      },
      codeInput: '',
      maxLen: 12,
      openInfo: false,
      subscriptionTypeInfo: 'The action that should be performed with the Trainer Code at time of the chosen Event.',
    }
  },

  components: {
    FormTemplate,
    IconButton
  },

  async created() {
    const fetchSubscriptionOptionsSuccess = await this.$store.dispatch('fetchSubscriptionOptions');

    if (fetchSubscriptionOptionsSuccess !== 200) this.errors.loadSubscriptionOptions = 'Something went wrong retrieving possible subscriptions. Please reload the page or try again later.';

    // this.$store.dispatch('fetchSubscriptionOptions')
    //   .catch(() => {
    //     this.errors.loadSubscriptionOptions = 'Something went wrong retrieving possible subscriptions. Please reload the page or try again later.';
    //   });

    try {
      const userTimezone = await this.$store.dispatch('fetchClientLocation');
      this.data.user_timezone = userTimezone;
    } catch (err) {
      console.log('%cerr fetchClientLocation', 'color: darkseagreen; font-weight: bold;', err);
      this.data.user_timezone = '';
    };
  },

  computed: {
    ...mapGetters({
      eventOptions: 'eventOptions',
      codeActionOptions: 'codeActionOptions',
      countries: 'countries',
    }),

    formatCode() {
      // Replace every 4 chars with the 4 chars plus a space
      return this.codeInput.replace(/.{4}/g, '$& ');
    },
  },

  methods: {
    async submitForm() {
      this.errors.loadTimezone = '';
      this.errors.loadCountries= '';

      const validCode = this.validateCode(this.data.player_code);
      const validEvent = this.validateEvent(this.data.event);
      const validCodeAction = this.validateCodeAction(this.data.action);
      const validCountry = this.validateCountry(this.data.country);

      if (!validCode || !validEvent || !validCodeAction) return false;

      if (!this.data.user_timezone && !this.countries) {
        const getCountriesSuccess = await this.$store.dispatch('getCountries');

        if (getCountriesSuccess === 200) {
          this.errors.loadTimezone = `We could not figure out your timezone. Please enter your country manually:`;
          return false;
        } else {
          this.errors.loadCountries = `We're sorry, something went very wrong. Please reload the page or try again later.`;
          return false;
        }
      }

      if ((validCode && validEvent && validCodeAction && this.data.user_timezone) || (validCode && validEvent && validCodeAction && validCountry)) {
        // TODO: Redirect to /profile or subscriptions list?

        const submitSuccess = await this.$store.dispatch('addSubscription', this.data);

        submitSuccess === 201 ? this.$router.push({ name: 'ProfileSubscriptions' }) : this.errors.submitFailure = 'Something went wrong. Please try again later.';
      }

    },

    validateEvent(event) {
      if (!event) {
        this.errors.invalidEvent = 'Please choose an event.';
        return false;
      } else {
        this.errors.invalidEvent = '';
        return true;
      }
    },

    validateCodeAction(action) {
      if (!action) {
        this.errors.invalidCodeAction = 'Please choose a subscription type.';
        return false;
      } else {
        this.errors.invalidCodeAction = '';
        return true;
      }
    },

    validateCountry(country) {
      if (!country) {
        this.errors.invalidCountry = 'Please choose a country.';
        return false;
      } else {
        this.errors.invalidCountry = '';
        return true;
      }
    },

    // cancelForm() {
    //   this.data.player_code = '';
    //   this.data.event = '';
    //   this.data.code_action = '';
    //   this.data.user_timezone = '';
    //   this.data.country = '';
    //   this.codeInput = '';

    //   this.errors.invalidCode = '';
    //   this.errors.invalidEvent = '';
    //   this.errors.invalidCodeAction = '';
    //   this.errors.invalidCountry = '';
    // },

    restrictKeys(e) {
      this.errors.invalidCode = '';
      // Must happen @keydown to preventing from being typed
      // TODO e.key and e.code not detected on mobile
      // if ready code contains any other char than num find index of that char and remove it
      if (e.key === '.' || e.key === ',' || e.code === 'NumpadDecimal' || e.keyCode === 110) e.preventDefault();
      if ((e.ctrlKey && e.key === 'v') ||
          (e.ctrlKey && e.key === 'c') ||
          (e.ctrlKey && e.key === 'x')) return;
      if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
    },

    typeCode(e) {
      let typedCode = e.target.value;
      let typedCodeLen = e.target.value.length;
      this.checkLength(typedCode, typedCodeLen);
    },

    pasteCode(e) {
      // Note Restrict e from being pasted
      e.preventDefault();
      let copiedCode = e.clipboardData.getData('text');
      copiedCode = copiedCode.replace(/\D/g, '');
      let copiedCodeLen = copiedCode.length;

      this.checkLength(copiedCode, copiedCodeLen);
    },

    checkLength(input, inputLen) {
      // @keyup logic! -- NOTE: @keydown will be more difficult to implement for mobile.
      // On keydown you cannot use e.target.value since it is empty on first keydown.
      // So theoretically e.key or e.code are needed, but they are not available mobile.
      if (inputLen > this.maxLen) {
        input = input.slice(0, this.maxLen);
      }

      this.codeInput = input;
      this.data.player_code = input;
    },

    validateCode(code) {
      if (!code) {
        this.errors.invalidCode = 'Please enter a Trainer Code.';
        return false;
      }

      let patternCount = (code.match(/000|0000|0001|1111|2222|3333|4444|5555|6666|7777|8888|9999|1234|4321|5678|8765|6789|9876/g) || []).length;

      if (patternCount > 2) {
        this.codeInput = '';
        this.errors.invalidCode = 'Please enter a valid Trainer Code.';
        return false;
      } else {
        this.errors.invalidCode = '';
        return true;
      }
    },
  }

}
</script>