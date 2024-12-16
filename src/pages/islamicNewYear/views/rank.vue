<template>
  <div class="rank-main">
    <!--TAB-->
    <div class="tab">
      <div class="move" :style="{ left: tabAt === 'RECEIVE_GIFT' ? '0' : '2.49rem' }"></div>
      <div class="tab-item" :class="{ win: tabAt === item.type  }" v-for="(item, index) in tabList" :key="index"
           @click="cutTab(item.type)">{{ item.name }}
      </div>
    </div>
    <!--印尼中东送礼-->
    <div v-show="tabAt === 'SEND_GIFT' && region !== 'SOUTHEAST_ASIA' && region !== 'PHILIPPINES'" class="group-list">
      <div class="group" :class="{'cut-group': group === item.type}" v-for="(item, index) in groupListID" :key="index"
           @click="cutGroup(item.type)">{{ item.name }}
      </div>
    </div>
    <!--印尼中东收礼-->
    <div v-show="tabAt === 'RECEIVE_GIFT' && region !== 'SOUTHEAST_ASIA' && region !== 'PHILIPPINES'" class="group-list">
      <div class="group" :class="{'cut-group': group === item.type}" v-for="(item, index) in groupListEast" :key="index"
           @click="cutGroup(item.type)">{{ item.name }}
      </div>
    </div>
    <!--除了印尼中东tab-->
    <div v-show="region === 'SOUTHEAST_ASIA' || region === 'PHILIPPINES'" class="group-list">
      <div class="group" :class="{'cut-group': group === item.type}" v-for="(item, index) in groupListTwo" :key="index"
           @click="cutGroup(item.type)">{{ item.name }}
      </div>
    </div>
    <!--排名-->
    <div class="ranking">
      <!--前三-->
      <div class="front" v-for="(item, index) in 3" :key="index">
        <div class="bg"></div>
        <div v-if="rankingThree[index] && rankingThree[index].avatar" class="click-head"
             @click="toDetails(rankingThree[index])"></div>
        <div class="head">
          <img v-if="rankingThree[index] && rankingThree[index].avatar"
               :src="rankingThree[index] && rankingThree[index].avatar" alt="">
          <img v-else src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png" alt="">
        </div>
        <!--状态-->
        <div v-if="rankingThree[index] && rankingThree[index].user_live_status && (rankingThree[index].user_live_status === 1 || rankingThree[index].user_live_status === 2)" class="status" :class="{ 'living': rankingThree[index].user_live_status === 1 }">
          {{ rankingThree[index] && rankingThree[index].user_live_status === 1 ? $t('start_broadcast') : rankingThree[index].user_live_status === 2 ? $t('online') : '' }}
        </div>
        <!--排名-->
        <div class="top">TOP{{ item }}</div>
        <!--名称-->
        <div class="name">
          <span class="name-one no-wrap">{{ rankingThree[index] && rankingThree[index].nick_name }}</span>
          <div
              class="tags"
              v-if="tabAt === 'RECEIVE_GIFT' && item.ext === 'popular'"
              v-for="(item, index) in (rankingThree[index] && rankingThree[index].img_tags && rankingThree[index].img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <div
              class="vip"
              v-if="tabAt === 'SEND_GIFT' && item.ext === 'wealth'"
              v-for="(item, index) in (rankingThree[index] && rankingThree[index].img_tags && rankingThree[index].img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <!--收礼   wealth 财富-->
<!--          <div v-if="tabAt === 'RECEIVE_GIFT' && rankingThree[index] && rankingThree[index].img_tags && rankingThree[index].img_tags[0].ext === 'wealth'" class="tags"-->
<!--               :style="{ backgroundImage: 'url(' + rankingThree[index].img_tags[1].image_url + ')' }"></div>-->
          <!--送礼  popular 用户等级-->
