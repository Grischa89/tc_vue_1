<template>
    <select @input="handleSelect" name="key" id="key">
        <option value selected disabled >Choose A Column</option>
        <option
            v-for="(column, i) in articleColumns"
            :key="i"
            :value="column">{{ column }}</option>
    </select>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Key',

    props: {
        headingExists: Number,
        summaryExists: Boolean,
    },

    data() {
        return {
            articleColumns: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],
        }
    },

    created() {
        // axios.get('http://127.0.0.1:8000/bookmarks/get_article_columns/')
        // .then(res => {
        //     console.log('res', res);
        //     console.log('reheadingExistss',this.headingExists);

        //     if (this.headingExists > 1) {
        //         this.articleColumns = res.data.columns.filter(item => item !== 'heading');
        //         console.log('%cthis.articleColumns', 'color: darkseagreen; font-weight: bold;', this.articleColumns);
        //         return
        //     }

        //     this.articleColumns = res.data.columns;
        //     console.log('%cthis.articleColumns', 'color: darkseagreen; font-weight: bold;', this.articleColumns);
        // })
        // .catch(err => {
        //     console.log('err', err);
        // });
    },

    methods: {
        handleSelect(e) {
            this.$emit('input', e.target.value);
        }
    },

    computed: {
        // computedArticleColumns() {
        //     if (this.headingExists) {
        //         return this.articleColumns.filter(item => item !== 'heading');
        //         // console.log('%cthis.articleColumns', 'color: darkseagreen; font-weight: bold;', this.articleColumns);
        //     }
        //     return this.articleColumns;
        // }
    }
}
</script>

<style>

</style>