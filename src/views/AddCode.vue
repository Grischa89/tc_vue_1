<template>
  <div>
    AddCode View!

     <h2>Add Your Own Code</h2>

    <form method="post" id="personForm" data-cities-url="" novalidate>
      <!-- {% csrf_token %}
      <table>
        {{ form.as_table }}
      </table> -->
     <!-- 
            Inside put your classic drop-down 
     -->
      <select name="country" @change="getCountry($event)" v-model="country">
        <option value selected>Country</option>
        <option 
          v-for="(country, i) in countries" 
          :key="i" 
          :value="country.slug">{{ country.name }}</option>
        <!-- <option value="Germany">Germany</option> 
        <option value="Spain">Spain</option>
        <option value="Japan">Japan</option>
        <option value="Mexico">Mexico</option>
        <option value="United States">United States</option> -->
      </select>

      <button type="submit">Save</button>
      <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
    </form>

    <div>
      {{ selectedCountry }}
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddCode',

  data() {
    return {
      country: '',
      cities: '',
    }
  },

  mounted() {
    this.$store.dispatch('getCountries');
  },

  computed: {
    ...mapGetters({
      countries: 'countries',
    }),

    selectedCountry() {
      return this.country;
      // console.log('selectedCountry', this.country);

    },
  },

  methods: {
    getCountry(event) {
      console.log('event.target.value', event.target.value);

      // const selectedCountry = { 'country': event.target.value };

      this.cities = this.$store.dispatch('getCities', event.target.value);

      console.log('this.cities', this.cities);
    },

  },

}
</script>

<style>

</style>