<template>
  <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">
            <h2 class="form__title">Request Passwort Reset</h2>

            <div v-if="errors.badRequest" class="form__info">
                {{ errors.badRequest }}
            </div>

            <div v-else class="form__info">
                To reset your password, please enter your email below.
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="email" required>
            
                <!-- <span v-if="errors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': errors.invalidEmail}">{{ errors.invalidEmail }}</span> -->
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
export default {
    name: 'RequestPasswordReset',

    data() {
        return {
            email: '',
            errors: {
                invalidEmail: '',
                badRequest: '',
            },
        }
    },

    methods: {
        async submitForm() {
            this.errors.invalidEmail = '';
            this.errors.badRequest = '';

            // TODO: Better email validation not only check for set but also for @ etc
            if (this.email === '') {
                this.errors.invalidEmail = 'Please enter an email address.';
            }

            if (!this.errors.invalidEmail) {
                
                const formData = {
                    email: this.email
                }

                const resetSuccess = await this.$store.dispatch('requestPasswordReset', formData);

                if (resetSuccess === 204) {
                    console.log('resetSuccess', resetSuccess);
                    this.$router.push({ name: 'RequestSuccess' });
                } else {
                    console.log('no success', resetSuccess);
                }
            }
        },
    }
}
</script>

<style>

</style>