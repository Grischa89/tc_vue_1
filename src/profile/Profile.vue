<template>
    <div class="main">
        <div class="profile">

            <div class="profile__item profile__item__greeting">
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

                    <!-- <button type="button" class="profile__item__buttons__btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-labelledby="logout">
                            <title id="logout">Log out</title>
                            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                        </svg>
                    </button> -->
                </div>
            </div>

            <div v-if="user && !user.is_active" class="profile__item profile__item--warning">
                We've noticed that you haven't activated your account yet. Please check your emails or <router-link :to="{ name: 'ResendActivationEmail' }" class="profile__item__link profile__item__link--warning">request a new activation link!</router-link>
            </div>

            <!-- <div class="profile__item">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div> -->

            <!-- <div class="profile__item">
                {{ user }}
            </div> -->

            <div class="profile__item">
                <h2 class="profile__item__heading">Recent Activity</h2>
                <ul class="profile__item__list">
                    <li class="profile__item__list__item">Posted Trainer Code 5454 8688 7536</li>
                </ul>
                <div class="profile__item__proceed">
                    <span>Show all activity</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="profile__item__proceed__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="all-activity">
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

            <div class="profile__item profile__item__logout">
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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Profile',

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
                .catch(err => {
                    console.log('err in MyAccount logout()', err);
                })
            // axios.defaults.headers.common["Authorization"] = "";

            
        },
    }
}
</script>

<style lang="scss">
    .main {
        height: 100vh;
        padding: 5%;
    }

    .profile {
        display: grid;
        gap: 1.5rem;
        height: 100%;

        &__item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            padding: 1rem;
            background-color: #FFF;
            // background-color: rgba($accent-light, .5);
            box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
            border-radius: .5rem;

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

            &__greeting, &__logout {
                justify-content: space-between;
                align-items: center;
                // padding-top: 3rem;
                background-color: transparent;
                box-shadow: none;
            }

            &__buttons {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
                // position: absolute;
                // top: 1rem;
                // right: 1rem;

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

            &__link {
                font-weight: bold;
            }

            &--warning {
                justify-content: center;
                align-items: center;
                color: $error-color;
                border-style: solid;
                border-color: $error-color;
                background-color: rgba($error-color, .1);
            }

            &__divider {
                border-bottom: .5px solid black;
            }

            &__list {
                margin: 1rem auto;
                text-align: left;

                &__item::before {
                    content: '—';
                    margin-right: .5rem;
                }
            }

            &__proceed {
                display: flex;
                align-items: center;

                &__append {
                    margin-left: .5rem;
                    height: $mobile-subheading;
                    width: $mobile-subheading;
                }
            }
        }
    }
</style>