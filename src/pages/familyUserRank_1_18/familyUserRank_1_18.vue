<template>
  <div
    :style="{
			backgroundColor: bgColor,
		}"
    :class="['main', tab]"
  >
    <page-loading v-if="page_loading"></page-loading>

    <div
      :style="{
				paddingTop: safe_height + 'rem',
				height: safe_height + 0.6 + 0.6 + 0.4 + 'rem',
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
        <div class="tab1">
					<span
            :class="{ active: tab === 'WEALTH' }"
            @click="changeTab('WEALTH')"
          >{{ $t('contribution_ranking') }}</span>
        </div>
      </div>

      <div class="switch-container">
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
      </div>
    </div>
    <div class="top-container">
      <div class="top2">
        <div class="frame"></div>
        <div class="click" @click="toDetails(top2)"></div>
        <img class="avatar" :src="top2.avatar" alt="" />
        <div class="name no-wrap">{{ top2.nick_name }}</div>
        <img v-if="top2.img_tags && top2.img_tags[0]" class="icon" :src="top2.img_tags[0].image_url" alt=""></img>
        <p class="no-wrap">
          <img :src="top2.integral_icon" alt="" />{{ top2.integral ? top2.integral : ''}}
        </p>
      </div>
      <div class="top1">
        <div class="frame"></div>
        <div class="click" @click="toDetails(top1)"></div>
        <img class="avatar" :src="top1.avatar" alt="" />
        <div class="name no-wrap">{{ top1.nick_name }}</div>
        <img v-if="top1.img_tags && top1.img_tags[0]" class="icon" :src="top1.img_tags[0].image_url" alt=""></img>
        <p class="no-wrap">
          <img :src="top1.integral_icon" alt="" />{{ top1.integral ? top1.integral : ''}}
        </p>
      </div>
      <div class="top3">
        <div class="frame"></div>
        <div class="click" @click="toDetails(top3)"></div>
        <img class="avatar" :src="top3.avatar" alt="" />
        <div class="name no-wrap">{{ top3.nick_name }}</div>
        <img v-if="top3.img_tags && top3.img_tags[0]" class="icon" :src="top3.img_tags[0].image_url" alt=""></img>
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
            <div class="sort">{{ item.family_member_rank }}</div>
            <img
              :src="item.avatar"
              class="avatar"
              alt=""
              @click="toDetails(item)"
            />
            <div class="info">
              <p class="no-wrap">
                {{ item.nick_name }}
              </p>
              <div class="user-number">
                <img class="icon" v-for="(ite, inx) in item.img_tags" :key="inx" :src="ite.image_url" alt=""></img>
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
      <div class="sort">{{ (my_rank.family_member_rank <= 99 && my_rank.family_member_rank >= 1) ? my_rank.family_member_rank : "99+" }}</div>
      <img
        :src="my_rank.avatar"
        class="avatar"
        alt=""
        @click="toDetails(my_rank)"
      />
      <div class="info">
        <p class="no-wrap">
          {{ my_rank.nick_name }}
        </p>
        <div class="user-number">
          <img class="icon" v-for="(ite, inx) in my_rank.img_tags" :key="inx" :src="ite.image_url" alt=""></img>
          <div class="num">
            <img :src="my_rank.integral_icon" alt="" />
            {{ my_rank.integral }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageLoading from "../../components/common/page_loading.vue";
import request from "../../lib/request/family.js";
import { getLanguage, getSafeHeight } from "../../lib/device.js";
import {getScrollTop, getQueryString, burialPointFun} from "../../lib/utils";
import refresh from "../../components/common/refresh.vue";
const getDefaultItem = () => {
  return {
    avatar:
      "https://yaame-static.yaame.io/admin/6b4037f1d2f32fc134f2892b68058cae.png",
    uid: null,
    nick_name: "-",
    family_member_rank: -1,
    integral: 0,
    integral_icon: "",
    member_cnt: "-",
    img_tags: [],
  };
};
export default {
  components: {
    pageLoading,
    refresh,
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
    };
  },
  mounted() {
    // 埋点
    burialPointFun({
      event_name: "page_view_member_rank",
      cid: -1025,
      md: 112,
      args_name: "",
      args: "",
    });

    const safe_area = getSafeHeight() || 40;
    this.safe_height = (safe_area * 2) / 100;

    this.page_loading = false;

    window.addEventListener("scroll", this.pageChange, false);

    if (this.tab === "NEW") {
      this.tab = "WEALTH";
    }
    let self = this;
    self.getData();
    window.getData = function () {
      self.getData();
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
          return "#301A00";
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
          return "#301A00";
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
      this.page = 1;
      this.getData();
    },
    changeTimeType(val) {
      this.time_type = val;
      this.getData();
    },
    async getData() {
      try {
        let res = await request.getFamilyMemberRank({
          familyRankTimeCycleType: this.time_type,
          familyRankType: this.tab,
          page: this.page,
          size: 30,
          familyId: getQueryString("family_id"),
        });
        console.log(res);
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
    toDetails(item) {
      if (item.uid) {
        location.href = `wlyaame://trend/user?uid=${item.uid}`;
      }
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
  padding-top: 7rem;
  position: relative;
  padding-bottom: 1.1rem;
  &.WEALTH {
    background-image: url(https://yaame-static.yaame.io/admin/de542abfe9602890bf1ad68c4fd4af93.jpg);
  }
  .page-header {
    position: fixed;
    top: 0;
    left: 0;
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
      span {
        position: relative;
        &.active {
          font-size: 0.34rem;
          color: #fff;
          position: relative;
        }
      }
      .tab1 {
        text-align: right;
        padding-right: 0.15rem;
      }
      .tab2 {
        padding-left: 0.35rem;
        padding-right: 0.15rem;
      }
      .tab3 {
        padding-left: 0.35rem;
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
      top: .4rem;
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
        margin: .4rem 0 0 .72rem;
        border-radius: 50%;
      }
      .name {
        position: absolute;
        top: 2rem;
        left: 50%;
        width: 1.8rem;
        height: .24rem;
        line-height: .24rem;
        transform: translateX(-50%);
        font-size: .24rem;
        color: #FFFFFF;
        z-index: 2;
        text-align: center;
      }
      .icon {
        position: absolute;
        top: 2.36rem;
        left: 50%;
        transform: translateX(-50%);
        min-width: .74rem;
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
        top: 2.70rem;
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
        top: .36rem;
      }
      .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(https://yaame-static.yaame.io/admin/7b82464e38186728f9ebd36760254c24.png);
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .avatar {
        width: 1.12rem;
        height: 1.12rem;
        margin: .36rem 0 0 .72rem;
        border-radius: 50%;
      }
      .name {
        position: absolute;
        top: 2rem;
        left: 50%;
        width: 1.8rem;
        height: .24rem;
        line-height: .24rem;
        transform: translateX(-50%);
        font-size: .24rem;
        color: #FFFFFF;
        z-index: 2;
        text-align: center;
      }
      .icon {
        position: absolute;
        top: 2.36rem;
        left: 50%;
        transform: translateX(-50%);
        min-width: .74rem;
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
        background-image: url(https://yaame-static.yaame.io/admin/d2b6e5e58b8c5e74060fc3e6aec4eb3c.png);
      }
    }
    .top3 {
      left: 4.94rem;
      .frame {
        background-image: url(https://yaame-static.yaame.io/admin/5cabbe1d2ad186fe3319e89860ca76f2.png);
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
        position: relative;
        background: #543915;
        border: .02rem solid #B68461;
      }
    }
    .list-item {
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
        border-radius: 50%;
      }
      .info {
        position: relative;
        width: 4.3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p {
          font-size: 0.24rem;
          font-weight: 400;
          margin-bottom: 0.12rem;
        }
        .user-number {
          display: flex;
          width: 4.34rem;
          .icon {
            //min-width: .74rem;
            height: .3rem;
            margin-right: .1rem;
            //padding: 0 .09rem;
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
    left: 0;
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
      margin-right: 0.2rem;
      border-radius: 50%;
    }
    .info {
      position: relative;
      width: 5.3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        font-size: 0.24rem;
        font-weight: 400;
        margin-bottom: 0.12rem;
      }
      .user-number {
        display: flex;
        width: 4.34rem;
        .icon {
          //min-width: .74rem;
          height: .3rem;
          margin-right: .1rem;
          //padding: 0 .09rem;
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
.top-lv {
  display: block;
  height: 0.3rem;
  margin: 0.1rem auto 0.1rem;
}
.tag-box {
  display: flex;
}

.tag-box .tag {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 0.1rem;
}
.tag-default {
  /* width: .88rem; */
  margin: 0 0.06rem;
  height: 0.3rem;
  border-radius: 0.21rem;
}

.tag-default img {
  display: block;
  width: auto;
  height: 0.3rem;
}
</style>
