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
                <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false" :delay="200" :delayOnTouchOnly="true" :touchStartThreshold="4" :animation="150">
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
                                    <select class="form-article__main__form__section__row__key"
                                    name="key" :id="`key-${element.id}`" v-model="element.key" @focus="setPreviousSelected" @change="handleSectionSelect($event.target.value, element.id)">
                                        <option value selected disabled >Choose A Section</option>
                                        <option
                                            v-for="(column, i) in articleSections"
                                            :key="i"
                                            :value="column.name"
                                            :disabled="column.disabled">{{ column.name }}</option>
                                    </select>
                                </div>

                                <!-- NO SECTION CHOSEN YET -->
                                <template v-if="element.key === ''">
                                    <div class="form-article__main__form__section__row">
                                        <p class="form-article__main__form__section__row__info">Please remember to choose a section.</p>
                                    </div>
                                </template>

                                <!-- IMAGE SECTION -->
                                <template v-else-if="element.key === 'image'">
                                    <!-- FILE -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--file" :for="`imageFile-${element.id}`"><span class="form-article__main__form__section__row__label__text">Choose image</span></label>
                                        <input @change="handleImage($event, element.id)"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--file"
                                            type="file"
                                            accept="image/*"
                                            name="image"
                                            :id="`imageFile-${element.id}`">
                                    </div>
                                    <ArticleFormSectionError
                                            v-if="element.errors?.missingImage"
                                            :error="element.errors.missingImage" />
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
                                            v-model.trim="element.alt"
                                            :idForLabel="`imageAlt-${element.id}`"
                                            :rows="imageAltTextareaRows" />
                                    </div>
                                    <!-- TITLE IMAGE -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--checkbox" :for="`imageTitleImage-${element.id}`">
                                            <span class="form-article__main__form__section__row__label__checkbox">Title Image</span>
                                            <input
                                                v-model="element.is_title_image"
                                                type="checkbox" name="titleImage" :id="`imageTitleImage-${element.id}`">
                                        </label>
                                    </div>
                                </template>

                                <!-- TABLE SECTION -->
                                <template v-else-if="element.key === 'table'">

                                    <!-- COLUMNS -->
                                    <div class="form-article__main__form__section__row">
                                        <fieldset class="form-article__main__form__section__row__fieldset">
                                            <legend class="form-article__main__form__section__row__fieldset__legend">Columns</legend>
                                            <div class="form-article__main__form__section__row__fieldset__grid">
                                                <div v-for="(column, i) in element.columns"
                                                    :key="`${element.key}Cols-${element.id}`"
                                                    class="form-article__main__form__section__row__fieldset__grid__item form-article__main__form__section__row__fieldset__grid__item--columns">
                                                    <label class="form-article__main__form__section__row__fieldset__grid__item__label" :for="`${element.key}Col${i}-${element.id}`" >Column {{ i + 1 }}</label>
                                                    <input
                                                        v-model.trim="column.name"
                                                        @focus="saveColumnName(column.name)"
                                                        @blur="handleColumnInput($event, element.id, i)"
                                                        class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                        :id="`${element.key}Col${i}-${element.id}`"
                                                        :placeholder="`Column ${i + 1}`" />
                                                    <article-form-section-button
                                                        class="form-article__main__form__section__row__button"
                                                        @click="deleteTableColumn(element.id, i)">
                                                        <template #icon>
                                                            <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                        </template>
                                                    </article-form-section-button>
                                                    <ArticleFormSectionError
                                                        v-if="column.errors?.missingColumnName"
                                                        :error="column.errors.missingColumnName" />
                                                    <ArticleFormSectionError
                                                        v-if="column.errors?.maxLengthExceeded"
                                                        :error="column.errors.maxLengthExceeded" />
                                                    <div v-if="i < element.columns.length - 2" class="form-article__main__form__section__row__fieldset__grid__item__divider form-article__main__form__section__row__fieldset__grid__item__divider--columns"></div>
                                                </div>
                                                <article-form-section-button
                                                    @click="addTableColumn(element.id)"
                                                    :id="`${element.key}ColumnBtn-${element.id}`"
                                                    class="form-article__main__form__section__row__button form-article__main__form__section__row__button--add form-article__main__form__section__row__fieldset__grid__button"
                                                    >
                                                    <template #icon>
                                                        <IconPlus class="form-article__main__form__section__row__button__icon" />
                                                    </template>
                                                    <template #text-append>
                                                        <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--append">
                                                            Column
                                                        </span>
                                                    </template>
                                                </article-form-section-button>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <!-- ROWS -->
                                    <div class="form-article__main__form__section__row">
                                        <fieldset class="form-article__main__form__section__row__fieldset">
                                            <legend         class="form-article__main__form__section__row__fieldset__legend">Rows</legend>

                                            <div 
                                                class="form-article__main__form__section__row__fieldset__grid">
                                                <div v-for="(row, i) in element.rows" :key="`${element.key}Rows-${element.id}`" class="form-article__main__form__section__row__fieldset__grid__item form-article__main__form__section__row__fieldset__grid__item--rows">
                                                    <label class="form-article__main__form__section__row__fieldset__grid__item__label">Row {{ i + 1 }}</label>
                                                    <div class="form-article__main__form__section__row__fieldset__grid__item__nested">
                                                        <template v-for="(cell, j) in element.columns">
                                                            <label class="form-article__main__form__section__row__label--visually-hidden" :for="`${element.key}Row${i}-Col${j}-${element.id}`"></label>
                                                            <input
                                                                v-model.trim="row[`${element.columns[j].name}`]"
                                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input form-article__main__form__section__row__fieldset__grid__item__nested__item"
                                                                :id="`${element.key}Row${i}-Col${j}-${element.id}`"
                                                                :placeholder="element.columns[j].name" />
                                                        </template>
                                                    </div>
                                                    <article-form-section-button
                                                        class="form-article__main__form__section__row__button"
                                                        @click="deleteTableRow(element.id, i)">
                                                        <template #icon>
                                                            <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                        </template>
                                                    </article-form-section-button>
                                                    <template v-if="!element.columns">
                                                            <ArticleFormSectionError
                                                                :error="rowsError" />
                                                        </template>
                                                    <div v-if="i < element.rows.length - 1" class="form-article__main__form__section__row__fieldset__grid__item__divider"></div>
                                                </div>
                                                <article-form-section-button 
                                                    class="form-article__main__form__section__row__button form-article__main__form__section__row__button--add form-article__main__form__section__row__fieldset__grid__button"
                                                    @click="addTableRow(element.id)">
                                                    <template #icon>
                                                        <IconPlus class="form-article__main__form__section__row__button__icon" />
                                                    </template>
                                                    <template #text-append>
                                                        <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--append">
                                                            Row
                                                        </span>
                                                    </template>
                                                </article-form-section-button>
                                            </div>
                                        </fieldset>
                                    </div>
                                </template>

                                <!-- LISTARRAY SECTION -->
                                <template v-else-if="element.key === 'listarray'">
                                    <div class="form-article__main__form__section__row">
                                        <fieldset class="form-article__main__form__section__row__fieldset">
                                            <legend class="form-article__main__form__section__row__fieldset__legend">Items</legend>
                                            <div class="form-article__main__form__section__row__fieldset__container">
                                                <div v-for="(item, i) in element.items" :key="`${element.key}Items-${element.id}`">
                                                    <div class="form-article__main__form__section__row__fieldset__container__row">
                                                        <label :for="`${element.key}Items-${element.id}-Item${i}`" class="form-article__main__form__section__row__fieldset__container__row__item form-article__main__form__section__row__fieldset__grid__item__label">{{ i + 1 }}</label>
                                                        <ArticleFormSectionTextarea
                                                            v-model.trim="item.value"
                                                            class="form-article__main__form__section__row__fieldset__container__row__item form-article__main__form__section__row__value--textarea"
                                                            :idForLabel="`${element.key}Items-${element.id}-Item${i}`"
                                                            :rows="listArrayTextareaRows" />
                                                        <article-form-section-button
                                                        class="form-article__main__form__section__row__button--inline"
                                                            @click="deleteListArrayItem(element.id, i)">
                                                            <template #icon>
                                                                <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                            </template>
                                                        </article-form-section-button>
                                                    </div>
                                                    <ArticleFormSectionError
                                                        v-if="item.errors?.missingItemContent"
                                                        :error="item.errors.missingItemContent" />
                                                </div>
                                                <article-form-section-button
                                                    class="form-article__main__form__section__row__button form-article__main__form__section__row__button--add form-article__main__form__section__row__fieldset__grid__button"
                                                    @click="addListArrayItem(element.id)">
                                                    <template #icon>
                                                        <IconPlus class="form-article__main__form__section__row__button__icon" />
                                                    </template>
                                                    <template #text-append>
                                                        <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--append">
                                                            Item
                                                        </span>
                                                    </template>
                                                </article-form-section-button>
                                            </div>
                                        </fieldset>
                                        <ArticleFormSectionError
                                            v-if="element.errors?.missingItems"
                                            :error="element.errors.missingItems" />
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
                                            v-model.trim="element.value"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                            :idForLabel="`${element.key}Content-${element.id}`" />
                                        <ArticleFormSectionError
                                            v-if="element.errors.value"
                                            :error="element.errors.value" />
                                    </div>
                                </template>

                                <!-- DELETE BUTTON -->
                                <div class="form-article__main__form__section__row">
                                    <article-form-section-button
                                        v-if="element.key === 'heading' || element.key === 'summary'"
                                        class="form-article__main__form__section__row__button form-article__main__form__section__row__button--not-allowed">
                                        <template #text-append>
                                            <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--delete">Delete {{ element.key }}</span>
                                        </template>
                                    </article-form-section-button>
                                    <article-form-section-button
                                        v-else
                                        class="form-article__main__form__section__row__button form-article__main__form__section__row__button--delete"
                                        @click="deleteRow(element.id)">
                                        <template #text-append>
                                            <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--delete">Delete {{ element.key }}</span>
                                        </template>
                                    </article-form-section-button>
                                </div>
                            </div>

                        </div>
                    </template>
                </draggable>
                <article-form-section-button v-if="showButtons" 
                    class="form-article__main__button"
                    @click="addRow">
                    <template #icon>
                        <IconPlus class="form-article__main__form__section__row__button__icon" />
                    </template>
                    <template #text-append>
                        <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--append">Section</span>
                    </template>
                </article-form-section-button>
            </form>
            <div class="form-article__footer">
                <div v-if="errors.length" class="form-article__footer__errors">
                    <ArticleFormSectionError
                        v-for="(error, i) in errors" :key="i"
                        :error="error.message" />
                </div>
                <slot 
                    v-if="showButtons" 
                    name="submitButton" 
                    :articleToValidate="article">
                </slot>
            </div>
        </div>
        
        <div class="preview-article" v-if="displayArticle.length">
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
import ArticleFormSectionError from './ArticleFormSectionError.vue';
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
    ArticleFormSectionError,
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
            previousColumnName: '',
            columnLimit: 4,
            rowsError: 'Please enter a column first in order to set content for rows.',
            listArrayTextareaRows: 1,
            imageAltTextareaRows: 2,
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

                    // Handle table section
                    if (element.key === 'table' && element.columns) {
                        // Save columns object prop 'name' as string in new array
                        section.table_head = element.columns.map(({ name }) => name);

                        if (element.rows?.length) {
                            section.rows = [];
                            // Loop through rows array
                            for (const item of element.rows) {

                                const row = [];

                                // Loop trhough objects of rows array + push value of each prop to own array 'row'
                                for (const cell in item) {
                                    row.push(item[cell]);
                                }

                                // Push row array containing table cell content to rows array (creating an array of arrays)
                                section.rows.push(row);
                            }
                        }
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
        findArticleSectionIndex(sectionId) {
            return this.article.findIndex(section => section.id === sectionId);
        },

        async handleImage(e, id) {
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

                const i = this.findArticleSectionIndex(id);
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

        addListArrayItem(sectionId) {
            // Find index of listarray section with id
            const indexListArray = this.findArticleSectionIndex(sectionId);
            // Check whether items array already exists else create it
            if (this.article[indexListArray].items === undefined) this.article[indexListArray].items = [];
            // Push new empty item to listarray section with that id
            this.article[indexListArray].items.push({
                value: ''
            });
            // Find out index of added item
            const itemId = this.article[indexListArray].items.length - 1;
            // Select added listarray item input
            this.selectListarrayInput(sectionId, itemId);
        },

        selectListarrayInput(sectionId, itemId) {
            const selectTimeout = setTimeout(() => {
                const listarrayItemInput = document.querySelector(`#listarrayItems-${sectionId}-Item${itemId}`);
                listarrayItemInput.focus();
                clearTimeout(selectTimeout);
            }, 150);
        },

        deleteListArrayItem(sectionId, itemId) {
            // Find index of listarray section with sectionId
            const indexListArray = this.findArticleSectionIndex(sectionId);
            // Delete item in listarray
            this.article[indexListArray].items.splice(itemId, 1);
        },

        addTableColumn(sectionId) {
            // Find index of table section with id
            const indexTable = this.findArticleSectionIndex(sectionId);
            // Check whether columns array already exists else create it
            if (this.article[indexTable].columns === undefined) this.article[indexTable].columns = [];
            // Disable button for adding columns if limit would be exceeded
            if (this.article[indexTable].columns.length === this.columnLimit) {
                this.disableTableColumnButton(true, sectionId);
                return;
            }
            // Find out columns array length to set preliminary name for added column
            const colNumber = this.article[indexTable].columns.length;
            // Push new empty object with name prop to table section with that id
            this.article[indexTable].columns.push({
                name: this.createProvisionalColumnName()
            });
            // Select added col name input for user
            this.selectTableColumnInput(sectionId, colNumber);
        },

        deleteTableColumn(sectionId, columnId) {
            // Find index of table section with sectionId
            const indexTable = this.findArticleSectionIndex(sectionId);
            // Save columnName to pass as argument to deleteTableCells fn
            const columnName = this.article[indexTable].columns[columnId].name;
            // Delete column object in table columns
            this.article[indexTable].columns.splice(columnId, 1);
            // Delete respective cells from row that belong to column
            this.deleteTableCells(indexTable, columnName);
            // Enable button for adding columns
            this.disableTableColumnButton(false, sectionId);
        },

        disableTableColumnButton(state, sectionId) {
            const tableColumnButton = document.querySelector(`#tableColumnBtn-${sectionId}`);
            tableColumnButton.disabled = state;
        },

        createProvisionalColumnName() {
            const randomString = Math.random().toString(36).substring(2, 6);
            return `Column-${randomString}`;
        },

        saveColumnName(columnName) {
            if (columnName === '') return;
            this.previousColumnName = columnName;
        },

        selectTableColumnInput(sectionId, columnId) {
            const selectTimeout = setTimeout(() => {
                const tableColumnInput = document.querySelector(`#tableCol${columnId}-${sectionId}`);
                tableColumnInput.focus();
                tableColumnInput.select();
                clearTimeout(selectTimeout);
            }, 150);
        },

        handleColumnInput(e, sectionId, currentColumnIndex) {
            // Set currently entered name
            // NOTE: Since props are retrieved via string notation (obj['key']) for now, also characters that would be invalid inside identifiers can be used, like '€'
            const currentColumnName = e.target.value;
            // If no changes were made, return
            if (this.previousColumnName === currentColumnName) return;

            // Now it can be assumed that the user entered a column name that was not the previous
            // Get table object id
            const indexTable = this.findArticleSectionIndex(sectionId);
            // Create array with only column name strings
            const columnNames = this.article[indexTable].columns.map(({ name }) => name);
            // Check columnNames for duplicate values
            const duplicateColumnNames = this.containsDuplicateColumnNames(columnNames);

            // If the user entered duplicate column name (one that is already occupied by another column) OR an empty string, then change it back to its provisional name, 'Column-xyz'
            if (duplicateColumnNames || currentColumnName === '') {
                const provisonalColumnName = this.createProvisionalColumnName();
                this.article[indexTable].columns[currentColumnIndex].name = provisonalColumnName;

                // In case of an empty column name
                if (currentColumnName === '') {
                    // Show error message to user
                    this.article[indexTable].columns[currentColumnIndex].errors = {};
                    this.article[indexTable].columns[currentColumnIndex].errors.missingColumnName = `A column name is required. A provisional name has been set for now. Please change it to your liking or delete the column.`;

                    // Clear error message after some time
                    const errorTimeout = setTimeout(() => {
                        this.article[indexTable].columns[currentColumnIndex].errors.missingColumnName = '';
                        clearTimeout(errorTimeout);
                    }, 5000);
                }

                // Select added col name input for user
                this.selectTableColumnInput(sectionId, currentColumnIndex);
                // Update row objects with provisional name
                this.updateRowProps(provisonalColumnName, this.previousColumnName, indexTable);
                return;
            }

            // If the user entered a new, unique, non-empty column name, update rows
            this.updateRowProps(currentColumnName, this.previousColumnName, indexTable);
        },

        containsDuplicateColumnNames(columnNamesArray) {
            return columnNamesArray.some(columnName => {
                // If a columnName is unique the index of its first + last occurence is the same, if not it's a duplicate
                if (columnNamesArray.indexOf(columnName) !== columnNamesArray.lastIndexOf(columnName)) {
                    return true;
                }

                return false;
            });
        },

        updateRowProps(currentColumnName, previousColumnName, tableIndex) {
            // If rows array doesn't exist in table or is empty, return (previousColumnName prop does not exist either)
            if (this.article[tableIndex].rows === undefined || this.article[tableIndex].rows.length === 0) return;

            // If previousColumnName exists in first row of rows array in table, loop through each object and set the contents of previousColumnName to currentColumnName + delete previousColumnName
            if (this.article[tableIndex].rows[0][previousColumnName]) {
                this.article[tableIndex].rows.forEach(row => {
                    row[currentColumnName] = row[previousColumnName];
                    delete row[previousColumnName];
                });
            }
        },

        addTableRow(sectionId) {
            // Find index of table section with id
            const indexTable = this.findArticleSectionIndex(sectionId);
            // Check whether rows array already exists else create it
            if (this.article[indexTable].rows === undefined) this.article[indexTable].rows = [];
            // Push new empty object table section with that id (TODO row_id, is necessary?)
            this.article[indexTable].rows.push({ });
        },

        deleteTableRow(sectionId, rowId) {
            // Find index of table section with sectionId
            const indexTable =  this.findArticleSectionIndex(sectionId);
            // Delete row object in table rows
            this.article[indexTable].rows.splice(rowId, 1);
        },

        deleteTableCells(indexTable, columnName) {
            // If rows array doesn't exist in table or is empty, return
            if (this.article[indexTable].rows === undefined || this.article[indexTable].rows.length === 0) return;
            // Delete prop that is named after column in every object (row) of rows array
            this.article[indexTable].rows.forEach(row => {
                delete row[columnName];
            });
        },

        setPreviousSelected(e) {
            this.previousSelected = e.target.value;
        },

        handleSectionSelect(sectionSelected, sectionId) {
            // Prevent that any disabled prop can be changed
            // This is actually not possible because the if previousSelected is 'heading' or 'summary' it cannot be the currentSelected (this.disableUniqueOption will not be executed)
            if (this.previousSelected === sectionSelected) return

            this.disableUniqueOption(sectionSelected);

            this.resetSectionAfterSelectChange(this.previousSelected,sectionId);
        },

        async disableUniqueOption(sectionSelected) {
            const currentSelected = sectionSelected;
            // If previousSelected is any of the uniqueOptions, this means that a unique option (heading, summary) will be changed

            // So the uniqueOptions disabled value can be set to false
            if (this.uniqueOptions.includes(this.previousSelected)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', this.previousSelected);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: false });
            }

            // Likewise if the currentSelected is in uniqueOptions the disabled attribute needs to be set to true
            if (this.uniqueOptions.includes(currentSelected)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', currentSelected);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: true });
            }
        },

        resetSectionAfterSelectChange(previousSection, sectionId) {
            // Get index of section whose value should be reset
            const indexSection = this.findArticleSectionIndex(sectionId);

            // Reset previous section's props
            switch (previousSection) {
                case 'image':
                    this.article[indexSection].url = '';
                    this.article[indexSection].name = '';
                    this.article[indexSection].pk = '';
                    this.article[indexSection].alt = '';
                    this.article[indexSection].is_title_image = false;
                    this.article[indexSection].value = '';
                    break;

                case 'listarray':
                    this.article[indexSection].items = [];
                    this.article[indexSection].value = '';
                    break;
            
                default:
                    this.article[indexSection].value = '';
                    break;
            }
        },

        addRow() {
            // const newRow = { key: '', value: '', id: Math.floor(Date.now() * Math.random()) };
            const newRow = { key: '', id: Math.floor(Date.now() * Math.random()) };
            this.article.push(newRow);
        },

        async deleteRow(sectionId) {

            // Find section in article by id
            const indexSection = this.findArticleSectionIndex(sectionId);
            const sectionKey = this.article[indexSection].key;

            // If a section that ought to be unique gets deleted, set its disabled prop to true to make it selectable again
            if (this.uniqueOptions.includes(sectionKey)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', sectionKey);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: false });
            }

            // Delete the section from the article
            this.article.splice(indexSection, 1);
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
        justify-content: center;
        min-height: 50vh;

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
                    margin-top: 1.5rem;
                    margin-left: auto;
                    margin-right: auto;

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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: .5rem;
                    padding-bottom: .5rem;
                    padding-left: 1.25rem;
                    padding-right: 1.75rem;
                    margin-top: 1rem;
                    border-radius: 25rem;
                    background-color: var(--secondary-tonal);
                    text-transform: capitalize;
                }

                &__form {
                    position: relative;
                    background-color: var(--article-form-bg);
                    padding: .5rem;
                    margin-bottom: .5rem;
                    border: 1.5px solid var(--border);
                    border-radius: .25rem;

                    &__section {
                        position: relative;
                        display: flex;
                        flex-direction: column;

                        &--shrunk {
                            display: none;
                            flex-direction: row;
                            gap: 1rem;
                            // align-items: flex-start;
                        }

                        &__row {
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 1rem;

                            &:last-of-type {
                                margin-bottom: 0;
                            }

                            &__button {
                                align-self: flex-start;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 25rem;

                                &--add {
                                    background-color: var(--secondary-tonal);
                                    width: min(100%, 300px);
                                    padding-top: .5rem;
                                    padding-bottom: .5rem;
                                    margin-top: 1rem;
                                    margin-left: auto;
                                    margin-right: auto;
                                }

                                &--delete {
                                    color: var(--help);
                                    text-transform: uppercase;
                                    letter-spacing: .025rem;
                                    padding-top: 1rem;
                                }

                                &--expand {
                                    position: absolute;
                                    top: -.25rem;
                                    right: .25rem;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                }

                                &--inline {
                                    margin-top: .5rem;
                                }

                                &--not-allowed {
                                    color: var(--help);
                                    text-transform: uppercase;
                                    letter-spacing: .025rem;
                                    padding-top: 1rem;
                                    cursor: not-allowed;
                                }

                                &__icon {
                                    height: 1rem;
                                    width: 1rem;

                                    &--delete {
                                        color: var(--error);
                                        height: .875rem;
                                        width: .875rem;
                                    }
                                }

                                &__text {
                                    font-size: 1rem;
                                    font-weight: 500;

                                    &--append {
                                        margin-left: .25rem;
                                    }

                                    &--delete {
                                        font-size: .875rem; // 14px
                                    }

                                }
                            }

                            &__fieldset {
                                display: flex;
                                flex-direction:column;
                                border-radius: .25rem;

                                &__legend {
                                    text-align: left;
                                    font-weight: 500;
                                    letter-spacing: .025rem;
                                }

                                &__container {
                                    display: flex;
                                    flex-direction: column;
                                    margin-top: 1rem;
                                    margin-bottom: 1rem;

                                    &__row {
                                        display: flex;
                                        align-items: flex-start;

                                        &__item {
                                            margin-right: 1rem;
                                        }
                                    }
                                }

                                &__grid {
                                    display: grid;
                                    gap: .5rem;
                                    grid-template-columns: repeat(8,1fr);
                                    padding-top: 1rem;
                                    padding-bottom: 1rem;

                                    &__item {
                                        display: flex;
                                        flex-direction: column;

                                        &--columns {
                                            grid-column: span 4;

                                            @include tablet {
                                                grid-column: span 2;
                                            }
                                        }
                                        
                                        &--rows {
                                            grid-column: span 8;
                                        }


                                        &__divider {
                                            border-bottom: 1px solid var(--divider);
                                            width: 90%;
                                            padding-top: 1rem;
                                            margin-left: auto;
                                            margin-right: auto;

                                            &--columns {
                                                @include tablet {
                                                    border: none;
                                                    padding: 0;
                                                }
                                            }
                                        }

                                        &__label {
                                            font-family: 'Courier New', Courier, monospace;
                                            font-size: 1.125rem;
                                            text-align: left;
                                        }

                                    
                                        &__nested {
                                            display: grid;
                                            gap: .5rem;
                                            grid-template-columns: repeat(2,1fr);

                                            @include tablet {
                                                grid-template-columns: repeat(4,1fr);
                                            }

                                            &__item {
                                                grid-column: span 1;
                                            }
                                        }
                                    }

                                    &__button {
                                        grid-column-start: 1;
                                        grid-column-end: 9;

                                        @include tablet {
                                            grid-column-start: 3;
                                            grid-column-end: 7;
                                        }
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

                            &__info {
                                color: var(--info);
                                background-color: var(--info-bg-fade);
                                font-size: .875rem;
                                text-align: left;
                                padding: .25rem .5rem;
                                border-radius: .25rem;
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
                                font-size: 1rem; // 14px
                                font-weight: 500;
                                letter-spacing: .025rem;
                                white-space: nowrap;

                                @include tablet-landscape {
                                    font-size: .875rem;
                                }

                                // &--checkbox {
                                // }

                                &--file {
                                    align-self: center;
                                    background-color: var(--secondary-tonal);
                                    font-weight: 500;
                                    font-size: 1rem;
                                    letter-spacing: normal;
                                    text-transform: capitalize;
                                    text-align: center;
                                    padding: .5rem 1.75rem;
                                    margin-top: .5rem;
                                    border-radius: 25rem;
                                    cursor: pointer;
                                    width: min(100%, 300px);
                                }

                                &--readonly {
                                    color: var(--help);
                                }

                                &--visually-hidden {
                                    // Source: https://a11y-guidelines.orange.com/en/web/components-examples/accessible-hiding/
                                    position: absolute;
                                    position: absolute !important;
                                    width: 1px !important;
                                    height: 1px !important;
                                    padding: 0 !important;
                                    margin: -1px !important;
                                    overflow: hidden !important;
                                    clip: rect(0,0,0,0) !important;
                                    white-space: nowrap !important;
                                    border: 0 !important;
                                }

                                &__checkbox {
                                    margin-right: 1rem;
                                }

                                &__text {
                                    margin-left: auto;
                                    margin-right: auto;
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
                                    background: linear-gradient(135deg,var(--textarea-bg) 0,var(--textarea-bg) 97.5%,var(--textarea-resize-indicator) 98%);
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

                                &:read-only {
                                    height: 2rem;
                                    color: var(--help);
                                    background-color: var(--help-bg-fade);
                                    cursor: default;
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
                    padding-left: 1.75rem;
                    padding-right: 1.75rem;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 25rem;
                    background-color: var(--secondary);
                    font-size: 1rem;
                    font-weight: 500;
                    width: min(100%, 300px);
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