<template>
    <div>
        {{ article }}
        <!-- <div class="article" v-for="(item, i) in article" :key="i">
            <div class="article__heading" v-if="item.key === 'heading'">
                <h1>{{ item.value }}</h1>
            </div>
            <div class="article__summary" v-if="item.key === 'summary'">
                <p>{{ item.value }}</p>
            </div>
            <div class="article__paragraph" v-if="item.key === 'paragraph'">
                <p>{{ item.value }}</p>
            </div>
            <div class="article__subheading" v-if="item.key === 'subheading'">
                <h2>{{ item.value }}</h2>
            </div>
            <div class="article__listarray" v-if="item.key === 'listarray'">
                <ul v-for="(listItem, j) in item.value" :key="j">
                    <li>{{ listItem }}</li>
                </ul>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'ArticleDisplay',

    props: {
        article: Array,
    }
}
</script>

<style>

</style>