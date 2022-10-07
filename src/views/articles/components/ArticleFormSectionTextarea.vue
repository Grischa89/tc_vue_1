<template>
    <textarea 
        class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        name="valueTextarea" 
        :id="idForLabel" 
        :rows="rows || 5"></textarea>
</template>

<script>

export default {
    name: 'ValueTextarea',

    props: {
        modelValue: String,
        idForLabel: {
            type: String,
            required: true,
        },
        rows: {
            type: Number,
            required: false,
        }
    },
    // ['modelValue', 'idForLabel'],

    emits: ['update:modelValue'],
}
</script>