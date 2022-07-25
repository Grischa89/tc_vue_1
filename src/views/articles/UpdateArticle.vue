<template>
    <div>
        {{ article }}
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'UpdateArticle',

    created() {
        this.$store.dispatch('getArticle', this.$route.params.slug);
    },

    computed: {
        ...mapGetters({
            article: 'displayArticle',
        })
    }

}
</script>
<style lang="">
    
</style>