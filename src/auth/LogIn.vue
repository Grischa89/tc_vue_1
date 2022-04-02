<template>

    <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">

            <h2 v-if="user.username" class="form__title">Welcome Back, {{ user.username }}!</h2>
            <h2 v-else class="form__title">Welcome Back!</h2>

            <div v-if="errors.unauthorized" class="form__info">
                {{ errors.unauthorized }}. Please try again.
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

            <div class="form__link form__link--password">
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

    <!-- <div class="page-log-in">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Log in</h1>

                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Email: project.abramov@gmail.com</label>
                        <div class="control">
                            <input type="text" class="input" v-model="email" autocomplete="on">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password" autocomplete="on">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log in</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/sign-up">sign up here</router-link>!
                </form>
            </div>
        </div>
    </div> -->
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'LogIn',

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
                    this.$router.push(`/my-account`);
                } else {
                    // Hier wird direkt error message ausgegeben
                    this.errors.unauthorized = loginSuccess;
                }

            }

            // await axios
            //     .post("/api/v1/accounts/auth/jwt/create/", formData)
            //     .then(response => {
            //         const token = "Bearer " + response.data.access;
            //         // TODO: /users/me get user info
            //         // const username = JSON.parse(response.config.data)['email']
            //         this.$store.commit('setBearer', token);
                    
            //         axios.defaults.headers.common["Authorization"] = token;
            //         axios.defaults.headers.post['Content-Type'] = 'application/json';

            //         // localStorage.setItem('username', username)
            //         // localStorage.setItem("token", token);
            //         // localStorage.setItem('tcAccess', JSON.stringify(response.data.access));
            //         // localStorage.setItem('tcRefresh', JSON.stringify(response.data.refresh));

            //         this.$router.push(`/my-account/`)
            //         console.log('axios.defaults.headers.common["Authorization"]:', axios.defaults.headers.common["Authorization"])
            //         // console.log("username:", username)
            //         console.log("token:", token)

            //     })
            //     .catch(error => {
            //         // if (error.response) {
            //         //     for (const property in error.response.data) {
            //         //         this.errors.push(`${property}: ${error.response.data[property]}`)
            //         //     }
            //         // } else {
            //         //     this.errors.push('Something went wrong. Please try again')
                    
            //         // TODO: redirect to login with error message
            //         console.log(error);
            //         // }
            //     })   
        }
    }
}
</script>

<style lang="scss">
.form__info {
    margin: 2rem auto;

    &__link {
        font-weight: bold;
    }
}

.form__link {
    display: flex;
    justify-content: flex-end;
    font-size: $mobile-help;
    padding: 0 1.125rem;

    &--password {
        //
    }
}
</style>