<template>
    <div :style="{top: safe_height}" class="back-icon" @click="back">
        <img :src="img_url" alt="">
    </div>
</template>
<script>
    import { getSafeHeight } from '../../lib/device';
    export default {
        props: {
            color: {
                type: String,
                default: 'blank'
            }
        },
        data() {
            return {
                safe_height: 0,
            };
        },
        computed: {
            img_url() {
                if (this.color === 'white') {
                    return 'http://imgcom.static.suishenyun.net/h5/bfb44399-353f-4b1e-99c1-4073b88e0760.png';
                }
                return 'http://imgcom.static.suishenyun.net/icon_jiantou@3x-4c9a88.png';
            }
        },
        mounted() {
            const safe_area = getSafeHeight() || 0;
            this.safe_height = safe_area * 2 / 100 + 0.23 + 'rem';
        },
        methods: {
            back() {
                location.href = 'wlyaame://webview/back';
            }
        },
    };
</script>
<style scoped>
    .back-icon{
        position: fixed;
        width: 0.48rem;
        height: 0.48rem;
        left: 0.4rem;
        z-index: 99;
    }
    .back-icon img {
        width: 0.48rem;
        height: 0.48rem;
    }
</style>