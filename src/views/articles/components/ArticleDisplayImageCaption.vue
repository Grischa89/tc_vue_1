<template>
    <span>
        {{ caption }}
    </span>
</template>

<script>
export default {
    name: 'ArticleDisplayImageCaption',

    props: {
        caption: {
            type: String,
            required: true,
        }
    }
}
</script>