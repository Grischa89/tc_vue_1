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

    computed: {
        ...mapGetters({
            article: 'articleContent'
        })
    }
}
</script>