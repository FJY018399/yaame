<!--
 * @Author: Lcr
 * @Date: 2024-11-15 15:04:17
 * @Description: 时分秒倒计时组件
 * @params 
    targetDate 目标时间 时间戳
-->
<template>
    <div class="countdown">
        <span>{{ formattedHours }}</span>:<span>{{ formattedMinutes }}</span
        >:<span>{{ formattedSeconds }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
const props = defineProps({
    targetDate: {
        type: Number,
        default: 0,
    },
});
const targetDate = ref(targetDate);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const formattedHours = ref("00");
const formattedMinutes = ref("00");
const formattedSeconds = ref("00");
let intervalId;

onUnmounted(() => {
    clearInterval(intervalId);
});

watch(
    () => props.targetDate,
    (newVal, oldVal) => {
        clearInterval(intervalId);
        if (newVal > 0) {
            targetDate.value = parseInt(newVal);
            startCountdown();
        } else {
            formattedHours.value = "00";
            formattedMinutes.value = "00";
            formattedSeconds.value = "00";
        }
    }
);

function startCountdown() {
    intervalId = setInterval(() => {
        targetDate.value = targetDate.value - 1000;
        const distance = targetDate.value;
        if (distance <= 0) {
            clearInterval(intervalId);
            formattedHours.value = "00";
            formattedMinutes.value = "00";
            formattedSeconds.value = "00";
        } else {
            hours.value = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            minutes.value = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            seconds.value = Math.floor((distance % (1000 * 60)) / 1000);

            formattedHours.value = padZero(hours.value);
            formattedMinutes.value = padZero(minutes.value);
            formattedSeconds.value = padZero(seconds.value);
        }
    }, 1000);
}

function padZero(num) {
    return num.toString().padStart(2, "0");
}
</script>

<style scoped>
.countdown span {
    display: inline-block;
    /* min-width: 2em; */
    text-align: center;
}
</style>
