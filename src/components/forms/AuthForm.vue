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

            <FormSubmitErrorForward
                :forwardSuggestion="forwardSuggestion" />

            <div v-if="formGroups.username" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': usernameErrors.invalidUsername}" for="username">Username</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': usernameErrors.invalidUsername}" type="text" id="username" name="username" placeholder="" autocomplete="on" v-model="data.username"  @blur="$store.dispatch('validateUsername', data.username)">
            
                <span v-if="usernameErrors.invalidUsername" class="form__group__help" :class="{'form__group__help--error': usernameErrors.invalidUsername}">{{ usernameErrors.invalidUsername }}</span>
            </div>

            <div v-if="formGroups.email" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': emailErrors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': emailErrors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="$store.dispatch('validateEmail', data.email)">
            
                <span v-if="emailErrors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': emailErrors.invalidEmail}">{{ emailErrors.invalidEmail }}</span>
            </div>

            <div v-if="formGroups.passwordRegex" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @input="$store.dispatch('validateOnInput', data.password)" @blur="$store.dispatch('validatePassword', data.password)">

                    <Transition name="req">
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
                    </Transition>
            </div>

            <div v-if="formGroups.rePassword" class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidRePassword}" for="re_password">Repeat Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="data.re_password" @input="$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password})" @blur="$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password})">
            
                <span v-if="passwordErrors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidRePassword}">{{ passwordErrors.invalidRePassword }}</span>     
            </div>

            <div v-if="formGroups.passwordBasic" class="form__group form__group--pw">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <div class="form__group__container">
                    <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" :type="type" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @blur="$store.dispatch('validateLoginPassword', data.password)">
                    <button @click="toggleVisibility" type="button" id="visibility-button" class="form__group__pw-visibility">{{ text }}</button>
                </div>         

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
import FormSubmitErrorForward from './FormSubmitErrorForward.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'AuthForm',

  components: {
    FormTitle,
    FormSubmitErrorMessage,
    FormSubmitErrorForward,
  },

  emits: ['onSubmit', 'toggleVisibility'],

  props: {
    view: String,
    title: String,
    formGroups: Object,
    actionBtn: String,
    errors: Object,
    forwardSuggestion: Object,
    // visibilityText: String,
    // inputType: String,
  },

  mounted() {
    this.$store.commit('setUsernameInvalidMessage', '');
    this.$store.commit('setEmailInvalidMessage', '');
    this.$store.commit('setPasswordInvalidMessage', '');
    this.$store.commit('setRePasswordInvalidMessage', '');
    // this.text = this.visibilityText;
    // this.type = this.inputType;
  },

  data() {
    return {
        text: 'Show',
        type: 'password',
        data: {
            username: '',
            email: '',
            password: '',
            re_password: '',
        },
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

    methods: {
        toggleVisibility() {
            this.text = this.text === 'Show' ? 'Hide' : 'Show';
            this.type = this.type === 'password' ? 'text' : 'password';
        }
    },

}
</script>

<style lang="scss">
.req-enter-active {
    transition: all 400ms cubic-bezier(1,.06,.27,1.04);
}

.req-leave-active {
    transition: all 500ms cubic-bezier(1,.06,.62,.97);
}

.req-enter-from {
    transform: translateY(-20px);
    opacity: 0;
}

.req-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.form__group__req {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: black;
    font-size: $mobile-help;
    margin-top: .5rem;

    &--error {
        display: flex;
        align-items: center;
        color: $error;
    }

    &--error:before {
        content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23c80000"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>');
        display: block;
        height: 1rem;
        width: 1rem;
        margin-right: .25rem;
    }
    
    &--success {
        display: flex;
        align-items: center;
        color: $success;
    }

    &--success:before {
        content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>');
        display: block;
        height: 1rem;
        width: 1rem;
        margin-right: .25rem;
    }
}
</style>