<template>
  <!-- <router-view></router-view> -->
  <div class="profile__resource">

    <!-- TODO: LOADING SKELETON -->
    <template v-if="loadStatus === 'loading'">
      <ProfileResourceItemSkeleton />
    </template>

    <AsyncErrorFetchingData v-if="loadStatus === 'error'">
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
    </AsyncErrorFetchingData>

    <template v-if="loadStatus === 'success' && subscriptions">
      <!-- <div class="subscription__item">
        <h1 class="profile__item__heading">Manage Subscriptions</h1>
      </div> -->
      <AddResourceButton
        :routeName="addSubscriptionsRouteName">
        <template #text>
          Add Subscription
        </template>
      </AddResourceButton>

      <template v-if="subscriptions.length === 0">
        <div class="profile__resource__item profile__resource__item--empty">
          <p class="profile__resource__item__text">No subscriptions added yet. Get started now!</p>
        </div>
      </template>

      <template v-else-if="subscriptions.length > 0">
        <template v-if="upcomingSubscriptions.length > 0">
          <div class="profile__resource__header">
            <h1>Upcoming Subscriptions</h1>
          </div>
          <div v-for="(subscription, i) in upcomingSubscriptions" :key="i" class="profile__resource__item">
            <div class="profile__resource__item__display" :data-subscription-id="subscription.pk">
              <div class="profile__resource__item__display__task">
                <div class="profile__resource__item__display__task__header">
                  <h2># {{ i + 1 }}</h2>
                </div>
                <!-- TODO: Code in module formatieren -->
                <p class="profile__resource__item__display__task__row"><span>Trainer Code:</span> {{ subscription.player_code.replace(/.{4}/g, '$& ') }}</p>
                <p class="profile__resource__item__display__task__row"><span>Event:</span> {{ subscription.event_name }}</p>
                <p class="profile__resource__item__display__task__row"><span>Type:</span> {{ subscription.action_name }}</p>
          
          
              </div>
              <div class="profile__resource__item__display__actions">
                <button class="profile__resource__item__display__actions__btn" @click="showEditForm(subscription)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="profile__resource__item__display__actions__btn__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-labelledby="edit-subscription">
                    <title id="edit-subscription">Edit Subscription</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <!-- <span class="profile__resource__item__display__actions__btn__text">Edit</span> -->
                </button>
                <!-- deleteSubscription(subscription.pk, i) -->
                <button class="profile__resource__item__display__actions__btn" @click.prevent="openDeleteModal(subscription, i)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="profile__resource__item__display__actions__btn__prepend profile__resource__item__display__actions__btn__prepend--delete" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-labelledby="delete-subscription">
                    <title id="delete-subscription">Delete Subscription</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <!-- <span class="profile__resource__item__display__actions__btn__text">Delete</span> -->
                </button>
              </div>
              <Teleport to="body">
                <SubscriptionDeleteModal
                  v-if="open"
                  @on-confirm="deleteSubscription"
                  @on-cancel="cancelDelete" />
              </Teleport>
            </div>
              <div class="profile__resource__item__edit" :data-edit-id="subscription.pk" ref="subscriptionItemEdit">
                <form class="inline-form" @submit.prevent="submitForm(subscription.pk, i, subscription.isActive)">
                  <div class="inline-form__title">Edit Subscription</div>
                  <div v-if="errors.submitFailure" class="user__info">
                    {{ errors.submitFailure }}
                  </div>
          
                  <div class="inline-form__group">
                    <label class="inline-form__group__label" :class="{'inline-form__group__label--error': errors.invalidCode}" for="trainercode">Trainercode</label>
                    <input class="inline-form__group__input inline-form__group__input--code" :class="{'inline-form__group__input--error': errors.invalidCode}" type="number" step="1" id="trainercode" name="trainercode" placeholder="0000 1111 2222" v-model="data.player_code" data-input-code @keydown="restrictKeys($event)" @keyup="typeCode($event)" @paste="pasteCode($event)" @blur="validateCode(data.player_code)">
                    <span v-if="formatCode" class="form__group__help">Your Trainer Code: {{ formatCode }}</span>
                    <span v-if="errors.invalidCode" class="inline-form__group__help" :class="{'inline-form__group__help--error': errors.invalidCode}">{{ errors.invalidCode }}</span>
                  </div>
                  <div class="inline-form__group">
                    <label class="inline-form__group__label" for="eventOptions">Event</label>
                    <select class="inline-form__group__input inline-form__group__input--select" :class="{'inline-form__group__input--error': errors.invalidEvent}" name="eventOptions" id="eventOptions" data-input-event @blur="validateEvent(data.event)" v-model="data.event" :disabled="!eventOptions">
                      <option value selected disabled >Choose An Event</option>
                      <option
                        v-for="(event, i) in eventOptions"
                        :key="i"
                        :value="event.id">{{ event.name }}</option>
                    </select>
                    <span v-if="errors.invalidEvent" class="inline-form__group__help" :class="{'inline-form__group__help--error': errors.invalidEvent}">{{ errors.invalidEvent }}</span>
                  </div>
                  <div class="inline-form__group">
                    <label class="inline-form__group__label" for="codeActions">Subscription Type</label>
                    <select class="inline-form__group__input inline-form__group__input--select" :class="{'inline-form__group__input--error': errors.invalidCodeAction}" name="codeActions" id="codeActions" data-input-type @blur="validateCodeAction(data.action)" v-model="data.action" :disabled="!codeActionOptions">
                      <option value selected disabled>Choose A Subscription Type</option>
                      <option
                        v-for="(action, i) in codeActionOptions"
                        :key="i"
                        :value="action[0]">{{ action[1] }}
                      </option>
                    </select>
                    <span v-if="errors.invalidCodeAction" class="inline-form__group__help" :class="{'inline-form__group__help--error': errors.invalidCodeAction}" >{{ errors.invalidCodeAction }}</span>
                  </div>
                  <div class="inline-form__btn__container">
                    <button class="inline-form__btn inline-form__btn--submit" type="submit">Save</button>
                    <button class="inline-form__btn inline-form__btn--cancel" type="button" @click="cancelEditForm(subscription.pk)">Cancel</button>
                  </div>
                </form>
              </div>
          </div>
        </template>

        <template v-if="doneSubscriptions.length > 0">
          <div class="profile__resource__header">
            <h1>Past Subscriptions</h1>
          </div>
          <div v-for="(subscription, i) in doneSubscriptions" :key="i" class="profile__resource__item profile__resource__item--inactive">
            <div class="profile__resource__item__display__task">
              <!-- <div class="profile__resource__item__display__task__header">
                <h2># {{ i + 1 }}</h2>
              </div> -->
              <!-- TODO: Code in module formatieren -->
              <p class="profile__resource__item__display__task__row"><span>Trainer Code:</span> {{ subscription.player_code.replace(/.{4}/g, '$& ') }}</p>
              <p class="profile__resource__item__display__task__row"><span>Event:</span> {{ subscription.event_name }}</p>
              <p class="profile__resource__item__display__task__row"><span>Type:</span> {{ subscription.action_name }}</p>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import SubscriptionDeleteModal from '../../components/modals/SubscriptionDeleteModal.vue';
