<template>
    <!-- <input class="form-article__main__form__value" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"  /> -->
    <textarea class="form-article__main__form__value" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" name="valueInput" id="valueInput" cols="35" rows="1"></textarea>
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