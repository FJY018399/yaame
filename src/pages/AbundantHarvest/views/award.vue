<template>
  <div class="main">
      <!--标题-->
      <custom-header class="header" color="harvest">{{ $t('eventReward') }}</custom-header>
      <div v-if="item.rewards.length > 3" class="award" v-for="(item, index) in data" :key="index">
          <div class="head">{{ topNumber[index] }}</div>
          <div class="award-list" v-for="(ite, inx) in item.rewards" :key="ite.reward_id">
              <img :src="ite.icon" alt="">
              <div v-show="ite.valid_days" class="day">{{ ite.valid_days }}</div>
              <div v-show="ite.reward_diamonds" class="diamond">
                  <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                  {{ ite.reward_diamonds }}
              </div>
          </div>
      </div>
      <div v-if="item.rewards.length === 3" class="award last-three" v-for="(item, index) in data" :key="index">
          <div class="head">{{ topNumber[index] }}</div>
          <div class="award-list" v-for="ite in item.rewards" :key="ite.reward_id">
              <img :src="ite.icon" alt="">
              <div v-show="ite.valid_days" class="day">{{ ite.valid_days }}</div>
              <div v-show="ite.reward_diamonds" class="diamond">
                  <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                  {{ ite.reward_diamonds }}
              </div>
          </div>
      </div>
      <div v-if="item.rewards.length === 2" class="last" v-for="(item, index) in data" :key="index">
          <div class="head">{{ topNumber[index] }}</div>
          <div class="award-last" v-for="ite in item.rewards" :key="ite.reward_id">
              <img :src="ite.icon" alt="">
              <div v-show="ite.valid_days" class="day">{{ ite.valid_days }}</div>
              <div v-show="ite.reward_diamonds" class="diamond">
                  <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                  {{ ite.reward_diamonds }}
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {getRankingWardApi} from "../api";
import customHeader from "@/components/common/header.vue";

const root = getCurrentInstance()
const t = (value) => {
    return root.proxy.$i18n.t(value);
}
// top多语言
const topNumber = ref([t('top1'), t('top2'), t('top3'), t('top4_6'), t('top7_10')]);
// 页面礼物数据
const data = ref([]);

const awardList = async () => {
    try {
        const res = await getRankingWardApi();
        processing(res.data.rank_type_rewards);
    } catch (err) {
        console.log(err);
    }
}

// 处理数据
const list = ['FIRST','SECOND','THIRD','FOUR_SIX','SEVEN_TEN'];
const processing = (value) => {
    data.value = list.map(rankType => value.find(reward => reward.rank_type === rankType)).filter(Boolean);
}

onMounted(() => {
    awardList();
})
</script>

<style lang="less" scoped>
.main {
    padding: .5rem 0 .9rem 0;
    .award {
        position: relative;
        width: 6.88rem;
        height: 7.2rem;
        margin: 0 auto .29rem;
        background: url("https://yaame-static.yaame.io/admin/aaf5d5aa4830a92ab75c5891edffa472.png") no-repeat;
        background-size: contain;
        .award-list {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.2rem;
            height: 2.2rem;
            background: #FFBD66;
            border-radius: .16rem;
            border: .01rem solid #FFEFB8;
            img {
                width: 1.59rem;
            }
            .day {
                position: absolute;
                top: 0;
                right: 0;
                width: .95rem;
                height: .34rem;
                line-height: .34rem;
                background: #DD7E1C;
                border-radius: 0 .15rem 0 .13rem;
                font-size: .24rem;
                color: #FFFFFF;
                text-align: center;
            }
            .diamond {
                position: absolute;
                left: 50%;
                top: 2.32rem;
                display: flex;
                justify-content: center;
                align-items: center;
                height: .37rem;
                transform: translateX(-50%);
                font-weight: 600;
                font-size: .26rem;
                color: #B46223;
                img {
                    width: .26rem;
                    height: .22rem;
                    margin-right: .04rem;
                }
            }
        }
        .award-list:nth-child(2) {
            top: 1.37rem;
            left: .8rem;
        }
        .award-list:nth-child(3) {
            top: 1.37rem;
            right: .8rem;
        }
        .award-list:nth-child(4) {
            position: absolute;
            top: 4.21rem;
            left: .8rem;
        }
        .award-list:nth-child(5) {
            top: 4.21rem;
            right: .8rem;
        }
    }
    .last-three {
        .award-list:nth-child(4) {
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .last {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: space-evenly;
        width: 6.88rem;
        height: 4.4rem;
        margin: auto;
        padding-top: 1.37rem;
        background: url("https://yaame-static.yaame.io/admin/efd3ce3fb93e033d31669dc78951bb29.png") no-repeat;
        background-size: contain;
        .award-last {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 2.2rem;
            height: 2.2rem;
            background: #FFBD66;
            border-radius: .16rem;
            border: .01rem solid #FFEFB8;
            img {
                width: 1.59rem;
            }
            .day {
                position: absolute;
                top: 0;
                right: 0;
                width: .95rem;
                height: .34rem;
                line-height: .34rem;
                background: #DD7E1C;
                border-radius: 0 .15rem 0 .13rem;
                font-size: .24rem;
                color: #FFFFFF;
                text-align: center;
            }
            .diamond {
                position: absolute;
                left: 50%;
                top: 2.32rem;
                display: flex;
                justify-content: center;
                align-items: center;
                height: .37rem;
                transform: translateX(-50%);
                font-weight: 600;
                font-size: .26rem;
                color: #B46223;

                img {
                    width: .26rem;
                    height: .22rem;
                    margin-right: .04rem;
                }
            }
        }
    }

    .head {
        position: absolute;
        top: .41rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-weight: 600;
        font-size: .32rem;
        color: #844E19;
    }

}
</style>
