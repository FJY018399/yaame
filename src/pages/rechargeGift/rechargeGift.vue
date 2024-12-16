<template>
	<div class="main" ref="main">
    <div class="recharge">
      <!--返回栏-->
      <custom-header color="white" :dom-main="main">{{ $t('recharge_gift_pack') }}</custom-header>
      <!--规则弹窗-->
      <div class="rule" @click="showRule = !showRule">{{ $t('rules') }}</div>
      <!--logo-->
      <div class="logo" :style="{ backgroundImage: `url(${logoImg[language]})` }" :class="`logo-${language}`"></div>
      <!--活动时间-->
      <div class="time-bar">{{ new Date(start).getUTCMonth() + 1 }}/{{ new Date(start).getUTCDate() }} 00:00-{{ new Date(timeEnd).getUTCMonth() + 1 }}/{{ new Date(timeEnd).getUTCDate() }} 23:59(UTC+0)</div>
      <!--时间倒计时-->
      <div class="time">
        <div class="times">{{ days }}</div>
        <div class="times">D</div>:
        <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>:
        <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>:
        <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
      </div>
      <!--说明文案-->
      <p class="explain-txt">{{ $t('unlock_cool_gift_pack') }}</p>

      <!--用户信息进度-->
      <div class="my-info">
        <!--头像等信息-->
        <div class="head">
          <div class="head-img">
            <img :src="homeData.avatar" alt="">
          </div>
          <span>{{ $t('current_recharge_diamonds') }} <span>{{ homeData.total_charge_amount }}<img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt=""></span></span>
        </div>
        <!--解锁文案-->
        <div class="unlock" :style="{ marginTop: (language === 'zh-cn' || language === 'zh-tw') ? '0.1rem' : '' }">
          <i18n v-if="homeData.next_reward_tip > 0" path="recharge_more_to_unlock">
            <template v-slot:0>
              <span class="i18n">{{ homeData.next_reward_tip <= 0 ? '' : homeData.next_reward_tip }}<img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt=""></span>
            </template>
          </i18n>
          <span v-else>{{ $t('congratulations_level_unlocked') }}</span>
        </div>
        <!--进度条-->
        <div class="schedule">
          <div class="left-number">{{ homeData.last_charge_amount }}</div>
          <div class="right-number">{{ homeData.next_charge_amount }}</div>
          <div class="percent">{{ gears[totalIndex - 1] }}</div>
          <div class="move" :style="{ width: (6.56 / homeData.next_charge_amount) * (homeData.total_charge_amount > max ? max : homeData.total_charge_amount) + 'rem' }"></div>
        </div>
        <!--充值-->
        <div v-if="homeData.next_reward_tip > 0" class="recharge-button" @click="rechargeDiamond">{{ $t('recharge') }}</div>
      </div>

      <!--奖励头-->
      <div class="package">{{ $t('reward_package') }}</div>
      <!--奖励项目-->
      <div class="award">
        <div class="award-item" :class="{ 'award-item-have': item.charge_reward_items.length > 3 }" v-for="(item, index) in awardList" :key="index">
          <div class="header">
            <i18n path="recharge_xxx">
              <template v-slot:msg>
                <span class="msg">{{ item.reward_group_title }}<img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt=""></span>
              </template>
            </i18n>
          </div>
          <div class="icon" v-for="(ite, inx) in item.charge_reward_items" :key="inx">
            <div class="frame">
              <img :style="[ite.object_type === 'INCOME_RIBBON' ? { height: 'auto', width: '1.5rem' } : '']" :src="ite.reward_icon" alt="">
              <div v-if="ite.object_type !== 'DIAMOND'" class="day">{{ ite.subscript }}</div>
            </div>
            <div class="name">{{ ite.reward_name }}</div>
            <div v-if="ite.reward_diamond_worth" class="diamond"><img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt="">{{ ite.reward_diamond_worth }}</div>
          </div>
          <div class="award-button" :class="[ item.receive_status === 1 ? 'get' : item.receive_status === 2 ? 'succeed' : 'recharge-award-button' ]" @click="getRecharge(item)">
            <span>{{ item.receive_status === 1 ? $t('claim') : item.receive_status === 2 ? $t('claimed') : $t('recharge') }}</span>
          </div>
        </div>
      </div>
      <!--规则页-->
      <popup class="popup" v-show="showRule" @cancel="popupShow">
        <div class="rule-page">
          <div class="rule-page-header">{{ $t('rules') }}</div>
          <p>
            {{ $t('rule_1') }}<br /><br />
            {{ $t('rule_2') }}<br /><br />
            {{ $t('rule_3',{ msg: (new Date(receive).getUTCMonth() + 1)+'/'+ new Date(receive).getUTCDate() }) }}<br /><br />
            {{ $t('rule_4') }}<br /><br />
          </p>
        </div>
        <div class="rule-page-close" @click="showRule = !showRule"></div>
      </popup>
      <!--规则页-->
      <popup class="popup" v-show="awardWin" @cancel="awardWin = !awardWin">
        <div v-if="awardWinList.length" class="award-win">
          <div class="aperture"></div>
          <div class="check">{{ $t('congratulations_claim_successful') }} </div>
          <div class="icon" v-for="(ite, inx) in awardWinList" :key="inx">
            <div class="frame">
              <img :style="[ite.object_type === 'INCOME_RIBBON' ? { height: 'auto', width: '1.5rem' } : '']" :src="ite.reward_icon" alt="">
            </div>
            <div class="name">{{ ite.reward_name }}</div>
            <div v-if="ite.reward_diamond_worth" class="diamond"><img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt="">{{ ite.reward_diamond_worth }}</div>
          </div>
          <div class="ok" @click="awardWin = !awardWin">ok</div>
        </div>
        <div class="rule-page-close" @click="awardWin = !awardWin"></div>
      </popup>
    </div>
    <pageLoading v-show="loading"></pageLoading>
	</div>
