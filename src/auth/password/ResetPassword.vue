<template>
    <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">
            <h2 class="form__title">Reset Your Password</h2>

            <div v-if="errors.badRequest" class="form__info">
                {{ errors.badRequest }}
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">New Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @input="$store.dispatch('validateOnInput', data.password)" @blur="$store.dispatch('validatePassword', data.password)">
            
                <div v-if="passwordRequirements.validPassword === false"
                    class="form__group__req">
                        <span  class="form__group__rdata.eq--info">
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

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidRePassword}" for="re_password">Repeat New Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="data.re_password" @blur="$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password})">
            
                <span v-if="passwordErrors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidRePassword}">{{ passwordErrors.invalidRePassword }}</span>     
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Reset</button>
            </div>
        </form>

    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

    name: 'ResetPassword',

    data() {
        return {
            data: {
                password: '',
                re_password: '',
            },
            errors: {
                badRequest: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            regexPassword: 'regexPassword',
            passwordRequirements: 'passwordRequirements',
            passwordErrors: 'passwordErrors',
        }),
    },

    methods: {

        async submitForm() {
            this.errors.badRequest = '';

            console.log('this.data', this.data);

            const validPassword = await this.$store.dispatch('validatePassword', this.data.password);
            const validRePassword = await this.$store.dispatch('validateRePassword', { re_password: this.data.re_password, password: this.data.password });

            console.log('validPassword || !validRePassword', validPassword, validRePassword);

            if (!validPassword || !validRePassword) return false;

            if (validPassword && validRePassword) {
                const data = {
                    'uid': this.$route.params.uid,
                    'token': this.$route.params.token,
                    'new_password': this.data.password,
                    're_new_password': this.data.re_password
                }

                const resetPasswordSuccess = await this.$store.dispatch('resetPasswordConfirm', data);

                if (resetPasswordSuccess === 204) {
                    this.$router.push({ name: 'LogIn'});
                } else if (resetPasswordSuccess === 400) {
                    console.log('Need to request reset link again. 400', resetPasswordSuccess);

                    this.errors.badRequest = 'Something went wrong. Please request a new reset link.';
                    this.$router.push({ name: 'RequestPasswordReset' });
                } else {
                    console.log('Need to request reset link again. other than 400', resetPasswordSuccess);

                    this.errors.badRequest = 'Something went wrong. Please request a new reset link.';
                    this.$router.push({ name: 'RequestPasswordReset' });
                }
            }
        },
    }

}
</script>

<style>

</style>