<!--
 * @Author: Lcr
 * @Description: 横向滚动公告
 * @LastEditTime: 2024-11-25 19:23:24
 * @params 
    noticeList 公告数据
    duration 多久滚动一次
    styles 用来字号，字体颜色等
-->
<template>
    <div
        class="notice-container"
        :style="{ ...props.styles }"
        v-if="notices.length"
    >
        <span
            ref="noticeLeft"
            class="notice-left"
            :class="{ [animateClasses[0]]: startScroll }"
            @animationend="handleAnimationEnd"
        >
            {{
                $t("congrats_winner", [
                    notices[currentIndex[0]].nickname,
                    notices[currentIndex[0]].diamond,
                ])
            }}
        </span>
        <span
            ref="noticeRight"
            class="notice-right"
            :class="{ [animateClasses[1]]: startScroll }"
        >
            {{
                $t("congrats_winner", [
                    notices[currentIndex[0]].nickname,
                    notices[currentIndex[0]].diamond,
                ])
            }}
        </span>
    </div>
    <p  class="no-notice" v-else>{{ $t("coming_soon") }}</p>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

const props = defineProps({
    noticeList: {
        type: Array,
        default: () => [],
    },
    duration: {
        type: Number,
        default: 3000,
    },
    styles: {
        type: Object,
        default: () => ({}),
    },
});
const notices = ref([]);
const startScroll = ref(false);
const currentIndex = ref([0, 1]);
let timer = null;
const noticeLeft = ref(null);
const noticeRight = ref(null);

const animateClasses = computed(() => {
    return startScroll.value ? ["animate-one", "animate-two"] : ["", ""];
});

watch(
    () => props.noticeList,
    (newVal, oldVal) => {
        if (newVal) {
            notices.value = newVal;
            if (notices.value.length == 1) {
                currentIndex.value = [0, 0];
            } else if (notices.value.length > 1) {
                clearInterval(timer);
                currentIndex.value = [0, 1];
                timer = setInterval(() => {
                    startScroll.value = true;
                }, props.duration);
            }
        }
    }
);

const handleAnimationEnd = () => {
    startScroll.value = false;

    const nextIndex = (currentIndex.value[1] + 1) % notices.value.length;
    currentIndex.value = [currentIndex.value[1], nextIndex];

    if (nextIndex === 0) {
        currentIndex.value = [notices.value.length - 1, 0];
    }
};

onMounted(() => {});

onUnmounted(() => {
    clearInterval(timer);
});
</script>

<style scoped lang="less">
.no-notice{
    color: #ffed47;
    width: 5.8rem;
    font-size: 0.22rem;
    line-height: 0.56rem;
    margin-left: 0.14rem;
    text-align: left;
}
.notice-container {
    position: relative;
    width: 5.8rem;
    height: 0.56rem;
    overflow: hidden;
    color: #ffed47;
    font-size: 0.22rem;
    line-height: 0.56rem;
    margin-left: 0.14rem;
    text-align: left;
    span {
        position: absolute;
        width: 100%;
        display: inline-block;
    }
    .notice-left {
        left: 0;
    }
    .notice-right {
        left: 100%;
    }
    .animate-one {
        left: 0;
        animation: slideOne 0.5s linear forwards;
    }
    .animate-two {
        left: 100%;
        animation: slideTwo 0.5s linear forwards;
    }
}

/* 定义关键帧动画 */
@keyframes slideOne {
    0% {
        left: 0;
    }
    100% {
        left: -100%;
    }
}

@keyframes slideTwo {
    0% {
        left: 100%;
    }
    100% {
        left: 0;
    }
}
</style>
