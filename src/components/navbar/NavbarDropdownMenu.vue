<template>
  <!-- Hidden (display: none;) checkbox element that registers the click through which the dropdown list gets expanded -->
  <input type="checkbox" id="dropdown" name="dropdown" class="dropdown__toggle-menu" ref="dropdown">
  <label for="dropdown" class="navbar__menu__item__link">
    <span>Continents</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="dropdown__toggle-menu__btn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </label>

  <!-- Click on dropdown link closes dropdown and navbar when expanded -->
  <ul v-if="dropdownItems" class="dropdown__menu" @click="$emit('closeDropdownMenu')">
    <li v-for="(item, i) in dropdownItems" :key="i" class="dropdown__menu__item"><router-link :to="`${item.slug}`" class="dropdown__menu__item__link">{{ item.name }}</router-link></li>
  </ul>
</template>

<script>
export default {
  name: 'NavbarDropdownMenu',

  emits: ['closeDropdownMenu'],

  props: ['dropdownItems'],
  
}
</script>

<style lang="scss" scoped>
.dropdown__toggle-menu {
  display: none;
}

.dropdown__toggle-menu__btn {
  height: 1.25rem; // 20px
  width: 1.25rem; // 20px
  margin-left: .25rem; // 4px
}

.dropdown__menu {
  display: none;
  padding-bottom: .5rem; // 8px
  // font-size: 0.875rem/* 14px */;
  // line-height: 1.25rem/* 20px */;
  border-radius: 0.25rem/* 4px */;
  z-index: 60;

  &__item {

    &:hover {
      background-color: var(--hover-surface);
    }

    &__link{
      // py-1 text-md inline-flex items-center justify-content
      display: inline-flex;
      padding: .25rem 0; // 4px
    }
  }

  // &__item

  @media (min-width: 1024px) {
    margin-top: .5rem; // 8px
  }
}
/* When hidden input[type=checkbox] gets checked, the ul with .dropdown
gets attached the display block property and is therfor visible. */
input:checked~ul.dropdown__menu {
  display: block;
}
</style>