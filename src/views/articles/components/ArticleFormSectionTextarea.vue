<template>
    <textarea 
        class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        name="valueTextarea" 
        :id="idForLabel" 
        rows="5"></textarea>
</template>

<script>

export default {
    name: 'ValueTextarea',

    props: ['modelValue', 'idForLabel'],

    emits: ['update:modelValue'],
}
</script>