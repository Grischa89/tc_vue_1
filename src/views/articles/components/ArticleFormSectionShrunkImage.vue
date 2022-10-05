<template>
    <!-- NOTE: img src is set in ArticleForm component and not passed via a prop. This makes it more difficult to toggle a message for when there is / is not an image since the src attribute needs to be tracked since there is not reactive prop -->
    <!-- <p v-if="!imgSrcSet" class="form-article__main__form__section__identifier">No image uploaded.</p> -->

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

        // See explanation above
        // mounted() {
        //     this.hasImageSrcAttrSet();
        // },
        // data() {
        //     return {
        //         imgSrcSet: false,
        //     }
        // },

        // methods: {
        //     hasImageSrcAttrSet() {
        //         const imgPreview = document.querySelector(`#imagePreviewShrunk-${this.sectionId}`);
        //         this.imgSrcSet = imgPreview.getAttribute('src') ? true : false;
        //     }
        // }
    }
</script>