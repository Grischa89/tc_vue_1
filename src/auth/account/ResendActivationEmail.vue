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
    name: 'ResendActivationEmail',

    components: {
        AuthForm,
    },

    data() {
        return {
            view: 'ResendActivationEmail',
            title: 'Resend Activation Email',
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
        color: $error;
    }
    
    &__link {
        font-weight: bold;
    }
}
</style>