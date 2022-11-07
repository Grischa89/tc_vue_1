<template>
    <div class="notification">

        <div class="notification__main">
            <slot name="text"></slot>
            <slot name="action"></slot>
        </div>

        <div class="notification__close">
            <button
                @click="$emit('onClose')" class="notification__close__button" type="button">
                <IconXMark class="notification__close__button__icon"/>
            </button>
        </div>

    </div>
</template>

<script>
import IconXMark from './icons/IconXMark.vue';

export default {
    name: "NotificationBottom",
    components: { IconXMark },
    emits: ['onClose']
}
</script>

<style lang="scss">
.notification {
    display: flex;
    justify-content: space-between;
    background-color: var(--backgroundInverse);
    color: var(--textInverse);
    position: sticky;
    bottom: 16px;
    padding: .5rem .75rem;
    border-radius: .25rem;
    margin: .5rem;
    max-width: fit-content;

    &__main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 1.5rem;

        &__text {
            font-weight: 500;
            padding-top: .25rem;
            padding-bottom: .25rem;
            margin-right: .75rem;
        }

        &__button {
            color: var(--infoInverse);
            font-weight: bold;
            letter-spacing: .025rem;
            text-transform: uppercase;
            padding-top: .25rem;
            padding-bottom: .25rem;
        }
    }

    &__close {
        padding-top: .25rem;
        padding-bottom: .25rem;

        &__button {
            vertical-align: middle;

            &__icon {
                height: 1.25rem;
                width: 1.25rem;
            }
        }
    }
}
</style>