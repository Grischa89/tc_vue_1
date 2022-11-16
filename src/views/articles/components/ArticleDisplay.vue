<template>
    <div>
        <div class="article" v-for="(section, i) in article" :key="i">
            <div class="article__section" v-if="section.key === 'image' && section.is_title_image">
                <img :src="section.url" :alt="section.alt" class="article__section__titleImage">
            </div>

            <div class="article__section" v-if="section.key === 'heading'">
                <h1 class="article__section__heading">{{ section.value }}</h1>
            </div>

            <div class="article__section" v-if="section.key === 'summary'">
                <p class="article__section__summary">{{ section.value }}</p>
            </div>

            <div class="article__section" v-if="section.key === 'paragraph'">
                <p class="article__section__paragraph">{{ section.value }}</p>
            </div>

            <div class="article__section" v-if="section.key === 'subheading'">
                <h2 class="article__section__subheading">{{ section.value }}</h2>
            </div>

            <div class="article__section" v-if="section.key === 'sub_subheading'">
                <h3 class="article__section__sub-subheading">{{ section.value }}</h3>
            </div>

            <div class="article__section" v-if="section.key === 'image' && !section.is_title_image">
                <div class="article__section__image" >
                    <img :src="section.url" :alt="section.alt" class="article__section__image__img">
                    <span v-if="section.alt" class="article__section__image__caption">{{ section.alt }} very long caption, yes, yes. Even longer now. WOW!</span>
                </div>
            </div>

            <div class="article__section" v-if="section.key === 'listarray'">
                <ul class="article__section__listarray" v-for="(item, j) in section.items" :key="j">
                    <li class="article__section__listarray__item">{{ item }}</li>
                </ul>
            </div>

            <div class="article__section__table" v-if="section.key === 'table' && section.table_head">
                <table class="article__section__table__table">
                    <thead class="article__section__table__table__head">
                        <tr class="article__section__table__table__head__row">
                            <td
                                v-for="(columnName, k) in section.table_head" :key="k" class="article__section__table__table__head__row__cell">{{ columnName }}</td>
                        </tr>
                    </thead>
                    <tbody class="article__section__table__table__body">
                        <tr
                            v-for="(row, l) in section.rows"
                            :key="l"
                            class="article__section__table__table__body__row">
                            <td
                                v-for="(cell, m) in row" 
                                :key="m"
                                class="article__section__table__table__body__row__cell">
                                {{ cell }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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