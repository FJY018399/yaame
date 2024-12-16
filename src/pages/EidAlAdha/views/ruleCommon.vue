<template>
    <popup class="popup" @cancel="props.cutRule">
        <div class="rule" :style="{ width: props.width, height: props.height, backgroundImage: `url(${props.backgroundImage})` }">
            <!--左右角标-->
            <div class="header">
                <div class="rule-left"></div>
                <div class="head">{{ props.title }}</div>
                <div class="rule-right"></div>
            </div>

            <div class="rule-content">
                <slot name="default"></slot>
            </div>

            <div v-if="closeButton" class="close" @click="props.cutRule">{{ props.buttonContent }}</div>

            <img v-if="closeIconShow" class="close-icon" src="https://yaame-static.yaame.io/admin/4bcf095d20500fff632ff75f099e6bf6.png" alt="" @click="props.cutRule">
        </div>
    </popup>
</template>

<script setup>
import popup from "@/components/common/pop_up.vue";
const props = defineProps({
    title: { // 标题
        type: String,
        default: ''
    },
    width: { // 背景宽
        type: String,
        required: true
    },
    height: { // 背景高
        type: String,
        required: true
    },
    backgroundImage: { // 背景图片
        type: String,
        required: true
    },
    buttonContent: { // 按钮文字
        type: String,
        default: ''
    },
    cutRule: { // 关闭弹窗方法
        type: Function,
        required: true
    },
    closeButton: { // 确定按钮
        type: Boolean,
        default: true
    },
    closeIconShow: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="less" scoped>
.rule {
    position: absolute;
    top: 4.14rem;
    left: 50%;
    transform: translateX(-50%);
    background-repeat: no-repeat;
    background-size: cover;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: .3rem;
        left: 50%;
        height: .50rem;
        transform: translateX(-50%);
        .head {
            margin: 0 .06rem;
            font-weight: 600;
            font-size: .36rem;
            color: #FFF28F;
            white-space: nowrap;
        }

        .rule-left,
        .rule-right {
            width: .68rem;
            height: .32rem;
            background-image: url("https://yaame-static.yaame.io/admin/b91128a2638ccc431ecdb7505242de63.png");
            background-repeat: no-repeat;
            background-size: cover;
        }
        .rule-right {
            background-image: url("https://yaame-static.yaame.io/admin/3737c9237756046e615f0d9a74111443.png");
        }
    }

    .close {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 50%;
        bottom: .44rem;
        width: 4.18rem;
        height: .86rem;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/4382358c89ca1d8a60f3f2900116414d.png") no-repeat;
        background-size: cover;
        font-weight: 600;
        font-size: .3rem;
        color: #6B3E17;
    }

    .close-icon {
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -0.8rem;
    }
}
</style>
