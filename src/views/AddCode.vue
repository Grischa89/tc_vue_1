<template>
  <div class="form__container">
    
    <div class="form">
      <h2 class="form__title">Add Your Own Code</h2>

      <div class="form__group">
        <label class="form__group__label" :class="{'form__group__label--error': errors.invalidCode}" for="trainercode">Trainercode</label>
        <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidCode}" type="number" step="1" id="trainercode" name="trainercode" placeholder="0000 1111 2222" v-model="data.player_code" @keydown="restrictKeys($event)" @keyup="typeCode($event)" @paste="pasteCode($event)" @blur="validateCode(data.player_code)" required>

        
        <span v-if="formatCode" class="form__group__help">Your Trainer Code: {{ formatCode }}</span>
        <span v-if="errors.invalidCode" class="form__group__help" :class="{'form__group__help--error': errors.invalidCode}">{{ errors.invalidCode }}</span>
      </div>

      <div class="form__group">
        <label class="form__group__label" for="country">Country</label>
        <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCountry}" name="country" id="country"  @change="getCountry($event)" @blur="validateCountry(data.country)" v-model="data.country">
          <option value selected disabled >Choose A Country</option>
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
        <select class="form__group__input form__group__input--select" :class="{'form__group__input--error': errors.invalidCity}" name="city" id="city" @change="validateCity(data.city)" @blur="validateCity(data.city)" v-model="data.city" :disabled="!cities">
          <option value selected disabled>Choose A City</option>
          <option 
            v-for="(city, i) in cities"
            :key="i" 
            :value="city.slug">{{ city.name }}
          </option>
        </select>

        <span v-if="errors.invalidCity" class="form__group__help" :class="{'form__group__help--error': errors.invalidCity}" >{{ errors.invalidCity }}</span>
      </div>

      <div class="form__btn__container">
        <button class="form__btn form__btn--submit" @click="postCode">Save</button>
        <button class="form__btn form__btn--cancel" @click="cancelForm">Cancel</button>
      </div>
      <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
    </div>

    
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
        invalidCode: '',
        invalidCountry: '',
        invalidCity: ''
      },
      codeInput: '',
      // inputLen: '',
      maxLen: 12,
    }
  },

  created() {
    this.$store.dispatch('getCountries');
    console.log('typeof this.data.player_code', typeof this.data.player_code);
  },

  computed: {
    ...mapGetters({
      countries: 'countries',
      cities: 'cities',
    }),

    codeToAdd() {
      return this.data;
    },

    formatCode() {
      // Replace every 4 chars with the 4 chars plus a space
      return this.codeInput.replace(/.{4}/g, '$& ');
    }
  },

  methods: {
    postCode() {
      const validCode = this.validateCode(this.data.player_code);
      const validCountry = this.validateCountry(this.data.country);
      const validCity = this.validateCity(this.data.city);

      if (!validCode || !validCountry || !validCity) return false;
      
      if (validCode && this.data.country && this.data.city) {
        console.log('data', this.data);
      } 
      // this.$store.dispatch('addCode', this.data)
      //   .then(() => {
      //     this.$router.push(`/`);
      //   });

      // TODO: Catch error!
    },

    getCountry(event) {
      console.log('event.target.value', event.target.value);

      this.validateCountry(event.target.value);
      this.$store.dispatch('getCities', event.target.value);
    },

    // This can also prevent copy + paste invalid character
    // filterInput(e){
    //   e.target.value = e.target.value.replace(/[^0-9]+/g, '');
    // }

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
      console.log('len', inputLen);
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
$input-color: #999999;
$input-shadow: rgba($input-color, 0.4);
$error-color: #c80000;
$error-shadow: rgba($error-color, 0.4);
$placeholder-text: #7e7e7e;
$input-disabled-bg: #dedede;


.form__container {
  // display: flex;
  // justify-content: center;
  width: 90%;
  margin: 0 auto;
}

.form {
  background-color: #fff;
  padding: 1rem 0;
  border-radius: 0.75em;

  &__title {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__group {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
    margin: 1rem auto;

    &__label {
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
      padding: .25rem;
      border: 1.5px solid $input-color;
      border-radius: 0.25em;
      height: 5ch;
      // Width needed to stretch input fields to evenly
      width: 100%;

      &::placeholder {
        color: $placeholder-text;
      }

      &:-ms-input-placeholder {
        color: $placeholder-text;
      }

      &::-ms-input-placeholder {
        color: $placeholder-text;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px $input-shadow;
      }
  
      &--code {
        // Hide stepper arrows in Firefox
        -moz-appearance:textfield;
      }

      &--code::-webkit-outer-spin-button,
      &--code::-webkit-inner-spin-button {
        // Hide stepper arrows in Chrome, Safari
        -webkit-appearance: none;
        margin: 0;
      }

      &--error {
        outline: none;
        border: 1.5px solid $error-color;
      }

      &--error:focus {
        box-shadow: 0 0 0 2px $error-shadow;
      }

      &--select {
        background-color: #fff;
        color: $placeholder-text;

        &:disabled {
          background-color: $input-disabled-bg;
        }
      }


    }

    &__help {
      font-size: .75rem;
      margin-top: .25rem;
      // color: rgb(200, 0, 0);

      &--error {
        color: $error-color;
      } 
    }
  }

  &__btn__container {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  &__btn {
    margin: .5rem auto;
    padding: .75em 2.5em;
    text-transform: uppercase;
    letter-spacing: .05rem;
    font-weight: bold;
    // border: 2px solid black;
    // border-radius: 25px;

    &--submit {
      // border: 2px solid black;
      border-radius: 25px;
      color: #fff;
      background-color: #000;
    }

    &--cancel {
      color: #000;
    }
  }
}



</style>