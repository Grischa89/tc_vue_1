<template>
        <div class="article">
                <div class="article__meta">
                    <span>{{ metaDate }}</span>
                </div>

                <component
                    v-for="(section, i) in articleWithComponents"
                    :key="section.id"
                    :is="section.component"
                    :compProps="section.compProps"
                    class="article__section"></component>
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
        article: {
            type: Array,
            required: true,
        },
        meta: {
            type: Object,
            required: false,
        }
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
        },

        metaDate() {
            if (this.meta) {
                const [splitDate, splitTime] = this.meta.updated.split(', ');
                const formattedDate = splitDate.replace(/-/g, '.');

                return formattedDate;
            }
        }
    }
}
</script>