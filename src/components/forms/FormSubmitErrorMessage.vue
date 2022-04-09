<template>
  <!-- <div v-if="errors.unauthorized" class="form__info form__info--error">
    {{ errors.unauthorized }}
  </div> -->

  <div class="form__info form__info--error">
    {{ error }}
  </div>

</template>

<script>
export default {

  name: 'FormSubmitErrorMessage',

  props: ['error'],

  created() {
    // props are exposed on `this`
    console.log(this.error)
  }
  
}
</script>

<style>

</style>