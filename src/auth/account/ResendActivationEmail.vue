<template>
  <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">
            <h2 class="form__title">Resend Activation Email</h2>

            <div v-if="errors.badRequest" class="form__info form__info--error">
                {{ errors.badRequest }} Please <router-link :to="{ name: 'LogIn' }" class="form__info__link">log in</router-link>.
            </div>

            <div v-else class="form__info">
                To request a new activation link for your account, please enter your email below.
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': emailErrors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': emailErrors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="$store.dispatch('validateEmail', data.email)">
            
                <span v-if="emailErrors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': emailErrors.invalidEmail}">{{ emailErrors.invalidEmail }}</span>
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Send</button>
            </div>

            <!-- <div class="form__info">
                Don't have an account yet? <router-link to="/sign-up" class="form__info__link">Sign up!</router-link>
            </div> -->
        </form>

    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ResendActivationEmail',

    data() {
        return {
            data: {
                email: '',
            },
            errors: {
                invalidEmail: '',
                badRequest: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            emailErrors: 'emailErrors',
        })
    },

    methods: {
        async submitForm() {
            this.errors.badRequest = '';

            const validEmail = await this.$store.dispatch('validateEmail', this.data.email);

            if (!validEmail) return false;

            if (validEmail) {

                const resendSuccess = await this.$store.dispatch('resendActivationEmail', this.data);

                if (resendSuccess === 204) {
                    this.$router.push({ name: 'RequestSuccess' });
                } else {
                    this.errors.badRequest = 'This account has already been activated.';
                }
            }
        },
    }

}
</script>

<style lang="scss">
.form__info {
    &--error {
        color: $error-color;
    }
    
    &__link {
        font-weight: bold;
    }
}
</style>