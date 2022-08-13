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

        <template #submitButton="{ articleToValidate, imagesToValidate }">
            <button class="form-article__footer__button" type="button" @click="submitForm(articleToValidate, imagesToValidate)">{{ submitButtonText }}</button>
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
        createFormData(article, images) {
            const formData = new FormData();

            formData.append('data', article);
            for (const image of images) {
                formData.append('file', image);
            }

            return formData;
        },

        submitForm(articleToValidate, imagesToValidate) {
            console.log('%cdata', 'color: darkseagreen; font-weight: bold;', articleToValidate, imagesToValidate);
            const numberOfErrors = this.$store.dispatch('validateArticle', articleToValidate);
            const user = this.$store.dispatch('getUserProfile');

            Promise.all([numberOfErrors, user])
                .then(values => {
                    console.log('%cvalues', 'color: hotpink; font-weight: bold;', values[0], values[1].data.is_staff);

                    if (values[0] === 0 && values[1].data.is_staff) {
                        const formData = this.createFormData(articleToValidate, imagesToValidate);
                        return formData;
                    }
                })
                .then(async formData => {
                    const createSuccess = await this.$store.dispatch('postArticle', formData);
                    if (createSuccess === 201) this.$router.push({ name: 'ListArticlesUpdate' });
                });

            // const formData = new FormData();

            // formData.append('data', JSON.stringify(articleToValidate));
            // for (const image of imagesToValidate) {
            //     console.log('%cfile to append', 'color: blue; font-weight: bold;', image, image.data);
            //     formData.append('file', image.data);
            // }

            // const createSuccess = await this.$store.dispatch('postArticle', formData);
            // if (createSuccess === 201) this.$router.push({ name: 'ListArticlesUpdate' });
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