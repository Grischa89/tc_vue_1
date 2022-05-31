<template>
  <div v-for="i in 3" :key="i" class="profile__resource__item">
    <div class="profile__resource__item__display">
      <div class="profile__resource__item__display__task">
        <div class="skeleton profile__resource__item__display__task__header" :class="{ loading: loading }"></div>
        <p v-for="j in 3" :key="j" class="skeleton profile__resource__item__display__task__row" :class="{ loading: loading }"></p>
      </div>
      <div class="profile__resource__item__display__actions">
        <button class="skeleton--round profile__resource__item__display__actions__btn" :class="{ loading: loading }">
        </button>
        <button v-if="currentRouteName === 'ProfileSubscriptions'" class="skeleton--round  profile__resource__item__display__actions__btn" :class="{ loading: loading }">
        </button>
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'ProfileResourceItemSkeleton',

  data() {
    return {
      loading: true,
    }
  },

  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },

}
</script>

<style lang="scss" scoped>
.profile__resource__item {
  border-left-width: .25rem;
  border-left-style: solid;
  border-left-color: rgba($help, .2);

  &:nth-of-type(2n) {
    border-left-color: rgba($help, .2);
  }

  &__display {

    &__task {
      &__header {
        box-shadow: none;
        height: $mobile-heading;
        width: 3rem;
      }

      &__row {
        height: $mobile-subheading;
        width: 7rem;
        margin-bottom: .5rem;

        &:first-of-type {
          width: 12rem;
        }

        &:last-of-type {
          width: 4rem;
          margin-bottom: 0;
        }
      }
    }

    &__actions {
      &__btn {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    }
  }

  .skeleton {
    opacity: .7;
    border-radius: .125rem;

    &--round {
      border-radius: 50%;
    }
  }

  .loading {
    animation: skeleton-loading .9s linear infinite alternate;
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }

  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
</style>