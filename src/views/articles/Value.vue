<template>
    <input type="text" @input="handleInput" />
</template>

<script>

export default {
    name: 'Value',

    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value);
        }
    }
}
</script>

<style>

</style>