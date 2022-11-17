<template>
    <div class="article__section__imageContainer">
        <ArticleDisplayImage 
        :compProps="compProps"
        class="article__section__image--nonTitleImage"/>
        <ArticleDisplayImageCaption
            v-if="compProps.alt" 
            :caption="compProps.alt"
            class="article__section__image__caption" />
    </div>
</template>

<script>
import ArticleDisplayImage from './ArticleDisplayImage.vue';
import ArticleDisplayImageCaption from './ArticleDisplayImageCaption.vue';

export default {
    name: 'ArticleDisplayImageContainer',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    },

    components: {
        ArticleDisplayImage,
        ArticleDisplayImageCaption
    }
}
</script>