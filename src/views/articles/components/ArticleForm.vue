<template>
    <div class="edit">
        <div class="form-article">
            <div  class="form-article__header">
                <slot name="title"></slot>
                <div class="form-article__header__select-start">
                    <slot name="templateSelect"></slot>
                </div>
            </div>
            
            <form class="form-article__main" @submit.prevent enctype="multipart/form-data">
                <!-- <button v-if="showButtons" class="form-article__main__button" type="button" @click="addRow">Add Row</button> -->
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" @change="sortImageFilesAccordingToArticle()" :delay="200" :delayOnTouchOnly="true" :touchStartThreshold="4" :animation="150">
                    <template #item="{element}">
                        <div class="form-article__main__form">

                            <!-- SHRUNK SECTION -->
                            <article-form-section-shrunk 
                                class="form-article__main__form__section form-article__main__form__section--shrunk"
                                :data-section-shrunk="element.id"
                                :sectionId="element.id"
                                :title="element.key || 'Please remember to choose a section.'"
                                :identifier="element.name || element.value || 'No content.'"
                                :sectionType="element.key || ''"
                                :imageURL="element.url || ''">

                                <template #buttonExpand>
                                    <article-form-section-button
                                        class="form-article__main__form__section__button form-article__main__form__section__button--expand"
                                        @click="expandSection(element.id)">
                                        <template #icon>
                                            <IconExpand class="form-article__main__form__section__button__icon" />
                                        </template>
                                    </article-form-section-button>
                                </template>
                            
                            </article-form-section-shrunk>

                            <!-- EXPANDED SECTION -->
                            <div class="form-article__main__form__section form-article__main__form__section--expanded" :data-section-expanded="element.id">

                                <article-form-section-button
                                    class="form-article__main__form__section__button form-article__main__form__section__button--expand"
                                    @click="expandSection(element.id)">
                                    <template #icon>
                                        <IconShrink class="form-article__main__form__section__button__icon" />
                                    </template>
                                </article-form-section-button>
                                
                                <!-- CHOOSE A SECTION -->
                                <div class="form-article__main__form__section__row">
                                    <label class="form-article__main__form__section__row__label" :for="`key-${element.id}`">Section</label>
                                    <select class="form-article__main__form__section__row__key" name="key" :id="`key-${element.id}`" v-model="element.key" @focus="setPreviousSelected" @change="disableUniqueOption">
                                        <option value selected disabled >Choose A Column</option>
                                        <option
                                            v-for="(column, i) in articleSections"
                                            :key="i"
                                            :value="column.name"
                                            :disabled="column.disabled">{{ column.name }}</option>
                                    </select>
                                </div>

                                <!-- IMAGE SECTION -->
                                <template v-if="element.key === 'image'">
                                    <!-- FILE -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--file" :for="`imageFile-${element.id}`" @click="saveLastModifiedOfPreviousImage(element.lastModified)">Choose image</label>
                                        <input @change="handleImage($event, element.pk, element.id)"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--file"
                                            type="file"
                                            accept="image/*"
                                            name="image"
                                            :id="`imageFile-${element.id}`">
                                    </div>
                                    <!-- PREVIEW WITH PROGRESS BAR -->
                                    <ArticleFormSectionImage 
                                        class="form-article__main__form__section__row"
                                        :imageURL="element.url || ''"
                                        :sectionId="element.id" />
                                    <!-- NAME -->
                                    <template v-if="element.name">
                                        <div class="form-article__main__form__section__row">
                                            <label class="form-article__main__form__section__row__label"
                                            :for="`imageName-${element.id}`">Name</label>
                                            <ArticleFormSectionInput
                                                v-model="element.name"
                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                :idForLabel="`imageName-${element.id}`"
                                                :isReadonly="true" />
                                        </div>
                                    </template>
                                    <!-- PK -->
                                    <template v-if="element.pk">
                                        <div class="form-article__main__form__section__row">
                                            <label class="form-article__main__form__section__row__label" :for="`imagePK-${element.id}`">PK</label>
                                            <ArticleFormSectionInput
                                                v-model="element.pk"
                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                :idForLabel="`imagePK-${element.id}`"
                                                :isReadonly="true" />
                                        </div>
                                    </template>
                                    <!-- URL -->
                                    <template v-if="element.url">
                                        <div class="form-article__main__form__section__row">
                                            <label class="form-article__main__form__section__row__label" :for="`imageURL-${element.id}`">URL</label>
                                            <ArticleFormSectionInput
                                                v-model="element.url"
                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                :idForLabel="`imageURL-${element.id}`"
                                                :isReadonly="true" />
                                        </div>
                                    </template>
                                    <!-- ALT -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`imageAlt-${element.id}`">Alternative Text</label>
                                        <ArticleFormSectionTextarea
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                            v-model="element.alt"
                                            :idForLabel="`imageAlt-${element.id}`" />
                                    </div>
                                    <!-- TITLE IMAGE -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--checkbox" :for="`imageTitleImage-${element.id}`">
                                            <input
                                                v-model="element.is_title_image"
                                                type="checkbox" name="titleImage" :id="`imageTitleImage-${element.id}`">
                                        <span class="form-article__main__form__section__row__label__text">Title Image {{ element.is_title_image }}</span></label>
                                    </div>
                                </template>

                                <!-- TABLE SECTION -->
                                <template v-else-if="element.key === 'table'">
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`tableShape-${element.id}`">Shape: (rows *  cols = content.length)</label>
                                        <input v-model="element.shape" class="form-article__main__form__section__row__value" type="text" name="tableShape" :id="`tableShape-${element.id}`" />
                                    </div>
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`tableHead-${element.id}`">Head</label>
                                        <input v-model="element.table_head" class="form-article__main__form__section__row__value" type="text" name="tableHead" :id="`tableHead-${element.id}`" />
                                    </div>
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`${element.key}Content-${element.id}`">Content</label>
                                        <ArticleFormSectionTextarea
                                            v-model="element.value"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                            :idForLabel="`${element.key}Content-${element.id}`" />
                                    </div>
                                </template>

                                <!-- LISTARRAY SECTION -->
                                <template v-else-if="element.key === 'listarray'">
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`${element.key}Items-${element.id}`">Items</label>

                                        <template v-for="(item, i) in element.items" :key="`${element.key}Items-${element.id}-Item${i}`">
                                            <ArticleFormSectionTextarea
                                                v-model="item.value"
                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                                :idForLabel="`${element.key}Items-${element.id}`"
                                                :rows="listArrayTextareaRows" />
                                        </template>
                                        <article-form-section-button 
                                            class="form-article__main__form__section__row__button"
                                            @click="addListArrayItem(element.id)">
                                            <template #text-prepend>
                                                <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--prepend">
                                                    Add item
                                                </span>
                                            </template>
                                            <template #icon>
                                                <IconPlus class="form-article__main__form__section__row__button__icon" />
                                            </template>
                                        </article-form-section-button>
                                    </div>
                                </template>

                                <!-- ARTICLE_PREV / NEXT SECTION -->
                                <template v-else-if="element.key.includes('article_')">
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`${element.key}Select-${element.id}`">Content</label>
                                        <ArticleFormSectionSelect v-model="element.value" :idForLabel="`${element.key}Select-${element.id}`" />
                                    </div>
                                </template>

                                <!-- DEFAULT SECTION (e.g. HEADING)-->
                                <template v-else>
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`${element.key}Content-${element.id}`">Content</label>
                                        <ArticleFormSectionTextarea
                                            v-model="element.value"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                            :idForLabel="`${element.key}Content-${element.id}`" />
                                    </div>
                                </template>

                                <!-- DELETE BUTTON -->
                                <div class="form-article__main__form__section__row">
                                    <article-form-section-button
                                        v-if="element.key === 'image'"
                                        class="form-article__main__form__section__row__button"
                                        @click="deleteRow(element.lastModified, true)">
                                        <template #icon>
                                            <IconDelete class="form-article__main__form__section__row__button__icon form-article__main__form__section__row__button__icon--delete" />
                                        </template>
                                    </article-form-section-button>
                                    <article-form-section-button
                                        v-else
                                        class="form-article__main__form__section__row__button"
                                        @click="deleteRow(element.id, false)">
                                        <template #icon>
                                            <IconDelete class="form-article__main__form__section__row__button__icon form-article__main__form__section__row__button__icon--delete" />
                                        </template>
                                    </article-form-section-button>
                                </div>
                            </div>

                        </div>
                    </template>
                </draggable>
                <button v-if="showButtons" class="form-article__main__button" type="button" @click="addRow">Add Row</button>
            </form>
            <div class="form-article__footer">
                <div v-if="errors.length" class="form-article__footer__errors">
                    <p v-for="(error, i) in errors" :key="i">{{ error.message }}</p>
                </div>
                <slot 
                    v-if="showButtons" 
                    name="submitButton" 
                    :articleToValidate="article">
                </slot>
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

