<template>
  <div class="main" ref="main">
      <div class="shell">
          <!--标题-->
          <custom-header class="header" color="eid" :apparentTitle="$t('task')" @cut="cutRule" :dom-main="main">
              <template v-slot:default>
                  <div class="header-title">{{ $t('task') }}</div>
              </template>
          </custom-header>

          <!--倒计时-->
          <div class="time-span" :style="{ marginTop: (((safe_area * 2) / 100) + 1.22) + 'rem' }">
              <div class="time">{{ hours < 10 ? '0' + hours : hours }}<div class="time-lift"></div></div>:
              <div class="time">{{ minutes < 10 ? '0' + minutes : minutes }}</div>:
              <div class="time">{{ seconds < 10 ? '0' + seconds : seconds }}<div class="time-right"></div></div>
          </div>

          <!--倒计时文案-->
          <div class="count-down-title">{{ $t('refresh_task_status') }}</div>

          <!--tab-->
          <div class="tab" ref="tabTop">
              <div class="tabs" :class="{ 'opt-for': Tab === item.type }" v-for="(item, index) in tab" :key="index" @click="cutTab(item.type)">
                  <span>{{ item.name }}</span>
              </div>
          </div>

          <!--奖励-->
          <div v-show="Tab === 'giveGift'" class="activity-gift">
              <!--表头-->
              <div class="activity-header">{{ $t('event_gift') }}</div>
              <!--左右角标-->
              <div class="angle-left"></div>
              <div class="angle-right"></div>
              <!--礼物-->
              <div class="gift" v-for="(item, index) in giftConfigItem" :key="index">
                  <div class="gifts"></div>
                  <img class="icon" :src="item.icon" alt="">
                  <div class="name">{{ item.gift_name }}</div>
                  <div class="diamond">
                      <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
                      {{ item.diamond_worth }}
                  </div>
              </div>
              <!--说明文案-->
              <div class="explain">{{ $t('complete_task_by_gifting') }}</div>
          </div>

          <!--抽奖任务-->
          <div v-show="Tab === 'takeOut'" class="task" :style="{ marginTop: '1.72rem' }">
              <!--背景-->
              <div class="frame-task"></div>
              <!--表头-->
              <div class="task-header">{{ $t('task') }}</div>
              <!--左右角标-->
              <div class="angle-left"></div>
              <div class="angle-right"></div>
              <!--任务项-->
              <div class="frame">
                  <div class="task-list" v-for="(item, index) in taskLotteryList" :key="index">
                      <div class="item-reward">
                          <p>{{ item.task_name }}<span>({{ item.current_progress }}/{{ item.overall_progress }})</span></p>
                          <div class="content">
                              <span>{{ $t('reward') }}:</span>
                              <div class="number" v-for="(ite, inx) in item.rewards" :key="inx">
                                  <img :src="ite.reward_icon" alt="">
                                  <span>X{{ ite.reward_desc }}</span>
                              </div>
                          </div>
                      </div>
                      <div class="get-button" :class="[ item.reward_status === 1 ? 'get' : item.reward_status === 2 ? '' : 'unfinished' ]" @click="getAward(item)">
                          {{ item.reward_status === 1 ? $t('btn-can-get') : item.reward_status === 2 ? $t('received') : $t('btn-can-get') }}
                      </div>
                  </div>
              </div>
          </div>
          <!--送礼任务-->
          <div v-show="Tab === 'giveGift'" class="task" :style="{ marginTop: '.24rem' }">
              <!--背景-->
              <div class="frame-task"></div>
              <!--表头-->
              <div class="task-header">{{ $t('task') }}</div>
              <!--左右角标-->
              <div class="angle-left"></div>
              <div class="angle-right"></div>
              <!--任务项-->
              <div class="frame">
                  <div class="task-list" v-for="(item, index) in taskSendGiftList" :key="index">
                      <div class="item-reward">
                          <p>{{ item.task_name }}<span>({{ item.current_progress }}/{{ item.overall_progress }})</span></p>
                          <div class="content">
                              <span>{{ $t('reward') }}:</span>
                              <div class="number" v-for="(ite, inx) in item.rewards" :key="inx">
                                  <img :src="ite.reward_icon" alt="">
                                  <span>X{{ ite.reward_desc }}</span>
                              </div>
                          </div>
                      </div>
                      <div class="get-button" :class="[ item.reward_status === 1 ? 'get' : item.reward_status === 2 ? '' : 'unfinished' ]" @click="getAward(item)">
                          {{ item.reward_status === 1 ? $t('btn-can-get') : item.reward_status === 2 ? $t('received') : $t('btn-can-get') }}
                      </div>
                  </div>
              </div>
          </div>

          <rule
              v-show="ballRule"
              class="rule-style"
              :title="t('rules')"
              :buttonContent="t('gotIt')"
              background-image="https://yaame-static.yaame.io/admin/ce0e1ac92a405d65318d0a8555b45393.png"
              height="6.98rem"
              width="5.9rem"
              :cutRule="cutRule"
          >
              <template v-slot:default>
                  <div class="content">
                      <span>{{ $t('task_event_time') }}</span>
                      <p>{{ $t('task_event_start_time') }}</p>
                      <p>{{ $t('task_event_end_time') }}</p>
                      <span>{{ $t('task_event_description') }}</span>
                      <p>{{ $t('task_rule_1') }}</p>
                      <p>{{ $t('task_rule_2') }}</p>
                      <p>{{ $t('task_rule_3') }}</p>
                      <p>{{ $t('task_rule_4') }}</p>
                  </div>
              </template>
          </rule>
      </div>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header";
