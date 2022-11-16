<template>
    <div>
        <div class="article">
            <div
                v-for="(section, i) in article"
                :key="i"
                class="article__section">

                <ArticleDisplayImage
                    v-if="section.key === 'image' && section.is_title_image"
                    :url="section.url"
                    :alt="section.alt"
                    class="article__section__titleImage" />

                <article-display-heading v-else-if="section.key === 'heading'">
                    <h1 class="article__section__heading">{{ section.value }}</h1>
                </article-display-heading>

                <article-display-text v-else-if="section.key === 'summary'" >
                    <p class="article__section__summary">{{ section.value }}</p>
                </article-display-text>

                <article-display-text v-else-if="section.key === 'paragraph'">
                    <p class="article__section__paragraph">{{ section.value }}</p>
                </article-display-text>

                <article-display-heading v-else-if="section.key === 'subheading'">
                    <h2 class="article__section__subheading">{{ section.value }}</h2>
                </article-display-heading>

                <article-display-heading v-else-if="section.key === 'sub_subheading'">
                    <h3 class="article__section__sub-subheading">{{ section.value }}</h3>
                </article-display-heading>

                <div v-else-if="section.key === 'image' && !section.is_title_image" class="article__section__image" >
                    <ArticleDisplayImage 
                    :url="section.url"
                    :alt="section.alt"
                    class="article__section__image__img"/>
                    <ArticleDisplayImageCaption
                        v-if="section.alt" 
                        :caption="section.alt"
                        class="article__section__image__caption" />
                </div>

                <article-display-list v-else-if="section.key === 'listarray'" class="article__section__listarray">
                    <ArticleDisplayListItem
                        v-for="(item, j) in section.items" :key="j"
                        :item="item"
                        class="article__section__listarray__item" />
                </article-display-list>

                <ArticleDisplayTable
                    v-else-if="section.key === 'table' && section.table_head"
                    :table_head="section.table_head"
                    :rows="section.rows"
                    class="article__section__table" />
            </div>
        </div>
    </div>
</template>

<script>
import ArticleDisplayHeading from './ArticleDisplayHeading.vue';
import ArticleDisplayImage from './ArticleDisplayImage.vue';
import ArticleDisplayImageCaption from './ArticleDisplayImageCaption.vue';
import ArticleDisplayList from './ArticleDisplayList.vue';
import ArticleDisplayListItem from './ArticleDisplayListItem.vue';
import ArticleDisplayTable from './ArticleDisplayTable.vue';
import ArticleDisplayText from './ArticleDisplayText.vue';

export default {
    name: 'ArticleDisplay',

    props: {
        article: Array,
    },

    components: {
        ArticleDisplayHeading,
        ArticleDisplayImage,
        ArticleDisplayImageCaption,
        ArticleDisplayList,
        ArticleDisplayListItem,
        ArticleDisplayTable,
        ArticleDisplayText
    }
}
</script>