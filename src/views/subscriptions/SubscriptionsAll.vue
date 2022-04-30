<template>
  <div v-if="subscriptions" class="subscription">
    <div class="subscription__item">
      <h1 class="profile__item__heading">Change Subscriptions</h1>
    </div>
    <div v-for="(subscription, i) in subscriptions" :key="i" class="subscription__item">
      <div class="subscription__item__task">
        <p>Action: {{ subscription.action }}</p>
        <p>Event: {{ subscription.event }}</p>
        <p>Trainer Code: {{ subscription.player_code }}</p>
      </div>
      <div class="subscription__item__actions">
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--edit" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="edit-subscription">
            <title id="edit-subscription">Edit Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--delete" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="delete-subscription">
            <title id="delete-subscription">Delete Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <!-- <div class="subscription__item">
      <div class="subscription__item__task">
        <p>Post Trainer Code on Twitter</p>
        <p>1547 4456 9683</p>
      </div>
      <div class="subscription__item__actions">
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--edit" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="edit-subscription">
            <title id="edit-subscription">Edit Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--delete" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="delete-subscription">
            <title id="delete-subscription">Delete Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div> -->
    <!-- <div class="subscription__item">
      <div class="subscription__item__task">
        <p>Post Trainer Code on Twitter</p>
        <p>1547 4456 9683</p>
      </div>
      <div class="subscription__item__actions">
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--edit" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="edit-subscription">
            <title id="edit-subscription">Edit Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="subscription__item__actions__btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="subscription__item__actions__btn--delete" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="delete-subscription">
            <title id="delete-subscription">Delete Subscription</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SubscriptionAll',

  created() {

    // if (this.user) console.log('user', this.user);
    // TODO: MOVE TO PROFILE
    this.$store.dispatch('fetchAllSubscriptions');
  },

  computed: {
    ...mapGetters({
      user: 'user',
      subscriptions: 'subscriptions',
    })
  }
}
</script>

<style lang="scss">
.subscription {
  display: grid;
  gap: 1.5rem;
  height: 100%;
  padding: 5%;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // position: relative;
    padding: 1rem .75rem;
    background-color: $white;
    // background: linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(33, 90%, 96%, 1) 19%, hsla(33, 92%, 85%, 1) 60%, hsla(33, 91%, 73%, 1) 100%);
    // border-left: 6px solid $in-between;
    border-left-width: .25rem;
    border-left-style: solid;
    border-left-color: $in-between;
    box-shadow: $card-shadow rgba($black, 0.2); 
    -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    -moz-box-shadow: $card-shadow rgba($black, 0.2);
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;

      &:first-of-type {
        justify-content: space-between;
        align-items: center;
        background-color: transparent;
        background: none;
        box-shadow: none;
        border: none;

        .profile__item__heading {
          margin: 0 auto;
            // padding: 0 .5rem;
            // box-shadow: inset 0 -.75rem 0 0 $in-between;
        }
      }

    &:nth-of-type(2n) {
      // background: linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(33, 100%, 95%, 1) 40%, hsla(33, 100%, 94%, 1) 60%, hsla(33, 100%, 85%, 1) 100%);
      // border-left: 6px solid $primary-darker;
      border-left-color: $primary-darker;
    }

    

    &__task {
      // display: flex;
      // flex-direction: column;
      text-align: left;
      // background-color: rgba($black, .1);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      min-width: 33.3%;

      &__btn {
        border-radius: .5rem;
        background-color: rgba($white, .5);
        padding: .5rem;
        margin-left: .5rem;

        &--edit {
          width: 1.5rem;
          height:1.5rem ;
          color: $help;
        }

        &--delete {
          width: 1.5rem;
          height: 1.5rem;
          color: $error;
        }
      }
    }
  }
}
</style>