<template>
    <div>
        <AsyncErrorFetchingData>
            <template #title>
            Ooops &#128533;
            </template>

            <template #text>
            {{ pageNotFoundText }}
            </template>

            <template #action>
                <button class="error__page__btn error__page__btn--action">
                    <router-link :to="{ name: 'Home' }">Back to Home</router-link>
                </button>
            </template>
        </AsyncErrorFetchingData>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pageNotFoundText: 'We could not find the page you requested.',
        }
    }
}
</script>