<template>
    <ArticleTemplate v-if="article">
        <ArticleDisplay
        :article="article.articleForDisplay" />
    </ArticleTemplate>
</template>
<script>
import { mapGetters } from 'vuex';

import ArticleDisplay from '../articles/components/ArticleDisplay.vue';
import ArticleTemplate from './components/ArticleTemplate.vue';

export default {
    name: 'ShowArticle',

    components: {
        ArticleTemplate,
        ArticleDisplay,
    },

    created() {
        this.$store.dispatch('getArticle', this.$route.params.slug);
    },

    computed: {
        ...mapGetters({
            article: 'articleContent',
            meta: 'articleMeta',
        })
    }
}
</script>