<!--          <div v-if="tabAt === 'SEND_GIFT' && rankingThree[index] && rankingThree[index].img_tags && rankingThree[index].img_tags[0].ext === 'popular'" class="vip"-->
<!--               :style="{ backgroundImage: 'url(' + rankingThree[index].img_tags[0].image_url + ')' }"></div>-->
        </div>
        <!--神秘人-->
        <div v-if="false" class="id no-wrap">{{ rankingThree[index] && rankingThree[index].score }}</div>
        <div v-else class="id no-wrap">
          <img class="gold" v-show="tabAt === 'RECEIVE_GIFT' && rankingThree[index]" src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt="">
          <img class="diamond" v-show="tabAt === 'SEND_GIFT' && rankingThree[index]" src="https://yaame-static.yaame.io/admin/0eb6f646ec615ebfc3863818665edd7c.png" alt="">
          {{ rankingThree[index] && rankingThree[index].score }}
        </div>
        <div v-show="rankingThree[index] && userList.uid !== rankingThree[index].uid" class="number" :class="{ 'number-one':  rankingThree[index] && rankingThree[index].relation.attention }" @click="attentions(rankingThree[index])"></div>
      </div>
      <div class="rank-last">
        <!--剩余排行-->
        <div v-show="rankingLast && rankingLast.length" class="item-scroll">
          <div class="back" v-for="(item, index) in rankingLast" :key="item.peanut_id">
            <div class="rank-back">{{ item.subject_rank }}</div>
            <div class="head-back" @click="toDetails(item)">
              <div class="head"></div>
              <img :src="item.avatar" alt="">
              <!--状态-->
              <div v-if="item.user_live_status === 1 || item.user_live_status === 2" class="status" :class="{ 'living': item.user_live_status === 1 }">
                {{ item.user_live_status === 1 ? $t('start_broadcast') : item.user_live_status === 2 ? $t('online') : '' }}
              </div>
            </div>
            <div class="name-back">
              <div class="name">
                <span class="name-one no-wrap">{{ item.nick_name }}</span>
                <div
                    class="tags"
                    v-if="tabAt === 'RECEIVE_GIFT' && item.ext === 'popular'"
                    v-for="(item, index) in item.img_tags"
                    :style="{ backgroundImage: `url(${item.image_url})` }"
                ></div>
                <div
                    class="vip"
                    v-if="tabAt === 'SEND_GIFT' && item.ext === 'wealth'"
                    v-for="(item, index) in item.img_tags"
                    :style="{ backgroundImage: `url(${item.image_url})` }"
                ></div>
                <!--收礼-->
<!--                <div v-if="tabAt === 'SEND_GIFT' && item.img_tags && item.img_tags.length" class="tags"-->
<!--                     :style="{ backgroundImage: 'url(' + item.img_tags[0].image_url + ')' }"></div>-->
                <!--送礼-->
<!--                <div v-if="tabAt === 'RECEIVE_GIFT' && item.vip && item.vip" class="vip"-->
<!--                     :style="{ backgroundImage: 'url(' + item.vip.level_badge_icon + ')' }"></div>-->
              </div>
              <div v-if="false" class="id">{{ item.score }}</div>
              <div v-else class="id">
                <img class="gold" v-show="tabAt === 'RECEIVE_GIFT'" src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt="">
                <img class="diamond" v-show="tabAt === 'SEND_GIFT'" src="https://yaame-static.yaame.io/admin/0eb6f646ec615ebfc3863818665edd7c.png" alt="">
                {{ item.score }}
              </div>
            </div>
            <div v-show="userList.uid !== item.uid" class="number-back" :class="{ 'number-one':  item.relation.attention }" @click="attentions(item)"></div>
          </div>
        </div>
        <!--无人上榜样式-->
        <div v-if="rankingThree.length === 0" class="lack">
          <p>{{ $t('noRank') }}</p>
        </div>
      </div>
    </div>

    <!--我的金币排名-->
    <div v-if="userList.uid && tabAt === 'RECEIVE_GIFT'" class="my-rank">
      <div class="rank-back">{{
          userList.subject_rank && userList.subject_rank <= 99 ? userList.subject_rank : '99+'
        }}
      </div>
      <div class="head-back" @click="toDetails(userList)">
        <div class="head"></div>
        <img :src="userList.avatar && userList.avatar" alt="">
      </div>
      <div class="name-back">
        <div class="name">
          <span class="name-one no-wrap">{{  userList.nick_name }}</span>
          <div
              class="tags"
              v-if="tabAt === 'RECEIVE_GIFT' && item.ext === 'popular'"
              v-for="(item, index) in (userList.img_tags && userList.img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <div
              class="vip"
              v-if="tabAt === 'SEND_GIFT' && item.ext === 'wealth'"
              v-for="(item, index) in (userList.img_tags && userList.img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <!--收礼-->
