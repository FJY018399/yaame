<template>
  <div class="main" :style="{ backgroundImage: `url(https://yaame-static.yaame.io/admin/8e5552f34d91fb2519b9f8267a48df0b.webp)` }">
    <custom-header color="white">{{ $t('gift_week_star') }}</custom-header>

    <div class="logo-title" :style="logoStyle(language)">
      <!-- 活动时间 -->
      <div class="activity">{{ new Date(timeStart).getUTCMonth() + 1 }}/{{ new Date(timeStart).getUTCDate() }} 00:00-{{ new Date(timeEnd).getUTCMonth() + 1 }}/{{ new Date(timeEnd).getUTCDate() }} 23:59(UTC+0)</div>
    </div>
    <!-- 规则 -->
    <div class="rule" @click="$router.push('/rule')">{{ $t('rules_rewards') }}</div>
    <!-- 名人堂 -->
    <div class="hall-of-fame" :style="{ backgroundImage: `url(${logoImg[language]['hall-of-fame']})` }" @click="skipPage"></div>
    <!-- 上周榜 -->
    <div class="last-week">
      <div class="head">{{ $t('last_week_star') }}</div>
      <div class="top-img">
        <div class="user" v-for="(item, index) in topCycle.length ? topCycle : cards" :key="index">
          <div class="header">
            <div class="bg" @click="toDetails(item.user_info)"></div>
            <div v-if="item.user_info && item.user_info.user_status" class="status" :class="[ item.user_info.user_status === 1 ? 'online' : 'living' ]">{{ item.user_info.user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
            <img v-if="item.user_info" :src="item.user_info && item.user_info.avatar" alt="">
            <img v-else src="https://yaame-static.yaame.io/admin/8ef96ab664062cd6b9268c0b428e81e1.png" alt="">
          </div>
          <div v-if="item.user_info" class="name no-wrap">{{ item.user_info.nick_name }}</div>
          <div v-else class="name">{{ $t('position_available') }}</div>
          <div v-if="item.user_info" class="score no-wrap"><img src="https://yaame-static.yaame.io/admin/70153574ab60b855ee596c61bd1a0518.png" alt="">{{ item.user_info.score }}</div>
        </div>
      </div>
      <div class="bottom">
        <div class="gift" v-for="(ite, inx) in topCycle.length ? topCycle : cards" :key="inx">
          <div class="point-to"></div>
          <div class="icon">
            <img v-if="ite.gift_info" :src="ite.gift_info.reward_icon" alt="">
            <img v-else src="https://yaame-static.yaame.io/admin/325037c10e15b092103550bc6a5eeacd.png" alt="">
          </div>
        </div>
      </div>
      <p v-if="weekCycleNumber === currentCycle">{{ $t('next_week_star_update') }}</p>
    </div>
    <!-- 榜单 -->
    <div v-show="lazyLoad" class="ranking">
      <div class="head-title">{{ $t('ranking_list') }}</div>
      <!--时间倒计时-->
      <div class="time">
        <div class="times">{{ days }}</div>
        <div class="times">D</div>
        <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
        <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
        <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
        <p>{{ $t('current_countdown') }}</p>
      </div>
      <!-- 切换 -->
      <div class="card-container">
        <div class="frame" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"></div>
        <!-- 左右底部占位 -->
        <div class="left-bg box">
          <!-- 蒙层 -->
          <div class="mask box"></div>
        </div>
        <div class="right-bg box">
          <!-- 蒙层 -->
          <div class="mask box"></div>
        </div>
        <!-- 动画部分 -->
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card box"
          :class="getClass(index)">
          <img :src="card.reward_icon" class="box" alt="">
          <!-- 蒙层 -->
          <div class="mask box"></div>
        </div>
        <!-- 左右按钮 -->
        <div class="left-button box" @click="prevCard"></div>
        <div class="right-button box" @click="nextCard"></div>
        <!-- 指向 -->
        <div class="point-to box"></div>
      </div>
      <!-- tab -->
      <div class="tab">
        <div v-for="(item, index) in tabList" :key="index" class="box" :class="[active === item.key && 'active']"
             @click="activeClick(item.key)">
          {{ item.name }}
        </div>
      </div>
      <!-- 排名 -->
      <div class="row" ref="row" :style="{ overflowY: styleAuto }">
        <div class="list box" v-for="(item, index) in rankingList" :key="index" :class="rankClass(index)">
          <div v-if="index > 2" class="ranking-number">{{ index + 1 }}</div>
          <div class="head">
            <div class="bg box"></div>
            <div v-if="item.user_status" class="status" :class="[ item.user_status === 1 ? 'online' : 'living' ]">{{ item.user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
            <img class="box" v-if="item.avatar" :src="item.avatar" alt="">
            <div v-else-if="index < 3" class="no"></div>
            <div v-if="item.avatar" class="click box" @click="toDetails(item)"></div>
          </div>
          <div v-if="item.nick_name" class="top-name">
            <div class="name no-wrap">{{ item.nick_name }}</div>
            <img v-show="active === 'SEND_GIFT' && item.wealth_level" :src="item.wealth_level" alt="">
            <img v-show="active === 'RECEIVE_GIFT' && item.popular_level" :src="item.popular_level" alt="">
          </div>
          <div v-if="item.score" class="score box">
            <img v-if="active === 'RECEIVE_GIFT'" class="box" src="https://yaame-static.yaame.io/admin/70153574ab60b855ee596c61bd1a0518.png" alt="">
            <img v-else class="diamond box" src="https://yaame-static.yaame.io/admin/142c03687b998ada7722b64102c439d0.png" alt="">
            {{ item.score }}
          </div>
          <div v-if="item.relation && userList.uid !== item.uid" class="attention box" :class="{ 'yes': item.relation.attention }" :style="{ top: index > 2 && '.54rem' }" @click="attentions(item)"></div>
        </div>
        <!-- 缺省文案展示 -->
        <div v-if="statusRank" class="lack">
          <p>{{ $t('noRank') }}</p>
        </div>
      </div>
    </div>
    <!-- 用户排名 -->
    <div class="my-list" v-show="Object.keys(userList).length">
      <div class="ranking-number">{{ userList.rank && userList.rank <= 99 ? userList.rank : "99+" }}</div>
      <div class="head" @click="toDetails(userList)">
        <img :src="userList.avatar" alt="">
      </div>
      <div class="top-name">
        <div class="name no-wrap">{{ userList.nick_name }}</div>
      </div>
      <div class="score">
        <img v-if="active === 'RECEIVE_GIFT'" src="https://yaame-static.yaame.io/admin/70153574ab60b855ee596c61bd1a0518.png" alt="">
        <img v-else class="diamond" src="https://yaame-static.yaame.io/admin/142c03687b998ada7722b64102c439d0.png" alt="">
        {{ userList.score }}
      </div>
    </div>
    <pageLoading v-show="loading"/>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import {computed, getCurrentInstance, onMounted, ref} from 'vue';
import {getLanguage, isIOS} from "@/lib/device";
import {getHomeRankApi, postAttentionsApi} from "@/pages/weekGift/api";
import {Toast} from "vant";
import pageLoading from '@/components/common/page_loading.vue';
import {burialPointFun} from "@/lib/utils";
import {lazyLoadImages} from "@/lib/load-img";

// 当前活动周期
const weekCycle = ref(Number((new URLSearchParams(window.location.search).get("type"))) || false);

// 头部样式计算
const logoStyle = (language) => {
  switch (language) {
    case 'id':
      return { backgroundImage: `url(${logoImg.value[language].head})`, height: '3.4rem', top: '3.75rem' }
    default:
      return { backgroundImage: `url(${logoImg.value[language].head})`, height: '2.8rem' }
  }
}

// 国际化
const logoImg = ref({
  "ar": {
    head: 'https://yaame-static.yaame.io/admin/ba70399f5a98d207377677384f8ad2df.png',
    'hall-of-fame': 'https://yaame-static.yaame.io/admin/e4089b785899f3bab14f17d67af128b6.png'
  },
  "en": {
    head: 'https://yaame-static.yaame.io/admin/3d1eb130f955e423d0c930a6fee8c23d.png',
    'hall-of-fame': 'https://yaame-static.yaame.io/admin/6b0d6a23896f8cb44ee40fcdb4300948.png'
  },
  "id": {
    head: 'https://yaame-static.yaame.io/admin/67f6db779c8858f3e4131c726fc29a0f.png',
    'hall-of-fame': 'https://yaame-static.yaame.io/admin/6b0d6a23896f8cb44ee40fcdb4300948.png'
  },
  "zh-cn": {
    head: 'https://yaame-static.yaame.io/admin/7f715353111577e9149e04c02e438d5d.png',
    'hall-of-fame': 'https://yaame-static.yaame.io/admin/6389b81fd0bab5932e17ff304f6b9d7b.png'
  },
  "zh-tw": {
    head: 'https://yaame-static.yaame.io/admin/8c7263b8b699f8d5298524b61c9aef59.png',
    'hall-of-fame': 'https://yaame-static.yaame.io/admin/6389b81fd0bab5932e17ff304f6b9d7b.png'
  },
})

// 获取国际化多语言
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};
let language = computed(() => {
  let locale = getLanguage() || "en";
  if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
    let localEnum = {
      "zh-hk": "zh-tw",
      "zh-tw": "zh-tw",
      "zh-mo": "zh-tw",
      "zh-cn": "zh-cn",
    };

    locale = localEnum[locale];
  }
  return locale;
});

// 判断档期是否是第一期活动
const weekCycleNumber = ref(window.location.origin.indexOf('//test-yaame.yaame.net') > 0 || window.location.origin.indexOf('//localhost:8080') > 0 ? 2024090900 : 2024091600);
// 名人堂跳转
const skipPage = () => {
  // 页面点击上报
  burialPointFun({
    event_name: "page_btn_click",
    cid: -1000,
    md: 2,
    args_name: "",
    args: {
      type: 'Hall_click',
      page_name: 'Weeklystar_event'
    },
  });

  if (currentCycle.value === weekCycleNumber.value) {
    Toast(t('next_week_star_update'));
    return;
  }

  root.proxy.$router.push('/award');
}

// tab数据
const cards = ref([]);

// 切换当前卡片下标
const currentIndex = ref(0);
// 计算当前类名
const getClass = (index) => {
  if (index === currentIndex.value) {
    return 'top';
  } else if (index === (currentIndex.value - 1 + cards.value.length) % cards.value.length) {
    return 'left';
  } else if (index === (currentIndex.value + 1) % cards.value.length) {
    return 'right';
  } else {
    return 'bottom';
  }
};
// 节流阀
let throttle = false;
// 切换上一张卡片
const prevCard = () => {
  active.value = 'RECEIVE_GIFT';
  if (throttle) return;
  throttle = true;
  // 页面点击上报
  burialPointFun({
    event_name: "page_btn_click",
    cid: -1000,
    md: 2,
    args_name: "",
    args: {
      type: 'Giftrank_click',
      page_name: 'Weeklystar_event'
    },
  });
  currentIndex.value = (currentIndex.value - 1 + cards.value.length) % cards.value.length;
  getHomeData(cards.value[currentIndex.value].id, active.value);
  setTimeout(() => {
    throttle = false;
  },300)
};
// 切换下一张卡片
const nextCard = () => {
  active.value = 'RECEIVE_GIFT';
  if (throttle) return;
  throttle = true;
  // 页面点击上报
  burialPointFun({
    event_name: "page_btn_click",
    cid: -1000,
    md: 2,
    args_name: "",
    args: {
      type: 'Giftrank_click',
      page_name: 'Weeklystar_event'
    },
  });
  currentIndex.value = (currentIndex.value + 1) % cards.value.length;
  getHomeData(cards.value[currentIndex.value].id, active.value);
  setTimeout(() => {
    throttle = false;
  },300)
};

// 活动开始时间
const timeStart = ref(0);
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
  }, 1000)
}

