<template>
    <div :style="{width: spinnerSize,height: spinnerSize}" :class="['mint-spinner-fading-circle circle-color-' + _uid]"
        class="kebab-spinner-fading-circle">
        <div v-for="(n,index) in 12" :key="index" :class="['is-circle' + (n + 1)]"
            class="mint-spinner-fading-circle-circle"></div>
    </div>
</template>

<script>
    import common from './common.vue';

    export default {
        name: 'FadingCircle',
        mixins: [common],
        created() {
            if (this.$isServer) return;
            this.styleNode = document.createElement('style');
            const css = `.circle-color-${this._uid} > div::before { background-color: ${this.spinnerColor}; }`;

            this.styleNode.type = 'text/css';
            this.styleNode.rel = 'stylesheet';
            this.styleNode.title = 'fading circle style';
            document.getElementsByTagName('head')[0].appendChild(this.styleNode);
            this.styleNode.appendChild(document.createTextNode(css));
        },

        destroyed() {
            if (this.styleNode) {
                this.styleNode.parentNode.removeChild(this.styleNode);
            }
        }
    };
</script>