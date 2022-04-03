<template>
  <button class="button">
    <svg xmlns="http://www.w3.org/2000/svg" class="button__prepend" fill="none" viewBox="0 0 24 24" stroke="currentColor"  id="icon">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'CopyButton',

}
</script>

<style lang="scss" scoped>
.button {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // height: 1.25rem;
  // width: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: #E5E7EB;
  padding: .375rem;
  -webkit-tap-highlight-color: hsl(220, 13%, 99%);

  &__prepend {
    height: 1.25rem;
    width: 1.25rem;
  }

  &:hover, &:active {
    color: #a6a8ac;
  }

  @media(min-width: 612px) {
    &:hover, &:active {
      background-color: #a6a8ac;
      color: black;
    }
  }

  // TODO: Wenn Farben stehen für @mobile mehr suttle wählen als
  

  

  // &:active, {
  //   background-color: #E5E7EB;
  //   // transform: translateY(3px)
  // }

  // &:focus {
  //   color: white;
  // }
}

</style>
