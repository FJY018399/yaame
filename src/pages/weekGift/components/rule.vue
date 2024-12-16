<template>
	<div class="rule" ref="rule">
    <!--标题-->
    <custom-header class="header" color="white" :apparentTitle="$t('rules_rewards')" :headStyle="headStyle" :dom-main="rule">
      <template v-slot:default>
        <div class="header-title">{{ $t('rules_rewards') }}</div>
      </template>
    </custom-header>
    <!-- tab -->
    <div class="secondary-tab">
      <div class="slide" :style="{ left: group === 'one' ? '0' : group === 'SEND_GIFT' ? '2rem' : '4rem' }"></div>
      <div class="secondary-tabs" :class="{ 'secondary-tab-in': group === item.type }" v-for="(item, index) in tab" :key="index" @click="cutGroup(item.type)">{{ item.name }}</div>
    </div>
    <!-- 规则 -->
    <div v-show="group === 'one'" class="award">
      <div class="head">{{ $t('current_week_star_gift') }}</div>
      <div class="list" v-for="(item, index) in giftList" :key="index">
        <div class="icon">
          <img :src="item.gift_info.reward_icon" alt="">
        </div>
        <div class="name">{{ item.gift_info.reward_name }}</div>
        <div class="number">
          <img src="https://yaame-static.yaame.io/admin/142c03687b998ada7722b64102c439d0.png" alt="">
          {{ item.gift_info.reward_diamond_worth }}
        </div>
      </div>
    </div>
    <div v-show="group === 'one'" class="rule-table">
      <div class="top-head"></div>
      <p>{{ $t('rule_1') }}</p><br/>
      <p>{{ $t('rule_2') }}</p><br/>
      <p>{{ $t('rule_3') }}</p><br/>
      <p>{{ $t('rule_4') }}</p><br/>
      <p>{{ $t('rule_5') }}</p><br/>
      <p>{{ $t('rule_6') }}</p><br/>
      <p>{{ $t('rule_7') }}</p><br/>
      <p>{{ $t('rule_8') }}</p>
      <div class="bottom-head"></div>
    </div>
    <!-- 周星展示 -->
    <div v-show="group === 'SEND_GIFT'" class="table" v-for="(item, index) in giftList" :key="index">
      <div class="th">
        <div>Rank</div>
        <div>{{ $t('rewards') }}</div>
      </div>
      <div class="tr" :style="{ borderTop: '.02rem solid #6A3A2B' }" v-for="(ite, inx) in item.receive_gift_level" :key="inx">
        <div class="td">TOP{{ inx + 1 }}</div>
        <div class="td">
          <div class="icon" :class="ite.rewards.length < 3 ? 'flex' : ''" :style="getClass(ite.rewards.length, number)" v-for="(key, number) in ite.rewards" :key="number">
            <div class="img">
              <img :src="key.reward_icon" alt="">
              <div v-if="key.subscript" class="day">{{ key.subscript }}</div>
            </div>
            <div class="name">{{ key.reward_name }}</div>
          </div>
        </div>
      </div>
      <div class="icon-frame">
        <img :src="item.gift_info.reward_icon" alt="">
      </div>
    </div>
    <!-- 贡献展示 -->
    <div v-show="group === 'RECEIVE_GIFT'" class="table" v-for="(item, index) in giftList" :key="index + 4">
      <div class="th">
        <div>Rank</div>
        <div>{{ $t('rewards') }}</div>
      </div>
      <div class="tr" :style="{ borderTop: '.02rem solid #6A3A2B' }" v-for="(ite, inx) in item.send_gift_level" :key="inx">
        <div class="td">TOP{{ inx + 1 }}</div>
        <div class="td">
          <div class="icon" :class="ite.rewards.length < 3 ? 'flex' : ''" :style="getClass(ite.rewards.length, number)" v-for="(key, number) in ite.rewards" :key="number">
            <div class="img">
              <img :src="key.reward_icon" alt="">
              <div v-if="key.subscript" class="day">{{ key.subscript }}</div>
            </div>
            <div class="name">{{ key.reward_name }}</div>
          </div>
        </div>
      </div>
      <div class="icon-frame">
        <img :src="item.gift_info.reward_icon" alt="">
      </div>
    </div>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header.vue";
import {getCurrentInstance, onMounted, ref} from "vue";
import {taskReceiveApi} from "@/pages/weekGift/api";

// 获取国际化多语言
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};

// 当前活动周期
const weekCycle = ref((new URLSearchParams(window.location.search).get("type")) || false);

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
    name: t('rules'),
    type: 'one',
  },
  {
    name: t('weekly_star_rewards'),
    type: 'SEND_GIFT',
  },
  {
    name: t('contribution_rewards'),
    type: 'RECEIVE_GIFT',
  }
]);
const cutGroup = (value) => {
  group.value = value;
}

const giftList = ref([]);
// 获取页面数据
const getRuleData = async () => {
  try {
    let res = null;
    if (weekCycle.value) res = await taskReceiveApi({weekCycle: weekCycle.value});
    else res = await taskReceiveApi({});
    if (res.status !== 1000) return;
    giftList.value = res.data.reward_levels;
  } catch (err) {
    console.log(err);
  }
}
// 计算当前类名
const getClass = (length, index) => {
  let surplus = length % 3;
  if (length < 3) return;
  if (index < 3) {
    return { width: '1.48rem' }
  }
  if (surplus === 1) return {width: '4.48rem', 'border-top': '.02rem solid #6A3A2B'}
  else if (surplus === 2) return {width: '2.21rem', 'border-top': '.02rem solid #6A3A2B'}
  if (!surplus) return { width: '1.48rem' }
}
onMounted(() => {
  getRuleData();
})
</script>

<style lang="less" scoped>
.rule {
  height: 100vh;
  padding-bottom: .49rem;
  overflow-y: auto;
  .header-title {
    font-size: .32rem;
    font-weight: 600;
  }
  .secondary-tab {
    position: relative;
    display: flex;
    margin: 2rem auto 0.32rem;
    width: 6rem;
    height: .68rem;
    font-weight: 500;
    font-size: .22rem;
    color: #FFCEA0;
    background: #563125;
    border-radius: .55rem;
    .slide {
      position: absolute;
      top: .02rem;
      width: 2rem;
      height: .64rem;
      background: linear-gradient( 0deg, #E77C04 0%, #FFBE72 100%);
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
      color: #702121;
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
    width: 6.46rem;
    margin: .63rem auto 0;
    padding: .35rem;
    background: #5C3224;
    border-radius: .06rem;
    border: .02rem solid #F0AE4B;
    font-weight: 400;
    font-size: .22rem;
    color: #FFD98D;
    .bottom-head,
    .top-head {
      position: absolute;
      top: -.29rem;
      left: 50%;
      transform: translateX(-50%);
      width: 6.5rem;
      height: .5rem;
      background: url("https://yaame-static.yaame.io/admin/df835be08b655d817cb561ea0b91563a.png") no-repeat;
      background-size: contain;
    }
    .bottom-head {
      top: auto;
      bottom: -.25rem;
      transform: rotate(180deg) translateX(50%);
    }
  }
}
</style>