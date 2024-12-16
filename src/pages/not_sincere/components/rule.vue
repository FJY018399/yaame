<template>
	<popup class="flex-box">
        <div class="rule">

            <div class="rule-header">{{ $t('rule_description') }}</div>

            <div class="rule-body">
                <p>{{ $t('rule_description_1') }}</p>
                <p>{{ $t('rule_description_2') }}</p>
                <p>{{ $t('rule_description_3') }}</p>
                <p>{{ $t('rule_description_4') }}</p>
                <p>{{ $t('rule_description_5') }}</p>
            </div>

            <img class="close-icon" src="https://yaame-static.yaame.io/admin/3268595c36f148e844da332067812d08.png" alt="" @click="handleClick">
        </div>
    </popup>
</template>

<script setup>
import popup from "../../../components/common/pop_up.vue";
const emits = defineEmits(["close"]);

const handleClick = () => {
    emits('close');
}
</script>

<style scoped lang="less">
.flex-box {
	display: flex;
	justify-content: center;
	align-items: center;
    .rule {
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/8470edaa7e38adb5c223adf41fe6d167.png);
        width: 5.2rem;
        height: 5.47rem;
        position: relative;
        padding-top: 0.42rem;
        .close-icon {
            width: 0.5rem;
            height: 0.5rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -1.24rem;
        }
        .rule-header {
            width: 5.2rem;
            text-align: center;
            font-size: 0.26rem;
            color: #FFFFFF;
        }
        .rule-body {
            margin-top: 0.3rem;
            width: 5.2rem;
            height: 3.8rem;
            // background-color: pink;
            padding: 0 0.4rem;
            font-size: 0.26rem;
            color: #788EF6;
            overflow: hidden scroll;
        }
    }
}
</style>
