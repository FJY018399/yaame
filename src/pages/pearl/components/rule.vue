<template>
	<div class="rule">
    <!--返回栏-->
    <custom-header color="white">{{ $t('rules_rewards') }}</custom-header>

    <!--活动规则-->
    <div class="activity-rule">
      <div class="header">
        <span>{{ $t('rules_rewards') }}</span>
      </div>
      <p>{{ $t('rule_1') }}</p>
      <p>{{ $t('rule_2') }}</p>
      <p>{{ $t('rule_3') }}</p>
      <p>{{ $t('rule_4', { msg: regionId !== 'INDONESIA' ? 2 : 3 }) }}</p>
      <!--大区组别表格-->
      <div class="rule-table">
        <div v-for="(item, index) in ruleTableTwo" :key="index" class="table-item">
          <div v-for="(ele) in item">
            {{ ele }}
          </div>
        </div>
      </div>
      <p>{{ $t('rule_5') }}</p>
      <p>{{ $t('rule_6') }}</p>
      <p>{{ $t('rule_7') }}</p>
      <p>{{ $t('rule_8') }}</p>
    </div>

    <!--活动奖励-->
    <div class="activity-award">
      <div class="header">
        <span>{{ $t('making_example') }}</span>
      </div>
      <p>{{ $t('example_1') }}</p>
      <div class="award-item">
        <div class="frame">
          <div class="item" v-for="(item, index) in iconImg" :key="index">
            <div class="day">X{{ item.number }}</div>
            <img :src="item.icon" alt="">
            <span v-if="item < 6 && item !== 3">+</span>
          </div>
        </div>
        <div class="frame">
          <div class="item">
            <div class="day">X1</div>
            <img src="https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png" alt="">
            <span>=</span>
          </div>
        </div>
      </div>
      <p>{{ $t('example_2') }}</p>
      <div class="award-item">
        <div class="frame">
          <div class="item" v-for="(item, index) in iconImgTwo" :key="index">
            <div class="day">X{{ item.number }}</div>
            <img :src="item.icon" alt="">
            <span v-if="item < 6 && item !== 3">+</span>
          </div>
        </div>
        <div class="frame">
          <div class="item">
            <div class="day">X60</div>
            <img src="https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png" alt="">
            <span>=</span>
          </div>
        </div>
      </div>
    </div>

    <!--奖励规则-->
    <div class="award-rule">
      <div class="header">
        <span>{{ $t('ranking_rewards') }}</span>
      </div>
      <!--标题-->
      <div class="award-rule-head">
        <span></span>
        <div>{{ $t('making_ranking_rewards') }}</div>
        <span></span>
      </div>
      <p>{{ $t('top_20_rewards') }}</p>
      <div class="award-rule-table">
        <div v-for="(item, index) in ruleTableGive" :key="index" class="table-item">
          <div v-for="(ele, inx) in item" :key="inx">
            <img v-if="index && inx" src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ ele }}
          </div>
        </div>
      </div>
      <!--标题-->
      <div class="award-rule-head">
        <span></span>
        <div>{{ $t('collection_ranking_rewards') }}</div>
        <span></span>
      </div>
      <p>{{ $t('top_20_rewards') }}</p>
      <div class="award-rule-table">
        <div v-for="(item, index) in ruleTableHarvest" :key="index" class="table-item">
          <div v-for="(ele, inx) in item" :key="inx">
            <img v-if="index && inx" src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ ele }}
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import {getCurrentInstance, onActivated, ref} from "vue";
import {rankRuledApi} from "@/pages/pearl/api";
import {Toast} from "vant";
import {burialPointFun} from "@/lib/utils";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

let ruleTableTwo = ref([
  [
    'Level', 'Group 1', 'Group 2', 'Group 3',
  ], [
    t('making_ranking'), 'lv.0-5', 'lv.6-15', 'lv.15+',
  ], [
    t('collection_ranking'), 'lv.0-10', 'lv.11-20', 'lv.20+',
  ]
]);

