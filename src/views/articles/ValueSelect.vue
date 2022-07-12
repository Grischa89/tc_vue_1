<template>
    <select
        class="create-article__main__form__value"
        @change="$emit('update:modelValue', $event.target.value)"
        name="valueSelect">

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