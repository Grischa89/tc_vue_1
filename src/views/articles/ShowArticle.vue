<template>
    <ArticleTemplate v-if="loadStatus === 'success' && article">
        <ArticleDisplay
        :article="article.articleForDisplay"
        :meta="meta" />
    </ArticleTemplate>

    <AsyncErrorFetchingData v-if="loadStatus === 'error'">
        <template #title>
        Sorry &#128533;
        </template>

        <template #text>
        {{ errorRetrievingArticle }}
        </template>

        <template #action>
        <button class="error__page__btn error__page__btn--action">
            <router-link :to="{ name: 'ListArticles' }">Latest articles</router-link>
        </button>
        </template>
    </AsyncErrorFetchingData>
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

    data() {
        return {
            errorRetrievingArticle: 'The article you requested could not be found.'
        }
    },

    created() {
        this.$store.dispatch('getArticle', this.$route.params.slug);
    },

    computed: {
        ...mapGetters({
            loadStatus: 'singleArticleLoadStatus',
            article: 'articleContent',
            meta: 'articleMeta',
        })
    }
}
</script>