<template>
    <div v-if="errors.badRequest" class="user__info user__info--error">
        {{ errors.badRequest }} Please <router-link :to="{ name: 'LogIn' }" class="user__info__link">log in</router-link>.
    </div>

    <div v-else-if="errors.forbidden" class="user__info user__info--error">
        {{ errors.forbidden }} Please <router-link :to="{ name: 'LogIn' }" class="user__info__link">log in</router-link>.
    </div>

    <div v-else class="user__info">
        Activating your account.
    </div>
</template>


<script>
export default {
    name: 'ActivateUser',
    data() {
        return {
            errors: {
                badRequest: '',
                forbidden: '',
            },
        }
    },
    async mounted() {
        this.errors.badRequest = '';
        this.errors.forbidden = '';

        const formData = {
            "uid": this.$route.params.uid,
            "token": this.$route.params.token
        };

        const activateSuccess = await this.$store.dispatch('activate', formData);

        console.log('activateSuccess', activateSuccess);
        console.log('activateSuccess typeof ', typeof activateSuccess);

        if (activateSuccess === 204) {
            this.$router.push('/log-in');
        } else if (activateSuccess === 400) {
            console.log('Need to request activation link again. 400', activateSuccess);

            this.errors.badRequest = 'This account has already been activated.';
            // this.$router.push('/resend-activation');
        } else {
            // forbidden 403 (stein hat hier in beiden !204 Fällen zu sign-up redirected)
            console.log('Need to request activation link again. 403', activateSuccess);

            this.errors.forbidden = 'This account has already been activated.';
            // this.$router.push('/resend-activation');
        }
    },
}
</script>

<style lang="scss">
.user__info {
    &--error {
        color: $error-color;
    }
    
    &__link {
        font-weight: bold;
    }
}
</style>