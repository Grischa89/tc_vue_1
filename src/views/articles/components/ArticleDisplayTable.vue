<template>
    <div>
        <table class="article__section__table__table">
            <thead class="article__section__table__table__head">
                <tr class="article__section__table__table__head__row">
                    <td
                        v-for="(columnName, k) in table_head" :key="k" class="article__section__table__table__head__row__cell">{{ columnName }}</td>
                </tr>
            </thead>
            <tbody class="article__section__table__table__body">
                <tr
                    v-for="(row, l) in rows"
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
</template>

<script>
export default {
    name: 'ArticleDisplayTable',

    props: {
        table_head: {
            type: Array,
            required: true
        },
        rows: {
            type: Array,
            required: false
        }
    }
}
</script>