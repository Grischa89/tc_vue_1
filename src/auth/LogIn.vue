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
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="email">
            
                <span v-if="errors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': errors.invalidEmail}">{{ errors.invalidEmail }}</span>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="password">
            
                <span v-if="errors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidPassword}">{{ errors.invalidPassword }}</span>     
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
            email: '',
            password: '',
            errors: {
                invalidEmail: '',
                invalidPassword: '',
                unauthorized: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            user: 'user',
            toRouteName: 'toRouteName',
        }),
    },

    mounted() {
        // document.title = 'Log In | Djackets'
    },
    methods: {
        async submitForm() {

            this.errors.invalidEmail = '';
            this.errors.invalidPassword = '';
            this.errors.unauthorized = '';

            // TODO: Richtige Validierung wie bei AddCode.vue machen
            // TODO: W

            if (this.email === '') {
                this.errors.invalidEmail = 'Please enter an email address.';
            }

            if (this.password === '') {
                // TODO: Min amount of chars password has to have
                this.errors.invalidPassword = 'The password is too short.';
            }

            if (!this.errors.invalidEmail && !this.errors.invalidPassword) {

                // axios.defaults.headers.common["Authorization"] = ""
                localStorage.removeItem('tcAccess');
                localStorage.removeItem('tcRefresh');

                sessionStorage.removeItem('isAuthenticated');
                
                const formData = {
                    email: this.email,
                    password: this.password
                };

                const loginSuccess = await this.$store.dispatch('login', formData);

                if (loginSuccess === 200) {
                    // this.$store.dispatch('getAuthUser');
                    // TODO: Dispatch some action tr retrieve user data
                    // TODO: Hier wie cose with stein zu ehemaligem to.patch weiterleiten??
                    console.log('loginSuccess', loginSuccess);
                    // sessionStorage.setItem('isAuthenticated', JSON.stringify('true'));
                    this.$store.dispatch('getUserProfile', formData.email);

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