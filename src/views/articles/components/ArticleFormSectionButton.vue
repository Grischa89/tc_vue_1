<template>
    <button type="button">
        <slot name="text-prepend"></slot>
        <slot name="icon"></slot>
        <slot name="text-append"></slot>
    </button>
</template>

<script>
    export default {
        name: 'ArticleFormSectionButton',
    }
</script>