import AddResourceButton from '../../components/buttons/AddResourceButton.vue';
import ProfileResourceItemSkeleton from '../../components/skeletons/ProfileResourceItemSkeleton.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'ProfileSubscriptions',

  components: {
    SubscriptionDeleteModal,
    AddResourceButton,
    ProfileResourceItemSkeleton,
  },

  data() {
    return {
      addSubscriptionsRouteName: 'AddSubscription',
      editing: false,
      data: {
        player_code: '',
        event: '',
        action: '',
      },
      errors: {
        invalidCode: '',
        invalidEvent: '',
        invalidCodeAction: '',
        invalidCountry: '',
        loadSubscriptionOptions: '',
        loadTimezone: '',
        loadCountries: '',
        submitFailure: '',
      },
      codeInput: '',
      maxLen: 12,
      openModal: false,
      subscriptionToDelete: {
        pk: '',
        action: '',
        event: '',
        player_code: '',
        index: '',
      },
      errorRetrievingSubscriptions: 'Something went wrong retrieving your subscriptions.',
    }
  },

  async created() {
    // if (this.user) console.log('user', this.user);
    // TODO: MOVE TO PROFILE
    // this.$store.dispatch('fetchAllSubscriptions');
    const fetchSubscriptionOptionsSuccess = await this.$store.dispatch('fetchSubscriptionOptions');
  },

  beforeRouteLeave (to, from) {
    if (this.open === true) {
      document.body.style.overflow = 'auto';
      this.$store.commit('toggleModal', false);
      return false;
    }
    return true
  },

  computed: {
    ...mapGetters({
      user: 'user',
      subscriptions: 'subscriptions',
      loadStatus: 'subscriptionLoadStatus',
      eventOptions: 'eventOptions',
      codeActionOptions: 'codeActionOptions',
      open: 'modalOpen',
    }),

    formatCode() {
      // Replace every 4 chars with the 4 chars plus a space
      return this.codeInput.replace(/.{4}/g, '$& ');
    },

    upcomingSubscriptions() {
      // return this.subscriptions.filter(subscription => subscription.action === 'GET_CODES_TO_YOUR_EMAIL');
      return this.subscriptions.filter(subscription => subscription.status === 'created');
    },

    doneSubscriptions() {
      // return this.subscriptions.filter(subscription => subscription.action === 'POST_YOUR_CODE_ON_TWITTER');
      return this.subscriptions.filter(subscription => subscription.status === 'done');
    }
  },

  methods: {
    async submitForm(pk, index, isActive) {
      const validCode = this.validateCode(this.data.player_code);
      const validEvent = this.validateEvent(this.data.event);
      const validCodeAction = this.validateCodeAction(this.data.action);

      if (!pk || !validCode || !validEvent || !validCodeAction) return false;

      if (pk && validCode && validEvent && validCodeAction) {

        const submitSuccess = await this.$store.dispatch('updateSubscription', { pk: pk, index: index, data: this.data });

        if (submitSuccess === 200) {
          const editArea = document.querySelector(`[data-edit-id="${pk}"]`);
          // editArea.scrollTo({
          //   top: 0,
          //   left: 0,
          //   behavior: 'smooth'
          // });
          editArea.style.display = 'none';
        } else {
          this.errors.submitFailure = 'We could not update your subscription. Please try again later.';
        }
      }
    },

    showEditForm(subscription) {
      console.log('%csubscription', 'color: plum; font-weight: bold;', subscription);
      const editArea = document.querySelector(`[data-edit-id="${subscription.pk}"]`);
      const inputCode = document.querySelector(`[data-edit-id="${subscription.pk}"] [data-input-code]`);
      const inputEvent = document.querySelector(`[data-edit-id="${subscription.pk}"] [data-input-event]`);
      const inputType = document.querySelector(`[data-edit-id="${subscription.pk}"] [data-input-type]`);

      if (window.getComputedStyle(editArea).display === 'none') {
        inputCode.value = subscription.player_code;
        this.data.player_code = subscription.player_code;

        inputEvent.selectedIndex = subscription.event;
        this.data.event = subscription.event;

        inputType.selectedIndex = subscription.action;
        this.data.action = subscription.action;

        editArea.style.display = 'block';
      } else {
        editArea.style.display = 'none';
      }
    },

    cancelEditForm(pk) {
      document.querySelector(`[data-edit-id="${pk}"]`).style.display = 'none';
    },

    openDeleteModal(subscription, index) {
      // Disable scroll on modal background (body)
      document.body.style.overflow = 'hidden';

      subscription.index = index;
      this.$store.commit('setSubscriptionToDelete', subscription);

      this.$store.commit('toggleModal', true);
    },

    cancelDelete() {
      // Enable scroll on modal background (body)
      document.body.style.overflow = 'auto';

      this.$store.commit('toggleModal', false);
    },

    deleteSubscription(data) {
      document.body.style.overflow = 'auto';
      this.$store.dispatch('deleteSubscription', { pk: data.pk, index: data.index });
      this.$store.commit('toggleModal', false);
    },

    restrictKeys(e) {
      this.errors.invalidCode = '';
      // Must happen @keydown to preventing from being typed
      // TODO e.key and e.code not detected on mobile
      // if ready code contains any other char than num find index of that char and remove it
      if (e.key === '.' || e.key === ',' || e.code === 'NumpadDecimal' || e.keyCode === 110) e.preventDefault();
      if ((e.ctrlKey && e.key === 'v') ||
          (e.ctrlKey && e.key === 'c') ||
          (e.ctrlKey && e.key === 'x')) return;
      if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
    },

    typeCode(e) {
      let typedCode = e.target.value;
      let typedCodeLen = e.target.value.length;
      this.checkLength(typedCode, typedCodeLen);
    },

    pasteCode(e) {
      // Note Restrict e from being pasted
      e.preventDefault();
      let copiedCode = e.clipboardData.getData('text');
      copiedCode = copiedCode.replace(/\D/g, '');
      let copiedCodeLen = copiedCode.length;

      this.checkLength(copiedCode, copiedCodeLen);
    },

    checkLength(input, inputLen) {
      // console.log('len', inputLen);
      // @keyup logic! -- NOTE: @keydown will be more difficult to implement for mobile.
      // On keydown you cannot use e.target.value since it is empty on first keydown.
      // So theoretically e.key or e.code are needed, but they are not available mobile.
      if (inputLen > this.maxLen) {
        input = input.slice(0, this.maxLen);
      }

      this.codeInput = input;
      this.data.player_code = input;
    },

    validateCode(code) {
      if (!code) {
        this.errors.invalidCode = 'Please enter a Trainer Code.';
        return false;
      }

      let patternCount = (code.match(/000|0000|0001|1111|2222|3333|4444|5555|6666|7777|8888|9999|1234|4321|5678|8765|6789|9876/g) || []).length;

      if (patternCount > 2) {
        this.codeInput = '';
        this.errors.invalidCode = 'Please enter a valid Trainer Code.';
        return false;
      } else {
        this.errors.invalidCode = '';
        return true;
      }
    },

    validateEvent(event) {
      if (!event) {
        this.errors.invalidEvent = 'Please choose an event.';
        console.log('this.errors.invalidEvent', this.errors.invalidEvent);
        return false;
      } else {
        this.errors.invalidEvent = '';
        return true;
      }
    },

    validateCodeAction(action) {
      if (!action) {
        this.errors.invalidCodeAction = 'Please choose a subscription type.';
        console.log('this.errors.invalidCodeAction', this.errors.invalidCodeAction);
        return false;
      } else {
        this.errors.invalidCodeAction = '';
        return true;
      }
    },
  }
}
</script>

