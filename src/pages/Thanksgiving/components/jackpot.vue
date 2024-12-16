<!-- 瓜分奖池 -->
<template>
    <div>
        <div class="decorate">
            <img
                class="left"
                src="https://yaame-static.yaame.io/admin/19e5b108464533515698b3b923208ff7.png"
                alt=""
            />
            <img
                class="right"
                src="https://yaame-static.yaame.io/admin/523fe02478fbd56ea3d235470c0755af.png"
                alt=""
            />
        </div>
        <div class="main">
            <div class="title">
                <span>{{ $t("daily_pool") }}</span>
                <img
                    src="https://yaame-static.yaame.io/admin/2b70e88f9ea197411352fd4c79540614.png"
                    @click="changeDialogStatus({ status: true, type: 1 })"
                />
            </div>
            <div class="countdown-box">
                <span style="margin-right: 3px;">{{ $t("today_countdown") }}</span>
                <Countdown :targetDate="jackpotData.countdown" />
            </div>
            <div class="date-select">
                <img
                    src="https://yaame-static.yaame.io/admin/e2ac13ab5e34dcc131fef555a9094e13.png"
                    @click="changeDate(0)"
                />
                <p>{{ selectDate }}</p>
                <img
                    src="https://yaame-static.yaame.io/admin/1c02e676eeaf5d1cd8baf56849da1709.png"
                    @click="changeDate(1)"
                />
            </div>
            <div class="notice">
                <img
                    src="https://yaame-static.yaame.io/admin/6f47a25a50ff8cb774d92be21ca61833.png"
                    alt=""
                />
                <NoticeScroll :noticeList="jackpotData.reward_pool_user" />
            </div>
            <div
                :class="
                    rewardStatus === 0
                        ? 'jackpot-box-y'
                        : 'jackpot-box'
                "
            >
                <div class="lackpot-count">
                    <span>{{ $t("pool_quantity") }}</span>
                    <JackpotCounter
                        :initialAmount="poolNow"
                        :targetAmount="pool"
                        :animation="false"   
                        :styles="{
                            width: '0.52rem',
                            height: '0.6rem',
                            background:
                                'url(https://yaame-static.yaame.io/admin/a49474405bc4c9381e2f30e346f7b5c0.png) no-repeat',
                            backgroundSize: 'contain',
                            fontSize: '0.4rem',
                            lineHeight: '0.6rem',
                            color: '#FFF162',
                        }"
                    />
                </div>
                <div
                    :class="[
                        rewardStatus === 0
                            ? 'redeem'
                            : 'redeem-d',
                        {
                            'animate-redeem':
                            rewardStatus === 0,
                        },
                    ]"
                    @click="handleReceive"
                >
                    <span>{{ $t("receive") }}</span>
                </div>
            </div>
        </div>
        <jackpotReceive
            @updateShowReceive="changeDialogStatus"
            :status="showReceive"
            :selectDate="selectDate"
            :receiveCount="receiveCount"
        />
        <jackpotRules
            @updateShowReceive="changeDialogStatus"
            :status="showRules"
        />
    </div>
</template>

<script setup>
import {
    ref,
    onMounted,
    watch,
    defineProps,
    onUnmounted,
    reactive,
    getCurrentInstance,
} from "vue";
import { getCurrentTime, getYearMonthDay } from "@/lib/utils";
import NoticeScroll from "@/components/common/NoticeScroll.vue";
import JackpotCounter from "@/components/common/JackpotCounter.vue";
import Countdown from "@/components/common/Countdown.vue";
import Toast from "@/components/third/toast/toast";
import jackpotReceive from "./jackpotReceive.vue";
import jackpotRules from "./jackpotRules.vue";
import { getPool, receiveJackpot } from "../api";
const root = getCurrentInstance();

const t = (value) => {
    return root.proxy.$i18n.t(value);
};