import {getCurrentInstance, onMounted, ref, onBeforeUnmount} from "vue";
import Rule from "./ruleCommon.vue";
import { getSafeHeight } from "@/lib/device"
import { Toast } from "vant";
import { getLanguage } from "@/lib/device";
import {getTaskListInfoApi, postTaskRewardApi} from "../api";

// 获取国家
let locale = getLanguage() || "en";

// 国际化
const root = getCurrentInstance();
const t = (value) => {
    return root.proxy.$i18n.t(value);
}
// tab
const Tab = ref('takeOut');
const tab = ref([
    {
        name: t('draw_task'),
        type: 'takeOut'
    },
    {
        name: t('gift_task'),
        type: 'giveGift'
    }
])
const cutTab = (value) => {
    Tab.value = value;
}

// 获取页面信息
const taskLotteryList = ref([]);
const taskSendGiftList = ref([]);
const giftConfigItem = ref([]);
const getTaskData = async () => {
    try {
        const res = await getTaskListInfoApi();
        if (res.status !== 1000) return;
        taskLotteryList.value = res.data.task_lottery_list;
        taskSendGiftList.value = res.data.task_send_gift_list;
        giftConfigItem.value = res.data.gift_config_item_vos;
    } catch (err) {
        console.log(err)
    }
}

// 领取任务奖励
const getAward = async (item) => {
    try {
        if (item.reward_status !== 1) return;
        const res = await postTaskRewardApi({
            eid_al_ad_task_type: item.task_flag,
            time_cycle_flag: item.time_cycle_flag
        })
        if (res.status === 10020) {
            Toast(res.desc);
            await getTaskData();
            return;
        }
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        Toast(t('reward_already_received'));
        await getTaskData();
    } catch (err) {
        console.log(err);
    }
}


// 规则弹窗
const ballRule = ref(false);
const cutRule = () => {
    ballRule.value = !ballRule.value;
    if (ballRule.value) {
        main.value.style.overflow = "hidden";
    } else {
        main.value.style.overflow = "auto";
    }
}

// tab吸顶
let tabTop = ref();
let safe_area = getSafeHeight() || 0;
// 页面ref
const main = ref(null);
// 页面卷去高度
const bodyTop = () => {
    if (!tabTop.value) return;
    // 获取动态的字体大小
    const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // 算出屏幕到达的固定位置
    const targetPixeValue = main.value.scrollTop / htmlSize;
    if (targetPixeValue >= ((safe_area * 2) / 100) + 1.22) {
        tabTop.value.style.position = 'fixed';
        let safe_height = (safe_area * 2) / 100;
        tabTop.value.style.top = (1.12 + safe_height) +'rem' ;
    } else if (targetPixeValue < ((safe_area * 2) / 100) + 1.22) {
        tabTop.value.style.position = 'absolute';
        tabTop.value.style.top = '3.78rem' ;
    }
};

