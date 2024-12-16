<template>
  <div class="main" :style="{ backgroundImage: `url(${headImg[locale]})` }">
      <!--标题-->
      <custom-header class="header" color="white">{{ $t('draw') }}</custom-header>
      <!--历史-->
      <div class="history" @click="cutHistoryRule">{{ $t('history') }}</div>
      <!--活动规则-->
      <div class="activity-rule" @click="cutRule">{{ $t('activity_rules') }}</div>
      <!--奖池-->
      <div class="jackpot">
          <div class="jackpot-header">{{ $t('prize_pool') }}</div>
          <div class="jackpot-diamond">
              <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
              {{ jackpotNumber }}
          </div>
          <div class="rule">
              <p>{{ $t('top_10_share_pool') }}</p>
              <span @click="$router.replace('/index/ranking')">{{ $t('view_leaderboard') }}></span>
          </div>
      </div>
      <!--底座-->
      <div class="pedestal">
          <!--转盘-->
          <div class="turntable" ref="turntable">
              <div class="award-item" v-for="(item, index) in HomeList" :key="index" :style="{ transform: `rotate(${Math.ceil(27.7 * (index + 7))}deg)` }">
                  <img :src="item.icon" alt="">
                  <div class="award-name">{{ item.reward_name }}</div>
              </div>
          </div>
          <!--边框-->
          <div class="frame"></div>
          <!--指针-->
          <div class="pointer"></div>
          <!--抽奖-->
          <div class="lucky-take">
              <div class="lucky" :class="{ 'lucky-no': throttle && atPresent === item.lottery_times }" v-for="(item, index) in luckyButton" :key="index" @click="startPlay(item.lottery_times, item.number)">
                  <div class="name">{{ item.nameHome }}</div>
                  <div class="diamond">
                      <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
                      {{ item.number }}
                  </div>
              </div>
          </div>
          <!--跳过动画-->
          <div class="skip" @click="cutSkipAnimation">
              <span>
                  <van-icon v-show="skipAnimation" name="success" />
              </span>
              {{ $t('skip_animation') }}
          </div>
      </div>
      <!--我的钻石-->
      <div class="my-diamond">
          <div class="my-name">{{ $t('my_diamonds') }}</div>
          <div class="diamond-number">
              <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
              {{ myNumber }}
          </div>
      </div>

      <!--中奖弹窗-->
      <popup v-show="luckyTake" @cancel="cutLuckyTake">
          <div class="hit-the-target" :class="{ 'hit-the-target-few': hitTheTargetList.length <= 3 }">
              <!--头部-->
              <div class="header">
                  <div class="rule-left"></div>
                  <div class="head">{{ $t('my_prizes') }}</div>
                  <div class="rule-right"></div>
              </div>
              <!--具体奖励-->
              <div class="hit-the-target-item" :class="{ 'hit-the-target-item-few': hitTheTargetList.length <= 3 }">
                  <div class="item" v-for="(item, index) in hitTheTargetList" :key="index">
                      <div class="number">{{ hitTheTargetList.length <= 3 ? '' : 'X' }}{{ item.reward_num }}</div>
                      <div class="backdrop">
                          <img :src="item.icon" alt="">
                      </div>
                      <div class="text">{{ item.reward_name }}</div>
                  </div>
              </div>
              <!--抽奖-->
              <div class="lucky-take" :class="{ 'lucky-take-few': hitTheTargetList.length <= 3 }">
                  <div class="lucky" v-for="(item, index) in luckyButton" :key="index" @click="startPlay(item.lottery_times, item.number)">
                      <div class="name">{{ item.nameHitTheTarget }}</div>
                      <div class="diamond">
                          <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
                          {{ item.number }}
                      </div>
                  </div>
              </div>

              <div class="close" @click="cutLuckyTake"></div>
          </div>
      </popup>

      <!--规则-->
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
                  <p>{{ $t('turntable_rule_1') }}</p>
                  <p>{{ $t('turntable_rule_2') }}</p>
                  <p>{{ $t('turntable_rule_3') }}</p>
                  <p>{{ $t('turntable_rule_4') }}</p>
                  <p>{{ $t('turntable_rule_5') }}</p>
              </div>
          </template>
      </rule>

      <!--历史-->
      <rule
          v-if="historyRule"
          class="history-rule"
          :title="$t('history')"
          :closeButton="false"
          background-image="https://yaame-static.yaame.io/admin/3111fc494228cb7fe75c87d970acff57.png"
          height="7.68rem"
          width="5.94rem"
          :cutRule="cutHistoryRule"
      >
          <template v-slot:default>
              <div class="content">
                  <!--每条-->
                  <div v-if="rewardHistoryList.length" class="history-item" v-for="(item, index) in rewardHistoryList" :key="index">
                      <span>{{ formatDate(item.create_time, 'yyyy.MM.dd hh:mm:ss') }}</span>
                      <!--详细奖励-->
                      <div class="list" v-for="(ite, inx) in item.reward_item_list" :key="inx">
                          <div class="frame"></div>
                          <div class="bg"></div>
                          <img :src="ite.icon" alt="">
                          <div class="number">x{{ ite.reward_num }}</div>
                          <div class="name">{{ ite.reward_name }}*{{ ite.reward_num }}</div>
                      </div>
                  </div>
                  <div v-if="!rewardHistoryList.length" class="history-no">
                      <p>{{ $t('no_lottery_participation') }}</p>
                  </div>
              </div>
              <div class="close" @click="cutHistoryRule"></div>
          </template>
      </rule>
      <pageLoading class="loading" v-show="loading"></pageLoading>
  </div>