// 控制显示两个表格
const tabList = ref([
  {
    name: t('week_star_ranking'),
    key: "RECEIVE_GIFT",
  },
  {
    name: t('contribution_ranking'),
    key: "SEND_GIFT",
  },
]);
// tab切换
let active = ref("RECEIVE_GIFT");
// tab切换获取那天数据
const activeClick = (key) => {
  // 去除排行榜等级抖动
  rankingList.value = [{},{},{}];
  userList.value = {}
  active.value = key;
  getHomeData(gifId.value, key);
};


// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingList = ref([]);
// 上期周星
const topCycle = ref([]);
// 记录当前礼物id
const gifId = ref(null);
// 当前排行榜是否无数据
const statusRank = ref(false);
// 当前活动周期
const currentCycle = ref(null);

const getHomeData = async (giftId, weekStarType) => {
  try {
    const params = {}
    if (giftId) {
      params.giftId = giftId;
      gifId.value = giftId;
    }
    if (weekCycle.value) params.weekCycle = weekCycle.value;
    if (weekStarType) params.weekStarType = weekStarType;
    const res = await getHomeRankApi(params);
    if (res.status !== 1000) return;
    // 获取页面数据
    timeStart.value = res.data.activity_start;
    timeEnd.value = res.data.activity_end - 60000;
    rankingList.value = res.data.rank;
    userList.value = res.data.my_rank_info;
    currentCycle.value = Number(res.data.current_cycle);
    cards.value = res.data.gift_info;
    topCycle.value = res.data.top_cycle ? res.data.top_cycle.top_users : [];
    // 判断当前排行榜是否有数据
    statusRank.value = !res.data.rank.length;
    // 判断当前排行数据  固定前三数据
    setRanking();
  } catch (err) {
    console.log(err);
  }
}

