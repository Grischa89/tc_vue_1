<template>
    <p>
        {{ compProps.sectionIdentifier }}
    </p>
</template>

<script>
    export default {
        name: 'ArticleFormSectionShrunkIdentifier',

        props: {
            compProps: {
                type: Object,
                required: true,
            }
        }
    }
</script>