import draggable from 'vuedraggable';
import ArticleFormSectionShrunk from './ArticleFormSectionShrunk.vue';
import ArticleFormSectionButton from './ArticleFormSectionButton.vue';
import ArticleFormSectionInput from './ArticleFormSectionInput.vue';
import ArticleFormSectionTextarea from './ArticleFormSectionTextarea.vue';
import ArticleFormSectionSelect from './ArticleFormSectionSelect.vue';
import ArticleTemplate from './ArticleTemplate.vue';
import ArticleDisplay from './ArticleDisplay.vue';
import IconExpand from '../../../components/icons/IconExpand.vue';
import IconDelete from '../../../components/icons/IconDelete.vue';
import IconShrink from '../../../components/icons/IconShrink.vue';
import ArticleFormSectionImage from './ArticleFormSectionImage.vue';
import IconPlus from '../../../components/icons/IconPlus.vue';

export default {
    name: 'ArticleForm',

    components: {
    draggable,
    ArticleFormSectionShrunk,
    ArticleFormSectionButton,
    ArticleFormSectionInput,
    ArticleFormSectionTextarea,
    ArticleFormSectionSelect,
    ArticleTemplate,
    ArticleDisplay,
    IconExpand,
    IconDelete,
    IconShrink,
    ArticleFormSectionImage,
    IconPlus
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
            listArrayTextareaRows: 1,
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
                    if (element.key === 'listarray' && element.items?.length) {
                        section.items = element.items.map(({ value }) => value);
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
        async handleImage(e, pk = undefined, id = undefined) {
            const [file] = e.target.files;

            // Handle cancelled image upload (no image chosen)
            if (!file) return;
            // Validate image (file.type)
            const imageValid = await this.$store.dispatch('validateImage', file);
            if (!imageValid) return;

            // Select DOM elements relevant to display image upload progress
            const imagePreview = document.querySelector(`#imagePreview-${id}`);
            imagePreview.src = URL.createObjectURL(file);
            
            const imagePreviewShrunk = document.querySelector(`#imagePreviewShrunk-${id}`);
            imagePreviewShrunk.src = URL.createObjectURL(file);

            const imageProgressBar = document.querySelector(`#imageProgressBar-${id}`);

            try {
                const { data } = await this.$store.dispatch('postImage', { file: file, imageProgressBar: imageProgressBar, imagePreview: imagePreview });

                const i = this.article.findIndex(item => item.id === id);
                this.setNewImage(i, data);
            } catch (e) {
                // e.response.status TODO
                console.log('%cPREUPLOAD ERROR', 'color: res; font-weight: bold;', e);
            }
        },

        setNewImage(i, imageUploaded) {
            this.article[i].lastModified = imageUploaded.lastModified;
            this.article[i].lastModifiedDate = imageUploaded.lastModifiedDate;
            this.article[i].name = imageUploaded.name;
            this.article[i].pk = imageUploaded.pk;
            this.article[i].url = imageUploaded.url;
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

        addListArrayItem(id) {
            // Find index of listarray section with id
            const idListArray = this.article.findIndex(item => item.id === id);
            console.log('%cidListArray', 'color: cornflowerblue; font-weight: bold;', idListArray);
            // Check whether items array already exists else create it
            if (this.article[idListArray].items === undefined) this.article[idListArray].items = [];
            // Push new empty item to listarray section with that id
            this.article[idListArray].items.push({
                value: ''
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

            // Any other section (id as identifier)
            const articleIndex = this.article.findIndex(item => item.id === identifier);
            this.article.splice(articleIndex, 1);
        },

        expandSection(id) {
            const sectionExpanded = document.querySelector(`[data-section-expanded="${id}"]`);
            const sectionShrunk = document.querySelector(`[data-section-shrunk="${id}"]`);

            sectionExpanded.style.display = window.getComputedStyle(sectionExpanded).display === 'none' ? 'flex' : 'none';
            sectionShrunk.style.display = window.getComputedStyle(sectionShrunk).display === 'none' ? 'flex' : 'none';
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
            width: min(100%, 40rem);
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
                    border-radius: .25rem;
                    background-color: var(--text);
                    color: var(--textInverse);
                    text-transform: capitalize;
                }

                &__form {
                    position: relative;

                    background-color: var(--surface2);
                    padding: .5rem;
                    margin-bottom: .5rem;
                    border: .0625rem solid var(--border);
                    border-radius: .25rem;

                    &__section {
                        position: relative;
                        display: flex;
                        flex-direction: column;

                        &--expanded {
                            justify-content: center;
                            align-items: center;
                        }

                        &--shrunk {
                            display: none;
                            flex-direction: row;
                            gap: 1rem;
                            // align-items: flex-start;
                        }

                        &__row {
                            display: flex;
                            flex-direction: column;
                            width: 100%;

                            &__button {
                                display: flex;
                                align-items: center;
                                // height: 2rem;
                                // width: 2rem;
                                margin-top: 1rem;
                                margin-bottom: .75rem;
                                border-radius: 0.25em;

                                &--expand {
                                    position: absolute;
                                    top: -.25rem;
                                    right: .25rem;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                }

                                &__icon {
                                    height: 1rem;
                                    width: 1rem;

                                    &--delete {
                                        color: var(--error);
                                    }
                                }

                                &__text {
                                    font-size: .875rem; // 14px

                                    &--prepend {
                                        margin-right: .25rem;
                                    }
                                }
                            }

                            &__image {
                                align-self: flex-start;
                                position: relative;
                                margin-top: .5rem;
                                margin-bottom: 1rem;
                                border-radius: .25rem;
                                overflow: hidden; // to hide blurry edges of loading img (filter: blur(5px) overflows its own container) + for border-radius to be visible (otherwise img will hide it)

                                &__img {
                                    max-height: 150px;
                                    object-fit: contain;
                                    filter: blur(0);
                                }

                                &__overlay {
                                    position: absolute;
                                    top: 0;
                                    bottom: 0;
                                    left: 0;
                                    right: 0;
                                    height: 100%;
                                    width: 100%;
                                    background-color: rgba($black, .5);
                                }

                                &__progress {
                                    position: absolute;
                                    display: grid; // to center pseude ::before
                                    place-items: center;
                                    --progress-wh: 1.25rem; 
                                    width: var(--progress-wh);
                                    height: var(--progress-wh);
                                    // top: calc(50% - calc(var(--progress-wh) / 2)); // to center
                                    // left: calc(50% - calc(var(--progress-wh) / 2)); // to center
                                    right: calc(var(--progress-wh) / 3);
                                    bottom: calc(var(--progress-wh) / 3);
                                    border-radius: 50%;

                                    &::before {
                                        content: '';
                                        position: absolute;
                                        height: 0%; // the higher the slimmer the loading circle
                                        width: 0%; // the higher the slimmer the loading circle
                                        background-color: hsla(0, 0%, 100%, .8);
                                        border-radius: 50%;
                                    }

                                    &__text {
                                        position: relative;
                                        font-size: 1.125rem;
                                        font-weight: bold;
                                        color: black;
                                    }
                                }
                            }

                            &__key {
                                // select element to select section key (heading, summary etc.)
                                font-size: .9375rem; // 15px
                                align-self: flex-start;
                                text-indent: .125rem;
                                height: 2rem;
                                margin-top: .5rem;
                                margin-bottom: 1rem;
                                border: .0625rem solid var(--border-input);
                                border-radius: 0.25em;
                                width: 20ch;
                            }

                            &__label {
                                align-self: flex-start;
                                display: flex; // for checkbox label
                                font-size: .875rem; // 14px
                                font-weight: 500;
                                letter-spacing: .025rem;

                                // &--checkbox {
                                // }

                                &--file {
                                    background-color: var(--accent);
                                    color: #fff;
                                    font-weight: 600;
                                    text-transform: capitalize;
                                    padding: .5rem 1.125rem;
                                    margin-top: .5rem;
                                    margin-bottom: 1rem;
                                    border-radius: 0.3rem;
                                    cursor: pointer;
                                }

                                &--readonly {
                                    color: var(--help);
                                }

                                &__text {
                                    margin-left: .5rem;
                                }
                            }

                            &__value {
                                align-self: flex-start;
                                font-size: .9375rem; // 15px
                                padding-top: .25rem;
                                padding-bottom: .25rem;
                                padding-left: .5rem;
                                padding-right: .5rem;
                                width: 100%;
                                margin-top: .5rem;
                                margin-bottom: 1rem;
                                border: .0625rem solid var(--border-input);
                                border-radius: 0.25em;
                                min-height: 1.875rem; // 2 * font-size // 30px

                                &--textarea {
                                    background: linear-gradient(135deg,var(--textarea-bg) 0,var(--textarea-bg) 97.5%,var(--accent-light) 98%);
                                }

                                &--checkbox {
                                    padding-top: .25rem;
                                    padding-bottom: .25rem;
                                    padding-left: 0;
                                    padding-right: 0;
                                    height: auto;
                                    width: auto;
                                    margin-top: .5rem;
                                    margin-bottom: .5rem;
                                    border: .0625rem solid var(--border-input);
                                    border-radius: 0;
                                    min-height: 0; // 2 * font-size // 30px
                                }

                                &--file {
                                    display: none;
                                    height: 2rem;
                                }

                                &--input {
                                    height: 2rem;
                                    min-width: 40px;
                                    max-width: 100%;
                                    text-overflow: ellipsis;
                                }

                                &--readonly {
                                    height: 2rem;
                                    color: var(--help);
                                }

                            }
                        }

                        &__button {
                            height: 2rem;
                            margin-top: 1rem;
                            margin-bottom: .75rem;
                            border-radius: 0.25em;

                            &--expand {
                                position: absolute;
                                top: -.25rem;
                                right: .25rem;
                                margin-top: 0;
                                margin-bottom: 0;
                            }

                            &__icon {
                                height: 1rem;
                                width: 1rem;
                            }
                        }

                        &__title {
                            font-size: .9375rem; // 15px
                            font-weight: 500;
                            text-transform: capitalize;

                            &--invalid {
                                color: var(--error);
                            }
                        }

                        &__identifier {
                            font-size: .9375rem; // 15px
                            max-width: 60%;
                            text-align: left;
                            white-space: nowrap; // necessary for text-overflow prop
                            overflow: hidden; // necessary for text-overflow prop
                            text-overflow: ellipsis;
                        }

                        &__image {
                            border-radius: .25rem;
                            overflow: hidden; // for border-radius to be visible (otherwise img will hide it)
                            margin-top: .5rem;
                            margin-bottom: .25rem;

                            &__img {
                                max-height: 75px;
                                object-fit: contain;
                            }
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
            width: min(100%, 40rem);
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
            justify-content: center;
            align-items: flex-start;

            .form-article, .preview-article {
                margin-left: 1rem;
                margin-right: 1rem;
            }
        }
    }
</style>