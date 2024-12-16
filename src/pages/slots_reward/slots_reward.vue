<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-09-04 18:46:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-28 11:44:21
 * @Description: slots rank rewards
-->
<template>
  <div
    :style="{ paddingTop: safe_height + 1.08 + 'rem' }"
    :class="['main', 'main-' + language]"
  >
    <Header :title="html_title" :keep="false" color="white"></Header>

    <div class="content">
      <img
        class="title"
        :src="icon_options.page_2_1_slots_champion_reward"
        alt=""
      />

      <div class="list">
        <div
          v-for="(item, k) in reward_item_group_list"
          :key="'list' + k"
          class="item"
        >
          <div class="item-title">
            {{ $t(k === 2 ? 'st-3' : k === 1 ? 'st-2' : 'st-1') }}
          </div>
          <div class="item-reward-box">
            <div
              v-for="(it, j) in item.reward_item_vo_list"
              :key="'rewards' + j"
              class="item-reward"
            >
              <div class="icon-box">
                <img :src="it.icon" alt="" />
              </div>
              <div class="name">
                {{ it.reward_name }}
              </div>
              <div class="day">
                {{ it.reward_desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rule">
      <div class="rule-title">
        <img :src="icon_options.page_2_2_slots_rules" alt="" />
      </div>
      <p>{{ $t('desc-1') }}</p>
      <p>{{ $t('desc-2') }}</p>
      <p>{{ $t('desc-3') }}</p>
      <p>{{ $t('desc-4') }}</p>
    </div>
  </div>
</template>
<script>
import request from '../../lib/request/activity.js';
import { formatDate, formatDateString, sleep, isEmpty } from '../../lib/utils';
import Toast from '../../components/third/toast/toast';
import { local_storage } from '../../lib/storage';
import { getSafeHeight, getLanguage } from '../../lib/device';
import moment from 'moment';
import Header from '@/components/common/header.vue';

const getSAIcon = () => {
  return {
    reward_icon:
      'http://imgcom.static.suishenyun.net/ayu_jiangli@3x-788be2.png', // 奖励
    // page_1
    page_1_1_last_week_title:
      'http://imgcom.static.suishenyun.net/ayu_page1_1@3x-52e29b.png', // 上次的大赢家
    page_1_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/ayu_page1_2@3x-37a032.png', // slots冠军奖励
    page_1_3_this_week_champion:
      'http://imgcom.static.suishenyun.net/ayu_page1_3@3x-49bbc7.png', // 本周冠军
    // page_2
    page_2_1_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/ayu_page2_1@3x-08809c.png', //slots冠军奖励
    page_2_2_slots_rules:
      'http://imgcom.static.suishenyun.net/ayu_page2_2@3x-dba1cb.png', // slots活动规则
    // page_3
    page_3_1_end_title:
      'http://imgcom.static.suishenyun.net/ayu_page3_1@3x-93d24e.png', // 活动已结束
    page_3_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/ayu_page3_2@3x-749f7d.png', // slots冠军奖励
  };
};

const getTWIcon = () => {
  return {
    reward_icon:
      'http://imgcom.static.suishenyun.net/fanti_jiangli@3x-98b019.png', // 奖励
    // page_1
    page_1_1_last_week_title:
      'http://imgcom.static.suishenyun.net/fanti_page1_1@3x-63ba17.png', // 上次的大赢家
    page_1_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/fanti_page1_2@3x-91b8f1.png', // slots冠军奖励
    page_1_3_this_week_champion:
      'http://imgcom.static.suishenyun.net/fanti_page1_3@3x-cc7727.png', // 本周冠军
    // page_2
    page_2_1_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/fanti_page2_1@3x-0eba33.png', //slots冠军奖励
    page_2_2_slots_rules:
      'http://imgcom.static.suishenyun.net/fanti_page2_2@3x-121956.png', // slots活动规则
    // page_3
    page_3_1_end_title:
      'http://imgcom.static.suishenyun.net/fanti_page3_1@3x-653d67.png', // 活动已结束
    page_3_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/fanti_page3_2@3x-9361b0.png', // slots冠军奖励
  };
};

const getUSIcon = () => {
  return {
    reward_icon:
      'http://imgcom.static.suishenyun.net/yingyu_jiangli@3x-55c670.png', // 奖励
    // page_1
    page_1_1_last_week_title:
      'http://imgcom.static.suishenyun.net/yingyu_page1_1@3x-97405c.png', // 上次的大赢家
    page_1_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yingyu_page1_2@3x-2c430f.png', // slots冠军奖励
    page_1_3_this_week_champion:
      'http://imgcom.static.suishenyun.net/yingyu_page1_3@3x-24f850.png', // 本周冠军
    // page_2
    page_2_1_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yingyu_page2_1@3x-dda0ea.png', //slots冠军奖励
    page_2_2_slots_rules:
      'http://imgcom.static.suishenyun.net/yingyu_page2_2@3x-87c3f5.png', // slots活动规则
    // page_3
    page_3_1_end_title:
      'http://imgcom.static.suishenyun.net/yingyu_page3_1@3x-82492c.png', // 活动已结束
    page_3_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yingyu_page3_2@3x-3aaa50.png', // slots冠军奖励
  };
};

const getIDIcon = () => {
  return {
    reward_icon:
      'http://imgcom.static.suishenyun.net/yinni_jiangli@3x-83e2a0.png', // 奖励
    // page_1
    page_1_1_last_week_title:
      'http://imgcom.static.suishenyun.net/yinni_page1_1@3x-c1cc51.png', // 上次的大赢家
    page_1_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yinni_page1_1@3x-c1cc51.png', // slots冠军奖励
    page_1_3_this_week_champion:
      'http://imgcom.static.suishenyun.net/yinni_page1_3@3x-006d17.png', // 本周冠军
    // page_2
    page_2_1_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yinni_page2_1@3x-89b696.png', //slots冠军奖励
    page_2_2_slots_rules:
      'http://imgcom.static.suishenyun.net/yinni_page2_2@3x-358ddf.png', // slots活动规则
    // page_3
    page_3_1_end_title:
      'http://imgcom.static.suishenyun.net/yinni_page3_1@3x-201bda.png', // 活动已结束
    page_3_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/yinni_page3_2@3x-c12df2.png', // slots冠军奖励
  };
};

const getCNIcon = () => {
  return {
    reward_icon:
      'http://imgcom.static.suishenyun.net/jianti_jiangli@3x-bb21d8.png', // 奖励
    // page_1
    page_1_1_last_week_title:
      'http://imgcom.static.suishenyun.net/jianti_page1_1@3x-15c9c6.png', // 上次的大赢家
    page_1_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/jianti_page1_2@3x-ba69c3.png', // slots冠军奖励
    page_1_3_this_week_champion:
      'http://imgcom.static.suishenyun.net/jianti_page1_3@3x-9388b2.png', // 本周冠军
    // page_2
    page_2_1_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/jianti_page2_1@3x-585c4c.png', //slots冠军奖励
    page_2_2_slots_rules:
      'http://imgcom.static.suishenyun.net/jianti_page2_2@3x-0d1a88.png', // slots活动规则
    // page_3
    page_3_1_end_title:
      'http://imgcom.static.suishenyun.net/jianti_page3_1@3x-af7d62.png', // 活动已结束
    page_3_2_slots_champion_reward:
      'http://imgcom.static.suishenyun.net/jianti_page3_2@3x-75972d.png', // slots冠军奖励
  };
};
export default {
  components: {
    popup: () => import('../../components/common/pop_up.vue'),
    Header,
  },
  data() {
    return {
      language: getLanguage() || 'en',
      reward_item_group_list: [],
      icon_options: {},
      html_title: '',
      safe_height: 0,
    };
  },
  computed: {},
  created() {
    let safe_area = getSafeHeight() || 0;
    this.safe_height = (safe_area * 2) / 100;
    if (this.language === 'en') {
      this.icon_options = { ...{}, ...getUSIcon() };
      this.html_title = 'Event Prizes';
    } else if (this.language === 'id') {
      this.icon_options = { ...{}, ...getIDIcon() };
      this.html_title = 'Hadiah Acara';
    } else if (['zh-cn', 'zh', 'zh_cn'].includes(this.language)) {
      this.icon_options = { ...{}, ...getCNIcon() };
      this.html_title = '活动奖品';
    } else if (this.language === 'tw') {
      this.icon_options = { ...{}, ...getTWIcon() };
      this.html_title = '活動獎品';
    } else {
      this.icon_options = { ...{}, ...getSAIcon() };
      this.html_title = 'جوائز الحدث';
    }
    document.title = this.html_title;
  },
  mounted() {
    this.getRewardList();
  },
  methods: {
    async getRewardList() {
      const { status, data } = await request.getSlotsRewardList();
      if (status !== 1000) return;
      this.reward_item_group_list = data.reward_item_group_list;
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  width: 7.5rem;
  min-height: 100vh;
  background-image: url('http://imgcom.static.suishenyun.net/img_head_bg%20(1)-abbd70.png');
  background-size: 7.5rem 6.89rem;
  background-repeat: no-repeat;
  position: relative;
  background-color: #350d86;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.2rem;
  .content {
    width: 7.1rem;
    min-height: 12.49rem;
    background: #592db4;
    border-radius: 0.16rem;
    border: 0.02rem solid #7a50d0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      .item {
        width: 6.7rem;
        height: 3.63rem;
        background: #592db4;
        border-radius: 0.16rem;
        border: 0.02rem solid #7a50d0;
        margin-bottom: 0.2rem;
        .item-title {
          margin: 0.2rem auto;
          width: 100%;
          text-align: center;
          height: 0.4rem;
          font-size: 0.28rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #e5d9ff;
          line-height: 0.4rem;
        }
        .item-reward-box {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .item-reward {
            margin: 0 0.15rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .icon-box {
              width: 1.8rem;
              height: 1.8rem;
              background: #ffffff1a;
              border-radius: 0.18rem;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 1.2rem;
                height: 1.2rem;
              }
            }
            .name {
              height: 0.24rem;
              font-size: 0.24rem;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 0.24rem;
              margin-top: 0.16rem;
            }

            .day {
              height: 0.24rem;
              font-size: 0.24rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fffc;
              line-height: 0.24rem;
              margin-top: 0.1rem;
            }
          }
        }
      }
    }
  }
  .title {
    height: 0.54rem;
    width: 5.6rem;
    margin: 0.24rem auto;
  }

  .rule {
    width: 7.1rem;
    min-height: 3.3rem;
    background: #592db4;
    border-radius: 0.16rem;
    border: 0.02rem solid #7a50d0;
    margin-top: 0.2rem;
    margin-bottom: 0.5rem;
    font-size: 0.24rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #e5d9ff;
    line-height: 0.4rem;
    padding: 0 0.2rem 0.2rem;
    .rule-title {
      width: 100%;
      height: 0.54rem;
      text-align: center;
      margin: 0.24rem auto;
      img {
        width: 5.6rem;
        height: 100%;
      }
    }
  }
}
</style>
