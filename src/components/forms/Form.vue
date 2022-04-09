<template>
  <div class="form__container">
    
        <form class="form" @submit.prevent="$emit('onSubmit', data)">

            <!-- <h2 v-if="user.username" class="form__title">Welcome Back, {{ user.username }}!</h2>
            <h2 v-else class="form__title">Welcome Back!</h2> -->

            <FormTitle
                :title="title" />

            <FormSubmitErrorMessage
                v-for="(error, i) in errors" :key="i"
                :error="error" />

            <!-- <div v-if="errors.unauthorizedSignup" class="form__info form__info--error">
                {{ errors.unauthorizedSignup }}. Please try again.
            </div> -->

            <!-- <div v-if="errors.badRequestSignup" class="form__info form__info--error">
                {{ errors.badRequestSignup }}
            </div> -->

            <!-- <div v-if="errors.unauthorizedLogin" class="form__info form__info--error">
                {{ errors.unauthorizedLogin }}. Please try again.
            </div> -->

            <!-- <div v-if="errors.badRequestResendActivaion" class="form__info form__info--error">
                {{ errors.badRequestResendActivaion }} Please <router-link :to="{ name: 'LogIn' }" class="form__info__link">log in</router-link>.
            </div> -->

            <!-- <div v-if="errors.badRequestPasswordReset" class="form__info form__info--error">
                {{ errors.badRequestPasswordReset }}
            </div> -->

            <!-- <div v-if="errors.badRequestResetPassword" class="form__info form__info--error">
                {{ errors.badRequestResetPassword }}
            </div> -->
            
            <!-- check route LogIn (this) + ResendActivationEmail: `Please <router-link :to="{ name: 'LogIn' }" class="form__info__link">log in</router-link>.` + password/ bla request-password-reset link-->
            <!-- <div v-if="errors.unauthorizedLogin" class="form__link form__link--error">
                <router-link :to="{ name: 'ResendActivationEmail' }">Resend Activation Email?</router-link> 
            </div> -->

            <div v-if="view === 'SignUp'" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': usernameErrors.invalidUsername}" for="username">Username</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': usernameErrors.invalidUsername}" type="text" id="username" name="username" placeholder="" autocomplete="on" v-model="data.username"  @blur="$store.dispatch('validateUsername', data.username)">
            
                <span v-if="usernameErrors.invalidUsername" class="form__group__help" :class="{'form__group__help--error': usernameErrors.invalidUsername}">{{ usernameErrors.invalidUsername }}</span>
            </div>

            <div v-if="view === 'LogIn' || view === 'SignUp' || view === 'ResendActivationEmail' || view === 'RequestPasswordReset'" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': emailErrors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': emailErrors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="$store.dispatch('validateEmail', data.email)">
            
                <span v-if="emailErrors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': emailErrors.invalidEmail}">{{ emailErrors.invalidEmail }}</span>
            </div>

            <div v-if="view === 'SignUp' || view === 'ResetPassword'" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @input="$store.dispatch('validateOnInput', data.password)" @blur="$store.dispatch('validatePassword', data.password)">

                    <span v-if="passwordErrors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidPassword}">{{ passwordErrors.invalidPassword }}</span> 

                    <div v-if="passwordRequirements.validPassword === false"
                    class="form__group__req">
                        <span  class="form__group__req--info">
                            Your password needs to:
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.letter.valid, 'form__group__req--success': passwordRequirements.letter.valid }">
                            {{ passwordRequirements.letter.message }}
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.digit.valid, 'form__group__req--success': passwordRequirements.digit.valid }">
                            {{ passwordRequirements.digit.message }}
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.length.valid, 'form__group__req--success': passwordRequirements.length.valid }">
                            {{ passwordRequirements.length.message }}
                        </span>
                    </div>
            </div>

            <div v-if="view === 'SignUp' || view === 'ResetPassword'" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidRePassword}" for="re_password">Repeat Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="data.re_password" @blur="$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password})">
            
                <span v-if="passwordErrors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidRePassword}">{{ passwordErrors.invalidRePassword }}</span>     
            </div>

            <div v-if="view === 'LogIn'" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @blur="$store.dispatch('validateLoginPassword', data.password)">
            
                <span v-if="passwordErrors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidPassword}">{{ passwordErrors.invalidPassword }}</span>     
            </div>

            <div v-if="view === 'LogIn'" class="form__link">
                <router-link :to="{ name: 'RequestPasswordReset' }">Forgot Password?</router-link>
            </div>

            <div v-if="actionBtn" class="form__btn__container">
                <button class="form__btn form__btn--submit">{{ actionBtn }}</button>
            </div>

            <div v-if="view === 'SignUp'" class="form__info">
                Already have an account? <router-link to="/log-in" class="form__info__link">Log in!</router-link>
            </div>

            <div v-if="view === 'LogIn'" class="form__info">
                Don't have an account yet? <router-link to="/sign-up" class="form__info__link">Sign up!</router-link>
            </div>
        </form>

    
    </div>
</template>

<script>
import FormTitle from './FormTitle.vue';
import FormSubmitErrorMessage from './FormSubmitErrorMessage.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Form',

  components: {
    FormTitle,
    FormSubmitErrorMessage,
  },

  emits: ['onSubmit'],

  props: {
    view: String,
    title: String,
    actionBtn: String,
    errors: Object,
  },

  created() {
    // props are exposed on `this`
    console.log(this.errors)
  },

  data() {
    return {
      data: {
          username: '',
          email: '',
          password: '',
          re_password: '',
      },
      // errors: {
      //     unauthorized: '',
      // },
    }
  },

  computed: {
      ...mapGetters({
          user: 'user',
          // toRouteName: 'toRouteName',
          emailErrors: 'emailErrors',
          passwordRequirements: 'passwordRequirements',
          passwordErrors: 'passwordErrors',
          usernameErrors: 'usernameErrors',
      }),
    },

}
</script>

<style>

</style>