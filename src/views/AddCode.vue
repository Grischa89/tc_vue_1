<template>
  <div class="form__container">

    <div v-if="errors.submitFailure" class="user__info">
        {{ errors.submitFailure }}
    </div>
    <div v-if="errors.loadCountries" class="user__info">
        {{ errors.loadCountries }}
    </div>
    <div v-if="errors.loadCities" class="user__info">
        {{ errors.loadCities }}
    </div>
    
    <!-- NOTE: div instead of form prevents form submit from numpad @mobile "Go" button -->
    <form class="form" @submit.prevent="submitForm">
      <h2 class="form__title">Add Your Own Code</h2>

      <div class="form__group">
        <label class="form__group__label" :class="{'form__group__label--error': errors.invalidCode}" for="trainercode">Trainercode</label>
        <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidCode}" type="number" step="1" id="trainercode" name="trainercode" placeholder="0000 1111 2222" v-model="data.player_code" @keydown="restrictKeys($event)" @keyup="typeCode($event)" @paste="pasteCode($event)" @blur="validateCode(data.player_code)">

        
        <span v-if="formatCode" class="form__group__help">Your Trainer Code: {{ formatCode }}</span>
        <span v-if="errors.invalidCode" class="form__group__help" :class="{'form__group__help--error': errors.invalidCode}">{{ errors.invalidCode }}</span>
      </div>

      <div class="form__group">
        <label class="form__group__label" for="country">Country</label>
        <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCountry}" name="country" id="country" @change="selectCountry($event)" @blur="validateCountry(data.country)" v-model="data.country">
          <option v-if="codeToRepost" :value="codeToRepost.country_slug" selected disabled>{{ codeToRepost.country }}</option>
          <option v-else value selected disabled >Choose A Country</option>
          <option
            v-for="(country, i) in countries"
            :key="i"
            :value="country.slug">{{ country.name }}</option>
        </select>
        
        <span v-if="errors.invalidCountry" class="form__group__help" :class="{'form__group__help--error': errors.invalidCountry}">{{ errors.invalidCountry }}</span>
      </div>

      <div class="form__group">
        <label class="form__group__label" for="city">City</label>
        <!-- disabled until country got chosen successfully -->
        <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCity}" name="city" id="city" @change="validateCity(data.city)" @blur="validateCity(data.city)" v-model="data.city" :disabled="!cities && !codeToRepost">
          <option v-if="codeToRepost" :value="codeToRepost.city_slug" selected disabled>{{ codeToRepost.city }}</option>
          <option v-else value selected disabled>Choose A City</option>
          <option 
            v-for="(city, i) in cities"
            :key="i" 
            :value="city.slug">{{ city.name }}
          </option>
        </select>

        <span v-if="errors.invalidCity" class="form__group__help" :class="{'form__group__help--error': errors.invalidCity}" >{{ errors.invalidCity }}</span>
      </div>

      <div class="form__btn__container">
        <button class="form__btn form__btn--submit" type="submit">Submit</button>
        <!-- <button class="form__btn form__btn--cancel" type="button" @click="cancelForm">Cancel</button> -->
      </div>
    </form>

    {{ cities }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddCode',

  data() {
    return {
      data: {
        country: '',
        city: '',
        player_code: '',
      },
      errors: {
        loadCountries: '',
        loadCities: '',
        invalidCode: '',
        invalidCountry: '',
        invalidCity: '',
        submitFailure: '',
      },
      codeInput: '',
      maxLen: 12,
    }
  },

  created() {
    if (this.codeToRepost) {
      this.data.player_code = this.codeToRepost.player_code;
      this.data.country = this.codeToRepost.country_slug;
      this.data.city = this.codeToRepost.city_slug;
    }

    // In case user picked a country, leaves route, then comes back (all without refresh)
    if (this.cities) this.$store.commit('setCities', null);

    this.$store.dispatch('getCountries')
      .catch(() => {
        this.errors.loadCountries = 'Something went wrong retrieving countries. Please reload the page or try again later.';
      });
  },

  computed: {
    ...mapGetters({
      countries: 'countries',
      cities: 'cities',
      codeToRepost: 'codeToRepost',
    }),

    formatCode() {
      // Replace every 4 chars with the 4 chars plus a space
      return this.codeInput.replace(/.{4}/g, '$& ');
    }
  },

  methods: {
    async submitForm() {
      console.log('this.data', this.data);
      const validCode = this.validateCode(this.data.player_code);
      const validCountry = this.validateCountry(this.data.country);
      const validCity = this.validateCity(this.data.city);

      console.log('submitForm', validCode, validCountry, validCity);

      if (!validCode || !validCountry || !validCity) return false;
      
      if (validCode && this.data.country && this.data.city) {
        console.log('data', this.data);
        const submitSuccess = await this.$store.dispatch('addCode', this.data);

        // TODO: Currently Zeitverzögerung bei /
        submitSuccess === 201 ? this.$router.push(`/profile`) : this.errors.submitFailure = 'Something went wrong. Please try again later.';
      }
    },

    selectCountry(e) {
      console.log('e.target.value', e.target.value);

      this.validateCountry(e.target.value);
      this.$store.dispatch('getCities', e.target.value)
        .then(res => {
          console.log('cities!', res);
        })
        .catch(() => {
          this.errors.loadCities = 'Something went wrong retrieving cities. Please reload the page or try again later.';
        });
    },

    // cancelForm() {
    //   this.data.player_code = '';
    //   this.codeInput = '';
    //   this.data.country = '';
    //   this.data.city = '';
      
    //   this.errors.invalidCode = '';
    //   this.errors.invalidCountry = '';
    //   this.errors.invalidCity = '';
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
      // console.log('len', inputLen);
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

    validateCountry(country) {
      if (!country) {
        this.errors.invalidCountry = 'Please choose a country.';
        console.log('this.errors.invalidCountry', this.errors.invalidCountry);
        return false;
      } else {
        this.errors.invalidCountry = '';
        return true;
      }
    },

    validateCity(city) {
      if (!city) {
        this.errors.invalidCity = 'Please choose a city.';
        console.log('this.errors.invalidCity', this.errors.invalidCity);
        return false;
      } else {
        this.errors.invalidCity = '';
        return true;
      }
    }

  },

}
</script>

