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
    name: 'RequestPasswordReset',

    components: {
        Form,
    },

    data() {
        return {
            view: 'RequestPasswordReset',
            title: 'Request Passwort Reset',
            actionBtn: 'Send',
            errors: {
                badRequestPasswordReset: '',
            },
        }
    },

    methods: {
        async submitForm(data) {
            this.errors.badRequestPasswordReset = '';

            const resendActivationData = {
                email: data.email,
            }

            const validEmail = await this.$store.dispatch('validateEmail', data.email);

            if (!validEmail) return false;

            if (validEmail) {

                const resetSuccess = await this.$store.dispatch('requestPasswordReset', resendActivationData);

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