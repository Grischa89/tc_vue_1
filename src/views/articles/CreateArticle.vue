<template>
    <div class="article-form">
        <h1>Create new article</h1>
        <button type="button" @click="addRow">Add</button>

        <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false">
            <template #item="{element}">
                <div>
                    <!-- <Key v-model="element.key" /> -->
                    <select name="key" id="key" v-model="element.key" @focus="setPreviousSelected" @change="disableUniqueOption">
                        <option value selected disabled >Choose A Column</option>
                        <option
                            v-for="(column, i) in articleColumns"
                            :key="i"
                            :value="column.name"
                            :disabled="column.disabled">{{ column.name }}</option>
                    </select>

                    <Value v-model="element.value" />
                    
                    <button type="button" @click="deleteRow(element.id)">Delete</button>
                </div>
            </template>
        </draggable>        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import draggable from 'vuedraggable'
import Key from '../articles/Key.vue';
import Value from '../articles/Value.vue';
import PreviewArticle from '../articles/PreviewArticle.vue';

export default {
    name: 'CreateArticle',

    components: {
        draggable,
        Key,
        Value,
        PreviewArticle,
    },

    created() {
        this.article.forEach(element => {
            if (this.uniqueOptions.includes(element.key)) {
                const i = this.findUniqueIndex(element.key);
                this.articleColumns[i].disabled = true;
            } 
        });
    },

    data() {
        return {
            options: this.articleColumns,
            uniqueOptions: ['heading', 'summary'],
            previousSelected: null,
            // articleColumns: ['heading', 'summary', 'paragraph', 'subheading', 'listarray'],
            dummyOrder: ['heading', 'summary', 'paragraph', 'subheading', 'paragraph', 'listarray', 'paragraph', 'subheading', 'paragraph'],
            dummyArticle: [
                { heading: 'Awesome heading' }, 
                { summary: 'Awesome summary' }, 
                { paragraph: ['Awesome paragraph 1', 'Awesome paragraph 2', 'Awesome paragraph 3', 'Awesome paragraph 4'] }, 
                { subheading: ['Awesome subheading 1', 'Awesome subheading 2'] }, 
                { listarray: [['Awesome listarray item 1', 'Awesome listarray item 2']] }, 
            ],
            article: [
                { key: 'heading', value: '', id: Date.now(), l: 'l1' },
                { key: 'summary', value: '', id: Date.now() - 11, l: 'l1' },
                // { key: "summary", value: "", id: 2,l:"l1" },
                // { key: "subheading", value: "", id: 3,l:"l1" },
                // { key: "paragraph", value: "", id: 4,l:"l1" },

                // { key: "table", value: [], id: 5,l:"l1" },
                // { key: "ad_url", value: "", id: 6,l:"l1" },
                // { key: "url", value: "", id: 7,l:"l1" },
                // { key: "listarray", value: "", id: 8,l:"l1" },
                // // vermutung dass wir es nicht brauchen
                // { key: "order", value: "", id:9,l:"l1" },
                // { key: "image", value: "", id:10,l:"l1" },

            ],
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
            articleColumns: 'articleColumns',
        }),

        rowCount() {
            return this.article?.length;
        },
    },

    methods: {
        setPreviousSelected(e) {
            this.previousSelected = e.target.value;
        },

        

        findUniqueIndex(uniqueOption) {
            console.log('%cuniqueOption', 'color: darkseagreen; font-weight: bold;', uniqueOption);
            const index = this.articleColumns.findIndex(object => {
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
                const index = this.findUniqueIndex(this.previousSelected);
                this.articleColumns[index].disabled = false;
            }

            if (this.uniqueOptions.includes(currentSelected)) {
                const index = this.findUniqueIndex(currentSelected);
                this.articleColumns[index].disabled = true;
            }
        },

        // checkUniqueOptions() {
        //     const heading = this.headingExists();
        //     const summary = this.summaryExists();

        //     const headingIndex = this.findUniqueIndex('heading');
        //     heading ? this.articleColumns[headingIndex].disabled = true : this.articleColumns[headingIndex].disabled = false;

        //     const summaryIndex = this.findUniqueIndex('summary');
        //     summary ? this.articleColumns[summaryIndex].disabled = true : this.articleColumns[summaryIndex].disabled = false;       
        // },

        // headingExists() {
        //     const heading = this.article.filter(item => item.key === 'heading');
        //     return heading.length > 0 ? true : false;
        // },

        // summaryExists() {
        //     const heading = this.article.filter(item => item.key === 'summary');
        //     return heading.length > 0 ? true : false;
        // },

        displayValue(val) {
            console.log('%cval', 'color: plumg; font-weight: bold;', val);
        },

        submitForm() {
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
        },

        changeOrder() {
            console.log("1:", this.article)
            //   console.log("2:", this.list2)
            window.console.log(evt);
            // this.submitForm();
        },

        addRow() {
            // this.rowCount += 1;
            const newRow = { key: '', value: '', id: Date.now(), l: 'l1' };
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
    .article-form {
        background-color: aquamarine;
    }
</style>