<!--          <div v-if="tabAt === 'SEND_GIFT' && userList.img_tags.length" class="tags"-->
<!--               :style="{ backgroundImage: 'url(' + userList.img_tags[0].image_url + ')' }"></div>-->
<!--          &lt;!&ndash;送礼&ndash;&gt;-->
<!--          <div v-if="tabAt === 'RECEIVE_GIFT' && userList.vip" class="vip"-->
<!--               :style="{ backgroundImage: 'url(' + userList.vip.level_badge_icon + ')' }"></div>-->
        </div>
        <div class="id">
          <img class="gold" v-show="tabAt === 'RECEIVE_GIFT'" src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt="">
          <img class="diamond" v-show="tabAt === 'SEND_GIFT'" src="https://yaame-static.yaame.io/admin/0eb6f646ec615ebfc3863818665edd7c.png" alt="">
          {{ userList.score ? userList.score : 0 }}
        </div>
      </div>
<!--      <div v-show="tabAt === 'RECEIVE_GIFT' && userList.diff_score" class="number-back">-->
<!--        {{ $t('distance_to_gold_leader', { msg: userList.diff_score && userList.diff_score }) }}-->
<!--      </div>-->
<!--      <div v-show="tabAt === 'SEND_GIFT' && userList.diff_score" class="number-back">-->
<!--        {{ $t('distance_to_diamond_leader', { msg: userList.diff_score && userList.diff_score }) }}-->
<!--      </div>-->
    </div>
    <!--我的钻石排名-->
    <div v-if="userList.uid && tabAt === 'SEND_GIFT'" class="my-rank">
      <div class="rank-back">{{
          userList.subject_rank && userList.subject_rank <= 99 ? userList.subject_rank : '99+'
        }}
      </div>
      <div class="head-back" @click="toDetails(userList)">
        <div class="head"></div>
        <img :src="userList.avatar && userList.avatar" alt="">
      </div>
      <div class="name-back">
        <div class="name">
          <span class="name-one no-wrap">{{  userList.nick_name }}</span>
          <div
              class="tags"
              v-if="tabAt === 'RECEIVE_GIFT' && item.ext === 'popular'"
              v-for="(item, index) in (userList.img_tags && userList.img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <div
              class="vip"
              v-if="tabAt === 'SEND_GIFT' && item.ext === 'wealth'"
              v-for="(item, index) in (userList.img_tags && userList.img_tags)"
              :style="{ backgroundImage: `url(${item.image_url})` }"
          ></div>
          <!--收礼-->
<!--          <div v-if="tabAt === 'SEND_GIFT' && userList.img_tags.length" class="tags"-->
<!--               :style="{ backgroundImage: 'url(' + userList.img_tags[0].image_url + ')' }"></div>-->
<!--          &lt;!&ndash;送礼&ndash;&gt;-->
<!--          <div v-if="tabAt === 'RECEIVE_GIFT' && userList.vip" class="vip"-->
<!--               :style="{ backgroundImage: 'url(' + userList.vip.level_badge_icon + ')' }"></div>-->
        </div>
        <div class="id">
          <img class="gold" v-show="tabAt === 'RECEIVE_GIFT'" src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt="">
          <img class="diamond" v-show="tabAt === 'SEND_GIFT'" src="https://yaame-static.yaame.io/admin/0eb6f646ec615ebfc3863818665edd7c.png" alt="">
          {{ userList.score ? userList.score : 0 }}
        </div>
      </div>
