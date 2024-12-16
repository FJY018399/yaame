<template>
    <div v-show="value" class="pop-fixed" @click.stop="handleClose">
        <div class="container bounceIn">
            <p class="title">{{ title }}</p>
            <div class="content">
                {{ content }}
            </div>
            <div class="bottom">
                <common-button :width="190" :height="88" :radius="44" :font="30" :shadow="false" class="btn" type="primary" bold @click.stop="handleConfirm">
                    {{ confirm_text }}
                </common-button>
                <common-button :width="190" :height="88" :radius="44" :font="30" class="btn" bold @click.stop="handleCancle">
                    {{ cancle_text }}
                </common-button>
            </div>
        </div>
    </div>
</template>

<script>
    import commonButton from './button.vue';
    export default {
        name: 'Confirm',
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
                default: '提示'
            },
            value: {
                type: Boolean,
                default: false
            },
            cancle_text: {
                type: String,
                default: '取消',
            },
            confirm_text: {
                type: String,
                default: '确认',
            }
        },
        data() {
            return {
            };
        },
        watch: {
        },
        methods: {
            handleClose(e) {
                if (e.currentTarget === e.target) {
                    this.$emit('close');
                }
            },
            handleCancle() {
                this.$emit('cancleCallback');
            },
            handleConfirm() {
                this.$emit('confirmCallback');
            },
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
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 999;
    }
    .container{
        position: absolute;
        background: #fff;
        width: 5.3rem;
        min-height: 3rem;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        border-radius: .24rem;
        padding: .6rem;
    }
    .content{
        text-align: center;
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
   
    .bottom{
        width: 100%;
        height: 1rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .bounceIn {
        animation-duration: 0.25s;
        animation-name: zoomIn;
    }
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) scale3d(0.3, 0.3, 0.3);
        }
        70% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale3d(1.1, 1.1, 1.1);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale3d(1, 1, 1);
        }
    }

    
    
</style>