<template>
    <h1 class="article__section__heading">{{ compProps.heading }}</h1>
</template>

<script>
export default {
    name: 'ArticleDisplayHeading',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>
