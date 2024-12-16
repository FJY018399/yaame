<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-09-04 10:47:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-28 11:44:16
 * @Description: slots rank list
-->
<template>
  <div
    :style="{ paddingTop: safe_height + 1.08 + 'rem' }"
    :class="['main', 'main-' + language]"
  >
    <Header :title="html_title" :keep="false" color="white"></Header>
    <img
      @click="jumpRewardPage()"
      class="gift-icon"
      :style="{
        top:
          scroll_dis > 0
            ? safe_height + 1.08 + 'rem'
            : !safe_height
            ? '0.38rem'
            : safe_height + 1.08 + 'rem',
      }"
      :src="icon_options.reward_icon"
      alt=""
    />
    <div class="slot-title">
      <img
        src="http://imgcom.static.suishenyun.net/img_slots-144e62.png"
        alt=""
      />
    </div>
    <div
      v-if="last_champion_list.length"
      :class="[is_end ? 'end-title' : 'date-title']"
    >
      <img
        :src="
          is_end
            ? icon_options.page_3_1_end_title
            : icon_options.page_1_1_last_week_title
        "
        alt=""
      />
    </div>
    <!-- 前三名 -->
    <div v-if="last_champion_list.length" class="rank-three-box">
      <!-- 第二名 v-if="second.subject_id" -->
      <div
        :class="[
          'second',
          'rank-2',
          'three-common',
          'second-right',
          second.subject_id ? '' : 'no-show',
        ]"
      >
        <div class="avatar-box">
          <img :src="avatar_2" class="crown-icon" alt="" />
          <img :src="second.subject_icon" class="user-avatar avatar-2" alt="" />
        </div>
        <div class="nick-box">
          {{ second.subject_name }}
        </div>
        <div class="id-box">ID:{{ second.peanut_id }}</div>
        <div class="diamond-box">
          <img
            src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
            alt=""
          />
          {{ second.income_diamonds }}
        </div>
      </div>

      <!-- 第一名  v-if="first.subject_id" -->
      <div
        :class="[
          'first',
          'rank-1',
          'three-common',
          'first-left',
          first.subject_id ? '' : 'no-show',
        ]"
      >
        <div class="avatar-box">
          <img :src="avatar_1" class="crown-icon" alt="" />
          <img :src="first.subject_icon" class="user-avatar avatar-1" alt="" />
        </div>
        <div class="nick-box">
          {{ first.subject_name }}
        </div>
        <div class="id-box">ID:{{ first.peanut_id }}</div>
        <div class="diamond-box">
          <img
            src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
            alt=""
          />
          {{ first.income_diamonds }}
        </div>
      </div>

      <div
        :class="[
          'third',
          'rank-3',
          'three-common',
          'third-left',
          third.subject_id ? '' : 'no-show',
        ]"
      >
        <div class="avatar-box">
          <img :src="avatar_3" class="crown-icon" alt="" />
          <img :src="third.subject_icon" class="user-avatar avatar-3" alt="" />
        </div>
        <div class="nick-box">
          {{ third.subject_name }}
        </div>
        <div class="id-box">ID:{{ third.peanut_id }}</div>
        <div class="diamond-box">
          <img
            src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
            alt=""
          />
          {{ third.income_diamonds }}
        </div>
      </div>
    </div>
    <!-- reward -->
    <div v-if="!is_end" class="reward-box">
      <img
        class="reward-title"
        :src="icon_options.page_1_2_slots_champion_reward"
        alt=""
      />
      <div @click="jumpRewardPage()" class="right-arrow">
        <span>{{ $t('more-btn') }}</span>
        <img
          src="http://imgcom.static.suishenyun.net/icon_arrow-794637.png"
          alt=""
        />
      </div>
      <div class="reward-list">
        <div
          v-for="(item, k) in show_list"
          :key="'reward' + k"
          class="reward-item"
        >
          <div class="icon-box">
            <img :src="item.icon" alt="" />
          </div>
          <div class="name">{{ item.reward_name }}</div>
          <div class="day">{{ item.reward_desc }}</div>
        </div>
      </div>
    </div>
    <!-- rank list -->
    <div v-if="!is_end" class="slots-rank-list">
      <img
        class="title"
        :src="icon_options.page_1_3_this_week_champion"
        alt=""
      />
      <div v-if="!slots_winner_week_rank_list.length" class="empty-list">
        <img
          src="http://imgcom.static.suishenyun.net/img_quesheng-2f14d4.png"
          alt=""
        />
        <span>{{ $t('no-data') }}</span>
      </div>
      <div v-else class="list">
        <div
          v-for="(item, k) in slots_winner_week_rank_list"
          :key="'rank' + k"
          :class="['item', k < 3 ? `item-top-three item-${k}` : 'item-other']"
        >
          <div class="rank">
            <img v-if="k < 3" :src="rank_num[k]" alt="" />
            <span v-else>{{ item.subject_rank }}</span>
          </div>
          <div :class="['avatar']">
            <img
              v-if="k < 3"
              :src="k === 1 ? avatar_2 : k === 2 ? avatar_3 : avatar_1"
              class="crown-icon"
              alt=""
            />

            <img
              :src="item.subject_icon"
              :class="['user', 'avatar-' + (k + 1)]"
              alt=""
            />
          </div>
          <div class="name-box">
            <div class="nick">{{ item.subject_name }}</div>
            <div class="id">ID:{{ item.peanut_id }}</div>
          </div>
          <div class="diamond-box">
            <img
              class="icon"
              src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
              alt=""
            />
            <span>{{ item.income_diamonds }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="is_end" class="end-box">
      <div class="end-title-reward">
        <img :src="icon_options.page_3_2_slots_champion_reward" alt="" />
      </div>
      <div class="list">
        <div
          v-for="(item, k) in reward_item_group_list"
          :key="'list' + k"
          class="item"
        >
          <div class="item-title">
            {{ `Rank ${item.level} Rewards` }}
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

    <!-- my_rank -->
    <div v-if="my_rank.subject_id" class="owner">
      <div class="rank">
        {{
          my_rank.subject_rank > -1
            ? my_rank.subject_rank > 99
              ? '99+'
              : my_rank.subject_rank
            : '99+'
        }}
      </div>
      <img :src="my_rank.subject_icon" class="avatar" alt="" />
      <div class="info">
        <div class="nick">{{ my_rank.subject_name }}</div>
        <div class="id">ID:{{ my_rank.peanut_id }}</div>
      </div>
      <div class="diamond-box">
        <img
          class="icon"
          src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
          alt=""
        />
        <span>{{ my_rank.income_diamonds || 0 }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import request from '../../lib/request/activity.js';
import { formatDate, formatDateString, sleep, isEmpty } from '../../lib/utils';
import Toast from '../../components/third/toast/toast';
import { local_storage } from '../../lib/storage';
import { getSafeHeight, getLanguage } from '../../lib/device';
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
      last_week_title:
        'http://imgcom.static.suishenyun.net/Last%20Week%20Champion-024b7a.png',
      list: [],
      top_list: [],
      first: {},
      second: {},
      third: {},
      avatar_1: 'http://imgcom.static.suishenyun.net/icon_rank1-75dc5a.png',
      avatar_2: 'http://imgcom.static.suishenyun.net/icon_rank2-b2c821.png',
      avatar_3: 'http://imgcom.static.suishenyun.net/icon_rank3-3355e6.png',

      rank_num: {
        0: 'http://imgcom.static.suishenyun.net/tag_rank1-a5a69e.png',
        1: 'http://imgcom.static.suishenyun.net/tag_rank2-7d2b69.png',
        2: 'http://imgcom.static.suishenyun.net/tag_rank3-c7009f.png',
      },
      my_rank: {},
      slots_winner_week_rank_list: [],
      reward_item_group_list: [],
      is_end: false, //活动是否结束
      show_list: [],
      icon_options: {},
      last_champion_list: [],
      html_title: '',
      safe_height: 0,
      scroll_dis: 0,
    };
  },
  computed: {},
  created() {
    let safe_area = getSafeHeight() || 0;
    this.safe_height = (safe_area * 2) / 100;
    this.getData();
    this.getRewardList();
    if (this.language === 'en') {
      this.icon_options = { ...{}, ...getUSIcon() };
      this.html_title = 'Slots Big Winner';
    } else if (this.language === 'id') {
      this.icon_options = { ...{}, ...getIDIcon() };
      this.html_title = 'Pemenang Besar Slot';
    } else if (['zh-cn', 'zh', 'zh_cn'].includes(this.language)) {
      this.icon_options = { ...{}, ...getCNIcon() };
      this.html_title = 'Slots大赢家';
    } else if (this.language === 'tw') {
      this.icon_options = { ...{}, ...getTWIcon() };
      this.html_title = 'Slots大贏家';
    } else {
      this.icon_options = { ...{}, ...getSAIcon() };
      this.html_title = 'Slots الفائز الكبير';
    }
    document.title = this.html_title;
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  },
  methods: {
    handleScroll(e) {
      this.scroll_dis =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log(this.scroll_dis);
    },
    /**
     * @description: 获取榜单数据
     * @return {*}
     */
    async getData() {
      const { status, data } = await request.getSlotsRankList();
      if (status !== 1000) return;
      const {
        last_champion_list,
        slots_winner_week_rank_list,
        my_rank,
        activity_status,
      } = data;
      this.is_end = activity_status === 2 ? true : false;
      this.slots_winner_week_rank_list = slots_winner_week_rank_list || [];
      this.my_rank = { ...{}, ...my_rank };
      this.last_champion_list = last_champion_list || [];
      this.getList(this.last_champion_list);
    },

    /**
     * @description: 获取奖励数据
     * @return {*}
     */
    async getRewardList() {
      const { status, data } = await request.getSlotsRewardList();
      if (status !== 1000) return;
      this.reward_item_group_list = data.reward_item_group_list || [];
      this.show_list = [];
      if (this.reward_item_group_list.length) {
        this.show_list = this.reward_item_group_list[0].reward_item_vo_list;
      }
    },
    /**
     * @description: 获取前三名数据  单独做展示
     * @param {*} list
     * @return {*}
     */
    getList(list) {
      if (!list.length) return;
      if (list.length > 2) {
        this.first = list[0];
        this.second = list[1];
        this.third = list[2];
      } else if (list.length === 2) {
        this.first = list[0];
        this.second = list[1];
      } else {
        this.first = list[0];
      }
    },
    /**
     * @description: 点击 奖励/more跳转奖励明细页
     * @return {*}
     */
    jumpRewardPage() {
      location.href = location.origin + '/slots_reward.html?is_full_screen=1';
    },
  },
};
</script>

