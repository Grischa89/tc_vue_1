<template>
  <div class="profile__resource">

    <!-- TODO: LOADING SKELETON -->
    <template v-if="loadStatus === 'loading'">
      <ProfileResourceItemSkeleton />
    </template>

    <!-- <AsyncErrorFetchingData v-if="loadStatus === 'error'">
      <template #title>
        Sorry &#128533;
      </template>

      <template #text>
        {{ errorRetrievingSubscriptions }}
      </template>

      <template #action>
        <button class="error__page__btn error__page__btn--action">
          <router-link :to="{ name: 'ProfileOverview' }">Back to Profile</router-link>
        </button>
      </template>
    </AsyncErrorFetchingData> -->

    <template v-if="loadStatus === 'success' && userCodes">
      <!-- <div class="subscription__item">
        <h1 class="profile__item__heading">Manage Subscriptions</h1>
      </div> -->
      <AddResourceButton
        :routeName="addCodesRouteName">
        <template #text>
          Add Trainer Code
        </template>
      </AddResourceButton>
      <div v-for="(code, i) in userCodes" :key="i" class="profile__resource__item">
        <template v-if="userCodes.length === 0">
          <div class="profile__resource__item profile__resource__item--empty">
            <p class="profile__resource__item__text">
              No Trainer Codes added yet. Get started now!
            </p>
          </div>
        </template>

        <template v-else-if="userCodes.length > 0">
          <div class="profile__resource__item__display">
            <div class="profile__resource__item__display__task">
              <div class="profile__resource__item__display__task__header">
                <h2># {{ i + 1 }}</h2>
              </div>
              <!-- TODO: Code in module formatieren -->
              <p class="profile__resource__item__display__task__row"><span>Trainer Code:</span> {{ code.player_code.replace(/.{4}/g, '$& ') }}</p>
              <p class="profile__resource__item__display__task__row"><span>Country:</span> <router-link :to="{ name: 'Country', params: { continent: code.continent_slug, country: code.country_slug } }" class="profile__resource__item__display__task__row__link">{{ code.country }}</router-link></p>
              <p class="profile__resource__item__display__task__row"><span>City:</span> <router-link :to="{ name: 'City', params: { continent: code.continent_slug, country: code.country_slug, city: code.city_slug } }" class="profile__resource__item__display__task__row__link">{{ code.city }}</router-link></p>
            </div>
            <div class="profile__resource__item__display__actions">
              <button class="profile__resource__item__display__actions__btn" @click="repostCode(code)">
                <!--  TODO: routerlink? -->
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__resource__item__display__actions__btn__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="post-code-again">
                  <title id="post-code-again">Post this code again</title>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <!-- <span class="profile__resource__item__display__actions__btn__text">Post again</span> -->
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import AddResourceButton from '../../components/buttons/AddResourceButton.vue';
import ProfileResourceItemSkeleton from '../../components/skeletons/ProfileResourceItemSkeleton.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'ProfileCodes',

  components: {
    AddResourceButton,
    ProfileResourceItemSkeleton,
  },

  data() {
    return {
      addCodesRouteName: 'AddCode',
      // errorRetrievingSubscriptions: 'Something went wrong retrieving your subscriptions.',
    }
  },

  // async created() {
  //   this.$store.dispatch('fetchAllSubscriptions');
  //   const fetchSubscriptionOptionsSuccess = await this.$store.dispatch('fetchSubscriptionOptions');
  // },

  computed: {
    ...mapGetters({
      loadStatus: 'userCodeLoadStatus',
      userCodes: 'userCodes',
    }),

    formatCode() {
      // Replace every 4 chars with the 4 chars plus a space
      return this.codeInput.replace(/.{4}/g, '$& ');
    },
  },

  methods: {
    repostCode(code) {
      console.log('%ccode', 'color: plum; font-weight: bold;', code);
      this.$store.commit('setCodeToRepost', code);
      this.$router.push({ name: 'AddCode'});
    }
  }
}
</script>

<style lang="scss">
.profile__resource {
  display: grid;
  gap: 1.5rem;
  height: 100%;
  // padding: 5%;

  &__item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // position: relative;
    padding: .75rem;
    background-color: var(--surface2);
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

    &__display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      // margin-bottom: 1.5rem;

      &__task {
        // display: flex;
        // flex-direction: column;
        text-align: left;

        &__header {
          display: flex;
          justify-content: flex-start;
          margin-bottom: .5rem;
          // text-transform: uppercase;
          font-weight: 600;
          font-size: $mobile-subheading;
        
          h2 {
            padding: 0 .25rem;
            box-shadow: inset 0 -.625rem 0 0 var(--textBackdropLight);
          }

          // h2:nth-of-type(2n) {
          //   box-shadow: inset 0 -.625rem 0 0 gray;
          //   color: red;
          // }
          
        }
        
        // background-color: rgba($black, .1);

        &__row {
          // margin: .25rem auto;
          margin-bottom: .25rem;

          &:last-of-type {
            margin-bottom: 0;
          }

          span {
            text-transform: uppercase;
            font-weight: 600;
          }
        }
        
      }

      &__actions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // min-width: 33.3%;
        // background-color: gray;
        height: 100%;

        &__btn {
          border-radius: 50%;
          // background-color: rgba($white, .5);
          padding: .5rem;
          margin: .25rem 0;
          // margin-left: .5rem;

          &:hover {
            background-color: var(--hover-button);
          }

          &:focus {
            background-color: var(--focus-button);
          }  

          &__prepend {
            width: 1.5rem;
            height: 1.5rem ;
            color: var(--help);

            &--delete {
              color: var(--error);
            }
          }

          // &__text {}
          
        }

        @media(min-width: 768px) {
          flex-direction: row;

          &__btn {
            margin: .25rem;
          }
        }
      }
    }

    &__edit {
      display: none;
      width: 100%;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid $help;
    }

    &:nth-of-type(2n) {
      // background: linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(33, 100%, 95%, 1) 40%, hsla(33, 100%, 94%, 1) 60%, hsla(33, 100%, 85%, 1) 100%);
      // border-left: 6px solid $primary-darker;
      border-left-color: $primary-darker;

      .profile__resource__item__display__task__header {
        h2 {
          box-shadow: inset 0 -.625rem 0 0 var(--textBackdropLight);
        }
      }
    }
    
  }
}
</style>