<style lang="scss">
.profile__resource {
  display: grid;
  gap: 1.5rem;
  height: 100%;
  width: 100%;

  &__header {
    h1 {
      color: var(--text);
      font-size: $mobile-subheading;
      text-align: left;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: .05rem;
    }
  }

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
    border: .0625rem solid var(--border);
    border-left-width: .25rem;
    border-left-style: solid;
    border-left-color: $in-between;
    box-shadow: $card-shadow rgba($black, 0.2); 
    -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    -moz-box-shadow: $card-shadow rgba($black, 0.2);
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;

    &--empty {
      border: none;
      border-radius: .5rem;
      background-color: transparent;
      box-shadow: none; 
      -webkit-box-shadow: none; 
      -moz-box-shadow: none;
    }

    &--inactive {
      align-items: flex-start;
      background-color: rgba($help, .1);
      color: rgba($black, .5);
      border-left-color: rgba($help, .2);
      cursor: default;
    }

    &__text {
      padding: 1rem 0;
      // font-style: italic;
      font-size: $mobile-body;
      letter-spacing: .025rem;
      font-weight: 500;
    }

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
            box-shadow: inset 0 -.625rem 0 0 var(--textBackdrop);
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

          &__link:hover, .router-link-active {
            text-decoration: underline;
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
          border-radius: .5rem;
          // background-color: rgba($white, .5);
          padding: .5rem;
          margin: .25rem 0;
          // margin-left: .5rem;

          &__prepend {
            width: 1.5rem;
            height: 1.5rem ;
            color: var(--help);

            &--delete {
              color: var(--error);
            }
          }

          // TODO ~maybe
          // @include tablet {
          //   display: flex;
          //   align-items: center;

          //   &::after {
          //     content: 'Repost';
          //     margin-left: .5rem;
          //   }
          // }

          // &__text {}
          
        }

        @include tablet {
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
      // transition: all 1000ms ease-in-out;
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

.inline-form {
  // width: 90%;
  background-color: var(--surface2);
  // padding: .75rem 0;

  &__title {
    margin: 0 auto 1rem auto;
    padding: 0 .25rem;
    font-size: $mobile-subheading;
    font-weight: bold;
    text-transform: uppercase;
    // box-shadow: $line-behind-light;
  }

  &__group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 75%;
    margin: .5rem auto;

    &__label {
      font-size: $mobile-body;
      margin-bottom: .25rem;
    }

    &__input {
      display: block;
      font-size: $mobile-input;
      text-indent: .5rem;
      border: .0625rem solid var(--border-input);
      border-radius: 0.25em;
      height: 2.5rem;
      width: 100%;

      &::placeholder {
        color: var(--help);
      }

      &:-ms-input-placeholder {
        color: var(--help);
      }

      &::-ms-input-placeholder {
        color: var(--help);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--help-shadow);
        // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.324);
      }

      &--code {
        // Hide stepper arrows in Firefox
        -moz-appearance:textfield;
        padding-left: .25rem;
      }

      &--code::-webkit-outer-spin-button,
      &--code::-webkit-inner-spin-button {
        // Hide stepper arrows in Chrome, Safari
        -webkit-appearance: none;
        margin: 0;
      }

      &--error {
        outline: none;
        border: 1.5px solid var(--error);
        // box-shadow: 0px 2px 8px 0px rgba($error, 0.2);
      }

      &--error:focus {
        box-shadow: 0 0 0 2px var(--error-shadow);
      }

      &--select {
        // background-color: #fff;

        &:disabled {
          background-color: $disabled;
        }
      }
    }

    &__help {
      color: var(--help);
      font-size: $mobile-help;
      margin-top: .25rem;
      // color: rgb(200, 0, 0);

      &--error {
        color: var(--error);
      }
      
      &--success {
        color: var(--success);
      }
    }
  }

  &__btn__container {
    margin-top: 1.25rem;
    // margin-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__btn {
    margin: .5rem auto;
    padding: .5em 1.5em;
    text-transform: uppercase;
    font-size: $mobile-body;
    letter-spacing: .05rem;
    font-weight: bold;
    border-radius: 25px;
    -webkit-tap-highlight-color: $primary-darker;

    &:active {
      outline: none;
      box-shadow: 0 0 0 2px $primary-darker;
    }

    &--submit {
      border-radius: 25px;
      color: var(--textInverse);
      background-color: var(--text);
    }

    &--cancel {
      color: var(--help);
    }
  }
}
</style>