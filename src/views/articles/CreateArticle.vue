<template>
    <div class="article-form">
        <h1>Create new article</h1>
        <button type="button" @click="addRow">Add</button>

        <!-- <draggable class="list-group" v-model="article" group="people" @start="drag=true" @end="drag=false" @change="log1">
            <div v-for="(element) in article" :key="element.id" class="card sortable">

            <Key
                v-model="element.key"
                :headingExists="headingExists"
                :summaryExists="summaryExists" />

            <Value v-model="element.value" />
            
            </div>
        </draggable> -->

        <draggable v-model="article" item-key="id" @start="drag=true" @end="drag=false">
            <template #item="{element}">
                <div>
                    <Key
                        v-model="element.key"
                        :headingExists="headingExists"
                        :summaryExists="summaryExists" />

                    <Value v-model="element.value" />
                </div>
            </template>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import Key from '../articles/Key.vue';
import Value from '../articles/Value.vue';

export default {
    name: 'CreateArticle',

    components: {
        draggable,
        Key,
        Value,
    },

    data() {
        return {
            rowCount: 2,
            article: [
                { key: 'heading', value: '', id: Date.now(), l: 'l1' },
                { key: 'summary', value: '', id: Date.now() - 1, l: 'l1' },
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

    methods: {
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
            this.rowCount += 1;
            const newRow = { key: 'paragraph', value: '', id: Date.now(), l: 'l1' };
            this.article.push(newRow);
            
            console.log('%cthis.article', 'color: darkseagreen; font-weight: bold;', this.article);
        },
    }
}
</script>

<style lang="scss">
    .article-form {
        background-color: aquamarine;
    }
</style>