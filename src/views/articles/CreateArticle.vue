<template>
    <ArticleForm :chosenTemplate="chosenTemplate">
        <template #title>
            <h1 class="form-article__header__title">{{ title }}</h1>
        </template>

        <template #templateSelect>
                <div class="form-article__header__select-start">
                <select class="form-article__header__select-start__select" name="template" id="template" @change="setTemplate">
                    <option value selected disabled>Choose a template</option>
                    <option value="templateBasic">Basic Article</option>
                    <option value="templateTable">Article with Table</option>
                    <option value="templateEmpty">Start Empty</option>
                </select>
                <!-- <span class="form-article__header__select-start__text">or</span>
                <button class="form-article__header__select-start__empty" type="button" @click="setTemplate($event, 'templateEmpty')">Start empty</button> -->
            </div>
        </template>

        <template #submitButton="{ articleToValidate }">
            <button class="form-article__footer__button" type="button" @click="submitForm(articleToValidate)">{{ submitButtonText }}</button>
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

    data() {
        return {
            title: 'Create a new article',
            submitButtonText: 'Create Article',
            templates: {
                templateEmpty: [
                    { key: '', value: '', id: Math.floor(Date.now() * Math.random()) },
                ],
                templateBasic: [
                    { key: 'heading', value: '', id: Math.floor(Date.now() * Math.random()) },
                    { key: 'summary', value: '', id: Math.floor(Date.now() * Math.random()) },
                    { key: 'paragraph', value: '', id: Math.floor(Date.now() * Math.random()) },
                ],
                templateTable: [
                    { key: 'heading', value: '', id: Math.floor(Date.now() * Math.random()) },
                    { key: 'summary', value: '', id: Math.floor(Date.now() * Math.random()) },
                    { key: 'paragraph', value: '', id: Math.floor(Date.now() * Math.random()) },
                    { key: 'table', value: '', id: Math.floor(Date.now() * Math.random()) },
                ]
            },
            chosenTemplate: [],
        }
    },

    created() {
        this.$store.dispatch('getArticleSections');
        this.$store.dispatch('getArticleRecommendations');
    },

    beforeUnmount() {
        this.$store.commit('setArticleValidationErrors', '');
    },

    methods: {
        submitForm(articleToValidate) {
            const numberOfErrors = this.$store.dispatch('validateArticle', articleToValidate);
            const user = this.$store.dispatch('getUserProfile');

            Promise.all([numberOfErrors, user])
                .then(async values => {
                    console.log('%cvalues', 'color: hotpink; font-weight: bold;', values[0], values[1].data.is_staff);

                    if (values[0] === 0 && values[1].data.is_staff) {
                        const createSuccess = await this.$store.dispatch('postArticle', articleToValidate);
                        if (createSuccess === 201) this.$router.push({ name: 'ListArticlesUpdate' });
                    }
                });
        },

        setTemplate(e) {
            const templateName = e.target.value;
            // Create deep copy
            const template = JSON.parse(JSON.stringify(this.templates[`${templateName}`]));
            this.chosenTemplate = template;
            this.$store.dispatch('setDisabledSectionValuesBasedOnArticle', this.chosenTemplate);
        },
    },
}
</script>