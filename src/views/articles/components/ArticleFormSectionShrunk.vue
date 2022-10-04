<template>
    <div>
        <slot name="buttonExpand"></slot>

        <ArticleFormSectionShrunkTitle
            class="form-article__main__form__section__title"
            :title="title" />

        <component 
            :is="comp" 
            :sectionId="sectionId" 
            :compProps="compProps">
        </component>
    </div>
</template>

<script>
import ArticleFormSectionShrunkTitle from './ArticleFormSectionShrunkTitle.vue';
import ArticleFormSectionShrunkIdentifier from './ArticleFormSectionShrunkIdentifier.vue';
import ArticleFormSectionShrunkImage from './ArticleFormSectionShrunkImage.vue';

export default {
    name: 'ArticleFormSectionShrunk',
    props: {
        title: {
            type: String,
            required: true,
        },
        identifier: {
            type: String,
            required: true,
        },
        sectionId: {
            type: Number,
            required: true,
        },
        sectionType: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: false,
        }
    },
    components: {
        ArticleFormSectionShrunkTitle,
        ArticleFormSectionShrunkIdentifier,
    },
    computed: {
        comp() {
            return this.sectionType === 'image' ? ArticleFormSectionShrunkImage : ArticleFormSectionShrunkIdentifier;
        },
        compProps() {
           return this.sectionType === 'image' ? { imageURL: this.imageURL } : { sectionIdentifier: this.identifier };
        },
    }
}
</script>