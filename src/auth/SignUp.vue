<template>

    <div class="form__container">
    
        <form class="form" @submit.prevent="submitForm">
            <h2 class="form__title">Create An Account</h2>

            <div v-if="errors.unauthorized" class="form__info">
                {{ errors.unauthorized }}. Please try again.
            </div>

            <div v-if="errors.badRequest" class="form__info">
                {{ errors.badRequest }}
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidUsername}" for="username">Username</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidUsername}" type="text" id="username" name="username" placeholder="" autocomplete="on" v-model="username">
            
                <span v-if="errors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': errors.invalidUsername}">{{ errors.invalidUsername }}</span>
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

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidRePassword}" for="re_password">Repeat Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="re_password">
            
                <span v-if="errors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidRePassword}">{{ errors.invalidRePassword }}</span>     
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Sign up</button>
            </div>

            <div class="form__info">
                Already have an account? <router-link to="/log-in" class="form__info__link">Log in!</router-link>
            </div>
        <!-- <a href="{% url 'person_changelist' %}">Nevermind</a> -->
        </form>

    
    </div>

    <!-- <div class="page-sign-up">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Sign up</h1>

                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Username</label>
                        <div class="control">
                            <input type="text" class="input" v-model="username" autocomplete="on">
                        </div>
                    </div>

                    <div class="field">
                        <label>Email</label>
                        <div class="control">
                            <input type="email" class="input" v-model="email" autocomplete="on">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password" autocomplete="on">
                        </div>
                    </div>

                    <div class="field">
                        <label>Repeat password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="re_password" autocomplete="on">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Sign up</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/log-in">log in here</router-link>!
                </form>
            </div>
        </div>
    </div> -->
</template>

<script>

export default {

    name: 'SignUp',

    data() {
        return {
            username: '',
            email:'',
            password: '',
            re_password: '',
            errors: {
                invalidUsername: '',
                invalidEmail: '',
                invalidPassword: '',
                invalidRePassword: '',
                badRequest: '',
                unauthorized: '',
            },
        }
    },

    methods: {
        
        async submitForm() {

            this.errors.invalidUsername = '';
            this.errors.invalidEmail = '';
            this.errors.invalidPassword = '';
            this.errors.invalidRePassword = '';
            this.errors.badRequest = '';
            this.errors.unauthorized = '';

            // TODO: Richtige Validierung wie bei AddCode.vue machen

            if (this.username === '') {
                this.errors.invalidUsername = 'Please enter a username.';
            }

            if (this.email === '') {
                this.errors.invalidEmail = 'Please enter an email address.';
            }

            if (this.password === '') {
                // TODO: Min amount of chars password has to have
                this.errors.invalidPassword = 'The password is too short.';
            }

            if (this.password !== this.re_password) {
                this.errors.invalidRePassword = 'The passwords do not match.';
            }

            if (!this.errors.invalidUsername && !this.errors.invalidEmail && !this.errors.invalidPassword && !this.errors.invalidRePassword) {

                const userCreateData = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    re_password: this.re_password,
                };

                const createSuccess = await this.$store.dispatch('createUser', userCreateData);
                let loginSuccess;

                if (createSuccess === 201) {
                    const jwtCreateData = {
                        email: userCreateData.email,
                        password: userCreateData.password
                    };

                    loginSuccess = await this.$store.dispatch('login', jwtCreateData);
                } else {
                    // Catch api/v1/accounts/auth/users
                    // Handle 400 Bad Request TODO: Oder err.response.data.detail anzeigen?
                    // TODO: Sollen auch alle input felder geleert werden?
                    this.errors.badRequest = createSuccess;
                }

                if (loginSuccess === 200) {
                    this.$store.dispatch('getUserProfile', userCreateData.email);
                    this.$router.push(`/`);
                } else {
                    // catch /api/v1/accounts/auth/jwt/create/
                    // Hier wird direkt error message ausgegeben
                    this.errors.unauthorized = loginSuccess;
                }


                // axios.post("/api/v1/accounts/auth/users/", userCreateData)
                //     .then(response => {

                //         console.log("response: ", response)
                        
                //         const jwtCreateData = {
                //             email: this.email,
                //             password: this.password,

                //         }
                //         axios.post('/api/v1/accounts/auth/jwt/create/', jwtCreateData)
                //             .then(res => {
                //                 localStorage.setItem('user', JSON.stringify(response.data));
                //                 localStorage.setItem('user', JSON.stringify(response.data));
                //                 this.$router.push('/')
                                
                //                 console.log("res", res)
                //             })
                //             .catch(error => {
                //                 console.log('error jwt', error);
                //             }); 
                //     })
                //     .catch(error => {
                //         if (error.response) {
                //             for (const property in error.response.data) {
                //                 this.errors.push(`${property}: ${error.response.data[property]}`)
                //             }
                //             console.log(JSON.stringify(error.response.data))
                //         } else if (error.message) {
                //             this.errors.push('Something went wrong. Please try again')
                            
                //             console.log(JSON.stringify(error))
                //         }
                //     })
            }
        }
    }
}
</script>