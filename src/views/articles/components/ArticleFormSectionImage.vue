<template>
    <div class="form-article__main__form__section__row__image">
        <!-- IMAGE -->
        <img
            class="form-article__main__form__section__row__image__img"
            :src="imageURL"
            :id="`imagePreview-${sectionId}`">

        <!-- DARK; TRANSPARENT IMAGE OVERLAY -->
        <!-- <div class="form-article__main__form__section__row__image__overlay"></div> -->

        <!-- CIRCULAR PROGRESS BAR -->
        <div
            class="form-article__main__form__section__row__image__progress"
            :id="`imageProgressBar-${sectionId}`">
        
            <!-- UPLOAD PERCENTAGE -->
            <!-- <div class="form-article__main__form__section__row__image__progress__text" :id="`imageProgressText-${element.id}`">
                {{ uploadPercentage }}
            </div> -->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ArticleFormSectionImage',

        props: {
            sectionId: {
                type: Number,
                required: true,
            },
            imageURL: {
                type: String,
                required: true,
            }
        }
    }
</script>