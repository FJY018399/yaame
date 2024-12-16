<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-09-25 11:05:39
 * @LastEditors: wujiang 
 * @LastEditTime: 2023-10-17 19:24:11
 * @Description: 
-->
<template>
  <div class="whole-content" id="lucky">
    <van-pull-refresh
      v-model="refresh_loading"
      :pulling-text="$t('pulling-text')"
      :loosing-text="$t('loosing-text')"
      :loading-text="$t('loading-text')"
      :success-text="$t('success-text')"
      :disabled="disabled_refresh"
      @refresh="refreshData"
    >
      <div id="main" :class="['main', `bg-${language}`]">
        <customHeader v-if="!disabled_refresh" color=""></customHeader>
        <page-loading v-if="page_loading"></page-loading>
        <div @click="backPage()" class="back-box">
          <img src="./imgs/back-icon.png" class="back-icon" alt="" />
        </div>
        <img
          v-if="!page_loading"
          @click="rule_modal = true"
          src="./imgs/ques-icon.png"
          class="rule-icon"
          alt=""
        />

        <!-- 倒计时 -->
        <div class="time-down">
          <span class="num">{{ day }}</span>
          <span class="num">D</span>
          <span class="dot">:</span>
          <span class="num">{{ hour }}</span>
          <span class="dot">:</span>
          <span class="num">{{ minute }}</span>
          <span class="dot">:</span>
          <span class="num">{{ second }}</span>
        </div>

        <!-- 事件礼物 -->
        <div class="event-gift">
          <img src="./imgs/img_bg01.png" class="event-bg" />
          <img src="./imgs/img_title2.png" class="inner" />
          <img :src="image_options.gift_title" class="outer" />

          <div class="event-list">
            <div
              v-for="(it, k) in gift_config_item_vos"
              :key="'event' + k"
              class="item"
            >
              <div class="icon-box">
                <img :src="it.icon" alt="" />
              </div>
              <div class="name hidden-1">{{ it.gift_name }}</div>
              <div class="diamond">
                <img
                  class="icon"
                  src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                  alt=""
                />
                {{ it.diamond_worth }}
              </div>
            </div>
          </div>
        </div>

        <!-- 榜单&&奖品 -->
        <div class="rank-reward">
          <img
            src="http://imgcom.static.suishenyun.net/1-68371e.png"
            class="bg-header"
            alt=""
          />
          <div class="rank-top">
            <div class="tab-list">
              <div
                v-for="(tab, k) in image_options.tab_list"
                :key="'tab' + k"
                :class="{ 'active-tab': tab.id === active_tab, item: true }"
                @click="active_tab = tab.id"
              >
                {{ tab.name }}
              </div>
            </div>
            <div v-if="active_tab === 1" class="rank content-box">
              <div v-if="!rank_list_info_items.length" class="empty-rank">
                {{ $t('no-data') }}
              </div>
              <!-- 前三名 -->
              <div v-else class="top-box">
                <div
                  v-if="
                    rank_list_info_items.length &&
                    rank_list_info_items.length > 1
                  "
                  class="second"
                >
                  <div class="avatar-box">
                    <img
                      @click="jumpDetail(rank_list_info_items[1])"
                      src="./imgs/2.png"
                      class="bg"
                      alt=""
                    />
                    <img
                      :src="rank_list_info_items[1].avatar"
                      class="avatar"
                      alt=""
                    />
                  </div>
                  <div class="name hidden-1">
                    {{ rank_list_info_items[1].nick_name }}
                  </div>
                  <div class="id hidden-1">
                    ID:{{ rank_list_info_items[1].peanut_id }}
                  </div>
                  <div class="score">
                    <img
                      class="icon"
                      src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                      alt=""
                    />
                    {{ rank_list_info_items[1].income_diamonds }}
                  </div>
                </div>
                <div v-else class="empty-second"></div>
                <div v-if="rank_list_info_items.length" class="first">
                  <div class="avatar-box">
                    <img
                      @click="jumpDetail(rank_list_info_items[0])"
                      src="./imgs/1.png"
                      class="bg"
                      alt=""
                    />
                    <img
                      :src="rank_list_info_items[0].avatar"
                      class="avatar"
                      alt=""
                    />
                  </div>
                  <div class="name hidden-1">
                    {{ rank_list_info_items[0].nick_name }}
                  </div>
                  <div class="id hidden-1">
                    ID:{{ rank_list_info_items[0].peanut_id }}
                  </div>
                  <div class="score">
                    <img
                      class="icon"
                      src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                      alt=""
                    />
                    {{ rank_list_info_items[0].income_diamonds }}
                  </div>
                </div>
                <div v-else class="empty-first"></div>
                <div
                  v-if="
                    rank_list_info_items.length &&
                    rank_list_info_items.length > 2
                  "
                  class="third"
                >
                  <div class="avatar-box">
                    <img
                      @click="jumpDetail(rank_list_info_items[2])"
                      src="./imgs/3.png"
                      class="bg"
                      alt=""
                    />
                    <img
                      :src="rank_list_info_items[2].avatar"
                      class="avatar"
                      alt=""
                    />
                  </div>
                  <div class="name hidden-1">
                    {{ rank_list_info_items[2].nick_name }}
                  </div>
                  <div class="id hidden-1">
                    ID:{{ rank_list_info_items[2].peanut_id }}
                  </div>
                  <div class="score">
                    <img
                      class="icon"
                      src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                      alt=""
                    />
                    {{ rank_list_info_items[2].income_diamonds }}
                  </div>
                </div>
                <div v-else class="empty-third"></div>
              </div>
              <!-- 剩下排名 -->
              <!-- rank_list_info_items -->
              <div v-if="rank_list_info_items.length" class="other-box">
                <div
                  v-for="(item, k) in rank_list_info_items"
                  :key="'rank' + k"
                  class="item"
                >
                  <div v-if="k > 2" class="other-item">
                    <div class="order">{{ item.subject_rank }}</div>

                    <img
                      @click="jumpDetail(item)"
                      class="avatar"
                      :src="item.avatar"
                      alt=""
                    />
                    <div class="info">
                      <div class="name hidden-1 w-200">
                        {{ item.nick_name }}
                      </div>
                      <div class="id name hidden-1 w-200">
                        ID:{{ item.peanut_id }}
                      </div>
                    </div>
                    <div class="score">
                      <img
                        class="icon"
                        src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                        alt=""
                      />
                      {{ item.income_diamonds }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 奖励 -->
            <div v-else id="reward" class="reward content-box">
              <div
                v-for="(it, k) in reward_item_groups"
                :key="'reward' + k"
                class="item"
              >
                <div class="title-tag">{{ image_options.rank_title[k] }}</div>
                <div class="reward-list">
                  <div
                    v-for="(reward, j) in it.reward_item_vo_list"
                    :key="j"
                    class="items"
                  >
                    <div class="icon-box">
                      <img
                        :class="
                          reward.object_type === 'INCOME_RIBBON'
                            ? 'piaopin-icon'
                            : 'normal-img'
                        "
                        :src="reward.icon"
                        alt=""
                      />
                      <div v-if="reward.validity_date" class="day">
                        {{ reward.validity_date }}
                      </div>
                    </div>
                    <div class="name hidden-1">{{ reward.gift_name }}</div>
                    <div
                      :class="[
                        'diamond',
                        reward.diamond_worth ? '' : 'hidden-box',
                      ]"
                    >
                      <img
                        class="icon"
                        src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                        alt=""
                      />
                      {{ reward.diamond_worth }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            src="http://imgcom.static.suishenyun.net/3-f77fb7.png"
            class="bg-footer"
            alt=""
          />
        </div>
        <div :class="[my_info.peanut_id ? 'footer' : 'footer-no-user']"></div>
        <!-- 我的信息 -->
        <div v-if="show_my_card" class="my-box">
          <div class="order">
            {{
              !my_info.subject_rank || my_info.subject_rank > 99
                ? '99+'
                : my_info.subject_rank
            }}
          </div>
          <img :src="my_info.avatar" class="avatar" alt="" />
          <div class="info">
            <div class="name hidden-1 w-200">{{ my_info.nick_name }}</div>
            <div class="id name hidden-1">ID:{{ my_info.peanut_id }}</div>
          </div>
          <div class="score">
            <img
              class="icon"
              src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
              alt=""
            />
            {{ my_info.income_diamonds || 0 }}
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 规则弹窗 -->
    <popup v-if="rule_modal" id="pop" class="flex-pop">
      <div @click="getCloseDom(true)" class="flex-pop">
        <div @click="getCloseDom(false)" id="rule" class="rule-box">
          <img
            class="bg-box"
            src="http://imgcom.static.suishenyun.net/rule-bg-lucky-f4d7dc.png"
            alt=""
          />
          <img src="./imgs/img_title2.png" class="title-rule-bg" />
          <img :src="image_options.rule_title" class="title-rule" alt="" />
          <div class="content">
            <div class="rule-desc">
              <p class="p-padding">
                {{ $t('rule-1') }}
              </p>
              <p class="p-padding">
                {{ $t('rule-2') }}
              </p>
              <p class="p-padding">
                {{ $t('end-time') }}
              </p>
              <p class="p-padding">
                {{ $t('rule-3') }}
              </p>
              <p class="e-title p-padding">{{ $t('rule-title') }}</p>
              <div class="gift-list">
                <div
                  v-for="(item, k) in gift_config_item_vos"
                  :key="'gifts' + k"
                  class="item"
                >
                  <div class="icon-box">
                    <img :src="item.icon" alt="" />
                  </div>
                  <div class="name hidden-1">
                    {{ item.gift_name }}
                  </div>
                  <div class="diamond">
                    <img
                      class="icon"
                      src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                      alt=""
                    />
                    {{ item.diamond_worth }}
                  </div>
                </div>
              </div>
              <p class="p-padding">
                {{ $t('rule-4') }}
              </p>
            </div>
          </div>
        </div>
        <div class="close-btn">
          <img
            @click="rule_modal = false"
            src="http://imgcom.static.suishenyun.net/yamme-close-btn-e73cef.png"
            alt=""
          />
        </div>
      </div>
    </popup>
  </div>
</template>
<script>
import customHeader from '../../components/common/header.vue';
import request from '../../lib/request/activity';
import popup from '../../components/common/pop_up.vue';
import { getAppType, getChannel, getLanguage } from '../../lib/device.js';
import moment from 'moment';
import Toast from '../../components/third/toast/toast';
import pageLoading from '../../components/common/page_loading.vue';
import { sleep } from '../../lib/utils';

const getLanguageImages = () => {
  return {
    zh: {
      page_title: '超级幸运星',
      gift_title:
        'http://imgcom.static.suishenyun.net/gift-title-cn-0822fa.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E4%B8%AD%E6%96%87@3x-f12978.png',
      rule_title: 'http://imgcom.static.suishenyun.net/gift-rule-cn-a64821.png',
      tab_list: [
        {
          id: 1,
          name: '排行',
        },
        {
          id: 2,
          name: '奖品',
        },
      ],
      rank_title: [
        '第一名',
        '第二名',
        '第三名',
        '第四名至第六名',
        '第七名至第十名',
      ],
    },
    tw: {
      page_title: '超幸運星',
      gift_title:
        'http://imgcom.static.suishenyun.net/gift-title-tw-1e2f06.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E7%B9%81%E4%BD%93@3x-b3e47a.png',
      rule_title: 'http://imgcom.static.suishenyun.net/gift-rule-tw-e64393.png',
      tab_list: [
        {
          id: 1,
          name: '排行',
        },
        {
          id: 2,
          name: '獎品',
        },
      ],
      rank_title: [
        '第一名',
        '第二名',
        '第三名',
        '第四名至第六名',
        '第七名至第十名',
      ],
    },
    en: {
      page_title: 'Super Lucky Star',
      gift_title:
        'http://imgcom.static.suishenyun.net/gift-title-us-eb4db2.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E8%8B%B1%E8%AF%AD@3x-bd497f.png',
      rule_title: 'http://imgcom.static.suishenyun.net/gift-rule-en-4efb35.png',
      tab_list: [
        {
          id: 1,
          name: 'Ranking',
        },
        {
          id: 2,
          name: 'Rewards',
        },
      ],
      rank_title: [
        'Ranking 1',
        'Ranking 2',
        'Ranking 3',
        'Ranking 4-6',
        'Ranking 7-10',
      ],
    },
    in: {
      page_title: 'Super Lucky Star',
      gift_title:
        'http://imgcom.static.suishenyun.net/gift-title-in-ab666a.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E5%8D%B0%E5%B0%BC@3x-f3b68f.png',
      rule_title: 'http://imgcom.static.suishenyun.net/gift-rule-sa-066914.png',
      tab_list: [
        {
          id: 1,
          name: 'Rank',
        },
        {
          id: 2,
          name: 'hadiah',
        },
      ],
      rank_title: [
        'Ranking 1',
        'Ranking 2',
        'Ranking 3',
        'Ranking 4-6',
        'Ranking 7-10',
      ],
    },
    ar: {
      page_title: 'نجم  الحظ',
      gift_title:
        'http://imgcom.static.suishenyun.net/gift-title-ar-dc66b7.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E9%98%BF%E6%8B%89%E4%BC%AF@3x-e2ad87.png',
      rule_title: 'http://imgcom.static.suishenyun.net/gift-rule-ar-cd0e62.png',
      tab_list: [
        {
          id: 1,
          name: 'التصنيف',
        },
        {
          id: 2,
          name: 'الجائزة',
        },
      ],
      rank_title: [
        'المركز الأول',
        'المركز الثاني',
        'المركز الثالث',
        'المركز الرابع إلى المركز السادس',
        'المركز السابع إلى المركز العاشر',
      ],
    },
  };
};

export default {
  components: {
    customHeader,
    popup,
    pageLoading,
  },
  data() {
    return {
      rule_modal: false,
      day: '',
      hour: '',
      minute: '',
      second: '',
      count_timer: null,
      image_options: {},
      gift_config_item_vo_list: [],
      reward_item_group_list: [],
      active_tab: 1,
      page_loading: true,
      refresh_loading: false,
      box_icon:
        'http://imgcom.static.suishenyun.net/%E5%AB%A6%E5%A8%A5%E5%85%94%E5%A4%B4%E5%83%8F%E6%A1%86-aa8bb6.png',
      reward_type: '',
      language: getLanguage() || 'en',
      next_info: {},
      now_time: 0,
      disabled_refresh: false,
      my_info: {},
      gift_config_item_vos: [], //礼物配置信息
      rank_list_info_items: [], //排行榜信息
      reward_item_groups: [], //奖励物品信息
      show_my_card: false,
    };
  },
  computed: {},

  created() {
    this.language = ['zh-cn', 'zh', 'zh_cn'].includes(this.language)
      ? 'zh'
      : ['zh-tw', 'tw', 'zh_tw'].includes(this.language)
      ? 'tw'
      : ['id', 'in'].includes(this.language)
      ? 'in'
      : this.language;
    this.image_options = getLanguageImages()[this.language];
    document.title = this.image_options.page_title;
  },
  async mounted() {
    await this.getData();
    this.page_loading = false;
    this.getEndTimeDown(this.now_time);
    this.count_timer = setInterval(() => {
      this.now_time = this.now_time + 1000;
      this.getEndTimeDown(this.now_time);
    }, 1000);
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  },
  watch: {
    active_tab(val) {
      if (val) {
        this.getData();
      }
    },
  },
  methods: {
    handleScroll(e) {
      let scrollHeight =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.show_my_card = scrollHeight >= 200 ? true : false;
    },
    async getData() {
      const { status, data } = await request.getStarRankList();
      if (status !== 1000) return;
      const {
        gift_config_item_vos,
        now_time,
        my_rank,
        rank_list_info_items,
        reward_item_groups,
      } = data;
      this.now_time = now_time;
      this.gift_config_item_vos = gift_config_item_vos;
      this.reward_item_groups = reward_item_groups;

      this.rank_list_info_items = rank_list_info_items;
      this.my_info = { ...{}, ...my_rank };
    },
    /**
     * @description: 下拉刷新
     * @return {*}
     */
    async refreshData() {
      this.active_tab = 1;
      await this.getData();
      await sleep(500);
      this.refresh_loading = false;
    },

    /**
     * @description: 倒计时  截止日期 为10-22
     * @return {*}
     */
    getEndTimeDown(val) {
      const now_time = moment().utc().valueOf();
      const utcTime = new Date('2023-10-24T23:59:59Z').valueOf();
      if (val > utcTime) {
        this.day = 0;
        this.hour = '00';
        this.minute = '00';
        this.second = '00';
        return;
      }
      let timeRemaining = utcTime - val;

      timeRemaining = Math.floor(timeRemaining / 1000); // convert from ms to s

      const days = Math.floor(timeRemaining / 86400); // 1 day = 86400 seconds
      timeRemaining %= 86400;

      const hours = String(Math.floor(timeRemaining / 3600)).padStart(2, '0'); // 1 hour = 3600 seconds
      timeRemaining %= 3600;

      const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0'); // 1 minute = 60 seconds
      timeRemaining %= 60;

      const seconds = String(timeRemaining).padStart(2, '0');
      this.day = days;
      this.hour = hours;
      this.minute = minutes;
      this.second = seconds;
    },

    debounceReward(delay, item) {
      let timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.getReward(item);
      }, delay);
    },

    /**
     * @description: 点击非主体区域关闭弹窗
     * @param {*} flag
     * @return {*}
     */
    getCloseDom(flag) {
      this.rule_modal = !flag;
    },

    isNumber(val) {
      return typeof +val === 'number' && !isNaN(val);
    },
    backPage() {
      location.href = `wlyaame://webview/back`;
    },
    jumpDetail(item) {
      location.href = `wlyaame://trend/user?uid=${item.uid}`;
    },

    isPiaopin(val) {
      return val.indexOf('家族飘屏') > -1 ? true : false;
    },
  },
};
</script>

