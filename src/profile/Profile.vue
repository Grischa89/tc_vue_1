<template>
    <div class="profile">
        
        <div class="profile__header">

            <div class="profile__header__image">
                <img class="profile__header__image__img" :src="require('../assets/user.png')"/>
                <div class="profile__header__image__overlay">
                    <router-link to="#">
                        <!-- TODO: Accessibility -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="profile__header__image__overlay__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </router-link>
                </div>
            </div>

            <h1 class="profile__header__heading">Hi {{ user.username }}!</h1>
            <div class="profile__header__links">
                <router-link class="profile__header__links__link" :to="{ name: 'ProfileSettings' }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="profile__header__links__link__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="edit-profile">
                        <title id="user-settings">User Settings</title>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="profile__header__links__link__text">Settings</span>
                </router-link>
            </div>
        </div>

        <div v-if="user && !user.is_active" class="user__info">
            <div class="user__info__container user__info__container--error">
                <h3 class="user__info__container__title">Inactive Account</h3>
                <p class="user__info__container__text">We've noticed that you haven't activated your account yet. Please check your emails or <router-link :to="{ name: 'ResendActivationEmail' }" class="user__info__container__link">request a new activation link!</router-link></p>
            </div>
        </div>

         <div class="profile__nav">
            <div  @click="scrollToActiveTab('overview')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileOverview'}" data-tab="overview"><router-link :to="{ name: 'ProfileOverview'}">Overview</router-link></div>
            <div  @click="scrollToActiveTab('codes')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileCodes'}" data-tab="codes"><router-link :to="{ name: 'ProfileCodes'}">Codes</router-link></div>
            <div  @click="scrollToActiveTab('subscriptions')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileSubscriptions'}" data-tab="subscriptions"><router-link :to="{ name: 'ProfileSubscriptions'}">Subscriptions</router-link></div>
            <!-- <div  @click="saveTab('overview2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserOverview'}" data-tab="overview2"><router-link to="/profiletest">Overview</router-link></div>
            <div  @click="saveTab('codes2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserCodes'}" data-tab="codes2"><router-link to="/profiletest/codes">Codes</router-link></div>
            <div  @click="saveTab('subscriptions2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserSubscriptions'}" data-tab="subscriptions2"><router-link to="/profiletest/subscriptions">Subscriptions</router-link></div> -->
        </div>

        <div class="profile__main">
            <router-view :key="$route.fullPath"></router-view>
        </div>

        <!-- <div class="profile__nav">
          <div class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'overview'}" @click="chooseTab('overview')">Overview</div>
          <div class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'codes'}" @click="chooseTab('codes')">Codes</div>
          <div class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'subscriptions'}" @click="chooseTab('subscriptions')">Subscriptions</div>
        </div> -->

        <!-- <div class="profile__item" v-show="setActiveTab('overview')" id="overview">
            <h3 class="profile__item__subheading">Trainer Codes you posted</h3>
            <ul v-if="userCodesForOverview" class="profile__item__list">
                <li v-for="(code, i) in userCodesForOverview"
                class="profile__item__list__item">{{ code.correct_city }}, {{ code.correct_country}}: {{ code.prettyCode }}</li>
            </ul>
             <div v-if="userCodesForOverview" class="profile__item__link">
              <router-link to="/profiletest#codes">View all Trainer Codes
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-codes">
                    <title id="all-codes">View your Trainer Codes</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </router-link>
            </div>
            <div class="profile__item__link">
              <router-link to="#">Add Trainer Code
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-code">
                    <title id="add-code">Add Trainer Code</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </router-link>
            </div>

            <h3 class="profile__item__subheading">Subscriptions for upcoming events</h3>
            <ul v-if="subscriptionsForOverview" class="profile__item__list">
                <li v-for="(sub, i) in subscriptionsForOverview"
                class="profile__item__list__item">{{ sub.message }}</li>
            </ul>
            <div v-if="subscriptionsForOverview" class="profile__item__link">
              <router-link to="/profiletest#subscriptions">View all subscriptions
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-subscriptions">
                    <title id="all-subscriptions">View all subscriptions</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </router-link>
            </div>
            <div class="profile__item__link">
              <router-link to="#">Add subscription
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-subscription">
                    <title id="add-subscription">Add subscription</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </router-link>
            </div>
            <button class="profile__item__button profile__item__button--action"><router-link to="#">Add subscription
                <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__button__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="add-subscriptions">
                    <title id="add-subscriptions">Add subscription</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </router-link></button>
            <button class="profile__item__button">View All Subscriptions</button>
        </div> -->

        <!-- <div class="profile__item" v-show="setActiveTab('codes')" id="codes">
            Codes Content
        </div> -->

        <!-- <div class="profile__item" v-show="setActiveTab('subscriptions')" id="subscriptions">Subscription Content</div> -->
        <!-- <div class="profile__item">
            <h2 class="profile__item__heading">Recent Activity</h2>
            <ul class="profile__item__list">
                <li class="profile__item__list__item">Posted Trainer Code 5454 8688 7536</li>
            </ul>
            <div class="profile__item__link">
                <router-link to="#">Show all activity
                    <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-activity">
                        <title id="all-activity">Show all activity</title>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </router-link>
            </div>
        </div> -->
        
        <div class="profile__footer">
            <div class="profile__footer__buttons">
                <button type="button" class="profile__footer__buttons__btn" @click="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="profile__footer__buttons__btn__prepend" viewBox="0 0 20 20" fill="currentColor" aria-labelledby="logout">
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
// import SubscriptionsAll from '../views/subscriptions/SubscriptionsAll.vue';

