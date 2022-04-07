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
                <label class="form__group__label" :class="{'form__group__label--error': emailErrors.invalidEmail}" for="email">Email</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': emailErrors.invalidEmail}" type="email" id="email" name="email" placeholder="" autocomplete="on" v-model="data.email" @blur="$store.dispatch('validateEmail', data.email)">
            
                <span v-if="emailErrors.invalidEmail" class="form__group__help" :class="{'form__group__help--error': emailErrors.invalidEmail}">{{ emailErrors.invalidEmail }}</span>
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidPassword}" for="password">Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidPassword}" type="password" id="password" name="password" placeholder="" autocomplete="on" v-model="data.password" @input="$store.dispatch('validateOnInput', data.password)" @blur="$store.dispatch('validatePassword', data.password)">

                    <div v-if="passwordRequirements.validPassword === false"
                    class="form__group__req">
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
                
            </div>

            <div class="form__group">
                <label class="form__group__label" :class="{'form__group__label--error': passwordErrors.invalidRePassword}" for="re_password">Repeat Password</label>
                <input class="form__group__input form__group__input--code" :class="{'form__group__input--error': passwordErrors.invalidRePassword}" type="password" id="re_password" name="re_password" placeholder="" autocomplete="on" v-model="data.re_password" @blur="$store.dispatch('validateRePassword', { re_password: data.re_password, password: data.password})">
            
                <span v-if="passwordErrors.invalidRePassword" class="form__group__help" :class="{'form__group__help--error': passwordErrors.invalidRePassword}">{{ passwordErrors.invalidRePassword }}</span>     
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
                badRequest: '',
                unauthorized: '',
            },
        }
    },

    computed: {
        ...mapGetters({
            regexEmail: 'regexEmail',
            regexPassword: 'regexPassword',
            passwordRequirements: 'passwordRequirements',
            passwordErrors: 'passwordErrors',
            emailErrors: 'emailErrors',
        }),
    },

    methods: {
        
        async submitForm() {
            this.errors.badRequest = '';
            this.errors.unauthorized = '';

            const validUsername = this.validateUsername(this.data.username);
            const validEmail = await this.$store.dispatch('validateEmail', this.data.email);
            const validPassword = await this.$store.dispatch('validatePassword', this.data.password);
            const validRePassword = await this.$store.dispatch('validateRePassword', { re_password: this.data.re_password, password: this.data.password });

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

        // validateEmail(email) {
        //     if (!email) {
        //         this.errors.invalidEmail = 'Please enter an email address.';
        //         console.log('Missing email!');
        //         return false;
        //     } else if (!this.regexEmail.test(email)) {
        //         this.errors.invalidEmail = 'Please enter a valid email address.';
        //         console.log('Invalid email!');
        //         return false;
        //     } else {
        //         this.errors.invalidEmail = '';
        //         return true;
        //     }
        // },
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