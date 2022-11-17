<template>
    <img :src="compProps.url" :alt="compProps.alt" class="article__section__image">
</template>

<script>
export default {
    name: 'ArticleDisplayImage',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>