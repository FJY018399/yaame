<template>
    <popup
        v-show="props.status"
        :visible="props.status"
        class="jackpot-receive"
    >
        <div class="content">
            <div class="gift">
                <img
                    src="https://yaame-static.yaame.io/admin/0779ffc4d579c6bbfdb9dd5e85b8a1f8.png"
                    alt=""
                />
            </div>
            <div class="count">
                <img
                    src="https://yaame-static.yaame.io/admin/12076e652b1268fd32952c7745006960.png"
                    alt=""
                />
                <span>{{ props.receiveCount }}</span>
            </div>
            <p class="tips">
                {{ $t("reward_received") }}
            </p>
            <div class="btn" @click="handleReceive">OK</div>
        </div>
    </popup>
</template>
<script setup>
import { defineEmits, ref } from "vue";
import popup from "@/components/common/pop_up.vue";
import { receiveJackpot } from "../api";
const props = defineProps({
    status: {
        type: Boolean,
        required: true,
    },
    selectDate: {
        type: String,
        required: true,
    },
    receiveCount: {
        type: Number,
        required: true,
    },
});
const emit = defineEmits(["updateShowReceive"]);
const handleReceive = () => {
    emit("updateShowReceive", { status: false, type: 0 });
};
</script>
<style scoped lang="less">
.jackpot-receive {
    padding-top: 4.38rem;
    .content {
        background: url(https://yaame-static.yaame.io/admin/d9cd1bee075aa419fb73fa149cb0ca09.png)
            no-repeat;
        background-size: contain;
        width: 6.5rem;
        height: 6.17rem;
        margin: 0 auto;
        padding-top: 2.03rem;
        .gift {
            width: 1.7rem;
            height: 1.7rem;
            background: #e27d08;
            border-radius: 0.07rem;
            border: 0.01rem solid #ffffa9;
            opacity: 0.83;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 1.17rem;
                height: auto;
            }
        }
        .count {
            font-size: 0.36rem;
            color: #770402;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 0.15rem;
            img {
                margin-right: 0.05rem;
            }
        }
        .tips {
            color: #770402;
            font-size: 0.24rem;
            width: 5.13rem;
            margin: 0 auto;
        }
        .btn {
            background: url("https://yaame-static.yaame.io/admin/bfce88ff08a07695c0c657b82511d73c.png")
                no-repeat;
            background-size: contain;
            width: 2.06rem;
            height: 0.87rem;
            text-align: center;
            line-height: 0.87rem;
            font-size: 0.34rem;
            color: #770402;
            margin: 0 auto;
        }
    }
}
</style>