<style lang="less" scoped>
.w-200 {
  width: 2rem;
}
.hidden-1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.whole-content {
  min-height: 100vh;
  background: #251813;
}
.main {
  width: 7.5rem;
  height: 100%;
  min-height: 100vh;
  background: #251813;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  padding: 0.01rem;
}
.bg-zh {
  background-image: url('http://imgcom.static.suishenyun.net/bgzhongwen@2x-aed502.jpg');
}
.bg-tw {
  background-image: url('http://imgcom.static.suishenyun.net/bgfanti-a8ed32.jpg');
}
.bg-en,
.bg-in {
  background-image: url('http://imgcom.static.suishenyun.net/bgyinni_en-e00ee2.jpg');
}
.bg-ar {
  background-image: url('http://imgcom.static.suishenyun.net/bgshate-b2f2a9.jpg');
}
.back-box {
  position: absolute;
  top: 1.12rem;
  z-index: 998;
  width: 1rem;
  height: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .back-icon {
    width: 0.4rem;
    height: 0.4rem;
  }
}
.rule-icon {
  position: absolute;
  width: 0.66rem;
  height: 0.66rem;
  top: 1.19rem;
  right: 0.29rem;
  z-index: 998;
}

.time-down {
  margin-top: 3.09rem;
  font-size: 0.48rem;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: normal;
  color: #ffeb8e;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .num {
    width: 0.82rem;
    height: 0.82rem;
    margin: 0 0.05rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('./imgs/time-bg.png') no-repeat;
    background-size: contain;
  }
  .dot {
    height: 0.82rem;
    margin: 0 0.03rem;
    color: #68441e;
  }
}

