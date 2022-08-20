<template>
    <ArticleForm 
        v-if="article"
        :articleToUpdate="article.articleForForm">
            <template #title>
                <h1 class="form-article__header__title">{{ title }}</h1>
            </template>

            <template #submitButton="{ articleToValidate }">
                <button class="form-article__footer__button" type="button" @click="submitUpdateForm(articleToValidate)">{{ submitButtonText }}</button>
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

    data() {
        return {
            title: 'Edit Article',
            submitButtonText: 'Update Article',
        }
    },

    created() {
        const articleSectionsSuccess = this.$store.dispatch('getArticleSections');
        const articleSuccess = this.$store.dispatch('getArticle', this.$route.params.slug);

        Promise.all([articleSectionsSuccess, articleSuccess])
            .then(values => {
                this.$store.dispatch('setDisabledSectionValuesBasedOnArticle', this.article.articleForForm);
            })
        this.$store.dispatch('getArticleRecommendations');
        
    },

    beforeUnmount() {
        // Clear article form by setting article to empty string so chosen article will be shown in fomr and NOT article from the last request
        this.$store.commit('setArticle', '');
        this.$store.commit('setArticleValidationErrors', '');
    },

    computed: {
        ...mapGetters({
            article: 'articleContent'
        })
    },

    methods: {
        submitUpdateForm(articleToValidate) {
            const numberOfErrors = this.$store.dispatch('validateArticle', articleToValidate);
            const user = this.$store.dispatch('getUserProfile');

            Promise.all([numberOfErrors, user])
                .then(async values => {
                    const [errors, user] = values;

                    if (errors === 0 && user.is_staff === true) {
                        const data = {
                            slug: this.$route.params.slug,
                            article: articleToValidate,
                        }
                        return await this.$store.dispatch('updateArticle', data);
                    }
                })
                .then(createSuccess => {
                    if (createSuccess.toString().charAt(0) === '2') this.$router.push({ name: 'ListArticlesUpdate' });
                })
                .catch(err => {
                    console.log('%cerr in Promise.all (update)', 'color: red; font-weight: bold;', err);

                    if (err.response) console.log('%cerr.response', 'color: red; font-weight: bold;', err.response);
                });
        }
    },
}
</script>