<template>
  <div v-if="!showInfo" class="user__info__show">
    <svg @click="showInfo = !showInfo" xmlns="http://www.w3.org/2000/svg" class="user__info__show__btn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
  </div>
  <div v-if="showInfo" class="user__info user__info--info">
    <h3 class="user__info__title">Invalid URL</h3>
    <div class="user__info__dismiss" @click="showInfo = !showInfo">
      <svg xmlns="http://www.w3.org/2000/svg" class="user__info__dismiss__btn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    <p>{{ message }}</p>
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
.user__info {
  position: relative;
  font-size: $mobile-body;
  font-weight: normal;
  text-align: left;
  // max-width: 24.3076923rem;
  width: 90%;
  margin: 1rem auto 1.5rem auto;
  padding: .5rem;
  border-radius: .25rem;
  background-color: rgba($help, .1);
  box-shadow: 0 0 0 2px $help-shadow;
  color: rgba($black, .7);

    &__title {
      margin-bottom: .25rem;
      font-size: $mobile-subheading;
      font-weight: bold;
    }

    &__dismiss {
      position: absolute;
      top: .375rem;
      right: .375rem;
      // display: flex;
      // justify-content: flex-end;
      margin-left: 2rem;

      &__btn {
        height: $mobile-subheading;
        width: $mobile-subheading;
      }
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

    &--highlight {
        font-weight: bold;
    }

    &__link {
        font-weight: bold;
    }
}

.user__info__show {
  position: relative;
  font-weight: normal;
  width: 90%;
  margin: 1rem auto 1.5rem auto;
  padding: .5rem;
  border-radius: .25rem;

  &__btn {
    height: $mobile-subheading;
    width: $mobile-subheading;
    position: absolute;
      top: .375rem;
      right: .375rem;
  }
}
</style>