.event-gift {
  width: 6.94rem;
  height: 6.7rem;
  margin: 6.01rem auto 0;
  position: relative;
  padding: 0.01rem;

  .event-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
  }
  .inner {
    width: 3.55rem;
    height: 0.4rem;
    position: absolute;
    left: 1.7rem;
    top: -0.14rem;
    z-index: 1;
  }
  .outer {
    width: 3rem;
    height: 0.78rem;
    position: absolute;
    z-index: 3;
    left: 1.97rem;
    top: -0.14rem;
  }
  .event-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 0.44rem;
    position: relative;
    z-index: 10;
    .item {
      width: 1.6rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0.5rem 0.225rem 0;
      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fdb45b;
      .icon-box {
        width: 1.6rem;
        height: 1.6rem;
        background: #2a1a11;
        border-radius: 0.06rem;
        border: 0.02rem solid #674931;
        img {
          width: 1.4rem;
          height: 1.4rem;
          margin: 0.1rem;
        }
      }
      .name {
        line-height: 0.33rem;
        height: 0.33rem;
        margin-top: 0.16rem;
        width: 100%;
        text-align: center;
      }
      .diamond {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        line-height: 0.33rem;
        height: 0.33rem;
        margin-top: 0.05rem;
        img {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
}
.footer {
  width: 100%;
  height: 1.5rem;
}
.footer-no-user {
  width: 100%;
  height: 0.4rem;
}
.rank-reward {
  width: 6.94rem;
  min-height: 5.57rem;
  display: flex;
  flex-direction: column;
  // background-image: url('http://imgcom.static.suishenyun.net/rank-bg-lucky-bfb133.png');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background-attachment: fixed;
  margin: 0.88rem auto 0;
  padding: 0.01rem 0.01rem 0.3rem 0.01rem;
  position: relative;
  .bg-header {
    width: 6.92rem;
    height: 1.24rem;
    z-index: 2;
    position: relative;
  }
  .rank-top {
    margin-top: -1.2rem;
  }
  .content-box {
    background: #39251a;
    border-left: 0.02rem solid #644632;
    border-right: 0.02rem solid #644632;
    position: relative;
    z-index: 10;
  }
  .bg-footer {
    width: 6.92rem;
    height: 1.2rem;
    z-index: 2;
    position: relative;
    margin-top: -0.8rem;
  }
  .tab-list {
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 4.52rem;
    height: 0.8rem;
    background: linear-gradient(180deg, #c8935b 0%, #a96c43 54%, #af6e42 100%);
    border-radius: 0.51rem;
    font-size: 0.26rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 700;
    color: #633314;
    margin: -0.4rem auto 0;
    padding: 0.06rem 0.1rem;
    .active-tab {
      width: 2.2rem;
      height: 0.68rem;
      background: #fffc;
      border-radius: 0.36rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .item {
      width: 2.2rem;
      height: 0.68rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .empty-rank {
    width: 100%;
    height: 3.24rem;
    text-align: center;
    margin-top: 0.4rem;
    font-size: 0.24rem;
    font-weight: 400;
    color: #fdb45b;
    line-height: 0.24rem;
    padding-top: 1rem;
  }
  .top-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 3.7rem;
    font-size: 0.24rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fdb45b;
    line-height: 0.24rem;
    margin-top: 0.4rem;
    .empty-second {
      width: 2.2rem;
    }
    .empty-first {
      width: 2.4rem;
      margin: 0 -0.2rem;
    }
    .empty-third {
      width: 2.2rem;
    }
    .second {
      width: 2.2rem;
      margin-top: 0.72rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .avatar-box {
        width: 2.2rem;
        height: 2.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 10;
        }
        .avatar {
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          position: relative;
          z-index: 2;
        }
      }
      .name {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: -0.14rem;
      }
      .id {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.1rem;
      }
      .score {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.16rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.22rem;
        .icon {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
    .first {
      width: 2.4rem;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      margin: 0 -0.2rem;
      .avatar-box {
        width: 2.4rem;
        height: 2.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 10;
        }
        .avatar {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          position: relative;
          z-index: 2;
        }
      }
      .name {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: -0.14rem;
      }
      .id {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.1rem;
      }
      .score {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.16rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.22rem;
        .icon {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
    .third {
      width: 2.2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 0.72rem;
      .avatar-box {
        width: 2.2rem;
        height: 2.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 10;
        }
        .avatar {
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          position: relative;
          z-index: 2;
        }
      }
      .name {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: -0.14rem;
      }
      .id {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.1rem;
      }
      .score {
        height: 0.24rem;
        width: 100%;
        text-align: center;
        margin-top: 0.16rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.22rem;
        .icon {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
  .other-box {
    margin-top: 0.43rem;
    // height: 8.3rem;
    // overflow-y: auto;
    .other-item {
      width: 6.3rem;
      height: 1.3rem;
      background: #613314;
      border-radius: 0.08rem;
      border: 0.02rem solid #98623d;
      margin: 0 auto 0.1rem;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 0.24rem;
      color: #fdb45b;
      position: relative;
      padding: 0 0.3rem;
      .order {
        width: 0.35rem;
        height: 0.36rem;
        line-height: 0.36rem;
        font-weight: 700;
        text-align: center;
      }
      .avatar {
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        margin: 0 0.3rem 0 0.25rem;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .id {
          margin-top: 0.14rem;
        }
        .name {
          height: 0.24rem;
          line-height: 0.24rem;
        }
      }
      .score {
        position: absolute;
        right: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
}

.my-box {
  width: 7.5rem;
  height: 1.38rem;
  background: #39251a;
  border-radius: 0.24rem 0.24rem 0 0;
  border: 0.02rem solid #644632;
  position: fixed;
  bottom: 0;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #fdb45b;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
  z-index: 100;
  .order {
    width: 0.7rem;
    text-align: center;
    font-size: 0.36rem;
    line-height: 0.36rem;
    margin-left: 0.39rem;
    font-weight: 700;
  }
  .avatar {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    margin: 0 0.3rem 0 0.4rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .id {
      margin-top: 0.14rem;
    }
    .name {
      height: 0.24rem;
      line-height: 0.24rem;
    }
  }
  .score {
    position: absolute;
    right: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 0.24rem;
      height: 0.24rem;
    }
  }
}

.reward {
  font-family: PingFangSC-Semibold, PingFang SC;
  margin-top: 0.2rem;
  // height: 12.6rem;
  // overflow-y: auto;
  margin-top: 0.2rem;
  .item {
    margin-top: 0.4rem;
    .title-tag {
      width: 2rem;
      height: 0.6rem;
      background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
      border-radius: 0.36rem;
      border: 0.02rem solid #674931;
      margin: 0 auto 0.2rem;
      font-size: 0.24rem;
      font-weight: 700;
      color: #633314;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 10;
    }
    .reward-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      color: #fdb45b;
      .items {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0.2rem;
        width: 1.6rem;
        .icon-box {
          position: relative;
          width: 1.6rem;
          height: 1.6rem;
          background: #2a1a11;
          border-radius: 0.06rem;
          border: 0.02rem solid #674931;
          display: flex;
          align-items: center;
          justify-content: center;
          .normal-img {
            width: 1.4rem;
            height: 1.4rem;
          }

          .day {
            min-width: 0.6rem;
            height: 0.3rem;
            padding: 0.04rem 0.13rem;
            background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
            border-radius: 0.15rem;
            border: 0.02rem solid #674931;
            position: absolute;
            right: -0.08rem;
            top: -0.12rem;
            color: #633314;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.22rem;
          }
        }
        .name {
          width: 100%;
          text-align: center;
          height: 0.33rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fdb45b;
          line-height: 0.33rem;
          margin-top: 0.16rem;
          white-space: nowrap;
        }
        .diamond {
          width: 100%;
          font-size: 0.24rem;
          line-height: 0.33rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            width: 0.24rem;
            height: 0.24rem;
          }
        }
      }
    }
  }
}

.piaopin-icon {
  width: 90%;
  height: 0.4rem;
}
.hidden-box {
  visibility: hidden;
}

.flex-pop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rule-box {
  width: 6.94rem;
  height: 10rem;
  font-size: 0.26rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fdb45b;
  line-height: 0.48rem;
  position: relative;
  .bg-box {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
  }
  .title-rule-bg {
    width: 3.55rem;
    height: 0.4rem;
    position: absolute;
    left: 1.68rem;
    top: -0.16rem;
    z-index: 1;
  }
  .title-rule {
    width: 3rem;
    height: 0.78rem;
    position: absolute;
    left: 1.95rem;
    top: -0.16rem;
    z-index: 3;
  }
  .content {
    position: relative;
    z-index: 10;
    height: 8.8rem;
    overflow-y: auto;
    margin-top: 0.8rem;
    .e-title {
      margin-top: 0.4rem;
      text-align: center;
      font-weight: 600;
      font-size: 0.32rem;
    }
    .gift-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      .item {
        width: 1.6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0.225rem;
        font-weight: 400;
        line-height: 0.33rem;
        color: #fdb45b;
        margin-top: 0.3rem;
        .icon-box {
          width: 1.6rem;
          height: 1.6rem;
          background: #2a1a11;
          border-radius: 0.06rem;
          border: 0.02rem solid #674931;
          margin-bottom: 0.16rem;
          img {
            width: 1.4rem;
            height: 1.4rem;
            margin: 0.1rem;
          }
        }
        .name {
          width: 100%;
          text-align: center;
          height: 0.33rem;
        }
        .diamond {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.05rem;
          .icon {
            width: 0.24rem;
            height: 0.24rem;
          }
        }
      }
    }
  }
}

.close-btn {
  height: 0.5rem;
  margin-top: 0.6rem;
  width: 100%;
  text-align: center;
  img {
    width: 0.5rem;
    height: 100%;
  }
}
.p-padding {
  padding: 0 0.5rem;
}
</style>
