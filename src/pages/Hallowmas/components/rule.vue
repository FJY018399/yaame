<template>
  <div class="rule" ref="rule">
    <!--标题-->
    <custom-header class="header" color="white" :apparentTitle="$t('rule')" :headStyle="headStyle"
                   :dom-main="rule">
      <template v-slot:default>
        <div class="header-title">{{ $t('rule') }}</div>
      </template>
    </custom-header>
    <!-- tab -->
    <div class="secondary-tab">
      <div class="slide" :style="{ left: group === 'one' ? '0' : group === 'two' ? '2rem' : '4rem' }"></div>
      <div class="secondary-tabs" :class="{ 'secondary-tab-in': group === item.type }" v-for="(item, index) in tab"
           :key="index" @click="cutGroup(item.type)">{{ item.name }}
      </div>
    </div>
    <!-- 规则 -->
    <div v-show="group === 'one'" class="rule-table">
      <div class="top-head">{{ $t('rule') }}</div>
      <p>{{ $t('event_details_1') }}</p><br/>
      <p>{{ $t('event_details_2') }}</p><br/>
      <p>{{ $t('event_details_3') }}</p><br/>
      <p>{{ $t('event_details_4') }}</p><br/>
      <p>{{ $t('event_details_5') }}</p><br/>
      <p>{{ $t('event_details_6') }}</p><br/>
      <p>{{ $t('event_details_7') }}</p><br/>
      <p>{{ $t('event_details_8') }}</p>
    </div>
    <div v-show="group === 'two'" class="reward-info">{{ $t("top_10_rewards") }}</div>

    <div
      v-show="group === 'two'"
      v-for="(item, index) in anchorList"
      :key="index"
      class="reward-item-container"
    >
      <div class="item-header">
        Rank {{ index === 3 ? "4~5" : index === 4 ? "6~10" : index + 1 }}
      </div>
      <div class="reward-item-list">
        <div
          v-for="(ele, inx) in item.rank_rewards"
          :key="ele.reward_icon"
          class="reward-item-item"
        >
          <div class="img-div">
            <img :src="ele.reward_icon" alt="" />
            <div v-if="ele.object_type !== 'DIAMOND'" class="reward-text">
              {{ ele.subscript }}
            </div>
          </div>
          <div v-if="ele.object_type !== 'DIAMOND'" class="reward-name">
            {{ ele.reward_name }}
          </div>
          <div v-else class="diamond">
            <img
              src="https://static.yaame.io/imgs/b2be9d366045439b87f8e08f9341af71.png"
              alt=""
            />{{ ele.reward_diamond_worth }}
          </div>
        </div>
      </div>
    </div>

    <div v-show="group === 'three'" class="reward-info">{{ $t("top_10_rewards") }}</div>

    <div
      v-show="group === 'three'"
      v-for="(item, index) in audienceList"
      :key="'audience' + index"
      class="reward-item-container"
    >
      <div class="item-header">
        Rank {{ index === 3 ? "4~5" : index === 4 ? "6~10" : index + 1 }}
      </div>
      <div class="reward-item-list">
        <div
          v-for="(ele, inx) in item.rank_rewards"
          :key="ele.reward_icon"
          class="reward-item-item"
        >
          <div class="img-div">
            <img :style="{ height: ele.object_type === 'INCOME_RIBBON' ? 'auto' : '' }" :src="ele.reward_icon" alt="" />
            <div v-if="ele.object_type !== 'DIAMOND'" class="reward-text">
              {{ ele.subscript }}
            </div>
          </div>
          <div v-if="ele.object_type !== 'DIAMOND'" class="reward-name">
            {{ ele.reward_name }}
          </div>
          <div v-else class="diamond">
            <img
              src="https://static.yaame.io/imgs/b2be9d366045439b87f8e08f9341af71.png"
              alt=""
            />{{ ele.reward_diamond_worth }}
          </div>
        </div>
      </div>
    </div>

    <div v-show="group !== 'one'" class="rule-footer">{{ $t('top_1_reward') }}</div>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header.vue";
import {getCurrentInstance, onMounted, ref} from "vue";
import {getRankRewardApi} from "@/pages/Hallowmas/api";

// 获取国际化多语言
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};

