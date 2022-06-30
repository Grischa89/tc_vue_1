<template>
    <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ValueInput',

    props: ['modelValue'],

    emits: ['update:modelValue'],

    computed: {
        ...mapGetters({
            articleRecommendations: 'articleRecommendations'
        }),
    }
}
</script>

<style>

</style>