<template>
  <div class="invalid-slug__container">
    <div class="user__info">
      <div v-if="!showInfo" class="user__info__btn user__info__btn--info">
        <svg @click="showInfo = true" xmlns="http://www.w3.org/2000/svg" class="user__info__show__btn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="show-user-info-box">
          <title id="show-user-info-box">Show User Info Box</title>
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div v-else class="user__info__btn user__info__btn--info">
        <svg @click="showInfo = false" xmlns="http://www.w3.org/2000/svg" class="user__info__dismiss__btn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-labelledby="dismiss-user-info-box">
        <title id="dismiss-user-info-box">Dismiss User Info Box</title>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div v-if="showInfo" class="user__info__container user__info__container--info">
        <h3 class="user__info__container__title">Invalid URL</h3>
        <p class="user__info__container__text">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvalidSlug',

  props: {
    message: {
      type: String,
    }
  },

  data() {
    return {
      showInfo: true,
    }
  }

}
</script>

<style lang="scss">
.invalid-slug__container {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
// .user__info {
//   position: relative;
//   font-size: $mobile-body;
//   font-weight: normal;
//   width: 90%;
//   min-height: 1rem;
//   margin: 1rem auto 1.5rem auto;

  

//   &__btn {
//     position: absolute;
//     top: .375rem;
//     right: .375rem;
//     margin-left: 2rem;
//     height: $mobile-heading;
//     width: $mobile-heading;
//     cursor: pointer;

//     &--info {
//       color: $info
//     }

//     &--error {
//       color: $error
//     }

//     &--success {
//       color: $success
//     }
//   }

//   &__container {
//     width: 100%;
//     text-align: left;
//     background-color: rgba($help, .1);
//     box-shadow: 0 0 0 2px $help-shadow;
//     color: rgba($black, .7);
//     border-radius: .25rem;
//     padding: .5rem;

//     &__title {
//       margin-bottom: .25rem;
//       font-size: $mobile-subheading;
//       font-weight: bold;
//     }

//     &--info {
//       background-color: rgba($info, .15);
//       box-shadow: 0 0 0 2px $info-shadow;
//       color: $info
//     }

//     &--error {
//       background-color: rgba($error, .15);
//       box-shadow: 0 0 0 2px $error-shadow;
//       color: $error
//     }

//     &--success {
//       background-color: rgba($success, .15);
//       box-shadow: 0 0 0 2px $success-shadow;
//       color: $success
//     }
//   }

//   // &--highlight {
//   //     font-weight: bold;
//   // }

//   &__link {
//       font-weight: bold;
//   }
// }
</style>