// 页面计时时间
const targetDate = new Date("2024/6/22 00:00:00").getTime();
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

// 定时器倒计时
let timeOut = null;
const openTiming = () => {
    timeOut = setInterval(() => {
        updateTime();
    },1000)
}

onMounted(() => {
    document.body.style.backgroundColor = '#005F56';
    // 监听页面滚动事件
    main.value.addEventListener('scroll', bodyTop);
    // 获取页面数据
    getTaskData();
    // 开启页面倒计时
    openTiming();
})
// 关闭定时器
onBeforeUnmount(() => {
    clearInterval(timeOut);
})
</script>

<style lang="less" scoped>
.main {
    height: 100vh;
    padding-bottom: .69rem;
    overflow: auto;

    .shell {
        position: relative;
        min-height: 100vh;
        background: url("https://yaame-static.yaame.io/admin/406cc3a613c85de1eb757a17d96051f0.png") no-repeat;
        background-size: contain;
        overflow: hidden;
    }

    .header {
        .header-title {
            color: #fff;
        }
    }

    // 倒计时
    .time-span {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 3.74rem;
        height: 1.02rem;
        margin: 1.73rem auto 0;
        font-size: .35rem;
        color: #F9DE4A;
        .time {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.01rem;
            height: 1.02rem;
            background: url("https://yaame-static.yaame.io/admin/b4e3bc30be7a4e36c396ae62b0fdffc7.png") no-repeat;
            background-size: contain;
            font-size: .49rem;
            .time-lift,
            .time-right {
                position: absolute;
                top: .42rem;
                left: -0.07rem;
                width: .08rem;
                height: .18rem;
                background-image: url("https://yaame-static.yaame.io/admin/70e35d1110af46465ae8b428702d4b57.png");
                background-repeat: no-repeat;
                background-size: contain;
            }
            .time-right {
                left: 1.01rem;
                background-image: url("https://yaame-static.yaame.io/admin/05860b623a3c0ef7bd2efe6b8a061c99.png");
            }
        }
    }

    // 倒计时文案
    .count-down-title {
        height: .24rem;
        margin: .25rem auto 0;
        line-height: .24rem;
        font-size: .24rem;
        color: #FFFFFF;
        text-align: center;
    }

    // tab
    .tab {
        position: absolute;
        top: 3.78rem;
        left: 50%;
        display: flex;
        justify-content: space-between;
        width: 6.7rem;
        height: .92rem;
        transform: translateX(-50%);
        font-weight: 600;
        font-size: .24rem;
        z-index: 3;
        .tabs {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 3.26rem;
            height: .92rem;
            padding-top: .34rem;
            background-image: url("https://yaame-static.yaame.io/admin/b36232a7e781f78e4629cdadc80f191b.png");
            background-repeat: no-repeat;
            background-size: cover;
            color: #6E5820;
            transition-duration: .3s;
            span {
                opacity: .6;
            }
        }
        .opt-for {
            color: #206E3A;
            background-image: url("https://yaame-static.yaame.io/admin/338e1580a8b1c919d83eda2014b27ded.png");
            span {
                opacity: 1;
            }
        }
    }

    // 活动礼物
    .activity-gift {
        display: flex;
        position: relative;
        width: 6.9rem;
        min-height: 4.62rem;
        margin: 1.72rem auto 0;
        padding-top: 1.42rem;
        padding-left: .22rem;
        background: url("https://yaame-static.yaame.io/admin/2d04d91b1cde576cdf689d424c847d18.png") no-repeat;
        background-size: cover;
        border-radius: .24rem;

        .activity-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 50%;
            width: 3.22rem;
            height: .8rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/aa3cc16df3a23520b0b35f4f435d312e.png") no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: .36rem;
            color: #FFFFFF;
        }

        .angle-left,
        .angle-right {
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .86rem;
            height: .86rem;
            background-image: url("https://yaame-static.yaame.io/admin/abc73dcfa9eaf2d30d148e557aa70523.png");
            background-repeat: no-repeat;
            background-size: contain;
        }
        .angle-right {
            left: 5.94rem;
            background-image: url("https://yaame-static.yaame.io/admin/b9edc8e35db885362472819e05161d1a.png");
        }

        .gift {
            position: relative;
            width: 1.48rem;
            height: 1.48rem;
            margin-left: .18rem;
            color: #FFF;
            .icon {
                position: absolute;
                top: .14rem;
                left: .14rem;
                width: 1.2rem;
            }
            .gifts {
                width: 1.48rem;
                height: 1.48rem;
                background: #000000;
                border-radius: .18rem;
                opacity: 0.2;
            }
            .name {
                position: absolute;
                left: 50%;
                top: 1.6rem;
                height: .18rem;
                transform: translateX(-50%);
                line-height: .18rem;
                font-size: .18rem;
                white-space: nowrap;
            }
            .diamond {
                position: absolute;
                left: 50%;
                top: 1.86rem;
                display: flex;
                justify-content: center;
                align-items: center;
                transform: translateX(-50%);
                font-size: .2rem;
                height: .24rem;
                img {
                    width: .24rem;
                    height: .24rem;
                }
            }
        }
        .gift:nth-child(4) {
            margin: 0;
        }

        .explain {
            position: absolute;
            bottom: .4rem;
            left: 50%;
            width: 90%;
            height: .3rem;
            transform: translateX(-50%);
            line-height: .3rem;
            font-size: .24rem;
            color: #F9DE4A;
            text-align: center;
        }
    }

    // 任务
    .task {
        position: relative;
        width: 6.9rem;
        min-height: 10rem;
        margin: auto;
        padding-top: 1.42rem;

        .frame-task {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background: url("https://yaame-static.yaame.io/admin/2d04d91b1cde576cdf689d424c847d18.png") no-repeat;
            background-size: contain;
        }

        .task-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 50%;
            width: 3.22rem;
            height: .8rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/aa3cc16df3a23520b0b35f4f435d312e.png") no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: .36rem;
            color: #FFFFFF;
        }

        .angle-left,
        .angle-right {
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .86rem;
            height: .86rem;
            background-image: url("https://yaame-static.yaame.io/admin/abc73dcfa9eaf2d30d148e557aa70523.png");
            background-repeat: no-repeat;
            background-size: contain;
        }
        .angle-right {
            left: 5.94rem;
            background-image: url("https://yaame-static.yaame.io/admin/b9edc8e35db885362472819e05161d1a.png");
        }
        .frame {
            width: 6.9rem;
            background: #287249;
            border-radius: 0 0 .24rem .24rem;
            overflow: hidden;
            .task-list {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 6.3rem;
                //height: .74rem;
                margin: 0 auto .5rem;
                color: #FFFFFF;
                .item-reward {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    p {
                        font-weight: 500;
                        font-size: .30rem;
                        line-height: 2;
                        span {
                            opacity: .8;
                        }
                    }
                    .content {
                        display: flex;
                        flex-wrap: wrap;
                        .number {
                            display: flex;
                            justify-content: center;
                            margin-left: .1rem;
                            margin-bottom: .1rem;
                            align-items: center;
                        }
                        span {
                            opacity: .4;
                            font-size: .24rem;
                        }
                        img {
                            width: .4rem;
                            height: .4rem;
                        }
                    }
                }

                .get-button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.46rem;
                    height: .6rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    font-weight: 600;
                    font-size: .24rem;
                    color: #30B553;
                }
                .get {
                    background-image: url("https://yaame-static.yaame.io/admin/b3fdcdde279701986ff47b0a9e7dc98f.png");
                    color: #FFFFFF;
                }
                .unfinished {
                    background-image: url("https://yaame-static.yaame.io/admin/d7fd55bbfaab37366c171a5b292f67fd.png");
                    color: #FFFFFF;
                }
            }
        }
    }

    .rule-style {
        z-index: 99999;
        .content {
            display: flex;
            flex-direction: column;
            width: 5.06rem;
            height: 4.08rem;
            margin: 1.2rem auto 0;
            overflow-y: auto;
            span {
                font-weight: 600;
                font-size: .26rem;
                color: #FFFFFF;
            }

            p {
                font-size: .26rem;
                color: #FFFFFF;
                opacity: .6;
            }
        }
    }
}
</style>
