<template>
    <div class="pop-fixed">
        <div :style="modal_style" class="modal">
            <img v-if="show_close" class="close-btn" src="https://imgcom-static.suishenyun.net/maybe/2467ce17-f698-4167-ba04-92d3808bb221.png" @click="close">
            <p v-if="title" :style="title_style" class="title" v-html="title"></p>
            <slot v-else name="title" />
            <div v-if="content" class="content">{{ content }}</div>
            <slot v-else name="content" />
            <common-button v-if="btn_text" :width="380" :height="100" :radius="60" :font="30" :style="btn_style" class="btn" bold @click="submit">
                {{ btn_text }}
            </common-button>
            <slot v-else name="button" />
        </div>
    </div>
</template>
<script>
    import commonButton from './button.vue';
    export default {
        components: {
            commonButton
        },
        props: {
            title: {
                type: String,
                default: '提示'
            },
            content: {
                type: String,
                default: ''
            },
            can_close: {
                type: Boolean,
                default: true,
            },
            show_close: {
                type: Boolean,
                default: true,
            },
            btn_text: {
                type: String,
                default: '确定'
            },
            btn_style: {
                type: Object,
                default: () => {}
            },
            modal_style: {
                type: Object,
                default: () => {}
            },
            title_style: {
                type: Object,
                default: () => {}
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            submit() {
                this.$emit('submit');
            }
        },
    };
</script>
<style scoped>
    .pop-fixed {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
    }
    .modal {
        width: 5.9rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 0.16rem;
        padding: 0.6rem 0.8rem;
    }
    .close-btn{
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        right: 0.3rem;
        top: 0.3rem;
        z-index: 99;
    }
    .title {
        font-size: 0.34rem;
        line-height: 0.5rem;
        color: #333333;
        letter-spacing: 1px;
        text-align: center;
        font-weight: bold;
    }
    .content {
        color: #666;
        font-size: 0.28rem;
        line-height: 0.36rem;
        text-align: center;
        padding: 0.18rem 0 0.6rem;
    }
    .btn {
        margin: 0 auto;
    }
</style>