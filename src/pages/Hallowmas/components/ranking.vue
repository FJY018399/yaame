<template>
	<div class="ranking">
    <!-- 吸顶遮罩 -->
    <div v-show="topStatus" :style="{ top: ((safe_area * 2) / 100) + 0.88 +'rem' }" class="top-cover"></div>
    <!-- tab -->
    <div class="tabs" ref="tab">
      <div class="move" :style="{ left: tabsType === 'RECEIVE_GIFT' ? '0.02rem' : '2.5rem' }"></div>
      <div class="tab" v-for="(item, index) in tabs" :key="index" @click="tabsCut(item.type)">{{ item.name }}</div>
    </div>
    <!-- 排名 -->
    <div class="rank">
      <div class="rank-list" v-for="(item, index) in rankList" :key="index">
        <div v-if="index < 3" class="rank-back"></div>
        <div v-else class="rank-back">{{ index + 1 }}</div>
        <div class="head-back" @click="item.uid && toDetails(item)">
          <div class="frame"></div>
          <div class="status"  v-if="item.user_status" :class="{ 'on-line': item.user_status === 1 }">{{ item.user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
          <img v-if="item.avatar" :src="item.avatar" alt="">
          <div v-else class="lack"></div>
        </div>
        <div class="name-back">
          <div class="name">
            <span class="no-wrap">{{ item.nick_name }}</span>
            <img v-if="tabsType === 'RECEIVE_GIFT' && item.popular_level" :src="item.popular_level" alt="">
            <img v-else-if="item.wealth_level" :src="item.wealth_level" alt="">
          </div>
          <div v-if="item.score" class="id">
            <img src="https://yaame-static.yaame.io/admin/b71195d8b8bb5bcc8ccd47041e0af1c1.png" alt="">
            {{ item.score }}
          </div>
        </div>
        <div v-if="item.uid && userList.uid !== item.uid" class="attention" :class="{ 'chat': item.relation.attention }" @click="attentions(item)"></div>
      </div>
      <div class="head"></div>
    </div>

    <!-- 我的排名 -->
    <div class="my-rank">
      <div class="rank-back">{{userList.rank <= 99 ? userList.rank : '99+' }}</div>
      <div class="head-back" @click="toDetails(userList)">
        <div class="frame"></div>
        <img :src="userList.avatar" alt="">
      </div>
      <div class="name-back">
        <div class="name">
          <span class="no-wrap">{{ userList.nick_name }}</span>
          <img v-if="tabsType === 'RECEIVE_GIFT' && userList.popular_level" :src="userList.popular_level" alt="">
          <img v-else-if="userList.wealth_level" :src="userList.wealth_level" alt="">
        </div>
        <div class="id">
          <img src="https://yaame-static.yaame.io/admin/b71195d8b8bb5bcc8ccd47041e0af1c1.png" alt="">
          {{ userList.score }}
        </div>
      </div>
      <div v-if="(userList.rank + 1) <= 99 && typeof userList.delta_score === 'number'" class="difference-value">{{ $t('distance_to_next') }}<span><img src="https://yaame-static.yaame.io/admin/b71195d8b8bb5bcc8ccd47041e0af1c1.png" alt="">{{ userList.delta_score }}</span></div>
    </div>
	</div>
</template>

<script setup>
import {getCurrentInstance, onActivated, onMounted, ref, watch} from "vue";
import {getSafeHeight} from "@/lib/device";
import {getRankHomeApi, postAttentionsApi} from "@/pages/Hallowmas/api";
import {Toast} from "vant";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

// 获取吸顶状态
const props = defineProps({
  tabStatus: {
    type: Number,
    default: 0
  }
});

// 默认tab
const tabsType = ref("RECEIVE_GIFT");
// tab
const tabs = ref([
  {
    name: t('receive_leaderboard'),
    type: 'RECEIVE_GIFT'
  },
  {
    name: t('send_leaderboard'),
    type: 'GIVE_GIFT'
  }
]);
const tabsCut = (type) => {
  tabsType.value = type;
  rankFun();
}

// 吸顶状态
const topStatus = ref(false);
// tab DOM
const tab = ref(null);
// 获取手机高度
let safe_area = getSafeHeight() || 0;
// 监听吸顶状态
watch(props, (newVal, oldVal) => {
  if (newVal.tabStatus) {
    topStatus.value = true;
    tab.value.style.position = 'fixed';
    let safe_height = (safe_area * 2) / 100;
    tab.value.style.top = (2.57 + safe_height) + 'rem';
  } else {
    topStatus.value = false;
    tab.value.style.position = 'absolute';
    tab.value.style.top = '.2rem';
  }
})

// 排名
const rankList = ref([]);
// 用户信息
const userList = ref({});
// 排名接口调用
const rankFun = async () => {
  try {
    const res = await getRankHomeApi({
      halloweenRankType: tabsType.value
    });
    if (res.status !== 1000) return;
    userList.value = res.data.my_rank_info;
    rankList.value = res.data.rank;
    // 判断当前是否有三名
    if (rankList.value.length < 3) {
      // 计算需要添加多少条
      const itemsToAdd = 3 - rankList.value.length;
      rankList.value = [...rankList.value, ...Array(itemsToAdd).fill([])];
    }
  } catch (err) {
    console.log(err);
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
    await rankFun();
  } catch (err) {
    console.log(err);
  }
}
// 跳转
const toDetails = (url) => {
  if (url.mystery === 1) {
    Toast(t('mystery_user'));
    return;
  }
  window.location.href = url.scheme_user_url;
}


onActivated(() => {
  rankFun();
});

// 首次加载判断tab悬浮情况
onMounted(() => {
  if (props.tabStatus === 0) return;
  topStatus.value = true;
  tab.value.style.position = 'fixed';
  let safe_height = (safe_area * 2) / 100;
  tab.value.style.top = (2.57 + safe_height) + 'rem';
})
</script>

<style lang="less" scoped>
.ranking {
  position: relative;
  overflow: hidden;
  .top-cover {
    position: fixed;
    width: 100%;
    height: 2.59rem;
    background: #400875;
    z-index: 2;
  }
  .tabs {
    position: absolute;
    top: .2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    width: 5rem;
    height: .68rem;
    background: #2D0058;
    border-radius: .55rem;
    z-index: 3;
    .move {
      position: absolute;
      top: .02rem;
      width: 2.48rem;
      height: .64rem;
      background: linear-gradient( 360deg, #9833E5 0%, #6713CF 100%);
      border-radius: .45rem;
      transition-duration: .3s;
    }
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-weight: 400;
      font-size: .20rem;
      color: #FFFFFF;
      z-index: 1;
    }
  }
  .rank {
    position: relative;
    width: 7rem;
    margin: 2.6rem auto 0;
    padding-top: .59rem;
    padding-bottom: 1.9rem;
    background: #58048E;
    border-radius: .2rem;
    border: .08rem solid #9964FF;
    .rank-list {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 6.6rem;
      height: 1.76rem;
      margin: 0 auto .18rem;
      background-repeat: no-repeat;
      background-size: contain;
      .head-back {
        position: relative;
        width: 1.98rem;
        height: 1.31rem;
        .frame {
          position: absolute;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: contain;
          z-index: 1;
        }
        .status,
        .on-line {
          display: flex;
          justify-content: center;
          align-items: center;
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

        img,
        .lack {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 50%;
        }
        .lack {
          width: 1.1rem;
          height: 1.1rem;
          background: #AE5454;
          border-radius: 50%;
        }
      }
      .name-back {
        .name {
          display: flex;
          align-items: center;
          width: 2.52rem;
          height: .24rem;
          font-weight: 500;
          font-size: .24rem;
          color: #FFFFFF;
          img {
            width: .56rem;
            height: .22rem;
            margin-left: .03rem;
          }
        }
        .id {
          display: flex;
          align-items: center;
          height: .3rem;
          margin-top: .18rem;
          font-weight: 500;
          font-size: .22rem;
          color: #FFFFFF;
          img {
            width: .41rem;
            height: .22rem;
            margin-right: .04rem;
          }
        }
      }

      .attention,
      .chat {
        position: absolute;
        right: .66rem;
        width: .42rem;
        height: .42rem;
        background-image: url(https://yaame-static.yaame.io/admin/212746b2ff58b31228f7ff9cf1293c18.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
      .chat {
        height: .36rem;
        background-image: url(https://yaame-static.yaame.io/admin/84469f1725ada768890ea83a87fa2bdd.png);
      }
    }
    .rank-list:nth-child(1) {
      background-image: url(https://yaame-static.yaame.io/admin/cc8ca84e9536c3ee0b0500b0d7bcb800.png);
      .rank-back {
        width: .49rem;
        height: .52rem;
        margin-left: .16rem;
        background: url("https://yaame-static.yaame.io/admin/3006d82a0637c5e9308ce30ec22c0d71.png") no-repeat;
        background-size: contain;
      }
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/dfaf54e62804028ac279b25f3862b00f.png);
      }
    }
    .rank-list:nth-child(2) {
      background-image: url(https://yaame-static.yaame.io/admin/f99c99c52114ba6ce43184bc3b6a686a.png);
      .rank-back {
        width: .49rem;
        height: .52rem;
        margin-left: .16rem;
        background: url("https://yaame-static.yaame.io/admin/c33ae6989a42e235a60f1ebc679b5e8b.png") no-repeat;
        background-size: contain;
      }
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/adb676e84d5c4e2b30f7f6d85abf635d.png);
      }
    }
    .rank-list:nth-child(3) {
      background-image: url(https://yaame-static.yaame.io/admin/58066dbe8a8d0e9a401427426f440b62.png);
      .rank-back {
        width: .49rem;
        height: .52rem;
        margin-left: .16rem;
        background: url("https://yaame-static.yaame.io/admin/400787c9c270bccdfe5fc1a4fdd57b45.png") no-repeat;
        background-size: contain;
      }
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/b99d7f06a12da470a87a75db907b4009.png);
      }
    }
    .rank-list:nth-child(n+4) {
      background-image: url(https://yaame-static.yaame.io/admin/f3c03a4b758202b0cb1ec361054ea879.png);
      .rank-back {
        width: .15rem;
        height: .33rem;
        margin: 0 .48rem 0 .35rem;
        font-weight: 500;
        font-size: .24rem;
        color: #FFFFFF;
        line-height: .33rem;
        text-align: center;
      }
      .head-back {
        width: 1.31rem;
        height: 1.31rem;
        margin-right: .3rem;
        .frame {
          background-image: url(https://yaame-static.yaame.io/admin/e2aa92310485123bbc31b70d21158722.png);
        }
      }
    }
    .head {
      position: absolute;
      top: -1.3rem;
      left: 50%;
      transform: translateX(-50%);
      width: 7.36rem;
      height: 1.87rem;
      background: url("https://yaame-static.yaame.io/admin/a5e81669e9f83885668d55e725819cb6.png") no-repeat;
      background-size: contain;
    }
  }
  .my-rank {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.74rem;
    background: url("https://yaame-static.yaame.io/admin/48d234ac9f3562395f4da3d89ea32f10.png") no-repeat;
    background-size: contain;
    z-index: 3;
    .rank-back {
      width: .47rem;
      height: .37rem;
      margin: 0 .38rem 0 .44rem;
      font-weight: 500;
      font-size: .26rem;
      color: #FFFFFF;
    }
    .head-back {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 1.31rem;
      height: 1.31rem;
      margin-right: .3rem;
      .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("https://yaame-static.yaame.io/admin/e2aa92310485123bbc31b70d21158722.png") no-repeat;
        background-size: contain;
      }
      img {
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
      }
    }
    .name-back {
      .name {
        display: flex;
        align-items: center;
        width: 2.52rem;
        height: .24rem;
        font-weight: 500;
        font-size: .24rem;
        color: #FFFFFF;
        img {
          width: .56rem;
          height: .22rem;
          margin-left: .03rem;
        }
      }
      .id {
        display: flex;
        align-items: center;
        height: .3rem;
        margin-top: .18rem;
        font-weight: 500;
        font-size: .22rem;
        color: #FFFFFF;
        img {
          width: .41rem;
          height: .22rem;
          margin-right: .04rem;
        }
      }
    }
    .difference-value {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 1rem;
      margin-left: .5rem;
      font-weight: 500;
      font-size: .2rem;
      color: #FFFFFF;
      img {
        width: .41rem;
        height: .22rem;
      }
    }
  }
}
</style>