</template>

<script setup>
import {onMounted, ref, getCurrentInstance} from "vue";
import {getLotteryInfoApi, getRewardHistoryApi, postLotteryApi} from "../api";
import popup from "@/components/common/pop_up.vue";
import Rule from "./ruleCommon.vue";
import { formatDate } from '@/lib/utils';
import pageLoading from '@/components/common/page_loading.vue';
import { getLanguage } from "@/lib/device";
import customHeader from "@/components/common/header.vue";
import { Toast } from "vant";

// 国际化
const root = getCurrentInstance();
const t = (value) => {
    return root.proxy.$i18n.t(value);
}

// 获取国家
let locale = getLanguage() || "en";
// 页面头图
const headImg = ref({
    "ar": "https://yaame-static.yaame.io/admin/ae0ff08c7cea4fe3d3a61771f68cb5d4.png",
    "en": "https://yaame-static.yaame.io/admin/5131251255a659c8a6896c7f151e9d57.png",
    "id": "https://yaame-static.yaame.io/admin/8987c20f0c793eba47e2ba158c6d7969.png",
    "zh-cn": 'https://yaame-static.yaame.io/admin/f087baf1978ceca514e0989899d39efe.png',
    "zh-tw": "https://yaame-static.yaame.io/admin/17989bc6efd77180e628383dd35b0ad1.png",
})

// 抽奖按钮
const luckyButton = ref([
    {
        nameHome: t('draw_once'),
        nameHitTheTarget: t('try_again_1'),
        lottery_times: 1,
        number: 20
    },
    {
        nameHome: t('draw_10_times'),
        nameHitTheTarget: t('try_again_10'),
        lottery_times: 10,
        number: 200
    },
    {
        nameHome: t('draw_50_times'),
        nameHitTheTarget: t('try_again_50'),
        lottery_times: 50,
        number: 1000
    },
])
// 是否跳过动画
const skipAnimation = ref(false);
const cutSkipAnimation = () => {
    skipAnimation.value = !skipAnimation.value;
    if (skipAnimation.value) {
        config.value.duration = 2000;
        config.value.circle = 1;
        openSpeedTime.value = 2500;
    } else {
        config.value.duration = 5000;
        config.value.circle = 7;
        openSpeedTime.value = 5500;
    }
}

