<template>
    <div :style="{paddingTop: is_pop ? '1rem': '0', backgroundColor: is_pop ? 'transparent': '#fff'}" class="page-container">
        <slot />
    </div>
</template>
<script>
    import { getQueryString } from '../../lib/utils.js';
    export default {
        data() {
            return {
                is_pop: getQueryString('popup') === '1',
            };
        },
    };
</script>
<style scoped>
    .page-container {
        min-height: 100vh;
    }
</style>