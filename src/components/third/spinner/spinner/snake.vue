<template>
    <div :style="{'border-top-color': spinnerColor,'border-left-color': spinnerColor,'border-bottom-color': spinnerColor,'height': spinnerSize,'width': spinnerSize}"
        class="kebab-spinner-snake">
    </div>
</template>

<script>
    import common from './common.vue';

    export default {
        name: 'Snake',
        mixins: [common]
    };
</script>

<style>
    .kebab-spinner-snake {
        animation: kebab-spinner-rotate 0.8s infinite linear;
        border: 4px solid transparent;
        border-radius: 50%;
    }

    @keyframes kebab-spinner-rotate {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>