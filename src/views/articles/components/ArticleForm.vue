<template>
    <div class="edit">
        <div class="form-article">
            <div  class="form-article__header">
                <slot name="title"></slot>
                <div class="form-article__header__select-start">
                    <slot name="templateSelect"></slot>
                </div>
            </div>
            
            <!-- <div class="form-article__main"> -->
            <form class="form-article__main" @submit.prevent enctype="multipart/form-data">
                <!-- <button v-if="showButtons" class="form-article__main__button" type="button" @click="addRow">Add Row</button> -->
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false">
                <!-- <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" :delay="300"> -->
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
                            <template v-if="element.key === 'image'">
                                <label class="form-article__main__form__label" for="image">Image:</label>
                                <input @change="handleImage($event, element)" class="form-article__main__form__value" type="file" accept="image/*" name="image" id="image">
                            </template>
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
            </form>
            <div class="form-article__footer">
                <div v-if="errors.length" class="form-article__footer__errors">
                    <p v-for="(error, i) in errors" :key="i">{{ error.message }}</p>
                </div>
                <slot v-if="showButtons" name="submitButton" :articleToValidate="article" :imagesToValidate="images"></slot>
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
        chosenTemplate: {
            type: Array,
            required: false
        },
        articleToUpdate: {
            type: Array,
            required: false,
        }    
    },

    updated() {
        if (this.article.length === 0 && this.chosenTemplate) this.article = this.chosenTemplate;
        // console.log('%ctype article', 'color: darkseagreen; font-weight: bold;', typeof this.article, Array.isArray(this.article));
        // console.log('%ctype pandas', 'color: darkseagreen; font-weight: bold;', typeof this.pandas, Array.isArray(this.pandas));
    },

    data() {
        return {
            uniqueOptions: ['heading', 'summary'],
            previousSelected: null,
            article: this.articleToUpdate || [],
            images: [],
            pandas: [
                { name: 'panda1' },
                { name: 'panda2' },
                { name: 'panda3' },
            ]
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
                    if (element.key === 'table' && element.value && element.shape && element.table_head) {
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
            errors: 'articleValidationErrors',
        }),

        rowCount() {
            return this.article?.length;
        },

        showButtons() {
            return this.article.length > 0 ? true : false;
        },
    },

    methods: {
        handleImage(e, element) {
            console.log('%ce', 'color: hotpink; font-weight: bold;', e, e.target.name, e.target.files, element);
            const i = this.article.findIndex(section => section.id === element.id);
            console.log('%ci', 'color: hotpink; font-weight: bold;', i);
            this.article[i].value = e.target.files[0].name;
            this.images.push({ data: e.target.files[0], name: e.target.name});
            console.log('%cthis.images', 'color: hotpink; font-weight: bold;', this.images);
        },

        setPreviousSelected(e) {
            this.previousSelected = e.target.value;
        },

        async disableUniqueOption(e) {
            const currentSelected = e.target.value;

            // Prevent that any disabled prop can be changed
            // This is actually not possible because the if previousSelected is 'heading' or 'summary' it cannot be the currentSelected (this.disableUniqueOption will not be executed)
            if (this.previousSelected === currentSelected) return

            // If previousSelected is any of the uniqueOptions, this means that it will get changed
            // (since it cannot be re-selected because it's disabled)
            // So the uniqueOptions disabled value can be set to true
            if (this.uniqueOptions.includes(this.previousSelected)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', this.previousSelected);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: false });
            }

            if (this.uniqueOptions.includes(currentSelected)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', currentSelected);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: true });
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