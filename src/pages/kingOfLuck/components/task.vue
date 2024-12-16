<template>
	<div class="task-main">
    <!--任务-->
    <div class="task" :style="{ backgroundImage: `url(${taskImg[language]})` }">
      <div class="refresh-copy">{{ $t('daily_tasks') }}</div>
      <div class="cut">
        <div class="dot" @click="minus"></div>
        <div>{{ dailyTasksList[dayNumber] && dailyTasksList[dayNumber].time_cycle_tip }}(UTC+0)</div>
        <div class="dot" @click="add"></div>
      </div>
      <div class="case" v-for="(item, index) in dailyTasksList[dayNumber] && dailyTasksList[dayNumber].time_cycle_tasks" :key="index">
        <div class="icon" :class="{ 'icon-get': item.reward_status === 2 }"></div>
        <div class="schedule">
          <p>{{ item.task_info }}({{ item.task_progress_amount }}/{{ item.task_require_amount }})</p>
          <span>+{{ item.reward_coupons_amount }} tickets</span>
        </div>
        <div
            class="button"
            :class="[ item.reward_status === 1 ? 'get' :  item.reward_status === 2 ? 'already-get' : '' ]"
            @click="skip(item)"
        >
          <span>{{ item.reward_status === 0 ? $t('complete_now') :  item.reward_status === 1 ? $t('receive') : $t('received')}}</span>
        </div>
      </div>
    </div>
    <!--兑换-->
    <div class="conversion" :style="{ backgroundImage: `url(${conversionImg[language]})` }">
      <div class="head">
        <img src="https://yaame-static.yaame.io/admin/3bb018deeb8d84d9618346f557e07ee1.png" alt="">
        <p>{{ $t('current_coupons') }} {{ myGameNumber }}</p>
      </div>
      <!--兑换项-->
      <div class="conversion-item" v-for="(item, index) in conversionList" :key="index">
        <div class="icon">
          <img :src="item.coupons_rewards[0].reward_icon" alt="">
          <!--角标-->
          <div class="corner">{{ item.coupons_rewards[0].subscript }}</div>
        </div>
        <div class="name">{{ item.coupons_rewards[0].reward_name }}</div>
        <div class="ticket">Need <img src="https://yaame-static.yaame.io/admin/3bb018deeb8d84d9618346f557e07ee1.png" alt="">*{{ item.coupons_amount }}</div>
        <div
            class="button"
            :class="[ myGameNumber < item.coupons_amount ? 'button-no' : 'cli' ]"
            @click="convertibility(item)"
        >
          <span>{{ $t('exchange') }}</span>
        </div>
      </div>
    </div>

    <!--弹窗-->
    <popup class="popup" v-show="awardWin" @cancel="awardWin = !awardWin">
      <div class="award-win"  :style="{ backgroundImage: `url(${popupImg[language]})` }">
        <div class="icon">
          <img :src="awardWinList.reward_icon" alt="">
        </div>
        <p :class="{ 'one': language === 'en' }">{{ $t('exchange_success') }}</p>
      </div>
      <div class="rule-page-close" @click="awardWin = !awardWin"></div>
    </popup>
	</div>
</template>

<script setup>
import {computed, getCurrentInstance, onActivated, onDeactivated, onMounted, ref, watch} from "vue";
import {getLanguage} from "@/lib/device";
import {Toast} from "vant";
import {taskReceiveApi, taskRewardReceiveApi} from "@/pages/kingOfLuck/api";
import popup from "@/components/common/pop_up.vue";
import eventBus from "@/pages/kingOfLuck/eventBus";

const emit = defineEmits(['mounted']);
const props = defineProps(['homeData', 'main']);
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

// 弹窗多语言
const popupImg = ref({
  "ar": "https://yaame-static.yaame.io/admin/ae554f7c89150fc524e508a1c998ce78.png",
  "en": "https://yaame-static.yaame.io/admin/03da5089fccadc6667e5a50d4138f1e9.png",
  "id": "https://yaame-static.yaame.io/admin/d72d14d30e6b4bc0f897c397489fe2e2.png",
  "zh-cn": "https://yaame-static.yaame.io/admin/84a0ba5bd203c07d2233918c2d2e1f24.png",
  "zh-tw": "https://yaame-static.yaame.io/admin/84a0ba5bd203c07d2233918c2d2e1f24.png",
})

