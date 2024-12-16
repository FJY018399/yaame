<!--
 * @Author: Elk
 * @Date: 2023-05-29 16:42:54
 * @FilePath: /yaame-h5/src/pages/myReward/myReward.vue
 * @Description: 
-->
<template>
  <div class="reward">
    <refresh
        ref="wlRefresh"
        style="min-height: 100vh"
        @onRefresh="handleRefresh"
    >
      <div :style="{ width: isNew ? '4.94rem' : '3.34rem' }" class="tabs">
        <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab', { active: activeTab === index }]"
            @click="activateTab(index, tab)"
        >
          {{ $t(tab) }}
        </div>
      </div>

      <div class="my-wealth">
        <div class="my-title">{{ title }}</div>
        <div class="my-num">{{ myMoney }}</div>
      </div>
      <!-- 冻结钻石 -->
      <div v-show="identification === 'diamonds' && freeze_diamond_amount" class="my-wealth">
        <div class="my-title">{{ $t('frozen_diamonds') }}</div>
        <div class="my-num">{{ freeze_diamond_amount }}</div>
      </div>
      <!-- 冻结金币 -->
      <div v-show="identification === 'poins' && freeze_coin_amount" class="my-wealth">
        <div class="my-title">{{ $t('frozen_coins') }}</div>
        <div class="my-num">{{ freeze_coin_amount }}</div>
      </div>

      <!-- 明细 -->
      <div class="detail">{{
          identification === 'diamonds' ? $t('diamond_details') : identification === 'crystal' ? $t('crystal_details') : identification === 'poins' ? $t('gold_details') : ''
        }}
      </div>

      <div class="list">
        <ul
            v-infinite-scroll="loadMore"
            v-if="list && list.length"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            class="reward-list"
        >
          <li v-for="(item, index) in list" :key="index" class="reward-item">
            <div v-if="!item.flow_user" class="no-branch">
              <div>
                <p class="task-name">{{ item.title }}</p>
                <p class="time">{{ formatDate(item.create_time) }}</p>
              </div>
              <span>{{ item.amount_show }}</span>
            </div>

            <div v-else class="reward-item-one">
              <div class="my-list">
                <!--头像信息-->
                <div class="head no-wrap">
                  <img :src="item.flow_user.avatar" alt="">
                  <div class="name no-wrap">{{ item.flow_user.nick_name }}</div>
                  <div class="id">ID：{{ item.flow_user.yaame_id }}</div>
                </div>
                <!--金币数量-->
                <div class="money-number">
                  <img src="https://yaame-static.yaame.io/admin/38e41fe19b8f1ba7c29325e797aeb461.png" alt="">
                  {{ item.amount_show }}
                </div>
              </div>
              <div class="time">
                <div class="time-number">{{ formatDate(item.create_time) }}</div>
                <div class="gold" :class="{'income': item.amount_show > 0}">
                  {{ item.amount_show > 0 ? $t('receive_gold') : $t('transfer_gold') }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </refresh>
  </div>
</template>
<script>
import refresh from "../../components/common/refresh.vue";
import customHeader from "../../components/common/header.vue";
import commonButton from "../../components/common/button.vue";
import Toast from "../../components/third/toast/toast.js";
import request from "../../lib/request/diamond";
import wl_request from "../../lib/request/withdraw";
import {
  isIOS,
  isPeanut,
  getAppType,
  getVerCode,
  getChannel,
  getLanguage,
  getXVerCode,
} from "../../lib/device";
import define from "../../lib/define.js";
import {
  isEmpty,
  fomatFloat,
  getQueryString,
  formatDate,
} from "../../lib/utils.js";
import diamond from "../../lib/request/diamond";

export default {
  components: {
    customHeader,
    refresh,
    commonButton,
  },
  data() {
    return {
      p_index: 1,
      p_size: 20,

      active: "diamonds",

      activeTab: 0,
      // 标识当前tab
      identification: '',
      // tabs: ["diamonds", "crystal", "poins"],
      tabs: ["diamonds", "poins"],

      has_next: true,

      list: [],

      diamond: 0,
      money: 0,
      crystal: 0,

      freeze_diamond_amount: 0,
      freeze_coin_amount: 0
    };
  },
  computed: {
    title() {
      if (getXVerCode() >= 11300) {
        if (this.activeTab === 0) {
          return this.$t('diamonds')
        } else if (this.activeTab === 1) {
          return this.$t('crystal')
        } else {
          return this.$t('poins')
        }
      } else {
        if (this.activeTab === 0) {
          return this.$t('diamonds')
        } else {
          return this.$t('poins')
        }
      }

    },
    isNew() {
      return getXVerCode() >= 11300;
    },
    myMoney() {
      if (getVerCode() >= 11300) {
        if (this.activeTab === 0) {
          return this.diamond;
        } else if (this.activeTab === 1) {
          return this.crystal;
        } else {
          return this.money;
        }
      } else {
        if (this.activeTab === 0) {
          return this.diamond;
        } else {
          return this.money;
        }
      }
    }
  },
  async created() {
    document.title = this.$t('historicalRecords');

    if (getXVerCode() >= 11300) {
      this.tabs = ["diamonds", "crystal", "poins"];
    } else {
      this.tabs = ["diamonds", "poins"];
    }


    await this.getAccountInfo();
    // await this.getMoney();

    // 获取默认tab
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tab')) {  // 有tab参数请求金币
      if (getXVerCode() >= 11300) {
        this.activateTab(Number(urlParams.get('tab')) + 1, 'poins'); // 跳转金币tab
      } else {
        this.activateTab(Number(urlParams.get('tab')), 'diamonds'); // 跳转钻石
      }
    } else { // 无参请求钻石
      this.activateTab(Number(urlParams.get('tab')), 'diamonds');
    }
  },
  mounted() {
    document.title = this.$t('historicalRecords');
  },
  methods: {
    activateTab(index, tab) {
      this.activeTab = index;
      this.identification = tab;
      this.p_index = 1;
      if (this.isNew) {
        if (index === 0) {
          this.getDiamond()
        } else if (index === 1) {
          this.getCrystal();
        } else {
          this.getMoney();
        }
      } else {
        if (index === 0) {
          this.getDiamond()
        } else {
          this.getMoney();
        }
      }
    },
    // 页面初始 加载账户信息
    async getAccountInfo() {
      let res = await wl_request.getAccountInfo(this.p_index, this.p_size);
      if (res.status === 1000) {
        this.diamond = res.data.diamond;
        this.money = res.data.money;
        this.crystal = res.data.crystal_balance || 0;
        this.freeze_diamond_amount = res.data.freeze_diamond_amount || 0;
        this.freeze_coin_amount = res.data.freeze_coin_amount || 0;
      }
    },

    async getDiamond() {
      let res = await request.getDiamondList(this.p_index, this.p_size);
      if (this.p_index === 1) {
        this.list = [];
      }
      if (res.status === 1000) {
        if (res.data.content && res.data.content.length) {
          this.list = this.list.concat(res.data.content);
        }
        this.has_next = res.data.has_next;
      }
    },

    async getMoney() {
      let res = await request.getMoneyList(this.p_index, this.p_size);
      if (this.p_index === 1) {
        this.list = [];
      }
      if (res.status === 1000) {
        if (res.data.content && res.data.content.length) {
          this.list = this.list.concat(res.data.content);
        }
        this.has_next = res.data.has_next;
      }
    },

    async getCrystal() {
      let res = await request.getCrystalList(this.p_index, this.p_size);
      if (this.p_index === 1) {
        this.list = [];
      }
      if (res.status === 1000) {
        if (res.data.content && res.data.content.length) {
          this.list = this.list.concat(res.data.content);
        }
        this.has_next = res.data.has_next;
      }
    },

    loadMore() {
      if (this.has_next) {
        this.p_index++;
        this.getAccountInfo();
        if (this.isNew) {
          if (this.activeTab === 0) {
            this.getDiamond();
          } else if (this.activeTab === 1) {
            this.getCrystal();
          } else {
            this.getMoney();
          }
        } else {
          if (this.activeTab === 0) {
            this.getDiamond();
          } else {
            this.getMoney();
          }
        }
      }
    },
    async handleRefresh() {
      this.p_index = 1;
      await this.getAccountInfo();
      setTimeout(() => {
        this.$refs.wlRefresh.isLoading = false;
      }, 500);
    },
    formatDate(timestamp) {
      return formatDate(timestamp, "yyyy.MM.dd hh:mm");
    },
    computedValue(item) {
      if (item.money) {
        return item.money > 0 ? '+' + item.money : item.money
      } else {
        return item.diamond > 0 ? '+' + item.diamond : item.diamond
      }
    },
  },
};
</script>
<style lang="less" scoped>
.reward {
  font-size: 0.32rem;
  color: #1b1b1b;
  padding-top: 0.2rem;

  .tabs {
    width: 3.34rem;
    height: 0.68rem;
    background: #e9eff4;
    border-radius: 0.34rem;
    display: flex;
    overflow: hidden;
    padding: 0.08rem;
    justify-content: space-between;
    margin: 0 auto;

    .tab {
      width: 1.59rem;
      height: 0.52rem;
      background: #e9eff4;
      border-radius: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: #ffffff;
      }
    }
  }

  .my-wealth {
    width: 6.9rem;
    height: 1.28rem;
    background: #ffffff;
    border-radius: 0.24rem;
    margin: 0.3rem auto 0;
    line-height: 1.28rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    .my-title {
      display: inline-block;
      width: 2rem;
      margin-left: 0.3rem;
      font-size: 0.3rem;
      font-weight: 500;
      color: #393939;
      text-align: left;
      white-space: nowrap;
    }

    .my-num {
      display: inline-block;
      width: 4rem;
      margin-right: 0.4rem;
      font-size: 0.6rem;
      font-weight: bold;
      color: #393939;
      text-align: right;
    }
  }

  .detail {
    height: .3rem;
    margin: .66rem 0 0.3rem .3rem;
    font-weight: 500;
    font-size: .3rem;
    color: #999999;
    line-height: .3rem;
  }

  .list {
    width: 7.5rem;
    height: 75vh;
    padding: 0.3rem;
    padding-top: 0;
    overflow-y: scroll;

    .reward-list {
      margin-top: 0.1rem;
      padding-bottom: 0.01rem;

      .reward-item {
        .no-branch {
          width: 6.9rem;
          min-height: 1.28rem;
          background: #ffffff;
          border-radius: 0.24rem;
          margin-bottom: 0.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 0.3rem;

          .task-name {
            font-size: 0.34rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #393939;
          }

          .time {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }

          span {
            font-size: 0.52rem;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #393939;
          }
        }

        .reward-item-one {
          width: 6.9rem;
          height: 2.34rem;
          padding: 0 .3rem;
          background: #FFFFFF;
          border-radius: .24rem;
          margin-bottom: 0.2rem;

          .my-list {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 1.31rem;
            border-bottom: .01rem solid #E1E1E1;

            .head {
              position: relative;
              display: flex;
              flex: 1;
              width: 100%;

              img {
                width: .8rem;
                height: .8rem;
                border-radius: .14rem;
              }

              .name {
                height: .42rem;
                margin: 0 .24rem;
                line-height: .42rem;
                font-weight: 600;
                font-size: .3rem;
                color: #333333;
              }

              .id {
                position: absolute;
                left: 1.04rem;
                top: .49rem;
                height: .3rem;
                font-weight: 600;
                font-size: .22rem;
                color: #666666;
                line-height: .3rem;
              }
            }

            .money-number {
              display: flex;
              align-items: baseline;
              height: .52rem;
              font-weight: bold;
              font-size: .4rem;
              color: #393939;
              line-height: .52rem;

              img {
                width: .36rem;
                height: .36rem;
                margin-right: .11rem;
              }
            }
          }

          .time {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 1.02rem;

            .time-number {
              height: .26rem;
              line-height: .26rem;
              font-size: .26rem;
              color: #999999;
            }

            .gold {
              display: flex;
              justify-content: center;
              align-items: center;
              min-width: 1.32rem;
              height: .52rem;
              background: #E5FFE3;
              border-radius: .26rem;
              font-size: .22rem;
              color: #4B8247;
              padding: 0 .22rem;
            }

            .income {
              background: #FFF6EC;
              color: #B6793B;
            }
          }
        }
      }
    }
  }
}
</style>