// 修改排行榜数据
const setRanking = () => {
  if (rankingList.value.length < 3) {
    rankingList.value.push(...Array(3 - rankingList.value.length).fill({}));
  }
}
// 添加对应类名
const rankClass = (index) => {
  switch (index) {
    case 0: return 'top1';
    case 1: return 'top2';
    case 2: return 'top3';
    default: return 'row-list';
  }
}

// 关注
const attentions = async (value) => {
  try {
    if (value.mystery) { // 神秘人
      Toast(t('mystery_user'));
      return;
    }
    if (value.relation.attention) { // 已关注跳转私聊页面
      window.location.href = value.scheme_url;
      return;
    }
    const res = await postAttentionsApi({
      target_uid: value.uid
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('followed'));
    // 刷新当前组别信息
    await getHomeData(gifId.value, active.value);
  } catch (err) {
    console.log(err);
  }
}

// 跳转
const toDetails = (url) => {
  if (!url) return;
  if (url.mystery === 1) {
    Toast(t('mystery_user'));
    return;
  }
  window.location.href = url.scheme_user_url;
}

// 滑动切换tab记录值
let startX = 0
let endX = 0

// 触摸开始时记录初始位置
const onTouchStart = (event) => {
  startX = event.touches[0].clientX
}

// 触摸移动时实时记录当前位置
const onTouchMove = (event) => {
  endX = event.touches[0].clientX
}

// 触摸结束时判断滑动方向
const onTouchEnd = () => {
  const deltaX = endX - startX

  if (Math.abs(deltaX) > 20) {
    if (deltaX < 0) {
      // 向左滑动，切换到下一张卡片
      nextCard()
    } else {
      // 向右滑动，切换到上一张卡片
      prevCard()
    }
  }
}

// 懒加载
const lazyLoad = ref(false);
// 添加loading
let loading = ref(true);

// 排行榜dom
const row = ref(null);
const { loadImages } = lazyLoadImages();

const styleAuto = ref('hidden')
// 动态更改排行滑动样式
const scrollAuto = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  const ios = isIOS() ? 100 : 0
  // 判断是否滚动到了底部
  if (Math.ceil(scrollTop + clientHeight) >= Math.floor(scrollHeight - ios)) {
    styleAuto.value = 'auto';
  } else {
    styleAuto.value = 'hidden';
  }
}
onMounted(async () => {
  window.onload = () => {
    loading.value = false;
  }
  await getHomeData(undefined, 'RECEIVE_GIFT');
  lazyLoad.value = true;
  lazyLoadImages();
  // 监控排行榜滑动懒加载
  row.value.addEventListener('scroll', loadImages);
  window.addEventListener('scroll', scrollAuto);
  openTiming();
  // 页面浏览埋点
  burialPointFun({
    event_name: "event_page_view",
    cid: -1000,
    md: 1,
    args_name: "",
    args: {
      type: '',
      page_name: 'Weeklystar_event'
    },
  });
})