const props = defineProps({
    jackpotInfo: {
        type: Function,
        required: true,
    },
    jackpotData: {
        type: Object,
        required: () => {},
    },
});
// 时间列表
const dateList = [
    "11/26",
    "11/27",
    "11/28",
    "11/29",
    "11/30",
    "12/01",
    "12/02",
    "12/03",
];
// 当前时间
const selectDate = ref(dateList[0]);
// 领取弹框显示状态
const showReceive = ref(false);
// 是否显示规则
const showRules = ref(false);
// 奖池新值
const pool = ref(0);
// 奖池旧值
const poolNow = ref(0);
// 保存今天的日期
const isInit = ref(null);
// 领取的数量
const receiveCount = ref(0);
// 领取锁
const receiveLock = ref(false);
// 奖池数据
const jackpotData = reactive({ ...props.jackpotData });
const rewardStatus = ref(null);
const getjackpotInfolock = ref(false);
let timer = null;

// 监听props变化
watch(
    () => props.jackpotData,
    (newVal, oldVal) => {
        if (newVal) {
            Object.assign(jackpotData, newVal);
            rewardStatus.value = newVal?.pool_diamond_reward_status;
            // console.log('jackpotData更新', oldVal, newVal, jackpotData);
            pool.value = newVal.pool_diamond;
            poolNow.value = oldVal.pool_diamond;
        }
    }
);

const setCurrentTime = () => {
    dateList.forEach((item) => {
        const time_ = item.split("/")[0] + item.split("/")[1];
        if (jackpotData.currentTime.includes(time_)) {
            isInit.value = item;
        }
    });
};

const changeDialogStatus = ({ status = false, type = 0 }) => {
    if (type == 0) {
        showReceive.value = status;
    } else {
        showRules.value = status;
    }
};
// 领取瓜分金币
const handleReceive = () => {
    if (receiveLock.value) return;
    receiveLock.value = true;
    const timeStr = "2024/" + selectDate.value;
    receiveJackpot({ time_str: timeStr }).then(
        (result) => {
            receiveLock.value = false;
            if (result.status === 1000) {
                receiveCount.value = result?.data?.diamond || 0;
                showReceive.value = true;
                jackpotData.pool_diamond_reward_status = 1;
                rewardStatus.value = 1;
            } else {
                Toast(result?.desc || "network error!");
            }
        },
        (e) => {
            receiveLock.value = false;
        }
    );
};

onMounted(() => {
    const now = getYearMonthDay("MM") + "/" + getYearMonthDay("DD");
    selectDate.value = now;
    if (getYearMonthDay("MM") == 11 && getYearMonthDay("DD") < 26) {
        selectDate.value = dateList[0];
    }
    const lastDate = dateList[dateList.length - 1].split("/");
    if (
        getYearMonthDay("MM") == 12 &&
        getYearMonthDay("DD") > parseInt(lastDate[1])
    ) {
        selectDate.value = dateList[dateList.length - 1];
    }
    isInit.value = selectDate.value;
    updateJackpot();
});

// 轮询奖池数量
const updateJackpot = () => {
    clearInterval(timer);
    timer = setInterval(() => {
        getPool().then(
            (res) => {
                if (res.data.diamond !== pool.value) {
                    pool.value = res.data.diamond;
                }
            },
            (e) => {
                console.log("getPool error::", e);
            }
        );
    }, 3000);
};

onUnmounted(() => {
    clearInterval(timer);
});

// 改变日期
const changeDate = (type) => {
    if(getjackpotInfolock.value) return;
    getjackpotInfolock.value = true;
;    const index_ = dateList.indexOf(selectDate.value);
    if (type) {
        selectDate.value =
            index_ < dateList.length - 1
                ? dateList[index_ + 1]
                : dateList[dateList.length - 1];
    } else {
        selectDate.value = index_ <= 0 ? dateList[0] : dateList[index_ - 1];
    }

    props.jackpotInfo(selectDate.value, ()=> {
        getjackpotInfolock.value = false;
    });
    if (isInit.value == selectDate.value) {
        updateJackpot();
    } else {
        clearInterval(timer);
    }
};

