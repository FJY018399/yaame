<template>
    <div class="tab" ref="tabTop">
        <slot />
    </div>
</template>

<script setup>
    import { onBeforeUnmount, onMounted, ref, nextTick } from "vue";
    import { getSafeHeight } from "@/lib/device";

    const props = defineProps({
        // 原始距离顶部距离
        originalTop: {
            type: String,
            required: true,
        },
        // 设计稿要求距离
        designTop: {
            type: Number,
            default: 0,
        },
        // 通知父组件已经吸顶
        openTop: {
            type: Function,
            default: () => () => {},
        }
    });

    // 排行榜页面吸顶状态控制
    const tabStatus = ref(0);
    // tab吸顶
    let tabTop = ref(null);
    let safe_area = getSafeHeight() || 0;

    // 页面卷去高度
    const bodyTop = () => {
        if (!tabTop.value) return;
        // 获取动态的字体大小
        const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        // 算出屏幕到达的固定位置
        const targetPixeValue = document.documentElement.scrollTop / htmlSize;
        // (12.43 - (safe_area * 2) / 100) - 1.14  距离顶部距离-手机安全高度-设计稿要求距离+内容固定的0.88
        if (targetPixeValue >= (props.originalTop - (safe_area * 2) / 100) - (props.designTop + 0.88)) {
            props.openTop(1);
            // 设置吸顶位置
            tabTop.value.style.position = 'fixed';
            let safe_height = (safe_area * 2) / 100;
            tabTop.value.style.top = ((props.designTop + 0.88) + safe_height) + 'rem';
        } else if (targetPixeValue < (15.35 - (safe_area * 2) / 100) - (props.designTop + 0.88)) {
            props.openTop(0);
            tabTop.value.style.position = 'absolute';
            tabTop.value.style.top = `${props.originalTop}rem`;
        }
    };

    onMounted(() => {
        // 监听页面滚动事件
        window.addEventListener('scroll', bodyTop);
        nextTick(() => {
            // 给定默认定位
            tabTop.value.style.position = 'absolute';
            tabTop.value.style.top = `${props.originalTop}rem`;
        })
    })
    onBeforeUnmount(() => {
        // 删除监听
        window.removeEventListener('scroll', bodyTop);
    })
</script>

<style lang="less" scoped>
.tab {
    position: absolute;
    z-index: 10;
}
</style>