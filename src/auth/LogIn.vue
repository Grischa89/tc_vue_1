<template>

    <Form
        @on-submit="submitForm"
        :view="view"
        :title="title"
        :actionBtn="actionBtn"
        :errors="errors"
        :redirectProposal="redirectProposal" />

</template>

<script>
import Form from '../components/forms/Form.vue';

import { mapGetters } from 'vuex';

export default {
    name: 'LogIn',
    
    components: {
        Form,
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
            title: 'Welcome back!',
            view: 'LogIn',
            actionBtn: 'Login',
            errors: {
                unauthorized: '',
            },
            redirectProposal: {
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

                    this.toRouteName === 'AddCode' ? this.$router.push({ name: 'AddCode' }) : this.$router.push(`/my-account`);
                    
                } else {
                    this.errors.unauthorized = 'No active account found with the given credentials. Please try again.';
                    this.redirectProposal.routeName = 'ResendActivationEmail';
                    this.redirectProposal.textContent = 'Resend Activation Email?';
                }

            }  
        }
    }
}
</script>

<style lang="scss">
.form__info {
    margin: 1rem auto;

    &--error {
        color: $error-color;
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
        color: $error-color;
        font-weight: bold;
    }
}
</style>