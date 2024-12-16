<template>
    <div :class="['main', language]">
        <custom-header color="white">{{ $t('activityTitle') }}</custom-header>
        <!-- 规则按钮 -->
        <div v-if="activityRules" class="rule-btn" @click="rule">
            <img src="https://yaame-static.yaame.io/admin/e6e0b11d02bf27c4b75a8ec87fba796b.png" alt=""/>
        </div>
        <!-- 活动时间 -->
        <div class="activity-time">
            {{ $t("activityTime") }}
        </div>
        <!-- 时间计时 -->
        <div class="time-span">
            <div class="time">{{ days < 10 ? `0${days}` : days }}</div>
            <div class="time">D</div>
            <div class="time">{{ hours < 10 ? `0${hours}` : hours }}</div>
            <div class="time">{{ minutes < 10 ? `0${minutes}` : minutes }}</div>
            <div class="time">{{ seconds < 10 ? `0${seconds}` : seconds }}</div>
        </div>
        <!-- 充值档位奖励 -->
        <div v-for="(item, index) in chargeRewardGroups" :key="index" :class="[
                    'container',
                    item.group_flag === 'rebate800' && 'mid',
                    item.group_flag === 'charge1000' && 'big',
                  ]"
        >
            <div class="container-header">{{ item.reward_group_title }}</div>
            <!-- 0 -->
            <div v-if="item.group_flag === 'rebate0'" class="award">
                <div class="award-img">
                    <img :src="item.charge_reward_items[0].reward_icon" alt=""/>
                </div>
                <div class="award-name">
                    {{ item.charge_reward_items[0].reward_name }}
                </div>
                <div class="award-name diamond">
                    <img v-if="item.object_type === 'DIAMOND' || item.object_type === 'GIFT' || item.object_type === 'VIEW'" src="https://yaame-static.yaame.io/admin/cd35dab35714d9bd1962cd0ab34a00ea.png" alt=""/>
                    {{ item.charge_reward_items[0].reward_diamond_worth }}
                </div>
            </div>
            <!-- 10~200 -->
            <div v-else-if="['rebate10', 'rebate50', 'rebate100', 'rebate200'].includes(
                      item.group_flag
                    )
                      " class="double-award"
            >
                <div v-for="(item, index) in item.charge_reward_items" :key="index" class="award2">
                    <div class="award-img">
                        <img :src="item.reward_icon" alt=""/>
                    </div>
                    <div class="award-name">
                        {{ item.reward_name }}
                    </div>
                    <div class="award-name diamond">
                        <img v-if="item.object_type === 'DIAMOND' || item.object_type === 'GIFT' || item.object_type === 'VIEW'" src="https://yaame-static.yaame.io/admin/cd35dab35714d9bd1962cd0ab34a00ea.png" alt=""/>
                        {{ item.reward_diamond_worth }}
                    </div>
                </div>
            </div>
            <!-- 500 -->
            <div v-else-if="item.group_flag === 'rebate500'" class="three-award">
                <div v-for="(item, index) in item.charge_reward_items" :key="index" class="award3">
                    <div class="award-img">
                        <img :src="item.reward_icon" alt=""/>
                    </div>
                    <div class="award-name">
                        {{ item.reward_name }}
                    </div>
                    <div class="award-name diamond">
                        <img v-if="item.object_type === 'DIAMOND' || item.object_type === 'GIFT' || item.object_type === 'VIEW'" src="https://yaame-static.yaame.io/admin/cd35dab35714d9bd1962cd0ab34a00ea.png" alt=""/>
                        {{ item.reward_diamond_worth }}
                    </div>
                </div>
            </div>
            <!-- 800 -->
            <div v-else-if="item.group_flag === 'rebate800'" class="four-award">
                <div v-for="(item, index) in item.charge_reward_items" :key="index"
                     :class="{ award4: index !== 3, flutter: index === 3 }"
                >
                    <div class="award-img">
                        <img :src="item.reward_icon" alt=""/>
                    </div>
                    <div :class="['award-name', index == 3 && 'award-name-flutter']">
                        {{ item.reward_name }}
                    </div>
                    <div class="award-name diamond">
                        <img v-if="item.object_type === 'DIAMOND' || item.object_type === 'GIFT' || item.object_type === 'VIEW'" src="https://yaame-static.yaame.io/admin/cd35dab35714d9bd1962cd0ab34a00ea.png" alt=""/>
                        {{ item.reward_diamond_worth }}
                    </div>
                </div>
            </div>
            <!-- 1000 -->
            <div v-else class="five-award">
                <div v-for="(item, index) in item.charge_reward_items" :key="index"
                     :class="{ award4: index !== 3, vehicle: index === 3 }"
                >
                    <div class="award-img">
                        <img :src="item.reward_icon" alt=""/>
                    </div>
                    <div :class="['award-name', index == 3 && 'award-name-flutter']">
                        {{ item.reward_name }}
                    </div>
                    <div class="award-name diamond">
                        <img v-if="item.object_type === 'DIAMOND' || item.object_type === 'GIFT' || item.object_type === 'VIEW'" src="https://yaame-static.yaame.io/admin/cd35dab35714d9bd1962cd0ab34a00ea.png" alt=""/>
                        {{ item.reward_diamond_worth }}
                    </div>
                </div>
            </div>
            <!-- 是否领取 -->
            <div :class="[
                      'container-get',
                      exchange,
                      item.receive_status === 1
                        ? 'unclaimed'
                        : item.receive_status === 2
                          ? 'received'
                          : 'already',
                    ]" @click="getActivity(item.group_flag, item.receive_status)" ref="exchange"
            >
                <div class="container-get-text">
                    {{
                        item.receive_status === 1
                            ? $t('claim')
                            : item.receive_status === 2
                                ? $t('claimed')
                                : $t('claim')
                    }}
                </div>
            </div>
        </div>
        <!-- footer奖励栏 -->
        <div class="footer">
            <div class="sum no-wrap">{{ $t("totalRecharged", {msg: totalChargeAmount}) }}</div>
            <div class="recharge" @click="navigateToLink">{{ $t('recharge') }}</div>
            <div class="schedule">
                <div class="schedule-img">
                        <span ref="schedule">
                          <img ref="scheduleImg"
                               src="https://yaame-static.yaame.io/admin/925704636024718637aa62aae146d3a2.png" alt=""
                          />
                        </span>
                </div>
                <div class="value">${{ totalChargeAmount }}</div>
                <div class="value">$1500</div>
            </div>
        </div>
        <div class="footer1"></div>
        <!-- 规则页 -->
        <div class="rule" v-show="ruleSwitch" :style="{ height: `${htmlHeight}` }">
            <img src="https://yaame-static.yaame.io/admin/b2f72bc4f490404777a6f194bdc217ab.png" alt=""
                 class="rule-img"
            />
            <div class="activity-rule">
                <div class="rule-header">
                    {{ $t("activityRules") }}
                </div>
                <div class="detail-rule">
                    <p v-for="(item, index) in activityRules" :key="index">
                        {{ item }}
                    </p>
                </div>
                <!-- 关闭按钮 -->
                <img src="https://yaame-static.yaame.io/admin/3216bfa877925b9fe4a3acb482e44b7f.png" alt=""
                     class="close-btn" @click="rule"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
    // 充值返利活动接口方法
    import {
        getRechargeBonus,
        postClaimRechargeBonus,
    } from "@/lib/request/activity";
    import { getLanguage } from "@/lib/device";
    import customHeader from "../../components/common/header.vue";
    import Toast from "../../components/third/toast/toast.js";

    export default {
        components: {
            customHeader,
        },
        setup() {

            const root = getCurrentInstance();

            const t = (val) => {
                return root.proxy.$i18n.t(val)
            }
            // 奖励列表
            let chargeRewardGroups = ref([]);
            // 充值金额
            let totalChargeAmount = ref(0);
            // 活动规则
            let activityRules = ref([]);
            // 控制规则页
            let ruleSwitch = ref(false);
            let htmlHeight = ref(null);
            // 进度条/图片
            let schedule = ref(null);
            let scheduleImg = ref(null);
            // 领取按钮
            let exchange = ref("");
            // 还有多少达到领取档位
            let achieve = ref("");

            onMounted(() => {
                // 充值后回调
                window.onPaySuccess = function () {
                    getData();
                };
                // 奖励档位数据获取
                getData();
                // 页面倒计时显示
                updateTime();
                setInterval(updateTime, 1000);
            });

            // 获取国家
            let language = computed(() => {
                let locale = getLanguage() || "en";
                if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
                    let localEnum = {
                        "zh-hk": "zh-tw",
                        "zh-tw": "zh-tw",
                        "zh-mo": "zh-tw",
                        "zh-cn": "zh-cn",
                        zh_cn: "zh-cn",
                    };

                    locale = localEnum[locale];
                }
                return locale;
            });

            // 充值返利活动接口方法
            const getData = async (data = false, index) => {
                try {
                    let options = {};
                    if (data) {
                        options = {
                            group_flag: data,
                        }
                    }
                    let res = await getRechargeBonus(options);
                    if (res.status === 1000) {
                        chargeRewardGroups.value = res.data.charge_reward_groups;
                        totalChargeAmount.value = res.data.total_charge_amount;
                        achieve.value = res.data.next_reward_tip;
                        activityRules.value = res.data.activity_rule.split("\n");
                    }

                    if (data) {
                        if (data === 'rebate0') return;
                        if (res.data.active === 0) return;
                        if (index === 2) return;
                        if (index === 1) return;



                        Toast(achieve.value);
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            // 充值金额进度条
            let progressPercent = computed(() => (totalChargeAmount.value / 1500) * 7);
            watch(progressPercent, (progressPercent, prevProgressPercent) => {
                // 充值金额进度条
                if (progressPercent > 7) {
                    progressPercent = 7;
                }
                console.log(progressPercent,prevProgressPercent);
                schedule.value.style.width = progressPercent + "rem";
                scheduleImg.value.style.left = progressPercent - 0.28 + "rem";
            });

            // 充值弹窗  wlyaame://mine/shop/diamond?popup=1
            const navigateToLink = () => {
                window.location.href = "wlyaame://mine/shop/diamond?popup=1";
            };

            // 领取接口
            const getActivity = async (data, index) => {
                if (index == 2) return;
                const chargeRewardReceiveRequest = {
                    group_flag: data,
                };
                const res = await postClaimRechargeBonus(chargeRewardReceiveRequest);
                getData(data, index);
                if (index == 1) {
                    Toast(t('prizeInBackpack'));
                } else if (index == 0) {
                    // Toast(achieve.value);
                }
                if (res !== 1000) return;
            };
            // 规则页
            const rule = () => {
                ruleSwitch.value = !ruleSwitch.value;
                htmlHeight.value = document.body.scrollHeight + "px";
            };

            // 页面计时时间
            const targetDate = new Date("2024/02/26 00:00:00").getTime();
            const days = ref(0);
            const hours = ref(0);
            const minutes = ref(0);
            const seconds = ref(0);
            // 时间倒计时
            const updateTime = () => {
                const now = new Date();
                const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // 转换为 UTC 时间
                const timeDifference = targetDate - utcNow.getTime();
                if (timeDifference > 0) {
                    days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    hours.value = Math.floor(
                        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    minutes.value = Math.floor(
                        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
                } else {
                    days.value = 0;
                    hours.value = 0;
                    minutes.value = 0;
                    seconds.value = 0;
                }
            };
            return {
                language,
                chargeRewardGroups,
                totalChargeAmount,
                getActivity,
                ruleSwitch,
                htmlHeight,
                rule,
                activityRules,
                progressPercent,
                schedule,
                scheduleImg,
                days,
                hours,
                minutes,
                seconds,
                exchange,
                navigateToLink,
            };
        },
    };
</script>

<style lang="less" scoped>
.main {
    position: relative;
    min-height: 100vh;
    background-size: 7.5rem 8rem;
    background-repeat: no-repeat;
    padding-top: 6.28rem;



    &.zh-cn {
        background-image: url(https://yaame-static.yaame.io/admin/2e0ad6e2b6a9b97af07823989c81d9d7.png);
    }

    &.zh-tw {
        background-image: url(https://yaame-static.yaame.io/admin/2e0ad6e2b6a9b97af07823989c81d9d7.png);
    }

    &.en {
        background-image: url(https://yaame-static.yaame.io/admin/63bacde8813b86136a036c0764ce2081.png);
    }

    &.id {
        background-image: url(https://yaame-static.yaame.io/admin/32da012f2db5ea3f94e8b835805ed4ca.png);
    }

    &.ar {
        background-image: url(https://yaame-static.yaame.io/admin/ff52d180732c6722e60ca97dc3f3ec81.png);

        .rule-btn {
            position: absolute;
            left: 0.48rem;
            top: 0.88rem;
            width: 0.56rem;
            height: 0.56rem;
            z-index: 9;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .rule-btn {
        position: absolute;
        right: 0.48rem;
        top: 0.88rem;
        width: 0.56rem;
        height: 0.56rem;
        z-index: 9;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .activity-time {
        position: absolute;
        top: 4.09rem;
        left: 1.64rem;
        width: 4.18rem;
        height: 0.24rem;
        font-size: 0.24rem;
        font-weight: normal;
        color: #f5273c;
        line-height: 0.24rem;
        text-align: center;
        transform: scale(0.9);
    }

    .time-span {
        position: absolute;
        top: 5.22rem;
        left: 1.72rem;
        width: 4.05rem;
        height: 0.6rem;
        font-size: 0.32rem;
        font-family: HiraginoSansGB, HiraginoSansGB;
        font-weight: normal;
        color: #ffffff;
        text-align: center;
        line-height: 0.6rem;
        background-image: url("https://yaame-static.yaame.io/admin/d21cff9254726d163392f6c9da4b6309.png");
        background-size: 100%;

        .time {
            float: left;
            width: 0.6rem;
            height: 0.6rem;
            margin-right: 0.1rem;
            background: linear-gradient(180deg, #ff1b40 0%, #ff6913 100%);
            box-shadow: inset 0px 0.03rem 0.05rem 0px rgba(228, 51, 0, 0.5);
            border-radius: 0.08rem;
        }

        .time:nth-child(2) {
            margin-right: 0.45rem;
        }

        .time:nth-child(n + 3) {
            margin-right: 0.25rem;
        }

        .time:nth-child(5) {
            margin: 0;
        }
    }

    .container {
        width: 7rem;
        min-height: 5.9rem;
        background: linear-gradient(180deg, #fff7e7 0%, #ffeeae 100%);
        box-shadow: inset 0 0 0.16rem 0.07rem #ffee58;
        border-radius: 0.2rem;
        border: 0.04rem solid #f21313;
        margin-left: 0.25rem;
        margin-bottom: 0.3rem;

        &.mid {
            height: 5.9rem;
        }

        &.big {
            height: 10rem;
        }

        .container-header {
            width: 5.73rem;
            height: 0.9rem;
            background-image: url(https://yaame-static.yaame.io/admin/7954d698f39c2e6eac0d04ba0090ade5.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-size: 0.36rem;
            font-weight: normal;
            color: #ffffff;
            line-height: 0.9rem;
            text-align: center;
            text-shadow: 0 0.02rem 0.04rem rgba(255, 25, 25, 0.5);
            margin-left: 0.64rem;
        }

        .award {
            width: 1.9rem;
            height: 2.74rem;
            margin: 0.36rem 0 0 2.56rem;

            .award-img {
                width: 1.9rem;
                height: 1.9rem;
            }
        }

        .double-award {
            display: flex;
            justify-content: center;
            margin-top: 0.36rem;

            .award2 {
                width: 1.9rem;
                height: 2.74rem;

                .award-img {
                    width: 1.9rem;
                    height: 1.9rem;
                }
            }

            .award2:nth-child(1) {
                margin-right: 0.8rem;
            }
        }

        .three-award {
            display: flex;
            justify-content: center;
            margin-top: 0.36rem;

            .award3 {
                width: 1.9rem;
                height: 2.74rem;
                margin-right: 0.28rem;

                .award-img {
                    width: 1.9rem;
                    height: 1.9rem;
                }
            }

            .award3:nth-child(3) {
                margin: 0;
            }
        }

        .four-award {
            display: flex;
            justify-content: center;
            margin-top: 0.36rem;
            flex-wrap: wrap;

            .award4 {
                width: 1.9rem;
                height: 2.74rem;
                margin-right: 0.28rem;

                .award-img {
                    width: 1.9rem;
                    height: 1.9rem;
                }
            }

            .flutter {
                display: flex;
                width: 6.26rem;
                height: 2.98rem;
                flex-direction: column;
                align-items: center;
                margin-top: 0.36rem;

                .award-img {
                    width: 6.26rem;
                    height: 2.14rem;
                }
            }

            .award4:nth-child(3) {
                margin: 0;
            }

            .award-name-flutter {
                width: 6.26rem;
            }
        }

        .five-award {
            display: flex;
            justify-content: center;
            margin-top: 0.36rem;
            flex-wrap: wrap;

            .award4 {
                width: 1.9rem;
                height: 2.74rem;
                margin-right: 0.28rem;

                .award-img {
                    width: 1.9rem;
                    height: 1.9rem;
                }
            }

            .vehicle {
                display: flex;
                width: 4.2rem;
                height: 3.72rem;
                flex-direction: column;
                align-items: center;
                margin-top: 0.36rem;

                .award-img {
                    width: 4.2rem;
                    height: 2.88rem;

                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            }

            .award4:nth-child(3) {
                margin: 0;
            }

            .award-name-flutter {
                width: 4.2rem;
            }
        }
    }

    // 奖品文字公共样式
    .award-name {
        width: 1.9rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.3rem;
        font-family: HiraginoSansGB, HiraginoSansGB;
        font-weight: normal;
        color: #812000;
        text-align: center;

        img {
            width: 0.3rem;
            height: 0.24rem;
        }
    }

    .diamond {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .container-get {
        position: relative;
        width: 4.5rem;
        height: 1.24rem;
        margin: 0.3rem 0 0 1.24rem;
        background-size: 100%;
        font-size: 0.32rem;
        font-family: HiraginoSansGB, HiraginoSansGB;
        font-weight: normal;
        color: #ffffff;

        .container-get-text {
            position: absolute;
            bottom: 0.4rem;
            left: 1.93rem;
        }
    }

    //   公共样式
    .award-img {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        box-shadow: inset 0px 0px 0.16rem 0.08rem #ffee58;
        border-radius: 0.1rem;
        border: 0.04rem solid #ff9b02;

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }

    //   进度条
    .footer {
        position: fixed;
        bottom: 0;
        width: 7.5rem;
        height: 1.8rem;
        background-image: url("https://yaame-static.yaame.io/admin/2d35dd7807a0594a2148d3cb5af3496b.png");
        background-size: 100%;
        padding: 0.24rem 0.25rem 0 0.25rem;

        .sum {
            float: left;
            height: 0.36rem;
            font-size: 0.24rem;
            font-family: HiraginoSansGB, HiraginoSansGB;
            font-weight: normal;
            color: #ffffff;
            line-height: 0.36rem;
            margin-top: 0.1rem;
            width: 5.36rem;
        }

        .recharge {
            float: right;
            width: 1.64rem;
            height: 0.5rem;
            background: linear-gradient(360deg, #ff8200 0%, #ffef5f 100%);
            border-radius: 0.45rem;
            border: 0.04rem solid #ef2b2c;
            font-size: 0.24rem;
            font-family: HiraginoSansGB, HiraginoSansGB;
            font-weight: normal;
            color: #ef2b2c;
            text-align: center;
            margin-bottom: 0.2rem;
        }

        .schedule {
            display: flex;
            width: 7rem;
            height: 0.82rem;
            flex-wrap: wrap;
            justify-content: space-between;

            .schedule-img {
                position: relative;
                width: 7rem;
                height: 0.3rem;
                background: #e01313;
                border-radius: 0.15rem;
                border: 0.04rem solid #ff4d55;

                span {
                    position: absolute;
                    height: 0.22rem;
                    background: linear-gradient(270deg,
                    #ffee93 0%,
                    #ffb414 44%,
                    #ff8314 100%);
                    border-radius: 0.11rem;

                    img {
                        position: absolute;
                        top: -0.2rem;
                        left: -0.28rem;
                        width: 0.64rem;
                        height: 0.64rem;
                    }
                }
            }

            .value {
                font-size: 0.24rem;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                color: #ffce57;
            }
        }
    }

    .footer1 {
        height: 1.8rem;
    }

    //   灰色
    .already {
        background-image: url("https://yaame-static.yaame.io/admin/d8283a84a74de5e24fadfd747e664738.png") !important;
    }

    .received {
        background-image: url("https://yaame-static.yaame.io/admin/d8283a84a74de5e24fadfd747e664738.png");

        .container-get-text {
            left: 1.78rem;
        }
    }

    //   红色
    .unclaimed {
        background-image: url("https://yaame-static.yaame.io/admin/68a8a0ddd53b94dc587b53cfae8cc6da.png");
    }

    .rule {
        position: absolute;
        top: 0;
        // height: 100%;
        width: 7.5rem;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;

        .rule-img {
            position: absolute;
            top: 1.72rem;
            left: 0.99rem;
            width: 5.51rem;
            height: 3.15rem;
        }

        .activity-rule {
            position: fixed;
            top: 2.85rem;
            width: 7rem;
            height: 9.4rem;
            margin: 0 0.25rem;
            background: linear-gradient(180deg, #fff7e7 0%, #ffeeae 100%);
            box-shadow: inset 0px 0px 16px 8px #ffee58;
            border-radius: 20px;
            border: 0.04rem solid #f21313;

            .rule-header {
                width: 5.73rem;
                height: 0.9rem;
                background-image: url(https://yaame-static.yaame.io/admin/7954d698f39c2e6eac0d04ba0090ade5.png);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                font-size: 0.36rem;
                font-weight: normal;
                color: #ffffff;
                line-height: 0.9rem;
                text-align: center;
                text-shadow: 0 0.02rem 0.04rem rgba(255, 25, 25, 0.5);
                margin-left: 0.64rem;
            }

            .detail-rule {
                width: 6.04rem;
                margin: 0.36rem 0 0 0.48rem;
                font-size: 0.26rem;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #3a4260;
                line-height: 0.48rem;
            }

            .close-btn {
                position: absolute;
                bottom: -0.8rem;
                left: 50%;
                width: 0.5rem;
                height: 0.5rem;
                transform: translateX(-50%);
            }
        }
    }
}
</style>
