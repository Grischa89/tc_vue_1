<template>
    <div class="edit">
        <div class="form-article">
            <div v-if="currentRouteName === 'UpdateArticle'" class="form-article__header">
                <h1 class="form-article__header__title">Update article</h1>
            </div>
            <div v-else class="form-article__header">
                <h1 class="form-article__header__title">Create a new article</h1>
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
            </div>
            <div class="form-article__main">
                <!-- <button v-if="showButtons" class="form-article__main__button" type="button" @click="addRow">Add Row</button> -->
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" :delay="300" :delayOnTouchOnly="true">
                    <template #item="{element}">
                        <div class="form-article__main__form">
                            <label class="form-article__main__form__label" for="key">Section:</label>
                            <select class="form-article__main__form__key" name="key" id="key" v-model="element.key" @focus="setPreviousSelected" @change="disableUniqueOption">
                                <option value selected disabled >Choose A Column</option>
                                <option
                                    v-for="(column, i) in articleSections"
                                    :key="i"
                                    :value="column.name"
                                    :disabled="column.disabled">{{ column.name }}</option>
                            </select>
                            <template v-if="element.key === 'table'">
                                <label class="form-article__main__form__label" for="tableShape">Shape: (n*n=content.length)</label>
                                <input v-model="element.shape" class="form-article__main__form__value" type="text" name="tableShape" id="tableShape" />
                                <label class="form-article__main__form__label" for="tableHead">Head:</label>
                                <input v-model="element.table_head" class="form-article__main__form__value" type="text" name="tableHead" id="tableHead" />
                            </template>
                            <label v-if="element.key.includes('article_')" class="form-article__main__form__label" for="valueSelect">Content:</label>
                            <label v-else-if="element.key === 'listarray'" class="form-article__main__form__label" for="valueInput">Content: (semicolon (;) separated values)</label>
                            <label v-else class="form-article__main__form__label" for="valueInput">Content:</label>
                            <ValueSelect
                                v-if="element.key.includes('article_')"
                                v-model="element.value" />
                            <ValueInput
                                v-else
                                v-model="element.value" />
        
                            <button class="form-article__main__form__button" type="button" @click="deleteRow(element.id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </template>
                </draggable>
                <button v-if="showButtons" class="form-article__main__button" type="button" @click="addRow">Add Row</button>
            </div>
            <div class="form-article__footer">
                <div v-if="errors.length" class="form-article__footer__errors">
                    <p v-for="(error, i) in errors" :key="i">{{ error.message }}</p>
                </div>
                <template v-if="showButtons">
                    <button v-if="currentRouteName === 'UpdateArticle'" class="form-article__footer__button" type="button" @click="submitUpdateForm">Update Article</button>
                    <button v-else class="form-article__footer__button" type="button" @click="submitForm">Create Article</button>
                </template>
            </div>
        </div>
        <div class="preview-article">
            <div class="preview-article__header">
                <h2 class="preview-article__header__title">Article Preview</h2>
            </div>
            <div class="preview-article__main">
                <ArticleTemplate v-if="displayArticle">
                    <ArticleDisplay :article="displayArticle" />
                </ArticleTemplate>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

import draggable from 'vuedraggable'
import Key from '../Key.vue';
import ValueInput from '../ValueInput.vue';
import ValueSelect from '../ValueSelect.vue';
import ArticleTemplate from './ArticleTemplate.vue';
import ArticleDisplay from './ArticleDisplay.vue';

