<template>
  <div class="table__wrapper">

    <h1 v-if="title" class="table__wrapper__title">{{ title }}</h1>
    <h1 v-else class="table__wrapper__title">Recent Codes</h1>

    <!-- For small devices table has width of 11/12, from sm-breakpoint on has max-width of md (448px) -->
    <div class="table__wrapper__card">
      <!-- Alternative width proportions: w-10/12 sm:w-8/12 md:w-6/12 lg:max-w-md -->
      
      <table class="table">
        <thead class="table__head">
          <tr class="table__head__row">
            <th scope="col" class="table__head__row__cell"><span class="line-behind--thead">Country</span></th>
            <th scope="col" class="table__head__row__cell"><span class="line-behind--thead">Trainercode</span></th>
          </tr>
        </thead>
        <tbody class="table__body">
          <tr v-for="(code, i) in codes" :key="i" class="table__body__row">
            <td class="table__body__row__cell">
              <router-link class="tooltip table__body__row__cell__link" :to="`/${code.continent_slug}/${code.country_slug}`">{{ code.country }}</router-link>
            </td>

            <td class="table__body__row__cell"
              :data-code="code.player_code"
              >
              <div class="table__body__row__cell__container">
                <div v-if="code.prettyCode" class="table__body__row__cell__container__item tap tooltip" data-tooltip="Click to copy!" @click="copyCodeToClipboard($event)">{{ code.prettyCode }}</div>

                <div v-else class="table__body__row__cell__container__item" @click="copyCodeToClipboard($event)" >{{ code.player_code }}</div>

                <CopyButton @click="copyCodeToClipboard($event)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import CopyButton from './copy-button/CopyButton.vue';

export default {
  name: 'Table',

  components: {
    CopyButton,
  },

  // Maybe list props as object, props: { latestCodes: { type: Array, required: true } }
  props: {
    codes: {
      type: Array,
      // required: true,
    },

    title: {
      type: String,
      // required: true,
    },
  },

  methods: {
    
    copyCodeToClipboard(e) {
      const parent = e.target.closest('td');
      // console.log('parent', parent, parent.dataset.code);
      this.$store.dispatch('copyCodeToClipboard', parent.dataset.code);
    },

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
    width: 90%;
    // width: 83.333333%;
    box-shadow: $card-shadow rgba($black, 0.2); 
    -webkit-box-shadow: $card-shadow rgba($black, 0.2); 
    -moz-box-shadow: $card-shadow rgba($black, 0.2);
    // TODO: @media für alles > mobile
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
        padding: 1rem;
        

        &__link {
          font-weight: bold;
          // white-space: nowrap;

          &:hover {
            text-decoration: underline;
          }
        }

        &__container {
          display: flex;
          justify-content: space-between;
          text-align: center;

          &__item {
            margin-top: auto;
            margin-bottom: auto;
            margin-right: 1rem;
            cursor: pointer;
            white-space: nowrap;
          }
        }
      }
    }

    // &__row

    // &__row__cell
  }
}

.line-behind--thead {
  box-shadow: inset 0 -10px 0 0 $primary-darker;
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