<template>
  <div class="profile__overview" id="overview">
    <section>
      <h3 class="profile__overview__subheading">Trainer Codes you posted</h3>
      <ul v-if="userCodesForOverview" class="profile__overview__list">
          <li v-for="(code, i) in userCodesForOverview"
          class="profile__overview__list__item">{{ code.city }}, {{ code.country}}: {{ code.prettyCode }}</li>
      </ul>
        <router-link v-if="userCodesForOverview" class="profile__overview__link" to="/profiletest#codes">
          <span class="profile__overview__link__text">View all Trainer Codes</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="profile__overview__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-codes">
              <title id="all-codes">View your Trainer Codes</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
        <router-link class="profile__overview__link" to="#">
          <span class="profile__overview__link__text">Add Trainer Code</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="profile__overview__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-code">
              <title id="add-code">Add Trainer Code</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </router-link>
    </section>

    <section>
      <h3 class="profile__overview__subheading">Subscriptions for upcoming events</h3>
      <ul v-if="subscriptions" class="profile__overview__list">
          <li v-for="(sub, i) in subscriptions"
          class="profile__overview__list__item">{{ sub.message }}</li>
      </ul>
        <router-link v-if="subscriptions" class="profile__overview__link" to="/profiletest#subscriptions">
          <span class="profile__overview__link__text">View all subscriptions</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="profile__overview__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-subscriptions">
              <title id="all-subscriptions">View all subscriptions</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
        <router-link class="profile__overview__link" :to="{ name: 'AddSubscription'}">
          <span class="profile__overview__link__text">Add subscription</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="profile__overview__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-subscription">
              <title id="add-subscription">Add subscription</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </router-link>
    </section>
    <!-- <button class="profile__overview__button profile__overview__button--action"><router-link to="#">Add subscription
        <svg xmlns="http://www.w3.org/2000/svg" class="profile__overview__button__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-subscriptions">
            <title id="add-subscriptions">Add subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </router-link></button> -->
    <!-- <button class="profile__overview__button">View All Subscriptions</button> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfileOverview',

  created() {
    this.$store.dispatch('fetchAllSubscriptions');
  },

  computed: {
      ...mapGetters({
        user: 'user',
        subscriptions: 'subscriptions',
        userCodes: 'userCodes',
      }),
      subscriptionsForOverview() {
        console.log('%cthis.subscriptions', 'color: plum; font-weight: bold;', this.subscriptions);
        if (this.subscriptions && this.subscriptions.length > 3) {
          return this.subscriptions.slice(0, 3);
        }
        return this.subscriptions;
      },
      userCodesForOverview() {
        if (this.userCodes && this.userCodes.length > 3) {
          return this.userCodes.slice(0, 3);
        }
        return this.userCodes;
      }
    },
}
</script>
<style lang="scss">
.profile__overview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 1rem;
  background-color: $white;
  box-shadow: $card-shadow rgba($black, 0.2); 
  -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
  -moz-box-shadow: $card-shadow rgba($black, 0.2);
  border-radius: .5rem;

  section {
    margin-top: 1.5rem;

    &:first-of-type {
      margin: 0;
    }
  }

  // &__heading {}

  &__subheading {
    text-align: left;
    font-size: $mobile-subheading;
    font-weight: bold;
    line-height: 1.1;
  }

  &__list {
    // display: flex;
    // flex-direction: column;
    // align-items: flex-start;
    margin-top: 1rem;
    margin-bottom: 1rem;
    list-style-type: '—';
    list-style-position: outside;
    text-align: left;

    &__item {
      margin-left: .75rem;
      padding-left: .5rem;
      // display: flex;
      // justify-content: flex-start;
      // text-align: left;

      // &::before {
      //     content: '—';
      //     margin-right: .5rem;
      // }
    }
  }

  &__link, &__link a {
    display: flex;
    align-items: center;
    // margin-top: .25rem;
    margin-bottom: .5rem;
    text-decoration: underline;

    &__append, a .profile__item__link__append {
      margin-left: .5rem;
      height: $mobile-subheading;
      width: $mobile-subheading;
    }

    // &__text {}
  }

  // &__button {
  //   display: flex;
  //   align-items: center;
  //   text-transform: uppercase;
  //   font-size: $mobile-body;
  //   letter-spacing: .05rem;
  //   font-weight: bold;
  //   color: $help;
  //   padding: .375rem 1.5rem;
  //   margin-top: 1rem;
  //   margin-bottom: .25rem;
  //   -webkit-tap-highlight-color: $primary-darker;

  //   &--action {
  //     color: $white;
  //     background-color: $accent;
  //     border-radius: 25px;
  //     // font-weight: 600;
  //   }

  //   &__append {
  //     margin-left: .5rem;
  //     height: $mobile-subheading;
  //     width: $mobile-subheading;
  //   }
  // }
}
  
</style>