// 任务多语言
const taskImg = ref({
  "ar": "https://yaame-static.yaame.io/admin/2b99348f3825c5a3a248f8edcd953208.png",
  "en": "https://yaame-static.yaame.io/admin/605099fdf820191f66850efbe2bd4ac4.png",
  "id": "https://yaame-static.yaame.io/admin/d7921af40553348274bfa8596dd572d0.png",
  "zh-cn": "https://yaame-static.yaame.io/admin/bc174a39a7f7995cdfd11050b2f34067.png",
  "zh-tw": "https://yaame-static.yaame.io/admin/cd8c1f7d62d720a882dcc4304409e9e2.png",
});
const conversionImg = ref({
  "ar": "https://yaame-static.yaame.io/admin/9220ef567841708a021f82e924255039.png",
  "en": "https://yaame-static.yaame.io/admin/2e4cec152ba3cb028b0e6f138e2b2c09.png",
  "id": "https://yaame-static.yaame.io/admin/6baf0cf5603deea9dd1f45bfa1eb2764.png",
  "zh-cn": "https://yaame-static.yaame.io/admin/ef087c2e5b0b59762efc81930cb591ab.png",
  "zh-tw": "https://yaame-static.yaame.io/admin/b325a6dea1038bc8cb7303f0397ddaec.png",
})

// 获取实例
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

// 用户游戏券
const myGameNumber = ref(0);
// 页面数据
const conversionList = ref([]);
// 当前日期索引
const dayNumber = ref(0);
// 活动任务数据
const dailyTasksList = ref([]);
// 注入函数获取页面数据
const handleData = (value) => {
  conversionList.value = value.coupons_levels;
  myGameNumber.value = value.game_coupons_amount;
  dayNumber.value = typeof lastTime.value === 'number' ? lastTime.value :value.current_time_index;
  dailyTasksList.value = value.daily_tasks;
}

// 切换日期
const add = () => {
  if (dayNumber.value >= dailyTasksList.value.length - 1) {
    Toast(t('already_latest_date'));
    return;
  }
  dayNumber.value++;
}
const minus = () => {
  if (dayNumber.value === 0) {
    Toast(t('already_last_day'));
    return;
  }
  dayNumber.value--;
}

// 跳转地址
const skip = (value) => {
  if (!value.reward_status) {
    if (value.scheme_url.length) window.location.href = value.scheme_url;
    else {
      let time = null, i = 1;
      time = setInterval(() => {
        props.main.scrollTop -= i * 4.5;
        if (props.main.scrollTop <= 0) {
          props.main.scrollTop = 0;
          clearInterval(time);
        }
      })
    }
  }
  else if (value.reward_status === 2) Toast(t('coupon_received'));
  else if (value.reward_status === 1) getAward(value)
}

