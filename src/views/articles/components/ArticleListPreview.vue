<template>
    <div class="article-preview">
        <div class="article-preview__text">
            <div class="article-preview__text__heading">
                <router-link :to="{ name: 'ShowArticle', params: { slug: `${article.slug}` } }">{{ article.heading }}</router-link>
            </div>
            <div class="article-preview__text__meta">
                <span class="article-preview__meta__date">Jul 14, 2022</span>
                <span class="article-preview__meta__reading-time">4 min read</span>
            </div>
            <div v-if="isUpdateRoute" class="article-preview__text__update">
                <button @click="openUpdateArticle(article.slug)" class="article-preview__text__update__button" type="button">Update</button>
            </div>
        </div>
        <div v-if="article.image?.is_title_image" class="article-preview__image">
            <img :src="article.image.url" class="article-preview__image__img">

            <div class="article-preview__image__backdrop">

            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ArticleListPreview',

    props: ['article', 'isUpdateRoute'],

    methods: {
        openUpdateArticle(slug) {
            this.$router.push({ name: 'UpdateArticle', params: { slug: `${slug}` } });
        }
    },

}
</script>

<style lang="scss">
    .article-preview {
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
        margin-bottom: .5rem;
        // border: 1px solid lightgray;

        &__text {
            align-self: center;
            text-align: left;

            &__heading {
                font-family: Monaco, monospace;
                font-size: 1.25rem;
                font-weight: 600;

                &:hover {
                    text-decoration: underline;
                }
            }

            &__meta {
                font-size: $mobile-help;
                color: var(--help);

                span {
                    margin-right: .5rem;
                }
            }

            &__update {
                margin-top: 1rem;

                &__button {
                    padding-top: .25rem;
                    padding-bottom: .25rem;
                    padding-left: .75rem;
                    padding-right: .75rem;
                    border-radius: 0.25em;
                    background-color: var(--text);
                    color: var(--textInverse);
                    font-size: $mobile-help;
                    font-weight: 600;
                    letter-spacing: .1ch;
                    text-transform: uppercase;

                    &:hover {
                        background-color: var(--hover-button-inverse);
                    }

                    &:focus {
                        background-color: var(--focus-button-inverse);
                    }
                }
            }
        }

        &__image {
            display: flex;
            // flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 7.5rem;
            width: 7.5rem;
            // background-color: lightgray;

            &__img {
                // position: absolute;
                // top: calc(7.5rem / 2);
                height: 5rem;
                width: 5rem;
                background-color: rgba(lightgray, 1);
                z-index: 2;
            }

            &__backdrop {
                position: absolute;
                top: 0;
                // left: 25%;
                right: 0;
                height: 5rem;
                width: 5rem;
                background-color: $primary-darker;
                // z-index: -1;
            }
        }
    }
</style>