import { mapGetters } from 'vuex';

export default {
    name: 'Profile',

    components: {
        // SubscriptionsAll,
    },

    computed: {
        ...mapGetters({
            user: 'user',
            subscriptions: 'subscriptions',
            userCodes: 'userCodes',
            tabScrollPosition: 'tabScrollPosition',
            tab: 'tab',
        }),
        subscriptionsForOverview() {
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
        },
        activeTab() {
            return this.$route.name;
        }
    },

    created() {
        this.$store.dispatch('fetchAllSubscriptions');
        this.$store.dispatch('fetchUserCodes');
    },
    methods: {
        scrollToActiveTab(selected) {
            // NOTE: Use console.dir(tab) to easily check for .offsetWidth / .offsetLeft / .offsetParent 
            const parent = document.querySelector('.profile__nav');
            const tab = document.querySelector(`[data-tab="${selected}"]`);

            const tabOffsetEachSide = (parent.clientWidth - tab.offsetWidth) / 2;
            // console.log('%ctab', 'color: fuchsia; font-weight: bold;', tabOffsetEachSide);

            // NOTE: Usually ommit -20, but tab's offsetParent is falsely also body
            // parent's offsetLeft is 20 and should be substracted to get tab's offset to parent right
            parent.scrollLeft = tab.offsetLeft - tabOffsetEachSide - 20;
        },

        logout() {
            this.$store.dispatch('logout')
            .then(() => {
                this.$router.push(`/`);
            })
            .catch(err => { // TODO: How to catch failed logout
                console.log('err in Profile logout()', err);
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
    width: 100%;
    // padding: 5%;
    // background-color: $primary;
    // position: relative;
    // z-index: 0;

    &__header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 1rem;
        background-color: transparent;
        box-shadow: none; 
        -webkit-box-shadow: none; 
        -moz-box-shadow: none;
        border-radius: .5rem;

        &__heading {
            font-size: $mobile-heading;
            text-transform: uppercase;
            font-weight: bold;
            padding: 0 .5rem;
            box-shadow: inset 0 -.75rem 0 0 $in-between;
        }

        &__image {
            position: relative;
            height: 5rem;
            width: 5rem;
            border-radius: 50%;
            background-color: $primary;
            margin-bottom: 1rem;
             box-shadow: $card-shadow rgba($black, 0.2); 
            -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
            -moz-box-shadow: $card-shadow rgba($black, 0.2);

            &__img {
                height: 5rem;
                width: 5rem;
                border-radius: 50%;
            }

            &__overlay {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
                background-color: rgba($black, .2);
                border-radius: 50%;

                &:hover {
                    opacity: 1;
                    cursor: pointer;
                }

                &__icon {
                    color: rgba($black, .6);
                    width: 1.5rem;
                    height: 1.5rem;
                    position: absolute; // to center
                    top: 50%; // to center
                    left: 50%; // to center
                    transform: translate(-50%, -50%); // to center
                    -ms-transform: translate(-50%, -50%); // to center
                    cursor: pointer;

                    &:hover {
                        color: rgba($black, .8);
                    }
                }
            }
        }

        &__links {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;

            &__link {

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

                &__icon {
                    height: 1.625rem;
                    width: 1.625rem;
                }

                // &__text {
                // }
            }
        }   
    }

    &__nav {
        // Make tabs overflow horizontally with flex
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;

        /* 
        Custom scrollbar, but disappearing effect needs to be achieved with JS (not implemented)
        &::-webkit-scrollbar {
            height: .1875rem;
        }

        &::-webkit-scrollbar-track {
            border-radius: 0;
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 0;
            background: $primary-darker;
        } */

        // Make tabs overflow horizontally with grid
        /* display:grid;   
        grid-template-columns: repeat(12, 1fr);
        grid-auto-flow:column;  
        // grid-gap:10px; 
        // margin:30px;
        overflow:auto; */

      &__tab {
        display: flex;
        justify-content: center;
        padding-top: .75rem;
        padding-bottom: 1rem;
        padding-left: .5rem;
        padding-right: .5rem;
        border-top-style: solid;
        border-top-width: .0625rem;
        border-top-color: $help;
        color: $help;
        text-transform: uppercase;
        font-size: $mobile-subheading;
        letter-spacing: .05rem;
        // widest tab sets min-width
        min-width: 15ch;

        &--active {
            border-top-style: solid;
            border-top-width: .25rem;
            border-top-color: $in-between;
            color: $black;
            font-weight: bold;
        }
      }
    }

    &__main {
        margin-top: 1rem;
    }

    &__footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 1rem;
        background-color: transparent;
        box-shadow: none; 
        -webkit-box-shadow: none; 
        -moz-box-shadow: none;
        border-radius: .5rem;

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

                &__icon {
                    height: 1.625rem;
                    width: 1.625rem;
                }
            }
        }

    }

    // &__item {
    //     display: flex;
    //     flex-direction: column;
    //     align-items: flex-start;
    //     position: relative;
    //     padding: 1rem;
    //     background-color: $white;
    //     box-shadow: $card-shadow rgba($black, 0.2); 
    //     -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    //     -moz-box-shadow: $card-shadow rgba($black, 0.2);
    //     border-radius: .5rem;

    //     &:last-of-type {
    //         justify-content: space-between;
    //         align-items: center;
    //         // padding-top: 3rem;
    //         background-color: transparent;
    //         box-shadow: none;

    //         .profile__item__heading {
    //             padding: 0 .5rem;
    //             box-shadow: inset 0 -.75rem 0 0 $in-between;
    //         }
    //     }

    //     &--action {
    //         position: relative;

    //         .profile__item__buttons--action {
    //             position: absolute;
    //             top: 0;
    //             right: .25rem;

    //             .profile__item__buttons__btn--action {
    //                 background-color: $accent;
    //                 color: $white;
    //                 border-radius: 50%;
    //                 padding: .25rem;
    //                 box-shadow: $card-shadow rgba($black, 0.2);
    //             }
    //         }
    //     }

    //     &__heading {
    //         font-size: $mobile-heading;
    //         text-transform: uppercase;
    //         font-weight: bold;


    //         // &:first-child {
    //         //     padding: 0 .5rem;
    //         //     box-shadow: inset 0 -.75rem 0 0 $in-between;
    //         // }
    //     }

    //     &__subheading {
    //         text-align: left;
    //         font-size: $mobile-subheading;
    //         font-weight: bold;
    //     }

    //     &__image {
    //         position: relative;
    //         height: 5rem;
    //         width: 5rem;
    //         border-radius: 50%;
    //         background-color: $primary;
    //         margin-bottom: 1rem;
    //          box-shadow: $card-shadow rgba($black, 0.2); 
    //         -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    //         -moz-box-shadow: $card-shadow rgba($black, 0.2);

    //         &__img {
    //             height: 5rem;
    //             width: 5rem;
    //             border-radius: 50%;
    //         }

    //         &__overlay {
    //             position: absolute;
    //             top: 0;
    //             bottom: 0;
    //             left: 0;
    //             right: 0;
    //             height: 100%;
    //             width: 100%;
    //             opacity: 0;
    //             background-color: rgba($black, .2);
    //             border-radius: 50%;

    //             &:hover {
    //                 opacity: 1;
    //                 cursor: pointer;
    //             }

    //             &__icon {
    //                 color: rgba($black, .6);
    //                 width: 1.5rem;
    //                 height: 1.5rem;
    //                 position: absolute; // to center
    //                 top: 50%; // to center
    //                 left: 50%; // to center
    //                 transform: translate(-50%, -50%); // to center
    //                 -ms-transform: translate(-50%, -50%); // to center
    //                 cursor: pointer;

    //                 &:hover {
    //                     color: rgba($black, .8);
    //                 }
    //             }
    //         }
    //     }

    //     &__button {
    //         display: flex;
    //         align-items: center;
    //         text-transform: uppercase;
    //         font-size: $mobile-body;
    //         letter-spacing: .05rem;
    //         font-weight: bold;
    //         color: $help;
    //         padding: .375rem 1.5rem;
    //         margin-top: 1rem;
    //         margin-bottom: .25rem;
    //         -webkit-tap-highlight-color: $primary-darker;

    //         &--action {
    //             color: $white;
    //     background-color: $accent;
    //     border-radius: 25px;
    //     // font-weight: 600;
    //         }

    //         &__append {
    //             margin-left: .5rem;
    //             height: $mobile-subheading;
    //             width: $mobile-subheading;
    //         }
    //     }

    //     &__buttons {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         margin-top: 1rem;

    //         &__btn {

    //             display: flex;
    //             align-items: center;
    //             margin: 0 .5rem;
    //             // height: $mobile-subheading;
    //             // width: $mobile-subheading;
    //             cursor: pointer;
    //             // border-radius: 50%;
    //             // background-color: blue;

    //             &__prepend {
    //                 height: $mobile-subheading;
    //                 width: $mobile-subheading;
    //                 margin-right: .25rem;
    //             }

    //             &__icon {
    //                 height: 1.625rem;
    //                 width: 1.625rem;
    //             }

    //             &--edit {
    //                 padding: .5em 1.5em;
    //                 color: $secondary;
    //                 font-size: $mobile-body;
    //                 letter-spacing: .05rem;
    //                 font-weight: bold;
    //                 border-radius: 25px;
    //                 border: $secondary solid 1px;
    //             }
    //         }
    //     }

    //     &__list {
    //         // display: flex;
    //         // flex-direction: column;
    //         // align-items: flex-start;
    //         margin-top: 1rem;
    //         margin-bottom: 1rem;
    //         list-style-type: '—';
    //         list-style-position: outside;
    //         text-align: left;

    //         &__item {
    //             margin-left: .75rem;
    //             padding-left: .5rem;
    //             // display: flex;
    //             // justify-content: flex-start;
    //             // text-align: left;

    //             // &::before {
    //             //     content: '—';
    //             //     margin-right: .5rem;
    //             // }
    //         }
    //     }

    //     &__link, &__link a {
    //         display: flex;
    //         align-items: center;
    //         // margin-top: .25rem;
    //         margin-bottom: .5rem;
    //         text-decoration: underline;

    //         &__append, a .profile__item__link__append {
    //             margin-left: .5rem;
    //             height: $mobile-subheading;
    //             width: $mobile-subheading;
    //         }
    //     }
        
    // }
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