<!--      <div v-show="tabAt === 'RECEIVE_GIFT' && userList.diff_score" class="number-back">-->
<!--        {{ $t('distance_to_gold_leader', { msg: userList.diff_score && userList.diff_score }) }}-->
<!--      </div>-->
<!--      <div v-show="tabAt === 'SEND_GIFT' && userList.diff_score" class="number-back">-->
<!--        {{ $t('distance_to_diamond_leader', { msg: userList.diff_score && userList.diff_score }) }}-->
<!--      </div>-->
    </div>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {deleteAttentionsApi, getIslamicRankAPI, postAttentionsApi} from "@/pages/islamicNewYear/api";
import { Toast } from "vant";
import {getLanguage} from "@/lib/device";
import { burialPointFun } from "@/lib/utils";
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

// 国际化
const root = getCurrentInstance();
const t = (value) => {
  return root.proxy.$i18n.t(value);
}

let tabAt = ref('RECEIVE_GIFT')
const tabList = ref([
  {
    name: t('receiveGift'),
    type: 'RECEIVE_GIFT'
  },
  {
    name: t('sendGift'),
    type: 'SEND_GIFT'
  }
])
// 切换tab
const cutTab = (value) => {
  tabAt.value = value;
  group.value = 'FIRST_GROUP';
  getHomeList(value, 'FIRST_GROUP');
}

// 组别tab
let group = ref('FIRST_GROUP')
const groupListID = ref([
  {
    name: 'LV.0-5',
    type: 'FIRST_GROUP',
  },
  {
    name: 'LV.6-15',
    type: 'SECOND_GROUP',
  },
  {
    name: 'LV.15+',
    type: 'THIRD_GROUP',
  }
])
const groupListEast = ref([
  {
    name: 'LV.0-10',
    type: 'FIRST_GROUP',
  },
  {
    name: 'LV.11-20',
    type: 'SECOND_GROUP',
  },
  {
    name: 'LV.20+',
    type: 'THIRD_GROUP',
  }
])
const groupListTwo = ref([
  {
    name: 'LV.0-5',
    type: 'FIRST_GROUP',
  },
  {
    name: 'LV.5+',
    type: 'SECOND_GROUP',
  },
])
const cutGroup = (value) => {
  group.value = value;
  getHomeList(tabAt.value, value);
}

// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);

// 大区信息
const region = ref('');

// 页面数据
const getHomeList = async (islamic_new_year_party_gift_type, group_type) => {
  try {
    const res = await getIslamicRankAPI({
      islamic_new_year_party_gift_type,
      group_type
    })
    if (res.status !== 1000) return;
    userList.value = res.data.my_rank;
    region.value = res.data.region_id;
    processRanking(res.data.rank_list);
  } catch (err) {
    console.log(err);
  }
}

// 处理排名数据
const processRanking = (data) => {
  if (!data) return;
  rankingThree.value = data.splice(0, 3);
  rankingLast.value = data;
};

// 关注用户
const attentions = async (value) => {
  if (value.is_mystery === 1) {
    Toast(t('mysterious_user'));
    return;
  }
  try {
    let res = null;
    if (value.relation.attention) {
      return;
    } else {
      res = await postAttentionsApi({
        target_uid: value.uid
      })
    }
    if (res.status !== 1000) return;
    if (value.relation.attention) {
      return;
    } else {
      Toast(t('follow_success'))

        burialPointFun({
            event_name: "page_btn_click",
            cid: -1000,
            md: 3,
            args_name: "page_btn_click",
            args: {
                type: 'follow_btn',
            },
        });
    }
    await getHomeList(tabAt.value, group.value);
  } catch (err) {
    console.log(err);
  }
}

// 跳转地址
const toDetails = (url) => {
  if (url.is_mystery === 1) {
    Toast(t('mysterious_user'));
    return;
  }
  window.location.href = url.scheme_url;
}

