<template>
    <div class="cta">
        <div class="cta__header">
            <slot name="header"></slot>
        </div>
        <div class="cta__body">
            <slot name="body"></slot>
        </div>
        <div class="cta__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CallToAction'
}
</script>

<style lang="scss">
    .cta {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: $white;
        border-radius: .75rem;
        min-height: 20ch;
        max-width: 60ch;
        margin-left: 5%;
        margin-right: 5%;
        padding: 5%;
        box-shadow: $card-shadow rgba($black, 0.2);
        margin-bottom: -5rem;
        z-index: 1;

        background: hsla(33, 100%, 96%, 1);
        background: radial-gradient(circle, hsla(33, 100%, 96%, 1) 22%, hsla(345, 33%, 93%, 1) 72%, hsla(323, 28%, 91%, 1) 100%);
        
        // background: radial-gradient(circle, hsla(33, 100%, 96%, 1) 0%, hsla(345, 33%, 93%, 1) 41%, hsla(300, 24%, 89%, 1) 100%);
        // background: radial-gradient(circle, hsla(345, 33%, 93%, 1) 41%, hsla(33, 100%, 96%, 1) 100%, hsla(300, 24%, 89%, 1) 100%);
        // background: linear-gradient(90deg, hsla(33, 100%, 96%, 1) 0%, hsla(345, 33%, 93%, 1) 41%, hsla(300, 24%, 89%, 1) 100%);
        // background: linear-gradient(90deg, hsla(33, 100%, 96%, 1) 0%, hsla(345, 33%, 93%, 1) 33%, hsla(300, 24%, 89%, 1) 65%, hsla(271, 44%, 83%, 1) 100%);

        &__header {

            h2 {
                font-family: Monaco, monospace;
                font-size: 1.75rem;
                font-weight: 600;
                line-height: 100%;
                text-align: left;
                margin-top: 1rem;
                margin-bottom: 1rem;
            }
        }

        &__body {
            align-self: flex-start;
            margin-top: 1rem;
            margin-bottom: 1rem;

            &__list {
                list-style-type: '—';
                list-style-position: outside;
                text-align: left;

                &__item {
                    margin-left: .75rem;
                    padding-left: .5rem;
                }
            }
        }

        &__footer {
            align-self: flex-start;
            display: flex;
            flex-direction: column;


            &__button {
                margin: .5rem auto;
                padding: .75em 2.5em;
                text-transform: uppercase;
                font-size: $mobile-body;
                letter-spacing: .05rem;
                font-weight: bold;
                border-radius: $radius-action-button;
                color: $white;
                background-color: $accent;
                -webkit-tap-highlight-color: transparent;
            }

            &__link {
                display: flex;
                align-items: center;
                margin-top:.5rem;
                color: rgba($black, .7);

                &:hover {
                    color: $black;
                    text-decoration: underline;
                }

                &__text {
                    font-size: $mobile-help;
                }

                &__append {
                    margin-left: .5rem;
                    padding-top: .125rem;
                    height: $mobile-body;
                    width: $mobile-body;
                }
            }
        }
    }
</style>