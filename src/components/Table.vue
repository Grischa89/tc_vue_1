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
              <router-link class="tooltip table__body__row__cell__link" :to="`/${code.continent_slug}/${code.country_slug}`">{{ code.country }}</router-link>
            </td>

            <td class="table__body__row__cell"
              :data-code="code.player_code"
              >
              <div class="table__body__row__cell__container">
                <div v-if="code.prettyCode" class="table__body__row__cell__container__item tap tooltip" data-tooltip="Click to copy!" @click="copyCodeToClipboard($event)">{{ code.prettyCode }}</div>

                <div v-else class="table__body__row__cell__container__item" @click="copyCodeToClipboard($event)" >{{ code.player_code }}</div>

                <IconButton @click="copyCodeToClipboard($event)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor"  id="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </IconButton>
              </div>

              <div  class="table__body__row__cell__container">
                

                <IconButton @click="openQRCodeModal(code)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd" />
                    <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                  </svg>
                </IconButton>
              </div>
            </td>
          </tr>
          <Teleport to="body">
                  <ModalQRCode 
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
import IconButton from './icon-button/IconButton.vue';
import ModalQRCode from './ModalQRCode.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'Table',

  components: {
    IconButton,
    ModalQRCode,
  },

  data() {
    return {
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
      console.log('parent', parent, parent.dataset.code);
      this.$store.dispatch('copyCodeToClipboard', parent.dataset.code);
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
    }

  },
 
}
</script>

<style lang="scss">
.table__wrapper {
  // flex flex-col justify-around items-center
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  &__title {
    // text-lg font-bold uppercase tracking-wider my-2
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: .05rem;
    margin: .5rem 0;
  }

  &__card {
    // flex flex-col mx-auto my-2 py-1 bg-white rounded shadow border-b border-gray-300 w-10/12 sm:max-w-md
    display: flex;
    flex-direction: column;
    margin: .5rem auto;
    // padding: .25rem 0;
    border-radius: .75rem;
    width: 100%;
    // width: 83.333333%;
    box-shadow: $card-shadow rgba($black, 0.2); 
    -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    -moz-box-shadow: $card-shadow rgba($black, 0.2);
    // TODO: @media für alles > mobile
    // max-width: 450px;
    max-width: 60ch;
    background-color: $white;
  }
}

.table {
  // table-fixed text-sm
  table-layout: fixed;
  font-size: $mobile-body;

  &__head {
    border-bottom: 1px solid rgba(0, 0, 0, .3);

    &__row {
      // background-color: $primary-darker;

      &__cell {
        // w-2/5 py-2 px-4 text-left uppercase
        padding:1rem;
        text-align: left;
        text-transform: uppercase;
        width: 50%;
      }
    }
  }

  &__body {

    &__row {

      border-bottom: 1px solid rgba(0, 0, 0, .1);

      &:hover {
        background-color: $primary;
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

        &:nth-of-type(2n) {
          display: flex;
          justify-content: space-between;
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
  box-shadow: $line-behind;
  padding: 0 .25rem;
}

.tap {
  -webkit-tap-highlight-color: $primary;
}

.tooltip {
  position: relative;
  text-decoration: none;
  // display: inline;
}

// .tooltip:hover:after{
//   display: -webkit-flex;
//   display: flex;
//   -webkit-justify-content: center;
//   justify-content: center;
//   background: #444;
//   border-radius: 8px;
//   color: #fff;
//   content: 'Hello!';
//   margin: -82px auto 0;
//   font-size: 16px;
//   padding: 13px;
//   width: 220px;
// }
// .tooltip:hover:before{
//   border: solid;
//   border-color: #444 transparent;
//   border-width: 12px 6px 0 6px;
//   content: "";
//   left: 45%;
//   bottom: 30px;
//   position: absolute;
// }

.tooltip::after {
  content: 'Awesome tooltip!';
  position: absolute;
  bottom: 130%;
  left: 20%;
  background: $secondary;
  padding: 5px 15px;
  color: #FFF;
  -webkit-border-radius: 10px;
  -moz-border-radius : 10px;
  border-radius : 10px;
  white-space: nowrap;
  opacity: 0;
  -webkit-transition: all 0.4s ease;
  -moz-transition : all 0.4s ease;
  transition : all 0.4s ease;
}

.tooltip::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 20px solid $secondary;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  // -webkit-transition: all 0.4s ease;
  // -moz-transition : all 0.4s ease;
  // transition : all 0.4s ease;
  opacity: 0;
  left: 30%;
  bottom: 90%;
}

.tooltip:hover::after {
  bottom: 100%;
}

.tooltip:hover::before {
  bottom: 70%;
}

.tooltip:hover::after, .table__body__row__cell_link:hover::before {
  opacity: 0;
}

  /* tr:nth-of-type(odd) {
    //background: rgb(209, 213, 219);
    //background: rgb(255, 227, 192);
    // background: #fed7aa;
  } */
  thead .thead-row {
    background: white;
  }
  
</style>