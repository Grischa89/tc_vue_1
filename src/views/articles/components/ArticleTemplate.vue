<template>
    <slot></slot>
</template>

<script>
export default {
    name: 'ArticleTemplate'
}
</script>

<style lang="scss">
    .article {

        font-family: Arial, Helvetica, sans-serif;
        font-size: $mobile-body;
        text-align: justify;

        &__heading {
            font-family: Monaco, monospace;
            font-size: 1.75rem;
            font-weight: bold;
            letter-spacing: .0875rem;
            margin-bottom: 1rem;
        }

        &__summary {
            color: var(--help);
            text-align: justify;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-bottom: 1rem;
        }

        &__meta {
            color: var(--help);

            span {
                margin-right: 1rem;
            }
        }

        &__subheading {
            font-family: Monaco, monospace;
            font-size: 1.5rem;
            font-weight: 600;
            font-style: italic;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        &__sub-subheading {
            font-family: Monaco, monospace;
            font-size: 1.25rem;
            padding-left: 1rem;
            margin-top: 1rem;
            margin-bottom: .5rem;
        }

        &__paragraph {
            text-indent: 1rem;
        }

        &__listarray {
            list-style-type: '—';
            list-style-position: outside;
            text-align: left;
            margin-top: 1rem;
            margin-bottom: 1rem;
            &__item {
                margin-top: .5rem;
                margin-left: 1.75rem;
                padding-left: .5rem;
            }
        }
    }
</style>