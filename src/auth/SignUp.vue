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
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidUsername}" type="text" id="username" name="username" placeholder="" autocomplete="on" v-model="data.username"  @blur="validateUsername(data.username)">
            
                <span v-if="errors.invalidUsername" class="form__group__help" :class="{'form__group__help--error': errors.invalidUsername}">{{ errors.invalidUsername }}</span>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="validateEmail(data.email)">
            
                <span v-if="errors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': errors.invalidEmail}">{{ errors.invalidEmail }}</span>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @input="validateOnInput(data.password)" @blur="validatePassword(data.password)">
            
                <!-- <span v-if="errors.invalidPassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidPassword}">{{ errors.invalidPassword }}</span>      -->

                
                <template v-if="passwordRequirements.validPassword === false">
                    <div class="form__group__req">
                        <span  class="form__group__req--info">
                            Your password needs to:
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.letter.valid, 'form__group__req--success': passwordRequirements.letter.valid }">
                            {{ passwordRequirements.letter.message }}
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.digit.valid, 'form__group__req--success': passwordRequirements.digit.valid }">
                            {{ passwordRequirements.digit.message }}
                        </span>
                        <span :class="{'form__group__req--error': !passwordRequirements.length.valid, 'form__group__req--success': passwordRequirements.length.valid }">
                            {{ passwordRequirements.length.message }}
                        </span>
                    </div>
                </template>
                
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': errors.invalidRePassword}" for="re_password">Repeat Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': errors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="data.re_password" @blur="validateRePassword(data.re_password)">
            
                <span v-if="errors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': errors.invalidRePassword}">{{ errors.invalidRePassword }}</span>     
            </div>

            <div class="form__btn__container">
                <button class="form__btn form__btn--submit">Sign up</button>
            </div>

            <div class="form__info">
                Already have an account? <router-link to="/log-in" class="form__info__link">Log in!</router-link>
            </div>
        </form>

    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

    name: 'SignUp',

    data() {
        return {
            data: {
                username: '',
                email:'',
                password: '',
                re_password: '',
            },
            username: '',
            email:'',
            password: '',
            re_password: '',
            errors: {
                invalidUsername: '',
                invalidEmail: '',
                // invalidPassword: '',
                invalidRePassword: '',
                badRequest: '',
                unauthorized: '',
            },
            // passwordRequirements: {
            //     validPassword: null,
            //     letter: {
            //         message: 'include at least one letter.',
            //         valid: false,
            //     },
            //     digit: {
            //         message: 'include at least one number.',
            //         valid: false,
            //     },
            //     length: {
            //         message: 'be at least 8 characters long.',
            //         valid: false,
            //     },
            // },
        }
    },

    computed: {
        ...mapGetters({
            regexEmail: 'regexEmail',
            regexPassword: 'regexPassword',
            passwordRequirements: 'passwordRequirements',
            invalidPassword: 'invalidPassword',
        }),
    },

    methods: {
        
        async submitForm() {
            this.errors.badRequest = '';
            this.errors.unauthorized = '';

            const validUsername = this.validateUsername(this.data.username);
            const validEmail = this.validateEmail(this.data.email);
            const validPassword = await this.validatePassword(this.data.password);
            const validRePassword = this.validateRePassword(this.data.re_password);

            console.log('validUsername', validUsername);
            console.log('validEmail', validEmail);
            console.log('validPassword', validPassword);
            console.log('validRePassword', validRePassword);

            
            if (!validUsername || !validEmail || !validPassword || !validRePassword) return false;

            // TODO: Richtige Validierung wie bei AddCode.vue machen

            if (validUsername && validEmail && validPassword && validRePassword) {
                const createSuccess = await this.$store.dispatch('createUser', this.data);
                let loginSuccess;

                if (createSuccess === 201) {
                    const jwtCreateData = {
                        email: this.data.email,
                        password: this.data.password
                    };

                    loginSuccess = await this.$store.dispatch('login', jwtCreateData);
                } else {
                    // Catch api/v1/accounts/auth/users
                    // Handle 400 Bad Request TODO: Oder err.response.data.detail anzeigen?
                    // TODO: Sollen auch alle input felder geleert werden?
                    this.errors.badRequest = createSuccess;
                }

                if (loginSuccess === 200) {
                    this.$store.dispatch('getUserProfile', this.data.email);
                    this.$router.push(`/`);
                } else {
                    // catch /api/v1/accounts/auth/jwt/create/
                    // Hier wird direkt error message ausgegeben
                    this.errors.unauthorized = loginSuccess;
                }
            }
        },

        validateUsername(username) {
            if (!username) {
                this.errors.invalidUsername = 'Please enter a username.';
                return false;
            } else if (username.length < 3 || username.length > 12) {
                this.errors.invalidUsername = 'Please pick a username between 3 and 12 characters.';
                return false;
            } else { // TODO: if else with regex check? + length
                this.errors.invalidUsername = '';
                return true;
            }
        },

        validateEmail(email) {
            if (!email) {
                this.errors.invalidEmail = 'Please enter an email address.';
                console.log('Missing email!');
                return false;
            } else if (!this.regexEmail.test(email)) {
                this.errors.invalidEmail = 'Please enter a valid email address.';
                console.log('Invalid email!');
                return false;
            } else {
                this.errors.invalidEmail = '';
                return true;
            }
        },

        // validateLetter(password) {
        //     if (!this.regexPassword.letter.test(password)) {
        //         this.passwordRequirements.validPassword = false;
        //         return this.passwordRequirements.letter.valid = false;
        //     }

        //     return this.passwordRequirements.letter.valid = true;
        // },

        // validateDigit(password) {
        //     if (password.length < 8) {
        //         this.passwordRequirements.validPassword = false;
        //         return this.passwordRequirements.length.valid = false;
        //     }

        //     return this.passwordRequirements.length.valid = true;
        // },

        // validateLength(password) {
        //     if (!this.regexPassword.digit.test(password)) {
        //         this.passwordRequirements.validPassword = false;
        //         return this.passwordRequirements.digit.valid = false;
        //     }

        //     return this.passwordRequirements.digit.valid = true;
        // },

        // validatePW (password) {
        //     if (!password || !this.passwordRequirements.letter.valid || !this.passwordRequirements.digit.valid || !this.passwordRequirements.length.valid) {
        //         this.errors.invalidPassword = 'Please enter a valid password.';
        //         return false;
        //     }
        //     this.passwordRequirements.validPassword = true;
        //     this.errors.invalidPassword = '';
        //     return true;
        // },

        validateOnInput (password) {
            this.$store.dispatch('validateOnInput', password);
        },

        validatePassword(password) {
            return this.$store.dispatch('validatePassword', password);
        },

        // validatePassword(password) {
        //     if (!password) {
        //         this.errors.invalidPassword = 'Please enter a password.';
        //         return false;
        //     } else if (password.length < 8) {
        //         this.errors.invalidPassword = 'Your password must contain at least 8 characters.';
        //         return false;
        //     } else if (!this.regexPassword.test(password)) {
        //         this.errors.invalidPassword = 'Your password MUST contain at least one letter and one number!\
        //         It CAN contain only these special characters: @$!%*#?&+_-^';
        //         return false;
        //     } 
        //     else {
        //         this.errors.invalidPassword = '';
        //         return true;
        //     }
        // },

        validateRePassword(re_password) {
            if (!re_password) {
                this.errors.invalidRePassword = 'Please repeat the password.';
                console.log('Missing re_password!');
                return false;
            } else if (re_password !== this.data.password) {
                this.errors.invalidRePassword = 'The passwords do not match.';
                console.log('Not equal!');
                return false;
            } else {
                this.errors.invalidRePassword = '';
                return true;
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
    margin-top: .25rem;
    // color: rgb(200, 0, 0);

    &--error {
    color: $error-color;
    }
    
    &--success {
    color: $success-color;
    }
}
</style>