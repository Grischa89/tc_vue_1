<template>

    <AuthForm
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :formGroups="formGroups"
        :actionBtn="actionBtn"
        :errors="errors"
        :forwardSuggestion="forwardSuggestion" />

</template>

<script>
import AuthForm from '../../components/forms/AuthForm.vue';

export default {

    name: 'ResetPassword',

    components: {
        AuthForm,
    },

    data() {
        return {
            view: 'ResetPassword',
            title: 'Reset Your Password',
            actionBtn: 'Reset',
            formGroups: {
                username: false,
                email: false,
                passwordBasic: false,
                passwordRegex: true,
                rePassword: true,
            },
            errors: {
                badRequestResetPassword: '',
            },
            forwardSuggestion: {
                routeName: '',
                textContent: '',
            },
        }
    },

    methods: {

        async submitForm(data) {
            this.errors.badRequestResetPassword = '';

            const validPassword = await this.$store.dispatch('validatePassword', data.password);
            const validRePassword = await this.$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password });

            if (!validPassword || !validRePassword) return false;

            if (validPassword && validRePassword) {
                const resetPasswordData = {
                    'uid': this.$route.params.uid,
                    'token': this.$route.params.token,
                    'new_password': data.password,
                    're_new_password': data.re_password
                }

                const resetPasswordSuccess = await this.$store.dispatch('resetPasswordConfirm', resetPasswordData);

                if (resetPasswordSuccess === 204) {
                    this.$router.push({ name: 'LogIn'});
                } else if (resetPasswordSuccess === 400) {
                    console.log('Need to request reset link again. 400', resetPasswordSuccess);

                    this.errors.badRequestResetPassword = 'Invalid token for password reset.'; // TODO: Wenn PW mit token schon resetted, kommt 400 "token":["Invalid token for given user."], msg an user mit Weiterleitung an RequestFailure (ähnlich wie bei RequestSuccess)
                    // this.$router.push({ name: 'RequestPasswordReset' });
                    this.forwardSuggestion.routeName = 'RequestPasswordReset';
                    this.forwardSuggestion.textContent = 'Request New Reset Email?';
                } else {
                    console.log('Need to request reset link again. other than 400', resetPasswordSuccess);

                    this.errors.badRequestResetPassword = 'Something went wrong.';
                    this.forwardSuggestion.routeName = 'RequestPasswordReset';
                    this.forwardSuggestion.textContent = 'Request New Reset Email?';
                }
            }
        },
    }

}
</script>

<style>

</style>