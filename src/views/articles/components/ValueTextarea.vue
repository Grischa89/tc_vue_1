<template>
    <textarea 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        name="valueTextarea" 
        :id="idForLabel" 
        rows="10"></textarea>
</template>

<script>

export default {
    name: 'ValueTextarea',

    props: ['modelValue', 'idForLabel'],

    emits: ['update:modelValue'],
}
</script>

<style>

</style>