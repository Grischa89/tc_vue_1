<template>
    <li>
        {{ item }}
    </li>
</template>

<script>
export default {
    name: 'ArticleDisplayListItem',

    props: {
        item: {
            type: String,
            required: true,
        }
    }
}
</script>