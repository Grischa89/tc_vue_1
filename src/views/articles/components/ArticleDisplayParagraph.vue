<template>
    <p class="article__section__paragraph">{{ compProps.paragraph }}</p>
</template>

<script>
export default {
    name: 'ArticleDisplayParagraph',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>