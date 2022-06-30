<template>
    <select @change="$emit('update:modelValue', $event.target.value)">
        <option value selected disabled >Choose An Article</option>
        <option
            v-for="(article, i) in articleRecommendations"
            :key="i"
            :value="article.pk">{{ article.heading }}</option>
    </select>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ValueSelect',

    computed: {
        ...mapGetters({
            articleRecommendations: 'articleRecommendations'
        }),
    }

}
</script>
<style lang="">
    
</style>