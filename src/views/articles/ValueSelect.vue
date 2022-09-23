<template>
    <select
        class="form-article__main__form__value"
        @change="$emit('update:modelValue', $event.target.value)"
        name="valueSelect"
        :id="idForLabel">

        <option value selected disabled >Choose An Article</option>
        <option
            v-for="(article, i) in articleRecommendations"
            :key="i"
            :value="article.slug">{{ article.heading }}</option>
            
    </select>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ValueSelect',

    props: ['idForLabel'],

    computed: {
        ...mapGetters({
            articleRecommendations: 'articleRecommendations'
        }),
    }

}
</script>