<template>
  <div v-if="prevRouteName === 'RequestPasswordReset'" class="user__info">
      A link to reset your password has been send to your email.
  </div>
  <div v-else-if="prevRouteName === 'ResendActivationEmail'" class="user__info">
      A new activation link for your account has been send to your email.
      
  </div>
  <div v-else class="user__info">
      The request has been successful. Please check your email.
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'RequestSuccess',

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('setPrevRouteName', from.name);
        });
    },

    computed: {
        ...mapGetters({
            requestEmail: 'requestEmail',
            prevRouteName: 'prevRouteName',
        }),
    },

}
</script>

<style lang="scss">

</style>