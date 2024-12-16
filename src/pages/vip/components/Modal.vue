<template>
    <popup class="popup">
        <div :class="['modal', type && 'big']">
            <div class="title">{{ $t('tips') }}</div>

            <div v-if="type" class="content">
                {{ $t('tips_2', [info.diamond]) }}
                <p v-if="type && language === 'ar'">{{ $t('tips_2_one') }}</p>
            </div>
            <p v-else class="content">{{ $t('tips_1', [info.diamond, info.day]) }}</p>

            <div class="btn-list">
                <div class="btn" @click="cancel">{{ $t('Cancel') }}</div>
                <div class="btn confirm" @click="confirm">{{ $t('Confirm') }}</div>
            </div>
        </div>
    </popup>
</template>
<script setup>
import popup from '@/components/common/pop_up.vue';
import { computed, defineEmits, defineProps } from 'vue';
import { getLanguage } from '../../../lib/device';
const emit = defineEmits(['confirm', 'cancel']);
let cancel = () => {
    emit('cancel');
};
let confirm = () => {
    emit('confirm');
};

// 获取国家
let language = computed(() => {
    let locale = getLanguage() || 'en';
    if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
        let localEnum = {
            'zh-hk': 'zh-tw',
            'zh-tw': 'zh-tw',
            'zh-mo': 'zh-tw',
            'zh-cn': 'zh-cn',
            zh_cn: 'zh-cn',
        };

        locale = localEnum[locale];
    }
    return locale;
});

const props = defineProps({
    type: {
        type: Boolean,
        default: false,
    },
    content: {
        type: String,
        default: '',
    },
    info: {
        type: Object,
        default: () => {},
    },
});
</script>

<style lang="less" scoped>
.popup {
    display: flex;
    justify-content: center;
    align-items: center;
    .modal {
        width: 5.7rem;
        height: 4.02rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/86c21bdca63df5e54cdb73f360cbe4bf.png);
        padding-bottom: 1.48rem;
        padding-top: 0.5rem;
        position: relative;
        &.big {
            height: 4.39rem;
            background-image: url(https://yaame-static.yaame.io/admin/8fa5baa0b1b15260e58e194a07426cd9.png);
        }

        .btn-list {
            width: 5.7rem;
            height: 0.88rem;
            position: absolute;
            left: 0;
            bottom: 0.6rem;
            padding: 0 0.5rem;
            display: flex;
            justify-content: space-between;
            .btn {
                width: 2.2rem;
                height: 0.88rem;
                text-align: center;
                line-height: 0.88rem;
                font-size: 0.3rem;
                font-weight: 600;
                color: #ffead0;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/e6182ee7956b6da108e9d2f2a5df73df.png);
                &.confirm {
                    background-image: url(https://yaame-static.yaame.io/admin/60ec4456f6a110f2b3f6c2f1e88da92b.png);
                    color: #473219;
                }
            }
        }
        .title {
            display: inline-block;
            min-width: 1.9rem;
            padding: 0 0.2rem;
            text-align: center;
            font-size: 0.28rem;
            font-weight: 600;
            color: #ffbd52;
            position: absolute;
            left: 50%;
            top: 0.26rem;
            transform: translate(-50%, -0%);
            &::after {
                content: '';
                position: absolute;
                bottom: 0.1rem;
                left: -1.63rem;
                width: 1.63rem;
                height: 0.2rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/7ca27b5df898eff09eabb9631bc3f542.png);
                color: #ffbd52;
            }
            &::before {
                content: '';
                position: absolute;
                bottom: 0.1rem;
                right: -1.63rem;
                width: 1.63rem;
                height: 0.2rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/d8dd25833cf5f0018bb28b3d577401a4.png);
                color: #ffbd52;
            }
        }
        .content {
            margin-top: 0.67rem;
            width: 4.9rem;
            margin-left: 0.5rem;
            font-size: 0.26rem;
            font-weight: 400;
            color: #ffeec9;
            text-align: center;
        }
    }
}
</style>
