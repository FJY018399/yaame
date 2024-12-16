<template>
  <div class="main" ref="main">
    <div class="index" :style="{ backgroundImage: `url(${headImg[language]})` }">
      <!--返回栏-->
      <custom-header color="white" :dom-main="main">{{ $t('who_is_lucky_king') }}</custom-header>

      <!--规则奖励弹窗-->
      <div class="rule-award" @click="ruleFun">{{ $t('rules_and_rewards') }}</div>

      <!--时间倒计时-->
      <div class="time">
        <div class="times">{{ days }}</div>
        <div class="times">D</div>
        <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
        <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
        <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
      </div>

      <!--游戏跳转-->
      <div class="game">
        <div class="txt">{{ $t('new_games_available') }}</div>
        <div class="txt">{{ $t('extra_rewards_available') }}</div>
        <div class="game-list" v-for="(item, index) in gameList" :key="index"
             :style="{ backgroundImage: `url(${item.img})` }" @click="skip(item.url, item.type)">
          <p>{{ item.name }}</p>
        </div>
        <div class="barrage">
          <div class="bg-border"></div>
          <div class="bg"></div>
          <vue-danmaku v-if="statusBarrage" class="vueDanmaku" ref="danmaku" v-model="listBarrage" randomChannel use-slot loop
                       :speeds="40" :channels="3">
            <template slot="dm" slot-scope="{ index, danmu }">
              <div class="strip">{{ danmu }}</div>
            </template>
          </vue-danmaku>
        </div>
      </div>

      <!--tab-->
      <div class="tab">
        <div class="tabs"
             v-show="tabStyle === 0"
             :class="{ 'tabs-one': tabStyle === index }"
             v-for="(item, index) in tabImg[language]" :key="index"
             :style="{ backgroundImage: `url(${item.one})` }"
             @click="selectTab(index)"></div>
        <div class="tabs"
             v-show="tabStyle === 1"
             :class="{ 'tabs-one': tabStyle === index }"
             v-for="(item, index) in tabImg[language]" :key="index + 2"
             :style="{ backgroundImage: `url(${item.two})` }"
             @click="selectTab(index)"></div>
      </div>

      <!--任务排行榜-->
      <task v-show="tabStyle === 0" :homeData="homeData" @mounted="getHomeData" :main="main"></task>
      <ranking v-show="tabStyle === 1" :rankingData="rankingData" @mounted="getRankingAwards"></ranking>
    </div>
    <pageLoading v-show="loading"></pageLoading>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, nextTick, onActivated, onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import customHeader from "@/components/common/cs_header";
import vueDanmaku from "vue-danmaku";
import {getLanguage} from "@/lib/device";
import {getLuckyKinHomeApi, getLuckyKinRankApi} from "@/pages/kingOfLuck/api";
import {Toast} from "vant";
import eventBus from './eventBus';
import pageLoading from '../../components/common/page_loading.vue';
import Task from "@/pages/kingOfLuck/components/task.vue";
import Ranking from "@/pages/kingOfLuck/components/ranking.vue";
import { burialPointFun } from "@/lib/utils";

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

// 头图多语言
const headImg = ref({
  "ar": "https://yaame-static.yaame.io/admin/61473c0c70075458c2a018e6bad5e691.png",
  "en": "https://yaame-static.yaame.io/admin/03275ce0a0d033f989fbca05099e5fab.png",
  "id": "https://yaame-static.yaame.io/admin/b08d6d73754fe37ad416fe8b5bd56833.png",
  "zh-cn": "https://yaame-static.yaame.io/admin/f137fb864064ffd865bddfc08048bdf2.png",
  "zh-tw": "https://yaame-static.yaame.io/admin/6419422ce83cc892cc294fd7c77bf6b8.png",
})