</script>

<style lang="less" scoped>
.main {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: contain;
  overflow: hidden;

  .logo-title {
    position: absolute;
    top: 4.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.5rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .activity {
    position: absolute;
    bottom: .25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 3.95rem;
    height: .33rem;
    font-weight: 500;
    font-size: .24rem;
    color: #FFD98D;
    line-height: .3rem;
    white-space: nowrap;
    text-align: center;
  }

  .rule {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 3.61rem;
    width: 1.84rem;
    height: .64rem;
    //padding: 0 .3rem 0 0;
    background: url("https://yaame-static.yaame.io/admin/2de621945ce117f7859a634ea13a13df.png") no-repeat;
    background-size: contain;
    font-weight: 600;
    font-size: .22rem;
    color: #9E3100;
    text-align: center;
  }

  .hall-of-fame {
    position: absolute;
    right: .28rem;
    top: 6.5rem;
    width: 1.4rem;
    height: 1.52rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .last-week {
    position: relative;
    width: 7.4rem;
    height: 5.91rem;
    margin: 7.67rem auto 0;
    padding-top: 1.11rem;
    background-image: url(https://yaame-static.yaame.io/admin/283e76b732e558fa09a736f85e23395c.png);
    background-repeat: no-repeat;
    background-size: contain;

    .head {
      position: absolute;
      left: 50%;
      top: .48rem;
      transform: translateX(-50%);
      height: .28rem;
      line-height: .28rem;
      font-weight: 600;
      font-size: .32rem;
      color: #FFEAC4;
    }

    .top-img {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .user {
        width: 1.58rem;
        .header {
          position: relative;
          width: 1.58rem;
          height: 1.59rem;
          .status {
            position: absolute;
            top: 1.15rem;
            left: 50%;
            transform: translateX(-50%);
            width: .66rem;
            height: .24rem;
            padding: 0 .08rem;
            border-radius: .08rem;
            z-index: 2;
            font-size: .18rem;
            color: #FFFFFF;
            text-align: center;
          }
          .online {
            background: #4B9AF2;
          }
          .living {
            background: #EEAC19;
          }
          .bg {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background: url("https://yaame-static.yaame.io/admin/55392d608d8892fe02976b9af1298bc7.png") no-repeat;
            background-size: contain;
            z-index: 1;
          }
          img {
            position: absolute;
            top: .19rem;
            left: .22rem;
            width: 1.13rem;
            height: 1.13rem;
            border-radius: 50%;
          }
        }
        .name {
          width: 1.6rem;
          line-height: .2rem;
          margin: .09rem 0 .07rem;
          font-weight: 500;
          font-size: .20rem;
          color: #FFCEA0;
          text-align: center;
        }
        .score {
          display: flex;
          justify-content: center;
          width: 1.6rem;
          font-size: .20rem;
          color: #E3916C;
          img {
            width: .26rem;
            height: .24rem;
          }
        }
      }
    }
    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin-top: .06rem;
      .gift {
        width: 1.34rem;
        .point-to {
          width: .3rem;
          height: .19rem;
          margin: 0 auto;
          background: url("https://yaame-static.yaame.io/admin/3381ac0c152d38184ba252dcca62ee70.png") no-repeat;
          background-size: contain;
          transform: rotate(180deg);
        }
        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.34rem;
          height: 1.34rem;
          margin-top: .04rem;
          background: url("https://yaame-static.yaame.io/admin/c092ed1fbb322a8f8b248201b3e57413.png") no-repeat;
          background-size: contain;
          img {
            width: .87rem;
            height: .87rem;
          }
        }
      }
    }
    p {
      width: 6.5rem;
      height: .44rem;
      margin: .2rem auto 0;
      font-size: .2rem;
      color: #FFB391;
      line-height: .22rem;
      text-align: center;
    }
  }

  .ranking {
    position: relative;
    width: 7.2rem;
    height: 21.05rem;
    margin: .18rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/cace8b94fdd981c6e54eb25599cc0a61.png") no-repeat;
    background-size: contain;
    overflow: hidden;
    z-index: 1;

    .head-title {
      position: absolute;
      top: .39rem;
      left: 50%;
      transform: translateX(-50%);
      height: .28rem;
      line-height: .28rem;
      font-weight: 600;
      font-size: .32rem;
      color: #FFEAC4;
    }

    .time {
      position: relative;
      display: flex;
      align-items: center;
      width: 5.66rem;
      height: 1.03rem;
      margin: 1.29rem auto 0.44rem;
      padding: .43rem 1.21rem .14rem 1.2rem;
      background: url("https://yaame-static.yaame.io/admin/17030467cbcfafb2d2c8d0634fb41132.png") no-repeat;
      background-size: contain;
      .times {
        width: .54rem;
        margin-right: .15rem;
        font-weight: 400;
        font-size: .25rem;
        color: #E3916C;
        text-align: center;
        line-height: .2rem;
      }
      .times:nth-child(1) {
        margin-right: 0.1rem;
      }
      .times:nth-last-child(2) {
        margin-right: 0;
      }
      p {
        position: absolute;
        top: .12rem;
        left: 50%;
        transform: translateX(-50%);
        height: .2rem;
        line-height: .2rem;
        font-weight: 400;
        font-size: .2rem;
        color: #FFB391;
        white-space: nowrap;
      }
    }

    .card-container {
      position: relative;
      width: 100%;
      height: 2.48rem;
      .frame {
        position: absolute;
        width: 4rem;
        height: 2.48rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 6;
      }
      .left-bg,
      .right-bg {
        position: absolute;
        top: 50%;
        left: 1.01rem;
        transform: translateY(-50%);
        background: url("https://yaame-static.yaame.io/admin/3a949e81e7191a067156e989346ac408.png") no-repeat;
        background-size: contain;
        width: 1.23rem;
        height: 1.39rem;
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url("https://yaame-static.yaame.io/admin/17f90b8fa8c46afe1f045d1f4be1ae8e.png") no-repeat;
          background-size: contain;
        }
      }
      .right-bg {
        left: 4.96rem;
      }

      .card {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: url("https://yaame-static.yaame.io/admin/3a949e81e7191a067156e989346ac408.png") no-repeat;
        background-size: contain;
        transition-duration: .3s;

        img {
          width: 1.2rem;
          height: 1.2rem;
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url("https://yaame-static.yaame.io/admin/68ccf11346af8de64d2390e4f8a27ae8.png") no-repeat;
          background-size: contain;
          transition-duration: .3s;
        }
      }
      .top {
        left: 2.51rem;
        width: 2.18rem;
        height: 2.48rem;
        z-index: 4;
        opacity: 1;
        .mask {
          opacity: 0;
        }
      }
      .left {
        left: 1.6rem;
        width: 1.64rem;
        height: 1.87rem;
        z-index: 3;
        opacity: 1;
      }
      .right {
        left: 3.96rem;
        width: 1.64rem;
        height: 1.87rem;
        opacity: 1;
        z-index: 3;
      }
      .bottom {
        left: 2.8rem;
        width: 1.64rem;
        height: 1.87rem;
        opacity: 0;
        z-index: 2;
      }

      .left-button,
      .right-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: .49rem;
        width: .88rem;
        height: .88rem;
        background: url("https://yaame-static.yaame.io/admin/a87a166dedeb5709e4b0123b8c831144.png") no-repeat;
        background-size: contain;
        z-index: 5;
      }
      .right-button {
        left: 5.83rem;
        transform: translateY(-50%) rotate(180deg);
      }

      .point-to {
        position: absolute;
        left: 50%;
        bottom: -0.44rem;
        transform: translateX(-50%);
        width: .48rem;
        height: .31rem;
        background: url("https://yaame-static.yaame.io/admin/3381ac0c152d38184ba252dcca62ee70.png") no-repeat;
        background-size: contain;
      }
    }

    .tab {
      display: flex;
      justify-content: space-between;
      width: 6.66rem;
      height: .76rem;
      margin: .63rem auto 0;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.26rem;
        height: .76rem;
        padding-top: .05rem;
        line-height: .28rem;
        background-image: url("https://yaame-static.yaame.io/admin/cbe31c9fa9a571ff3111a16f0f045ca4.png") !important;
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: .28rem;
        color: #E3916C;
        transition-duration: .2s;
        text-align: center;
      }
      .active {
        background-image: url(https://yaame-static.yaame.io/admin/064c8a86287f3d57b32d695e317a129d.png) !important;
        color: #702121;
      }
    }

    .row {
      position: relative;
      top: -0.01rem;
      width: 7.2rem;
      height: 17.74rem;
      padding-top: .21rem;
      padding-bottom: 5.64rem;
      background-image: url(https://yaame-static.yaame.io/admin/be96eefa8e8f3dc24a3f9d67c0182e6a.png);
      background-size: contain;
      overflow-y: auto;
      .list {
        position: relative;
        width: 6.6rem;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-size: contain;
        .ranking-number {
          position: absolute;
          top: .6rem;
          left: .34rem;
          width: .15rem;
          height: .33rem;
          line-height: .33rem;
          font-weight: 500;
          font-size: .24rem;
          color: #FFC560;
          text-align: center;
        }
        .head {
          position: absolute;
          top: .82rem;
          left: .05rem;
          width: 2.46rem;
          height: 1.42rem;
          .status {
            position: absolute;
            top: 1.15rem;
            left: 50%;
            transform: translateX(-50%);
            width: .66rem;
            height: .24rem;
            padding: 0 .08rem;
            border-radius: .08rem;
            z-index: 2;
            font-size: .18rem;
            color: #FFFFFF;
            text-align: center;
          }
          .online {
            background: #4B9AF2;
          }
          .living {
            background: #EEAC19;
          }
          .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 1;
          }
          img,
          .no {
            position: absolute;
            top: .3rem;
            left: 50%;
            transform: translateX(-50%);
            width: .89rem;
            height: .89rem;
            border-radius: 50%;
          }
          .click {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: .96rem;
            height: .89rem;
            z-index: 2;
          }
        }
        .top-name {
          display: flex;
          align-items: center;
          position: absolute;
          top: 1.17rem;
          left: 2.63rem;
          width: 3rem;
          height: .35rem;
          line-height: .35rem;
          .name {
            height: .35rem;
            font-weight: 600;
            font-size: .28rem;
          }
          img {
            width: .55rem;
            height: .22rem;
            margin-left: .04rem;
          }
        }
        .score {
          display: flex;
          align-items: center;
          position: absolute;
          top: 1.57rem;
          left: 2.19rem;
          width: 2.52rem;
          height: .39rem;
          padding-left: .47rem;
          background-repeat: no-repeat;
          background-size: contain;
          font-weight: 600;
          font-size: .26rem;
          color: #FFFFFF;
          img {
            width: .32rem;
            height: .29rem;
            margin-right: .06rem;
          }
        }
      }
      .top1 {
        height: 2.41rem;
        background-image: url(https://yaame-static.yaame.io/admin/fa5b60dc69ec64df89d87f2267cf1827.png);
        .bg {
          background-image: url(https://yaame-static.yaame.io/admin/dc9a67fa59bc5de9e04551adc54677a7.png);
        }
        .no {
          background: url("https://yaame-static.yaame.io/admin/eab610150556b4197ef95b61b3f891e6.png") no-repeat;
          background-size: contain;
        }
        .top-name {
          color: #702121;
        }
        .score {
          background-image: url(https://yaame-static.yaame.io/admin/c75e44367e6f3cd0074a1d462a8a55a5.png);
        }
      }
      .top2 {
        height: 2.41rem;
        background-image: url(https://yaame-static.yaame.io/admin/120c8f95597996d793b1311edf1f007b.png);
        .bg {
          background-image: url(https://yaame-static.yaame.io/admin/8345d081eeca543f3fc9d9f1f481bf86.png);
        }
        .no {
          background: url("https://yaame-static.yaame.io/admin/c420532891877de5a9fa52c3164d8a1b.png") no-repeat;
          background-size: contain;
        }
        .top-name {
          color: #194192;
        }
        .score {
          background-image: url(https://yaame-static.yaame.io/admin/f1ce9ac11643a2c885b44a6b7cf5e323.png);
        }
      }
      .top3 {
        height: 2.39rem;
        background-image: url(https://yaame-static.yaame.io/admin/a5c6c2eed38fc54688ac5789234e40fd.png);
        .bg {
          background-image: url(https://yaame-static.yaame.io/admin/94972bcba7155a53faa8b5b794e7365d.png);
        }
        .no {
          background: url("https://yaame-static.yaame.io/admin/6caf170a53a8b6ac521edc2344df12fb.png") no-repeat;
          background-size: contain;
        }
        .top-name {
          color: #711818;
        }
        .score {
          background-image: url(https://yaame-static.yaame.io/admin/1eccf4c4f5c67fbb1436af02f5c4db61.png);
        }
      }

      .lack {
        position: relative;
        width: 1rem;
        height: 1.2rem;
        margin: .68rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/f6245c295aea95aa382459e766620d3b.png") no-repeat;
        background-size: contain;
        p {
          position: absolute;
          top: 1.51rem;
          left: 50%;
          transform: translateX(-50%);
          height: .33rem;
          font-weight: 400;
          font-size: .24rem;
          line-height: .33rem;
          color: #FFC560;
          white-space: nowrap;
        }
      }

      .row-list {
        height: 1.5rem;
        margin: .2rem auto;
        background-image: url(https://yaame-static.yaame.io/admin/80c24a451108924816e3843b41e2ceb4.png);

        .head {
          top: .23rem;
          left: .86rem;
          width: .98rem;
          height: .98rem;
          .status {
            top: .82rem;
          }
          .bg {
            background-image: url(https://yaame-static.yaame.io/admin/14577b738c5d55fbd709c7a84e04a52e.png);
          }
          img {
            top: .06rem;
            width: .92rem;
            height: .92rem;
            margin-right: .06rem;
          }
        }
        .top-name {
          top: .46rem;
          left: 2.22rem;
          height: .24rem;
          line-height: .24rem;
          .name {
            height: .28rem;
            font-weight: 500;
            font-size: .24rem;
            color: #FFC560;
          }
        }
        .score {
          top: .81rem;
          left: 1.78rem;
          background-image: url(https://yaame-static.yaame.io/admin/7932a6d185866deda0746300ca2250e9.png);
          color: #FFE88A;
        }
      }

      .attention {
        position: absolute;
        right: .32rem;
        top: 1.39rem;
        width: .42rem;
        height: .42rem;
        background-image: url(https://yaame-static.yaame.io/admin/97548dcbb055b800b2aebd1dfdf9dc87.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
      .yes {
        width: .42rem;
        height: .36rem;
        background-image: url(https://yaame-static.yaame.io/admin/0e8b2ce1867daf720c556b4a1aa9bce1.png);
      }
    }
  }

  .my-list {
    position: fixed;
    bottom: 0;
    width: 7.5rem;
    height: 1.64rem;
    background: url("https://yaame-static.yaame.io/admin/03680aeb75203bd228daac44831d5d63.png") no-repeat;
    background-size: contain;
    z-index: 10;
    .ranking-number {
      position: absolute;
      top: .71rem;
      left: .37rem;
      width: .72rem;
      height: .28rem;
      font-weight: 600;
      font-size: .24rem;
      color: #FFC560;
    }
    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: .35rem;
      left: 1.31rem;
      width: .98rem;
      height: .98rem;
      background: url(https://yaame-static.yaame.io/admin/14577b738c5d55fbd709c7a84e04a52e.png) no-repeat;
      background-size: contain;
      img {
        width: .86rem;
        height: .86rem;
        border-radius: 50%;
      }
    }
    .top-name {
      position: absolute;
      top: .58rem;
      left: 2.67rem;
      width: 3rem;
      height: .3rem;
      margin-bottom: .11rem;
      line-height: .3rem;
      font-weight: 500;
      font-size: .24rem;
      color: #FFC560;
    }
    .score {
      display: flex;
      align-items: center;
      position: absolute;
      top: .93rem;
      left: 2.23rem;
      width: 2.52rem;
      height: .39rem;
      padding-left: .47rem;
      background: url(https://yaame-static.yaame.io/admin/7932a6d185866deda0746300ca2250e9.png) no-repeat;
      background-size: contain;
      font-weight: 600;
      font-size: .26rem;
      color: #FFC560;
      img {
        width: .32rem;
        height: .29rem;
        margin-right: .06rem;
      }
    }

    .previous {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: .63rem;
      right: .77rem;
      span {
        font-weight: 400;
        font-size: .22rem;
        color: #FFC560;
        text-align: center;
      }
      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: .25rem;
        color: #FFC560;
        img {
          width: .32rem;
          height: .29rem;
        }
        .diamond {
          width: .24rem;
          height: .18rem;
        }
      }
    }
  }
}
.diamond {
  width: .24rem !important;
  height: .18rem !important;
  margin-right: .06rem;
}
</style>