<style lang="scss">
.form__container {
  // display: flex;
  // justify-content: center;
  width: 90%;
  // padding: 2rem;
  max-width: 24.3076923rem;
  margin: 0 auto 0 auto;

  // @media(min-width: 1024px) {
  //   width: 40%;
  // }
}

.form {
  background-color: #fff;
  padding: .75rem 0;
  border-radius: 0.75rem;
  // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
  box-shadow: $card-shadow rgba($black, 0.2); 
	-webkit-box-shadow: $card-shadow rgba($black, 0.2); 
	-moz-box-shadow: $card-shadow rgba($black, 0.2);

  &__title {
    margin: 1.5rem auto;
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;
    width: 80%;
  }

  &__group {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
    margin: 1rem auto;

    &__label {
      font-size: $mobile-body;
      text-transform: uppercase;
      letter-spacing: .05rem;
      font-weight: bold;
      margin-bottom: .25rem;

      // &--error {
      //   color: rgb(200, 0, 0);
      // }
    }

    &__input {
      display: block;
      font-size: $mobile-input;
      text-indent: .5rem;
      border: 1.5px solid $help;
      // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
      border-radius: 0.25em;
      height: 3rem;
      // Width needed to stretch input fields to evenly
      width: 100%;

      &::placeholder {
        color: $help;
      }

      &:-ms-input-placeholder {
        color: $help;
      }

      &::-ms-input-placeholder {
        color: $help;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px $help-shadow;
        // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.324);
      }
  
      &--code {
        // Hide stepper arrows in Firefox
        -moz-appearance:textfield;
        padding-left: .25rem;
      }

      &--code::-webkit-outer-spin-button,
      &--code::-webkit-inner-spin-button {
        // Hide stepper arrows in Chrome, Safari
        -webkit-appearance: none;
        margin: 0;
      }

      &--error {
        outline: none;
        border: 1.5px solid $error;
        // box-shadow: 0px 2px 8px 0px rgba($error, 0.2);
      }

      &--error:focus {
        box-shadow: 0 0 0 2px $error-shadow;
      }

      &--select {
        background-color: #fff;

        &:disabled {
          background-color: $disabled;
        }
      }


    }

    &__help {
      color: $help;
      font-size: $mobile-help;
      margin-top: .25rem;
      // color: rgb(200, 0, 0);

      &--error {
        color: $error;
      }
      
      &--success {
        color: $success;
      }
    }
  }

  &__btn__container {
    margin-top: 1.75rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  &__btn {
    margin: .5rem auto;
    padding: .75em 2.5em;
    text-transform: uppercase;
    font-size: $mobile-body;
    letter-spacing: .05rem;
    font-weight: bold;
    border-radius: 25px;
    -webkit-tap-highlight-color: transparent;

    &:active {
      outline: none;
      box-shadow: 0 0 0 2px $primary-darker;
    }

    &--submit {
      border-radius: 25px;
      color: $white;
      background-color: $secondary;
      -webkit-tap-highlight-color: $primary-darker;
    }

    &--cancel {
      color: $black;
    }
  }
}



</style>