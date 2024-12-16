<template>
    <div :style="{width: spinnerSize,height: spinnerSize}" class="kebab-spinner-double-bounce">
        <div :style="{ backgroundColor: spinnerColor }" class="kebab-spinner-double-bounce-bounce1"></div>
        <div :style="{ backgroundColor: spinnerColor }" class="kebab-spinner-double-bounce-bounce2"></div>
    </div>
</template>

<script>
    import common from './common.vue';

    export default {
        name: 'DoubleBounce',
        mixins: [common]
    };
</script>