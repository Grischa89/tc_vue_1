<template>
    <input
        :class="{ 'form-article__main__form__section__value--readonly': isReadonly }"
        :style="{ width: `${modelValue.toString().length + 2}ch` }"
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        name="valueInput"
        :id="idForLabel"
        :readonly="isReadonly" />
</template>

<script>

export default {
    name: 'ValueInput',

    props: ['modelValue', 'idForLabel', 'isReadonly'],

    emits: ['update:modelValue'],
}
</script>

<style>

</style>