// 收礼
let ruleTableHarvest = ref([
  [
    'Ranking', 'lv.0-10', 'lv.11-20', 'lv.20+',
  ], [
    'Top1', '800', '1000', '2000',
  ], [
    'Top2', '500', '800', '1000',
  ], [
    'Top3', '300', '500', '800',
  ], [
    'Top4-5', '100', '300', '500',
  ]
]);

// 送礼
let ruleTableGive = ref([
  [
    'Ranking', 'lv.0-5', 'lv.6-15', 'lv.15+',
  ], [
    'Top1', '1000', '1500', '3000',
  ], [
    'Top2', '500', '800', '2000',
  ], [
    'Top3', '300', '500', '1000',
  ], [
    'Top4-5', '100', '300', '800',
  ]
])


// 奖励图片
const iconImg = ref([
  {
    icon: 'https://yaame-static.yaame.io/admin/69120f51d11aa03903420a7432242afa.png',
    number: 1
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/34a6fddf46c4548619f017f83c5ece81.png',
    number: 1
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/aa52ef1a14c31f45c722cbcc6a7c2512.png',
    number: 1
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/a376dc1872e1d78bf55e6b11b067471c.png',
    number: 1
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/d9e08ac079ac26efab97010e4905438f.png',
    number: 1
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/5edbc42e730685f38de4320f433e463c.png',
    number: 1
  },
]);
const iconImgTwo = ref([
  {
    icon: 'https://yaame-static.yaame.io/admin/69120f51d11aa03903420a7432242afa.png',
    number: 100
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/34a6fddf46c4548619f017f83c5ece81.png',
    number: 100
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/aa52ef1a14c31f45c722cbcc6a7c2512.png',
    number: 100
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/a376dc1872e1d78bf55e6b11b067471c.png',
    number: 100
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/d9e08ac079ac26efab97010e4905438f.png',
    number: 100
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/5edbc42e730685f38de4320f433e463c.png',
    number: 60
  },
]);

const regionId = ref(null);

const homeData = async () => {
  try {
    const res = await rankRuledApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    regionId.value = res.data.region_id;
    if (res.data.region_id !== 'INDONESIA') {
      ruleTableGive.value = [
        [
          'Ranking', 'lv.0-5', 'lv.5+',
        ], [
          'Top1', '1000', '1500',
        ], [
          'Top2', '500', '800',
        ], [
          'Top3', '300', '500',
        ], [
          'Top4-5', '100', '300'
        ]
      ];
      ruleTableHarvest.value = [
        [
          'Ranking', 'lv.0-5', 'lv.5+',
        ], [
          'Top1', '800', '1000',
        ], [
          'Top2', '500', '800',
        ], [
          'Top3', '300', '500',
        ], [
          'Top4-5', '100', '300',
        ]
      ]
      ruleTableTwo.value = [
        [
          'Level', 'Group 1', 'Group 2',
        ], [
          t('making_ranking'), 'lv.0-5', 'lv.5+',
        ], [
          t('collection_ranking'), 'lv.0-5', 'lv.5+',
        ]
      ]
    }
  } catch (err) {
    console.log(err);
  }
}

onActivated(() => {
  // 埋点规则点击
  burialPointFun({
    event_name: "page_btn_click",
    cid: -1000,
    md: 2,
    args_name: "page_btn_click",
    args: {
      type: 'rules_rewards',
    },
  });
  homeData();
})
</script>