</template>

<script setup>
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import customHeader from "@/components/common/cs_header";
import {getReceiveHomeInfoApi, postReceiveApi} from "@/pages/rechargeGift/api";
import {getLanguage} from "@/lib/device";
import pageLoading from '../../components/common/page_loading.vue';
import { Toast } from "vant";
import popup from "@/components/common/pop_up.vue";

// 添加loading
let loading = ref(true);

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};
// 获取语言
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

// logo国际化
const logoImg = ref({
  "ar": "https://yaame-static.yaame.io/admin/a4a8843dd07473124f28156d0aa59b3b.png",
  "en": "https://yaame-static.yaame.io/admin/5c5ac043ecc3a31e971fe96cf9547602.png",
  "id": "https://yaame-static.yaame.io/admin/f054f25bcfb9950c10de4efae7fd9ad2.png",
  "zh-cn": "https://yaame-static.yaame.io/admin/7671d7c2f01ef98d131bc13df8fc319c.png",
  "zh-tw": "https://yaame-static.yaame.io/admin/990885f45dfaf7f980e216f32cb7003b.png",
});

// 外盒子dom
const main = ref(null);

// 活动结束时间戳
const timeEnd = ref(0);
const start = ref(0);
const receive = ref(0);
// 页面计时时间
let days = ref(0);
let hours = ref(0);
let minutes = ref(0);
let seconds = ref(0);
const updateTime = () => {
  const now = new Date().getTime();
  const timeDifference = timeEnd.value - now;
  if (timeDifference > 0) {
    days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
  } else {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
  }
};

