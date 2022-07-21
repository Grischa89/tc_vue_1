<template>
    <div>
        <div class="article" v-for="(item, i) in article" :key="i">
            <div class="article__heading" v-if="item.section === 'heading'">
                <h1>{{ item.content }}</h1>
            </div>
            <div class="article__summary" v-if="item.section === 'summary'">
                <p>{{ item.content }}</p>
            </div>
            <div class="article__paragraph" v-if="item.section === 'paragraph'">
                <p>{{ item.content }}</p>
            </div>
            <div class="article__subheading" v-if="item.section === 'subheading'">
                <h2>{{ item.content }}</h2>
            </div>
            <div class="article__sub-subheading" v-if="item.section === 'sub_subheading'">
                <h3>{{ item.content }}</h3>
            </div>
            <div class="article__listarray" v-if="item.section === 'listarray'">
                <ul v-for="(listItem, j) in item.content" :key="j">
                    <li>{{ listItem }}</li>
                </ul>
            </div>
            <div class="article__table" v-if="item.section === 'table'">
                <table class="article__table__table">
                    <thead class="article__table__table__head">
                        <tr class="article__table__table__head__row">
                            <td
                                v-for="(columnName, k) in item.content.columns" :key="k" class="article__table__table__head__row__cell">{{ columnName }}</td>
                        </tr>
                    </thead>
                    <tbody class="article__table__table__body">
                        <tr
                            v-for="(row, l) in item.content.rows"
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