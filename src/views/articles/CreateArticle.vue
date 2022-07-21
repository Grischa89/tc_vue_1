<template>
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
                        <!-- <Key v-model="element.key" /> -->
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
                            <input v-model="element.table_head" class="create-article__main__form__value" type="text" name="tableHead" id="tableHead">
                        </template>

                        <label v-if="element.key.includes('article_')" class="create-article__main__form__label" for="valueSelect">Content:</label>
                        <label v-else class="create-article__main__form__label" for="valueInput">Content:</label>
                        <ValueSelect 
                            v-if="element.key.includes('article_')"
                            v-model="element.value" />

                        <!-- TODO: if key === 'table' -->

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
            <button v-if="showButtons" class="create-article__footer__button" type="button" @click="submitForm">Create Article</button>
        </div>
        {{ article }}
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import draggable from 'vuedraggable'
import Key from '../articles/Key.vue';
import ValueInput from '../articles/ValueInput.vue';
import ValueSelect from '../articles/ValueSelect.vue';
import ArticleDisplay from '../articles/components/ArticleDisplay.vue';

export default {
    name: 'CreateArticle',

    components: {
        draggable,
        Key,
        ValueInput,
        ValueSelect,
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
            dummyOrder: ['heading', 'summary', 'paragraph', 'subheading', 'paragraph', 'listarray', 'paragraph', 'subheading', 'paragraph'],
            dummyArticle: [
                { heading: 'Awesome heading' }, 
                { summary: 'Awesome summary' }, 
                { paragraph: ['Awesome paragraph 1', 'Awesome paragraph 2', 'Awesome paragraph 3', 'Awesome paragraph 4'] }, 
                { subheading: ['Awesome subheading 1', 'Awesome subheading 2'] }, 
                { listarray: [['Awesome listarray item 1', 'Awesome listarray item 2']] }, 
            ],
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
        }
    },

    computed: {
        displayDummyArticle() {
            let order = this.dummyOrder;
            let dbArticle = this.dummyArticle;

            // Extract keys from objects in dbArticle array
            // To find out indices of keys in dbArticle
            let keys = dbArticle.map(element => {
                // Object.keys() returns an array: ['heading']
                return Object.keys(element);
            });

            // Flatten sub-arrays of keys array (so I don't have to use keys[i][0] later on)
            // keys looks like this [['heading'], ['summary']]...
            let keysFlat = keys.flat();

            // According to the order of elements of order array create new loopable array
            const articleMapped = order.map((element, index, array) => {
                // element of order e.g. 'heading'
                let articleRow = {
                    key: '',
                    value: ''
                }

                // Find index i of element in dbArticle with help of keysFlat array
                // = Finde passendes Element in dbArticle array zum aktuellen order element
                let i = keysFlat.findIndex((item, i, array) => {
                    return array[i] === element;
                });
                
                // Make sure i exists
                if (i !== -1) {
                    // Look up dbArticle array at place i and check if value of `${element}` is an Array
                    if (Array.isArray(dbArticle[i][`${element}`])) {
                        // If value is of type Array assign only its first element as value of the new array
                        // articleRow = { key: element, value: dbArticle[i][`${element}`][0]};
                        articleRow.key = element;
                        articleRow.value = dbArticle[i][`${element}`][0];
                        // Remove first element of dbArticle[i][`${element}`] after assigning it
                        dbArticle[i][`${element}`].shift();
                        return articleRow;
                    }
                    // If dbArticle array at place i not of type Array just assign its value as value of the new array
                    articleRow.key = element;
                    articleRow.value = dbArticle[i][`${element}`];
                }

                return articleRow;
            });

            return articleMapped;
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
            const template = e.target.value;
            this.article = this.templates[`${template}`];
            this.setDisabledPropsForTemplateArticle();
        },

        setDisabledPropsForTemplateArticle() {
            this.article.forEach(element => {
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
            console.log('%carticle', 'color: plum; font-weight: bold;', this.article);
            // data = {

            // }
            // axios.post('http://127.0.0.1:8000/bookmarks/add/', this.article)
            //     .then(res => {
            //         console.log('res', res);
            //     })
            //     .catch(err => {
            //         console.log('err', err);
            //     })
            const createSuccess = await this.$store.dispatch('postArticle', this.article);
            console.log('%ccreateSuccess', 'color: darkseagreen; font-weight: bold;', createSuccess);
            if (createSuccess === 201) this.$router.push({ name: 'ListArticles' });
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
        }
    }
}
</script>

<style lang="scss">
    .create-article {
        display: flex;
        flex-direction: column;
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

                @include tablet-landscape {
                    flex-direction: row;
                    align-items: flex-start;

                    :not(:last-child) {
                        margin-right: .5rem;
                    }


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
            margin-bottom: 1.5rem;

            &__button {
                padding-top: .5rem;
                padding-bottom: .5rem;
                padding-left: 1rem;
                padding-right: 1rem;
                margin-top: 1rem;
                margin-bottom: 1rem;
                border-radius: 0.25em;
                background-color: var(--secondary);
                color: $white;
                font-weight: 600;
                letter-spacing: .1ch;
                text-transform: uppercase;
            }
        }


    }
</style>