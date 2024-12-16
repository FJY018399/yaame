<!--
 * @Author: Elk
 * @Date: 2024-05-22 11:49:46
 * @FilePath: /yaame-h5/src/pages/AbundantHarvest/components/treeRule.vue
 * @Description: 
-->
<template>
    <popup class="popup"  @cancel="popupShow()">
        <div class="rule">
            <div class="head">{{ $t('rule') }}</div>
            <p>
                <slot name="default"></slot>
            </p>
            <img class="close-img" src="https://yaame-static.yaame.io/admin/a1e88520a770dec837c6121dff417941.png" alt="" @click="popupShow()">
        </div>
    </popup>
</template>

<script setup>
import popup from "@/components/common/pop_up.vue";
const emits = defineEmits(["close"]);
const popupShow = () => {
    emits('close'); 
};
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
    .close-img {
            position: absolute;
            left: 2.96rem;
            bottom: -0.7rem;
            width: 0.5rem;
            height: 0.5rem;
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
</style>