<style lang="less" scoped>
.end-title {
  width: 100%;
  height: 0.54rem;
  text-align: center;
  img {
    width: 5.6rem;
    height: 0.54rem;
  }
}
.main {
  width: 7.5rem;
  min-height: 100vh;
  background-image: url('http://imgcom.static.suishenyun.net/img_head_bg%20(1)-abbd70.png');
  background-size: 7.5rem 6.89rem;
  background-repeat: no-repeat;
  position: relative;
  background-color: #350d86;
  overflow-x: hidden;
}

.gift-icon {
  position: fixed;
  // top: 0.38rem;
  right: 0.15rem;
  width: 1.4rem;
  height: 0.53rem;
  z-index: 9999;
  img {
    width: 100%;
    height: 100%;
  }
}

.slot-title {
  width: 100%;
  height: 2.11rem;
  text-align: center;
  margin-top: -0.3rem;
  img {
    width: 2.55rem;
    height: 100%;
  }
}
.date-title {
  width: 100%;
  height: 0.54rem;
  text-align: center;
  margin-top: -0.14rem;
  img {
    width: 5.6rem;
    height: 100%;
  }
}
.rank-three-box {
  width: 6.84rem;
  height: 4.15rem;
  margin: 0.14rem auto 0;
  display: flex;
  justify-content: center;
  font-size: 0.24rem;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 0.33rem;
  .three-common {
    width: 2.55rem;
    height: 3.48rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    .rank-top {
      font-size: 0.18rem;
      line-height: 0.18rem;
      margin-top: 0.16rem;
    }
    .avatar-box {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      margin-top: 0.5rem;
      position: relative;

      .user-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        z-index: 100;
      }
    }
    .nick-box {
      width: 1.2rem;
      text-align: center;
      font-size: 0.24rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 0.33rem;
      margin-top: 0.12rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .id-box {
      height: 0.2rem;
      font-size: 0.2rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffffb3;
      line-height: 0.2rem;
      margin-top: 0.08rem;
      white-space: nowrap;
      width: 1.6rem;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
    }
    .diamond-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.12rem;
      color: #ee98ff;
      img {
        width: 0.36rem;
        height: 0.36rem;
      }
    }
  }
}
.crown-icon {
  width: 0.36rem;
  height: 0.36rem;
  position: absolute;
  left: -0.07rem;
  top: -0.07rem;
  z-index: 1;
}