// 传递dom
const rule = ref(null);
// 头部样式
const headStyle = ref({
  color: '#FFF !important',
  fontSize: '.32rem',
  fontWeight: '600',
})

// tab
let group = ref('one');
const tab = ref([
  {
    name: t('rule'),
    type: 'one',
  },
  {
    name: t('send_leaderboard'),
    type: 'two',
  },
  {
    name: t('receive_leaderboard'),
    type: 'three',
  }
]);
const cutGroup = (value) => {
  group.value = value;
}

const anchorList = ref([]);
const audienceList = ref([]);
// 获取页面数据
const getRuleData = async () => {
  try {
    const res = await getRankRewardApi();
    if (res.status !== 1000) return;
    anchorList.value = res.data.rank_reward_give_levels;
    audienceList.value = res.data.rank_reward_receive_levels;
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  getRuleData();
})
</script>

<style lang="less" scoped>
.rule {
  height: 100vh;
  overflow-y: auto;
  .header-title {
    font-size: .32rem;
    font-weight: 600;
  }
  .secondary-tab {
    position: relative;
    display: flex;
    margin: 2rem auto 0;
    width: 6rem;
    height: .68rem;
    font-weight: 500;
    font-size: .22rem;
    color: #DB9FFF;
    background: #6702A4;
    border-radius: .55rem;
    .slide {
      position: absolute;
      top: .02rem;
      width: 2rem;
      height: .64rem;
      background: linear-gradient( 0deg, #9402D6 0%, #E467FF 100%);
      border-radius: .45rem;
      transition-duration: .2s;
    }
    .secondary-tabs {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: .28rem;
      flex: 1;
    }
    .secondary-tab-in {
      color: #FFFFFF;
    }
  }
  .table {
    position: relative;
    width: 5.37rem;
    margin: .3rem 0 0 1.63rem;
    background: #3C1C11;
    border-radius: .07rem;
    border: .02rem solid #6A3A2B;
    font-weight: 400;
    font-size: .2rem;
    color: #FFD98D;
    .th {
      display: flex;
      div:nth-child(1) {
        width: .88rem;
        height: .52rem;
        line-height: .52rem;
        text-align: center;
        border-right: .02rem solid #6A3A2B;
      }
      div:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }
    }
    .tr {
      display: flex;
      border-top: .02rem solid #6A3A2B;
      .td:nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: .88rem;
        border-right: .02rem solid #6A3A2B;
      }
      .td:nth-child(2) {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .icon {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          padding: .14rem;
          border-right: .02rem solid #6A3A2B;
          .img {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: .90rem;
            height: .90rem;
            background: #6A3A2B;
            border-radius: .08rem;
            border: .01rem solid #FFD98D;
            img {
              width: .75rem;
              height: .75rem;
            }
            .day {
              display: flex;
              justify-content: center;
              //align-items: center;
              position: absolute;
              top: 0;
              right: 0;
              min-width: .52rem;
              min-height: .22rem;
              line-height: .2rem;
              background: url("https://yaame-static.yaame.io/admin/d75a55094ea1a4838a53e797e95616f9.png") no-repeat;
              background-size: 100% 100%;
              font-size: .16rem;
              color: #FFFFFF;
            }
          }
          .name {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.2rem;
            line-height: .19rem;
            margin-top: .08rem;
            font-weight: 400;
            font-size: .20rem;
            color: #FFD98D;
            text-align: center;
          }
        }
        .icon:nth-child(3n) {
          border-right: 0;
        }
        .icon:last-of-type {
          border-right: 0;
        }

        .flex {
          flex: 1;
        }

        .long {
          width: 1.48rem;
        }
        .fairly-long {
          width: 2.21rem;
        }
      }
    }

    .icon-frame {
      position: absolute;
      top: 50%;
      left: -1.42rem;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.26rem;
      height: 1.14rem;
      background: url("https://yaame-static.yaame.io/admin/d5e9eaa071d41c68eb25f2ad455ef251.png") no-repeat;
      background-size: contain;
      img {
        width: .8rem;
        height: .81rem;
      }
    }
  }

  .award {
    display: flex;
    justify-content: space-evenly;
    position: relative;
    margin: .59rem auto 0;
    width: 6.66rem;
    height: 3.81rem;
    padding-top: 1.27rem;
    background: url("https://yaame-static.yaame.io/admin/ebd263a903fa6236483b54194ea2ebf0.png") no-repeat;
    background-size: contain;

    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: .25rem;
      left: 50%;
      transform: translateX(-50%);
      width: 2.31rem;
      height: .49rem;
      font-weight: 600;
      font-size: .24rem;
      color: #FFEAC4;
      line-height: .24rem;
      text-align: center;
    }

    .list {
      width: 1.21rem;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.21rem;
        height: 1.21rem;
        background: url("https://yaame-static.yaame.io/admin/c092ed1fbb322a8f8b248201b3e57413.png") no-repeat;
        background-size: contain;
        img {
          width: .78rem;
          height: .78rem;
        }
      }
      .name {
        width: 1.2rem;
        margin: .16rem auto .08rem;
        line-height: .19rem;
        font-weight: 400;
        font-size: .20rem;
        color: #FFD98D;
        text-align: center;
      }
      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .22rem;
        color: #FFD98D;
        img {
          width: .22rem;
          height: .17rem;
        }
      }
    }
  }

  .rule-table {
    position: relative;
    width: 7rem;
    margin: 1.48rem auto 0;
    padding: .87rem .4rem 0.2rem;
    background: #58048E;
    border-radius: .2rem;
    border: .08rem solid #9964FF;
    font-weight: 400;
    font-size: .26rem;
    color: #FFFFFF;
    .bottom-head,
    .top-head {
      display: flex;
      justify-content: center;
      position: absolute;
      top: -0.7rem;
      left: 50%;
      transform: translateX(-50%);
      width: 6.13rem;
      height: 1.38rem;
      padding-top: .5rem;
      background: url("https://yaame-static.yaame.io/admin/bf3c38877f013a4f5c8d9f5df8e6cc0d.png") no-repeat;
      background-size: contain;
      font-weight: 600;
      font-size: .32rem;
      color: #A84F00;
    }
  }

  .reward-info {
    height: .36rem;
    margin: .65rem auto .28rem;
    font-weight: 400;
    font-size: .24rem;
    color: #FFFFFF;
    line-height: .36rem;
    text-align: center;
  }

  .reward-item-container {
    position: relative;
    width: 6.96rem;
    height: 3.49rem;
    padding-top: 1.17rem;
    margin: 0 auto .24rem;
    background: url("https://yaame-static.yaame.io/admin/c380dd7ab09f8c8a0af146d4b349d115.png") no-repeat;
    background-size: contain;
    .item-header {
      position: absolute;
      top: .33rem;
      left: 50%;
      transform: translateX(-50%);
      height: .45rem;
      font-weight: 600;
      font-size: .32rem;
      color: #A84F00;
      line-height: .45rem;
    }
    .reward-item-list {
      display: flex;
      justify-content: space-evenly;
      .reward-item-item {
        width: 1.4rem;
        .img-div {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.4rem;
          height: 1.4rem;
          background: #7305B7;
          border-radius: .16rem;
          border: .02rem solid #D092FF;
          .reward-text {
            position: absolute;
            top: 0;
            right: 0;
            min-width: .93rem;
            height: .33rem;
            padding: 0 .15rem;
            background: #EE42FF;
            border-radius: 0 .16rem 0 .16rem;
            font-size: .20rem;
            color: #FFFFFF;
          }
          img {
            width: 1rem;
            height: 1rem;
          }
        }
        .reward-name {
          margin-top: .1rem;
          font-size: .22rem;
          color: #FFFFFF;
          line-height: .22rem;
          text-align: center;
        }
        .diamond {
          display: flex;
          justify-content: center;
          align-items: center;
          height: .22rem;
          margin-top: .14rem;
          font-weight: normal;
          font-size: .22rem;
          color: #FFFFFF;
          img {
            width: .22rem;
            height: .19rem;
          }
        }
      }
    }
  }

  .rule-footer {
    width: 5.1rem;
    margin: .46rem auto .45rem;
    font-weight: 400;
    font-size: .24rem;
    color: #FFFFFF;
    line-height: .36rem;
    text-align: center;
  }
}
</style>