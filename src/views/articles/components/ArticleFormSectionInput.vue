<template>
    <input
        :class="{ 'form-article__main__form__section__value--readonly': isReadonly }"
        :style="[ isReadonly ? {'width': `${modelValue.toString().length + 3}ch`} : {'width': 'auto'}]"
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        name="valueInput"
        :id="idForLabel"
        :placeholder="placeholder"
        :readonly="isReadonly" />
</template>

<script>

export default {
    name: 'ArticleFormSectionInput',

    props: ['modelValue', 'idForLabel', 'isReadonly', 'placeholder'],

    emits: ['update:modelValue'],
}
</script>