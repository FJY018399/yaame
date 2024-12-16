<template>
    <div class="task">
        <!--提示-->
        <div class="hint">
            <p>{{ $t('vip_reward') }}</p>
        </div>
        <!--奖励档位-->
        <div class="bet">
            <!--表头-->
            <div class="bet-header">
                <!--左-->
                <div class="basic">{{$t('basic') }}</div>
                <!--中-->
                <div class="bet-logo">{{ $t('bet') }}</div>
                <!--右-->
                <div class="vip">{{ $t('vip') }}</div>
            </div>
            <!--进度条-->
            <div class="plan" :style="{ height: props.taskPlanValue + 'rem' }"></div>
            <!--进度条背景板-->
            <div class="plate"></div>
            <!--内容-->
            <div class="bet-grade" v-for="(item, index) in props.taskList" :key="index">
                <!--奖励-->
                <div class="basic-vip-grade" v-for="(ite, inx) in item.task_rewards" :key="inx">
                    <div class="award" :style="{ left: inx === 0 ? '1.04rem' : '', right: inx === 1 ? '1.04rem' : '' }">
                        <img :src="ite.reward_icon" alt="">
                        <div class="award-name">{{ ite.reward_info }}</div>
                        <div v-if="inx === 0 && ite.valid_day" :class="[inx === 0 ? 'day-basic' : '']">{{ ite.valid_day }}</div>
                        <div v-if="inx === 1 && ite.valid_day" :class="[inx === 1 ? 'day-vip' : '']">{{ ite.valid_day }}</div>
                    </div>
                    <!--锁-->
                    <div class="lock" v-if="!ite.is_received && inx === 1 && !props.myList.prizes_eligibility"></div>
                    <!--领取按钮状态 普通  VIP-->
                    <div v-if="inx === 0" @click="getGain(item.task_require, 0, index)" class="gain" :class="[props.myList.score >= item.task_require ? ite.is_received ? 'gain-basic' : 'acquire-basic' : 'wait acquire-basic']">{{ props.myList.score >= item.task_require ? ite.is_received ? $t('obtained') : $t('receive') : $t('waiting')}}</div>
                    <div v-if="inx === 1" @click="getGain(item.task_require, 1, index)" class="gain" :class="[ite.is_received ? 'acquire-vip' : props.myList.prizes_eligibility && props.myList.score >= item.task_require ? 'gain-vip' : 'wait gain-vip' ]">{{ props.myList.score >= item.task_require ? ite.is_received ? $t('obtained') : $t('receive') : $t('waiting') }}</div>
                </div>                                                                                                    <!--是不是VIP-->              <!--当前钻石是否大于这个档位-->    <!--是不是领取过-->    <!--更换文字颜色-->
                <!--钻石-->                                                                                         <!--props.myList.prizes_eligibility && props.myList.score >= item.task_require ? ite.is_received ? 'acquire-vip' : 'gain-vip' : 'wait gain-vip'-->
                <div v-show="(item.task_require / 1000) < 1000" class="grader-diamond">
                    <img src="https://yaame-static.yaame.io/admin/5556593929b0a6a4a55238b41ea5e231.png" alt="">{{ item.task_require / 1000 }}K
                </div>
                <div v-show="(item.task_require / 1000) >= 1000" class="grader-diamond">
                    <img src="https://yaame-static.yaame.io/admin/5556593929b0a6a4a55238b41ea5e231.png" alt="">{{ item.task_require / 1000 /1000 }}M
                </div>
            </div>
            <!--底部-->
            <div class="bet-floor">
                <div class="floor-logo"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Toast } from "vant";
    import { postTaskApi } from "../api";

    const props = defineProps(['taskList', 'myList', 'getTaskList', 'taskPlanValue', 't']);

    // 领取
    const getGain = async (value, type, level) => {
        try {
            // 判断特殊情况 给出tost
            if (!type && props.myList.score < value) {
                Toast(props.t('not_meet_condition'))
                return;
            }
            if (type && !props.myList.prizes_eligibility) {
                Toast(props.t('not_meet_condition'))
                return;
            } else if (props.myList.score < value) {
                Toast(props.t('not_meet_condition'))
                return;
            }
            const res = await postTaskApi({reward_level: level, reward_type: type});
            if (res.status !== 1000) return;
            Toast(props.t('received_success'));
            props.getTaskList();
        } catch (err) {
            console.log(err);
        }
    }
</script>

