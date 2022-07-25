<template>
    <div v-if="articles" class="articles">
        List article
        <ArticleListPreview 
            v-for="(article, i) in articles"
            :key="i"
            :article="article" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ArticleListPreview from './components/ArticleListPreview.vue'

export default {
    name: 'ListArticles',

    components: {
        ArticleListPreview,
    },

    created() {
        this.$store.dispatch('getArticles');
    },

    data() {
        return {
            isUpdateRoute: false,
        }
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