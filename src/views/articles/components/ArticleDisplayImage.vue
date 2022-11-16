<template>
    <img :src="url" :alt="alt">
</template>

<script>
export default {
    name: 'ArticleDisplayImage',

    props: {
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        }
    }
}
</script>