// 用户金币挡位
const gold = ref('');
// 送礼挡位
const diamondGear = ref('');
onMounted(async () => {
  await getHomeList('RECEIVE_GIFT', 'FIRST_GROUP');
})
</script>

<style lang="less" scoped>
.rank-main {
  display: flex;
  flex-direction: column;
  width: 7.08rem;
  height: 17.74rem;
  margin: .47rem auto 0;
  background: url("https://yaame-static.yaame.io/admin/b5f60660617e5fb2474bfbf85788203d.png") no-repeat;
  background-size: contain;

  .tab {
    position: relative;
    display: flex;
    width: 5rem;
    height: .73rem;
    margin: .6rem auto .36rem;
    background: url("https://yaame-static.yaame.io/admin/3d484e53b41d107b594f0f8478bcb2a8.png") no-repeat;
    background-size: contain;

    .move {
      position: absolute;
      top: .02rem;
      width: 2.51rem;
      height: .68rem;
      background: url("https://yaame-static.yaame.io/admin/2094e822208e7a637ee5daadab942e33.png") no-repeat;
      background-size: contain;
      transition-duration: .3s;
    }

    .tab-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0.73rem;
      flex: 1;
      font-size: .28rem;
      color: #FFF;
      z-index: 1;
    }

    .win {
      color: #FFF9A0;
    }
  }

  .group-list {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: .25rem;
    font-weight: 600;
    font-size: .22rem;
    color: #FFFFFF;

    .group {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.8rem;
      height: .66rem;
      background-image: url("https://yaame-static.yaame.io/admin/6cb2983f3747844a209cbd7bc8581d5c.png");
      background-repeat: no-repeat;
      background-size: contain;
      transition-duration: .3s;
    }

    .cut-group {
      background-image: url("https://yaame-static.yaame.io/admin/d3901774bb1035447c7a81ba0e339728.png");
      transition-duration: .3s;
    }
  }

  .ranking {
    display: flex;
    position: relative;
    justify-content: center;

    .front {
      position: absolute;
      top: .75rem;
      width: 2.27rem;
      height: 3.97rem;
      color: #7232B7;

      .bg {
        position: relative;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }

      .head {
        position: absolute;
        display: flex;
        top: .39rem;
        left: 50%;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        transform: translateX(-50%);
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-size: contain;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .click-head {
        position: absolute;
        top: .27rem;
        left: 50%;
        width: 1.72rem;
        height: 1.72rem;
        border-radius: 50%;
        transform: translateX(-50%);
        z-index: 2;
      }

      .status {
        position: absolute;
        top: 1.79rem;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: .24rem;
        padding: 0 .05rem;
        font-size: .18rem;
        color: #FFFFFF;
        transform: translateX(-50%);
        background: #C71DE6;
        border-radius: .08rem;
        white-space: nowrap;
        z-index: 1;
      }
      .living {
        background: #E6AE1D;
      }

      .top {
        position: absolute;
        top: 2.18rem;
        left: 50%;
        height: .22rem;
        transform: translateX(-50%);
        line-height: .22rem;
        font-size: .22rem;
        font-weight: 600;
        z-index: 1;
      }

      .name {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 2.42rem;
        left: 50%;
        width: 1.79rem;
        height: .28rem;
        transform: translateX(-50%);
        font-size: .20rem;
        text-align: center;
        z-index: 1;
        .name-one {
          //width: 1.2rem;
          height: .28rem;
          display: inline-block;
        }
        .tags {
          width: .55rem;
          height: .22rem;
          //margin-left: .04rem;
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
          margin-left: .06rem;
        }
        .vip {
          width: .6rem;
          height: .17rem;
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
          margin-left: .06rem;
        }
      }

      .id {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 2.7rem;
        left: 50%;
        width: 1.54rem;
        height: .25rem;
        line-height: .25rem;
        transform: translateX(-50%);
        font-size: .18rem;
        z-index: 1;
        .gold {
          width: .24rem;
          height: .24rem;
          margin-right: .08rem;
        }

        .diamond {
          width: .26rem;
          height: .22rem;
          margin-right: .08rem;
        }
      }

      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 2.99rem;
        left: 50%;
        width: .42rem;
        height: .42rem;
        transform: translateX(-50%);
        background-image: url('https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png');
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .number-one {
        background-image: url('https://yaame-static.yaame.io/admin/8c82218aefa54b27759df4a2e5bdb9b3.png');
      }
    }

    .front:nth-child(1) {
      top: 0;
      left: 2.42rem;
      height: 4.11rem;

      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/b61b0c87f34952a0f5cf51ad5642b02a.png");
      }

    }

    .front:nth-child(2) {
      left: .14rem;

      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/b12a0626c835303251185c3b084074a2.png");
      }
    }

    .front:nth-child(3) {
      right: .15rem;

      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/9cb06c064b7620e09315a9e69a60576c.png");
      }
    }

    .rank-last {
      position: relative;
      margin-top: 5.22rem;

      .item-scroll {
        position: relative;
        width: 7.08rem;
        padding-bottom: 1.71rem;
        background: url("https://yaame-static.yaame.io/admin/9c69ec79abf1f6a563d6015719ff6db3.png");
        background-size: contain;
        .back {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 6.88rem;
          height: 1.52rem;
          margin: 0 auto .2rem;
          background: url("https://yaame-static.yaame.io/admin/4dcd8fcb6d48fa31c1da4cdabacff775.png") no-repeat;
          background-size: cover;
          color: #FFEA83;

          .rank-back {
            width: .44rem;
            line-height: .26rem;
            margin-left: .4rem;
            font-size: .24rem;
            color: #FFEA83;
            text-align: center;
          }

          .head-back {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: .95rem;
            height: 1.05rem;
            margin: 0 .20rem 0 .16rem;
            padding-top: .1rem;

            .status {
              position: absolute;
              top: .84rem;
              left: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              height: .24rem;
              padding: 0 .05rem;
              font-size: .18rem;
              color: #FFFFFF;
              transform: translateX(-50%);
              background: #C71DE6;
              border-radius: .08rem;
              white-space: nowrap;
              z-index: 1;
            }
            .living {
              background: #E6AE1D;
            }

            .head {
              position: absolute;
              top: 0;
              width: .95rem;
              height: 1.05rem;
              margin: 0 .20rem 0 .16rem;
              padding-top: .1rem;
              background-image: url("https://yaame-static.yaame.io/admin/dd45ec2607e11a2de69f317548520794.png");
              background-repeat: no-repeat;
              background-size: contain;
            }

            img {
              width: .88rem;
              height: .88rem;
              border-radius: 50%;
            }
          }

          .name-back {
            position: relative;
            .name {
              display: flex;
              width: 2.52rem;
              margin-bottom: .09rem;
              align-items: center;
              overflow: hidden;
              .name-one {
                //width: 1.93rem;
                height: .24rem;
                line-height: .24rem;
                font-size: .24rem;
                color: #FFEA83;
                display: inline-block;
              }
              .vip {
                width: .82rem;
                height: .22rem;
                background-repeat: no-repeat;
                background-size: contain;
                flex-shrink: 0;
                margin-left: .1rem;
              }

              .tags {
                width: .55rem;
                height: .22rem;
                background-repeat: no-repeat;
                background-size: contain;
                flex-shrink: 0;
                margin-left: .1rem;
              }
            }

            .id {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              height: .3rem;
              line-height: .3rem;
              font-size: .22rem;
              color: #FFEA83;

              .gold {
                width: .24rem;
                height: .24rem;
                margin-right: .08rem;
              }

              .diamond {
                width: .26rem;
                height: .22rem;
                margin-right: .08rem;
              }
            }
          }

          .number-back {
            position: absolute;
            left: 5.9rem;
            width: .42rem;
            height: .42rem;
            background-image: url('https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
          .number-one {
            background-image: url('https://yaame-static.yaame.io/admin/8c82218aefa54b27759df4a2e5bdb9b3.png');
          }
        }
        .back:last-of-type {
          margin-bottom: 0;
        }
      }

      .lack {
        position: relative;
        top: .36rem;
        left: 50%;
        width: .84rem;
        height: 1rem;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/35f5d165c2ab39b869b6d6c1e1998683.png") no-repeat;
        background-size: contain;

        p {
          position: absolute;
          top: 1.37rem;
          left: 50%;
          height: .2rem;
          transform: translateX(-50%);
          line-height: .2rem;
          font-size: .24rem;
          color: #FFFFFF;
          white-space: nowrap;
        }
      }
    }
  }

  .rule-style {
    z-index: 99999;

    .content {
      display: flex;
      flex-direction: column;
      width: 5.06rem;
      height: 4.08rem;
      margin: 1.2rem auto 0;
      overflow-y: auto;

      span {
        font-weight: 600;
        font-size: .26rem;
        color: #FFFFFF;
      }

      p {
        font-size: .26rem;
        color: #FFFFFF;
        opacity: .6;
      }

      .rule-table {
        width: 5rem;
        border: 0.02rem solid #FFFFFF;
        border-radius: 0.12rem;
        font-size: 0.24rem;
        color: #fff;
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;

        .table-item {
          width: 5rem;
          height: 0.6rem;
          line-height: 0.6rem;
          display: flex;
          border-bottom: 0.02rem solid #FFFFFF;

          &:last-child {
            border-bottom: none;
          }

          div {
            flex: 1;
            text-align: center;
            border-right: 0.02rem solid #FFFFFF;

            &:nth-child(2n) {
              border-right: none;
            }
          }
        }
      }
    }
  }

  .my-rank {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 6.88rem;
    height: 1.51rem;
    background: url("https://yaame-static.yaame.io/admin/44472aeae86e00d52d416a1815459253.png") no-repeat;
    background-size: contain;
    transform: translateX(-50%);
    z-index: 3;

    .rank-back {
      width: .44rem;
      line-height: .26rem;
      margin-left: .4rem;
      font-size: .24rem;
      color: #FFEA83;
      text-align: center;
    }

    .head-back {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: .95rem;
      height: 1.05rem;
      margin: 0 .20rem 0 .16rem;
      padding-top: .1rem;

      .head {
        position: absolute;
        top: 0;
        width: .95rem;
        height: 1.05rem;
        margin: 0 .20rem 0 .16rem;
        padding-top: .1rem;
        background-image: url("https://yaame-static.yaame.io/admin/dd45ec2607e11a2de69f317548520794.png");
        background-repeat: no-repeat;
        background-size: contain;
      }

      img {
        width: .88rem;
        height: .88rem;
        border-radius: 50%;
      }
    }

    .name-back {
      position: relative;
      .name {
        display: flex;
        width: 2.52rem;
        margin-bottom: .09rem;
        align-items: center;
        overflow: hidden;
        .name-one {
          //width: 1.93rem;
          height: .24rem;
          line-height: .24rem;
          font-size: .24rem;
          color: #FFEA83;
          display: inline-block;
        }
        .vip {
          width: .82rem;
          height: .22rem;
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
          margin-left: .1rem;
        }

        .tags {
          width: .55rem;
          height: .22rem;
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
          margin-left: .1rem;
        }
      }

      .id {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: .3rem;
        line-height: .3rem;
        font-size: .22rem;
        color: #FFEA83;

        .gold {
          width: .24rem;
          height: .24rem;
          margin-right: .08rem;
        }

        .diamond {
          width: .26rem;
          height: .22rem;
          margin-right: .08rem;
        }
      }
    }

    .number-back {
      display: flex;
      justify-content: center;
      align-items: baseline;
      position: relative;
      width: 1.3rem;
      height: .56rem;
      line-height: .35rem;
      margin-left: .62rem;
      font-size: .2rem;
      color: #FFEA83;
    }
  }
}
</style>