<template>
    <div :style="{color:color,backgroundColor:bg_color}" class="tag">
        {{ content }}
    </div>
</template>

<script>
    /**
     * 标签
     * color:文字颜色，默认白色
     * content：必填，标题内容
     * bg_color: 必填，背景色
     */
    export default {
        name: 'Tag',
        props: {
            content: {
                type: String,
                require: true,
                default: ''
            },
            color: {
                type: String,
                require: false,
                default: '#fff'
            },
            bg_color: {
                type: String,
                require: true,
                default: '#fff'
            }
        }
    };
</script>

<style scoped>
    .tag {
        display: inline-block;
        font-size: 0.22rem;
        line-height: .3rem;
        padding: .02rem .08rem;
        border-radius: .06rem;
    }
</style>