<style lang="less" scoped>
.rule {
  min-height: 100vh;
  overflow: hidden;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -0.51rem;
    left: 50%;
    transform: translateX(-50%);
    width: 3.38rem;
    height: 1.01rem;
    background: url("https://yaame-static.yaame.io/admin/e7e6ccb5032a962b4b4187f833b3329d.png") no-repeat;
    background-size: contain;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2.5rem;
      height: .52rem;
      font-weight: 600;
      font-size: .26rem;
      color: #FFFFFF;
      line-height: .26rem;
      text-align: center;
    }
  }

  .activity-rule {
    position: relative;
    width: 7rem;
    margin: 1.03rem auto .81rem;
    padding: .65rem .4rem .38rem;
    background: #265CC4;
    border-radius: .2rem;
    border: .02rem solid #7DD4FF;
    font-weight: 400;
    font-size: .24rem;
    color: #FFFFFF;

    .rule-table {
      width: 6.02rem;
      margin: .2rem auto;
      background: #1348AC;
      border-radius: .08rem;
      border: .01rem solid #5A90F6;
      font-size: .24rem;
      color: #FFFFFF;

      .table-item {
        display: flex;
        border-bottom: 0.01rem solid #5A90F6;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: .6rem;
          text-align: center;
          border-right: 0.01rem solid #5A90F6;
        }
        div:nth-child(1) {
          font-weight: 500;
          font-size: .2rem;
          color: #FFEA83;
          line-height: .22rem;
          flex: 1.1;
        }
        div:nth-child(4) {
          border: 0;
        }
      }
      .table-item:nth-child(3) {
        border: 0;
      }
    }
  }

  .activity-award {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 7rem;
    margin: 0 auto .81rem;
    padding: .68rem .42rem 0.34rem;
    background: #265CC4;
    border-radius: .2rem;
    border: .02rem solid #7DD4FF;

    p {
      width: 6.03rem;
      font-size: .24rem;
      color: #FFFFFF;
      text-align: center;
    }

    .award-item {
      display: flex;
      margin: .22rem auto;
      justify-content: space-between;
      position: relative;
      width: 6.15rem;
      height: 2.84rem;

      .frame {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        width: 4.48rem;
        height: 100%;
        .item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.2rem;
          height: 1.2rem;
          background: #1348AC;
          border-radius: .10rem;
          border: .01rem solid #5A90F6;

          .day {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            right: 0;
            width: .54rem;
            height: .2rem;
            background: #2E6BFF;
            border-radius: 0 .1rem 0 .1rem;
            text-align: center;
            font-size: .16rem;
            color: #FFFFFF;
          }
          img {
            width: .94rem;
            height: .94rem;
          }

          span {
            position: absolute;
            right: -.35rem;
            font-size: .3rem;
            font-weight: 600;
            color: #FFF;
          }
        }
      }

      .frame:nth-child(2) {
        display: flex;
        align-content: center;
        width: auto;
        span {
          left: -0.35rem;
        }
      }
    }
    .award-item:nth-child(3) {
      margin: .22rem auto .32rem;
    }
    .award-item:nth-child(5) {
      margin-top: .22rem;
      margin-bottom: 0;
    }
  }

  .award-rule {
    position: relative;
    width: 7rem;
    margin: 0 auto .37rem;
    padding-top: .65rem;
    background: #265CC4;
    border-radius: .2rem;
    border: .02rem solid #7DD4FF;

    p {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5.54rem;
      height: .6rem;
      margin: .25rem auto 0.24rem;
      font-weight: 400;
      font-size: .24rem;
      color: #FFFFFF;
      line-height: .3rem;
      text-align: center;
    }

    &-head {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: .61rem;
        height: .12rem;
        background-image: url("https://yaame-static.yaame.io/admin/13c62c4abda1c299c0b2d6fec31e46e4.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      span:nth-child(3) {
        background-image: url("https://yaame-static.yaame.io/admin/63ede40a8375aaaf072fd404898dc67c.png");
      }
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 26px;
        margin: 0 .16rem;
        font-weight: 500;
        font-size: .26rem;
        color: #FFFFFF;
      }
    }

    &-table {
      width: 6.05rem;
      margin: 0 auto .34rem;
      background: #1348AC;
      border-radius: .08rem;
      border: .01rem solid #5A90F6;
      font-size: .24rem;
      color: #FFFFFF;

      .table-item {
        display: flex;
        border-bottom: 0.01rem solid #5A90F6;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: .59rem;
          text-align: center;
          border-right: 0.01rem solid #5A90F6;
          img {
            width: .22rem;
            height: .19rem;
            margin-right: .04rem;
          }
        }
        div:nth-child(4) {
          border: 0;
        }
      }
      .table-item:nth-child(1) {
        div:nth-child(1) {
          color: #F3DC83;
        }
      }
      .table-item:nth-child(6) {
        border: 0;
      }
    }
  }
}
</style>