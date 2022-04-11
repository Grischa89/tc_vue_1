<template>

  <div class="form__info form__info--error">
    {{ error }}
  </div>

</template>

<script>
export default {

  name: 'FormSubmitErrorMessage',

  props: ['error'],
  
}
</script>

<style>

</style>