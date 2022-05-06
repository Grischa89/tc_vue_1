<template>

    <AuthForm
        @on-submit="submitForm"
        :view="view"
        :title="loginTitle"
        :formGroups="formGroups"
        :actionBtn="actionBtn"
        :errors="errors"
        :forwardSuggestion="forwardSuggestion" />

</template>

<script>
import AuthForm from '../components/forms/AuthForm.vue';

import { mapGetters } from 'vuex';

export default {
    name: 'LogIn',
    
    components: {
        AuthForm,
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.redirectedFrom) {
                vm.$store.commit('setToRouteName', to.redirectedFrom.name);
            }
        });
    },

    data() {
        return {
            view: 'LogIn',
            actionBtn: 'Login',
            formGroups: {
                username: false,
                email: true,
                passwordBasic: true,
                passwordRegex: false,
                rePassword: false,
            },
            errors: {
                unauthorized: '',
            },
            forwardSuggestion: {
                routeName: '',
                textContent: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            user: 'user',
            toRouteName: 'toRouteName',
        }),
        loginTitle() {
            const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

            return tc_user.username ? `Welcome back, ${tc_user.username}!` : `Welcome back!`;
        },
    },

    methods: {
        async submitForm(data) {
            this.errors.unauthorized = '';

            const loginData = {
                email: data.email,
                password: data.password
            }

            const validEmail = await this.$store.dispatch('validateEmail', data.email);
            const validPassword = await this.$store.dispatch('validateLoginPassword', data.password);

            if (!validEmail || !validPassword) return false;

            if (validEmail && validPassword) {
                localStorage.removeItem('tcAccess');
                localStorage.removeItem('tcRefresh');

                sessionStorage.removeItem('isAuthenticated');

                const loginSuccess = await this.$store.dispatch('login', loginData);

                if (loginSuccess === 200) {
                    // TODO: Hier wie cose with stein zu ehemaligem to.patch weiterleiten??
                    // TODO: Error handling when user object was not retrieved
                    this.$store.dispatch('getUserProfile', data.email);

                    this.toRouteName === 'AddCode' ? this.$router.push({ name: 'AddCode' }) : this.$router.push({ name: 'Profile' });
                    
                } else {
                    this.errors.unauthorized = 'No active account found with the given credentials. Please try again.';
                    this.forwardSuggestion.routeName = 'ResendActivationEmail';
                    this.forwardSuggestion.textContent = 'Resend Activation Email?';
                }

            }  
        }
    }
}
</script>

<style lang="scss">
.form__info {
    margin: .5rem 1rem;

    &--error {
        color: $error;
    }

    &__link {
        font-weight: bold;
    }
}

.form__link {
    display: flex;
    justify-content: flex-end;
    font-size: $mobile-help;
    padding: 0 1.125rem;

    &--error {
        color: $error;
        font-weight: bold;
    }
}
</style>