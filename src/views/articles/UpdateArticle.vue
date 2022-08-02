<template>
    <ArticleForm 
        v-if="article"
        :articleToUpdate="article.articleForForm">
        <template #submitButton="{ articleToValidate }">
            <button class="form-article__footer__button" type="button" @click="submitUpdateForm(articleToValidate)">Update Article</button>
        </template>
    </ArticleForm>
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
    },

    methods: {
        async submitUpdateForm(articleToValidate) {
            const numberOfErrors = await this.$store.dispatch('validateArticle', articleToValidate);
            if (numberOfErrors === 0) {
                const data = {
                    slug: this.$route.params.slug,
                    article: articleToValidate,
                }
                const createSuccess = await this.$store.dispatch('updateArticle', data);
                if (createSuccess.toString().charAt(0) === '2') this.$router.push({ name: 'ListArticlesUpdate' });
            }
        }
    },
}
</script>