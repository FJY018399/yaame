<template>
        <div :style="{color:color,fontSize:font_size,lineHeight:line_height}" :class="{'border':border,'fixed':fixed}" class="title">
            <!-- <div class="content">{{ title }}</div> -->
            <div class="content">{{ title }}</div>
            <div v-if="extend!==''" class="extend" @click="handleClickExtend">{{ extend }}</div>
        </div>
    </template>

<script>
    /**
     * 全屏页面下标题组件
     * color:文字颜色，默认白色
     * title：必填，标题内容
     * extend：标题右侧按钮文字，最多支持4个字符
     * extendClick：点击回调
     */
    export default {
        name: 'Title',
        props: {
            title: {
                type: String,
                require: true,
                default: ''
            },
            color: {
                type: String,
                require: false,
                default: '#fff'
            },
            font_size: {
                type: String,
                require: false,
                default: '0.32rem'
            },
            line_height: {
                type: String,
                require: false,
                default: '0.9rem'
            },
            border: {
                type: Boolean,
                require: false,
                default: true,
            },
            fixed: {
                type: Boolean,
                require: false,
                default: false,
            },
            extend: {
                type: String,
                require: false,
                default: ''
            }
        },
        methods: {
            handleClickExtend() {
                this.$emit('extend_callback');
            }
        }
    };
</script>

<style scoped>
    .title {
        width: 100%;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        background-color: #fff;
    }
    .border{
        border-bottom: 1px solid #f5f5f5;
    }
    .fixed {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
    }
    .content {
        width: 4.2rem;
        margin: 0 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #333;
        font-size: 0.34rem;
        font-weight: bold;
    }
    .extend {
        width: 1.4rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.32rem;
        position: absolute;
        right: .3rem;
        top: 0;
        color: #393939;
        text-align: right;
    }
</style>