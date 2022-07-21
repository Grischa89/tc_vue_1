<template>
    <div v-if="articles" class="articles">
        List article
        <ArticlePreview 
            v-for="(article, i) in articles"
            :key="i"
            :article="article" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ArticlePreview from './components/ArticlePreview.vue'

export default {
    name: 'ListArticles',

    components: {
        ArticlePreview,
    },

    created() {
        this.$store.dispatch('getArticles');
    },

    computed: {
        ...mapGetters({
            articles: 'articles',
        })
    }

}
</script>
<style lang="scss">
    .articles {
        width: 95%;
        max-width: 70ch;
        margin-left: auto;
        margin-right: auto;
    }
</style>