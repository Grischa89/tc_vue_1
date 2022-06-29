<template>
    <div class="cta-inline">
        <div class="cta-inline__body">
            <slot name="body"></slot>
        </div>
        <div class="cta-inline__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CallToActionInline',
}
</script>
<style lang="scss">
    .cta-inline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        border-radius: .75rem;
        min-height: 4ch;
        max-width: 80ch;
        margin-bottom: 2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border: .0625rem solid var(--divider);
        box-shadow: 1px 1px 5px rgba($black, 0.2);
        // box-shadow: $card-shadow rgba($black, 0.2);

        background: hsla(33, 100%, 96%, 1);
        background: var(--ctaInlineGradient);
        // HSLA linear-gradient(90deg, hsla(16, 56%, 95%, 1) 0%, hsla(345, 33%, 93%, 1) 72%, hsla(323, 28%, 91%, 1) 100%);
        // background: linear-gradient(90deg, hsla(33, 100%, 96%, 1) 0%, hsla(16, 56%, 95%, 1) 16%, hsla(345, 33%, 93%, 1) 78%, hsla(323, 28%, 91%, 1) 100%);

        @include tablet {
            padding-left: 2rem;
            padding-right: 2rem;
        }

        &__body {
            font-family: Monaco, monospace;
            font-size: $mobile-help;
            font-weight: 500;
            text-align: left;
            line-height: 150%;

            @include tablet {
                font-size: $mobile-body;
                line-height: 130%;
            }
        }

        &__footer {

            &__button {
                margin: .5rem auto;
                padding: .5rem 1.5rem;
                text-transform: uppercase;
                font-size: $mobile-body;
                letter-spacing: .05rem;
                font-weight: bold;
                border-radius: $radius-action-button;
                color: var(--textInverse);
                background-color: var(--accent);
                -webkit-tap-highlight-color: transparent;
                white-space: nowrap;
            }
        }
    }
</style>