<template>
    <div v-if="articles" class="articles">
        <div class="articles__header">
            <h1 class="articles__header__title">Choose an article to update</h1>
        </div>
        <ArticleListPreview 
            v-for="(article, i) in articles"
            :key="i"
            :article="article"
            :isUpdateRoute="isUpdateRoute" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ArticleListPreview from './components/ArticleListPreview.vue'

export default {
    name: 'ListArticlesUpdate',

    components: {
        ArticleListPreview,
    },

    created() {
        this.$store.dispatch('getArticles');
    },

    data() {
        return {
            isUpdateRoute: true,
        }
    },

    computed: {
        ...mapGetters({
            articles: 'articles',
        }),
    }
}
</script>

<style lang="scss">
    .articles {
        width: 95%;
        max-width: 70ch;
        margin-left: auto;
        margin-right: auto;

        &__header {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;

                &__title {
                    margin-left: auto;
                    margin-right: auto;
                    font-size: $mobile-heading;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: .05rem;
                }
        }
    }
</style>