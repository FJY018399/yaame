<template>
  <div class="award" :style="{ backgroundImage: `url(${logoImg[language]})` }">
    <!-- 标题 -->
    <custom-header color="white">{{ $t('hall_of_fame') }}</custom-header>
    <!-- 榜单 -->
    <div class="last-week" v-for="(item, index) in topCycleList" :key="index">
      <div class="head">{{ new Date(item.activity_start).getUTCMonth() + 1 }}.{{ new Date(item.activity_start).getUTCDate() }} - {{ new Date(item.activity_end).getUTCMonth() + 1 }}.{{ new Date(item.activity_end - 60000).getUTCDate() }}</div>
      <div class="top-img">
        <div class="user" v-for="(value, key) in item.top_users" :key="key">
          <div class="header">
            <div class="bg" @click="toDetails(value.user_info)"></div>
            <div v-if="value.user_info && value.user_info.user_status" class="status" :class="[ value.user_info.user_status === 1 ? 'online' : 'living' ]">{{ value.user_info.user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
            <img v-if="value.user_info" :src="value.user_info && value.user_info.avatar" alt="">
            <img v-else src="https://yaame-static.yaame.io/admin/8ef96ab664062cd6b9268c0b428e81e1.png" alt="">
          </div>
          <div v-if="value.user_info" class="name no-wrap">{{ value.user_info.nick_name }}</div>
          <div v-else class="name">{{ $t('position_available') }}</div>
          <div v-if="value.user_info" class="score no-wrap"><img src="https://yaame-static.yaame.io/admin/70153574ab60b855ee596c61bd1a0518.png" alt="">{{ value.user_info.score }}</div>
        </div>
      </div>
      <div class="bottom">
        <div class="gift" v-for="(ite, number) in item.top_users" :key="number">
          <div class="point-to"></div>
          <div class="icon">
            <img v-if="ite.gift_info" :src="ite.gift_info.reward_icon" alt="">
            <img v-else src="https://yaame-static.yaame.io/admin/325037c10e15b092103550bc6a5eeacd.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {getWeekStarRankApi} from "@/pages/weekGift/api";
import {Toast} from "vant";
import {getLanguage} from "@/lib/device";

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

// 头部国际化
const logoImg = ref({
  "ar": 'https://yaame-static.yaame.io/admin/faadbf5d8accc3c962fd4b1cbd2f6df5.png',
  "en": 'https://yaame-static.yaame.io/admin/22e44c2318489ce28890820f6a63954e.png',
  "id": 'https://yaame-static.yaame.io/admin/574bea2b9b6fc3f715047c622c4c483d.png',
  "zh-cn": 'https://yaame-static.yaame.io/admin/0ec5e5f425d411bdbefd4d0f1890f89f.png',
  "zh-tw": 'https://yaame-static.yaame.io/admin/0ec5e5f425d411bdbefd4d0f1890f89f.png',
})

// 存储名人堂数据
const topCycleList = ref([]);
const getHomeData = async () => {
  try {
    const res = await getWeekStarRankApi({});
    if (res.status !== 1000) return;
    topCycleList.value = res.data.top_cycle;
    // 过滤未上榜历史信息
    setListStructure();
  } catch (err) {
    console.log(err);
  }
}
// 处理列表数据
const setListStructure = () => {
  for (let i = topCycleList.value.length - 1; i >= 0; i--) {
    if (!topCycleList.value[i].top_users.length) topCycleList.value.splice(i, 1);
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

onMounted(() => {
  getHomeData()
})
</script>

<style lang="less" scoped>
.award {
  min-height: 100vh;
  padding-top: 6.81rem;
  padding-bottom: .23rem;
  background-repeat: no-repeat;
  background-size: contain;
  .last-week {
    position: relative;
    width: 7.38rem;
    height: 5.59rem;
    margin: .11rem auto 0;
    padding-top: 1.11rem;
    background-image: url(https://yaame-static.yaame.io/admin/4225968c222a4836e1463f0b23d98219.png);
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
      margin-top: .18rem;
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
}
</style>