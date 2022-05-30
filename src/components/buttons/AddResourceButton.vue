<template>
  <div class="profile__resource__action">
    <router-link class="profile__resource__action__link" :to="{ name: `${routeName}` }">
      <span class="profile__resource__action__link__text">
        <slot name="text">Add</slot>
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="profile__resource__action__link__append" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-labelledby="add-subscription">
          <title id="add-subscription">Add Subscription</title>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'AddResourceButton',

  props: {
    routeName: {
      type: String
    }
  }
}
</script>
<style lang="scss">
.profile__resource__action {
  display: flex;
  justify-content: flex-end;

  &__link {
    display: flex;
    align-items: center;
    padding: .5rem 1.25rem;
    text-transform: uppercase;
    font-size: $mobile-body;
    border-radius: 25px;
    color: $white;
    background-color: $accent;

    &__text {
      letter-spacing: .075rem;
      font-weight: 600;
    }

    &__append {

      // @include tablet {
      //   &::before {
      //     content: 'Add Subscription';
      //   }
      // }
      margin-left: .375rem;
      height: $mobile-body;
      width: $mobile-body;
    }
  }

}
</style>