// 记录上次打开日期
const lastTime = ref(null);
// 领取奖励
const getAward = async (item) => {
  try {
    const res = await taskReceiveApi({
      cycle_flag: dailyTasksList.value[dayNumber.value].time_cycle,
      task_flag: item.task_flag
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    lastTime.value = dayNumber.value;
    Toast(t('coupon_received_success'));
    eventBus.emit('refurbish');
  } catch (err) {
    console.log(err);
  }
}

// 兑换
const convertibility = async (item) => {
  try {
    if (myGameNumber.value < item.coupons_amount) {
      Toast(t('not_enough_coupons'));
      return;
    }
    const res = await taskRewardReceiveApi({
      reward_flag: item.reward_flag
    });
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    // 刷新奖券
    myGameNumber.value = res.data.game_coupons_amount;
    // 拿去弹窗数据
    awardWin.value = true;
    awardWinList.value = item.coupons_rewards[0];
  } catch (err) {
    console.log(err);
  }
}
// 奖励弹窗
const awardWin = ref(false);
const awardWinList = ref({})

// 监视 props 的变化
watch(() => props.homeData, (newValue) => {
  if (newValue) {
    handleData(newValue);
  }
});

onMounted(() => {
  emit('mounted');
})
</script>

<style lang="less" scoped>
.task-main {
  min-height: 100%;
  .task {
    position: relative;
    width: 7.26rem;
    height: 12.91rem;
    margin: .03rem auto 0;
    padding-top: 3.6rem;
    background-repeat: no-repeat;
    background-size: contain;

    .refresh-copy {
      position: absolute;
      top: 1.92rem;
      left: 50%;
      width: 6.42rem;
      transform: translateX(-50%);
      font-size: .22rem;
      color: #913800;
      line-height: .24rem;
    }

    .cut {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 3.1rem;
      left: 50%;
      //width: 1.73rem;
      height: .37rem;
      transform: translateX(-50%);
      font-size: .3rem;
      color: #913800;
      .dot {
        width: .3rem;
        height: .3rem;
        background-image: url("https://yaame-static.yaame.io/admin/7315b5fa17b05a0e4ef3b91f81313f7c.png");
        background-size: contain;
        background-repeat: no-repeat;
      }
      div:nth-child(3) {
        background-image: url("https://yaame-static.yaame.io/admin/e7b77a760cdaae7fd5340f76933aea30.png");
      }
      div:nth-child(2) {
        margin: 0 .5rem;
      }
    }

    .case {
      position: relative;
      width: 6.51rem;
      height: 1.22rem;
      margin: 0 auto;
      background: url("https://yaame-static.yaame.io/admin/cc4e843cbec3a3cf1ad1559a3261b3f5.png") no-repeat;
      background-size: contain;

      .icon {
        position: absolute;
        left: 0.03rem;
        top: .02rem;
        width: 1.05rem;
        height: 1.18rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("https://yaame-static.yaame.io/admin/fd7aeb3d8cd132415bbe0f8be8e5286c.png");
      }
      .icon-get {
        background-image: url("https://yaame-static.yaame.io/admin/9722e3d553d5ff565f1733602690cb81.png");
      }

      .schedule {
        position: absolute;
        top: 50%;
        display: flex;
        flex-direction: column;
        margin-left: 1.18rem;
        transform: translateY(-50%);
        p {
          width: 3.2rem;
          font-size: .22rem;
          color: #AA4201;
        }
        span {
          font-size: .22rem;
          color: #E27401;
          font-weight: 600;
        }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: absolute;
        top: 50%;
        right: 0.13rem;
        width: 1.7rem;
        height: .73rem;
        padding-top: .11rem;
        transform: translateY(-50%);
        font-size: .22rem;
        color: #AA4201;
        background-image: url("https://yaame-static.yaame.io/admin/c847e197977edbbb388d30d0e56e16e8.png");
        background-repeat: no-repeat;
        background-size: contain;
        transition-duration: .3s;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: .44rem;
          text-align: center;
          line-height: .22rem;
        }
      }
      .get {
        background-image: url("https://yaame-static.yaame.io/admin/3276b9348a46252d66f3efe4156d011c.png");
      }
      .get:active {
        transform: scale(1.1) translateY(-50%);
      }
      .already-get {
        width: 1.52rem;
        height: .6rem;
        background-image: url("https://yaame-static.yaame.io/admin/59391ec3581a07979254446e3bb83167.png");
      }
    }
  }

  .conversion {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: flex-start;
    position: relative;
    width: 7.26rem;
    height: 19.29rem;
    margin: auto;
    padding-top: 3.77rem;
    background-repeat: no-repeat;
    background-size: contain;

    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 2.46rem;
      left: 50%;
      width: 5.68rem;
      height: 1rem;
      background: url("https://yaame-static.yaame.io/admin/4a8c68edbcdc15b5eb4864054c859b55.png") no-repeat;
      background-size: contain;
      transform: translateX(-50%);
      font-size: .22rem;
      color: #AA4201;
      img {
        width: 1.33rem;
        height: .58rem;
        margin-right: .18rem;
      }
    }

    .conversion-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 1.9rem;
      height: 3.72rem;
      font-size: .22rem;
      color: #AA4201;
      .icon {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.9rem;
        height: 1.9rem;
        background: url("https://yaame-static.yaame.io/admin/a2b04d9d26f4adaa9e0e243ef9c547c5.png") no-repeat;
        background-size: contain;
        img {
          width: 1.18rem;
        }

        .corner {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          width: .95rem;
          height: .34rem;
          background: #EC871F;
          border-radius: 0 .1rem 0 .1rem;
          font-size: .22rem;
          color: #FFFFFF;
        }
      }

      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: .44rem;
        margin: 0.04rem 0 .11rem;
        line-height: .22rem;
        text-align: center;
      }

      .ticket {
        display: flex;
        justify-content: center;
        align-items: center;
        height: .3rem;
        margin-bottom: .04rem;
        img {
          width: .6rem;
          height: .27rem;
          margin-left: .09rem;
        }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.6rem;
        height: .68rem;
        font-size: .20rem;
        color: #FFFFFF;
        background-image: url("https://yaame-static.yaame.io/admin/c847e197977edbbb388d30d0e56e16e8.png");
        background-repeat: no-repeat;
        background-size: contain;
        transition-duration: .3s;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 1.2rem;
          height: .4rem;
          line-height: .22rem;
        }
      }

      .cli:active {
        transform: scale(1.2);
      }

      .button-no {
        background-image: url("https://yaame-static.yaame.io/admin/d99cf026843012dac0f2d06431770b90.png");
      }
    }
  }
  
  .award-win {
    width: 5.83rem;
    height: 5.49rem;
    margin: 3.65rem auto 0;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://yaame-static.yaame.io/admin/84a0ba5bd203c07d2233918c2d2e1f24.png");
    overflow: hidden;

    .icon {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.9rem;
      height: 1.9rem;
      margin: 2rem auto 0;
      background: url("https://yaame-static.yaame.io/admin/a2b04d9d26f4adaa9e0e243ef9c547c5.png") no-repeat;
      background-size: contain;
      img {
        width: 1.18rem;
      }
    }
    p {
      position: relative;
      left: 50%;
      width: 3.64rem;
      margin-top: .2rem;
      transform: translateX(-50%);
      font-weight: 600;
      font-size: .28rem;
      color: #AA4201;
      text-align: center;
    }
    .one {
      width: 4.32rem;
      margin-top: .16rem;
      font-size: .24rem;
    }
  }
  .rule-page-close {
    width: 2.33rem;
    height: .9rem;
    margin: auto;
    background: url("https://yaame-static.yaame.io/admin/38fb8c5b89e16da27318e13c049206a4.png") no-repeat;
    background-size: contain;
  }
}
</style>