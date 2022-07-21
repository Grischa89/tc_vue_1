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
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        &__sub-subheading {
            font-family: Monaco, monospace;
            font-size: 1.25rem;
            font-style: italic;
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

        &__table {
            display: flex;
            flex-direction: column;
            margin: .5rem auto;
            border-radius: .75rem;
            border: .0625rem solid var(--border);
            width: 100%;
            max-width: 60ch;
            background-color: var(--surface2);

            @include tablet {
                box-shadow: 1px 1px 5px rgba($black, 0.2);
            }

            &__table {
                table-layout: fixed;
                font-size: $mobile-body;
                width: 100%;

                &__head {
                    border-bottom: .03125rem solid var(--divider);

                    &__row {
                        font-family: Monaco, monospace;
                        font-weight: bold;
                        letter-spacing: .075ch;
                        background-color: var(--surface4);

                        &__cell {
                            padding:1rem;
                            text-align: left;
                            text-transform: uppercase;
                            width: 50%;

                            &:first-of-type {
                            border-top-left-radius: .75rem;
                            }

                            &:last-of-type {
                            border-top-right-radius: .75rem;
                            }
                        }
                    }
                }

                &__body {

                    &__row {
                        border-bottom: .0625rem solid var(--divider);

                        &:hover {
                            background-color: var(--hover-surface);
                        }

                        &:last-of-type {
                            border: none;
                        }

                        &__cell {
                            text-align: left;
                            // white-space: nowrap;
                            padding-top: 1rem;
                            padding-bottom: 1rem;
                            padding-left: .75rem;
                            padding-right: 0;
                            cursor: pointer;
                        }
                    }

                    
                }

                // table,
                // td,
                // th {
                //     border-collapse: collapse;
                // }

            //     th,
            //     td {
            //         padding: 10px;
            //         border: solid 1px;
            //         text-align: center;
            //     }
            }
        }
    }
</style>