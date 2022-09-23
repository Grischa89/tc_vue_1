<template>
    <!-- <input class="form-article__main__form__value" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"  /> -->
    <textarea class="form-article__main__form__value" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" name="valueInput" :id="idForLabel" cols="35" rows="1"></textarea>
</template>

<script>

export default {
    name: 'ValueInput',

    props: ['modelValue', 'idForLabel'],

    emits: ['update:modelValue'],
}
</script>

<style>

</style>