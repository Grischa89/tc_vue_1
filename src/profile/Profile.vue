<template>
    <div class="profile">
        <div class="profile__item">
            <div class="profile__item__image"></div>
            <h1 class="profile__item__heading">Hi long_username!</h1>
            <div class="profile__item__buttons">
                <button type="button" class="profile__item__buttons__btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__buttons__btn__prepend" viewBox="0 0 20 20" fill="currentColor" aria-labelledby="edit-profile">
                            <title id="edit-profile">Edit Your Profile</title>
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                        </svg>
                        <span>Edit</span>
                </button>
            </div>
        </div>
        <div v-if="user && !user.is_active" class="user__info">
            <div class="user__info__container user__info__container--error">
                <h3 class="user__info__container__title">Inactive Account</h3>
                <p class="user__info__container__text">We've noticed that you haven't activated your account yet. Please check your emails or <router-link :to="{ name: 'ResendActivationEmail' }" class="user__info__container__link">request a new activation link!</router-link></p>
            </div>
        </div>
        <div class="profile__item">
            <h2 class="profile__item__heading">Recent Activity</h2>
            <ul class="profile__item__list">
                <li class="profile__item__list__item">Posted Trainer Code 5454 8688 7536</li>
            </ul>
            <div class="profile__item__link">
                <span>Show all activity</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-activity">
                    <title id="all-activity">Show all activity</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
        <div class="profile__item">
            <h2 class="profile__item__heading">Your Subscriptions</h2>
            <ul class="profile__item__list">
                <li class="profile__item__list__item">Post Trainer Code before Raid Hour</li>
                <li class="profile__item__list__item">Get new Trainer Codes in your mail</li>
            </ul>
        </div>
        <div class="profile__item">
            <div class="profile__item__buttons">
                <button type="button" class="profile__item__buttons__btn" @click="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__buttons__btn__prepend" viewBox="0 0 20 20" fill="currentColor" aria-labelledby="logout">
                        <title id="logout">Log out</title>
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                    </svg>
                    <span>Log out</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Profile',

    data() {
        return {
        }
    },

    computed: {
        ...mapGetters({
            user: 'user',
        }),
    },

    mounted() {
        // document.title = 'My account | Djackets'
        // this.getMyOrders()
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push(`/`);
                })
                .catch(err => { // TODO: How to catch failed logout
                    console.log('err in MyAccount logout()', err);
                });
        },
    }
}
</script>

<style lang="scss">
.profile {
    display: grid;
    gap: 1.5rem;
    height: 100%;
    padding: 5%;

    &__item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        padding: 1rem;
        background-color: #FFF;
        // background-color: rgba($accent-light, .5);
        // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
        box-shadow: $card-shadow rgba($black, 0.2); 
        -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
        -moz-box-shadow: $card-shadow rgba($black, 0.2);
        border-radius: .5rem;

        &:first-of-type, &:last-of-type {
            justify-content: space-between;
            align-items: center;
            // padding-top: 3rem;
            background-color: transparent;
            box-shadow: none;
        }

        &__heading {
            font-size: $mobile-heading;
            text-transform: uppercase;
            font-weight: bold;
        }

        &__image {
            height: 5rem;
            width: 5rem;
            border-radius: 50%;
            background-color: coral;
            margin-bottom: 1rem;
        }

        &__buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;

            &__btn {

                display: flex;
                align-items: center;
                margin: 0 .5rem;
                // height: $mobile-subheading;
                // width: $mobile-subheading;
                cursor: pointer;
                // border-radius: 50%;
                // background-color: blue;

                &__prepend {
                    height: $mobile-subheading;
                    width: $mobile-subheading;
                    margin-right: .25rem;
                }

                &--edit {
                    padding: .5em 1.5em;
                    color: $secondary;
                    font-size: $mobile-body;
                    letter-spacing: .05rem;
                    font-weight: bold;
                    border-radius: 25px;
                    border: $secondary solid 1px;
                }
            }
        }

        &__list {
            // display: flex;
            // flex-direction: column;
            // align-items: flex-start;
            // margin: 1rem auto;

            &__item {
                // display: flex;
                // justify-content: flex-start;

                &::before {
                    content: '—';
                    margin-right: .5rem;
                }
            }
        }

        &__link {
            display: flex;
            align-items: center;
            margin-top: .5rem;
            text-decoration: underline;

            &__append {
                margin-left: .5rem;
                height: $mobile-subheading;
                width: $mobile-subheading;
            }
        }
    }
}

.user__info {
  position: relative;
  font-size: $mobile-body;
  font-weight: normal;
  width: 100%; // 90%
  min-height: 1rem;
  margin: 1rem auto 1.5rem auto;

  

  &__btn {
    position: absolute;
    top: .375rem;
    right: .375rem;
    margin-left: 2rem;
    height: $mobile-heading;
    width: $mobile-heading;
    cursor: pointer;

    &--info {
      color: $info
    }

    &--error {
      color: $error
    }

    &--success {
      color: $success
    }
  }

  &__container {
    width: 100%;
    text-align: left;
    background-color: rgba($help, .1);
    box-shadow: 0 0 0 2px $help-shadow;
    color: rgba($black, .7);
    border-radius: .25rem;
    padding: .5rem;

    &__title {
      margin-bottom: .25rem;
      font-size: $mobile-subheading;
      font-weight: bold;
    }

    &__link {
        font-weight: 500;
        text-decoration: underline;
    }

    &--info {
      background-color: rgba($info, .15);
      box-shadow: 0 0 0 2px $info-shadow;
      color: $info
    }

    &--error {
      background-color: rgba($error, .15);
      box-shadow: 0 0 0 2px $error-shadow;
      color: $error
    }

    &--success {
      background-color: rgba($success, .15);
      box-shadow: 0 0 0 2px $success-shadow;
      color: $success
    }
  }

  // &--highlight {
  //     font-weight: bold;
  // }

  &__link {
      font-weight: bold;
  }
}
</style>