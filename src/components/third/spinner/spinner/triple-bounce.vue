<template>
    <div class="kebab-spinner-triple-bounce">
        <div :style="bounceStyle" class="kebab-spinner-triple-bounce-bounce1"></div>
        <div :style="bounceStyle" class="kebab-spinner-triple-bounce-bounce2"></div>
        <div :style="bounceStyle" class="kebab-spinner-triple-bounce-bounce3"></div>
    </div>
</template>

<script>
    import common from './common.vue';

    export default {
        name: 'TripleBounce',

        mixins: [common],

        computed: {
            spinnerSize() {
                return ((this.size || this.$parent.size || 28) / 3) + 'px';
            },

            bounceStyle() {
                return {
                    width: this.spinnerSize,
                    height: this.spinnerSize,
                    backgroundColor: this.spinnerColor
                };
            }
        }
    };
</script>