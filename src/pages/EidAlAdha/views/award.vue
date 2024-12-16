<template>
  <div class="main">
      <!--标题-->
      <custom-header class="header" color="white">{{ $t('event_rewards') }}</custom-header>
      <!--上部分背景-->
      <div class="bg"></div>
      <!--下部分背景-->
      <div class="award">
          <div class="award-shell">
              <!--奖励项-->
              <div class="award-item" v-for="(item, index) in awardList" :key="index">
                  <!--挡位-->
                  <div class="grade">{{ $t('rank') }}{{ index === 3 ? '4~5' : index === 4 ? '6~10' : index + 1 }}</div>
                  <!--具体奖励-->
                  <div class="gift" v-for="(ite, inx) in item" :key="inx">
                      <img :src="ite.reward_icon" alt="">
                      <div v-if="ite.valid_days" class="day">{{ ite.valid_days }}</div>
                      <div v-else class="diamond">
                          <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                          {{ ite.diamond_worth }}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getRankRewardApi} from "../api";
import customHeader from "@/components/common/header.vue";

// 获取页面奖励数据
const awardList = ref([]);
const getAwardList = async () => {
    try {
        const res = await getRankRewardApi({
            requestType: 1
        })
        if (res.status !== 1000) return;
        awardList.value = res.data.rank_rewards;
    } catch (err) {
        console.log(err);
    }
}

onMounted(() => {
    document.body.style.backgroundColor = '#2B5E53';
    getAwardList();
})
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    padding-bottom: .52rem;
    .bg {
        position: relative;
        width: 7.18rem;
        height: 6.28rem;
        margin: .12rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/cd23254fa254266f8573e9f5aad4045f.png") no-repeat;
        background-size: cover;
    }
    .award {
        display: flex;
        flex-direction: column;
        position: relative;
        left: 0.008rem;
        top: -0.1rem;
        width: 7.09rem;
        height: 32.92rem;
        margin: auto;
        background: url("https://yaame-static.yaame.io/admin/974676cafc296dcf750f46cbae0b2fc6.png") no-repeat;
        background-size: 100% 100%;
        border-bottom: .04rem solid #F9DC4D;
        .award-shell {
            position: relative;
            top: -5.19rem;
            .award-item {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                align-content: flex-start;
                width: 6.5rem;
                height: 7.35rem;
                margin: .19rem auto 0;
                padding-top: .81rem;
                background: url("https://yaame-static.yaame.io/admin/777c2693f780389a9cc67337532fb0ec.png") no-repeat;
                background-size: cover;

                .grade {
                    position: absolute;
                    top: .49rem;
                    left: 50%;
                    height: .45rem;
                    transform: translateX(-50%);
                    font-weight: 600;
                    font-size: .32rem;
                    color: #FFFFFF;
                }

                .gift {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 2.2rem;
                    height: 2.2rem;
                    margin-top: .67rem;
                    background: #216955;
                    border-radius: .16rem;
                    border: .01rem solid #FBE391;
                    img {
                        width: 1.59rem;
                    }

                    .day {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: .95rem;
                        height: .34rem;
                        background: #38B971;
                        border-radius: 0 .15rem 0 .13rem;
                        font-size: .24rem;
                        color: #FFFFFF;
                    }
                    .diamond {
                        position: absolute;
                        top: 2.4rem;
                        left: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: .37rem;
                        transform: translateX(-50%);
                        font-weight: 600;
                        font-size: .26rem;
                        color: #FFF89F;
                        img {
                            width: .26rem;
                            height: .22rem;
                            margin-right: .04rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