// 动画配置
const config = ref({
    duration: 5000, // 总旋转时间 ms级
    circle: 7, // 旋转圈数
    mode: 'ease-in-out', // 由快到慢
});
// 弹窗打开速度
const openSpeedTime = ref(5500);

// 页面信息
const HomeList = ref([]);
// 我的钻石数
const myNumber = ref(0);
// 奖池数
const jackpotNumber = ref(0);
// 获取页面信息
const getHomeList = async () => {
    try {
        const res = await getLotteryInfoApi();
        if (res.status !== 1000) return;
        HomeList.value = res.data.lottery_info_list;
        myNumber.value = res.data.diamond_balance;
        jackpotNumber.value = res.data.reward_pool;
    } catch (err) {
        console.log(err);
    }
}

// 中奖弹窗数据
const hitTheTargetList = ref([]);
// 抽奖结果
let result = 0;
// 计算抽奖结果
const calculate = (ite) => {
    // 动画到最后一条数据
    const num = ite.length;
    HomeList.value.forEach((item, index) => {
        if (item.eid_al_ad_ingredients_type === ite[num - 1].eid_al_ad_ingredients_type) {
            result = index;
        }
    })
    // 获取中将弹窗数据
    hitTheTargetList.value = ite;
}

// 节流阀
const throttle = ref(false);
// 记录当前点击
const atPresent = ref(0);
// 开始抽奖
const startPlay = async (value, number) => {
    if (myNumber.value < number) {
        Toast(t('Diamonds'));
        navigateToLink();
        return;
    }
    try {
        // 开启节流阀
        if (throttle.value) return;
        throttle.value = true;
        // 获取当前点击按钮
        atPresent.value = value;
        // 判断弹窗是否开启状态
        if (luckyTake.value) luckyTake.value = false;
        const res = await postLotteryApi({
            lottery_times: value
        })
        if (res.status !== 1000) {
            throttle.value = false;
            Toast(res.desc);
            return
        }
        // 刷新钻石
        await getHomeList();
        // 计算抽到结果
        calculate(res.data.reward_items);
        // 开始动画
        animationPlay();
        // 打开中奖弹窗
        setTimeout(() => {
            cutLuckyTake();
            throttle.value = false;
        }, openSpeedTime.value);
    } catch (err) {
        console.log(err)
    }
}

// 充值弹窗  wlyaame://mine/shop/diamond?popup=1
const navigateToLink = () => {
    window.location.href = "wlyaame://mine/shop/diamond?popup=1";
};

// 获取轮盘
const turntable = ref(null);
// 旋转角度
let angle = 0;
// 记录上次下标
const upIndex = ref(0);
// 记录抽了第几次了
const always = ref(0);
// 动画效果
const animationPlay = () => {
    // 初始化状态
    // turntable.value.style.removeProperty('transition');
    // turntable.value.style.removeProperty('transform');
    // 强制重绘
    // turntable.value.offsetHeight;

    const number = always.value < 1 ? -13.5 : 0.5
    angle += config.value.circle * 360 - Math.ceil((result - upIndex.value) * 27.7) + number;
    turntable.value.style.transition = `transform ${config.value.duration}ms ${config.value.mode}`;
    turntable.value.style.transform = `rotate(${angle}deg)`;

    upIndex.value = result;
    always.value++;
}

// 中奖弹窗
const luckyTake = ref(true);
const cutLuckyTake = () => {
    luckyTake.value = !luckyTake.value;
}

// 规则弹窗
const ballRule = ref(false);
const cutRule = () => {
    ballRule.value = !ballRule.value;
}

// 历史弹窗
const historyRule = ref(false);
const cutHistoryRule = () => {
    historyRule.value = !historyRule.value;
    if (historyRule.value) {
        rewardHistoryData();
    }
}

