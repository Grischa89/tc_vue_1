<template>
  <!-- Shared between auth forms (login etc) & resource forms (code, subscription) since they use the same style -->
  <slot></slot>
</template>

<script>
export default {
    name: 'AddResourceTemplate',

}
</script>

<style lang="scss">
    .form__container {
  // display: flex;
  // justify-content: center;
  width: 90%;
  // padding: 2rem;
  max-width: 24.3076923rem;
  margin: 0 auto 0 auto;

  // @media(min-width: 1024px) {
  //   width: 40%;
  // }
}

.form {
  background-color: var(--surface2);
  padding: .75rem 0;
  border-radius: 0.75rem;
  // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
  box-shadow: $card-shadow rgba($black, 0.2);
  border: .0625rem solid var(--border);

  &__title {
    margin: 1.5rem auto;
    font-size: $mobile-heading;
    font-weight: bold;
    text-transform: uppercase;
    width: 80%;
  }

  &__info {
    margin: .5rem 1rem;

    &--error {
        color: var(--error);
    }

    &__link {
        font-weight: bold;

        &:hover {
          text-decoration: underline;
        }
    }
  }

  &__link {
    display: flex;
    justify-content: flex-end;
    font-size: $mobile-help;
    padding: 0 1.125rem;

    &--error {
      color: var(--error);
      font-weight: bold;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &__group {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
    margin: 1rem auto;

    &__label {
      display: flex;
      align-items: center;
      font-size: $mobile-body;
      text-transform: uppercase;
      letter-spacing: .05rem;
      font-weight: bold;
      margin-bottom: .25rem;
    }

    &__input {
      display: block;
      font-size: $mobile-input;
      text-indent: .5rem;
      // border: 1.5px solid $help;
      border: .0625rem solid var(--border-input);
      // box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.2);
      border-radius: 0.25em;
      height: 3rem;
      // Width needed to stretch input fields to evenly
      width: 100%;

      &::placeholder {
        color: var(--help);
      }

      &:-ms-input-placeholder {
        color: var(--help);
      }

      &::-ms-input-placeholder {
        color: var(--help);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--help-shadow);
      }
  
      &--code {
        // Hide stepper arrows in Firefox
        -moz-appearance:textfield;
        padding-left: .25rem;
      }

      &--code::-webkit-outer-spin-button,
      &--code::-webkit-inner-spin-button {
        // Hide stepper arrows in Chrome, Safari
        -webkit-appearance: none;
        margin: 0;
      }

      &--error {
        outline: none;
        border: 1.5px solid var(--error);
        // box-shadow: 0px 2px 8px 0px rgba($error, 0.2);
      }

      &--error:focus {
        box-shadow: 0 0 0 2px var(--error-shadow);
      }

      &--select {
        // background-color: $white;

        &:disabled {
          background-color: $disabled;
        }
      }


    }

    &__container {
      display: flex;
      // justify-content: space-between;
      width: 100%;
      position: relative;

      .form__group__pw-visibility {
        position: absolute;
        top: 25%;
        right: .5rem;
        font-size: $mobile-help;
        // color: rgba($black, .6);
        color: var(--textHelp);
        user-select: none;

        &:hover {
          color: var(--text);
        }
      }
    }

    &__help {
      color: var(--textHelp);
      // color: $help;
      font-size: $mobile-help;
      text-align: left;
      margin-top: .25rem;
      // color: rgb(200, 0, 0);

      &--normal {
        color: var(--text);
        margin-bottom: 1rem;
      }

      &--error {
        color: var(--error);
      }
      
      &--success {
        color: var(--success);
      }
    }
  }

  &__btn__container {
    margin-top: 1.75rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  &__btn {
    margin: .5rem auto;
    padding: .75em 2.5em;
    text-transform: uppercase;
    font-size: $mobile-body;
    letter-spacing: .05rem;
    font-weight: bold;
    border-radius: $radius-action-button;
    -webkit-tap-highlight-color: transparent;

    &:active {
      outline: none;
      box-shadow: 0 0 0 2px $primary-darker;
    }

    &--submit {
      border-radius: 25px;
      color: $white;
      background-color: var(--secondary);
      -webkit-tap-highlight-color: $primary-darker;
    }

    &--cancel {
      color: var(--text);
    }
  }
}
</style>