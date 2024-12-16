<template>
  <div class="ranking-main">
      <!--奖池-->
      <div class="jackpot">
          <div class="jackpot-header">{{ $t('prize_pool') }}</div>
          <div class="jackpot-diamond">
              <img src="https://yaame-static.yaame.io/admin/5d726be0e72c8469ae456e68a88d84f2.png" alt="">
              {{ jackpotNumber }}
          </div>
          <div class="rule">
              <p>{{ $t('top_10_share_pool') }}</p>
              <div @click="cutRule">{{ $t('view_rules') }}<span>></span></div>
          </div>
      </div>

      <!--排名-->
      <div class="ranking">
          <div class="rank-top">
              <!--前三-->
              <div class="front" v-for="(item, index) in 3" :key="index">
                  <div class="bg"></div>
                  <div v-if="rankingThree[index] && rankingThree[index].subject_icon" class="click-head" @click="toDetails(rankingThree[index])"></div>
                  <div class="head">
                      <img v-if="rankingThree[index] && rankingThree[index].subject_icon" :src="rankingThree[index] && rankingThree[index].subject_icon" alt="">
                      <img v-else src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png" alt="">
                  </div>
                  <div class="top">TOP{{item}}</div>
                  <div class="name no-wrap">{{ rankingThree[index] && rankingThree[index].subject_name }}</div>
                  <div v-if="rankingThree[index] && rankingThree[index].is_mystery === 1" class="id no-wrap">ID: ******</div>
                  <div v-else class="id no-wrap">ID:{{ rankingThree[index] && rankingThree[index].peanut_id }}</div>
                  <div class="number">
                      <img src="https://yaame-static.yaame.io/admin/a4fa13b0b828c111068e138c370da03a.png" alt="">
                      {{ rankingThree[index] && rankingThree[index].subject_score }}
                  </div>
              </div>
          </div>
          <div class="rank-last">
              <!--剩余排行-->
              <div v-show="rankingLast && rankingLast.length" class="item-scroll">
                  <div class="back" v-for="(item, index) in rankingLast" :key="item.peanut_id">
                      <div class="rank-back">{{ item.subject_rank }}</div>
                      <div class="head-back" @click="toDetails(item)">
                          <img :src="item.subject_icon" alt="">
                      </div>
                      <div class="name-back">
                          <div class="name no-wrap">{{ item.subject_name }}</div>
                          <div v-if="item.is_mystery === 1" class="id">ID  ******</div>
                          <div v-else class="id">ID {{ item.peanut_id }}</div>
                      </div>
                      <div class="number-back">
                          <img src="https://yaame-static.yaame.io/admin/a4fa13b0b828c111068e138c370da03a.png" alt="">
                          {{ item.subject_score }}
                      </div>
                  </div>
              </div>
              <!--无人上榜样式-->
              <div v-if="rankingThree.length === 0" class="lack">
                  <p>{{ $t('noRanking') }}</p>
              </div>
          </div>
      </div>

      <!--我的排名-->
      <div class="my-rank">
          <div class="rank-back">{{ userList.subject_rank && userList.subject_rank <= 99 ?  userList.subject_rank : '99+' }}</div>
          <div class="head-back" @click="toDetails(userList)">
              <img :src="userList.subject_icon && userList.subject_icon" alt="">
          </div>
          <div class="name-back">
              <div class="name no-wrap">{{ userList.subject_name }}</div>
              <div class="id">ID:{{ userList.peanut_id }}</div>
          </div>
          <div class="number-back">
              <img src="https://yaame-static.yaame.io/admin/a4fa13b0b828c111068e138c370da03a.png" alt="">
              {{ userList.subject_score && userList.subject_score }}
          </div>
      </div>

      <rule
          v-show="ballRule"
          class="rule-style"
          :title="t('rules')"
          :buttonContent="t('gotIt')"
          background-image="https://yaame-static.yaame.io/admin/ce0e1ac92a405d65318d0a8555b45393.png"
          height="6.98rem"
          width="5.9rem"
          :cutRule="cutRule"
      >
          <template v-slot:default>
              <div class="content">
                  <span>{{ $t('task_event_time') }}</span>
                  <p>{{ $t('task_event_start_time') }}</p>
                  <p>{{ $t('task_event_end_time') }}</p>
                  <span>{{ $t('task_event_description') }}</span>
                  <p>{{ $t('user_on_leaderboard') }}</p>
                  <p>{{ $t('ranking_based_on_dishes') }}</p>
                  <p>{{ $t('dish_score_explanation') }}</p>

                  <div class="rule-table">
                      <div v-for="(item, index) in ruleTableTwo" :key="index" class="table-item">
                          <div v-for="(ele) in item">
                              {{ ele > 0 ? ele : $t(ele) }}
                          </div>
                      </div>
                  </div>
              </div>
          </template>
      </rule>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import {getRankRewardApi, getRankSimpleApi} from "../api";
import Rule from "./ruleCommon.vue";

