<template>
    <div
        v-if="code"
        class="modal-wrapper"
        @click.self="$emit('onClose')">
      <div
          class="modal"
          @click.prevent.self>
        <div
          class="modal__btn"
            @click="$emit('onClose')">
          <svg xmlns="http://www.w3.org/2000/svg" class="modal__btn__close" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-labelledby="close-qrcode-modal">
          <title id="close-qrcode-modal">Close QRCode Modal</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div class="modal__header">
          <h2 class="modal__header__heading"><router-link :to="`/${code.continent_slug}/${code.country_slug}`">{{ code.country }}</router-link></h2>
    
          <h3 v-if="code.city" class="modal__header__subheading"><router-link :to="`/${code.continent_slug}/${code.country_slug}/${code.city_slug}`">{{ code.city }}</router-link></h3>
        </div>
        <div class="modal__body">
          <qrcode-vue class="modal__body__qr" :value="code.player_code" :size="size" level="H"/>
        </div>
        <div class="modal__footer" :data-code="code.player_code">
          <div @click.self="$emit('copyCode', $event)" class="modal__footer__code">
            {{ code.prettyCode }}
          </div>
    
          <IconButton @click="$emit('copyCode', $event)">
            <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import IconButton from '../buttons/IconButton.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'QRCodeModal',

  emits: ['onClose', 'copyCode'],

  props: {
    code: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      open: 'modalOpen',
    })
  },

  data() {
    return {
      size: 200,
    }
  },

  components: {
      QrcodeVue,
      IconButton,
  },
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($black, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  // NOTE: .modal-wrapper needs a higher z-index than navbar
  z-index: 100;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 350px;
  padding: 1rem;
  background: var(--surfaceModal);
  border-radius: .5rem;
  border: .0625rem solid var(--border);
  position: absolute;
  
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 1rem;
    width: 90%;
    
    &__heading {
      font-size: $mobile-heading;
      letter-spacing: .05rem;
      font-weight: bold;
      text-transform: uppercase;
      padding-top: .375rem;
    }

    &__subheading {
      font-size: $mobile-subheading;
      font-weight: 400;
    }

    &__heading:hover, &__subheading:hover {
      text-decoration: underline;
    }
  }

  &__body {
    border-radius: .5rem;
    margin: .5rem 0;
    padding: 1rem;
    background-color: #fff;

    &__qr {
      margin: 0 auto;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 2rem;

    &__code {
      font-size: $mobile-subheading;
      // letter-spacing: .05rem;
      font-weight: 500;
      margin-bottom: .75rem;
      cursor: pointer;
    }
    

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

  &__btn {
    position: absolute;
    top: .75rem;
    right: .75rem;
    margin-left: 2rem;
    height: $mobile-heading;
    width: $mobile-heading;
    cursor: pointer;
    color: var(--help);
    -webkit-tap-highlight-color: $primary-darker;

    &:hover {
      color: $black;
    }

  }
}
</style>