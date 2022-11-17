<template>
    <h3 class="article__section__sub-subheading">{{ compProps.sub_subheading }}</h3>
</template>

<script>
export default {
    name: 'ArticleDisplaySub_Subheading',

    props: {
        compProps: {
            type: Object,
            required: true,
        }
    }
}
</script>