// INCOME_ANIMATION  ROOM_BG_IMAGE
// 挡位值
const gears = ref([t('level_one'),t('level_two'),t('level_three'),t('level_four'),t('level_five'),]);
let totalIndex = ref(0);
// 奖励数据
const awardList = ref([]);
const homeData = ref({});
// 挡位最大值
const max = ref(0);
const getHomeData = async () => {
  try {
    const res = await getReceiveHomeInfoApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    // 判断当前活动是否开启
    if (!res.data.active) Toast(t('event_not_started'));
    else if (res.data.active === 2) Toast(t('event_ended'));
    timeEnd.value = res.data.activity_end_time; // 活动结束时间
    start.value = res.data.activity_start_time; // 活动开始时间
    receive.value = res.data.activity_receive_end_time; // 领取截止时间
    awardList.value = res.data.charge_reward_groups; // 奖励数据
    max.value = awardList.value[awardList.value.length - 1].reward_group_title;
    totalIndex.value = res.data.total_index; // 档位
    homeData.value = res.data; // 当前用户数据展示
    dataProcessing();
  } catch (err) {
    console.log(err);
  }
}
// 处理数据
const dataProcessing = () => {
  awardList.value.forEach((item, index) => {
    item.charge_reward_items.forEach(ite => {
      if (ite.object_type === 'INCOME_ANIMATION' && ite.object_type === 'ROOM_BG_IMAGE') {
        awardList.value[index]['status'] = 1;
      } else {
        awardList.value[index]['status'] = 0;
      }
    });
  })
}
// 节流阀
let throttleOne = false;
// 充值
const getRecharge = async (value) => {
  try {
    let {receive_status, group_flag, charge_reward_items} = value;
    if (!homeData.value.active) {
      Toast(t('event_not_started'));
      return;
    }
    if (homeData.value.active === 3) {
      Toast(t('event_ended'));
      return;
    }
    if (receive_status === 2) {
      return
    }
     // 判断当前状态
    if (!receive_status) { // 充值
      if (homeData.value.active === 2) {
        Toast(t('event_ended'));
        return;
      }
      if (throttleOne) return;
      throttleOne = true;
      setTimeout(() => {
        window.location.href = "wlyaame://mine/shop/diamond?popup=1";
      }, 200)
      setTimeout(() => {
        throttleOne = false;
      }, 1000)
      return;
    }
    const res = await postReceiveApi({group_flag});
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    cutAwardWin();
    awardWinList.value = charge_reward_items;
    // 刷新已领取
    await getHomeData();
    Toast(t('claim_successful'));
  } catch (err) {
    console.log(err);
  }
}
// 节流阀
let throttle = false;
// 充值
const rechargeDiamond = () => {
  if (!homeData.value.active) {
    Toast(t('event_not_started'));
    return;
  } else if (homeData.value.active === 2) {
    Toast(t('event_ended'));
    return;
  }
  else if (homeData.value.active === 3) {
    Toast(t('event_ended'));
    return;
  }
  if (throttle) return;
  throttle = true;
  setTimeout(() => {
    window.location.href = "wlyaame://mine/shop/diamond?popup=1";
  }, 200)
  setTimeout(() => {
    throttle = false;
  }, 1000)
}

// 定时器倒计时
let timeOut = null;
const openTiming = () => {
  timeOut = setInterval(() => {
    updateTime();
  },1000)
}

// 规则弹窗
const showRule = ref(false);
// 点击空白进行隐藏
const popupShow = () => {
  showRule.value = false;
}

// 奖励弹窗
const awardWin = ref(false);
const awardWinList = ref([])
const cutAwardWin = () => {
  awardWin.value = true;
}