const decrementLastTwoDigits = (dateStr, type) => {
    let parts = dateStr.split("/");
    let lastPart = parseInt(parts[parts.length - 1], 10);
    if (type) {
        lastPart < 24 ? (lastPart += 1) : (lastPart = 24);
    } else {
        lastPart > 0 ? (lastPart -= 1) : (lastPart = 0);
    }
    parts[parts.length - 1] = lastPart.toString().padStart(2, "0");
    return parts.join("/");
};
</script>

<style scoped lang="less">
.decorate {
    width: 100%;
    height: 2.33rem;
    position: relative;
    z-index: 1;
    .left {
        width: 1.02rem;
        height: 1.37rem;
        position: absolute;
        left: 0;
    }
    .right {
        width: 3.18rem;
        height: 2.33rem;
        position: absolute;
        right: 0rem;
    }
}
.main {
    background: url("https://yaame-static.yaame.io/admin/497bb9911622f4b4aca68de17e914941.png")
        no-repeat;
    background-size: contain;
    color: #fff;
    margin: 0 auto;
    margin-top: -2rem;
    padding-top: 1.05rem;
    width: 7.17rem;
    height: 11.72rem;
    position: relative;
    z-index: 2;
    text-align: center;
    line-height: 0.2rem;
    .title {
        font-size: 0.34rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #770402;
        font-weight: bold;
        img {
            width: 0.32rem;
            height: 0.32rem;
            margin-left: 0.07rem;
        }
    }
    .countdown-box {
        // width: 3.64rem;
        height: 0.51rem;
        background: #e56e02;
        border-radius: 0.09rem;
        margin: 0 auto;
        margin-top: 0.4rem;
        font-size: 0.26rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.15rem;
    }
    .date-select {
        font-size: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0.22rem;
        height: 0.6rem;
        p {
            line-height: 0.6rem;
            width: 2.6rem;
            text-align: center;
        }
        img {
            width: 0.44rem;
            height: 0.45rem;
        }
    }
    .notice {
        width: 6.58rem;
        height: 0.56rem;
        background: #cd6201;
        border-radius: 0.08rem;
        opacity: 0.66;
        margin: 0 auto;
        margin-top: 0.22rem;
        display: flex;
        align-items: center;
        padding: 0 0.15rem;
        img {
            width: 0.42rem;
            height: 0.43rem;
        }
    }
    .jackpot-box,
    .jackpot-box-y {
        background: url("https://yaame-static.yaame.io/admin/5b990672b0bf9d6803d18d9075e1092e.png")
            no-repeat;
        background-size: contain;
        width: 1rem;
        height: 1rem;
        width: 6.58rem;
        height: 6.58rem;
        margin: 0 auto;
        margin-top: 0.22rem;
        padding-top: 0.45rem;
        .lackpot-count {
            background: url("https://yaame-static.yaame.io/admin/ca0f7e22245a696dda46ec12c57181ca.png")
                no-repeat;
            background-size: contain;
            width: 5.7rem;
            height: 1.58rem;
            color: #fff649;
            font-size: 0.3rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            padding-top: 0.15rem;
            line-height: 0.45rem;
        }
        .redeem,
        .redeem-d {
            background: url("https://yaame-static.yaame.io/admin/0cf25741fbfc7b4a7f94d9873cd19a3e.png")
                no-repeat;
            background-size: contain;
            width: 2.81rem;
            height: 1.2rem;
            margin: 0 auto;
            margin-top: 3rem;
            color: #4c0277;
            font-size: 0.32rem;
            font-weight: bold;
            text-align: center;
            line-height: 1.2rem;
        }
        .redeem-d {
            background: url("https://yaame-static.yaame.io/admin/e506cf69f0397518cdcf7f3015464c62.png")
                no-repeat;
            background-size: contain;
            color: #4d325c;
        }
    }
    .jackpot-box-y {
        background: url(https://yaame-static.yaame.io/admin/de0f233d91a418fdb3e4605ccceb91a9.webp)
            no-repeat;
        background-size: contain;
    }
}
@keyframes scaleAnimation {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

.animate-redeem {
    animation: scaleAnimation 1s infinite;
}
</style>