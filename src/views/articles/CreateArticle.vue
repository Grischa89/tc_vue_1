<template>
    <div class="create">
        <div class="create-article">
            <div class="create-article__header">
                <h1 class="create-article__header__title">Create a new article</h1>
                <div class="create-article__header__select-start">
                    <select class="create-article__header__select-start__select" name="template" id="template" @change="setTemplate">
                        <option value selected disabled>Choose a template</option>
                        <option value="templateBasic">Basic Article</option>
                        <option value="templateTable">Article with Table</option>
                        <option value="templateEmpty">Start Empty</option>
                    </select>
                    <!-- <span class="create-article__header__select-start__text">or</span>
                    <button class="create-article__header__select-start__empty" type="button" @click="setTemplate($event, 'templateEmpty')">Start empty</button> -->
                </div>
            </div>
            <div class="create-article__main">
                <button v-if="showButtons" class="create-article__main__button" type="button" @click="addRow">Add Row</button>
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" :delay="300" :delayOnTouchOnly="true">
                    <template #item="{element}">
                        <div class="create-article__main__form">
                            <label class="create-article__main__form__label" for="key">Section:</label>
                            <select class="create-article__main__form__key" name="key" id="key" v-model="element.key" @focus="setPreviousSelected" @change="disableUniqueOption">
                                <option value selected disabled >Choose A Column</option>
                                <option
                                    v-for="(column, i) in articleSections"
                                    :key="i"
                                    :value="column.name"
                                    :disabled="column.disabled">{{ column.name }}</option>
                            </select>
                            <template v-if="element.key === 'table'">
                                <label class="create-article__main__form__label" for="tableShape">Shape: (n*n=content.length)</label>
                                <input v-model="element.shape" class="create-article__main__form__value" type="text" name="tableShape" id="tableShape" />
                                <label class="create-article__main__form__label" for="tableHead">Head:</label>
                                <input v-model="element.table_head" class="create-article__main__form__value" type="text" name="tableHead" id="tableHead" />
                            </template>
                            <label v-if="element.key.includes('article_')" class="create-article__main__form__label" for="valueSelect">Content:</label>
                            <label v-else-if="element.key === 'listarray'" class="create-article__main__form__label" for="valueInput">Content: (semicolon (;) separated values)</label>
                            <label v-else class="create-article__main__form__label" for="valueInput">Content:</label>
                            <ValueSelect
                                v-if="element.key.includes('article_')"
                                v-model="element.value" />
                            <ValueInput
                                v-else
                                v-model="element.value" />
        
                            <button class="create-article__main__form__button" type="button" @click="deleteRow(element.id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </template>
                </draggable>
                <button v-if="showButtons" class="create-article__main__button" type="button" @click="addRow">Add Row</button>
            </div>
            <div class="create-article__footer">
                <div v-if="errors.length" class="create-article__footer__errors">
                    <p v-for="(error, i) in errors" :key="i">{{ error.message }}</p>
                </div>
                <button v-if="showButtons" class="create-article__footer__button" type="button" @click="submitForm">Create Article</button>
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
import Key from '../articles/Key.vue';
import ValueInput from '../articles/ValueInput.vue';
import ValueSelect from '../articles/ValueSelect.vue';
import ArticleTemplate from './components/ArticleTemplate.vue';
import ArticleDisplay from '../articles/components/ArticleDisplay.vue';

export default {
    name: 'CreateArticle',

    components: {
        draggable,
        Key,
        ValueInput,
        ValueSelect,
        ArticleTemplate,
        ArticleDisplay,
    },

    created() {
        this.$store.dispatch('getArticleSections');
        this.$store.dispatch('getArticleRecommendations');
    },

    data() {
        return {
            uniqueOptions: ['heading', 'summary'],
            previousSelected: null,
            article: [],
            templates: {
                templateEmpty: [
                    { key: '', value: '', id: Date.now() },
                ],
                templateBasic: [
                    { key: 'heading', value: '', id: Date.now() },
                    { key: 'summary', value: '', id: Date.now() - 5 },
                    { key: 'paragraph', value: '', id: Date.now() - 10 },
                ],
                templateTable: [
                    { key: 'heading', value: '', id: Date.now() },
                    { key: 'summary', value: '', id: Date.now() - 11 },
                    { key: 'paragraph', value: '', id: Date.now() - 10 },
                    { key: 'table', value: '', id: Date.now() - 15 },
                ]
            },
            errors: [],
        }
    },

    computed: {
        displayArticle() {
            if (this.article) {
                const article = this.article;

                // Derive loopable array from article
                const articleMapped = article.map(element => {
                    const section = {
                        name: '',
                        content: {}
                    };

                    section.name = element.key;

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
                        section.content['columns'] = columns;
                        section.content['rows'] = rows;
                        return section;
                    }

                    // Handle special case of listarray right when assigning content
                    section.content = element.key === 'listarray' ? element.value.split(';') : element.value;
                    
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

        addRow() {
            // this.rowCount += 1;
            const newRow = { key: '', value: '', id: Date.now() };
            this.article.push(newRow);
            
            console.log('%cthis.article', 'color: darkseagreen; font-weight: bold;', this.article);
        },

        deleteRow(id) {

            console.log('%cBEFORE', 'color: darkseagreen; font-weight: bold;', typeof this.article, this.article.length, id);
            // this.article = this.article.filter(item => { item.id !== id});
            console.log('%cAFTER', 'color: darkseagreen; font-weight: bold;', this.article);
            const index = this.article.findIndex(object => {
                return object.id === id;
            });

            console.log('%cindex', 'color: darkseagreen; font-weight: bold;', index);
            this.article.splice(index, 1);
        },

        validateArticle(article) {
            this.errors = [];
            let headingExists = false;
            let summaryExists = false;

            article.forEach(element => {
                if (!element.key) this.errors.push({ message: `Please choose a section or delete the row.` });

                if (!element.value) {
                    console.log('%cNO VALUE', 'color: red; font-weight: bold;', element);
                    this.errors.push({ message: `Please enter content for the section ${element.key} or delete the row.` });
                }

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
    .create {
        display: flex;
        flex-direction: column;

        .create-article {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 60rem;
            margin-left: auto;
            margin-right: auto;

            // background-color: rgba(#fff, .1);
            

            // @include tablet {
            //     width: 90%;
            // // padding: 2rem;
            // max-width: 70%; //24.3076923rem;
            // margin: 0 auto 0 auto;
            // }

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

                    // @include tablet-landscape {
                    //     flex-direction: row;
                    //     align-items: flex-start;

                    //     :not(:last-child) {
                    //         margin-right: .5rem;
                    //     }


                    // }

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
                        text-indent: .5rem;
                        padding-top: .25rem;
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

            .create-article, .preview-article {
                margin-left: 1rem;
                margin-right: 1rem;
            }
        }
    }
</style>