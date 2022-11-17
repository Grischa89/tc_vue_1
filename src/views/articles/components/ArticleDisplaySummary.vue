<template>
    <p class="article__section__summary">{{ compProps.summary }}</p>
</template>

<script>
export default {
    name: 'ArticleDisplaySummary',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>