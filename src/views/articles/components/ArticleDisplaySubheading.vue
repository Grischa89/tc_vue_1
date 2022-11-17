<template>
    <h2 class="article__section__subheading">{{ compProps.subheading }}</h2>
</template>

<script>
export default {
    name: 'ArticleDisplaySubheading',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>