.rank-1 {
  background-image: url('http://imgcom.static.suishenyun.net/img_rank1%20(1)-d7e9fa.png');
}
.rank-2 {
  margin-top: 0.64rem;
  background-image: url('http://imgcom.static.suishenyun.net/img_rank2%20(2)-0187a8.png');
}
.rank-3 {
  margin-top: 0.67rem;
  background-image: url('http://imgcom.static.suishenyun.net/img_rank2%20(3)-5a562b.png');
}

.rank-no-1 {
  color: #a06a45;
}
.rank-no-2 {
  color: #44586d;
}
.rank-no-3 {
  color: #ac5f36;
}
.avatar-1 {
  border: 0.03rem solid #ffce42;
}
.avatar-2 {
  border: 0.03rem solid #d5e3ea;
}
.avatar-3 {
  border: 0.03rem solid #fb9671;
}

.reward-box {
  width: 7.1rem;
  height: 3.81rem;
  background: #592db4;
  border-radius: 0.24rem;
  margin: 0.26rem auto 0.2rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .reward-title {
    width: 5.6rem;
    height: 0.54rem;
    margin: 0.2rem auto;
  }
  .right-arrow {
    height: 0.54rem;
    font-size: 0.24rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #fbc66f;
    line-height: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0.3rem;
    top: 0.2rem;
    img {
      width: 0.1rem;
      height: 0.16rem;
      margin-left: 0.06rem;
      margin-top: 0.05rem;
    }
  }
  .reward-list {
    display: flex;
    align-items: center;
    justify-content: center;
    .reward-item {
      margin: 0 0.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
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
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
.slots-rank-list {
  position: relative;
  z-index: 1;
  width: 7.1rem;
  min-height: 7rem;
  // height: 10.59rem;
  background: #592db4;
  border-radius: 0.24rem;
  margin: 0 auto 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 5.6rem;
    height: 0.54rem;
    margin: 0.27rem auto 0.21rem;
  }

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 0.16rem;
    position: relative;
    .rank {
      width: 0.35rem;
      height: 0.43rem;
      margin-left: 0.2rem;
      font-size: 0.26rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 0.37rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .avatar {
      width: 0.9rem;
      height: 0.9rem;
      position: relative;
      border-radius: 50%;
      margin-left: 0.2rem;
      .user {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        z-index: 100;
      }
    }
    .name-box {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-left: 0.2rem;
      .nick {
        height: 0.26rem;
        line-height: 0.26rem;
        font-size: 0.26rem;
      }
      .id {
        margin-top: 0.14rem;
        font-size: 0.22rem;
        height: 0.22rem;
        line-height: 0.22rem;
        color: #ffffff80;
      }
    }
    .diamond-box {
      position: absolute;
      right: 0.2rem;
      display: flex;
      align-items: center;
      height: 0.24rem;
      font-size: 0.24rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ff98dc;
      line-height: 0.24rem;
      .icon {
        width: 0.26rem;
        height: 0.26rem;
        margin-right: 0.06rem;
      }
    }
  }
  .item-other {
    width: 6.7rem;
    height: 1.42rem;
    background: #592db4;
    border-radius: 0.16rem;
    border: 0.02rem solid #7a50d0;
  }
}
.item-top-three {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 6.74rem;
  height: 1.46rem;
}
.item-0 {
  background-image: url('http://imgcom.static.suishenyun.net/bg_rank1-599068.png');
}
.item-1 {
  background-image: url('http://imgcom.static.suishenyun.net/bg_rank2-6d26f8.png');
}
.item-2 {
  background-image: url('http://imgcom.static.suishenyun.net/bg_rank3-86c7a1.png');
}

.owner {
  width: 7.5rem;
  height: 1.2rem;
  background: linear-gradient(180deg, #8624f0 0%, #6133c9 100%);
  border-radius: 0.16rem 0.16rem 0 0;
  position: fixed;
  z-index: 9999;
  bottom: 0;
  display: flex;
  align-items: center;
  .rank {
    margin-left: 0.28rem;
    height: 0.37rem;
    font-size: 0.26rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 0.37rem;
  }
  .avatar {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    margin-left: 0.32rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 0.2rem;
    .nick {
      height: 0.26rem;
      font-size: 0.26rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 0.26rem;
    }
    .id {
      height: 0.26rem;
      font-size: 0.26rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff80;
      line-height: 0.26rem;
      margin-top: 0.14rem;
    }
  }
  .diamond-box {
    position: absolute;
    right: 0.5rem;
    display: flex;
    align-items: center;
    height: 0.24rem;
    font-size: 0.24rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ff98dc;
    line-height: 0.24rem;
    .icon {
      width: 0.26rem;
      height: 0.26rem;
      margin-right: 0.06rem;
    }
  }
}

.end-box {
  width: 7.1rem;
  min-height: 12.49rem;
  background: #592db4;
  border-radius: 0.16rem;
  border: 0.02rem solid #7a50d0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.26rem auto 1.5rem;
  position: relative;
  z-index: 1;
  .end-title-reward {
    width: 100%;
    height: 0.54rem;
    text-align: center;
    margin: 0.3rem auto;
    img {
      width: 5.6rem;
      height: 100%;
    }
  }
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
        text-shadow: 0.01rem 0.01rem 0.01rem #ffffff;
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
.empty-list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2.54rem;
  height: 0.33rem;
  font-size: 0.24rem;
  width: 100%;
  text-align: center;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #a884f1;
  line-height: 0.33rem;
  img {
    width: 1.57rem;
    height: 2rem;
    margin-bottom: 0.16rem;
  }
}

.no-show {
  visibility: hidden;
}
.second-right {
  margin-right: -0.4rem;
  position: relative;
  z-index: 1;
}
.first-left {
  z-index: 10;
  position: relative;
}
.third-left {
  margin-left: -0.4rem;
  position: relative;
  z-index: 1;
}
</style>
