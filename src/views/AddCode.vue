<template>
  <div class="form__container">
    
    <div class="form">
      <h2 class="form__title">Add Your Own Code</h2>

      <div class="form__group">
        <label class="form__group__label" for="trainercode">Trainercode</label>
        <input class="form__group__input form__group__input--code" type="number" step="1" id="trainercode" name="trainercode" placeholder="0000 1111 2222" v-model="data.player_code" @keydown="restrictKeys($event)" @keyup="typeCode($event)" @paste="pasteCode($event)" required>

        <!-- <span v-if="error" class="form__group__help">Please enter a valid trainercode.</span> -->
        <span v-if="formatCode" class="form__group__help">Your Trainer Code: {{ formatCode }}</span>
      </div>

      <div class="form__group">
        <label class="form__group__label" for="country">Country</label>
        <select class="form__group__input form__group__input--select" name="country" id="country" @change="getCountry($event)" v-model="data.country">
          <option value selected disabled >Choose A Country</option>
          <option
            v-for="(country, i) in countries"
            :key="i"
            :value="country.slug">{{ country.name }}</option>
        </select>
        
        <!-- <span class="form__group__help"></span> -->
      </div>

      <div class="form__group">
        <label class="form__group__label" for="city">City</label>
        <!-- disabled until country got chosen successfully -->
        <select class="form__group__input form__group__input--select" name="city" id="city" v-model="data.city" :disabled="!cities">
          <option value selected disabled>Choose A City</option>
          <!-- <option value="berlin">Berlin</option>
          <option value="bremen">Bremen</option>
          <option value="hamburg">Hamburg</option>
           -->
          <option 
            v-for="(city, i) in cities"
            :key="i" 
            :value="city.slug">{{ city.name }}
          </option>
        </select>

        <!-- <span class="form__group__help"></span> -->
      </div>

      <button @click="postCode">Save</button>
      <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
    </div>

    
  </div>

  <div>
    {{ data.player_code.length }}
  </div>

  <!-- <div v-if="cities">
      cities:
      {{ cities }}
    </div>

    <div>
      data:
      {{ data }}
    </div>

    <div>
      codeToAdd:
      {{ codeToAdd }}
    </div> -->
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

    // cityList() {
    //   return this.cities;
    // },

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
      this.$store.dispatch('addCode', this.data)
        .then(() => {
          this.$router.push(`/`);
        });

      // TODO: Catch error!
    },

    getCountry(event) {
      console.log('event.target.value', event.target.value);

      this.$store.dispatch('getCities', event.target.value);
    },

    // Dies sollte in length condition geprüft werden = dann, wenn Code EIngabe maximale
    // Zeichenzahl erreicht hat
    // (df.player_code.str.count("0001|0000|1111|2222|3333|4444|5555|6666|7777|8888|9999|1234|4321|5678|8765|6789|9876") < 3)

    // This can also prevent copy + paste invalid character
    // filterInput(e){
    //   e.target.value = e.target.value.replace(/[^0-9]+/g, '');
    // }

    restrictKeys(e) {
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

  },

}
</script>

<style lang="scss">
.form__container {
  display: flex;
  justify-content: center;
}

.form {
  &__group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 90%;
    margin: 1rem auto;

    &__label {
      text-transform: uppercase;
      letter-spacing: .05rem;
      font-weight: bold;
      margin-bottom: .25rem;
    }

    &__input {
      display: block;
      padding: .25rem;
      border: 1px solid #999;
      border-radius: 0.25em;
      height: 5ch;
      width: 100%;

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

      // &--select {
      //   // padding-right: 1rem;
      // }
    }

    &__help {
      font-size: .75rem;
      margin-top: .25rem;
      // color: rgb(200, 0, 0);
    }
  }
}

</style>