// 规则数据
let ruleTableTwo = ref([
    [
        'food', 'score_explanation',
    ], [
        'grilled_fish', 100,
    ], [
        'la_wang_beef', 85,
    ], [
        'sha_dia_beef', 75,
    ], [
        'ren_dang_beef', 65,
    ], [
        'grilled_lamb', 60,
    ], [
        'coconut_rice', 50,
    ], [
        'badong_dishes', 35
    ], [
        'fried_rice', 25
    ]
]);

// 国际化
const root = getCurrentInstance();
const t = (value) => {
    return root.proxy.$i18n.t(value);
}

// 规则弹窗
const ballRule = ref(false);
const cutRule = () => {
    ballRule.value = !ballRule.value;
}

// 获取奖池数量
const jackpotNumber = ref(0);
const acquisitionValue = async () => {
    try {
        console.log(1)
        const res = await getRankRewardApi({
            requestType: 0,
        })
        if (res.status !== 1000) return;
        jackpotNumber.value = res.data.pool_value;
    } catch (err) {
        console.log(err);
    }
}

// 获取页面信息
const userList = ref([]);
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);
const rankingData = async () => {
    try {
        const res = await getRankSimpleApi({
            page: 1,
            size: 50,
            rankType: 'EIDALAD_ACTIVITY',
            rankGroupFlag: 'eidalad',
        })
        if (res.status !== 1000) return;
        userList.value = res.data.my_rank;
        processRanking(res.data.content);
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

// 跳转
const toDetails = (item) => {
    if (item.is_mystery) return;
    window.location.href = item.scheme_url;
}
onMounted(async () => {
    await acquisitionValue();
    await rankingData();
})

watch(() => root.proxy.$route.path, async () => {
    if (root.proxy.$route.path.indexOf("ranking") !== -1) {
        await acquisitionValue();
        await rankingData();
    }
});

</script>

<style lang="less" scoped>
.ranking-main {
    margin-top: .19rem;
    overflow: hidden;
    .jackpot {
        position: relative;
        width: 6.5rem;
        height: 2.13rem;
        margin: auto;
        background: url("https://yaame-static.yaame.io/admin/aba01db578ed67b10d0dad52ce931a6b.png") no-repeat;
        background-size: cover;
         .jackpot-header {
             position: absolute;
             top: .13rem;
             left: 50%;
             height: .24rem;
             line-height: .24rem;
             transform: translateX(-50%);
             font-size: .24rem;
             color: #854304;
         }

        .jackpot-diamond {
            position: absolute;
            top: .51rem;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: .9rem;
            transform: translateX(-50%);
            font-weight: 600;
            font-size: .64rem;
            //color: #F9DB61;
            background: linear-gradient(90deg, #FFF195 0%, #FFDA56 100%);
            -webkit-background-clip: text;
            color: transparent;

            img {
                width: .48rem;
                height: .41rem;
                margin-right: .19rem;
            }
        }

        .rule {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: .39rem;
            left: 50%;
            width: 90%;
            height: .33rem;
            transform: translateX(-50%);
            font-size: .24rem;
            color: #FFE399;
            line-height: .33rem;
            p {
                margin-right: .24rem;
                text-align: center;
            }

            div {
                span {
                    margin-left: .04rem;
                }
            }
        }
    }

    .ranking {
        .rank-top {
            position: relative;
            width: 7.11rem;
            min-height: 6.21rem;
            margin: .12rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/368d2cd5a924679990095cff4455e780.png") no-repeat;
            background-size: cover;
            z-index: 1;
            .front {
                position: absolute;
                top: 1.2rem;
                width: 2.12rem;
                height: 4.09rem;

                .bg {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: contain;
                }

                .head {
                    position: absolute;
                    display: flex;
                    top: .27rem;
                    left: 50%;
                    width: 1.72rem;
                    height: 1.72rem;
                    border-radius: 50%;
                    transform: translateX(-50%);
                    justify-content: center;
                    align-items: center;
                    background-repeat: no-repeat;
                    background-size: contain;
                    z-index: -1;

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

                .top {
                    position: absolute;
                    top: 2.23rem;
                    left: 50%;
                    height: .22rem;
                    transform: translateX(-50%);
                    line-height: .22rem;
                    font-size: .22rem;
                    font-weight: 600;
                }

                .name {
                    position: absolute;
                    top: 2.52rem;
                    left: 50%;
                    width: 1.28rem;
                    height: .24rem;
                    transform: translateX(-50%);
                    line-height: .24rem;
                    font-size: .24rem;
                    text-align: center;
                }

                .id {
                    position: absolute;
                    top: 2.81rem;
                    left: 50%;
                    width: 1.54rem;
                    height: .18rem;
                    line-height: .18rem;
                    transform: translateX(-50%);
                    font-size: .18rem;
                    text-align: center;
                }

                .number {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 3.18rem;
                    left: 50%;
                    height: .24rem;
                    transform: translateX(-50%);
                    line-height: .24rem;
                    font-size: .24rem;
                    img {
                        width: .45rem;
                        height: .18rem;
                        margin-left: .03rem;
                    }
                }
            }

            .front:nth-child(1) {
                top: .53rem;
                left: 2.49rem;
                height: 4.11rem;
                color: #864609;

                .head {
                    top: .28rem;
                }

                .bg {
                    background-image: url("https://yaame-static.yaame.io/admin/828d24a49e2977aa0a98a49c4f67c035.png");
                }

                .name {
                    top: 2.53rem;
                }

                .id {
                    top: 2.82rem;
                }
            }

            .front:nth-child(2) {
                left: .25rem;
                color: #2F61A4;
                .bg {
                    background-image: url("https://yaame-static.yaame.io/admin/b097289ad694240bcdfce408c2e56add.png");
                }
            }

            .front:nth-child(3) {
                right: .26rem;
                color: #803779;
                .bg {
                    background-image: url("https://yaame-static.yaame.io/admin/841ee2a165faedb1e4657468b50431e3.png");
                }
            }
        }
        .rank-last {
            position: relative;
            top: -0.1rem;
            left: 0.01rem;
            width: 7.02rem;
            height: 10.6rem;
            margin: auto;
            background: url("https://yaame-static.yaame.io/admin/06e5e765631dc4eb73640f844b84b320.png") no-repeat;
            background-size: 100% 100%;
            z-index: 1;
            .item-scroll {
                position: relative;
                top: -0.64rem;
                width: 100%;
                height: 9.55rem;
                overflow-x: hidden;
                overflow-y: auto;
            }

            .back {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 6.55rem;
                height: 1.50rem;
                margin: 0 auto .1rem;
                background: url("https://yaame-static.yaame.io/admin/f83eb9ee390b55f90f9120d8ca0dd91b.png") no-repeat;
                background-size: cover;
                color: #FFF89F;

                .rank-back {
                    width: .3rem;
                    height: .28rem;
                    line-height: .28rem;
                    margin-left: .34rem;
                    font-size: .26rem;
                    text-align: center;
                }

                .head-back {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    width: 1.08rem;
                    height: 1.12rem;
                    margin: 0 .21rem 0 .25rem;
                    padding-top: .08rem;
                    background-image: url("https://yaame-static.yaame.io/admin/4e76db8a7a0226ca7b72929ae31af03a.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                    img {
                        width: 1rem;
                        height: 1rem;
                        border-radius: 50%;
                    }
                }

                .name-back {
                    .name {
                        width: 2.17rem;
                        height: .3rem;
                        margin-bottom: .07rem;
                        line-height: .3rem;
                        font-size: .24rem;
                        font-weight: 400;
                    }

                    .id {
                        height: .22rem;
                        line-height: .22rem;
                        font-size: .22rem;
                    }
                }

                .number-back {
                    display: flex;
                    justify-content: center;
                    align-items: baseline;
                    position: relative;
                    height: .24rem;
                    line-height: .34rem;
                    margin-left: .81rem;
                    font-size: .24rem;
                    img {
                        width: .45rem;
                        height: .18rem;
                        margin-right: .04rem;
                    }
                }
            }

            .lack {
                position: relative;
                top: 1.09rem;
                left: 50%;
                width: .84rem;
                height: 1rem;
                transform: translateX(-50%);
                background: url("https://yaame-static.yaame.io/admin/1fcb363383c5b2c4be4860960fece079.png") no-repeat;
                background-size: contain;
                p {
                    position: absolute;
                    top: 1.37rem;
                    left: 50%;
                    height: .2rem;
                    transform: translateX(-50%);
                    line-height: .2rem;
                    font-size: .20rem;
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
        width: 100%;
        height: 1.5rem;
        background: url("https://yaame-static.yaame.io/admin/ac2cec7a663f281d5b19c0888a672fe4.png") no-repeat;
        background-size: contain;
        z-index: 3;
        .rank-back {
            height: .26rem;
            line-height: .26rem;
            margin-left: .41rem;
            font-size: .26rem;
            color: #FFF89F;
            text-align: center;
        }

        .head-back {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 1.08rem;
            height: 1.12rem;
            margin: 0 .25rem;
            padding-top: .08rem;
            background-image: url("https://yaame-static.yaame.io/admin/4e76db8a7a0226ca7b72929ae31af03a.png");
            background-repeat: no-repeat;
            background-size: contain;
            img {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
            }
        }

        .name-back {
            .name {
                width: 2.17rem;
                height: .3rem;
                margin-bottom: .18rem;
                line-height: .3rem;
                font-size: .24rem;
                color: #FFF89F;
            }

            .id {
                height: .22rem;
                line-height: .22rem;
                font-size: .22rem;
                color: #FFF89F;
            }
        }

        .number-back {
            display: flex;
            justify-content: center;
            align-items: baseline;
            position: relative;
            height: .24rem;
            line-height: .24rem;
            margin-left: 1.43rem;
            font-size: .24rem;
            color: #FFF89F;
            img {
                width: .45rem;
                height: .18rem;
                margin-right: .04rem;
            }
        }
    }
}
</style>
