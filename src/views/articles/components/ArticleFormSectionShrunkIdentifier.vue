<template>
    <p class="form-article__main__form__section__identifier">
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