<style lang="less" scoped>
.task {
    .hint {
        display: flex;
        justify-content: center;
        width: 7.12rem;
        height: 1.56rem;
        margin: 0 auto;
        font-size: .26rem;
        color: #FFFFFF;
        background: url("https://yaame-static.yaame.io/admin/07e9ffec0069b28c29a94e96a91c4c13.png") no-repeat;
        background-size: contain;
        p {
            width: 6.5rem;
            height: .91rem;
            margin-top: .18rem;
            text-align: center;
        }
    }
    .bet {
        position: relative;
        width: 7.12rem;
        margin: .35rem auto;
        .plate {
            position: absolute;
            top: .92rem;
            left: 50%;
            width: 1.28rem;
            height: 99%;
            transform: translateX(-50%);
            background-color: #fff;
            z-index: -1;
        }
        .plan {
            position: absolute;
            top: .92rem;
            left: 50%;
            width: 1.28rem;
            transform: translateX(-50%);
            background-color: #21FF79;
            z-index: 1;
            transition-duration: .3s;
            max-height: 101.6rem;
        }
        // 表头
        .bet-header {
            position: relative;
            display: flex;
            font-size: .32rem;
            color: #FFFFFF;
            .basic,
            .vip {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 3.56rem;
                height: .9rem;
                background-image: url("https://yaame-static.yaame.io/admin/aa9945c2adfb55a1b252ac813bd3ac6e.png");
                background-repeat: no-repeat;
                background-size: contain;
            }
            .basic {
                padding-right: .2rem;
            }
            .vip {
                padding-left: .2rem;
                background-image: url("https://yaame-static.yaame.io/admin/2c853a4c405959afeb7f2720b27891d1.png");
            }
            .bet-logo {
                display: flex;
                position: absolute;
                top: -.09rem;
                left: 50%;
                width: 1rem;
                height: 1rem;
                justify-content: center;
                align-items: center;
                transform: translateX(-50%);
                font-size: .2rem;
                background: linear-gradient( 180deg, #E71AFF 0%, #69ABFF 100%);
                box-shadow: inset 0 0.04rem 0.06rem 0.04rem rgba(161,52,255,0.5);
                border: .08rem solid #21FF79;
                border-radius: 50%;
            }
        }
        // 内容
        .bet-grade {
            position: relative;
            display: flex;
            width: 100%;
            height: 3.2rem;
            margin-bottom: -0.02rem;
            background: url("https://yaame-static.yaame.io/admin/8477c60f808b4443a8189aa09c598d42.png") no-repeat;
            background-size: contain;
            z-index: 2;
            .basic-vip-grade {
                position: relative;
                width: 3.56rem;
                height: 100%;
                .award {
                    position: absolute;
                    top: .35rem;
                    display: flex;
                    width: 1.2rem;
                    height: 1.2rem;
                    justify-content: center;
                    align-items: center;
                    background: #FFFFFF;
                    border-radius: .16rem;
                    border: .02rem solid #03202A;
                    img {
                        max-width: 1rem;
                        max-height: 1rem;
                    }
                    .award-name {
                        position: absolute;
                        top: 1.3rem;
                        width: 2.8rem;
                        height: .24rem;
                        font-size: .24rem;
                        color: #FFFFFF;
                        line-height: .24rem;
                        text-align: center;
                    }
                    .day-basic,
                    .day-vip {
                        position: absolute;
                        top: -0.01rem;
                        right: -0.1rem;
                        display: flex;
                        width: .66rem;
                        height: .3rem;
                        justify-content: center;
                        align-items: center;
                        font-size: .16rem;
                        color: #FFFFFF;
                        background-color: #D545FF;
                        border-radius: .15rem;
                        border: 0.02rem solid #03202A;
                    }
                    .day-vip {
                        background-color: #E99444;
                    }
                }
                .gain {
                    position: absolute;
                    display: flex;
                    bottom: .31rem;
                    width: 2.28rem;
                    height: .68rem;
                    justify-content: center;
                    align-items: center;
                    font-size: .26rem;
                    color: #FFFFFF;
                    background-repeat: no-repeat;
                    background-size: contain;
                    white-space: nowrap;
                }
                // 已获得
                .gain-basic {
                    left: .5rem;
                    font-weight: bold;
                    color: #94EDFF;
                }
                // 领取
                .acquire-basic {
                    left: .5rem;
                    background-image: url("https://yaame-static.yaame.io/admin/d84be1e801ca3196478e2c59a9ab5b64.png");
                }
                // 领取
                .gain-vip {
                    right: .5rem;
                    background-image: url("https://yaame-static.yaame.io/admin/f33f261b935fc814550a39dbd911251a.png");
                }
                // 已获得
                .acquire-vip {
                    right: .5rem;
                    color: #FFCF7B;
                }
                // 等待完成样式
                .wait {
                    opacity: 0.6;
                }
                // 小锁
                .lock {
                    position: absolute;
                    right: .44rem;
                    bottom: .61rem;
                    width: .48rem;
                    height: .48rem;
                    background: url("https://yaame-static.yaame.io/admin/4d6899e8d8ffa42cc4b11000ddcc9e7d.png") no-repeat;
                    background-size: contain;
                    z-index: 1;
                }
            }
            .grader-diamond {
                position: absolute;
                top: 50%;
                left: 50%;
                display: flex;
                height: .32rem;
                justify-content: center;
                align-items: center;
                transform: translate(-50%, -50%);
                font-size: .24rem;
                font-weight: 600;
                color: #FF05C0;
                text-shadow: 0 0 .04rem #FFFFFF, 0 0 0 rgba(255,255,255,0.5);
                img {
                    width: .32rem;
                    height: .32rem;
                }
            }
        }
        // 底部
        .bet-floor {
            position: relative;
            width: 100%;
            height: .4rem;
            background: url("https://yaame-static.yaame.io/admin/39373dbcb14dc4a2a56fa7086b5a8c49.png") no-repeat;
            background-size: contain;
            .floor-logo {
                position: absolute;
                top: -.2rem;
                left: 50%;
                width: .34rem;
                height: .34rem;
                transform: translateX(-50%);
                background: linear-gradient( 180deg, #E71AFF 0%, #69ABFF 100%);
                box-shadow: inset 0 .04rem .06rem .04rem rgba(161,52,255,0.5);
                border: .06rem solid #FFFFFF;
                border-radius: 50%;
                z-index: 3;
            }
            .floor-logo-key {
                border: .06rem solid #21FF79;
            }
        }
    }
}
</style>