// 历史记录
const rewardHistoryList = ref([]);
const rewardHistoryData = async () => {
    try {
        const res = await getRewardHistoryApi();
        if (res.status !== 1000) return;
        rewardHistoryList.value = res.data.reward_log_history_vo_list;
    } catch (err) {
        console.log(err);
    }
}
let loading = ref(true);
onMounted(async () => {
    await getHomeList();
    await rewardHistoryData();

    // 关闭中奖弹窗
    luckyTake.value = false;
    loading.value = false;

    // 充值后回调
    window.onPaySuccess = function () {
        getData();
    };
})
</script>

<style lang="less" scoped>
.main {
    width: 7.5rem;
    min-height: 100vh;
    background-repeat: no-repeat;
    background-size: 100%;
    overflow: hidden;

    .history,
    .activity-rule {
        position: absolute;
        top: 1.85rem;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 1.49rem;
        height: .6rem;
        padding-left: .15rem;
        background: url("https://yaame-static.yaame.io/admin/e11c8cb7d7f227463ab9d9c4a6b1a295.png") no-repeat;
        background-size: 100% 100%;
        font-weight: 600;
        font-size: .24rem;
        color: #854304;
    }
    .activity-rule {
        top: 2.77rem;
    }

    // 奖池
    .jackpot {
        position: relative;
        width: 6.5rem;
        height: 2.13rem;
        margin: 3.46rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/aba01db578ed67b10d0dad52ce931a6b.png") no-repeat;
        background-size: cover;
        .jackpot-header {
            position: absolute;
            top: .13rem;
            left: 50%;
            height: .24rem;
            line-height: .24rem;
            transform: translateX(-50%);
            font-size: .24rem;
            color: #854304;
        }

        .jackpot-diamond {
            position: absolute;
            top: .51rem;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: .9rem;
            transform: translateX(-50%);
            font-weight: 600;
            font-size: .64rem;
            //color: #F9DB61;
            background: linear-gradient(90deg, #FFF195 0%, #FFDA56 100%);
            -webkit-background-clip: text;
            color: transparent;

            img {
                width: .48rem;
                height: .41rem;
                margin-right: .19rem;
            }
        }

        .rule {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: .39rem;
            left: 50%;
            width: 90%;
            height: .33rem;
            transform: translateX(-50%);
            font-size: .24rem;
            color: #FFE399;
            line-height: .33rem;
            p {
                margin-right: .24rem;
                text-align: center;
            }
        }
    }

    // 底座
    .pedestal {
        display: flex;
        position: relative;
        width: 7.5rem;
        height: 10.41rem;
        margin: .47rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/0d4e1e7d9aaeb92ce1f7a4423d0ce950.png") no-repeat;
        background-size: cover;

        .turntable {
            position: relative;
            width: 6.76rem;
            height: 6.76rem;
            margin: .24rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/8547176c11a832bcb933d10bde16d7df.png") no-repeat;
            background-size: cover;

            .award-item {
                position: absolute;
                width: .83rem;
                font-weight: 500;
                font-size: .18rem;
                color: #FFF89F;
                transform-origin: 50% 0;
                img {
                    width: 100%;
                }
                .award-name {
                    position: absolute;
                    top: .89rem;
                    left: 50%;
                    height: .25rem;
                    line-height: .25rem;
                    transform: translateX(-50%);
                    white-space: nowrap;
                }
            }
            .award-item:nth-child(1) {
                top: 1.48rem;
                left: 3.45rem;
            }
            .award-item:nth-child(2) {
                top: 1.91rem;
                left: 4.25rem;
            }
            .award-item:nth-child(3) {
                top: 2.71rem;
                left: 4.8rem;
            }
            .award-item:nth-child(4) {
                top: 3.6rem;
                left: 4.9rem;
            }
            .award-item:nth-child(5) {
                top: 4.5rem;
                left: 4.55rem;
            }
            .award-item:nth-child(6) {
                top: 5.1rem;
                left: 3.85rem;
            }
            .award-item:nth-child(7) {
                top: 5.35rem;
                left: 2.98rem;
            }
            .award-item:nth-child(8) {
                top: 5.1rem;
                left: 2.1rem;
            }
            .award-item:nth-child(9) {
                top: 4.5rem;
                left: 1.4rem;
            }
            .award-item:nth-child(10) {
                top: 3.6rem;
                left: 1.05rem;
            }
            .award-item:nth-child(11) {
                top: 2.71rem;
                left: 1.15rem;
            }
            .award-item:nth-child(12) {
                top: 1.91rem;
                left: 1.7rem;
            }
            .award-item:nth-child(13) {
                top: 1.48rem;
                left: 2.49rem;
            }
        }

        .frame {
            position: absolute;
            left: 50%;
            top: -0.24rem;
            width: 7.48rem;
            height: 6.79rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/2f1b652bc3bd6c47e202de78327ce148.png") no-repeat;
            background-size: cover;
        }

        .pointer {
            position: absolute;
            top: 1.47rem;
            left: 50%;
            width: 2rem;
            height: 3.15rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/h5/85ab519be2af03a11e239d059a6a790b.png") no-repeat;
            background-size: cover;
        }

        .lucky-take {
            position: absolute;
            display: flex;
            justify-content: space-evenly;
            bottom: .85rem;
            width: 100%;

            .lucky-no {
                background-image: url("https://yaame-static.yaame.io/admin/d3d33b07efe611420fcc281edc58d385.png") !important;
            }

            .lucky {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 2.36rem;
                height: 1.02rem;
                background-image: url("https://yaame-static.yaame.io/admin/321b70c44016513fe6bbb4bff9661cb0.png");
                background-repeat: no-repeat;
                background-size: cover;

                .name {
                    height: .2rem;
                    line-height: .15rem;
                    font-weight: 500;
                    font-size: .22rem;
                    color: #265F53;
                }

                .diamond {
                    display: flex;
                    justify-content: center;
                    align-items: baseline;
                    height: 0.2rem;
                    font-weight: 600;
                    font-size: .22rem;
                    color: #FFF89F;
                    img {
                        width: .21rem;
                        height: .17rem;
                    }
                }
            }
        }

        .skip {
            position: absolute;
            bottom: .43rem;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateX(-50%);
            font-weight: 600;
            font-size: .22rem;
            color: #FFF89F;
            span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: .26rem;
                height: .26rem;
                margin-right: .09rem;
                background: #246942;
                border-radius: .05rem;
                border: .01rem solid #FFF89F;
            }
        }
    }

    .my-diamond {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 5.75rem;
        min-width: 1.92rem;
        height: .91rem;
        padding-right: .3rem;
        background: url("https://yaame-static.yaame.io/admin/dad6f1d089057550851e247efe6a21e6.png") no-repeat;
        background-size: 100% 100%;
        font-size: .22rem;
        color: #FFF89F;

        .my-name {
            height: .3rem;
            line-height: .3rem;
            text-align: center;
        }

        .diamond-number {
            display: flex;
            justify-content: center;
            align-items: center;
            height: .3rem;
            font-weight: 600;
            img {
                width: .21rem;
                height: .17rem;
            }
        }
    }

    // 中奖
    .hit-the-target {
        display: flex;
        position: relative;
        width: 6.9rem;
        height: 8.97rem;
        margin: 1.86rem auto 0;
        background-image: url("https://yaame-static.yaame.io/admin/825e1e5c14dbb789848e5b5f7c0d5935.png");
        background-repeat: no-repeat;
        background-size: cover;

        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: .26rem;
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

        .hit-the-target-item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            width: 6.6rem;
            height: 6.58rem;
            padding: 0 .24rem;
            margin: 1.1rem auto 0;
            overflow-y: auto;
            .item {
                position: relative;
                width: 1.94rem;
                height: 2.7rem;
                margin: 0 .1rem .1rem 0;
                background: url("https://yaame-static.yaame.io/admin/5fa7c4097fc8173b8922c15624bcda8b.png") no-repeat;
                background-size: cover;

                .number {
                    position: absolute;
                    top: .2rem;
                    left: .2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: .29rem;
                    padding: 0 .12rem;
                    background: linear-gradient( 180deg, #FFD87D 0%, #FFB700 100%);
                    box-shadow: inset 0 0 .12rem 0 rgba(255,255,255,0.5);
                    border-radius: .15rem;
                    font-weight: 600;
                    font-size: .18rem;
                    color: #62330C;
                }

                .backdrop {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.94rem;
                    height: 1.94rem;
                    background: url("https://yaame-static.yaame.io/admin/4383e04c6dc54c58d58a9e2249a0643d.png") no-repeat;
                    background-size: cover;
                    img {
                        width: 1.4rem;
                    }
                }

                .text {
                    position: absolute;
                    top: 1.98rem;
                    left: 50%;
                    width: 1.7rem;
                    height: .5rem;
                    transform: translateX(-50%);
                    font-weight: 600;
                    font-size: .18rem;
                    color: #62330C;
                    text-align: center;
                }
            }
            .item:nth-child(3n) {
                margin-right: 0;
            }
        }
        .hit-the-target-item-few {
            height: 0;
            overflow-y: visible;
            .item {
                width: 1.5rem;
                height: 1.5rem;
                margin: 0;
                background-image: url("https://example.com/images/myImg.jpg"); // 例子空图片
                .number {
                    left: initial;
                    top: 0;
                    right: 0;
                    height: .26rem;
                    background: #38B971;
                    border-radius: 0 .08rem 0 .08rem;
                    font-weight: 400;
                    font-size: .18rem;
                    color: #FFF1AA;
                    box-shadow: none;
                }
                .backdrop {
                    width: 100%;
                    height: 100%;
                    background: #205B3A;
                    border-radius: .08rem;
                    border: .01rem solid #FFCA7E;
                    img {
                        width: 1.3rem;
                    }
                }
                .text {
                    top: 1.64rem;
                    font-size: .22rem;
                    color: #FFF1AA;
                }
            }
        }
        .hit-the-target-item::-webkit-scrollbar {
            width: .1rem; /* 竖直滚动条的宽度 */
            height: 1.27rem; /* 水平滚动条的高度 */
        }

        /* 滚动条的轨道 */
        .hit-the-target-item::-webkit-scrollbar-track {
            border-radius: .07rem; /* 圆角 */
        }

        /* 滚动条滑块 */
        .hit-the-target-item::-webkit-scrollbar-thumb {
            background: #FBD390; /* 滚动条滑块的颜色 */
            border-radius: .07rem; /* 圆角 */
        }

        /* 滚动条滑块在悬停时 */
        .hit-the-target-item::-webkit-scrollbar-thumb:hover {
            background: #FBD390; /* 悬停时滑块的颜色 */
        }

        .lucky-take {
            position: absolute;
            display: flex;
            justify-content: space-between;
            bottom: .38rem;
            width: 100%;
            padding: 0 .62rem;
            .lucky {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 1.8rem;
                height: .66rem;
                background: url("https://yaame-static.yaame.io/admin/0c76ab58d6b2b342067e0d9edcc39186.png") no-repeat;
                background-size: cover;

                .name {
                    height: .25rem;
                    line-height: .25rem;
                    font-weight: 500;
                    font-size: .18rem;
                    color: #8E6001;
                }

                .diamond {
                    display: flex;
                    justify-content: center;
                    align-items: baseline;
                    height: 0.17rem;
                    line-height: .17rem;
                    font-weight: 600;
                    font-size: .22rem;
                    color: #FFFEF8;
                    img {
                        width: .21rem;
                        height: .17rem;
                    }
                }
            }
        }
        .lucky-take-few {
            padding: 0 .36rem;
        }

        .close {
            position: absolute;
            bottom: -0.9rem;
            left: 50%;
            width: .5rem;
            height: .5rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/8669613454f4a034da716205f8ebff7b.png") no-repeat;
            background-size: cover;
        }
    }
    .hit-the-target-few {
        width: 6.4rem;
        height: 4.37rem;
        margin-top: 5.07rem;
        background-image: url("https://yaame-static.yaame.io/admin/dcdf2d105fcd6907360e09c6d6e9f0be.png");
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

    // 历史
    .history-rule {
        .rule-content {
            .content {
                width: 5.26rem;
                height: 6.32rem;
                margin: .97rem auto 0;
                overflow-y: auto;
                .history-item {
                    display: flex;
                    flex-wrap: wrap;
                    position: relative;
                    width: 100%;
                    padding-top: .33rem;
                    margin-bottom: .56rem;
                    span {
                        position: absolute;
                        top: 0;
                        left: .05rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: .17rem;
                        font-size: .14rem;
                        color: #F9E4AB;
                    }
                    .list {
                        position: relative;
                        width: 1.2rem;
                        height: 1.2rem;
                        margin: 0 .12rem .38rem 0;
                        .frame {
                            width: 1.2rem;
                            height: 1.2rem;
                            background: #000000;
                            border-radius: .18rem;
                            opacity: 0.2;
                        }
                        .bg {
                            position: absolute;
                            top: .04rem;
                            left: .04rem;
                            width: 1.12rem;
                            height: 1.12rem;
                            background: url("https://yaame-static.yaame.io/admin/8341d736e89affc8906305c220b3e2a5.png") no-repeat;
                            background-size: cover;
                        }
                        img {
                            position: absolute;
                            top: .1rem;
                            left: .1rem;
                            width: 1rem;
                            height: 1rem;
                        }
                        .number {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: absolute;
                            top: .04rem;
                            left: .04rem;
                            width: .51rem;
                            height: .25rem;
                            background: linear-gradient( 180deg, #FFD87D 0%, #FFB700 100%);
                            box-shadow: inset 0 0 .12rem 0 rgba(255,255,255,0.5);
                            border-radius: .15rem;
                            font-weight: 600;
                            font-size: .18rem;
                            color: #62330C;
                        }
                        .name {
                            position: absolute;
                            left: 50%;
                            bottom: -0.26rem;
                            height: .18rem;
                            transform: translateX(-50%);
                            line-height: .18rem;
                            font-weight: 400;
                            font-size: .18rem;
                            color: #FFFFFF;
                        }
                    }
                    .list:nth-child(4n + 1) {
                        margin-right: 0;
                    }
                }
                .history-no {
                    position: relative;
                    top: 1.56rem;
                    left: 50%;
                    width: .84rem;
                    height: 1rem;
                    transform: translateX(-50%);
                    background: url("https://yaame-static.yaame.io/admin/1fcb363383c5b2c4be4860960fece079.png") no-repeat;
                    background-size: contain;
                    p {
                        position: absolute;
                        top: 1.37rem;
                        left: 50%;
                        height: .2rem;
                        transform: translateX(-50%);
                        line-height: .2rem;
                        font-size: .22rem;
                        color: #FFF89F;
                        white-space: nowrap;
                    }
                }
            }
            .content::-webkit-scrollbar {
                width: .1rem; /* 竖直滚动条的宽度 */
                height: 1.27rem; /* 水平滚动条的高度 */
            }

            /* 滚动条的轨道 */
            .content::-webkit-scrollbar-track {
                border-radius: .07rem; /* 圆角 */
            }

            /* 滚动条滑块 */
            .content::-webkit-scrollbar-thumb {
                background: #FBD390; /* 滚动条滑块的颜色 */
                border-radius: .07rem; /* 圆角 */
            }

            /* 滚动条滑块在悬停时 */
            .content::-webkit-scrollbar-thumb:hover {
                background: #FBD390; /* 悬停时滑块的颜色 */
            }
        }
        .close {
            position: absolute;
            bottom: -0.78rem;
            left: 50%;
            width: .5rem;
            height: .5rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/8669613454f4a034da716205f8ebff7b.png") no-repeat;
            background-size: cover;
        }
    }

    .loading {
        z-index: 9999;
    }
}
</style>
