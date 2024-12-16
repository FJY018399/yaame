<template>
	<div class="main" :style="{ backgroundImage: `url(${headImg[language]})` }">
    <div class="index">
      <custom-header color="white">{{ $t('halloween_party') }}</custom-header>

      <!-- 规则/party -->
      <div class="rule" @click="$router.push('/rule')">{{ $t('rules_rewards') }}</div>
      <div class="party" @click="openParty">{{ $t('halloween_party_title') }}</div>

      <!--时间倒计时-->
      <div class="time">
        <div class="times">{{ days }}</div>
        <div class="times">D</div>
        <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
        <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
        <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
      </div>

      <!-- 奖励项 -->
      <div class="gifts">
        <div class="gift-list" v-for="(item, index) in awardList" :key="index">
          <div class="icon">
            <img :src="item.reward_icon" alt="">
          </div>
          <div class="name">{{ item.reward_name }}</div>
          <div class="diamond">
            <img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt="">
            {{ item.reward_diamond_worth }}
          </div>
        </div>
        <div class="head">{{ $t('event_gifts') }}</div>
      </div>

      <!-- tab -->
      <div class="tabs" ref="tabTop">
        <div class="tab" :class="{ 'yes': tabType === item.type }" v-for="(item, index) in tabs" :key="index" @click="cutTabs(item.type)">{{ item.name }}</div>
      </div>

      <keep-alive>
        <router-view ref="game" :tabStatus="tabStatus" @homeDataFun="getHomeFun"></router-view>
      </keep-alive>
    </div>
    <pageLoading v-show="loading"/>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {getLanguage, getSafeHeight} from "@/lib/device";
import pageLoading from '@/components/common/page_loading.vue';
import { burialPointFun } from "../../lib/utils";

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

// 头图国际化
const headImg = ref({
  "ar": 'https://yaame-static.yaame.io/admin/f070029e1cb5fb21407b43d85ad526ca.png',
  "en": 'https://yaame-static.yaame.io/admin/be85510c847d4bdf99e8bf033fe1fc30.png',
  "id": 'https://yaame-static.yaame.io/admin/6b2a51a8b9ee07225b8d519d72fb1dc3.png',
  "zh-cn": 'https://yaame-static.yaame.io/admin/34f158c5261d1e589f62c479f247c7e7.png',
  "zh-tw": 'https://yaame-static.yaame.io/admin/49118c029c8381459ad181288dedfef3.png',
})

