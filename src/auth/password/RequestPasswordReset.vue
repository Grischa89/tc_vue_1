<template>

    <AuthForm
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :formGroups="formGroups"
        :actionBtn="actionBtn"
        :errors="errors"
        :forwardSuggestion="{}" />

</template>

<script>
import AuthForm from '../../components/forms/AuthForm.vue';

export default {
    name: 'RequestPasswordReset',

    components: {
        AuthForm,
    },

    data() {
        return {
            view: 'RequestPasswordReset',
            title: 'Request Passwort Reset',
            actionBtn: 'Send',
            formGroups: {
                username: false,
                email: true,
                passwordBasic: false,
                passwordRegex: false,
                rePassword: false,
            },
            errors: {
                badRequest: '',
            },
        }
    },

    methods: {
        async submitForm(data) {
            this.errors.badRequest = '';

            const resendActivationData = {
                email: data.email,
            }

            const validEmail = await this.$store.dispatch('validateEmail', data.email);

            if (!validEmail) return false;

            if (validEmail) {

                const resetSuccess = await this.$store.dispatch('requestPasswordReset', resendActivationData);

                if (resetSuccess === 204) {
                    this.$router.push({ name: 'RequestSuccess' });
                } else {
                    this.errors.badRequest = 'Something went wrong. Please try again.';
                }
            }
        },
    }
}
</script>

<style>

</style>