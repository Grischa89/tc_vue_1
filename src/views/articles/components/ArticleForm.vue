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
                                    <select class="form-article__main__form__section__row__key"
                                    name="key" :id="`key-${element.id}`" v-model="element.key" @focus="setPreviousSelected" @change="handleSectionSelect($event.target.value, element.id)">
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
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--file" :for="`imageFile-${element.id}`">Choose image</label>
                                        <input @change="handleImage($event, element.id)"
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
                                            v-model.trim="element.alt"
                                            :idForLabel="`imageAlt-${element.id}`" />
                                    </div>
                                    <!-- TITLE IMAGE -->
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label form-article__main__form__section__row__label--checkbox" :for="`imageTitleImage-${element.id}`">
                                            <input
                                                v-model="element.is_title_image"
                                                type="checkbox" name="titleImage" :id="`imageTitleImage-${element.id}`">
                                        <span class="form-article__main__form__section__row__label__text">Title Image</span></label>
                                    </div>
                                </template>

                                <!-- TABLE SECTION -->
                                <template v-else-if="element.key === 'table'">

                                    <!-- COLUMNS -->
                                    <div class="form-article__main__form__section__row">
                                        <fieldset>
                                            <legend>Columns</legend>

                                            <div v-for="(column, i) in element.columns"
                                                :key="`${element.key}Cols-${element.id}`" class="form-article__main__form__section__row__list">
                                                <label class="form-article__main__form__section__row__label" :for="`${element.key}Col${i}-${element.id}`">Col {{ i + 1 }}</label>

                                                <ArticleFormSectionInput
                                                    v-model.trim="column.name"
                                                    @focus="saveColumnName(column.name)"
                                                    @blur="updateRowProps($event, this.previousColumnName, element.id)"
                                                    class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                    :idForLabel="`${element.key}Col${i}-${element.id}`"
                                                    :isReadonly="false" />
                                                <article-form-section-button 
                                                    class="form-article__main__form__section__row__button form-article__main__form__section__row__button--inline"
                                                    @click="deleteTableColumn(element.id, i)">
                                                    <template #icon>
                                                        <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                    </template>
                                                </article-form-section-button>
                                            </div>
                                        </fieldset>

                                        <article-form-section-button 
                                            class="form-article__main__form__section__row__button"
                                            @click="addTableColumn(element.id)">
                                            <template #text-prepend>
                                                <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--prepend">
                                                    Add column
                                                </span>
                                            </template>
                                            <template #icon>
                                                <IconPlus class="form-article__main__form__section__row__button__icon" />
                                            </template>
                                        </article-form-section-button>
                                    </div>

                                    <!-- ROWS -->
                                    <div class="form-article__main__form__section__row">
                                        <fieldset>
                                            <legend>Rows</legend>

                                            <div v-for="(row, i) in element.rows" :key="`${element.key}Rows-${element.id}`" class="form-article__main__form__section__row__list">
                                                <label class="form-article__main__form__section__row__label">Row {{ i + 1 }}</label>
                                                <template v-for="(cell, j) in element.columns">
                                                    
                                                    <label class="form-article__main__form__section__row__label--visually-hidden" :for="`${element.key}Row${i}-Col${j}-${element.id}`"></label>

                                                    <ArticleFormSectionInput
                                                        v-model.trim="row[`${element.columns[j].name}`]"
                                                        class="form-article__main__form__section__row__value form-article__main__form__section__row__value--input"
                                                        :idForLabel="`${element.key}Row${i}-Col${j}-${element.id}`"
                                                        :placeholder="element.columns[j].name"
                                                        :isReadonly="false" />
                                                </template>
                                                <article-form-section-button 
                                                    class="form-article__main__form__section__row__button form-article__main__form__section__row__button--inline"
                                                    @click="deleteTableRow(element.id, i)">
                                                    <template #icon>
                                                        <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                    </template>
                                                </article-form-section-button>
                                            </div>
                                        </fieldset>

                                        <article-form-section-button 
                                            class="form-article__main__form__section__row__button"
                                            @click="addTableRow(element.id)">
                                            <template #text-prepend>
                                                <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--prepend">
                                                    Add row
                                                </span>
                                            </template>
                                            <template #icon>
                                                <IconPlus class="form-article__main__form__section__row__button__icon" />
                                            </template>
                                        </article-form-section-button>
                                    </div>
                                </template>

                                <!-- LISTARRAY SECTION -->
                                <template v-else-if="element.key === 'listarray'">
                                    <div class="form-article__main__form__section__row">
                                        <label class="form-article__main__form__section__row__label" :for="`${element.key}Items-${element.id}`">Items</label>

                                        <div v-for="(item, i) in element.items" :key="`${element.key}Items-${element.id}`" class="form-article__main__form__section__row__list">
                                            <ArticleFormSectionTextarea
                                                v-model.trim="item.value"
                                                class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                                :idForLabel="`${element.key}Items-${element.id}-Item${i}`"
                                                :rows="listArrayTextareaRows" />
                                            <article-form-section-button 
                                                class="form-article__main__form__section__row__button form-article__main__form__section__row__button--inline"
                                                @click="deleteListArrayItem(element.id, i)">
                                                <template #icon>
                                                    <IconDelete class="form-article__main__form__section__row__button__icon" />
                                                </template>
                                            </article-form-section-button>
                                        </div>

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
                                            v-model.trim="element.value"
                                            class="form-article__main__form__section__row__value form-article__main__form__section__row__value--textarea"
                                            :idForLabel="`${element.key}Content-${element.id}`" />
                                    </div>
                                </template>

                                <!-- DELETE BUTTON -->
                                <div class="form-article__main__form__section__row">
                                    <article-form-section-button
                                        class="form-article__main__form__section__row__button"
                                        @click="deleteRow(element.id)">
                                        <template #text-prepend>
                                            <span class="form-article__main__form__section__row__button__text form-article__main__form__section__row__button__text--prepend">Delete Section</span>
                                        </template>
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
            previousColumnName: '',
            listArrayTextareaRows: 1,
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
                        section.table_head = element.columns.map(({ name }) => name);

                        if (element.rows?.length) {
                            section.rows = [];
                            for (const item of element.rows) {

                                const row = [];

                                for (const cell in item) {
                                    row.push(item[cell]);
                                }

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

        addListArrayItem(id) {
            // Find index of listarray section with id
            const idListArray = this.article.findIndex(item => item.id === id);
            // Check whether items array already exists else create it
            if (this.article[idListArray].items === undefined) this.article[idListArray].items = [];
            // Push new empty item to listarray section with that id
            this.article[idListArray].items.push({
                value: ''
            });
        },

        deleteListArrayItem(sectionId, itemId) {
            // Find index of listarray section with sectionId
            const idListArray = this.article.findIndex(item => item.id === sectionId);
            // Delete item in listarray
            this.article[idListArray].items.splice(itemId, 1);
        },

        addTableColumn(id) {
            // Find index of table section with id
            const indexTable = this.article.findIndex(item => item.id === id);
            // Check whether columns array already exists else create it
            if (this.article[indexTable].columns === undefined) this.article[indexTable].columns = [];
            // Find out columns array length to set preliminary name for added column
            const colNumber = this.article[indexTable].columns.length;
            // Push new empty object with name prop to table section with that id
            this.article[indexTable].columns.push({
                name: `Column ${colNumber + 1}`
            });
            // Select added col name input for user
            this.selectTableColumnInput(id, colNumber);
        },

        deleteTableColumn(sectionId, columnId) {
            // Find index of table section with sectionId
            const indexTable = this.article.findIndex(item => item.id === sectionId);
            // Save columnName to pass as argument to deleteTableCells fn
            const columnName = this.article[indexTable].columns[columnId].name;
            // Delete column object in table columns
            this.article[indexTable].columns.splice(columnId, 1);
            // Delete respective cells from row that belong to column
            this.deleteTableCells(indexTable, columnName);
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

        addTableRow(id) {
            // Find index of table section with id
            const indexTable = this.article.findIndex(item => item.id === id);
            // Check whether rows array already exists else create it
            if (this.article[indexTable].rows === undefined) this.article[indexTable].rows = [];
            // Push new empty object table section with that id (TODO row_id, is necessary?)
            this.article[indexTable].rows.push({ });
        },

        deleteTableRow(sectionId, rowId) {
            // Find index of table section with sectionId
            const indexTable = this.article.findIndex(item => item.id === sectionId);
            // Delete row object in table rows
            this.article[indexTable].rows.splice(rowId, 1);
        },

        updateRowProps(e, previousColumnName, sectionId) {
            // If no previousColumnName exists, return
            if (previousColumnName === '') return;

            const currentColumnName = e.target.value;
            
            // If no changes were made to columnName, return
            if (currentColumnName === previousColumnName) return;

            // Get table object id
            const tableIndex = this.article.findIndex(section => section.id === sectionId);

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

        deleteTableCells(indexTable, columnName) {
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

        resetSectionAfterSelectChange(previousSection, id) {
            // Get index of section whose value should be reset
            const sectionIndex = this.article.findIndex(section => section.id === id);

            // Reset previous section's props
            switch (previousSection) {
                case 'image':
                    this.article[sectionIndex].url = '';
                    this.article[sectionIndex].name = '';
                    this.article[sectionIndex].pk = '';
                    this.article[sectionIndex].alt = '';
                    this.article[sectionIndex].is_title_image = false;
                    this.article[sectionIndex].value = '';
                    break;

                case 'listarray':
                    this.article[sectionIndex].items = [];
                    this.article[sectionIndex].value = '';
                    break;
            
                default:
                    this.article[sectionIndex].value = '';
                    break;
            }
        },

        addRow() {
            // const newRow = { key: '', value: '', id: Math.floor(Date.now() * Math.random()) };
            const newRow = { key: '', id: Math.floor(Date.now() * Math.random()) };
            this.article.push(newRow);
        },

        async deleteRow(id) {

            // Find section in article by id
            const sectionIndex = this.article.findIndex(item => item.id === id);
            const sectionKey = this.article[sectionIndex].key;

            // If a section that ought to be unique gets deleted, set its disabled prop to true to make it selectable again
            if (this.uniqueOptions.includes(sectionKey)) {
                const index = await this.$store.dispatch('findIndexOfUniqueSection', sectionKey);
                this.$store.commit('setDisabledValueOnArticleSections', { sectionIndex: index, isDisabled: false });
            }

            // Delete the section from the article
            this.article.splice(sectionIndex, 1);
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

                        &--shrunk {
                            display: none;
                            flex-direction: row;
                            gap: 1rem;
                            // align-items: flex-start;
                        }

                        &__row {
                            display: flex;
                            flex-direction: column;

                            &__button {
                                align-self: flex-start;
                                display: flex;
                                align-items: center;
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

                                &--inline {
                                    margin-top: .5rem;
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
                                white-space: nowrap;

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

                                &__text {
                                    margin-left: .5rem;
                                }
                            }

                            &__list {
                                display: flex;
                                align-items: center;

                                :last-child {
                                    align-self: flex-start;
                                    margin-left: .25rem;
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