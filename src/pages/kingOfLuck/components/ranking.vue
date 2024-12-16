<template>
	<div class="ranking-main">
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
        <div v-if="rankingThree[index] && rankingThree[index].user_status && (rankingThree[index].user_status === 2 || rankingThree[index].user_status === 1)" class="status" :class="{ 'living': rankingThree[index].user_status === 2 }">
          {{ rankingThree[index] && rankingThree[index].user_status === 2 ? $t('start_broadcast') : rankingThree[index].user_status === 1 ? $t('online') : '' }}
        </div>
        <!--名称-->
        <div class="name">
          <span class="name-one no-wrap">{{ rankingThree[index] && rankingThree[index].nick_name }}</span>
          <div
              class="tags"
              v-if="rankingThree[index] && rankingThree[index].wealth_level"
              :style="{ backgroundImage: `url(${rankingThree[index].wealth_level})` }"
          ></div>
        </div>
        <!--神秘人-->
        <div class="id" v-if="rankingThree[index]">{{$t('luck_value') }} {{ rankingThree[index] && rankingThree[index].score}}</div>
        <div v-show="rankingThree[index] && userList.uid !== rankingThree[index].uid" class="number" :class="{ 'number-one':  rankingThree[index] && rankingThree[index].relation.attention }" @click="attentions(rankingThree[index])"></div>
      </div>
      <div class="rank-last">
        <!--剩余排行-->
        <div class="item-scroll">
          <div class="back" v-for="(item, index) in rankingLast" :key="item.peanut_id">
            <div class="rank-back">{{ index + 4}}</div>
            <div class="head-back" @click="toDetails(item)">
              <div class="head"></div>
              <img :src="item.avatar" alt="">
              <!--状态-->
              <div v-if="item.user_status === 1 || item.user_status === 2" class="status" :class="{ 'living': item.user_status === 2 }">
                {{ item.user_status === 2 ? $t('start_broadcast') : item.user_status === 1 ? $t('online') : '' }}
              </div>
            </div>
            <div class="name-back">
              <div class="name">
                <span class="name-one no-wrap">{{ item.nick_name }}</span>
                <div
                    class="tags"
                    v-if="item.wealth_level"
                    :style="{ backgroundImage: `url(${item.wealth_level})` }"
                ></div>
              </div>
              <div v-if="false" class="id">{{ item.score }}</div>
              <div v-else class="id">
                {{ $t('luck_value') }}
                {{ item.score }}
              </div>
            </div>
            <div v-show="userList.uid !== item.uid" class="number-back" :class="{ 'number-one':  item.relation.attention }" @click="attentions(item)"></div>
          </div>
        </div>
        <!--无人上榜样式-->
        <div v-if="!rankingThree.length" class="lack">
          <p>{{ $t('no_data') }}</p>
        </div>
      </div>
    </div>

    <!--我的排名-->
    <div v-if="Object.keys(userList).length" class="my-rank">
      <div class="rank-back">{{
          (userList.rank + 1) && (userList.rank + 1) <= 99 ? userList.rank + 1 : '99+'
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
              v-if="userList.wealth_level"
              :style="{ backgroundImage: `url(${userList.wealth_level})` }"
          ></div>
        </div>
        <div class="id">
          {{ $t('luck_value') }}
          {{ userList.score ? userList.score : 0 }}
        </div>
      </div>
      <div v-if="(userList.rank + 1) <= 99 && typeof userList.delta_score === 'number'" class="difference-value">{{ $t('distance_to_next') + userList.delta_score }}</div>
    </div>
	</div>
</template>

<script setup>
import {getCurrentInstance, onActivated, onDeactivated, onMounted, ref, watch} from "vue";
import {postAttentionsApi} from "../api";
import {Toast} from "vant";
import eventBus from '../eventBus';

const emit = defineEmits(["mounted"]);
const props = defineProps(['rankingData']);

// 获取实例
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
}

// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);

// 处理排名数据
const processRanking = (data) => {
  if (!data) return;
  rankingThree.value = data.splice(0, 3);
  rankingLast.value = data;
};

// 关注
const attentions = async (value) => {
  try {
    if (value.mystery) {
      Toast(t('mystery_user'));
      return;
    }
    if (value.relation.attention) return;
    const res = await postAttentionsApi({
      target_uid: value.uid
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('followed'));
    refresh();
  } catch (err) {
    console.log(err);
  }
}

const refresh = () => {
  eventBus.emit('refresh');
}

// 跳转链接
const toDetails = (value) => {
  if (value.mystery === 1) {
    Toast(t('mystery_user'));
    return;
  }
  window.location.href = value.scheme_user_url;
}


// 监视 props 的变化
watch(() => props.rankingData, (newValue) => {
  if (newValue) {
    userList.value = newValue.my_rank_info;
    processRanking(newValue.rank);
  }
});

onMounted(() => {
  emit('mounted');
})
</script>

<style lang="less" scoped>
.ranking-main {
  display: flex;
  flex-direction: column;
  width: 7.22rem;
  margin: .12rem auto 0;
  background: url("https://yaame-static.yaame.io/admin/a6a2a97b97a2e65cafbb7f9c122cffc0.png") no-repeat;
  background-size: 100%;

  .ranking {
    display: flex;
    position: relative;
    justify-content: center;

    .front {
      position: absolute;
      top: 2.75rem;
      width: 2.14rem;
      height: 4.14rem;
      color: #FFF;

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
        width: 1.52rem;
        height: 1.52rem;
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
        top: 2.02rem;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: .24rem;
        line-height: .24rem;
        padding: 0 .08rem;
        font-size: .18rem;
        color: #FFFFFF;
        transform: translateX(-50%);
        background: #268ADF;
        border-radius: .08rem;
        white-space: nowrap;
        z-index: 1;
      }
      .living {
        background: #AC3AF6;
      }

      .name {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 2.74rem;
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
          font-weight: 600;
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
        position: absolute;
        top: 3.02rem;
        left: 50%;
        width: 95%;
        height: .25rem;
        line-height: .25rem;
        transform: translateX(-50%);
        font-size: .18rem;
        z-index: 1;
        text-align: center;
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
        top: 3.39rem;
        left: 50%;
        width: .54rem;
        height: .46rem;
        transform: translateX(-50%);
        background-image: url('https://yaame-static.yaame.io/admin/ac27bec37e03054dcfcc220755b35a42.png');
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .number-one {
        background-image: url('https://yaame-static.yaame.io/admin/4b03977aff7db2adec650ae4c8494992.png');
      }
    }

    .front:nth-child(1) {
      top: 1.91rem;
      left: 2.45rem;
      width: 2.3rem;
      height: 4.43rem;

      .name {
        top: 3rem;
      }

      .head {
        width: 1.74rem;
        height: 1.74rem;
      }

      .id {
        top: 3.28rem;
      }

      .number {
        top: 3.72rem;
      }

      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/493057ada0dc6eff2c5553b22bcf2eb4.png");
      }

    }

    .front:nth-child(2) {
      left: .24rem;
      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/d03eb37df08747c2f4264dbc1e2a445b.png");
      }
    }

    .front:nth-child(3) {
      right: .24rem;

      .bg {
        background-image: url("https://yaame-static.yaame.io/admin/cb486f09ee35d2a54c958eb49d0b717b.png");
      }
    }

    .rank-last {
      position: relative;
      margin-top: 9.13rem;

      .item-scroll {
        position: relative;
        width: 7.18rem;
        min-height: 7rem;
        background: url("https://yaame-static.yaame.io/admin/4e2766b91c7975a9115aeae1aae92b09.png");
        background-size: contain;

        .back {
          position: relative;
          top: -2rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 6.89rem;
          height: 1.42rem;
          margin: 0 auto .13rem;
          background: url("https://yaame-static.yaame.io/admin/ff5dd0380dba1dc8875ac6d8e6a0bac5.png") no-repeat;
          background-size: cover;
          color: #AA4201;

          .rank-back {
            display: flex;
            justify-content: center;
            align-items: center;
            width: .44rem;
            height: .52rem;
            margin-left: .59rem;
            font-size: .24rem;
            color: #FFF;
            background: url("https://yaame-static.yaame.io/admin/46e1d2f9207a70346a8bb2c588a6ae09.png") no-repeat;
            background-size: contain;
          }

          .head-back {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: .98rem;
            height: .98rem;
            margin: 0 .20rem 0 .16rem;

            .status {
              position: absolute;
              top: .77rem;
              left: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              height: .24rem;
              padding: 0 .05rem;
              font-size: .18rem;
              color: #FFFFFF;
              transform: translateX(-50%);
              background: #268ADF;
              border-radius: .08rem;
              white-space: nowrap;
              z-index: 1;
            }
            .living {
              background: #C71DE6;
            }

            .head {
              position: absolute;
              top: 0;
              width: .98rem;
              height: .98rem;
              margin: 0 .20rem 0 .16rem;
              background-image: url("https://yaame-static.yaame.io/admin/084817db2e116589ec570df01876ce02.png");
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
            font-weight: 600;
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
                color: #AA4201;
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
              color: #AA4201;

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
            left: 5.95rem;
            width: .54rem;
            height: .46rem;
            background-image: url('https://yaame-static.yaame.io/admin/ac27bec37e03054dcfcc220755b35a42.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
          .number-one {
            background-image: url('https://yaame-static.yaame.io/admin/4b03977aff7db2adec650ae4c8494992.png');
          }
        }
        .back:last-of-type {
          margin-bottom: 0;
        }
      }

      .lack {
        position: absolute;
        top: 0;
        left: 50%;
        width: .84rem;
        height: 1rem;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/342d71b54c3410e1a8ed458a5eb07533.png") no-repeat;
        background-size: contain;

        p {
          position: absolute;
          top: 1.37rem;
          left: 50%;
          height: .2rem;
          transform: translateX(-50%);
          line-height: .2rem;
          font-size: .24rem;
          color: #AA4201;
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
    width: 7.49rem;
    height: 1.53rem;
    background: url("https://yaame-static.yaame.io/admin/c23085f1d594efe635959ea57a3754ec.png") no-repeat;
    background-size: contain;
    transform: translateX(-50%);
    z-index: 3;

    .rank-back {
      display: flex;
      justify-content: center;
      align-items: center;
      width: .54rem;
      height: .64rem;
      margin-left: .59rem;
      font-size: .24rem;
      color: #FFF;
      background: url("https://yaame-static.yaame.io/admin/46e1d2f9207a70346a8bb2c588a6ae09.png") no-repeat;
      background-size: contain;
    }

    .head-back {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: .98rem;
      height: .98rem;
      margin: 0 .20rem 0 .16rem;

      .head {
        position: absolute;
        top: 0;
        width: .98rem;
        height: .98rem;
        margin: 0 .20rem 0 .16rem;
        background-image: url("https://yaame-static.yaame.io/admin/084817db2e116589ec570df01876ce02.png");
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
      color: #AA4201;
      font-weight: 600;
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
    }

    .difference-value {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.6rem;
      height: .56rem;
      margin-left: .6rem;
      font-size: .2rem;
      color: #AA4201;
    }
  }
}
</style>