onMounted(() => {
  // 充值后回调
  window.onPaySuccess = function () {
    getHomeData();
    setTimeout(() => {
      getHomeData();
    }, 2000)
  };
  // 页面数据
  getHomeData();
  // 开启页面倒计时
  openTiming();
  // 页面loading效果
  window.onload = () => {
    loading.value = false;
  }
})
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  overflow: auto;
  .recharge {
    position: relative;
    min-height: 100vh;
    padding-bottom: .79rem;
    background: url("https://yaame-static.yaame.io/admin/e186ea410b067c3cab018c0e01113c0f.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .rule {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      right: 0;
      top: 3.16rem;
      width: 1.28rem;
      height: .5rem;
      padding-left: .36rem;
      background: url("https://yaame-static.yaame.io/admin/7e52448806022c3c569a47f8d761f7dc.png") no-repeat;
      background-size: contain;
      font-size: .28rem;
      color: #FFFFFF;
    }

    .logo {
      position: absolute;
      top: .9rem;
      left: 50%;
      width: 7.5rem;
      height: 2.1rem;
      transform: translateX(-50%);
      background-repeat: no-repeat;
      background-size: contain;
    }
    .logo-ar {
        width: 5.96rem;
        height: 1.67rem;
    }

    .time-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4.40rem;
      height: .5rem;
      padding: 0 .2rem;
      margin: 2.62rem auto 0;
      background: rgba(0,101,146,0.8);
      box-shadow: inset 0 0 .1rem .04rem #1CE5FF;
      border-radius: .25rem;
      font-size: .24rem;
      color: #FFFFFF;
      white-space: nowrap;
    }

    // 活动倒计时
    .time {
      display: flex;
      justify-content: space-between;
      width: 4.05rem;
      height: .6rem;
      margin: 4.24rem auto 0;
      font-size: .32rem;
      color: #FFFFFF;
      .times {
        display: flex;
        justify-content: center;
        align-items: center;
        width: .6rem;
        height: .6rem;
        background: url("https://yaame-static.yaame.io/admin/4e326a1bd32c8b7ad779c9b6b0c9e84d.png") no-repeat;
        background-size: contain;
      }
    }

    .explain-txt {
      width: 6.6rem;
      height: .72rem;
      margin: .52rem auto 0;
      line-height: .3rem;
      font-size: .28rem;
      color: #FFFFFF;
      text-align: center;
    }

    // 用户信息进度
    .my-info {
      position: relative;
      width: 7.28em;
      height: 4.38rem;
      margin: 0 auto;
      overflow: hidden;
      background: url("https://yaame-static.yaame.io/admin/0c3b9ae3f5e6f8f46dad0ca3e885407c.png") no-repeat;
      background-size: contain;
      .head {
        display: flex;
        justify-content: center;
        margin-top: .39rem;
        .head-img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: .8rem;
          height: .8rem;
          margin: 0 .16rem 0 .34rem;
          padding: 0.02rem; /* 用于内边距，以便显示渐变边框 */
          background-clip: content-box, border-box; /* 确保背景颜色和渐变边框分别应用 */
          background-origin: border-box; /* 定义背景的起点 */
          background-image: linear-gradient(#FFFFFF, #FFFFFF), /* 内层背景 */ linear-gradient(154deg, rgba(255, 181, 48, 1), rgba(255, 219, 121, 1), rgba(255, 168, 33, 1)); /* 外层背景渐变 */
          border-radius: 50%;
          img {
            width: .75rem;
            height: .75rem;
            border-radius: 50%;
          }
        }
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .28rem;
          color: #FFFFFF;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFF681;
            img {
              width: .3rem;
              height: .24rem;
              margin-left: .06rem;
              margin-top: .05rem;
            }
          }
        }
      }

      .unlock {
        span {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          width: 6.6rem;
          margin: 0 auto;
          font-size: .28rem;
          color: #FFFFFF;
          text-align: center;
          .i18n {
            display: flex;
            width: auto;
            height: auto;
            margin: 0 0 0 .1rem;
            justify-content: center;
            align-items: center;
            color: #FFF681;
            img {
              width: .3rem;
              height: .24rem;
              margin-left: .06rem;
            }
          }
        }
      }

      .schedule {
        position: absolute;
        top: 2.21rem;
        left: 50%;
        width: 6.6rem;
        height: .4rem;
        transform: translate(-50%);
        background: #00517A;
        border-radius: .2rem;

        .move {
          position: absolute;
          top: .02rem;
          left: .02rem;
          //width: 2.81rem;
          height: .36rem;
          background: linear-gradient( 180deg, #FFE469 0%, #FF941A 100%);
          border-radius: .2rem;
          transition-duration: .3s;
        }

        .percent {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: .24rem;
          color: #FFFFFF;
          line-height: .36rem;
          text-shadow: 0 .02rem .04rem rgba(176,108,0,0.5);
          z-index: 1;
        }

        .left-number,
        .right-number {
          position: absolute;
          bottom: -0.34rem;
          font-size: .24rem;
          color: #FFFFFF;
        }
        .left-number {
          left: 0;
        }
        .right-number {
          right: 0;
        }
      }

      .recharge-button {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: .49rem;
        left: 1.8rem;
        width: 3.62rem;
        height: .9rem;
        background: url("https://yaame-static.yaame.io/admin/ec3d21d619622ec8e309b363fb75ce64.png") no-repeat;
        background-size: contain;
        transition-duration: .2s;
        font-size: .28rem;
        color: #FFFFFF;
        animation: open 1.2s infinite;
      }
    }

    .package {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 7.1rem;
      height: .8rem;
      margin: .11rem auto 0.2rem;
      background: linear-gradient( 270deg, rgba(26,127,254,0) 0%, rgba(24,244,255,0.5) 50%, rgba(26,127,254,0) 100%);
      font-size: .28rem;
      color: #FFFFFF;
    }
    .award {
      .award-item {
        position: relative;
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
        align-items: flex-start;
        width: 7.1rem;
        min-height: 5.6rem;
        margin: 0 auto .2rem;
        padding-top: 1.3rem;
        padding-bottom: 1.56rem;
        background-image: url("https://yaame-static.yaame.io/admin/63df468dc2261ab43c8e6df7ab93224c.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex-direction: row;
          position: absolute;
          top: 0;
          left: 50%;
          width: 7.02rem;
          height: .86rem;
          padding-top: .15rem;
          transform: translateX(-50%);
          background: url("https://yaame-static.yaame.io/admin/50003cadf7dcb385e1c0b044a090ac50.png") no-repeat;
          background-size: contain;
          font-size: .28rem;
          color: #C36B0E;
          span {
            display: flex;
            .msg {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: .1rem;
              img {
                width: .3rem;
                height: .24rem;
                margin-left: .08rem;
              }
            }
          }
        }

        .icon {
          //position: relative;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          width: 1.9rem;
          .frame {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 1.9rem;
            height: 1.9rem;
            background-image: url("https://yaame-static.yaame.io/admin/9b7579f759713808579842ea3ccf799f.png");
            background-repeat: no-repeat;
            background-size: contain;
            .day {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: .07rem;
              right: .06rem;
              width: .74rem;
              height: .3rem;
              font-size: .16rem;
              color: #FFFFFF;
              background: url("https://yaame-static.yaame.io/admin/aa5be987849ae10fbc3778504f883133.png") no-repeat;
              background-size: contain;
            }
            img {
              height: 1.5rem;
            }
          }
          .name {
            margin: .16rem 0 .08rem;
            line-height: .3rem;
            font-size: .3rem;
            color: #FFFFFF;
            text-align: center;
          }
          .diamond {
            display: flex;
            justify-content: center;
            align-items: center;
            height: .3rem;
            font-size: .3rem;
            color: #FFFFFF;
            img {
              width: .3rem;
              height: .24rem;
              margin-right: .04rem;
            }
          }
        }
        .icon:nth-child(5) {
          .frame {
            width: 6.26rem;
            height: 2.14rem;
            margin-top: .36rem;
            background-image: url("https://yaame-static.yaame.io/admin/2299f2ce5012ae69b999100a5ef7d4b5.png");
            img {
              height: 1.5rem;
            }
          }
          .diamond {
            img {
              width: .3rem;
              height: .24rem;
            }
          }
        }

        .award-button {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: .44rem;
          width: 3.62em;
          height: .9rem;
          background-image: url("https://yaame-static.yaame.io/admin/ec3d21d619622ec8e309b363fb75ce64.png");
          background-repeat: no-repeat;
          background-size: contain;
          color: #FFFFFF;
          transition-duration: .2s;
          span {
            font-size: .28rem;
          }
        }
        .get {
          background-image: url("https://yaame-static.yaame.io/admin/375101c8f13466fc59e4a6d9dbc0318e.png");
          transition-duration: .2s;
        }
        .get:active,
        .recharge-award-button:active {
          transform: scale(1.1);
        }
        .succeed {
          background-image: url("https://yaame-static.yaame.io/admin/7b4ea56dcd3b626bcf4208ec5d1e7a4a.png");
          transition-duration: .2s;
        }
      }
      .award-item-have{
        width: 7.1rem;
        min-height: 9.02rem;
        background-image: url("https://yaame-static.yaame.io/admin/45cc43b7215fb0f6b998c95d0e04aee0.png");
      }
    }

    // 规则弹窗
    .rule-page {
      display: flex;
      position: relative;
      width: 7.28rem;
      height: 9.42rem;
      margin: 3.23rem auto 0;
      background: url("https://yaame-static.yaame.io/admin/5c71e47648e63c574cec5bb7efc53b4b.png") no-repeat;
      background-size: contain;

      .rule-page-header {
        position: absolute;
        top: .2rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: .28rem;
        color: #C36B0E;
      }

      p {
        width: 6.6rem;
        height: 7.8rem;
        margin: 1.08rem auto 0;
        font-size: .28rem;
        color: #FFFFFF;
      }
    }
    .rule-page-close {
      width: .5rem;
      height: .5rem;
      margin: .31rem auto 0;
      background: url("https://yaame-static.yaame.io/admin/8669613454f4a034da716205f8ebff7b.png") no-repeat;
      background-size: contain;
    }

    .popup {
      overflow: auto;
    }

    // 领取奖励窗
    .award-win {
      position: relative;
      display: flex;
      justify-content: space-evenly;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      align-items: flex-start;
      width: 7.1rem;
      min-height: 6rem;
      margin: 5.38rem auto 0;
      padding-top: 1.44rem;
      padding-bottom: 1.82rem;
      background: url("https://yaame-static.yaame.io/admin/3f1bc82ec8c5cd37def4dba567f191b0.png") no-repeat;
      background-size: 100% 100%;

      .check {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: .55rem;
        left: 50%;
        width: 98%;
        font-size: .28rem;
        color: #FFFFFF;
        transform: translateX(-50%);
        text-align: center;
      }

      .icon {
        //position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 1.9rem;
        .frame {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 1.9rem;
          height: 1.9rem;
          background-image: url("https://yaame-static.yaame.io/admin/9b7579f759713808579842ea3ccf799f.png");
          background-repeat: no-repeat;
          background-size: contain;
          .day {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: .07rem;
            right: .06rem;
            width: .74rem;
            height: .3rem;
            font-size: .16rem;
            color: #FFFFFF;
            background: url("https://yaame-static.yaame.io/admin/aa5be987849ae10fbc3778504f883133.png") no-repeat;
            background-size: contain;
          }
          img {
            height: 1.5rem;
          }
        }
        .name {
          margin: .16rem 0 .08rem;
          line-height: .3rem;
          font-size: .3rem;
          color: #FFFFFF;
          text-align: center;
        }
        .diamond {
          display: flex;
          justify-content: center;
          align-items: center;
          height: .3rem;
          font-size: .3rem;
          color: #FFFFFF;
          img {
            width: .3rem;
            height: .24rem;
            margin-right: .04rem;
          }
        }
      }
      .icon:nth-child(6) {
        .frame {
          width: 6.26rem;
          height: 2.14rem;
          margin-top: .36rem;
          background-image: url("https://yaame-static.yaame.io/admin/2299f2ce5012ae69b999100a5ef7d4b5.png");
          img {
            height: 1.5rem;
          }
        }
        .diamond {
          img {
            width: .3rem;
            height: .24rem;
          }
        }
      }

      .ok {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: .54rem;
        left: 50%;
        width: 3.62rem;
        height: .9rem;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/fbfa34c74fd6979b41fac3e923797739.png") no-repeat;
        background-size: contain;
        font-size: .28rem;
        color: #FFFFFF;
      }

      .aperture {
        position: absolute;
        top: -1.69rem;
        left: 50%;
        width: 7.50rem;
        height: 9.47rem;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/6be7cf522f7640369272745591f34edc.png") no-repeat;
        background-size: contain;
        z-index: -1;
      }
    }
  }
}
@keyframes open {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>