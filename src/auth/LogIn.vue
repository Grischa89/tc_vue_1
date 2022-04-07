<template>

    <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">

            <h2 v-if="user.username" class="form__title">Welcome Back, {{ user.username }}!</h2>
            <h2 v-else class="form__title">Welcome Back!</h2>

            <div v-if="errors.unauthorized" class="form__info form__info--error">
                {{ errors.unauthorized }}. Please try again.
            </div>

            <div v-if="this.errors.unauthorized" class="form__link form__link--error">
                <router-link :to="{ name: 'ResendActivationEmail' }">Resend Activation Email?</router-link>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': emailErrors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': emailErrors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="$store.dispatch('validateEmail', data.email)">
            
                <span v-if="emailErrors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': emailErrors.invalidEmail}">{{ emailErrors.invalidEmail }}</span>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @blur="$store.dispatch('validateLoginPassword', data.password)">
            
                <span v-if="passwordErrors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidPassword}">{{ passwordErrors.invalidPassword }}</span>     
            </div>

            <div class="form__link">
                <router-link :to="{ name: 'RequestPasswordReset' }">Forgot Password?</router-link>
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Login</button>
            </div>

            <div class="form__info">
                Don't have an account yet? <router-link to="/sign-up" class="form__info__link">Sign up!</router-link>
            </div>
        <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
        </form>

    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'LogIn',

    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.redirectedFrom) {
                vm.$store.commit('setToRouteName', to.redirectedFrom.name);
            }
        });
    },

    data() {
        return {
            data: {
                email: '',
                password: '',
            },
            errors: {
                unauthorized: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            user: 'user',
            toRouteName: 'toRouteName',
            emailErrors: 'emailErrors',
            passwordErrors: 'passwordErrors',
        }),
    },

    methods: {
        async submitForm() {
            this.errors.unauthorized = '';

            const validEmail = await this.$store.dispatch('validateEmail', this.data.email);
            const validPassword = await this.$store.dispatch('validateLoginPassword', this.data.password);

            if (!validEmail || !validPassword) return false;

            if (validEmail && validPassword) {

                localStorage.removeItem('tcAccess');
                localStorage.removeItem('tcRefresh');

                sessionStorage.removeItem('isAuthenticated');

                const loginSuccess = await this.$store.dispatch('login', this.data);

                if (loginSuccess === 200) {
                    // TODO: Hier wie cose with stein zu ehemaligem to.patch weiterleiten??
                    // TODO: Error handling when user object was not retrieved
                    this.$store.dispatch('getUserProfile', this.data.email);

                    this.toRouteName === 'AddCode' ? this.$router.push({ name: 'AddCode' }) : this.$router.push(`/my-account`);
                    
                } else {
                    // Hier wird direkt error message ausgegeben
                    this.errors.unauthorized = loginSuccess;
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