<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-09-25 11:05:39
 * @LastEditors: wujiang 
 * @LastEditTime: 2023-10-20 11:37:11
 * @Description: 
-->
<template>
  <div class="whole-content">
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
        <customHeader v-if="!disabled_refresh" color="white"></customHeader>
        <page-loading v-if="page_loading"></page-loading>

        <img
          @click="rule_modal = true"
          src="../../assets/img/SuperLuckyStar/btn_rule.png"
          class="rule-icon"
          alt=""
        />
        <!-- 幸运礼物 -->
        <div class="box-gift">
          <img
            src="http://imgcom.static.suishenyun.net/img_title2-a14cc5.png"
            class="title-1"
            alt=""
          />
          <img :src="image_options.gift_title" class="title-2" alt="" />
          <div v-if="!success_status" class="error-box gifts-box">
            <div class="error-tip">{{ $t('error-tip') }}</div>
          </div>
          <div v-else class="gifts-box">
            <div
              v-for="(item, k) in gift_config_item_vo_list"
              :key="'gifts' + k"
              class="item"
            >
              <div class="icon-box">
                <img :src="item.icon" alt="" />
              </div>
              <div class="name">
                {{ item.gift_name }}
              </div>
              <div class="diamond">
                <img
                  class="icon"
                  src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                  alt=""
                />
                <span> {{ item.diamond_worth }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- rewards -->
        <div v-if="success_status" class="box-2">
          <img
            src="http://imgcom.static.suishenyun.net/img_title2-a14cc5.png"
            class="title-1"
            alt=""
          />
          <img :src="image_options.reward_title" class="title-reward" alt="" />
          <div class="rewards-box">
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
            <!-- tab-list -->
            <div class="tab-list">
              <div
                v-for="(item, k) in image_options.tab_list"
                @click="active_tab = item.id"
                :key="'tab' + k"
                :class="['item', active_tab === item.id ? 'active-item' : '']"
              >
                {{ item.name }}
              </div>
            </div>

            <!-- 领取提示  -->
            <div class="send-notice">
              <img
                v-if="next_info.gift_name"
                :src="next_info.icon"
                class="box-icon"
                alt=""
              />
              <div class="send-desc">
                <div v-if="reward_item_group_list.length" class="last-level">
                  {{
                    hasSentTips(
                      image_options.tab_list[active_tab - 1].name,
                      reward_item_group_list[active_tab - 1]
                        .already_send_gift_count,
                      language
                    )
                  }}
                </div>

                <div v-if="reward_item_group_list.length" class="next-level">
                  {{
                    needSendTips(
                      image_options.tab_list[active_tab - 1].name,
                      reward_item_group_list[active_tab - 1].need_gift_count,
                      reward_item_group_list[active_tab - 1]
                        .already_send_gift_count,
                      language
                    )
                  }}
                </div>
              </div>
            </div>
            <!-- 领取奖励 -->
            <div class="reward-list">
              <template v-if="reward_item_group_list.length">
                <div
                  v-for="(item, k) in reward_item_group_list[active_tab - 1]
                    .reward_item_vo_list"
                  :key="'reward' + k"
                  :class="`item-${
                    active_tab === 1 ? 'small' : k < 6 ? 'small' : 'big'
                  }`"
                >
                  <div class="icon-box">
                    <img :src="item.icon" alt="" />
                    <div v-if="formateDay(item.diamond_worth)" class="day">
                      {{ item.diamond_worth }}
                    </div>
                  </div>
                  <div class="name">
                    <div v-if="k === 7 && active_tab !== 1" class="diamond-box">
                      <img
                        class="icon"
                        src="http://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                        alt=""
                      />
                      <span> {{ item.diamond_worth }}</span>
                    </div>
                    <div v-else>
                      {{ item.gift_name }}
                    </div>
                  </div>
                  <div class="target">
                    {{
                      sendNum(
                        image_options.tab_list[active_tab - 1].name,
                        item.received_num,
                        language
                      )
                    }}
                  </div>
                  <div
                    @click="debounceReward(1000, item)"
                    :class="`btn-common btn-${item.receive_status} btn-${
                      active_tab === 1 ? 'small' : k < 6 ? 'small' : 'big'
                    }`"
                  >
                    <span class="flex-get">{{
                      item.receive_status === 2
                        ? $t('btn-has-get')
                        : $t('btn-can-get')
                    }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 规则弹窗 -->
    <popup v-if="rule_modal" id="pop" class="flex-pop">
      <div @click="getCloseDom(true)" class="flex-pop">
        <div @click="getCloseDom(false)" id="rule" class="rule-box">
          <img
            src="http://imgcom.static.suishenyun.net/img_title2-a14cc5.png"
            class="title-rule-bg"
            alt=""
          />
          <img :src="image_options.rule_title" class="title-rule" alt="" />
          <div class="content">
            <div class="rule-desc">
              <p>
                {{ $t('rule-1') }}
              </p>
              <p>
                {{ $t('start-time') }}
              </p>
              <p>
                {{ $t('rule-2') }}
              </p>
              {{ $t('end-time') }}

              <p>
                {{ $t('rule-3') }}
              </p>
              <div class="gift-list">
                <div
                  v-for="(item, k) in gift_config_item_vo_list"
                  :key="'gifts' + k"
                  class="item"
                >
                  <div class="icon-box">
                    <img :src="item.icon" alt="" />
                  </div>
                  <div class="name">
                    {{ item.gift_name }}
                  </div>
                </div>
              </div>
              <p>
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
import {
  getAppType,
  getChannel,
  getLanguage,
  getXVerCode,
} from '../../lib/device.js';
import moment from 'moment';
import Toast from '../../components/third/toast/toast';
import pageLoading from '../../components/common/page_loading.vue';
import { sleep } from '../../lib/utils';

const getLanguageImages = () => {
  return {
    zh: {
      page_title: '超级幸运星',
      gift_title:
        'http://imgcom.static.suishenyun.net/%E4%B8%AD%E6%96%87@3x-af27a2.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E4%B8%AD%E6%96%87@3x-f12978.png',
      rule_title:
        'http://imgcom.static.suishenyun.net/%E4%B8%AD%E6%96%87@3x-b5787c.png',
      tab_list: [
        {
          id: 1,
          name: '爱心礼盒',
        },
        {
          id: 2,
          name: '宝石礼盒',
        },
        {
          id: 3,
          name: '帝皇礼盒',
        },
      ],
    },
    tw: {
      page_title: '超幸運星',
      gift_title:
        'http://imgcom.static.suishenyun.net/%E7%B9%81%E4%BD%93@3x-0d8d6a.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E7%B9%81%E4%BD%93@3x-b3e47a.png',
      rule_title:
        'http://imgcom.static.suishenyun.net/%E7%B9%81%E4%BD%93@3x-12e91f.png',
      tab_list: [
        {
          id: 1,
          name: '愛心禮盒',
        },
        {
          id: 2,
          name: '寶石禮盒',
        },
        {
          id: 3,
          name: '皇帝禮盒',
        },
      ],
    },
    en: {
      page_title: 'Super Lucky Star',
      gift_title:
        'http://imgcom.static.suishenyun.net/%E8%8B%B1%E8%AF%AD@3x-b61e41.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E8%8B%B1%E8%AF%AD@3x-bd497f.png',
      rule_title:
        'http://imgcom.static.suishenyun.net/%E8%8B%B1%E8%AF%AD@3x-aea0a9.png',
      tab_list: [
        {
          id: 1,
          name: 'Love Gift Box',
        },
        {
          id: 2,
          name: 'Gem Gift Box',
        },
        {
          id: 3,
          name: 'Emperor Gift Box',
        },
      ],
    },
    in: {
      page_title: 'Super Lucky Star',
      gift_title:
        'http://imgcom.static.suishenyun.net/%E5%8D%B0%E5%B0%BC@3x-137e2a.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E5%8D%B0%E5%B0%BC@3x-f3b68f.png',
      rule_title:
        'http://imgcom.static.suishenyun.net/%E5%8D%B0%E5%B0%BC@3x-802eda.png',
      tab_list: [
        {
          id: 1,
          name: 'Kotak Cinta',
        },
        {
          id: 2,
          name: 'Kotak Permata',
        },
        {
          id: 3,
          name: 'Kotak Kaisar',
        },
      ],
    },
    ar: {
      page_title: 'نجم  الحظ',
      gift_title:
        'http://imgcom.static.suishenyun.net/%E9%98%BF%E6%8B%89%E4%BC%AF@3x-33c83c.png',
      reward_title:
        'http://imgcom.static.suishenyun.net/%E9%98%BF%E6%8B%89%E4%BC%AF@3x-e2ad87.png',
      rule_title:
        'http://imgcom.static.suishenyun.net/%E9%98%BF%E6%8B%89%E4%BC%AF@3x-0ac1d5.png',
      tab_list: [
        {
          id: 1,
          name: 'علبة هدايا الحب',
        },
        {
          id: 2,
          name: 'علبة جوهرة',
        },
        {
          id: 3,
          name: 'علبة هدايا الملك',
        },
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
      success_status: true,
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
    };
  },
  computed: {
    // language() {
    //   return getLanguage() || 'en';
    // },
  },
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
  },
  watch: {
    rule_modal(val) {
      let main = document.getElementById('main');
      if (val) {
        this.$nextTick(() => {
          const rule_dom = document.getElementById('rule');
          rule_dom.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
          });
        });
        this.disabled_refresh = true;
        main.classList.add('dom-fix');
      } else {
        this.disabled_refresh = false;
        main.classList.remove('dom-fix');
      }
    },
    active_tab(val) {
      this.getData();
    },
  },
  methods: {
    sendNum(name, num, lang) {
      if (lang === 'tw') {
        return `送出${num}個${name}`;
      } else if (lang === 'en') {
        return `Send ${num} ${name}`;
      } else if (lang === 'in') {
        return `Kirim ${num} dari ${name}`;
      } else if (lang === 'ar') {
        return `تنازل عن ${num} من ${name}`;
      } else {
        return `送出${num}个${name}`;
      }
    },
    hasSentTips(name, num, lang) {
      if (lang === 'tw') {
        return `已送出${num}個${name}`;
      } else if (lang === 'en') {
        return `Sent ${num} ${name}`;
      } else if (lang === 'in') {
        return `Terkirim ${num}atas ${name}`;
      } else if (lang === 'ar') {
        return `تم إرسال ${num}${name}`;
      } else {
        return `已送出${num}个${name}`;
      }
    },
    needSendTips(name, num, has_num, lang) {
      let finish_ = this.reward_item_group_list[
        this.active_tab - 1
      ].reward_item_vo_list.find(
        it => !it.receive_status && it.receive_status !== 1
      );

      if (!finish_) {
        return this.$t('task-finish');
      }
      if (lang === 'tw') {
        return `再送出${num}個${name}可領取下一個獎勵`;
      } else if (lang === 'en') {
        return `You can grant the next reward after sending ${num} ${name}.`;
      } else if (lang === 'in') {
        return `Kirim ${num} lagi dari ${name} untuk menerima hadiah berikutnya`;
      } else if (lang === 'ar') {
        return `أرسل ${num}${name} مرة آخرى لتحصل على الجائزة التالية`;
      } else {
        return `再送出${num}个${name}可领取下一个奖励`;
      }
    },
    async getData() {
      const { status, data } = await request.getSuperLuckyStarList();
      if (status !== 1000) {
        this.success_status = false;
        return;
      }
      this.now_time = data.now_time;
      this.gift_config_item_vo_list = data.gift_config_item_vo_list || [];
      this.reward_item_group_list = data.reward_item_group_list || [];
      if (this.reward_item_group_list.length) {
        this.reward_type =
          this.reward_item_group_list[this.active_tab - 1].reward_type;
        this.next_info = this.gift_config_item_vo_list[this.active_tab - 1];
      }
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
     * @description: 倒计时  截止日期 为10-05
     * @return {*}
     */
    getEndTimeDown(val) {
      const now_time = moment().utc().valueOf();
      const end_date = moment('2023-10-05').endOf('days').valueOf();
      const utcTime = new Date('2023-10-05T23:59:59Z').valueOf();
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
     * @description: 领取单个奖励
     * @param {*} item
     * @return {*}
     */
    async getReward(item) {
      const { receive_status, reward_id } = item;
      if ([2].includes(receive_status)) return;
      // Toast(this.$t('toast-get'));
      let data = {
        reward_id: reward_id,
        type: this.reward_type,
        xver_code: getXVerCode(),
      };
      const { status, desc } = await request.receiveSuperLuckyStar(data);
      if (status === 1002) {
        Toast(desc);
        return;
      } else if (status === 1000) {
        Toast(this.$t('toast-get'));
        this.getData();
      } else {
        if (desc) {
          Toast(desc);
        }
        return;
      }
    },

    /**
     * @description: 点击非主体区域关闭弹窗
     * @param {*} flag
     * @return {*}
     */
    getCloseDom(flag) {
      this.rule_modal = !flag;
    },

    formateDay(val) {
      return isNaN(+val) ? true : false;
    },
  },
};
</script>
<style scoped lang="less">
.whole-content {
  min-height: 100vh;
  background: #996e28;
}
.dom-fix {
  position: fixed !important;
  min-height: 100vh;
}
.error-box {
  width: 6.9rem !important;
  height: 8.32rem !important;
  .error-tip {
    margin-top: 3rem;
    width: 100%;
    height: 0.33rem;
    text-align: center;
    font-size: 0.24rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #8b4922;
    line-height: 0.33rem;
  }
}
.main {
  width: 7.5rem;
  // min-height: 100vh;
  height: 100%;
  background: #996e28;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  padding: 0.01rem;
}
.bg-zh {
  background-image: url(../../assets/img/SuperLuckyStar/超级幸运星/中文@2x.png);
}
.bg-tw {
  background-image: url(../../assets/img/SuperLuckyStar/超级幸运星/繁体@2x.png);
}
.bg-en,
.bg-in {
  background-image: url(../../assets/img/SuperLuckyStar/超级幸运星/英语-印尼@2x.png);
}
.bg-ar {
  background-image: url(../../assets/img/SuperLuckyStar/超级幸运星/阿拉伯@2x.png);
}
.rule-icon {
  position: absolute;
  width: 0.68rem;
  height: 0.68rem;
  top: 4.74rem;
  right: 0.28rem;
}
.box-gift {
  position: relative;
  z-index: 10;
  margin: 6.16rem 0.3rem 0.4rem;
  .gifts-box {
    width: 6.9rem;
    height: 3.64rem;
    background: rgba(255, 235, 219, 0.9);
    border-radius: 0.28rem;
    border: 0.02rem solid #ffedae;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 0.92rem;
    .item {
      width: 1.6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 0.225rem;
      .icon-box {
        width: 1.6rem;
        height: 1.6rem;
        background: url('http://imgcom.static.suishenyun.net/reward-item-box-bg-4d5d19.png')
          no-repeat;
        background-size: contain;
        // background: linear-gradient(139deg, #ffffff 0%, #e5c590 100%);
        // border-radius: 0.12rem;
        // border: 0.02rem solid #ffffff;
        img {
          width: 1.4rem;
          height: 1.4rem;
          margin: 0.1rem;
        }
      }
      .name,
      .diamond {
        width: 100%;
        height: 0.24rem;
        font-size: 0.24rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8b4922;
        line-height: 0.24rem;
        margin-top: 0.1rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .diamond {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 0.36rem;
          height: 0.36rem;
        }
      }
    }
  }
}
.title-1 {
  position: absolute;
  z-index: 1;
  left: 1.53rem;
  width: 3.55rem;
  height: 0.4rem;
  top: -0.16rem;
}
.title-2 {
  width: 3.3rem;
  height: 0.78rem;
  left: 1.8rem;
  position: absolute;
  top: -0.16rem;
  z-index: 2;
}
.title-reward {
  width: 3.3rem;
  height: 0.78rem;
  left: 1.8rem;
  position: absolute;
  top: -0.16rem;
  z-index: 3;
}
.box-2 {
  width: 6.9rem;
  min-height: 10rem;
  position: relative;
  margin: 0 0.3rem 0.4rem;
}
.rewards-box {
  width: 100%;
  height: 100%;
  min-height: 10rem;
  border: 0.02rem solid #ffedae;
  position: relative;
  border-radius: 0.28rem;
  background: rgba(255, 235, 219, 0.9);
  z-index: 2;
  padding-top: 1.42rem;
  .time-down {
    font-size: 0.48rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    // font-weight: 600;
    font-weight: normal;
    color: #8b4922;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    .num {
      width: 0.82rem;
      height: 0.82rem;
      background: #fff4eb;
      border-radius: 0.18rem;
      border: 0.01rem solid #dcb392;
      margin: 0 0.05rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dot {
      height: 0.82rem;
      margin: 0 0.03rem;
    }
  }
  .tab-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.6rem 0.3rem 0.34rem;
    width: 6.3rem;
    height: 0.72rem;
    background: #0000000d;
    border-radius: 0.36rem;
    font-weight: 700;
    .item {
      width: 2.06rem;
      height: 0.6rem;
      color: #666666;
      font-size: 0.22rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
    .active-item {
      color: #8b4922;
      background: #ffffff;
      border-radius: 0.36rem;
    }
  }
  .send-notice {
    width: 6.42rem;
    height: 1.72rem;
    background: url('http://imgcom.static.suishenyun.net/yamme-send-notice-ff7003.png')
      no-repeat;
    background-size: contain;
    margin: 0 0.24rem;
    display: flex;
    align-items: center;
    padding: 0 0.2rem 0 0.26rem;
    overflow: hidden;
    .box-icon {
      width: 1.2rem;
      height: 1.2rem;
    }
    .send-desc {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: PingFangSC-Medium, PingFang SC;
      margin-left: 0.2rem;
      .last-level {
        height: 0.2rem;
        font-size: 0.2rem;
        font-weight: 500;
        color: #948476;
        line-height: 0.2rem;
      }
      .next-level {
        // height: 0.28rem;
        font-size: 0.28rem;
        font-weight: 700;
        color: #8b4922;
        line-height: 0.35rem;
        margin-top: 0.16rem;
      }
    }
  }
}

.reward-list {
  margin-top: 0.29rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #8b4922;
  .item-small {
    width: 3.15rem;
    height: 3.83rem;
    background: url('http://imgcom.static.suishenyun.net/yamme-reward-small-bg-ee52b3.png')
      no-repeat;
    background-size: contain;
    margin: 0 0.09rem 0.18rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-box {
      width: 1.34rem;
      height: 1.34rem;
      background: url('http://imgcom.static.suishenyun.net/reward-item-box-bg-4d5d19.png')
        no-repeat;
      background-size: contain;
      position: relative;
      margin-top: 0.54rem;
      img {
        width: 1.16rem;
        height: 1.16rem;
        margin: 0.07rem;
      }
      .day {
        min-width: 0.6rem;
        min-height: 0.3rem;
        background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
        border-radius: 0.15rem;
        border: 0.02rem solid #fff;
        font-size: 0.22rem;
        font-weight: 600;
        line-height: 0.22rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -0.1rem;
        right: -0.08rem;
        padding: 0.04rem 0.13rem;
      }
    }
    .name {
      width: 100%;
      height: 0.24rem;
      font-size: 0.24rem;
      font-weight: 400;
      margin-top: 0.14rem;
      text-align: center;
      line-height: 0.24rem;
    }
    .target {
      width: 100%;
      height: 0.2rem;
      font-size: 0.2rem;
      font-weight: 400;
      color: #c4c0b7;
      text-align: center;
      line-height: 0.2rem;
      margin-top: 0.12rem;
      margin-bottom: 0.2rem;
    }
  }
  .diamond-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      width: 0.36rem;
      height: 0.36rem;

      margin-right: 0.05rem;
    }
  }
  .btn-0 {
    background: linear-gradient(113deg, #d8b27d 0%, #f3d79a 100%);
    box-shadow: inset -0.01rem 0.01rem 0.03rem 0 rgba(255, 255, 255, 0.5);
    color: #8b4922;
    opacity: 0.4;
  }
  .btn-2 {
    background: #efeeef;
    color: #b3b3b3;
  }
  .btn-1 {
    background: linear-gradient(113deg, #d8b27d 0%, #f3d79a 100%);
    box-shadow: inset -0.01rem 0.01rem 0.03rem 0 rgba(255, 255, 255, 0.5);
    color: #8b4922;
  }
  .btn-small {
    width: 1.83rem;
    height: 0.6rem;
  }
  .btn-big {
    width: 5.1rem;
    height: 0.9rem;
  }
  .btn-common {
    border-radius: 0.12rem;
    font-size: 0.26rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-get {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.26rem;
    line-height: 0.26rem;
  }
  .item-big {
    width: 6.42rem;
    height: 5.43rem;
    background: url('http://imgcom.static.suishenyun.net/yamme-reward-big-bg-3afbc0.png')
      no-repeat;
    background-size: contain;
    margin-bottom: 0.18rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: PingFangSC-Semibold, PingFang SC;

    .icon-box {
      width: 2.64rem;
      height: 2.64rem;
      background: url('http://imgcom.static.suishenyun.net/reward-item-box-big-bg-c18fbb.png')
        no-repeat;
      background-size: contain;
      position: relative;
      margin-top: 0.54rem;
      img {
        width: 1.8rem;
        height: 1.8rem;
        margin: 0.42rem;
      }
      .day {
        min-width: 0.6rem;
        min-height: 0.3rem;
        background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
        border-radius: 0.15rem;
        border: 0.02rem solid #fff;
        font-size: 0.22rem;
        font-weight: 600;
        color: #8b4922;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -0.1rem;
        right: -0.13rem;
        padding: 0.04rem 0.13rem;
      }
    }
    .name {
      width: 100%;
      height: 0.33rem;
      font-size: 0.24rem;
      font-weight: 400;
      color: #8b4922;
      line-height: 0.33rem;
      text-align: center;
      margin-top: 0.14rem;
    }
    .target {
      width: 100%;
      text-align: center;
      height: 0.2rem;
      font-size: 0.2rem;
      font-weight: 400;
      color: #c4c0b7;
      line-height: 0.2rem;
      margin-top: 0.12rem;
      margin-bottom: 0.2rem;
    }
  }
}

.flex-pop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.rule-box {
  width: 6.3rem;
  height: 7.8rem;
  position: relative;
  z-index: 2;
  .title-rule-bg {
    position: absolute;
    z-index: 1;
    left: 1.61rem;
    width: 3.09rem;
    height: 0.4rem;
    top: -0.16rem;
  }
  .title-rule {
    width: 2.6rem;
    height: 0.78rem;
    left: 1.85rem;
    top: -0.16rem;
    position: absolute;
    z-index: 10;
  }
  .content {
    width: 100%;
    height: 100%;
    background: rgba(255, 235, 219, 0.9);
    border-radius: 0.28rem;
    border: 0.02rem solid #ffedae;
    position: relative;
    z-index: 2;
    font-size: 0.26rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8b4922;
    line-height: 1.5;
    padding: 1.02rem 0.5rem 0.4rem;
    .rule-desc {
      height: 6.5rem;
      overflow-y: auto;
    }
  }
}
.close-btn {
  width: 100%;
  height: 0.5rem;
  text-align: center;
  margin-top: 0.6rem;
  img {
    width: 0.5rem;
    height: 0.5rem;
  }
}
.gift-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: hidden;
  margin: 0.3rem 0;
  .item {
    display: flex;
    flex-direction: column;
    width: 1.6rem;
    font-size: 0.24rem;
    font-weight: 400;
    color: #8b4922;
    align-items: center;
    font-family: PingFangSC-Regular, PingFang SC;
    .icon-box {
      width: 100%;
      height: 1.6rem;
      background: url(http://imgcom.static.suishenyun.net/reward-item-box-bg-4d5d19.png)
        no-repeat;
      background-size: contain;
      img {
        width: 1.4rem;
        height: 1.4rem;
        margin: 0.1rem;
      }
    }
    .name {
      height: 0.33rem;
      line-height: 0.33rem;
      margin-top: 0.16rem;
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}
</style>
