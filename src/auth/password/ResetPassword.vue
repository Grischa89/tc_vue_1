<template>
    <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">
            <h2 class="form__title">Reset Your Password</h2>

            <div v-if="errors.badRequest" class="form__info">
                {{ errors.badRequest }}
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidPassword}" for="password">New Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="password">
            
                <span v-if="errors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidPassword}">{{ errors.invalidPassword }}</span>     
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidRePassword}" for="re_password">Repeat New Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="re_password">
            
                <span v-if="errors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidRePassword}">{{ errors.invalidRePassword }}</span>     
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Reset</button>
            </div>

        <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
        </form>

    
    </div>
</template>

<script>
export default {

    name: 'ResetPassword',

    data() {
        return {
            password: '',
            re_password: '',
            errors: {
                invalidPassword: '',
                invalidRePassword: '',
                badRequest: '',
            },
        }
    },

    methods: {

        async submitForm() {

            if (this.password === '') {
                // TODO: Min amount of chars password has to have
                this.errors.invalidPassword = 'The password is too short.';
            }

            if (this.password !== this.re_password) {
                this.errors.invalidRePassword = 'The passwords do not match.';
            }

            if (!this.errors.invalidPassword && !this.errors.invalidRePassword) {

                const formData = {
                    'uid': this.$route.params.uid,
                    'token': this.$route.params.token,
                    'new_password': this.password,
                    're_new_password': this.re_password
                }

                const resetPasswordSuccess = await this.$store.dispatch('resetPasswordConfirm', formData);

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
        }
    }

}
</script>

<style>

</style>