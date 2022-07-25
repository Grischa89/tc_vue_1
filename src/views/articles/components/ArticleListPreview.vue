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
        </div>
        <div class="article-preview__image">
            <div class="article-preview__image__img">

            </div>

            <div class="article-preview__image__backdrop">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ArticleListPreview',

    props: ['article'],

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