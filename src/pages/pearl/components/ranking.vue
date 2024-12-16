<template>
	<div class="ranking">
    <!--说明-->
    <div class="txt">{{ $t('enter_ranking') }}</div>

    <!--tab-->
    <div class="tab">
      <div class="opt-for" :style="{ left: tabStyle === 'RECEIVE_GIFT' ? '0.02rem' : '2.5rem' }"></div>
      <div class="tabs" :class="{ 'tab-in': tabStyle === item.type }" v-for="(item, index) in Tab" :key="index" @click="cutTab(item.type)">{{ item.name }}</div>
    </div>

    <!--二级tab-->
    <div class="secondary-tab">
      <div class="secondary-tabs" :class="{ 'secondary-tab-in': group === item.rank_group_type }" v-for="(item, index) in groupSever" :key="index" @click="cutGroup(item.rank_group_type)">
        {{ `Lv.${item.min_level}${item.max_level>20?'+':'-'+item.max_level}` }}
      </div>
    </div>

    <!--前三-->
    <div class="frame">
      <div class="front" v-for="(item, index) in 3" :key="item">
        <div class="head" @click="toDetails(rankingThree[index])">
          <div v-if="rankingThree[index] && rankingThree[index].user_status" class="status" :class="{ 'on-line': rankingThree[index].user_status === 1 }">
            {{ rankingThree[index].user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
          <img v-if="rankingThree[index] && rankingThree[index].avatar" :src="rankingThree[index].avatar" alt="">
          <img v-else src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png" alt="">
        </div>
        <div class="name no-wrap" v-if="rankingThree[index]">
          <span class="no-wrap">{{ rankingThree[index].nick_name }}</span>
          <img v-if="rankingThree[index].level_icon" :src="rankingThree[index].level_icon" alt="">
        </div>
        <div v-if="rankingThree[index]" class="number">
          <img src="https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png" alt="">
          {{ rankingThree[index].score }}
        </div>
        <div v-if="rankingThree[index] && userList.uid !== rankingThree[index].uid" class="attention" :class="{ 'chat': rankingThree[index].relation.attention }" @click="attentions(rankingThree[index])"></div>
      </div>
    </div>

    <!--剩余排行-->
    <div class="rank-last" v-for="(item, index) in rankingLast" :key="index">
      <div class="rank-back">{{ item.rank + 1 }}</div>
      <div class="head-back" @click="toDetails(item)">
        <div class="status"  v-if="item.user_status" :class="{ 'on-line': item.user_status === 1 }">{{ item.user_status === 1 ? $t('online') : $t('start_broadcast') }}</div>
        <img :src="item.avatar" alt="">
      </div>
      <div class="name-back">
        <div class="name">
          <span class="no-wrap">{{ item.nick_name }}</span>
          <img v-if="item.level_icon" :src="item.level_icon" alt="">
        </div>
        <div class="id">
          <img src="https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png" alt="">
          {{ item.score }}
        </div>
      </div>
      <div v-if="userList.uid !== item.uid" class="attention" :class="{ 'chat': item.relation.attention }" @click="attentions(item)"></div>
    </div>

    <!--缺省图-->
    <div v-if="!rankingThree[1]" class="lack">
      <p>{{ $t('noRank') }}</p>
    </div>

    <!--用户排名-->
    <div class="my-list">
      <div class="rank-back">{{
          (userList.rank + 1) && (userList.rank + 1) <= 99 ? userList.rank + 1 : '99+'
        }}</div>
      <div class="head-back" @click="toDetails(userList)">
        <img :src="userList.avatar" alt="">
      </div>
      <div class="name-back">
        <div class="name">
          <span class="no-wrap">{{ userList.nick_name }}</span>
          <img v-if="userList.level_icon" :src="userList.level_icon" alt="">
        </div>
        <div class="id">
          <span v-for="(item, index) in userList.pearl_collector_gifts" :key="index">
            <img :src="item.reward_icon" alt="">{{ item.amount }}
          </span>
        </div>
      </div>
      <div class="number">
        <img src="https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png" alt="">
        {{ userList.score }}
      </div>
    </div>
	</div>
</template>

<script setup>
import {getCurrentInstance, onActivated, ref} from "vue";
import {Toast} from "vant";
import {getPearlCollectorRankApi, postAttentionsApi} from "@/pages/pearl/api";
import {burialPointFun} from "@/lib/utils";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

// 记录当前查看是否组别tab
const control = ref(true);
// tab
const Tab = ref([
  {
    name: t('collection_ranking'),
    type: 'RECEIVE_GIFT'
  },
  {
    name: t('making_ranking'),
    type: 'SEND_GIFT'
  },
]);
let tabStyle = ref('RECEIVE_GIFT');
const cutTab = (value) => {
  tabStyle.value = value;
  control.value = true;
  homeData(value);
};

// 组别tab
let group = ref();
const groupSever = ref([]);
const cutGroup = (value) => {
  group.value = value;
  control.value = false;
  homeData(tabStyle.value, value);
}

// 跳转
const toDetails = (url) => {
  if (url.mystery === 1) {
    Toast(t('mystery_user'));
    return;
  }
  window.location.href = url.scheme_user_url;
}

// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);

const homeData = async (rankType, rankGroupType) => {
  try {
    let res = null;
    if (rankGroupType) {
      res = await getPearlCollectorRankApi({
        rankType,
        rankGroupType
      });
    } else  {
      res = await getPearlCollectorRankApi({
        rankType,
      });
    }
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    // 当前判断是否刷新二级tab高亮
    if (control.value) group.value = res.data.region_rank_groups[0].rank_group_type;
    // 下面记录当前页面数据
    groupSever.value = res.data.region_rank_groups;
    userList.value = res.data.my_rank_info;
    processRanking(res.data.rank);
  } catch (err) {
    console.log(err);
  }
}

// 处理排名数据
const processRanking = (data) => {
  if (!data) return;
  rankingThree.value = data.splice(0, 3);
  rankingLast.value = data;
  swapElements(rankingThree.value, 0, 1);
};
// 交换数组内容
const swapElements = (arr, index1, index2) => {
  let temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
};

// 关注
const attentions = async (value) => {
  try {
    if (value.mystery) { // 神秘人
      Toast(t('mystery_user'));
      return;
    }
    if (value.relation.attention) { // 已关注跳转私聊页面
      // 埋点私聊点击
      burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 2,
        args_name: "page_btn_click",
        args: {
          type: 'chat_btn',
        },
      });
      window.location.href = value.scheme_url;
      return;
    }
    // 埋点关注点击
    burialPointFun({
      event_name: "page_btn_click",
      cid: -1000,
      md: 2,
      args_name: "page_btn_click",
      args: {
        type: 'follow_btn',
      },
    });
    const res = await postAttentionsApi({
      target_uid: value.uid
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('followed'));
    // 刷新当前组别信息
    await homeData(tabStyle.value, group.value);
  } catch (err) {
    console.log(err);
  }
}

onActivated(async () => {
  await homeData('RECEIVE_GIFT');
})
</script>

<style lang="less" scoped>
.ranking {
  width: 7.2rem;
  min-height: 17.91rem;
  margin: .43rem auto 0;
  padding-bottom: 1.64rem;
  background: #265CC4;
  border-radius: .2rem .2rem 0 0;
  border: .02rem solid #7DD4FF;
  border-bottom: 0;
  overflow: hidden;

  .txt {
    width: 6.55rem;
    height: .63rem;
    margin: .35rem auto .36rem;
    font-size: .24rem;
    color: #FFFFFF;
    line-height: .28rem;
    text-align: center;
  }

  //tab样式
  .tab {
    position: relative;
    display: flex;
    width: 5rem;
    height: .68rem;
    margin: 0 auto .26rem;
    background: #083DA5;
    border-radius: .55rem;
    justify-content: space-around;
    align-items: center;
    font-size: .28rem;
    color: #6270E7;

    .tabs {
      position: relative;
      flex: 1;
      z-index: 1;
      text-align: center;
      line-height: .26rem;
    }

    .opt-for {
      position: absolute;
      top: .02rem;
      width: 2.48rem;
      height: .64rem;
      background: linear-gradient(#1CC4D2 0%, #3354E5 99%);
      border-radius: .45rem;
      transition-duration: .3s;
    }

    &-in {
      color: #FCFFB0;
    }
  }

  // 组别tab
  .secondary-tab {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: .71rem;

    .secondary-tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.8rem;
      height: .71rem;
      font-weight: 600;
      font-size: .22rem;
      color: #FFFFFF;
      background-image: url("https://yaame-static.yaame.io/admin/9eec9b916942d373e094964939259962.png");
      background-repeat: no-repeat;
      background-size: contain;
      transition-duration: .3s;
    }
    
    &-in{
      background-image: url("https://yaame-static.yaame.io/admin/3362c67531be7ae995f160b69383d69f.png") !important;
    }
  }

  // 前三样式
  .frame {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 6.6rem;
    height: 4rem;
    margin: 0 auto .28rem;

    .front {
      width: 2.06rem;
      height: 3.73rem;
      background-repeat: no-repeat;
      background-size: contain;
      overflow: hidden;

      .head {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.46rem;
        height: 1.46rem;
        margin: .82rem auto 0.07rem;
        background-repeat: no-repeat;
        background-size: contain;
        padding-bottom: .06rem;

        .status {
          position: absolute;
          top: 1.13rem;
          left: 50%;
          min-width: .66rem;
          height: .24rem;
          padding: 0 .08rem;
          background: #EEAC19;
          border-radius: .08rem;
          font-size: .18rem;
          color: #FFFFFF;
          line-height: .24rem;
          transform: translateX(-50%);
          text-align: center;
          white-space: nowrap;
        }

        .on-line {
          background: #2694DB;
        }

        img {
          width: 1.06rem;
          height: 1.06rem;
          border-radius: 50%;
        }
      }

      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.79rem;
        height: .28rem;
        margin: auto;
        font-size: .2rem;
        color: #FFFFFF;
        line-height: .28rem;
        img {
          width: .55rem;
          height: .22rem;
          margin-left: .04rem;
        }
      }

      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        height: .22rem;
        margin: .04rem auto .16rem;
        font-size: .20rem;
        color: #FFFFFF;
        img {
          width: .24rem;
          height: .22rem;
        }
      }
      
      .attention {
        width: .42rem;
        height: .42rem;
        margin: auto;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png");
      }
      .chat {
        background-image: url("https://yaame-static.yaame.io/admin/a443f7502d1ffb9057520e0cd05d9e43.png");
      }
    }
    .front:nth-child(2) {
      width: 2.3rem;
      height: 3.99rem;
      background-image: url("https://yaame-static.yaame.io/admin/a11fe4d07e0796d3f3cd7a9e2518ffe2.png");
      .head {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.56rem;
        height: 1.56rem;
        margin: .84rem auto 0.07rem;
        background-image: url("https://yaame-static.yaame.io/admin/2517b9e485b566aaf27b8e0e5d10a8b8.png");

        .status {
          position: absolute;
          top: 1.23rem;
          left: 50%;
          min-width: .66rem;
          height: .24rem;
          padding: 0 .08rem;
          background: #EEAC19;
          border-radius: .08rem;
          font-size: .18rem;
          color: #FFFFFF;
          line-height: .24rem;
          transform: translateX(-50%);
          text-align: center;
        }

        .on-line {
          background: #2694DB;
        }

        img {
          width: 1.16rem;
          height: 1.16rem;
        }
      }
    }
    .front:nth-child(1) {
      background-image: url("https://yaame-static.yaame.io/admin/513e91455753d82107a0a597ff4e54ff.png");
      .head {
        background-image: url("https://yaame-static.yaame.io/admin/63d55c96d27aab962fbffb5b9a01d044.png");
      }
    }
    .front:nth-child(3) {
      background-image: url("https://yaame-static.yaame.io/admin/02cc726187443217c5cb9d1e3b6c60d0.png");
      .head {
        margin-top: .79rem;
        background-image: url("https://yaame-static.yaame.io/admin/d3e8c51bc7d76727bc9e7a0edb3cbb14.png");
      }
    }
  }

  // 剩余排名
  .rank-last {
    display: flex;
    align-items: center;
    width: 6.89rem;
    height: 1.54rem;
    margin: 0 auto .2rem;
    background: url("https://yaame-static.yaame.io/admin/af27d6f87bd3d8b947800048c56893ee.png") no-repeat;
    background-size: contain;
    font-weight: 500;
    font-size: .24rem;
    color: #FFFFFF;

    .rank-back {
      display: flex;
      justify-content: center;
      align-items: center;
      width: .15rem;
      margin: 0 .37rem 0 .48rem;
    }

    .head-back {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: .98rem;
      height: .98rem;
      margin-right: .38rem;
      background: url("https://yaame-static.yaame.io/admin/5d26a540d064777e4a9c6afe484531aa.png") no-repeat;
      background-size: contain;
      img {
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
      }
      .status {
        position: absolute;
        top: .83rem;
        left: 50%;
        min-width: .66rem;
        height: .24rem;
        padding: 0 .08rem;
        background: #EEAC19;
        border-radius: .08rem;
        font-size: .18rem;
        color: #FFFFFF;
        line-height: .24rem;
        transform: translateX(-50%);
        text-align: center;
      }

      .on-line {
        background: #2694DB;
      }
    }

    .name-back {
      position: relative;
      .name {
        display: flex;
        width: 2.52rem;
        height: .24rem;
        margin-bottom: .14rem;
        align-items: baseline;
        img {
          width: .55rem;
          height: .22rem;
          margin-left: .04rem;
        }
      }

      .id {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: .3rem;
        line-height: .3rem;
        font-size: .22rem;
        color: #FFF;
        img {
          width: .26rem;
          height: .24rem;
          margin-right: .06rem;
        }
      }
    }

    .attention {
      width: .42rem;
      height: .42rem;
      margin-left: 1.06rem;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url("https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png");
    }
    .chat {
      background-image: url("https://yaame-static.yaame.io/admin/a443f7502d1ffb9057520e0cd05d9e43.png");
    }
  }

  .lack {
    position: relative;
    width: 1rem;
    height: 1.2rem;
    margin: 1rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/833ee8d9c51caeb6b57db215f1192975.png") no-repeat;
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
      color: #FFFFFF;
      white-space: nowrap;
    }
  }

  // 个人排名样式
  .my-list {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 6.89rem;
    height: 1.64rem;
    transform: translateX(-50%);
    background: url("https://yaame-static.yaame.io/admin/48c91912f30875ee04d02cc274099741.png") no-repeat;
    background-size: contain;
    font-weight: 500;
    font-size: .24rem;
    color: #FFFFFF;
    z-index: 3;

    .rank-back {
      display: flex;
      justify-content: center;
      align-items: center;
      width: .15rem;
      margin: 0 .37rem 0 .48rem;
    }

    .head-back {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: .98rem;
      height: .98rem;
      margin-right: .38rem;
      background: url("https://yaame-static.yaame.io/admin/5d26a540d064777e4a9c6afe484531aa.png") no-repeat;
      background-size: contain;
      img {
        width: .85rem;
        height: .85rem;
        border-radius: 50%;
      }
      .status {
        position: absolute;
        top: .83rem;
        left: 50%;
        min-width: .66rem;
        height: .24rem;
        padding: 0 .08rem;
        background: #EEAC19;
        border-radius: .08rem;
        font-size: .18rem;
        color: #FFFFFF;
        line-height: .24rem;
        transform: translateX(-50%);
        text-align: center;
      }

      .on-line {
        background: #2694DB;
      }
    }

    .name-back {
      position: relative;
      .name {
        display: flex;
        width: 2.52rem;
        height: .24rem;
        margin-bottom: .14rem;
        align-items: center;
        img {
          width: .55rem;
          height: .22rem;
          margin-left: .04rem;
        }
      }

      .id {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        width: 2.9rem;
        height: .6rem;
        span {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: .3rem;
          margin-left: .05rem;
          line-height: .3rem;
          font-size: .22rem;
          color: #FFF;
          img {
            width: .26rem;
            height: .24rem;
            margin-right: .06rem;
          }
        }
      }
    }

    .number {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: .2rem;
      img {
        width: .26rem;
        height: .24rem;
        margin-right: .06rem;
      }
    }
  }
}
</style>