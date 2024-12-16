<template>
    <x-cell v-clickoutside="doCloseActive" :title="label"
        :class="[{'is-textarea': type === 'textarea','is-nolabel': !label}]" class="mint-field">
        <textarea v-if="type === 'textarea'" ref="textarea" :placeholder="placeholder" :rows="rows" :disabled="disabled"
            :readonly="readonly" v-model="currentValue" class="mint-field-core" @change="$emit('change', currentValue)">
            </textarea>
        <input v-else ref="input" :placeholder="placeholder" :number="type === 'number'" :type="type"
            :disabled="disabled" :readonly="readonly" :value="currentValue" class="mint-field-core"
            @focus="active = true" @input="handleInput" @change="$emit('change', currentValue)">
        <div v-if="!disableClear" v-show="currentValue && type !== 'textarea' && active" class="mint-field-clear"
            @click="handleClear">
            <i class="mintui mintui-field-error"></i>
        </div>
        <span v-if="state" :class="['is-' + state]" class="mint-field-state">
            <i :class="['mintui-field-' + state]" class="mintui"></i>
        </span>
        <div class="mint-field-other">
            <slot></slot>
        </div>
    </x-cell>
</template>

<script>
    import XCell from './../cell/cell.vue';
    import Clickoutside from './clickoutside.js';

    /**
     * mt-field
     * @desc 编辑器，依赖 cell
     * @module components/field
     *
     * @param {string} [type=text] - field 类型，接受 text, textarea 等
     * @param {string} [label] - 标签
     * @param {string} [rows] - textarea 的 rows
     * @param {string} [placeholder] - placeholder
     * @param {string} [disabled] - disabled
     * @param {string} [readonly] - readonly
     * @param {string} [state] - 表单校验状态样式，接受 error, warning, success
     *
     * @example
     * <mt-field v-model="value" label="用户名"></mt-field>
     * <mt-field v-model="value" label="密码" placeholder="请输入密码"></mt-field>
     * <mt-field v-model="value" label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></mt-field>
     * <mt-field v-model="value" label="邮箱" placeholder="成功状态" state="success"></mt-field>
     */
    export default {
        name: 'MtField',
        components: { XCell },
        directives: {
            Clickoutside
        },
        props: {
            type: {
                type: String,
                default: 'text'
            },
            rows: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            disableClear: {
                type: Boolean,
                default: false
            },
            state: {
                type: String,
                default: 'default'
            },
            value: {
                type: [String, Object],
                default: () => ({})
            },
            attr: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                active: false,
                currentValue: this.value
            };
        },
        watch: {
            value(val) {
                this.currentValue = val;
            },

            currentValue(val) {
                this.$emit('input', val);
            },

            attr: {
                immediate: true,
                handler(attrs) {
                    this.$nextTick(() => {
                        const target = [this.$refs.input, this.$refs.textarea];
                        target.forEach(el => {
                            if (!el || !attrs) return;
                            Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
                        });
                    });
                }
            }
        },
        methods: {
            doCloseActive() {
                this.active = false;
            },

            handleInput(evt) {
                this.currentValue = evt.target.value;
            },

            handleClear() {
                if (this.disabled || this.readonly) return;
                this.currentValue = '';
            }
        },
    };
</script>

<style>
    .mint-field {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .mint-field .mint-cell-title {
        width: 105px;
        -webkit-box-flex: 0;
        -ms-flex: none;
        flex: none;
    }

    .mint-field .mint-cell-value {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        color: inherit;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .mint-field.is-nolabel .mint-cell-title {
        display: none;
    }

    .mint-field.is-textarea {
        -webkit-box-align: inherit;
        -ms-flex-align: inherit;
        align-items: inherit;
    }

    .mint-field.is-textarea .mint-cell-title {
        padding: 10px 0;
    }

    .mint-field.is-textarea .mint-cell-value {
        padding: 5px 0;
    }

    .mint-field-core {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0;
        border: 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        outline: 0;
        line-height: 1.6;
        font-size: inherit;
        width: 100%;
    }

    .mint-field-clear {
        opacity: .2;
    }

    .mint-field-state {
        color: inherit;
        margin-left: 20px;
    }

    .mint-field-state .mintui {
        font-size: 20px;
    }

    .mint-field-state.is-default {
        margin-left: 0;
    }

    .mint-field-state.is-success {
        color: #4caf50;
    }

    .mint-field-state.is-warning {
        color: #ffc107;
    }

    .mint-field-state.is-error {
        color: #f44336;
    }

    .mint-field-other {
        top: 0;
        right: 0;
        position: relative;
    }
</style>