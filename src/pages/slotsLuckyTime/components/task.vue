<template>
    <div class="task">
        <div class="explain">
            <i18n path="luckyTurntableDesc">
                <img place="msg" src="https://yaame-static.yaame.io/admin/2da18d269832b0f7d4da64da34a14082.png" alt="">
            </i18n>
        </div>
        <!--进度框-->
        <div class="progress-frame">
            <div class="progress-bar" :style="{ height: schedule + 'rem' }"></div>
        </div>
        <!--奖励栏-->
        <div class="award-hurdle">
            <div :class="['award', index === 4 || index === 5 ? 'three-award' : '']" v-for="(item, index) in data" :key="index">
                <!--具体奖励 / 判断用户当前状态更换背景-->
                <div
                    :class="[
                    'award-img-lock', index === 4 || index === 5 ? 'three-award-img-lock' : '',
                    (userData.score >= item.win_diamond_amount) && (index !== 4 || index !== 5) ? 'award-img' : '',
                    (userData.score >= item.win_diamond_amount) && (index === 4 || index === 5) ? 'three-award-img' : '',
                    ]"
                     :style="{ opacity: userData.score >= item.win_diamond_amount ? 0.6 : 1 }">
                    <!--详细奖励-->
                    <div class="specific-award" v-for="(ite, inx) in item.tesk_rewards" :key="inx" @click="inx === 0 ? openShow() : ''">
                        <img :src="ite.reward_icon" alt="">
                        <div class="specific-name" v-if="(index !== 5) || (inx !== 1 && inx !== 3)">{{ ite.reward_info }}</div>
                    </div>
                    <!--完成状态-->
                    <div class="accomplish-status">{{ userData.score >= item.win_diamond_amount ? $t('completed') : $t('waiting') }}</div>
                </div>
                <!--对钩-->
                <div class="right" v-if="userData.score >= item.win_diamond_amount"></div>
                <!--进度圆点-->
                <div class='circle' :class="{ 'circle-img': userData.score >= item.win_diamond_amount }"></div>
                <!--钻石档位-->
                <div class="diamond-place" :class="{ 'diamond-place-img': userData.score >= item.win_diamond_amount }">
                    <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                    <span>{{ item.win_diamond_amount }}</span>
                    <p>{{ $t('win') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import { getTaskDataApi } from "../api";

    const data = ref([]);
    const userData = ref({});
    const schedule = ref(0);
    // 获取父组件打开弹窗方法
    const props = defineProps(['openTicket']);
    // 获取页面数据
    const getData = async () => {
        try {
            const res = await getTaskDataApi();
            if (res.status !== 1000) return;
            data.value = res.data.reward_levels;
            userData.value = res.data.my_slots_luck_info;
            if (userData.value.score > 3000000) userData.value.score = 3000000;
            const num = userData.value.score;
            // 控制进度条
            if (num >= 5000 && num <= 10000) {
                schedule.value = ((num - 5000) / (10000 - 5000)) * 4.13
            } else if (num >= 10000 && num <= 50000) {
                schedule.value = (((num - 10000) / (50000 - 10000)) * 4.15) + 4.13
            } else if (num >= 50000 && num <= 100000) {
                schedule.value = (((num - 50000) / (100000 - 50000)) * 4.19) + 8.28
            } else if (num >= 100000 && num <= 200000) {
                schedule.value = (((num - 100000) / (200000 - 100000)) * 4.19) + 12.47
            } else if (num >= 200000 && num <= 400000) {
                schedule.value = (((num - 200000) / (400000 - 200000)) * 5.61) + 16.66
            } else if (num >= 400000 && num <= 600000) {
                schedule.value = (((num - 400000) / (600000 - 400000)) * 5.66) + 22.27
            } else if (num >= 600000 && num <= 1000000) {
                schedule.value = (((num - 600000) / (1000000 - 600000)) * 4.13) + 27.93
            } else if (num >= 1000000 && num <= 2000000) {
                schedule.value = (((num - 1000000) / (2000000 - 1000000)) * 4.18) + 32.11
            } else if (num >= 2000000 && num <= 3000000) {
                schedule.value = (((num - 2000000) / (3000000 - 2000000)) * 4.18) + 36.29
            }
        } catch (err) {
            console.log(err);
        }
    }
    defineExpose({
        getData
    });
    // 打开奖券弹窗
    const openShow = () => {
        props.openTicket();
    }

    onMounted(() => {
        getData();
    })
</script>

<style lang="less" scoped>
.task {
    position: absolute;
    top: 7.34rem;
    width: 100%;
    overflow: hidden;
    padding-bottom: 3.04rem;
    .explain {
        display: flex;
        align-items: center;
        margin-left: .29rem;
        font-size: .24rem;
        color: #fff;
        span {
            display: flex;
            align-items: center;
        }
        img {
            width: .6rem;
            height: .27rem;
            margin: 0 .1rem;
        }
    }
    //进度框
    .progress-frame {
        position: absolute;
        top: 1.29rem;
        left: 2.41rem;
        width: .18rem;
        height: 40.48rem;
        background: #510589;
        border: .01rem solid #C16EFF;
        // 进度条
        .progress-bar {
            position: absolute;
            top: 0;
            width: 100%;
            height: 2.78rem;
            background: #F8D266;
            border-radius: .18rem;
        }
    }
    //奖励栏
    .award-hurdle {
        position: relative;
        top: .42rem;
        left: 2.9rem;
        .award {
            position: relative;
            display: flex;
            width: 4.38rem;
            height: 3.5rem;
            justify-content: center;
            align-items: center;
            margin-top: .66rem;
            // 圆点
            .circle {
                position: absolute;
                top: 0.44rem;
                left: -.57rem;
                width: .32rem;
                height: .32rem;
                background: url("https://yaame-static.yaame.io/admin/8d76b3b50f016e02bf7cb5dfde456f75.png") no-repeat;
                background-size: contain;
            }
            .circle-img {
                background: url("https://yaame-static.yaame.io/admin/9d76e1c0cddea628730cfcf49d1041d9.png") no-repeat;
                background-size: contain;
            }
            //钻石档位
            .diamond-place {
                position: absolute;
                display: flex;
                top: .39rem;
                left: -2.69rem;
                width: 1.88rem;
                height: 1.67rem;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: url("https://yaame-static.yaame.io/admin/dc57f93584a25c41a8345e2a3a21edb3.png") no-repeat;
                background-size: contain;
                color: #A432E1;
                font-size: .28rem;
                span {
                    font-weight: 600;
                }
                img {
                    width: .31rem;
                    height: .26rem;
                }
                p {
                    font-size: .24rem;
                }
            }
            .diamond-place-img {
                color: #9C4F03;
                background: url("https://yaame-static.yaame.io/admin/456a1f40b61c1d0ec28cb46fe7c33bd3.png") no-repeat;
                background-size: contain;
            }
            // 详细奖励
            .right {
                width: .9rem;
                height: .77rem;
                background: url("https://yaame-static.yaame.io/admin/b73867af226ac24621ef7d7b550ea511.png") no-repeat;
                background-size: contain;
                z-index: 3;
            }
        }
        .award:nth-child(1) {
            margin-top: 0;
        }
        .award-img-lock {
            position: absolute;
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: space-evenly;
            background: url("https://yaame-static.yaame.io/admin/32af056879c3ce1eeafedb119bef0566.png") no-repeat;
            background-size: contain;
            .specific-award {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.21rem;
                height: 1.29rem;
                margin-top: 0.66rem;
                background: url("https://yaame-static.yaame.io/admin/b65c3a7681a94bc37bb8ade1a1af42c8.png") no-repeat;
                background-size: contain;
                img {
                    width: .81rem;
                }
                .specific-name {
                    position: absolute;
                    top: 1.43rem;
                    height: .24rem;
                    white-space: nowrap;
                    line-height: .24rem;
                    font-size: .24rem;
                    color: #fff;
                }
            }
            .accomplish-status {
                position: absolute;
                display: flex;
                top: 2.53rem;
                width: 1.89rem;
                height: .51rem;
                justify-content: center;
                align-items: center;
                background: url("https://yaame-static.yaame.io/admin/c887e2f6124b4ef01cdc00c9fb885ffe.png") no-repeat;
                background-size: contain;
                color: #FDDD65;
                font-size: .22rem;
            }
        }
        .award-img {
            background: url("https://yaame-static.yaame.io/admin/c62ec1d3e0432120331659f39a0f3fdc.png") no-repeat;
            background-size: contain;
        }
        .three-award {
            width: 4.38rem;
            height: 4.95rem;
        }
        .three-award-img-lock {
            position: absolute;
            flex-wrap: wrap;
            width: 100%;
            height: 100%;
            background: url("https://yaame-static.yaame.io/admin/5e1e84d38ca4941ef4578177e491b134.png") no-repeat;
            background-size: contain;
            .accomplish-status {
                top: 3.96rem;
            }
            .specific-award:nth-child(1) {
                margin: .58rem 1.58rem 0;
            }
            .specific-award:nth-child(n + 2) {
                width: 1.01rem;
                height: 1.08rem;
                margin: 0 0 1rem;
                .specific-name {
                    top: 1.18rem;
                }
            }
        }
        .three-award-img {
            background: url("https://yaame-static.yaame.io/admin/eb9d824c16e73b8347987d6ebfdbdd07.png") no-repeat;
            background-size: contain;
        }
    }
}
</style>