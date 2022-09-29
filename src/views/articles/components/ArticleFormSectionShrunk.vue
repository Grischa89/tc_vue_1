<template>
    <div>
        <slot name="buttonExpand"></slot>

        <ArticleFormSectionShrunkTitle
            class="form-article__main__form__section__title"
            :title="title" />

        <ArticleFormSectionShrunkIdentifier
            class="form-article__main__form__section__identifier"
            :identifier="identifier" />
    </div>
</template>

<script>
import ArticleFormSectionShrunkTitle from './ArticleFormSectionShrunkTitle.vue';
import ArticleFormSectionShrunkIdentifier from './ArticleFormSectionShrunkIdentifier.vue';

export default {
    name: 'ArticleFormSectionShrunk',
    props: {
        title: {
            type: String,
            required: true,
        },
        identifier: {
            required: true,
        }
    },
    components: {
        ArticleFormSectionShrunkTitle,
        ArticleFormSectionShrunkIdentifier,
    },
}
</script>