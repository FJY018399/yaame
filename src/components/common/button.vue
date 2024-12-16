<template>
    <button 
        :class="[
            'common-button--' + type,
            {'is-disabled': disabled,'is-plain': plain,'is-bold': bold, 'has-shadow': shadow}
        ]"
        :style="{width:width_rem,height:height_rem,borderRadius:radius_rem,fontSize:font_rem}"
        :disabled="disabled" 
        :type="nativeType" 
        class="common-button" 
        @click="handleClick"
    >
        <span v-if="icon || $slots.icon" class="common-button-icon">
            <slot name="icon">
                <i v-if="icon" :class="'commonui-' + icon" class="commonui"></i>
            </slot>
        </span>
        <label class="common-button-text">
            <slot></slot>
        </label>
    </button>
</template>

<script>
    /**
     * @module components/button
     * @desc 按钮
     * @param {string} [type=default] - 显示类型，接受 default, primary, danger, sweet
     * @param {boolean} [disabled=false] - 禁用
     * @param {boolean} [plain=true] - 幽灵按钮
     * @param {number} [font=10] - 按钮字体大小
     * @param {boolean} [bold=true] - 按钮文案加粗
     * @param {number} [width=100] - 按钮宽度
     * @param {number} [height=100] - 按钮高度
     * @param {number} [radius=10] - 按钮圆角度数
     * @param {string} [native-type] - 原生 type 属性
     * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .mintui-xxx）
     * @param {slot} - 显示文本
     * @param {slot} [icon] 显示图标
     *
     * @example
     * <button size="large" icon="back" type="primary">按钮</button>
     */
    export default {
        name: 'Button',
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
                default: false
            },
            bold: {
                type: Boolean,
                default: false
            },
            shadow: {
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
                        'primary',
                        'sweet'
                    ].indexOf(value) > -1;
                }
            },
            width: {
                type: Number,
                default: 80
            },
            height: {
                type: Number,
                default: 40
            },
            radius: {
                type: Number,
                default: 0
            },
            font: {
                type: Number,
                default: 0
            },
        },
        computed: {
            width_rem() {
                return this.width / 100 + 'rem';
            },
            height_rem() {
                return this.height / 100 + 'rem';
            },
            radius_rem() {
                return this.radius / 100 + 'rem';
            },
            font_rem() {
                return this.font / 100 + 'rem';
            },
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        },
    };
</script>

<style>
    .common-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 0;
        box-sizing: border-box;
        color: inherit;
        display: block;
        outline: 0;
        overflow: hidden;
        position: relative;
        text-align: center
    }

    .common-button::after {
        background-color: #fff;
        content: " ";
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute;
    }

    .common-button:not(.is-disabled):active::after {
        opacity: .4
    }

    .common-button.is-disabled {
        opacity: .6
    }

    .common-button.has-shadow {
        box-shadow: 0 0 .12rem 0 rgba(255,48,146, 0.3);
    }

    .common-button.is-bold {
        font-weight: bold;
    }

    .common-button-icon {
        vertical-align: middle;
        display: inline-block
    }

    .common-button--default {
        color: #ffffff;
        background: linear-gradient(90deg, #FE3E7F 0%, #FE47BC 100%);
    }
    .common-button--sweet {
        color: #ffffff;
        background: linear-gradient(90deg, #07CEF4 0%, #1DD4D6 100%);
    }
    .common-button--default.is-plain {
        border: 1px solid #5a5a5a;
        background-color: transparent;
        box-shadow: none;
        color: #5a5a5a
    }

    .common-button--primary {
        color: #999999;
        background-color: #EDEDED;
    }

    .common-button--primary.is-plain {
        border: 1px solid #26a2ff;
        background-color: transparent;
        color: #26a2ff
    }

    .common-button--danger {
        color: #fff;
        background-color: #ef4f4f
    }

    .common-button--danger.is-plain {
        border: 1px solid #ef4f4f;
        background-color: transparent;
        color: #ef4f4f
    }

    /* .common-button--large {
        display: block;
        width: 100%
    }

    .common-button--normal {
        display: inline-block;
        padding: 0 12px
    }

    .common-button--small {
        display: inline-block;
        font-size: 14px;
        padding: 0 12px;
        height: 33px
    } */
</style>