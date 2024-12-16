<template>
    <div :style="{width:width,height:width}" :class="['avatar--' + type]" class="avatar">
        <img :style="{width:width,height:width}" :src="url" class="avatar-img">
    </div>
</template>

<script>
    /**
     * 标签
     * url: 必填，头像URL，
     * sex: 非必填，1男 0女，
     * type：非必填，默认为圆形，circle： 圆形， square：方形
     * size：非必填，头像大小，默认 80
     */
   
    export default {
        name: 'Avatar',
        props: {
            url: {
                type: String,
                default: ''
            },
            sex: {
                type: Number,
                default: -1,
            },
            type: {
                type: String,
                default: 'circle'
            },
            size: {
                type: Number,
                default: 80
            },
        },
        data () {
            return {
            };
        },
        computed: {
            width() {
                return this.size / 100 + 'rem';
            },
        }
    };
</script>

<style scoped>
    .avatar--circle{
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar-img{
        object-fit: cover;
    }
</style>