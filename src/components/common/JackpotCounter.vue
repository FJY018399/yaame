<!--
 * @Author: Lcr
 * @Date: 2024-11-15 15:04:17
 * @Description: 奖池跑分组件
 * @params 
    initialAmount 初始分数
    targetAmount 目标分数
    duration 跑分总时间
    speech 跑分速度
    styles 用来定义数字背景图片，尺寸，字号，字体颜色等
-->
<template>
    <div class="jackpot-counter">
        <span
            v-for="(digit, index) in digits"
            :key="index"
            class="digit"
            :style="{ ...props.styles }"
            >{{ digit }}</span
        >
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
    initialAmount: {
        type: Number,
        default: 0,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        default: 1000, // 默认1秒
    },
    speech: {
        type: Number,
        default: 15, // 跑分速度
    },
    styles: {
        type: Object,
        default: () => ({}),
    },
    animation: {
        type: Boolean,
        default: true,
    },
});

const currentAmount = ref(props.initialAmount || 0);

const digits = computed(() => {
    const length = currentAmount.value.toString().length;
    const flag = length > 8 ? 8 : length > 6 ? length : 6;
    return currentAmount.value.toString().padStart(flag, "0").split("");
});

let intervalId;

onUnmounted(() => {
    clearInterval(intervalId);
});

function startCounting() {
    const totalSteps = props.duration / props.speech;
    const stepSize =
        (props.targetAmount - (props.initialAmount || 0)) / totalSteps; // 每步增加的金额

    let steps = 0;
    intervalId = setInterval(() => {
        currentAmount.value = parseInt(currentAmount.value + stepSize);
        steps++;

        if (steps >= totalSteps || currentAmount.value >= props.targetAmount) {
            currentAmount.value = props.targetAmount; // 达到或超过目标金额时停止
            clearInterval(intervalId);
        }
    }, props.speech);
}

watch(
    () => props.targetAmount,
    (newTargetAmount) => {
        if(!props.animation){
            currentAmount.value = newTargetAmount;
            return;
        }
        if (currentAmount.value >= newTargetAmount) {
            currentAmount.value = newTargetAmount;
        } else {
            startCounting();
        }
    }
);
</script>

<style scoped>
.jackpot-counter {
    display: flex;
    justify-content: center;
    gap: 0.08rem;
    /* font-weight: bold; */
}

.digit {
    display: inline-block;
    text-align: center;
}
</style>