// tab
const tabType = ref('one');
const tabs = ref([
  {
    name: t('halloween_map'),
    type: 'one'
  },
  {
    name: t('candy_leaderboard'),
    type: 'two'
  }
]);
// 切换tab
const cutTabs = (type) => {
  if (tabType.value === type) return;
  tabType.value = type;
  if (type === 'one') {
    root.proxy.$router.replace('game');
  } else {
    root.proxy.$router.replace('ranking');
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

// 排行榜页面吸顶状态控制
const tabStatus = ref(0);
// tab吸顶
let tabTop = ref();
let safe_area = getSafeHeight() || 0;
// 页面卷去高度
const bodyTop = () => {
  if (!tabTop.value) return;
  // 获取动态的字体大小
  const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  // 算出屏幕到达的固定位置
  const targetPixeValue = document.documentElement.scrollTop / htmlSize;
  // (12.43 - (safe_area * 2) / 100) - 1.14  距离顶部距离-手机安全高度-设计稿要求距离+内容固定的0.88
  if (targetPixeValue >= (15.35 - (safe_area * 2) / 100) - 1.08) {
    tabStatus.value = 1;
    // 设置吸顶位置
    tabTop.value.style.position = 'fixed';
    let safe_height = (safe_area * 2) / 100;
    tabTop.value.style.top = (1.08 + safe_height) + 'rem';
  } else if (targetPixeValue < (15.35 - (safe_area * 2) / 100) - 1.08) {
    tabStatus.value = 0;
    tabTop.value.style.position = 'absolute';
    tabTop.value.style.top = '15.35rem';
  }
};

// 点击party页面tab上报
const openParty = () => {
  // 埋点
  burialPointFun({
    event_name: "event_page_view",
    cid: -1000,
    md: 2,
    args_name: "",
    args: {
      type: 'Halloween_party_click',
      page_name: 'Halloween_event'
    },
  });
  // 跳转
  root.proxy.$router.push('/party');
}

// 添加loading
let loading = ref(true);

// 首页数据
const awardList = ref([]);
const getHomeFun = (data) => {
  timeEnd.value = data.activity_end_time;
  awardList.value = data.gifts;
  // 启动定时器
  openTiming();
}
// 子组件dom
const game = ref(null);
onMounted(() => {
  // 监听页面滚动事件
  window.addEventListener('scroll', bodyTop);
  window.onload = () => {
    loading.value = false;
    // 加载剩余资源
    game.value.listLoadImg();
  }
  // 页面浏览埋点
  burialPointFun({
    event_name: "event_page_view",
    cid: -1000,
    md: 1,
    args_name: "",
    args: {
      from: '',
      page_name: 'Halloween_event'
    },
  });
});
</script>

<style lang="less" scoped>
.main {
  min-height: 100vh;
  position: relative;
  background-repeat: no-repeat;
  background-size: contain;
  overflow: hidden;

  .rule {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 2.12rem;
    width: 1.65rem;
    height: .6rem;
    padding: 0 .21rem;
    background: url("https://yaame-static.yaame.io/admin/25e34312ffe5f1e6c10009b1be6e241f.png") no-repeat;
    background-size: contain;
    font-weight: 400;
    font-size: .22rem;
    color: #FFFFFF;
    line-height: .24rem;
    text-align: center;
  }

  .party {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 3.16rem;
    width: 1.9rem;
    height: .63rem;
    padding: 0 .21rem 0 .6rem;
    background: url("https://yaame-static.yaame.io/admin/d848bbd3112d14964a7198db5aa2d435.png") no-repeat;
    background-size: contain;
    font-weight: 400;
    font-size: .22rem;
    color: #923000;
    line-height: .24rem;
    text-align: center;
  }

  .time {
    position: absolute;
    top: 7.73rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    width: 4.42rem;
    .times {
      display: flex;
      justify-content: center;
      align-items: center;
      width: .7rem;
      height: .67rem;
      font-size: .26rem;
      color: #D9B2FF;
    }
  }
  .gifts {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    width: 7.08rem;
    height: 6.56rem;
    margin: 8.51rem auto 1.57rem;
    padding: 1.37rem .29rem 0 .27rem;
    background: url("https://yaame-static.yaame.io/admin/1872d2ae2cabf80931648d9026d2307b.png") no-repeat;
    background-size: contain;
    .head {
      position: absolute;
      top: .58rem;
      left: 50%;
      transform: translateX(-50%);
      height: .30rem;
      font-weight: 600;
      font-size: .30rem;
      color: #A84F00;
      line-height: .3rem;
    }
    .gift-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 1.54rem;
      font-weight: 600;
      font-size: .22rem;
      color: #FFFFFF;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.54rem;
        height: 1.55rem;
        background: url("https://yaame-static.yaame.io/admin/75eeb62e7f40ea0224d5d7b54a1c56ef.png") no-repeat;
        background-size: contain;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
      .name {
        width: 100%;
        margin: .05rem auto;
        text-align: center;
        line-height: .24rem;
      }
      .diamond {
        display: flex;
        align-items: center;
        img {
          width: .22rem;
          height: .2rem;
        }
      }
    }
    .gift-list:nth-child(n+5) {
      margin-top: .09rem;
    }
  }
  .tabs {
    position: absolute;
    top: 15.35rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    width: 6.6rem;
    height: 1.01rem;
    z-index: 3;
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3.1rem;
      height: 1.01rem;
      line-height: .26rem;
      padding: 0 .71rem 0 .74rem;
      font-weight: 600;
      font-size: .24rem;
      color: #311C57;
      background-image: url(https://yaame-static.yaame.io/admin/03cc8c8642c8a16529264847264ac671.png);
      background-repeat: no-repeat;
      background-size: contain;
      text-align: center;
      transition-duration: .2s;
    }
    .yes {
      color: #FFF017;
      background-image: url(https://yaame-static.yaame.io/admin/54fac38f07d0816bb684ca2faec2b851.png);
    }
  }
}
</style>