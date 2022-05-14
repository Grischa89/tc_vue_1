<template>
    
    <AuthForm
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :actionBtn="actionBtn"
        :formGroups="formGroups"
        :errors="errors"
        :forwardSuggestion="{}" />
        
</template>

<script>
import AuthForm from '../components/forms/AuthForm.vue';

import { mapGetters } from 'vuex';

export default {

    name: 'SignUp',

    components: {
        AuthForm,
    },

    data() {
        return {
            title: 'Create an Account',
            view: 'SignUp',
            actionBtn: 'Sign up',
            formGroups: {
                username: true,
                email: true,
                passwordBasic: false,
                passwordRegex: true,
                rePassword: true,
            },
            errors: {
                badRequest: '',
                unauthorized: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            toRouteName: 'toRouteName',
        }),
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

                    try {
                        // Get user data
                        // Either push to route user intended to visit (but was not authenticated) or to profile
                        await this.$store.dispatch('getUserProfile', data.email);
                        this.toRouteName ? this.$router.push({ name: `${this.toRouteName}` }) : this.$router.push({ name: 'Profile' });
                    } catch (err) {
                        // Handle error in getUserProfile (404)
                        // Perform logout() so user is treated as unauthenticated (tokens deleted + sessionStorage empty)
                        this.$store.dispatch('logout');

                        if (!this.errors.badRequest) {
                            this.errors.unauthorized = 'Your profile information could not be retrieved. Please try again.';
                        }
                    }
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