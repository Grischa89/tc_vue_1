<template>

    <Form
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :actionBtn="actionBtn"
        :errors="errors" />

</template>

<script>
import Form from '../../components/forms/Form.vue';

export default {

    name: 'ResetPassword',

    components: {
        Form,
    },

    data() {
        return {
            view: 'ResetPassword',
            title: 'Reset Your Password',
            actionBtn: 'Reset',
            errors: {
                badRequestResetPassword: '',
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

                    this.errors.badRequestResetPassword = 'Something went wrong. Please request a new reset link.'; // TODO: Wenn PW mit token schon resetted, kommt 400 "token":["Invalid token for given user."], msg an user mit Weiterleitung an RequestFailure (ähnlich wie bei RequestSuccess)
                    this.$router.push({ name: 'RequestPasswordReset' });
                } else {
                    console.log('Need to request reset link again. other than 400', resetPasswordSuccess);

                    this.errors.badRequestResetPassword = 'Something went wrong. Please request a new reset link.';
                    this.$router.push({ name: 'RequestPasswordReset' });
                }
            }
        },
    }

}
</script>

<style>

</style>