<template>
    <p>
        {{ identifier }}
    </p>
</template>

<script>
    export default {
        name: 'ArticleFormSectionShrunkIdentifier',

        props: {
            identifier: {
                type: String,
                required: true,
            }
        }
    }
</script>