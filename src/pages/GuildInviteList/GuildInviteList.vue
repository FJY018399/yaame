<template>
  <div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="main">
    <Header
      :keep="true"
      :keepColor="false"
      style="position: fixed"
      title="Guild Invitation"
    ></Header>
    <refresh ref="wlRefresh" @onRefresh="handleRefresh">
      <div
        v-infinite-scroll="loadMore"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        class="content"
      >
        <div v-for="(item, index) in list" :key="index" class="item">
          <div class="user-container">
            <img class="user-avatar" :src="item.avatar" alt="" />
            <div class="user-info">
              <p class="user-name no-wrap">{{ item.nick_name }}</p>
              <p class="no-wrap">Invite you to join in his agency</p>
              <p class="no-wrap">
                Invitation Time:
                {{ formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") }}
              </p>
            </div>
          </div>
          <div v-if="item.status === 0" class="btn-container">
            <div class="btn" @click="submit(item.id, 'REFUSE')">Refuse</div>
            <div class="btn" @click="submit(item.id, 'AGREE')">Agree</div>
          </div>
          <div v-else class="btn-container">
            <div class="big-btn">{{ computedText(item.status) }}</div>
          </div>
        </div>
      </div>
    </refresh>
  </div>
</template>

<script>
import Header from "../../components/common/header.vue";
import { getSafeHeight } from "../../lib/device";
import request from "../../lib/request/withdraw";
import { formatDate } from "../../lib/utils.js";
import refresh from "../../components/common/refresh.vue";
import popup from "../../components/common/pop_up.vue";
import { Toast } from "vant";
export default {
  components: {
    Header,
    refresh,
    popup,
  },
  data() {
    return {
      safe_height: 0,
      page: 1,
      list: [],
      has_next: true,
    };
  },
  methods: {
    async getData() {
      try {
        let res = await request.getGuildsInviteList(this.page, 20);
        if (res.status !== 1000) return;
        if (this.page === 1) {
          this.list = res.data.content;
        } else {
          this.list = this.list.concat(res.data.content);
        }
        this.has_next = res.data.has_next;
        if (
          Object.prototype.toString.call(res.data.is_guild_owner) ===
          "[object Number]"
        ) {
          this.is_guild_owner = res.data.is_guild_owner;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleRefresh() {
      this.page = 1;
      this.getData();
      setTimeout(() => {
        this.$refs.wlRefresh.isLoading = false;
      }, 500);
    },
    formatDate,
    /**
     * @description: 下拉加载钩子fun
     */
    loadMore() {
      if (this.has_next) {
        this.page++;
        this.getData();
      }
    },
    computedText(val) {
      if (val === 1) {
        return "Agreed";
      } else if (val === 2) {
        return "Refused";
      } else if (val === 3) {
        return "Invalid";
      }
    },
    async submit(id, status) {
      try {
        let res = await request.inviteVerification({
          id,
          status,
        });
        if (res.status === 1000) {
            Toast(res.data.remind_tip);
            this.page = 1;
            this.getData();
        } else if (res.status === 10003) {
          Toast(res.desc);
          return;
        } else {
            Toast(res.desc);
            return;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    let safe_area = getSafeHeight() || 0;
    this.safe_height = (safe_area * 2) / 100;

    this.getData();
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    width: 7.5rem;
    min-height: calc(100vh - 2rem);
    border-radius: 0.3rem 0.3rem 0px 0px;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: 0.3rem;
    .item {
      width: 6.9rem;
      height: 3rem;
      border-radius: 0.24rem;
      background-color: #fff;
      padding: 0.3rem;
      .user-container {
        width: 6.3rem;
        height: 1.2rem;
        display: flex;
        margin-bottom: 0.4rem;
        .user-avatar {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
        }
        .user-info {
          padding-left: 0.2rem;
          flex: 1;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          .user-name {
            font-size: 0.32rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }
      .btn-container {
        width: 6.3rem;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        .btn {
          width: 3.05rem;
          height: 0.8rem;
          border-radius: 0.5rem;
          background-color: #f1f1f1;
          font-size: 0.28rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #999999;
          text-align: center;
          line-height: 0.8rem;
          &:nth-child(2) {
            background-color: #1fe89b;
            color: #fff;
          }
        }
        .big-btn {
          flex: 1;
          width: 6.3rem;
          height: 0.8rem;
          border-radius: 0.5rem;
          border: 0.02rem solid #e3e3e3;
          background-color: #fff;

          font-size: 0.28rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #999999;
          text-align: center;
          line-height: 0.8rem;
        }
      }
    }
  }
}
</style>