export default {
    name: 'ArticleForm',

    components: {
        draggable,
        Key,
        ValueInput,
        ValueSelect,
        ArticleTemplate,
        ArticleDisplay,
    },

    props: {
        articleToUpdate: {
            type: Array,
            required: false,
        }    
    },

    created() {
        this.$store.dispatch('getArticleSections');
        this.$store.dispatch('getArticleRecommendations');
        console.log('%carticleSections', 'color: darkseagreen; font-weight: bold;', this.articleSections);
    },

    data() {
        return {
            uniqueOptions: ['heading', 'summary'],
            previousSelected: null,
            article: this.articleToUpdate || [],
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
            errors: [],
        }
    },

    computed: {
        currentRouteName() {
            return this.$route.name;
        },

        displayArticle() {
            if (this.article) {
                const article = this.article;

                // Derive loopable array from article
                const articleMapped = article.map(element => {
                    const section = {
                        key: '',
                        value: {}
                    };

                    section.key = element.key;

                    // Handle special case of table on its own
                    if (element.key === 'table' && element.value) {
                        const numberOfColumns = parseInt(element.shape.split(',')[1]);
                        const columns = element.table_head.split(',');
                        const tableContentSplit = element.value.split(',');

                        const rows = [];
                        for (let i = 0; i < tableContentSplit.length; i += numberOfColumns) {
                            const row = tableContentSplit.slice(i, i + numberOfColumns);
                            rows.push(row);
                        }
                        section.table_head = columns;
                        section.rows = rows;
                        return section;
                    }

                    // Handle special case of listarray right when assigning content
                    section.value = element.key === 'listarray' ? element.value.split(';') : element.value;
                    
                    return section;
                });

                return articleMapped;
            }
        },

        ...mapGetters({
            articleSections: 'articleSections',
        }),

        rowCount() {
            return this.article?.length;
        },

        showButtons() {
            return this.article.length > 0 ? true : false;
        },
    },

    methods: {
        setTemplate(e) {
            const templateName = e.target.value;
            // Create deep copy
            const template = JSON.parse(JSON.stringify(this.templates[`${templateName}`]));
            this.article = template;
            this.setDisabledPropsForTemplateArticle();
        },

        setDisabledPropsForTemplateArticle() {
            this.article.forEach(element => {
                if (!element.key) {
                    this.articleSections.forEach(element => element.disabled = false)
                }

                if (this.uniqueOptions.includes(element.key)) {
                    const i = this.findIndexOfUniqueOption(element.key);
                    this.articleSections[i].disabled = true;
                }
            });
        },

        setPreviousSelected(e) {
            this.previousSelected = e.target.value;
        },     

        findIndexOfUniqueOption(uniqueOption) {
            const index = this.articleSections.findIndex(object => {
                    return object.name === uniqueOption;
                });
            return index
        },

        disableUniqueOption(e) {
            const currentSelected = e.target.value;

            // Prevent that any disabled prop can be changed
            // This is actually not possible because the if previousSelected is 'heading' or 'summary' it cannot be the currentSelected (this.disableUniqueOption will not be executed)
            if (this.previousSelected === currentSelected) return

            // If previousSelected is any of the uniqueOptions, this means that it will get changed
            // (since it cannot be re-selected because it's disabled)
            // So the uniqueOptions disabled value can be set to true
            if (this.uniqueOptions.includes(this.previousSelected)) {
                const index = this.findIndexOfUniqueOption(this.previousSelected);
                this.articleSections[index].disabled = false;
            }

            if (this.uniqueOptions.includes(currentSelected)) {
                const index = this.findIndexOfUniqueOption(currentSelected);
                this.articleSections[index].disabled = true;
            }
        },

        async submitForm() {
            const numberOfErrors = await this.validateArticle(this.article);
            if (numberOfErrors === 0) {
                const createSuccess = await this.$store.dispatch('postArticle', this.article);
                if (createSuccess === 201) this.$router.push({ name: 'ListArticles' });
            }
        },

        async submitUpdateForm() {
            const numberOfErrors = await this.validateArticle(this.article);
            if (numberOfErrors === 0) {
                const data = {
                    slug: this.$route.params.slug,
                    article: this.article,
                }
                console.log('%cdata', 'color: darkseagreen; font-weight: bold;', data);
                // const createSuccess = await this.$store.dispatch('updateArticle', data);
                // toString().charAt(0) === '2'
                // if (createSuccess.toString().charAt(0) === '2') this.$router.push({ name: 'ShowArticle', params: { slug: `${data.slug}` } });
            }
        },

        addRow() {
            const newRow = { key: '', value: '', id: Math.floor(Date.now() * Math.random()) };
            this.article.push(newRow);
        },

        deleteRow(id) {
            const index = this.article.findIndex(object => {
                return object.id === id;
            });
            this.article.splice(index, 1);
        },

        validateArticle(article) {
            this.errors = [];
            let headingExists = false;
            let summaryExists = false;

            article.forEach(element => {
                if (!element.key) this.errors.push({ message: `Please choose a section or delete the row.` });

                if (!element.value) this.errors.push({ message: `Please enter content for the section ${element.key} or delete the row.` });

                if (element.key === 'heading') headingExists = true;

                if (element.key === 'summary') summaryExists = true;

                if (element.key === 'table') {
                    if (!element.shape) this.errors.push({ message: 'Please enter a shape for the table.' });
                    const shapeArray = element.shape.split(',');
                    // Check shape for containing only two integer vals
                    if (shapeArray.length > 2) this.errors.push({ message: 'The table shape cannot contain more than two comma separated integers.' });

                    if (!element.table_head) this.errors.push({ message: 'Please enter column names (table heads).' });

                    const numberOfColumnsTableHead = parseInt(element.table_head.split(',').length);
                    const shapeRows = parseInt(shapeArray[0]);
                    const shapeColumns = parseInt(shapeArray[1]);

                    // Check if columns match in head & shape
                    if (numberOfColumnsTableHead !== shapeColumns) this.errors.push({ message: `Number of columns under Head (${numberOfColumnsTableHead}) and under Shape (${shapeColumns}) must match.` });

                    const numberOfTableContentCells = parseInt(element.value.split(',').length);
                    // Check if rows * columns & # of comma separated vals in content match
                    if (numberOfTableContentCells !== (shapeRows * shapeColumns)) this.errors.push({ message: `Number of cells (${numberOfTableContentCells}) and multiplied shape (${shapeRows} * ${shapeColumns} = ${(shapeRows * shapeColumns)}) do not match.` });
                }
            });

            if (!headingExists) {
                this.errors.push({ message: 'Heading is a required section.' });
            }

            if (!summaryExists) {
                 this.errors.push({ message: 'Summary is a required section.' })
            }

            return this.errors.length;
        }
    }
}
</script>
<style lang="scss">
   .edit {
        display: flex;
        flex-direction: column;

        .form-article {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 60rem;
            margin-left: auto;
            margin-right: auto;

            &__header {
                margin-top: 1.5rem;

                &__title {
                    margin-left: auto;
                    margin-right: auto;
                    font-size: $mobile-heading;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: .05rem;
                }

                &__select-start {
                    display: flex;
                    flex-direction: column;
                    margin: 1.5rem auto;

                    &__select {
                        align-self: center;
                        display: block;
                        text-indent: .5rem;
                        margin-bottom: 1rem;
                        border: .0625rem solid var(--border-input);
                        border-radius: 0.25em;
                        text-transform: capitalize;
                        height: 2rem;
                        width: 100%;
                        max-width: 20ch;
                    }

                    &__empty {
                        align-self: center;
                        display: block;
                        padding: .125rem 1rem;
                        border-radius: 0.25em;
                        background-color: var(--text);
                        color: var(--textInverse);
                        text-transform: capitalize;
                        height: 2rem;
                    }

                    &__text {
                        margin-bottom: 1rem;
                    }
                }
            }

            &__main {
                display: flex;
                flex-direction: column;
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;

                &__button {
                    align-self: flex-end;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    margin-bottom: 1rem;
                    height: 2rem;
                    width: 15ch;
                    border-radius: 0.25em;
                    background-color: var(--text);
                    color: var(--textInverse);
                    text-transform: capitalize;
                }

                &__form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: .5rem;
                    border-bottom: .0625rem solid var(--border);

                    &:first-of-type {
                        border-top: .0625rem solid var(--border);
                        padding-top: .25rem;
                    }

                    &__label {
                    align-self: flex-start;
                    margin-top: .25rem;
                    }

                    &__key {
                        align-self: flex-start;
                        text-indent: .25rem;
                        height: 2rem;
                        // margin-right: .5rem;
                        margin-top: .5rem;
                        margin-bottom: .5rem;
                        border: .0625rem solid var(--border-input);
                        border-radius: 0.25em;
                        width: 20ch;
                        // max-width: 
                    }

                    &__value {
                        align-self: flex-start;
                        padding-top: .25rem;
                        padding-bottom: .25rem;
                        padding-left: .5rem;
                        padding-right: .5rem;
                        height: 2rem;
                        width: 100%;
                        margin-top: .5rem;
                        margin-bottom: .5rem;
                        border: .0625rem solid var(--border-input);
                        border-radius: 0.25em;
                        min-height: 2.5rem;
                    }

                    &__button {
                        align-self: flex-start;
                        height: 2rem;
                        padding-left: .5rem;
                        padding-right: .5rem;
                        margin-bottom: .5rem;
                        border-radius: 0.25em;

                        svg {
                            height: 1.25rem;
                            width: 1.25rem;
                            color: var(--error);
                        }
                    }
                }
            }

            &__footer {
                display: flex;
                flex-direction: column;
                margin-bottom: 1.5rem;

                &__errors {
                    margin-left: auto;
                    margin-right: auto;
                    color: var(--error);
                    text-align: left;
                }

                &__button {
                    padding-top: .5rem;
                    padding-bottom: .5rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 0.25em;
                    background-color: var(--secondary);
                    color: $white;
                    font-weight: 600;
                    letter-spacing: .1ch;
                    text-transform: uppercase;
                }
            }


        }

        .preview-article {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 60rem;
            margin-left: auto;
            margin-right: auto;

            &__header {
                margin-top: 1.5rem;

                &__title {
                    margin-left: auto;
                    margin-right: auto;
                    font-size: $mobile-heading;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: .05rem;
                }

            }

            &__main {
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
            }
        }

        @include desktop {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;

            .form-article, .preview-article {
                margin-left: 1rem;
                margin-right: 1rem;
            }
        }
    } 
</style>