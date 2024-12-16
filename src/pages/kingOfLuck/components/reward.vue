<template>
  <div class="main">
    <custom-header color="white">{{ $t('rules') }}</custom-header>
    <!-- 标题 -->
    <div class="herder-title">{{ $t('rules_and_rewards') }}</div>
    <!-- 活动奖励规则 -->
    <div class="rule">
      <p>{{ $t('rule_1') }}</p>
      <p>{{ $t('rule_2') }}</p>
      <p>{{ $t('rule_3') }}</p>
      <p>{{ $t('rule_4') }}</p>
      <p>{{ $t('rule_5') }}</p>
    </div>
    <!-- 奖励标题 -->
    <div class="herder-award">{{ $t('leaderboard_rewards') }}</div>

    <p class="top-award">{{ $t('top_10_rewards') }}</p>
    <!-- 奖励 -->
    <div class="award-list" v-for="(item, index) in awardList" :key="index">
      <div class="award-list-head">{{ index === 3 ? `${$t('rank')} 4~5` : index === 4 ? `${$t('rank')} 6~10` : `${$t('rank')} ${index + 1}` }}</div>
      <div class="award" v-for="(ite, inx) in item.rank_rewards" :key="inx">
        <div class="icon">
          <div class="angle" v-if="ite.object_type !== 'DIAMOND'">{{ ite.subscript }}</div>
          <img :src="ite.reward_icon" alt="">
        </div>
        <div class="name">{{ ite.reward_name }}</div>
        <div class="diamond">
          <img src="https://yaame-static.yaame.io/admin/723081ad3899c57ef3ba93fb57a8eafa.png" alt="">
          {{ ite.reward_diamond_worth }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, onActivated, onDeactivated, onMounted, ref} from 'vue';
import customHeader from "@/components/common/header.vue";
import eventBus from "@/pages/kingOfLuck/eventBus";
import {Toast} from "vant";
import {getLuckyKinRankApi} from "../api";

// 获取实例
const root = getCurrentInstance();

const awardList = ref([])

onMounted(async () => {
  try {
    const res = await getLuckyKinRankApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    awardList.value = res.data.rank_reward_levels;
  } catch (err) {
    console.log(err);
  }
})
</script>

<style lang="less" scoped>
.main {
  min-height: 100vw;
  padding-bottom: .45rem;
  background: url('https://yaame-static.yaame.io/admin/4604510d69e8735127590b07b2ba6f5e.png') no-repeat;
  background-size: contain;
  overflow: hidden;

  // 标题
  .herder-title,
  .herder-award{
    width: 4.73rem;
    height: 1.21rem;
    line-height: .95rem;
    margin: .71rem auto 0;
    font-size: .36rem;
    font-weight: 600;
    color: #770402;
    text-align: center;
    background: url('https://yaame-static.yaame.io/admin/662f99f7f6052ee76f0a85a744441664.png') no-repeat;
    background-size: contain;
  }

  // 标题
  .herder-award {
    width: 5.2rem;
    height: 1.23rem;
    font-size: .32rem;
    font-weight: 600;
    color: #770402;
    text-align: center;
    background: url('https://yaame-static.yaame.io/admin/e136e5fd6a0dda9d24013a7763ba8d91.png') no-repeat;
    background-size: contain;
  }

  .top-award {
    margin: .24rem auto .2rem;
    font-size: .26rem;
    color: #770402;
    text-align: center;
  }

  // 活动规则
  .rule {
    width: 7rem;
    margin: .47rem 0 .74rem .43rem;
    color: #770402;
    font-size: .28rem;
    overflow: hidden;

    p {
      margin-bottom: .22rem;
    }
  }

  .reward-title {
    width: 5.03rem;
    height: .5702rem;
    font-size: .32rem;
    color: #770402;
    margin: .21rem auto 0;
    text-align: center;
  }

  .award-list {
    position: relative;
    display: flex;
    justify-content: space-evenly;
    width: 6.88rem;
    height: 4.47rem;
    margin: 0 auto .06rem;
    padding-top: 1.56rem;
    background: url("https://yaame-static.yaame.io/admin/c5300d96b53be31fdb74c79c746956e4.png") no-repeat;
    background-size: contain;

    .award-list-head {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: .72rem;
      left: 50%;
      height: .45rem;
      transform: translateX(-50%);
      font-weight: 600;
      font-size: .32rem;
      color: #770402;
    }

    .award {
      width: 2rem;
      color: #FFFFFF;
      font-weight: 600;
      .icon {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        margin-bottom: .08rem;
        background: #F2CB68;
        border-radius: .16rem;
        border: .01rem solid #FBE391;

        .angle {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: .95rem;
          height: .34rem;
          background: #C570F7;
          border-radius: 0 .15rem 0 .13rem;
          font-size: .24rem;
          color: #FFFFFF;
        }

        img {
          width: 1.59rem;
          height: 1.59rem;
        }
      }

      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        //height: .44rem;
        line-height: .22rem;
        text-align: center;
        font-size: .24rem;
      }

      .diamond {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .26rem;
        img {
          width: .26rem;
          height: .23rem;
        }
      }
    }
  }
}
</style>