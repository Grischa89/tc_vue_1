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
            <div  @click="scrollToActiveTab('overview')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileOverview'}" data-tab="overview"><router-link :to="{ name: 'ProfileOverview' }">Overview</router-link></div>
            <div  @click="scrollToActiveTab('codes')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileCodes'}" data-tab="codes"><router-link :to="{ name: 'ProfileCodes' }">Codes</router-link></div>
            <div  @click="scrollToActiveTab('subscriptions')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'ProfileSubscriptions'}" data-tab="subscriptions"><router-link :to="{ name: 'ProfileSubscriptions' }">Subscriptions</router-link></div>
            <!-- <div  @click="saveTab('overview2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserOverview'}" data-tab="overview2"><router-link to="/profiletest">Overview</router-link></div>
            <div  @click="saveTab('codes2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserCodes'}" data-tab="codes2"><router-link to="/profiletest/codes">Codes</router-link></div>
            <div  @click="saveTab('subscriptions2')" class="profile__nav__tab" :class="{'profile__nav__tab--active': activeTab === 'UserSubscriptions'}" data-tab="subscriptions2"><router-link to="/profiletest/subscriptions">Subscriptions</router-link></div> -->
        </div>

        <div class="profile__main">
            <router-view v-slot="{ Component, route }">
                <Transition :name="route.meta.transition" appear>
                    <keep-alive>
                        <component :is="Component" :key="key"></component>
                    </keep-alive>
                </Transition>
            </router-view>
        </div>
        
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

import { mapGetters } from 'vuex';

export default {
    name: 'Profile',

    computed: {
        ...mapGetters({
            user: 'user',
            subscriptions: 'subscriptions',
            userCodes: 'userCodes',
            tabScrollPosition: 'tabScrollPosition',
        }),

        activeTab() {
            return this.$route.name;
        },

        key() {
            return this.$route.path;
        },
    },

    created() {
        this.$store.dispatch('fetchAllSubscriptions');
        this.$store.dispatch('fetchUserCodes');
        console.log('%croute', 'color: red; font-weight: bold;', this.$route);
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

    // @include desktop {
    //     grid-template-areas:    'header header . . .'
    //                             'nav nav main main'
    //                             'footer footer . . .';
    //     grid-template-columns: repeat(5, 1fr);
    // }

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

        // @include desktop {
        //     grid-area: header;
        // }

        &__heading {
            font-size: $mobile-heading;
            text-transform: uppercase;
            font-weight: bold;
            padding: 0 .5rem;
            box-shadow: inset 0 -.75rem 0 0 var(--textBackdrop);
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

        @include tablet {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            overflow-x: hidden;
            margin-left: auto;
            margin-right: auto;
        }

        // @include desktop {
        //     grid-area: nav;
        //     grid-template-rows: repeat(3, 1fr);
        // }

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
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: .5rem;
        padding-right: .5rem;
        border-top-style: solid;
        border-top-width: .0625rem;
        border-top-color: var(--help);
        color: var(--help);
        text-transform: uppercase;
        font-size: $mobile-subheading;
        letter-spacing: .05rem;
        // widest tab sets min-width
        min-width: 15ch;

        &--active {
            border-top-style: solid;
            border-top-width: .25rem;
            border-top-color: $in-between;
            color: var(--text);
            font-weight: bold;
            padding-top: .75rem;
        }

        @include tablet {
            grid-column: span 1;
            // m-width: 25ch;
        }

        // @include desktop {
        //     grid-column: span 3;
        //     grid-row: span 1;
        // }
      }
    }

    &__main {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // align-items: center;
        margin-top: 1rem;
        // max-width: 60ch;
        // margin-left: auto;
        // margin-right: auto;

        @include tablet-landscape {
            width: 80%;
            max-width: 100ch;
            margin-left: auto;
            margin-right: auto;
        }

        // @include desktop {
        //     grid-area: main;
        //     overflow-y: auto;
        // }
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

        // @include desktop {
        //     grid-area: footer;
        // }

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
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    transition-duration: 300ms;
    transition-property: all;
    transition-timing-function: ease;
    // transition: all 300ms ease;
}

.fade-enter-active {
    transition-duration: 300ms;
    transition-property: all;
    transition-timing-function: ease;
    // transition: all 300ms ease;
    transition-delay: .25s;
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