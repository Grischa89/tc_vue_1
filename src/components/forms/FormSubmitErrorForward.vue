<template>
  <!-- check route LogIn (this) + ResendActivationEmail: `Please <router-link :to="{ name: 'LogIn' }" class="form__info__link">log in</router-link>.` + password/ bla request-password-reset link-->
  <div class="form__link form__link--error">
      <router-link :to="{ name: forwardSuggestion.routeName }">{{ forwardSuggestion.textContent }}</router-link> 
  </div>
</template>

<script>
export default {

  name: 'FormSubmitErrorRedirect',

  props: {
    forwardSuggestion: Object,
  }

}
</script>

<style>

</style>