let tabStyle = ref(1);
// tab国际化
const tabImg = ref({
  "zh-cn": [
    {
      one: "https://yaame-static.yaame.io/admin/042bb1d4b3481e156d5baf1a2f388872.png", // 选中
      two: "https://yaame-static.yaame.io/admin/f18b64acad94fadf251c6c936237888d.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/e701cf62bf6e731e370df1edbe8075bb.png",
      one: "https://yaame-static.yaame.io/admin/c091d491126df01195ab85af7dc3dcfb.png"
    }
  ],
  "zh-tw": [
    {
      one: "https://yaame-static.yaame.io/admin/52aaa6b42c0db490fca49eb2e5f6aa53.png", // 选中
      two: "https://yaame-static.yaame.io/admin/c11693a8f84b611cc395c4f3cc63ccf6.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/0713a750be7a72c7e85233133ad6020a.png",
      one: "https://yaame-static.yaame.io/admin/02787ecfc9db35933fba9c9d16fb1bb0.png"
    }
  ],
  "en": [
    {
      one: "https://yaame-static.yaame.io/admin/de3fa47dfb80e5cf564a2ffa9db44ef2.png", // 选中
      two: "https://yaame-static.yaame.io/admin/72f4ae2eca2e4613e00ae04bf48aff97.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/66d79d834c34a47cf080ba36cbe419a4.png",
      one: "https://yaame-static.yaame.io/admin/d80679e95e237879c4e3e1330908448f.png"
    }
  ],
  "id": [
    {
      one: "https://yaame-static.yaame.io/admin/21439adfcf80c20965f2bd66b6aab147.png", // 选中
      two: "https://yaame-static.yaame.io/admin/7213f42a9dea2d8a0944720c82e6ac84.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/d4311540405a6e94838369182c413006.png",
      one: "https://yaame-static.yaame.io/admin/fcf496d6dde469c2803a13e389f0c0ab.png"
    }
  ],
  "ar": [
    {
      one: "https://yaame-static.yaame.io/admin/ba0c4f7fbb4131bd8a9e688276945c99.png", // 选中
      two: "https://yaame-static.yaame.io/admin/4cdfba9b9ca11f05df23ff01cac4e47d.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/f05785da8446fc809dc087858cca5ab6.png",
      one: "https://yaame-static.yaame.io/admin/87623ca78e7127b6c804730ab9ee2f26.png"
    }
  ],
});
// 切换tab
const selectTab = (index) => {
  tabStyle.value = index;
  if (index) {
    getRankingAwards();
    root.proxy.$router.replace('ranking');
  } else {
    getHomeData();
    root.proxy.$router.replace('task');
  }
}
// 规则奖励跳转
const ruleFun = () => {
  statusBarrage.value = false;
  root.proxy.$router.push('/reward');
}
// 外层盒子dom
const main = ref(null);

// 游戏背景
const gameList = ref([
  {
    img: 'https://yaame-static.yaame.io/admin/105d8ca31e0b6d07e156825a3d22f19e.png',
    name: t('small_rocket'),
    type: 'roket_game'
  },
  {
    img: 'https://yaame-static.yaame.io/admin/bae6f46ca8ab631aa4abe7fdfe6a6079.png',
    name: t('greedy_box'),
    type: 'greedybox_game'
  },
  {
    img: 'https://yaame-static.yaame.io/admin/43f67fc924c6e96d1980c0eb3bf76f6d.png',
    name: t('fishing'),
    type: 'fishing_game'
  }
])

// 弹幕数据
const listBarrage = ref([]);
// 获取首页数据
const homeData = ref({});
const getHomeData = async () => {
  try {
    const res = await getLuckyKinHomeApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    if (res.data.activity_status === 0) Toast(t('event_not_started'));
    else if (res.data.activity_status === 2) Toast(t('event_ended'));
    else if (res.data.activity_status === 3) Toast(t('event_ended'));
    listBarrage.value = res.data.carousels;
    homeData.value = res.data;
    timeEnd.value = res.data.activity_end_time;
    gameList.value[0]['url'] = res.data.rocket_scheme_url;
    gameList.value[1]['url'] = res.data.greedy_box_scheme_url;
    gameList.value[2]['url'] = res.data.fishing_scheme_url;
  } catch (err) {
    console.log(err);
  }
}

// 获取排行榜和奖励数据
const rankingData = ref({});
const rankRewardData = ref([]);
const getRankingAwards = async () => {
  try {
    const res = await getLuckyKinRankApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    // 发送数据
    rankingData.value = {
      my_rank_info: res.data.my_rank_info,
      rank: res.data.rank,
    }
    rankRewardData.value = res.data.rank_reward_levels;
  } catch (err) {
    console.log(err);
  }
}


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
  },1000)
}

// 跳转
const skip = (url, type) => {
  window.location.href = url;
  burialPointFun({
    event_name: "game_enter_click",
    cid: -1000,
    md: 2,
    args_name: "game_enter_click",
    args: {
      which: type,
    },
  });
}

