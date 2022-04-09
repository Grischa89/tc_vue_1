<template>

    <Form
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :actionBtn="actionBtn"
        :errors="errors"
        :forwardSuggestion="forwardSuggestion" />

</template>

<script>
import Form from '../../components/forms/Form.vue';

export default {
    name: 'ResendActivationEmail',

    components: {
        Form,
    },

    data() {
        return {
            view: 'ResendActivationEmail',
            title: 'Resend Activation Email',
            actionBtn: 'Send',
            errors: {
                badRequest: '',
            },
            forwardSuggestion: {
                routeName: '',
                textContent: '',
            },
        };
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
                const resendSuccess = await this.$store.dispatch('resendActivationEmail', resendActivationData);

                if (resendSuccess === 204) {
                    this.$router.push({ name: 'RequestSuccess' });
                } else {
                    this.errors.badRequest = `This account has already been activated.`;
                    this.forwardSuggestion.routeName = 'LogIn';
                    this.forwardSuggestion.textContent = 'Log in, please!';
                }
            }
        },
    },
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