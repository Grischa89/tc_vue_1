<template>
  <!-- <router-view></router-view> -->
  <div class="table__wrapper">

    <h1 v-if="title" class="table__wrapper__title">{{ title }}</h1>
    <h1 v-else class="table__wrapper__title">Recent Codes</h1>

    <!-- For small devices table has width of 11/12, from sm-breakpoint on has max-width of md (448px) -->
    <div class="table__wrapper__card">
      <!-- Alternative width proportions: w-10/12 sm:w-8/12 md:w-6/12 lg:max-w-md -->
      
      <table class="table">
        <thead class="table__head">
          <tr class="table__head__row">
            <th v-if="isCity" scope="col" class="table__head__row__cell"><span class="line-behind--thead">City</span></th>
            <th v-else scope="col" class="table__head__row__cell"><span class="line-behind--thead">Country</span></th>
            <th scope="col" class="table__head__row__cell"><span class="line-behind--thead">Trainercode</span></th>
          </tr>
        </thead>
        <tbody class="table__body">
          <tr v-for="(code, i) in codes" :key="i" class="table__body__row">
            <td v-if="isCity" class="table__body__row__cell">
              <span class="table__body__row__cell__link table__body__row__cell__link--non-link">{{ code.city }}</span>
            </td>
            <td v-else class="table__body__row__cell">
              <router-link class="table__body__row__cell__link" :to="{ name: 'Country', params: { continent: code.continent_slug, country: code.country_slug } }">{{ code.country }}</router-link>
            </td>

            <td class="table__body__row__cell"
              :data-code="code.player_code"
              >
              <div class="table__body__row__cell__container tooltip tap" @mouseover="showTooltip($event, 'Click to copy!')" @mouseleave="hideTooltip($event, code.player_code)" @click="copyCodeToClipboard($event)">
                  <div v-if="code.prettyCode" class="table__body__row__cell__container__item">
                    {{ code.prettyCode }}
                  </div>
                  <div v-else class="table__body__row__cell__container__item">
                    {{ code.player_code }}
                  </div>

                  <Tooltip>
                  </Tooltip>
              </div>

              <div class="table__body__row__cell__container tooltip" @mouseover="showTooltip($event, 'Click to copy!')" @mouseleave="hideTooltip($event, code.player_code)" @click="copyCodeToClipboard($event)">
                <IconButton>
                  <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="icon" aria-labelledby="copy-trainer-code">
                    <title id="copy-trainer-code">Click to copy Trainer Code</title>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </IconButton>

                <Tooltip>
                </Tooltip>
              </div>

              <div class="table__body__row__cell__container tooltip" @mouseover="showTooltip($event, 'Open QR-Code')" @mouseleave="hideTooltip($event, code.player_code)">
                <IconButton @click="openQRCodeModal(code)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" viewBox="0 0 20 20" fill="currentColor" aria-labelledby="open-qrcode-modal">
                    <title id="open-qrcode-modal">Open Trainer Code as QR Code</title>
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd" />
                    <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                  </svg>
                </IconButton>

                <Tooltip>
                </Tooltip>
              </div>
            </td>
          </tr>
          <Teleport to="body">
            <QRCodeModal 
              v-if="open"
                @on-close="closeModal"
                @copy-code="copyCodeToClipboard"
                :code="qrCode" />
          </Teleport>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import IconButton from './buttons/IconButton.vue';
