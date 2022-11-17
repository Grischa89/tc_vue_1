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
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial, Helvetica, sans-serif;
        font-size: $mobile-body;
        text-align: left;
        width: min(100%, 40rem);
        margin-left: auto;
        margin-right: auto;

        &__section {
            width: 100%;
            margin-top: 1rem;
            margin-bottom: 1rem;

            &__heading {
                font-family: Monaco, monospace;
                font-size: 2rem;
                font-weight: bold;
                letter-spacing: .0875rem;
                line-height: 120%;
                text-align: left;
            }

            &__image {
                position: relative;
                height: 300px;
                width: 100%;
                object-fit: cover;
                border-radius: .25rem;

                &--nonTitleImage {
                    object-fit: contain;
                    height: auto;
                    width: 100%;
                    margin-bottom: .25rem;
                }

                // optional overlay
                // &::before {
                //     content: '';
                //     position: absolute;
                //     top: 0;
                //     left: 0;
                //     height: 100%;
                //     width: 100%;
                //     background-color: #252323;
                //     opacity: .2;        
                // }

                &__caption {
                    font-size: $mobile-help;
                    font-style: italic;
                    line-height: 110%;
                }
            }

            &__imageContainer {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
                width: min(95%, 400px);
            }

            &__listarray {
                display: grid;
                gap: .5rem;
                list-style-type: disc;
                margin-top: .5rem;

                &__item {
                    margin-left: 5%;
                    padding-left: .5rem;
                }
            }

            &__paragraph {
                text-indent: 1rem;
            }

            &__subheading {
                font-family: Monaco, monospace;
                font-size: 1.5rem;
                font-weight: bold;
            }

            &__sub-subheading {
                font-family: Monaco, monospace;
                font-size: 1.25rem;
            }

            &__summary {
                color: var(--help);
                padding-left: 5%;
                padding-right: 5%;
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
                            }
                        }
                    }
                }
            }
        }

        &__meta {
            color: var(--help);

            span {
                margin-right: 1rem;
            }
        }
    }
</style>