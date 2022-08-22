<template>
    <ArticleForm 
        v-if="article"
        :articleToUpdate="article.articleForForm">
            <template #title>
                <h1 class="form-article__header__title">{{ title }}</h1>
            </template>

            <template #submitButton="{ articleToValidate, imagesToValidate }">
                <button class="form-article__footer__button" type="button" @click="submitUpdateForm(articleToValidate, imagesToValidate)">{{ submitButtonText }}</button>
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
        createFormData(article, images) {
            const formData = new FormData();

            formData.append('data', JSON.stringify(article));
            for (const image of images) {
                formData.append('file', image);
            }

            return formData;
        },

        async submitUpdateForm(articleToValidate, imagesToValidate) {
            const [numberOfErrors, user] = await Promise.all([this.$store.dispatch('validateArticle', articleToValidate), this.$store.dispatch('getUserProfile')]);

            if (numberOfErrors !== 0 || user.is_staff !== true) return;

            const formData = this.createFormData(articleToValidate, imagesToValidate);
            const data = {
                            slug: this.$route.params.slug,
                            article: formData,
                        }
            const updateSuccess = await this.$store.dispatch('updateArticle', data);
            if (updateSuccess.toString().charAt(0) === '2') this.$router.push({ name: 'ListArticlesUpdate' });
        }
    },
}
</script>