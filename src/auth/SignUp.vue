<template>
    
    <Form
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :actionBtn="actionBtn"
        :errors="errors"
        :forwardSuggestion="{}" />
        
</template>

<script>
import Form from '../components/forms/Form.vue';

export default {

    name: 'SignUp',

    components: {
        Form,
    },

    data() {
        return {
            title: 'Create an Account',
            view: 'SignUp',
            actionBtn: 'Sign up',
            errors: {
                badRequest: '',
                unauthorized: '',
            },
        }
    },

    methods: {
        
        async submitForm(data) {
            this.errors.badRequest = '';
            this.errors.unauthorized = '';

            const validUsername = await this.$store.dispatch('validateUsername', data.username);
            const validEmail = await this.$store.dispatch('validateEmail', data.email);
            const validPassword = await this.$store.dispatch('validatePassword', data.password);
            const validRePassword = await this.$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password });

            if (!validUsername || !validEmail || !validPassword || !validRePassword) return false;

            if (validUsername && validEmail && validPassword && validRePassword) {
                const createSuccess = await this.$store.dispatch('createUser', data);
                let loginSuccess;

                if (createSuccess === 201) {
                    const jwtCreateData = {
                        email: data.email,
                        password: data.password
                    };

                    loginSuccess = await this.$store.dispatch('login', jwtCreateData);
                } else {
                    // Catch api/v1/accounts/auth/users
                    // Handle 400 Bad Request TODO: Oder err.response.data.detail anzeigen?
                    // TODO: Sollen auch alle input felder geleert werden?
                    this.errors.badRequest = 'Something went wrong. Please try again.';
                }

                if (loginSuccess === 200) {
                    this.$store.dispatch('getUserProfile', data.email);

                    // TODO: Weiterleiten zu /my-account wie bei LogIn?
                    this.$router.push(`/`);
                } else {
                    // catch /api/v1/accounts/auth/jwt/create/
                    // Hier wird direkt error message ausgegeben
                    if (!this.errors.badRequest) {
                        this.errors.unauthorized = 'Something went wrong. Please try again.';
                    }
                }
            }
        },
    }
}
</script>

<style lang="scss">
.form__group__req {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: black;
    font-size: $mobile-help;
    margin-top: .5rem;
    // color: rgb(200, 0, 0);

    &--error {
        display: flex;
        align-items: center;
        color: $error-color;
    }

    &--error:before {
        content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23c80000"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>');
        display: block;
        height: 1rem;
        width: 1rem;
        margin-right: .25rem;
    }
    
    &--success {
        display: flex;
        align-items: center;
        color: $success-color;
    }

    &--success:before {
        content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>');
        display: block;
        height: 1rem;
        width: 1rem;
        margin-right: .25rem;
    }
}
</style>