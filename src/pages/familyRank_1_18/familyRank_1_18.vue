<template>
  <div
    :style="{
			backgroundColor: bgColor,
			paddingTop: tab === 'NEW' ? safe_height + 0.6 + 0.2 + 'rem' : '7rem',
		}"
    :class="['main', tab]"
  >
    <page-loading v-if="page_loading"></page-loading>

    <div
      :style="{
				paddingTop: safe_height + 'rem',
				height:
					tab === 'NEW'
						? safe_height + 0.6 + 0.2 + 'rem'
						: safe_height + 0.6 + 0.6 + 0.4 + 'rem',
				backgroundColor: headerBgVisible ? headerBgColor : '',
			}"
      class="page-header"
    >
      <div class="header-container">
        <div class="back" @click="back">
          <img
            :style="{ top: safe_height + 0.24 + 'rem' }"
            src="../../assets/img/common/icon_back_white.png"
            alt=""
          />
        </div>
        <div class="tab-div">
          <div class="tab1">
						<span
              :class="{ active: tab === 'WEALTH' }"
              @click="changeTab('WEALTH')"
            >{{ $t('power_ranking') }}</span
            >
          </div>
          <div class="tab4">
						<span
              :class="{ active: tab === 'NEW' }"
              @click="changeTab('NEW')"
            >{{ $t('family') }}</span
            >
          </div>
        </div>

        <div class="search" @click="search">
          <img
            :style="{ top: safe_height + 0.24 + 'rem' }"
            src="https://yaame-static.yaame.io/admin/763a6e5dc33a5dd494ece4116a79b7ca.png"
            alt=""
          />
        </div>
      </div>

      <div v-if="tab !== 'NEW'" class="switch-container">
        <div class="switch-box">
          <div
            :class="[
							time_type === 'DAY' ? 'active' : '',
							time_type === 'DAY' ? switchClass : '',
							'switch-item',
						]"
            @click="changeTimeType('DAY')"
          >
            {{ $t("dayList") }}
          </div>
          <div
            :class="[
							time_type === 'WEEK' ? 'active' : '',
							time_type === 'WEEK' ? switchClass : '',
							'switch-item',
						]"
            @click="changeTimeType('WEEK')"
          >
            {{ $t("weeklyList") }}
          </div>
          <div
            :class="[
							'switch-item',
							time_type === 'MONTH' ? 'active' : '',
							time_type === 'MONTH' ? switchClass : '',
						]"
            @click="changeTimeType('MONTH')"
          >
            {{ $t("monthlyList") }}
          </div>
        </div>

        <img
          v-if="tab === 'WEALTH'"
          src="https://yaame-static.yaame.io/admin/b2a0abaaf7cf012c470d2ce5fd84d529.png"
          class="info-img"
          @click="toRule"
        />
      </div>
    </div>
    <div v-if="tab === 'NEW'" class="new-container">
      <refresh
        ref="newRefresh"
        style="min-height: 80vh"
        @onRefresh="handleNewRefresh"
      >
        <ul
          v-infinite-scroll="loadNewMore"
          :infinite-scroll-immediate-check="true"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <li
            v-for="(item, index) in newList"
            :key="index"
            class="new-item"
            @click="toDetails(item)"
          >
            <img :src="item.avatar" class="avatar" alt="" />
            <div class="info no-wrap">
              <div class="name no-wrap">{{ item.name }}</div>
              <div class="family-id">ID: {{ item.family_flag }}</div>
              <div class="user-number">
                <div class="icon" :style="{ backgroundImage: `url(${item.level_bg_icon})` }"><img :src="item.level_badge" alt="" />LV.{{ item.family_level }}</div>
                <div class="member-cnt">
                  <img
                    src="https://yaame-static.yaame.io/admin/f971c912b544be42232b803566a983e8.png"
                    alt=""
                  />
                  <div class="number">{{ item.member_cnt }}/{{ item.max_member_cnt }}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="newList.length === 0" class="empty-div">
          <img
            src="http://imgcom.static.suishenyun.net/quesheng_img_wuxiaoxi_black@2x-c8ddb9.png"
            alt=""
          />
          <p>{{ $t("empty") }}</p>
        </div>
      </refresh>
    </div>
    <template v-else>
      <div class="top-container">
        <div class="top2">
          <div class="frame"></div>
          <div class="click" @click="toDetails(top2)"></div>
          <img class="avatar" :src="top2.avatar" alt="" />
          <div class="name no-wrap">{{ top2.name }}</div>
          <div v-if="top2.level_badge" class="icon" :style="{ backgroundImage: `url(${top2.level_bg_icon})` }"><img :src="top2.level_badge" alt="" />LV.{{ top2.family_level }}</div>
          <p class="no-wrap">
            <img :src="top2.integral_icon" alt="" />{{ top2.integral ? top2.integral : ''}}
          </p>
        </div>
        <div class="top1">
          <div class="frame"></div>
          <div class="click" @click="toDetails(top1)"></div>
          <img class="avatar" :src="top1.avatar" alt="" />
          <div class="name no-wrap">{{ top1.name }}</div>
          <div v-if="top1.level_badge" class="icon" :style="{ backgroundImage: `url(${top1.level_bg_icon})` }"><img :src="top1.level_badge" alt="" />LV.{{ top1.family_level }}</div>
          <p class="no-wrap">
            <img :src="top1.integral_icon" alt="" />{{ top1.integral ? top1.integral : ''}}
          </p>
        </div>
        <div class="top3">
          <div class="frame"></div>
          <div class="click" @click="toDetails(top3)"></div>
          <img class="avatar" :src="top3.avatar" alt="" />
          <div class="name no-wrap">{{ top3.name }}</div>
          <div v-if="top3.level_badge" class="icon" :style="{ backgroundImage: `url(${top3.level_bg_icon})` }"><img :src="top3.level_badge" alt="" />LV.{{ top3.family_level }}</div>
          <p class="no-wrap">
            <img :src="top3.integral_icon" alt="" />{{ top3.integral ? top3.integral : ''}}
          </p>
        </div>
      </div>

      <div :class="['list-container', tab]">
        <refresh
          style="min-height: 46vh"
          class="refresh"
          ref="wlRefresh"
          @onRefresh="handleRefresh"
        >
          <div
            v-infinite-scroll="loadMore"
            v-if="list && list.length"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
          >
            <div v-for="(item, index) in list" :key="index" class="list-item">
              <div class="sort">{{ item.family_rank }}</div>
              <img
                :src="item.avatar"
                class="avatar"
                alt=""
                @click="toDetails(item)"
              />
              <div class="info">
                <p class="no-wrap">
                  {{ item.name }}
                </p>
                <div class="user-number">
                  <div class="icon" :style="{ backgroundImage: `url(${item.level_bg_icon})` }"><img :src="item.level_badge" alt="" />LV.{{ item.family_level }}</div>
                  <div class="member-cnt">
                    <img
                      src="https://yaame-static.yaame.io/admin/b509bb3ff93677fb74310223738ff3d4.png"
                      alt=""
                    />
                    <div class="number">{{ item.member_cnt }}/{{ item.max_member_cnt }}</div>
                  </div>
                  <div class="num">
                    <img :src="item.integral_icon" alt="" />
                    {{ item.integral }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <p>{{ $t("NotOnTheListYet") }}</p>
          </div>
        </refresh>
      </div>

      <div v-if="my_rank" :class="['user-info', tab]">
        <div class="sort">
          {{ (my_rank.family_rank <= 99 && my_rank.family_rank >= 1) ? my_rank.family_rank : "99+" }}
        </div>
        <img
          :src="my_rank.avatar"
          class="avatar"
          alt=""
          @click="toDetails(my_rank)"
        />
        <div class="info">
          <p class="no-wrap">
            {{ my_rank.name }}
          </p>
          <div class="user-number">
            <div class="icon" :style="{ backgroundImage: `url(${my_rank.level_bg_icon})` }"><img :src="my_rank.level_badge" alt="" />LV.{{ my_rank.family_level }}</div>
            <div class="member-cnt">
              <img
                src="https://yaame-static.yaame.io/admin/b509bb3ff93677fb74310223738ff3d4.png"
                alt=""
              />
              <div class="number">{{ my_rank.member_cnt }}/{{ my_rank.max_member_cnt }}</div>
            </div>
            <div class="num">
              <img :src="my_rank.integral_icon" alt="" />
              {{ my_rank.integral }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="!createBtn" class="create-btn" @click="createFamily">
      {{ $t("createFamily") }}
    </div>

    <!--弹窗-->
    <popup class="popup" v-show="hintWin" @cancel="hintWin = false">
      <div class="hint">
        <div class="head">{{ $t('tips') }}</div>
        <p>{{ txt }}</p>
        <div class="button" @click="hintWin = false">OK</div>
      </div>
      <div class="rule-page-close" @click="hintWin = false"></div>
    </popup>
  </div>
</template>
<script>
import pageLoading from "../../components/common/page_loading.vue";
import request from "../../lib/request/family.js";
import { getLanguage, getSafeHeight } from "../../lib/device.js";
import {getScrollTop, getQueryString, burialPointFun} from "../../lib/utils";
import define from "../../lib/define.js";
import refresh from "../../components/common/refresh.vue";
import { Toast } from "vant";
import popup from "@/components/common/pop_up.vue";

const getDefaultItem = () => {
  return {
    avatar:
      "https://yaame-static.yaame.io/admin/6b4037f1d2f32fc134f2892b68058cae.png",
    family_id: null,
    name: "-",
    family_rank: -1,
    integral: 0,
    integral_icon: "",
    level_badge: "",
    member_cnt: "-",
  };
};
export default {
  components: {
    pageLoading,
    refresh,
    popup
  },
  data() {
    return {
      safe_height: 0,
      page_loading: true,

      tab: getQueryString("active") || "WEALTH",
      time_type: getQueryString("time_type") || "WEEK",
      headerBgVisible: false,

      list: [],
      top1: getDefaultItem(),
      top2: getDefaultItem(),
      top3: getDefaultItem(),
      my_rank: false,

      page: 1,
      has_next: true,

      define,

      newPage: 1,
      new_has_next: true,
      newList: [],

      family_my_rank: false,

      hintWin: false,
      txt: '',
      createBtn: false
    };
  },
  async mounted() {
    // 埋点
    burialPointFun({
      event_name: "page_view_rank",
      cid: -1024,
      md: 112,
      args_name: "",
      args: "",
    });

    const safe_area = getSafeHeight() || 40;
    this.safe_height = (safe_area * 2) / 100;

    this.page_loading = false;

    window.addEventListener("scroll", this.pageChange, false);

    await this.getData();
    await this.getNewData();

    let self = this;

    window.getData = async function () {
      console.log("触发getData");
      await self.getData("WEALTH");
      await self.getNewData();
    };
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.pageChange, false);
    delete window.getData;
  },
  computed: {
    switchClass() {
      const classEnum = {
        WEALTH: "color-wealth bg-white",
        STAR: "color-star bg-white",
        ACTIVE: "color-active bg-white",
      };
      return classEnum[this.tab];
    },
    // 背景颜色
    headerBgColor() {
      switch (this.tab) {
        case "WEALTH":
          return "#2E1800";
        case "STAR":
          return "#CA5C81";
        case "ACTIVE":
          return "#7B65BF";
        case "NEW":
          return "#181E33";
        default:
          return "#904D19";
      }
    },
    bgColor() {
      switch (this.tab) {
        case "WEALTH":
          return "#492E18";
        case "STAR":
          return "#41192B";
        case "ACTIVE":
          return "#2C2752";
        case "NEW":
          return "#181E33";
        default:
          return "#311B0D";
      }
    },

    language() {
      return getLanguage();
    },
  },
  watch: {
    bgColor: {
      handler(val) {
        document.body.style.backgroundColor = val;
      },
      immediate: true,
    },
  },
  methods: {
    back() {
      location.href = "wlyaame://webview/back";
    },
    changeTab(val) {
      this.tab = val;
      if (val === "NEW") {
        this.newPage = 1;
        this.getNewData();
      } else {
        this.page = 1;
        this.getData();
      }
    },
    changeTimeType(val) {
      this.time_type = val;
      this.getData();
    },
    async getData(val) {
      if (val) {
        console.log("进入方法内部");
      }
      try {
        let tabValue = this.tab;
        if (tabValue === 'NEW') {
          tabValue = 'WEALTH';
        }

        let res = await request.getFamilyRank({
          familyRankTimeCycleType: this.time_type,
          familyRankType: val || tabValue,
          page: this.page,
          size: 30,
        });
        if (res.status !== 1000) return;

        if (res.data.my_rank) {
          this.my_rank = res.data.my_rank;
        }

        if (this.page === 1) {
          this.top1 = res.data.content[0] || getDefaultItem();
          this.top2 = res.data.content[1] || getDefaultItem();
          this.top3 = res.data.content[2] || getDefaultItem();

          if (res.data.content && res.data.content.length) {
            this.list = res.data.content.slice(3);
          } else {
            this.list = [];
          }
        } else {
          if (res.data.content && res.data.content.length) {
            this.list = this.list.concat(res.data.content);
          }
        }
        this.has_next = res.data.has_next;
      } catch (error) {
        console.log(error);
      }
    },
    loadMore() {
      if (this.has_next) {
        this.page++;
        this.getData();
      }
    },
    loadNewMore() {
      if (this.new_has_next) {
        this.newPage++;
        this.getNewData();
      }
    },
    async handleRefresh() {
      this.page = 1;
      await this.getData();
      setTimeout(() => {
        this.$refs.wlRefresh.isLoading = false;
      }, 500);
    },
    pageChange() {
      const scroll_top = getScrollTop();
      if (scroll_top > 10) {
        this.headerBgVisible = true;
      } else {
        this.headerBgVisible = false;
      }
    },

    async handleNewRefresh() {
      this.newPage = 1;
      await this.getNewData();
      setTimeout(() => {
        this.$refs.newRefresh.isLoading = false;
      }, 500);
    },
    async getNewData() {
      try {
        let res = await request.getFamilyNew({
          page: this.newPage,
          size: 30,
        });
        if (res.status !== 1000) return;
        if (this.newPage === 1) {
          this.newList = res.data.content;
        } else {
          this.newList = this.newList.concat(res.data.content);
        }

        if (res.data.my_family_info) {
          this.family_my_rank = res.data.my_family_info;
          this.createBtn = true;
        } else {
          this.family_my_rank = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    toRule() {
      location.href = "./familyRule_1_18.html";
    },
    async createFamily() {
      try {
        Toast.loading({
          message: this.$t('loadingText'),
          forbidClick: true,
        });
        const res = await request.getCheckApi();
        Toast.clear();
        if (res.status !== 1000) {
          this.hintWin = true;
          this.txt = res.desc;
          return;
        }
        await this.getNewData();

        if (this.family_my_rank) {
          Toast(this.$t('joinedFamily', [this.family_my_rank.name])) // 提示已经加入家族
          return
        }
        location.href = "wlyaame://family/editor?from=from_create";
      } catch (err) {
        console.log(err);
      }
    },
    toDetails(val) {
      if (val.scheme_url) {
        location.href = val.scheme_url;
      }
    },
    search() {
      location.href = "wlyaame://family/search";
    },
  },
};
</script>
<style scoped lang="less">
.main {
  width: 7.5rem;
  min-height: 100vh;
  color: #fff;
  font-size: 0.24rem;
  background-size: contain;
  background-repeat: no-repeat;

  position: relative;
  padding-bottom: 1.1rem;
  &.WEALTH {
    background-image: url(https://yaame-static.yaame.io/admin/6801d8646976ef36fda5c5413a5c6ddf.jpg);
  }
  .page-header {
    position: fixed;
    top: 0;
    z-index: 9;
    font-size: 0.32rem;
    font-weight: bold;

    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0;
    height: 1.6rem;
    .header-container {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 0.6rem;
      width: 7.5rem;
      padding: 0 1rem;
      .back {
        position: absolute;
        left: 0.2rem;
        width: 0.4rem;
        height: 0.4rem;
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
      .search {
        position: absolute;
        right: 0.2rem;
        width: 0.4rem;
        height: 0.4rem;
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
      span {
        position: relative;
        &.active {
          font-size: 0.32rem;
          font-weight: 600;
          color: #fff;
          position: relative;
        }
      }
      .tab-div {
        min-width: 2rem;
        height: 0.6rem;
        display: flex;
        flex-wrap: nowrap;
        overflow-y: scroll;
        justify-content: space-between;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .tab1,
        .tab4 {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .tab4 {
          margin-left: .3rem;
        }
      }
    }
    .switch-container {
      width: 7.5rem;
      height: 0.6rem;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.2rem;
      .switch-box {
        width: 4.32rem;
        height: 0.6rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.34rem;
        display: flex;
        .switch-item {
          flex: 1;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          font-size: 0.24rem;
          border-radius: 0.34rem;
          font-weight: bold;

          overflow: hidden;
          &.active {
            background-color: #fff;
          }
        }
      }
      .info-img {
        width: 0.4rem;
        height: 0.4rem;
        position: absolute;
        top: 0.1rem;
        right: 0.3rem;
      }
    }
  }
  .top-container {
    position: absolute;
    top: 2.98rem;
    display: flex;
    justify-content: space-between;
    color: #333333;
    .click {
      position: absolute;
      top: .47rem;
      left: .72rem;
      width: 1.12rem;
      height: 1.12rem;
      z-index: 2;
    }
    .top2,
    .top3 {
      position: absolute;
      width: 2.56rem;
      height: 3.98rem;
      .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .avatar {
        width: 1.12rem;
        height: 1.12rem;
        margin: .47rem 0 0 .72rem;
      }
      .name {
        position: absolute;
        top: 2rem;
        left: 50%;
        width: 2rem;
        height: .24rem;
        line-height: .24rem;
        transform: translateX(-50%);
        font-size: .24rem;
        color: #FFFFFF;
        z-index: 2;
        text-align: center;
      }
      .icon {
        display: flex;
        align-items: center;
        position: absolute;
        top: 2.36rem;
        left: 50%;
        transform: translateX(-50%);
        min-width: .96rem;
        height: .3rem;
        padding: 0 .09rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-weight: 600;
        font-size: .2rem;
        color: #FFFFFF;
        z-index: 2;
        img {
          width: .29rem;
          height: .25rem;
        }
      }
      p {
        position: absolute;
        top: 2.84rem;
        left: 50%;
        transform: translateX(-50%);
        width: 2rem;
        height: .28rem;
        line-height: .28rem;
        text-align: center;
        z-index: 2;
        font-size: .22rem;
        color: #FFFFFF;
        img {
          width: 0.21rem;
          height: auto;
          vertical-align: middle;
        }
      }
    }
    .top1 {
      position: absolute;
      top: -0.6rem;
      left: 2.47rem;
      width: 2.56rem;
      height: 3.98rem;
      .click {
        top: .5rem;
      }
      .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(https://yaame-static.yaame.io/admin/ea13716b1d6f37e20a9d5c612aa808b4.png);
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .avatar {
        width: 1.12rem;
        height: 1.12rem;
        margin: .5rem 0 0 .72rem;
      }
      .name {
        position: absolute;
        top: 2rem;
        left: 50%;
        width: 2rem;
        height: .24rem;
        line-height: .24rem;
        transform: translateX(-50%);
        font-size: .24rem;
        color: #FFFFFF;
        z-index: 2;
        text-align: center;
      }
      .icon {
        display: flex;
        align-items: center;
        position: absolute;
        top: 2.36rem;
        left: 50%;
        transform: translateX(-50%);
        min-width: .96rem;
        height: .3rem;
        padding: 0 .09rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-weight: 600;
        font-size: .2rem;
        color: #FFFFFF;
        z-index: 2;
        img {
          width: .29rem;
          height: .25rem;
        }
      }
      p {
        position: absolute;
        top: 2.84rem;
        left: 50%;
        transform: translateX(-50%);
        width: 2rem;
        height: .28rem;
        line-height: .28rem;
        text-align: center;
        z-index: 2;
        font-size: .22rem;
        color: #FFFFFF;
        img {
          width: 0.21rem;
          height: auto;
          vertical-align: middle;
        }
      }
    }
    .top2 {
      left: 0;
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/bb552e1ed2a0882ec8cbd2c06f75900c.png);
      }
    }
    .top3 {
      left: 4.94rem;
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/e732a7897f2fb4bae89a121ff35eda75.png);
      }
    }
  }
  .list-container {
    width: 6.9rem;
    margin: .2rem auto 0;
    padding: 0.20rem 0.20rem .1rem;

    &.WEALTH {
      width: 6.9rem;
      background: #6A4316;
      border-radius: .24rem .24rem .08rem .08rem;
      .list-item {
        background: #543915;
        border: .02rem solid #B68461;
      }
    }
    .list-item {
      position: relative;
      width: 6.5rem;
      height: 1.2rem;
      background: #8f511b;
      border-radius: 0.2rem;
      border: 0.02rem solid #af6423;
      margin-bottom: 0.1rem;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .sort {
        width: 0.76rem;
        text-align: center;
        font-weight: 600;
        font-size: 0.26rem;
      }
      .avatar {
        display: inline-block;
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 0.2rem;
        margin-right: 0.3rem;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        width: 4.3rem;
        p {
          font-size: 0.24rem;
          font-weight: 400;
          margin-bottom: 0.12rem;
        }
        .user-number {
          display: flex;
          width: 4.34rem;
          .icon {
            display: flex;
            align-items: center;
            min-width: .96rem;
            height: .3rem;
            margin-right: .1rem;
            padding: 0 .09rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            font-weight: 600;
            font-size: .2rem;
            color: #FFFFFF;
            img {
              width: .29rem;
              height: .25rem;
            }
          }
          .member-cnt {
            display: flex;
            height: 0.3rem;
            border-radius: 0.15rem;
            background-color: rgba(255, 255, 255, 0.6);
            padding: .06rem .16rem;
            position: relative;
            img {
              display: inline;
              width: 0.22rem;
              height: .16rem;
            }
            .number {
              display: inline;
              height: .3rem;
              line-height: .3rem;
              font-weight: 600;
              font-size: .2rem;
              color: #543915;
              text-align: left;
              margin-bottom: 0;
              transform: scale(0.8333);
              position: relative;
              top: -0.06rem;
              left: 0.06rem;
            }
          }
          .num {
            position: absolute;
            right: 0;
            bottom: 0;
            text-align: center;
            font-weight: 400;
            font-size: .24rem;
            color: #FFFFFF;
            img {
              width: 0.28rem;
              height: .28rem;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  .user-info {
    position: fixed;
    z-index: 9;
    bottom: -0.04rem;
    width: 7.5rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding-right: 0.4rem;

    &.WEALTH {
      background: url("https://yaame-static.yaame.io/admin/089a442e21ca07659e7a67b60cddd1d1.png") no-repeat;
      background-size: contain;
    }
    .sort {
      width: .96rem;
      text-align: center;
      font-weight: 600;
      font-size: 0.26rem;
    }
    .avatar {
      display: inline-block;
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 0.2rem;
      margin-right: 0.2rem;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      width: 5.3rem;
      p {
        font-size: 0.24rem;
        font-weight: 400;
        margin-bottom: 0.12rem;
      }
      .user-number {
        display: flex;
        width: 4.34rem;
        .icon {
          display: flex;
          align-items: center;
          min-width: .96rem;
          height: .3rem;
          margin-right: .1rem;
          padding: 0 .09rem;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          font-weight: 600;
          font-size: .2rem;
          color: #FFFFFF;
          img {
            width: .29rem;
            height: .25rem;
          }
        }
        .member-cnt {
          display: flex;
          height: 0.3rem;
          border-radius: 0.15rem;
          background-color: rgba(255, 255, 255, 0.6);
          padding: .06rem .16rem;
          position: relative;
          img {
            display: inline;
            width: 0.22rem;
            height: .16rem;
          }
          .number {
            display: inline;
            height: .3rem;
            line-height: .3rem;
            font-weight: 600;
            font-size: .2rem;
            color: #543915;
            text-align: left;
            margin-bottom: 0;
            transform: scale(0.8333);
            position: relative;
            top: -0.06rem;
            left: 0.06rem;
          }
        }
        .num {
          position: absolute;
          right: 0;
          bottom: 0;
          text-align: center;
          font-weight: 400;
          font-size: .24rem;
          color: #FFFFFF;
          img {
            width: 0.28rem;
            height: .28rem;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .new-container {
    width: 6.9rem;
    height: 80vh;
    margin-left: 0.3rem;
    .new-item {
      width: 6.9rem;
      height: 1.8rem;
      background: #20263c;
      border-radius: 0.18rem;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;
      .avatar {
        width: 1.4rem;
        height: 1.4rem;
        display: block;
        border-radius: 0.2rem;
      }
      .info {
        color: #fff;
        margin-left: 0.2rem;
        width: 5rem;
        .user-number {
          display: flex;
          width: 4.34rem;
          margin-top: .2rem;
          .icon {
            min-width: .96rem;
            height: .3rem;
            margin-right: .1rem;
            padding: 0 .09rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            font-weight: 600;
            font-size: .2rem;
            color: #FFFFFF;
            img {
              width: .29rem;
              height: .25rem;
            }
          }
          .member-cnt {
            display: flex;
            height: 0.3rem;
            border-radius: 0.15rem;
            background-color: rgba(255, 255, 255, 0.6);
            padding: .06rem .16rem;
            position: relative;
            img {
              display: inline;
              width: 0.22rem;
              height: .16rem;
            }
            .number {
              display: inline;
              height: .3rem;
              line-height: .3rem;
              font-weight: 600;
              font-size: .2rem;
              color: #20263C;
              text-align: left;
              margin-bottom: 0;
              transform: scale(0.8333);
              position: relative;
              top: -0.06rem;
              left: 0.06rem;
            }
          }
          .num {
            position: absolute;
            right: .3rem;
            text-align: center;
            font-weight: 400;
            font-size: .24rem;
            color: #FFFFFF;
            img {
              width: 0.28rem;
              height: .28rem;
              vertical-align: middle;
            }
          }
        }
        .name {
          width: 5rem;
          height: .32rem;
          margin-bottom: .12rem;
          line-height: .32rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: #ffffff;
          img {
            width: 0.36rem;
            height: 0.36rem;
            vertical-align: middle;
          }
        }
        .family-id {
          height: .26rem;
          line-height: .26rem;
          font-size: 0.26rem;
          font-weight: 400;
          color: #797c8a;
        }
        .member-cnt {
          display: inline-flex;
          height: 0.3rem;
          border-radius: 0.15rem;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.07rem 0.2rem 0.07rem 0.12rem;
          position: relative;
          img {
            display: inline;
            width: 0.2rem;
            height: auto;
          }
          p {
            display: inline;
            color: #fff;
            font-size: 0.2rem;
            text-align: left;
            margin-bottom: 0;
            transform: scale(0.8333);
            position: relative;
            top: -0.06rem;
            left: 0.06rem;
          }
        }
      }
    }
    .empty-div {
      /* padding: 0 0 .5rem; */
      text-align: center;
      font-size: 0.28rem;
      color: #666;
      font-weight: normal;
      margin-top: 3.5rem;

      img {
        width: 2.8rem;
        height: auto;
        margin-bottom: 0.2rem;
      }
      p {
        color: #fff;
        font-size: 0.28rem;
      }
    }
  }

  .hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5.9rem;
    height: 4.01rem;
    border-radius: .24rem;
    background: #FFFFFF url("https://yaame-static.yaame.io/admin/53bf8aaba73b951a9e97ef9f0270c626.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .head {
      display: flex;
      align-items: center;
      margin: .6rem 0 .21rem .5rem;
      font-weight: 600;
      font-size: .34rem;
      color: #333333;
      line-height: .48rem;
    }
    p {
      width: 4.9rem;
      margin: 0 auto .5rem;
      font-weight: 400;
      font-size: .26rem;
      color: #666666;
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
      width: 4.3rem;
      height: .88rem;
      margin-left: .8rem;
      border-radius: .50rem;
      font-weight: 600;
      font-size: .3rem;
      color: #FFFFFF;
      background: linear-gradient(90deg, #63DF6D, #4CC9A4);
    }
  }
}
.empty {
  width: 6.34rem;
  height: 3.94rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.28rem;
  font-weight: normal;
}
.color-wealth {
  color: #8f4d20;
}
.color-star {
  color: #9e2359;
}
.color-active {
  color: #7418ac;
}
.bg-white {
  background-color: #fff;
}

.create-btn {
  background-image: url(https://yaame-static.yaame.io/admin/67e66f179d463ab8ce5723a7f01b3443.png);
  width: 5.8rem;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  position: fixed;
  bottom: 1rem;
  left: 0.85rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
