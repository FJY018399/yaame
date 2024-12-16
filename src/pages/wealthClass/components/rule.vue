<template>
  <div class="main" ref="main">
    <!--标题-->
    <custom-header class="header" color="white" :apparentTitle="$t('wealth_level_rules')" :headStyle="headStyle" :dom-main="main">
      <template v-slot:default>
        <div class="header-title">{{ $t('wealth_level_rules') }}</div>
      </template>
    </custom-header>

    <!--标题1-->
    <div class="query">- {{ $t('what_is_wealth_level') }} -</div>
    <div class="speak">
      <span>{{ $t('wealth_level_description') }}</span>
    </div>
    <!--标题-->
    <div class="query">- {{ $t('how_to_improve_wealth_level') }} -</div>

    <!--任务-->
    <div class="rank" v-for="(item, index) in ruleData" :key="index">
      <div class="title">{{ item.task_name }}</div>
      <!--倒计时-->
      <div v-if="index === 2" class="time">{{ $t('refresh_in_time', {1: hours, 2: minutes, 3: seconds}) }}</div>
      <div class="item" v-for="(ite, inx) in item.task_items" :key="inx">
        <div class="frame">
          <img :src="ruleList[index].task_list[inx].icon" alt="">
          <div class="info">
            <div class="plan">{{ ite.task_name }}
              <span v-if="ite.overall_progress && (index === 2 && (inx === 1 || inx === 2))">({{
                  Math.floor(ite.current_progress / 1000 / 60) + '/' + Math.floor(ite.overall_progress / 1000 / 60)
                }})
            </span>
              <span v-else-if="ite.overall_progress">({{ ite.current_progress + '/' + ite.overall_progress }})</span>
            </div>
            <div class="mission">{{ ite.message }}</div>
          </div>
        </div>
        <div class="button" :class="{ 'done': ite.reward_status }" @click="go(ite)">
          <span>{{ ite.reward_status ? $t('completed') : 'GO' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header";
import {onActivated, onMounted, ref} from "vue";
import {getTaskApi} from "@/pages/wealthClass/api";
import {Toast} from "vant";
import {burialPointFun} from "@/lib/utils";

const main = ref(null);

// 页面任务数据
const ruleList = ref([
  {
    task_list: [
      {
        icon: 'https://yaame-static.yaame.io/admin/82f085144be9b3f476e7ae6055b61594.png',
        head_title: '在官方渠道充值（0/1）',
        task: '充值1次+300Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/5415b401253679832cd36b768f31ce2b.png',
        head_title: '首次赠送钻石礼物（0/1）',
        task: '送出1次+300Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/ac117fd6c0c890ab1801c71eb4cb464d.png',
        head_title: '参与钻石小游戏（0/1）',
        task: '送出1次+300Exp'
      }
    ]
  },
  {
    task_list: [
      {
        icon: 'https://yaame-static.yaame.io/admin/5c95f38aaf444b73c652d5f5182cb83b.png',
        head_title: '赠送幸运礼物',
        task: '消耗10钻石+1Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/72353a624ad4ee929787dc6dda77aa2e.png',
        head_title: '赠送其他礼物',
        task: '消耗1钻石+1Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/6e76bafed667510ec92c76b170dff335.png',
        head_title: '用钻石购买道具',
        task: '消耗1钻石+3Exp'
      }
    ]
  },
  {
    task_list: [
      {
        icon: 'https://yaame-static.yaame.io/admin/a50c831e66b71a6744dc08bc98fce1c8.png',
        head_title: '打开Yaame',
        task: '1次+10Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/b0685b1fe8ec37b82b3bb5f32de394f2.png',
        head_title: '在房间停留1分钟',
        task: '1分钟+10Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/fa628dd6e8b2bb5b18d5b05204e5c6f5.png',
        head_title: '上麦1分钟',
        task: '1分钟+10Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/ac117fd6c0c890ab1801c71eb4cb464d.png',
        head_title: '玩一次钻石小游戏',
        task: '1次+50Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/9e8754f39e42e34c664e51a95d6bbe74.png',
        head_title: '关注其他用户',
        task: '1次+10Exp'
      },
      {
        icon: 'https://yaame-static.yaame.io/admin/df369d1666d8d97b0b8a516214cf87d6.png',
        head_title: '关注房间',
        task: '1次+10Exp'
      }
    ]
  }
])

// 头部样式
const headStyle = ref({
  color: '#FFF !important',
  fontSize: '.32rem',
  fontWeight: '600',
})

// 活动结束时间戳
const timeEnd = ref(0);
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
// 定时器倒计时
let timeOut = null;
const openTiming = () => {
  timeOut = setInterval(() => {
    updateTime();
    if (timeEnd.value <= Date.now()) {
      // 刷新页面
      getRuleData();
      // 如果时间到了下一天的午夜，重新计算倒计时
      timeEnd.value = calculateTimeUntilMidnightUTC();
    }
  }, 1000)
}

const calculateTimeUntilMidnightUTC = () => {
  const now = new Date();

  // 获取当前的 UTC 年、月、日
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();

  // 计算下一个 UTC 午夜的时间戳
  return Date.UTC(year, month, date + 1, 0, 0, 0);
};

// 任务数据
const ruleData = ref([]);
// 任务数据
const getRuleData = async () => {
  try {
    const res = await getTaskApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    ruleData.value = res.data.task_detail_type_list;
  } catch (err) {
    console.log(err);
  }
}

// 跳转
const go = (value) => {
  // 埋点任务点击
  burialPointFun({
    event_name: "click_wealth_task_go",
    cid: -1003,
    md: 120,
    args_name: "",
    args: {
      task_details: value.bury_point,
    },
  });
  // 改变打开yaame任务状态
  if (value.bury_point === 'day_open') {
    value.reward_status = 1;
    return;
  }
  if (value.reward_status || !value.scheme_url) return;
  window.location.href = value.scheme_url;
}

// 添加再次进入页面刷新
onActivated(() => {
  getRuleData();
})

onMounted(() => {
  timeEnd.value = calculateTimeUntilMidnightUTC();
  // 开启页面倒计时
  openTiming();
  getRuleData();
  // 埋点任务点击
  burialPointFun({
    event_name: "view_wealth_level_rules",
    cid: -1002,
    md: 120,
    args_name: "",
    args: "",
  });
})
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  overflow: auto;

  .header-title {
    font-size: .32rem;
    font-weight: 600;
  }

  .query {
    width: 6.36rem;
    margin: 2.24rem auto 0;
    font-weight: 600;
    font-size: .28rem;
    color: #FFFFFF;
    line-height: .4rem;
    text-align: center;
    opacity: .7;
  }

  .query:nth-child(4) {
    margin: .6rem auto .3rem;
  }

  .speak {
    width: 6.91rem;
    margin: .2rem auto 0;
    padding: .24rem .21rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: .24rem;
    font-size: .24rem;
    color: #FFFFFF;

    span {
      opacity: .6;
    }
  }

  .rank {
    position: relative;
    width: 6.9rem;
    margin: 0 auto .4rem;
    padding-top: .58rem;

    .title {
      position: absolute;
      top: 0;
      font-size: .26rem;
      color: #FFFFFF;
      opacity: .6;
    }

    .time {
      position: absolute;
      top: 0;
      right: 0;
      width: 2.9rem;
      height: .33rem;
      font-weight: 400;
      font-size: .24rem;
      text-align: right;
      color: #FFFFFF;
      opacity: .3;
      white-space: nowrap;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 6.9rem;
      padding: .22rem .3rem .22rem .2rem;
      margin-bottom: .2rem;
      background: rgba(255, 255, 255, 0.04);
      border-radius: .22rem;

      .frame {
        display: flex;
        align-items: center;
        img {
          width: .82rem;
          height: .82rem;
          margin-right: .2rem;
        }

        .info {
          display: flex;
          flex-direction: column;
          width: 3.7rem;
          .plan {
            min-height: .37rem;
            font-weight: 400;
            font-size: .26rem;
            color: #FFFFFF;
            line-height: .37rem;
          }

          .mission {
            min-height: .33rem;
            font-weight: 400;
            font-size: .24rem;
            color: #FFFFFF;
            line-height: .33rem;
            opacity: .4;
          }
        }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.1rem;
        height: .64rem;
        font-weight: 400;
        font-size: .28rem;
        color: #FFFFFF;
        background: url("https://yaame-static.yaame.io/admin/71eff7fd788048be4a4f7a77b1abe19e.png") no-repeat;
        background-size: contain;
      }

      .done {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 1.3rem;
        width: auto;
        height: .64rem;
        padding: 0 .3rem;
        background: url("https://yaame-static.yaame.io/admin/8d7adb2e978589e181cbe94f30eba116.png") no-repeat;
        background-size: 100% 100%;

        span {
          opacity: .4;
        }
      }
    }
  }
}
</style>