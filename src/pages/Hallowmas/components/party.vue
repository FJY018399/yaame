<template>
	<div class="party" :style="{ backgroundImage: `url(${headImg[language]})` }">
    <custom-header color="white">{{ $t('halloween_party_title') }}</custom-header>

    <!-- 规则 -->
    <div class="rule" @click="$router.push('/rule')">{{ $t('rules_rewards') }}</div>

    <!-- 预约房间 -->
    <div class="room">
      <div class="head">{{ $t('party_schedule') }}</div>
      <div class="list" v-for="(item, index) in homeList" :key="index">
        <div class="icon" @click="toDetails(item.scheme_user_url)">
          <img :src="item.cover_img" alt="">
          <div v-if="item.live_status" class="status">{{ $t('start_broadcast') }}</div>
        </div>
        <ul class="content">
          <li>{{ item.room_name }}</li>
          <li>{{ $t('party_content') }}:{{ item.room_desc }}</li>
          <li>
            <span class="frame"></span>
            <span>
              <img src="https://yaame-static.yaame.io/admin/e8bdadfe2c03310f65ea579c16d39021.png" alt="">
              {{ getTime(item.start_time, item.end_time) }}(UTC+0)
            </span>
          </li>
        </ul>
        <div class="button" :class="{ 'yes': item.follow }" @click="follow(item)">{{ item.follow ? $t('reserved') : $t('reserve') }}</div>
      </div>
    </div>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import {computed, getCurrentInstance, onActivated, ref} from "vue";
import {getPartyApi, postPartyFollowApi} from "@/pages/Hallowmas/api";
import {Toast} from "vant";
import {getLanguage} from "@/lib/device";

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
  "ar": 'https://yaame-static.yaame.io/admin/b84f444e17b98a4cffa8429e6642f121.png',
  "en": 'https://yaame-static.yaame.io/admin/cb5b493f6507645771f34a0b0e5668e3.png',
  "id": 'https://yaame-static.yaame.io/admin/0ff11f30d5ebf05bbc67f0557d86a171.png',
  "zh-cn": 'https://yaame-static.yaame.io/admin/08b133c9f4de9c587b98e8f0c90df223.png',
  "zh-tw": 'https://yaame-static.yaame.io/admin/e20a8a97b2972f66772c9f381608d14e.png',
})


// 页面列表
const homeList = ref([]);
// 获取当前页面数据
const getHome = async () => {
  try {
    const res = await getPartyApi();
    if (res.status !== 1000) return;
    homeList.value = res.data.party_room;
  } catch (err) {
    console.log(err);
  }
}

// 页面时间展示
const getTime = (start_time, end_time) => {
  const start = timeCount(start_time);
  const end = timeCount(end_time);
  return `${new Date(start_time).getUTCMonth() + 1 }/${new Date(start_time).getUTCDate() }  ${start.hours}:${start.minutes}-${end.hours}:${end.minutes}`
}

// 计算当前时分秒
const timeCount = (number) => {
  let hours = Math.floor((number % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  hours = hours < 10 ? '0' + hours : hours;
  let minutes = Math.floor((number % (1000 * 60 * 60)) / (1000 * 60));
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let seconds = Math.floor((number % (1000 * 60)) / 1000);
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return { hours, minutes, seconds }
}

// 预约房间
const follow = async (item) => {
  try {
    if(item.follow) return;
    const res = await postPartyFollowApi({
      id: item.id
    });
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('reservation_successful'));
    await getHome();
  } catch (err) {
    console.log(err);
  }
}

// 跳转
const toDetails = (url) => {
  window.location.href = url;
}

onActivated(() => {
  getHome();
})
</script>

<style lang="less" scoped>
.party {
  min-height: 100vh;
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

  .room {
    position: relative;
    width: 7rem;
    margin: 7.25rem auto 0;
    padding: .71rem .2rem .2rem;
    background: #58048E;
    border-radius: .08rem;
    border: .08rem solid #9964FF;
    .head {
      display: flex;
      justify-content: center;
      position: absolute;
      top: -1.3rem;
      left: 50%;
      transform: translateX(-50%);
      width: 7.36rem;
      height: 1.87rem;
      padding-top: .7rem;
      background: url("https://yaame-static.yaame.io/admin/4fd731d571195ba91ad2c79688fc3248.png") no-repeat;
      background-size: contain;
      font-weight: normal;
      font-size: .3rem;
      color: #FFE220;
    }

    .list {
      position: relative;
      display: flex;
      align-items: center;
      width: 6.6rem;
      height: 1.76rem;
      margin-bottom: .18rem;
      background: url("https://yaame-static.yaame.io/admin/f3c03a4b758202b0cb1ec361054ea879.png") no-repeat;
      background-size: contain;
      .icon {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.1rem;
        height: 1.1rem;
        margin: 0 .28rem 0 .72rem;
        background: url("https://yaame-static.yaame.io/admin/71de2fb95d5fcd4ebf585dc7e9293bec.png") no-repeat;
        background-size: contain;
        .status,
        .on-line {
          display: flex;
          justify-content: center;
          align-items: baseline;
          position: absolute;
          bottom: -0.01rem;
          left: 50%;
          transform: translateX(-50%);
          width: .66rem;
          height: .24rem;
          background: #D553FF;
          border-radius: .08rem;
          font-weight: 400;
          font-size: .18rem;
          color: #FFFFFF;
          z-index: 2;
        }

        .on-line {
          background: #6C53FF;
        }
        .attention {
          position: absolute;
          top: .84rem;
          left: 50%;
          transform: translateX(-50%);
          width: .54rem;
          height: .4rem;
        }
        img {
          width: .95rem;
          height: .95rem;
          border-radius: .15rem;
        }
      }
      .content {
        width: 2.62rem;
        display: flex;
        flex-direction: column;
        li:nth-child(1) {
          font-weight: 500;
          font-size: .24rem;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:nth-child(2) {
          width: 100%;
          height: .22rem;
          margin: .09rem 0 .1rem;
          font-weight: 500;
          font-size: .2rem;
          color: #FFFFFF;
          line-height: .22rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:nth-child(3) {
          position: relative;
          width: 2.55rem;
          height: .28rem;
          .frame {
            position: absolute;
            width: 100%;
            height: .28rem;
            background: #5C05B6;
            border-radius: .04rem;
            opacity: 0.7;
          }
          span:nth-child(2) {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-weight: 400;
            font-size: .18rem;
            color: #FFFFFF;
            white-space: nowrap;
            z-index: 1;
            img {
              width: .2rem;
              height: .21rem;
              margin-right: .04rem;
            }
          }
        }
      }
      .button {
        position: absolute;
        right: .32rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: .63rem;
        padding: 0 .1rem .1rem;
        background-image: url("https://yaame-static.yaame.io/admin/a343e39ae4dc446ba7d1b40783783e16.png");
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 400;
        font-size: .22rem;
        color: #FFFFFF;
        line-height: .22rem;
        text-align: center;
      }
      .yes {
        background-image: url(https://yaame-static.yaame.io/admin/af52f7f800b9987b0f9a4acab150dc25.png);
        color: #542B35;
      }
    }
  }
}
</style>