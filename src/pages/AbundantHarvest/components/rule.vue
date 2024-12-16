<template>
    <popup class="popup" v-show="showRule" @cancel="popupShow('showRule')">
        <div class="rule">
            <div class="head">{{ $t('rule') }}</div>
            <p>
                <span>{{ $t('activity_time') }}</span><br />
                {{ $t('activity_period') }}<br />
                <span>{{ $t('activity_description') }}</span><br />
                {{ $t('rule2') }}<br />
                  {{ $t('rule2_1') }}<br />
                  {{ $t('rule2_2') }}<br />
                  {{ $t('rule2_3') }}<br />
                {{ $t('rule3') }}<br />
                  {{ $t('rule3_1') }}<br />
                  {{ $t('rule3_2') }}<br />
                  {{ $t('rule3_3') }}<br />
                {{ $t('diamondsRule4') }}<br />
                {{ $t('diamondsRule5') }}<br />
                {{ $t('diamondsRule6') }}<br />
            </p>
        </div>
        <div class="close" @click="popupShow"></div>
    </popup>
</template>

<script setup>
import popup from "@/components/common/pop_up.vue";
import {ref} from "vue";

const props = defineProps({
    showRule: {
        type: Boolean,
        default: false,
    }
});
let showRule = ref(props.showRule);

const popupShow = () => {
    showRule.value = !showRule.value;
}

defineExpose({
    popupShow // 打开规则弹窗方法
})
</script>

<style lang="less" scoped>
.rule {
    position: relative;
    width: 6.43rem;
    height: 7.72rem;
    margin: 2.4rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/e06f83e05fc62452162c2c766e0ea71e.png") no-repeat;
    background-size: contain;

    .head {
        position: absolute;
        top: .47rem;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 600;
        font-size: .42rem;
        color: #854015;
    }

    p {
        position: absolute;
        top: 1.59rem;
        left: 50%;
        width: 5.9rem;
        height: 4.68rem;
        padding: 0 .27rem;
        transform: translateX(-50%);
        overflow-y: auto;
        font-size: .26rem;
        color: #B46223;
        span {
            font-weight: 600;
        }
    }
    p::-webkit-scrollbar {
        width: .1rem; /* 竖直滚动条的宽度 */
        height: .96rem; /* 水平滚动条的高度 */
    }

    /* 滚动条的轨道 */
    p::-webkit-scrollbar-track {
        border-radius: .05rem; /* 圆角 */
    }

    /* 滚动条滑块 */
    p::-webkit-scrollbar-thumb {
        background: #E69552; /* 滚动条滑块的颜色 */
        border-radius: .05rem; /* 圆角 */
    }

    /* 滚动条滑块在悬停时 */
    p::-webkit-scrollbar-thumb:hover {
        background: #E69552; /* 悬停时滑块的颜色 */
    }
}
.close {
    width: .5rem;
    height: .5rem;
    margin: .7rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/6a4e031fdcf17cc4c331feb2e67a58eb.png") no-repeat;
    background-size: contain;
}
</style>
