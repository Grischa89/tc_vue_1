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

                            <!-- Choose a section -->
                            <label class="form-article__main__form__label" for="key">Section:</label>
                            <select class="form-article__main__form__key" name="key" id="key" v-model="element.key" @focus="setPreviousSelected" @change="disableUniqueOption">
                                <option value selected disabled >Choose A Column</option>
                                <option
                                    v-for="(column, i) in articleSections"
                                    :key="i"
                                    :value="column.name"
                                    :disabled="column.disabled">{{ column.name }}</option>
                            </select>

                            <!-- IMAGE -->
                            <template v-if="element.key === 'image'">
                                <label class="form-article__main__form__label" for="image">Image:</label>
                                <input @change="handleImage($event, element.pk, element.lastModified, element.id)" @input="logEvent" class="form-article__main__form__value" type="file" accept="image/*" name="image" id="image">
                                <template v-if="element.pk">
                                    <label class="form-article__main__form__label" for="imagePK">PK:</label>
                                    <input v-model="element.pk" class="form-article__main__form__value" type="text" name="imagePK" id="imagePK" disabled>
                                </template>
                                <template v-if="element.url">
                                    <label class="form-article__main__form__label" for="imageURL">URL:</label>
                                    <input v-model="element.url" class="form-article__main__form__value" type="text" name="imageURL" id="imageURL" disabled>
                                </template>
                                <label class="form-article__main__form__label" for="titleImage">Title Image? (Boolean)</label>
                                <input v-model="element.is_title_image" class="form-article__main__form__value" type="text" name="titleImage" id="titleImage">
                                <label class="form-article__main__form__label" for="alt">Alternative Text</label>
                                <input v-model="element.alt" class="form-article__main__form__value" type="text" name="alt" id="alt">
                            </template>

                            <!-- TABLE -->
                            <template v-else-if="element.key === 'table'">
                                <label class="form-article__main__form__label" for="tableShape">Shape: (n*n=content.length)</label>
                                <input v-model="element.shape" class="form-article__main__form__value" type="text" name="tableShape" id="tableShape" />
                                <label class="form-article__main__form__label" for="tableHead">Head:</label>
                                <input v-model="element.table_head" class="form-article__main__form__value" type="text" name="tableHead" id="tableHead" />
                            </template>

                            <!-- LISTARRAY -->
                            <template v-else-if="element.key === 'listarray'">
                                <label class="form-article__main__form__label" for="valueInput">Content: (semicolon (;) separated values)</label>
                                <ValueInput v-model="element.value" />
                            </template>

                            <!-- ARTICLE_PREV / NEXT -->
                            <template v-else-if="element.key.includes('article_')">
                                <label class="form-article__main__form__label" for="valueSelect">Content:</label>
                                <ValueSelect v-model="element.value" />
                            </template>

                            <!-- DEFAULT -->
                            <template v-else>
                                <label class="form-article__main__form__label" for="valueInput">Content:</label>
                                <ValueInput v-model="element.value" />
                            </template>
        
                            <button class="form-article__main__form__button" type="button" @click="deleteRow(element.value)">
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
    },

    data() {
        return {
            uniqueOptions: ['heading', 'summary'],
            previousSelected: null,
            article: this.articleToUpdate || [],
            images: [],
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
        resetImage(i) {
            console.log('%cresetImage executed', 'color: cornflowerblue; font-weight: bold;');
            delete this.article[i].pk;
            delete this.article[i].url;
            delete this.article[i].height_field;
            delete this.article[i].width_field;
        },

        setNewImage(i, file) {
            this.article[i].lastModified = file.lastModified;
            this.article[i].lastModifiedDate = file.lastModifiedDate;
            this.article[i].name = file.name;
            this.article[i].size = file.size;
            this.article[i].type = file.type;
            this.article[i].webkitRelativePath = file.webkitRelativePath;

            console.log('%csetNewImage executed', 'color: orange; font-weight: bold;', this.article[i]);
        },

        handleImage(e, pk = undefined, lastModified = undefined, id = undefined) {
            console.log('%cfile', 'color: hotpink; font-weight: bold;', e.target.files[0]);
            console.log('%cpk', 'color: hotpink; font-weight: bold;', pk);
            console.log('%clastModified', 'color: hotpink; font-weight: bold;', lastModified);
            console.log('%cid', 'color: hotpink; font-weight: bold;', id);
            console.log('%carticle', 'color: hotpink; font-weight: bold;', this.article);

            // Existing image gets updated for the 1st time after page load
            if (pk !== undefined) {
                const i = this.article.findIndex(item => item.pk === pk);
                this.resetImage(i);
                this.setNewImage(i, e.target.files[0]);
            }

            // Existing image gets updated for the n-th time after page load
            if (lastModified !== undefined) {
                const i = this.article.findIndex(item => item.lastModified === lastModified);
                this.setNewImage(i, e.target.files[0]);
            }

            // Image gets created for the first time || image that hasn't been POSTed yet gets immediately updated
            if (id !== undefined) {
                const i = this.article.findIndex(item => item.id === id);
                this.setNewImage(i, e.target.files[0]);
            }

            this.images.push(e.target.files[0]);
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
            // const newRow = { key: '', value: '', id: Math.floor(Date.now() * Math.random()) };
            const newRow = { key: '', id: Math.floor(Date.now() * Math.random()) };
            this.article.push(newRow);
        },

        deleteRow(value) {
            // NOTE: Formerly id
            const index = this.article.findIndex(object => object.value === value);
            const deletedRow = this.article.splice(index, 1);
            this.deleteImage(deletedRow);
        },

        deleteImage(deletedRow) {
            const [row] = deletedRow;

            if (row.key !== 'image') return;

            const index = this.images.findIndex(image => image.name === row.value);
            this.images.splice(index, 1);
            console.log('%cimages', 'color: darkseagreen; font-weight: bold;', this.images);
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