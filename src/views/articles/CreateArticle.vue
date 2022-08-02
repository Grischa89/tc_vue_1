<template>
    <ArticleForm>
        <template #submitButton="{ articleToValidate }">
            <button class="form-article__footer__button" type="button" @click="submitForm(articleToValidate)">Create Article</button>
        </template>
    </ArticleForm>
</template>

<script>
import ArticleForm from './components/ArticleForm.vue';

export default {
    name: 'CreateArticle',

    components: {
        ArticleForm,
    },

    methods: {
        async submitForm(articleToValidate) {
            const numberOfErrors = await this.$store.dispatch('validateArticle', articleToValidate);
            if (numberOfErrors === 0) {
                const createSuccess = await this.$store.dispatch('postArticle', articleToValidate);
                if (createSuccess === 201) this.$router.push({ name: 'ListArticlesUpdate' });
            }
        },
    },
}
</script>