import QRCodeModal from './modals/QRCodeModal.vue';
import Tooltip from './tooltips/Tooltip.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Table',

  components: {
    IconButton,
    QRCodeModal,
    Tooltip,
  },

  data() {
    return {
      upHere: false,
      qrCode: {
        city: '',
        city_slug: '',
        continent: '',
        continent_slug: '',
        country: '',
        country_slug: '',
        player_code: '',
        prettyCode: '',
      }
    }
  },

  // Maybe list props as object, props: { latestCodes: { type: Array, required: true } }
  props: {
    codes: {
      type: Array,
      required: true,
    },

    title: {
      type: String,
      required: false,
    },

    isCity: {
      type: Boolean,
      required: false,
    }
  },

  computed: {
    ...mapGetters({
      open: 'modalOpen',
    })
  },

  methods: {
    
    copyCodeToClipboard(e) {
      const parent = e.target.closest('[data-code]');
      this.$store.dispatch('copyCodeToClipboard', parent.dataset.code);

      this.showTooltip(e, 'Copied!');
    },

    openQRCodeModal(code) {
      this.qrCode.city = code.city;
      this.qrCode.city_slug = code.city_slug;
      this.qrCode.continent = code.continent;
      this.qrCode.continent_slug = code.continent_slug;
      this.qrCode.country = code.country;
      this.qrCode.country_slug = code.country_slug;
      this.qrCode.player_code = code.player_code;
      this.qrCode.prettyCode = code.prettyCode;

      document.body.style.overflow = 'hidden';
      this.$store.commit('toggleModal', true);
    },

    closeModal() {
      document.body.style.overflow = 'auto';
      // this.openModal = false;
      this.$store.commit('toggleModal', false);
    },

    showTooltip(e, tooltipText) {
      const tooltipParent = e.currentTarget;
      const tooltip = tooltipParent.querySelector('.tooltip__text');
      const { width } = tooltip.getBoundingClientRect();
      tooltip.textContent = tooltipText;
      tooltip.style.marginLeft = `-${width / 2}px`;
      tooltip.style.visibility = 'visible';
    },

    hideTooltip(e) {
      const tooltipParent = e.currentTarget;
      const tooltip = tooltipParent.querySelector('.tooltip__text');
      tooltip.style.visibility = 'hidden';
    }

  },
 
}
</script>

<style lang="scss">
.table__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow-x: hidden;

  &__title {
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: .05rem;
    margin: .5rem 0;
  }

  &__card {
    display: flex;
    flex-direction: column;
    margin: .5rem auto;
    border-radius: .75rem;
    border: .0625rem solid var(--border);
    width: 100%;
    max-width: 60ch;
    background-color: var(--surface2);

    @include tablet {
      box-shadow: 1px 1px 5px rgba($black, 0.2);
    }
  }
}

.table {
  table-layout: fixed;
  font-size: $mobile-body;

  &__head {
    border-bottom: .03125rem solid var(--divider);

    &__row {
      background-color: var(--surface4);

      &__cell {
        padding:1rem;
        text-align: left;
        text-transform: uppercase;
        width: 50%;

        &:first-of-type {
          border-top-left-radius: .75rem;
        }

        &:last-of-type {
          border-top-right-radius: .75rem;
        }
      }
    }
  }

  &__body {

    &__row {

      border-bottom: .0625rem solid var(--divider);

      &:hover {
        background-color: var(--hover-surface);
      }

      &:last-of-type {
        border: none;
      }
      
      &__cell {
        text-align: left;
        // white-space: nowrap;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: .75rem;
        padding-right: 0;
        cursor: pointer;

        &:nth-of-type(2n) {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          padding-top: 1rem;
          padding-bottom: 1rem;
          padding-left: 0rem;
          padding-right: .375rem;
          // TODO: padding-right + left (__cell) @media erhöhen
        }

        &__link {
          font-weight: bold;
          // white-space: nowrap;

          &:hover {
            text-decoration: underline;
          }

          &--non-link {
            &:hover {
              text-decoration: none;
            }
          }
        }

        &__container {
          display: flex;
          // justify-content: space-between;
          text-align: center;

          &__item {
            padding-left: .375rem;
            padding-right: .375rem;
            margin-top: auto;
            margin-bottom: auto;
            // margin-right: 1rem;
            cursor: pointer;
            white-space: nowrap;
            // TODO: margin @media einfügen
          }
        }
      }
    }

    // &__row

    // &__row__cell
  }
}

.line-behind--thead {
  box-shadow: inset 0 -.625rem 0 0 var(--textBackdrop);
  padding: 0 .25rem;
}

.tap {
  -webkit-tap-highlight-color: $primary;
}

  // /* tr:nth-of-type(odd) {
  //   //background: rgb(209, 213, 219);
  //   //background: rgb(255, 227, 192);
  //   // background: #fed7aa;
  // } */
  
</style>