<template>
    <popup v-show="props.status" :visible="props.status" class="jackpot-rules">
        <div class="content">
            <div class="close" @click="handleClose"></div>
            <div class="title">{{ $t("rule") }}</div>
            <p class="tips">
                {{ $t("add_to_pool") }}
            </p>
        </div>
    </popup>
</template>
<script setup>
import { defineEmits } from "vue";
import popup from "@/components/common/pop_up.vue";
const props = defineProps({
    status: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(["updateShowReceive"]);
const handleClose = () => {
    emit("updateShowReceive", { status: false, type: 1 });
};
const closeRules = () => {};
</script>
<style scoped lang="less">
.jackpot-rules {
    padding-top: 5rem;
    .content {
        width: 5.33rem;
        background: #ff9314;
        border-radius: 0.23rem;
        border: 0.04rem solid #ffe265;
        margin: 0 auto;
        position: relative;
        padding-top: 0.8rem;
        padding-bottom: 0.3rem;
        .title {
            background: url(https://yaame-static.yaame.io/admin/49702e8824a1fae52f0be4d80c9ea511.png)
                no-repeat;
            background-size: contain;
            width: 5.41rem;
            height: 1.65rem;
            position: absolute;
            top: -1rem;
            color: #770402;
            font-size: 0.32rem;
            line-height: 2.2rem;
            text-align: center;
            font-weight: bold;
        }
        .tips {
            width: 4.29rem;
            min-height: 1.68rem;
            font-size: 0.28rem;
            color: #770402;
            line-height: 0.42rem;
            text-align: left;
            font-style: normal;
            margin: 0 auto;
        }
        .close {
            background: url(https://yaame-static.yaame.io/admin/f00b2e711d6125babdbba6bf210029b7.png)
                no-repeat;
            background-size: contain;
            width: 0.5rem;
            height: 0.5rem;
            position: absolute;
            right: 2.35rem;
            bottom: -1.2rem;
            z-index: 2;
        }
    }
}
</style>
