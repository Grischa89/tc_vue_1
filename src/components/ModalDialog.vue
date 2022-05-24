<template>
   <Teleport to="body">
     <div class="modal-wrapper">
      <div class="modal">
        <div class="modal__header"><h2 class="modal__header__title">Confirm deleting subscription</h2></div>
        <div class="modal__body">
          <p class="modal__body__text">This action will delete your subscription {{ subscription.action }} for the event {{ subscription.event }} and trainer code {{ subscription.player_code }}.</p>
        </div>
        <div class="modal__footer">
          <button class="modal__footer__btn" @click="$emit('onCancel')">Cancel</button>
          <button class="modal__footer__btn modal__footer__btn--confirm" @click="$emit('onConfirm', { pk: subscription.pk, index: subscription.index })">Delete</button>
        </div>
      </div>
     
       </div>
   </Teleport>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalDialog',

  emits: ['onConfirm', 'onCancel'],

  computed: {
    ...mapGetters({
      subscription: 'subscriptionToDelete',
    }),
  },
}
</script>

<style lang="scss">
.modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($black, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  // NOTE: .modal-wrapper needs a higher z-index than navbar
  z-index: 100;
}

.modal {
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 1rem;
  background: $white;
  overflow-x: auto;
  border-radius: .5rem;
  
  &__header {
    margin-bottom: .5rem;
    font-size: $mobile-heading;
    font-weight: bold;
  }

  &__body {
    margin: .5rem 0;
  }

  &__footer {
    display: flex;
    justify-content: space-evenly;
    margin-top: 1rem;
    

    &__btn {
      text-transform: uppercase;
      font-size: $mobile-body;
      letter-spacing: .05rem;
      font-weight: bold;
      color: $help;
      padding: .375rem 1.5rem;
      -webkit-tap-highlight-color: $primary-darker;

      &--confirm {
        color: $white;
        background-color: $error;
        border-radius: 25px;
        font-weight: 600;
      }
    }
  }
}
</style>