<template>
    <button :class="['mint-button--' + type, 'mint-button--' + size, {'is-disabled': disabled,'is-plain': plain}]"
        :disabled="disabled" :type="nativeType" class="mint-button" @click="handleClick">
        <span v-if="icon || $slots.icon" class="mint-button-icon">
            <slot name="icon">
                <i v-if="icon" :class="'mintui-' + icon" class="mintui"></i>
            </slot>
        </span>
        <label class="mint-button-text">
            <slot></slot>
        </label>
    </button>
</template>

<script>
    /**
     * mt-header
     * @module components/button
     * @desc 按钮
     * @param {string} [type=default] - 显示类型，接受 default, primary, danger
     * @param {boolean} [disabled=false] - 禁用
     * @param {boolean} [plain=false] - 幽灵按钮
     * @param {string} [size=normal] - 尺寸，接受 normal, small, large
     * @param {string} [native-type] - 原生 type 属性
     * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .mintui-xxx）
     * @param {slot} - 显示文本
     * @param {slot} [icon] 显示图标
     *
     * @example
     * <mt-button size="large" icon="back" type="primary">按钮</mt-button>
     */
    export default {
        name: 'MtButton',
        props: {
            icon: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            nativeType: {
                type: String,
                default: ''
            },
            plain: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                default: 'default',
                validator(value) {
                    return [
                        'default',
                        'danger',
                        'primary'
                    ].indexOf(value) > -1;
                }
            },
            size: {
                type: String,
                default: 'normal',
                validator(value) {
                    return [
                        'small',
                        'normal',
                        'large'
                    ].indexOf(value) > -1;
                }
            }
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        },
    };
</script>

<style>
    .mint-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 4px;
        border: 0;
        box-sizing: border-box;
        color: inherit;
        display: block;
        font-size: 18px;
        height: 41px;
        outline: 0;
        overflow: hidden;
        position: relative;
        text-align: center
    }

    .mint-button::after {
        background-color: #000;
        content: " ";
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute
    }

    .mint-button:not(.is-disabled):active::after {
        opacity: .4
    }

    .mint-button.is-disabled {
        opacity: .6
    }

    .mint-button-icon {
        vertical-align: middle;
        display: inline-block
    }

    .mint-button--default {
        color: #656b79;
        background-color: #f6f8fa;
        box-shadow: 0 0 1px #b8bbbf
    }

    .mint-button--default.is-plain {
        border: 1px solid #5a5a5a;
        background-color: transparent;
        box-shadow: none;
        color: #5a5a5a
    }

    .mint-button--primary {
        color: #fff;
        background-color: #26a2ff
    }

    .mint-button--primary.is-plain {
        border: 1px solid #26a2ff;
        background-color: transparent;
        color: #26a2ff
    }

    .mint-button--danger {
        color: #fff;
        background-color: #ef4f4f
    }

    .mint-button--danger.is-plain {
        border: 1px solid #ef4f4f;
        background-color: transparent;
        color: #ef4f4f
    }

    .mint-button--large {
        display: block;
        width: 100%
    }

    .mint-button--normal {
        display: inline-block;
        padding: 0 12px
    }

    .mint-button--small {
        display: inline-block;
        font-size: 14px;
        padding: 0 12px;
        height: 33px
    }
</style>