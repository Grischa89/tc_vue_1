<template>
    <div>
        <div class="article">
            <!-- <div
                v-for="(section, i) in article"
                :key="i"
                class="article__section"> -->

                <component
                    v-for="(section, i) in articleWithComponents"
                    :key="section.id"
                    :is="section.component"
                    :compProps="section.compProps"
                    class="article__section"></component>

                <!-- <ArticleDisplayImage
                    v-if="section.key === 'image' && section.is_title_image"
                    :url="section.url"
                    :alt="section.alt"
                    class="article__section__titleImage" />

                <ArticleDisplayHeading
                    v-else-if="section.key === 'heading'"
                    :heading="section.value"
                    class="article__section__heading" />

                <ArticleDisplaySummary
                    v-else-if="section.key === 'summary'"
                    :summary="section.value"
                    class="article__section__summary" />

                <ArticleDisplayParagraph
                    v-else-if="section.key === 'paragraph'"
                    :paragraph="section.value"
                    class="article__section__paragraph" />

                <ArticleDisplaySubheading
                    v-else-if="section.key === 'sub_subheading'"
                    :subheading="section.value"
                    class="article__section__subheading" />

                <ArticleDisplaySub_Subheading
                    v-else-if="section.key === 'sub_subheading'"
                    :sub_subheading="section.value"
                    class="article__section__sub-subheading" />

                <ArticleDisplayImageContainer 
                    v-else-if="section.key === 'image' && !section.is_title_image"
                    :url="section.url"
                    :alt="section.alt"
                    class="article__section__image" />

                <ArticleDisplayList
                    v-else-if="section.key === 'listarray'"
                    :items="section.items"
                    class="article__section__listarray" />

                <ArticleDisplayTable
                    v-else-if="section.key === 'table' && section.table_head"
                    :table_head="section.table_head"
                    :rows="section.rows"
                    class="article__section__table" /> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import ArticleDisplayHeading from './ArticleDisplayHeading.vue';
import ArticleDisplayImage from './ArticleDisplayImage.vue';
import ArticleDisplayImageContainer from './ArticleDisplayImageContainer.vue';
import ArticleDisplayList from './ArticleDisplayList.vue';
import ArticleDisplayParagraph from './ArticleDisplayParagraph';
import ArticleDisplaySubheading from './ArticleDisplaySubheading.vue';
import ArticleDisplaySub_Subheading from './ArticleDisplaySub_Subheading.vue';
import ArticleDisplayTable from './ArticleDisplayTable.vue';
import ArticleDisplaySummary from './ArticleDisplaySummary.vue';

export default {
    name: 'ArticleDisplay',

    props: {
        article: Array,
    },

    components: {
        ArticleDisplayHeading,
        ArticleDisplayImage,
        ArticleDisplayImageContainer,
        ArticleDisplayList,
        ArticleDisplayParagraph,
        ArticleDisplaySubheading,
        ArticleDisplaySub_Subheading,
        ArticleDisplaySummary,
        ArticleDisplayTable,
    },

    computed: {
        articleWithComponents() {
            // if (this.article) {

                const articleMapped = this.article.map(section => {
                    switch (section.key) {
                        case 'heading':
                            section.component = 'ArticleDisplayHeading';
                            section.compProps = {
                                heading: section.value
                            };
                            break;
                        case 'image':
                            if (section.is_title_image) {
                                section.component = 'ArticleDisplayImage';
                            } else {
                                section.component = 'ArticleDisplayImageContainer';
                            }
                            section.compProps = {
                                url: section.url,
                                alt: section.alt,
                            }
                            break;
                        case 'listarray':
                            section.component = 'ArticleDisplayList';
                            section.compProps = {
                                items: section.items
                            };
                            break;
                        case 'paragraph':
                            section.component = 'ArticleDisplayParagraph';
                            section.compProps = {
                                paragraph: section.value
                            };
                            break;
                        case 'subheading':
                            section.component = 'ArticleDisplaySubheading';
                            section.compProps = {
                                subheading: section.value
                            };
                            break;
                        case 'sub_subheading':
                            section.component = 'ArticleDisplaySub_Subheading';
                            section.compProps = {
                                sub_subheading: section.value
                            };
                            break;
                        case 'summary':
                            section.component = 'ArticleDisplaySummary';
                            section.compProps = {
                                summary: section.value
                            };
                            break;
                        case 'table':
                            section.component = 'ArticleDisplayTable';
                            section.compProps = {
                                table_head: section.table_head,
                                rows: section.rows,
                            };
                            break;
                        default:
                            break;
                    }

                    return section;
                });
                
                return articleMapped;
            // }

        },
    }
}
</script>