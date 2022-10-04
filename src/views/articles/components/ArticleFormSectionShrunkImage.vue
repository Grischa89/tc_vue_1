<template>
    <div class="form-article__main__form__section__image">
        <img
            class="form-article__main__form__section__image__img"
            :src="compProps.imageURL"
            :id="`imagePreviewShrunk-${sectionId}`">
    </div>
</template>

<script>
    export default {
        name: 'ArticleFormSectionShrunkImage',

        props: {
            compProps: {
                type: Object,
                required: true,
            },
            sectionId: {
                type: Number,
                required: true,
            }
        },
    }
</script>