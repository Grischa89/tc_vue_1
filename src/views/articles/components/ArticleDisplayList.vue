<template>
    <ul class="article__section__listarray">
        <ArticleDisplayListItem
            v-for="(item, j) in compProps.items" :key="j"
            :item="item"
            class="article__section__listarray__item" />
    </ul>
</template>

<script>
import ArticleDisplayListItem from './ArticleDisplayListItem.vue';

export default {
    name: 'ArticleDisplayList',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    },

    components: {
        ArticleDisplayListItem,
    }
}
</script>