onMounted(async () => {
  statusBarrage.value = true;
  // 页面loading效果
  window.onload = () => {
    tabStyle.value = 0;
    // 关闭加载窗
    loading.value = false;
  }
  await getHomeData();
  // 开启页面倒计时
  openTiming();
  eventBus.on('refresh', getRankingAwards);
  eventBus.on('refurbish', getHomeData);
  burialPointFun({
    event_name: "event_page_view",
    cid: -1000,
    md: 1,
    args_name: "event_page_view",
  });
})
// 控制弹幕重新刷新
const statusBarrage = ref(false);
onActivated(() => {
  statusBarrage.value = true;
})

onBeforeUnmount(() => {
  eventBus.off('refresh', getRankingAwards);
  eventBus.off('refurbish', getHomeData);
})
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  overflow: auto;

  .index {
    position: relative;
    min-height: 100vh;
    padding-bottom: .32rem;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;

    .rule-award {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      top: 2.8rem;
      min-width: 1.35rem;
      height: .55rem;
      padding: 0 .14rem 0 .21rem;
      background: url("https://yaame-static.yaame.io/admin/58357e344f8f6e33fe97f7b0130011d3.png") no-repeat;
      background-size: 100% 100%;
      font-size: .2rem;
      color: #FFFFFF;
    }

    .time {
      display: flex;
      justify-content: space-between;
      width: 4.52rem;
      margin: 4.22rem auto 0;
      .times {
        display: flex;
        justify-content: center;
        align-items: center;
        width: .73rem;
        height: .71rem;
        font-size: .34rem;
        color: #AA4201;
      }
      .times:nth-child(n+3) {
        width: .82rem;
        height: .71rem;
      }
    }

    // 游戏盒子样式
    .game {
      position: relative;
      width: 7.26rem;
      height: 7.75rem;
      margin: .59rem auto 0;
      padding: .7rem 0 0 0;
      background: url("https://yaame-static.yaame.io/admin/f91a0764d5197bef07bcb1a662ab1d61.png") no-repeat;
      background-size: contain;

      .txt {
        width: 80%;
        margin: 0 auto;
        font-size: .36rem;
        text-align: center;
        font-weight: 600;
        color: #9D490B;
      }

      .txt:nth-child(2) {
        margin: .1rem auto .3rem;
        font-size: .24rem;
      }

      .game-list {
        position: relative;
        float: left;
        width: 2.2rem;
        height: 2.92rem;
        margin-right: .08rem;
        background-repeat: no-repeat;
        background-size: contain;
        p {
          height: .28rem;
          margin-top: .08rem;
          text-align: center;
          font-weight: 600;
          font-size: .20rem;
          color: #FFE5B3;
        }
      }
      .game-list:nth-child(3) {
        margin-left: .25rem;
      }

      .barrage {
        position: relative;
        float: left;
        width: 6.7rem;
        height: 2.09rem;
        margin: .22rem 0 0 .25rem;
        .bg-border {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url("https://yaame-static.yaame.io/admin/e13dbd86a07e89309579bc84288a7a0a.png") no-repeat;
          background-size: contain;
          z-index: 1;
        }
        .bg {
          position: absolute;
          top: .12rem;
          left: 50%;
          width: 6.57rem;
          height: 1.85rem;
          transform: translateX(-50%);
          background: url("https://yaame-static.yaame.io/admin/bc5b5e785edc66c51648cd0e037e6581.png") no-repeat;
          background-size: contain;
        }

        .vueDanmaku {
          width: 6.45rem;
          height: 1.58rem;
          margin: .37rem auto 0;

          .strip {
            //width: 5.28rem;
            height: .37rem;
            padding: 0 .21rem;
            background: rgba(37, 96, 186, 0.6);
            border-radius: .19rem;
            font-size: .22rem;
            color: #FFFFFF;
            text-align: center;
          }
        }
      }
    }

    // tab
    .tab {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 6.13rem;
      height: 1.14rem;
      margin: .37rem auto 0;

      .tabs {
        width: 2.83rem;
        height: .88rem;
        background-repeat: no-repeat;
        background-size: contain;
      }

      .tabs-one {
        width: 2.9rem;
        height: 1.14rem;
      }
    }
  }
}
</style>