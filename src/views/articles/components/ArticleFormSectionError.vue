<template>
    <p class="section-error">{{ error }}</p>
</template>

<script>
export default {
    name: 'ArticleFormSectionError',

    props: {
        error: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.section-error {
    color: var(--error);
    background-color: var(--error-bg-fade);
    font-size: .875rem;
    text-align: left;
    padding: .25rem .5rem;
    border-radius: .25rem;
    margin-top: .5rem;
}
</style>