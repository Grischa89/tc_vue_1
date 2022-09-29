<template>
    <h6>
        {{ title }}
    </h6>
</template>

<script>
    export default {
        name: 'ArticleFormSectionShrunkTitle',

        props: {
            title: {
                type: String,
                required: true,
            }
        }
    }
</script>