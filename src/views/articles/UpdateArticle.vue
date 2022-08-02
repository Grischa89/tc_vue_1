<template>
    <ArticleForm 
        v-if="article"
        :articleToUpdate="article.articleForForm" />
</template>
<script>
import { mapGetters } from 'vuex';

import ArticleForm from './components/ArticleForm.vue';

export default {
    name: 'UpdateArticle',

    components: {
        ArticleForm
    },

    created() {
        this.$store.dispatch('getArticle', this.$route.params.slug);
    },

    beforeUnmount() {
        // Clear article form by setting article to empty string so chosen article will be shown in fomr and NOT article from the last request
        this.$store.commit('setArticle', '');
    },

    computed: {
        ...mapGetters({
            article: 'articleContent'
        })
    }
}
</script>