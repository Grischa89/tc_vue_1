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
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" @change="sortImageFilesAccordingToArticle()">
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
                                <label class="form-article__main__form__label form-article__main__form__label--image" :for="element.id || element.pk" @click="saveLastModifiedOfPreviousImage(element.lastModified)">Choose image</label>
                                <input @change="handleImage($event, element.pk, element.id)" 
                                    class="form-article__main__form__value form-article__main__form__value--image"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    :id="element.id || element.pk">
                                <template v-if="element.name">
                                    <label class="form-article__main__form__label" for="imageName">Name:</label>
                                    <input v-model="element.name" class="form-article__main__form__value" type="text" name="imageName" id="imageName" disabled>
                                </template>
                                <template v-if="element.pk">
                                    <label class="form-article__main__form__label" for="imagePK">PK:</label>
                                    <input v-model="element.pk" class="form-article__main__form__value" type="text" name="imagePK" id="imagePK" disabled>
                                </template>
                                <template v-if="element.url">
                                    <label class="form-article__main__form__label" for="imageURL">URL:</label>
                                    <input v-model="element.url" class="form-article__main__form__value" type="text" name="imageURL" id="imageURL" disabled>
                                </template>
                                <label class="form-article__main__form__label" for="titleImage">Title Image? (check if true)</label>
                                <input v-model="element.is_title_image" type="checkbox" name="titleImage" id="titleImage">
                                <label class="form-article__main__form__label" for="alt">Alternative Text</label>
                                <input v-model="element.alt" class="form-article__main__form__value" type="text" name="alt" id="alt">
                            </template>

                            <!-- TABLE -->
                            <template v-else-if="element.key === 'table'">
                                <label class="form-article__main__form__label" for="tableShape">Shape: (rows *  cols = content.length)</label>
                                <input v-model="element.shape" class="form-article__main__form__value" type="text" name="tableShape" id="tableShape" />
                                <label class="form-article__main__form__label" for="tableHead">Head:</label>
                                <input v-model="element.table_head" class="form-article__main__form__value" type="text" name="tableHead" id="tableHead" />
                                <label class="form-article__main__form__label" for="valueInput">Content:</label>
                                <ValueInput v-model="element.value" />
                            </template>

                            <!-- LISTARRAY -->
                            <template v-else-if="element.key === 'listarray'">
                                <label class="form-article__main__form__label" for="valueInput">Content: (semicolon (;) separated values)</label>
                                <!-- Here using non-vue version of v-model.lazy because the .lazy modifier which should fire on change actually fired on input -->
                                <ValueInput :value="element.value" @change="element.value = $event.target.value" />
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

                            <button v-if="element.key === 'image'" class="form-article__main__form__button" type="button" @click="deleteRow(element.lastModified, true)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
        
                            <button v-else class="form-article__main__form__button" type="button" @click="deleteRow(element.value, false)">
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
            lastModifiedPreviousImage: '',
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
                    if (element.key === 'listarray' && element.value) {
                        section.value = element.value.split(';');
                        return section;
                    }

                    // Every other case (for now)
                    section.value = element.value;
                    
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
        handleImage(e, pk = undefined, id = undefined) {
            // Handle cancelled image upload (no image chosen)
            if (e.target.files.length === 0) return;

            // Existing image gets updated for the nth time after page load
            if (pk !== undefined) {
                const i = this.article.findIndex(item => item.pk === pk);
                this.resetImage(i);
                this.setNewImage(i, e.target.files[0]);
            }

            // Image gets created for the first time || image that hasn't been POSTed yet gets immediately updated
            if (id !== undefined) {
                const i = this.article.findIndex(item => item.id === id);
                this.setNewImage(i, e.target.files[0]);
            }
            
            // If image files array already has element(s), image file must be put at exact position of that image in the article order
            if (this.images.length > 0) {
                this.insertImageInFileArray(e.target.files[0]);
                return;
            }

            this.images.push(e.target.files[0]);
        },

        resetImage(i) {
            delete this.article[i].url;
            delete this.article[i].height_field;
            delete this.article[i].width_field;
        },

        setNewImage(i, file) {
            this.article[i].lastModified = file.lastModified;
            this.article[i].lastModifiedDate = file.lastModifiedDate;
            this.article[i].name = file.name;
        },

        saveLastModifiedOfPreviousImage(prev) {
            // Save image identifier of previous image on focus
            this.lastModifiedPreviousImage = prev;
        },

        getArticleImages() {
            // Get article image objects
            const articleImages = this.article.filter(item => item.key === 'image');
            return articleImages;
        },        

        insertImageInFileArray(file) {
            // Check with lastModifiedPreviousImage whether an image file for that image section already exists (meaning that image needs to be replaced)
            const indexImageFileToBeReplaced = this.images.findIndex(item => item.lastModified === this.lastModifiedPreviousImage);
            // Remove file of previous image
            if (indexImageFileToBeReplaced !== -1) this.images.splice(indexImageFileToBeReplaced, 1);

            // Get article image objects
            const articleImages = this.getArticleImages();
            // Get index of current image with specific lastModified in image only array (articleImages)
            const i = articleImages.findIndex(item => item.lastModified === file.lastModified);

            // At retrieved index i of the image file array, delete 0 elements, and insert the current image file
            this.images.splice(i, 0, file);
        },

        sortImageFilesAccordingToArticle() {
            // Image file array does not need to be sorted if empty / contains 1 file
            if (this.images.length <= 1) return;

            // If image file array has more than one item
            // Get article image order
            const articleImages = this.getArticleImages();

            // Derive prop value with that in image can be identified & that is both in image section object as well as image file array object (here lastModified)
            const imagesOrderToBe = articleImages.map(item => item.lastModified);

            // Use imagesOrderToBe simple array to sort image file array (this.images)
            this.images.sort((a, b) => {
                return imagesOrderToBe.indexOf(a.lastModified) - imagesOrderToBe.indexOf(b.lastModified);
            });
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

        deleteRow(identifier, isImage) {

            // If section to be deleted is an image (lastModified as identifier)
            if (isImage) {
                const articleIndex = this.article.findIndex(item => item.lastModified === identifier);
                this.article.splice(articleIndex, 1);

                if (this.images.length !== 0) {
                    const fileArrayIndex = this.images.findIndex(item => item.lastModified === identifier);
                    this.images.splice(fileArrayIndex, 1);
                }
                return;
            }

            // Any other section (value as identifier)
            const articleIndex = this.article.findIndex(item => item.value === identifier);
            this.article.splice(articleIndex, 1);
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

                        &--image {
                            background-color: var(--accent);
                            color: #fff;
                            font-weight: 600;
                            text-transform: capitalize;
                            padding: .5rem 1.125rem;
                            margin-top: .5rem;
                            margin-bottom: .5rem;
                            border-radius: 0.3rem;
                            cursor: pointer;
                        }
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

                        &--image {
                            display: none;
                        }
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