<template>
    <div>
        <div class="article" v-for="(section, i) in article" :key="i">
            <div class="article__heading" v-if="section.key === 'heading'">
                <h1>{{ section.value }}</h1>
            </div>
            <div class="article__summary" v-if="section.key === 'summary'">
                <p>{{ section.value }}</p>
            </div>
            <div class="article__paragraph" v-if="section.key === 'paragraph'">
                <p>{{ section.value }}</p>
            </div>
            <div class="article__subheading" v-if="section.key === 'subheading'">
                <h2>{{ section.value }}</h2>
            </div>
            <div class="article__sub-subheading" v-if="section.key === 'sub_subheading'">
                <h3>{{ section.value }}</h3>
            </div>
            <div class="article__listarray" v-if="section.key === 'listarray'">
                <ul v-for="(listItem, j) in section.value" :key="j">
                    <li>{{ listItem }}</li>
                </ul>
            </div>
            <div class="article__table" v-if="section.key === 'table'">
                <table class="article__table__table">
                    <thead class="article__table__table__head">
                        <tr class="article__table__table__head__row">
                            <td
                                v-for="(columnName, k) in section.table_head" :key="k" class="article__table__table__head__row__cell">{{ columnName }}</td>
                        </tr>
                    </thead>
                    <tbody class="article__table__table__body">
                        <tr
                            v-for="(row, l) in section.rows"
                            :key="l"
                            class="article__table__table__body__row">
                            <td
                                v-for="(cell, m) in row" 
                                :key="m"
                                class="article__table__table__body__row__cell">
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

<style>

</style>