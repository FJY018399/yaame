<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-12-07 17:29:17
 * @LastEditors: wujiang 
 * @LastEditTime: 2023-12-18 21:28:55
 * @Description: 谁邀请你
-->
<template>
  <div class="tab-box" v-if="exceed7day === false && !ad_conversion">
    <div class="time" v-if="!is_invite">{{ $t('expiration') }}: {{ day }}{{ $t('day') }} {{ hour }}{{ $t('hour') }} {{
      minute }}{{ $t('minute') }} </div>
      <div class="no-fill-invite" v-if="!is_invite">{{ $t("no-fill-invite") }}</div>
    <div v-if="is_invite === false" class="invite-box">
      <div class="tips" style="margin-top: .3rem;">{{ $t('get-gift') }}</div>
      <div class="list">
      <div v-for="(it, k) in list" :key="'reward' + k" class="item">
          <div class="icon">
            <img :src="it.reward_icon" alt="" />
            <!-- 奖励时间 -->
            <span v-show="it.reward_type == 'CHAT_BUBBLE' || it.reward_type == 'AVATAR_DRESS'" class="reward-time">{{
              it.reward_diamond_worth }}</span>
          </div>
          <div class="name">
            <span v-show="it.reward_type == 'DIAMOND'">{{ it.reward_diamond_worth }}*</span>
            {{ it.reward_name }}
          </div>
        </div>
      </div>
      <input v-model="invite_code" type="number" :placeholder="$t('placeholder-text')" class="input-box" />
      <img class="confirm-btn" :src="btnUrl" alt="" @click="submitInviteCode" />
    </div>
    <div v-else="is_invite" class="user-box">
      <div class="title">- {{ $t('your-inviter') }} -</div>
      <img class="avatar" :src="avatar" alt="" />
      <div class="name">{{ nick_name }}</div>
      <div class="id">ID: {{ yaame_id }}</div>
    </div>
    <div v-if="is_invite" class="reward-box">
      <div class="title">- {{ $t('had-reward') }} -</div>
      <div class="list">
        <div v-for="(it, k) in list" :key="'reward' + k" class="item">
          <div class="icon">
            <img :src="it.reward_icon" alt="" />
            <!-- 奖励时间 -->
            <span v-show="it.reward_type == 'CHAT_BUBBLE' || it.reward_type == 'AVATAR_DRESS'" class="reward-time">{{
              it.reward_diamond_worth }}</span>
          </div>
          <div class="name">
            <span v-show="it.reward_type == 'DIAMOND'"
              >{{ it.reward_diamond_worth }}*</span
            >
            {{ it.reward_name }}
            <span
              v-show="
                it.reward_type == 'CHAT_BUBBLE' ||
                it.reward_type == 'AVATAR_DRESS'
              "
              >{{ it.reward_diamond_worth }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div>
        <div v-if="first_charge_status !== 2" :style="{ 'margin-top': !is_invite && '0.8rem'  }" class="task-item">
            <p class="task-info">{{ $t('invite-me-1') }}</p>
            <div v-if="first_charge_status === 0" class="task-btn ">{{ $t('uncompleted') }}</div>
            <div v-if="first_charge_status === 1" class="task-reward">
                <p class="status">{{ $t('completed') }}</p>    
                <p class="num">
                    {{ `+${first_charge_diamonds}` }}
                    <img src="https://yaame-static.yaame.io/admin/5427527aa05de7fc3684ea2794eef410.png" alt="">
                </p>    
            </div>
        </div>
    </div>
  </div>
  <div class="exceedDate" v-else-if="ad_conversion">
    <div class="box">
      <img src="../../../assets/img/invite/default_img_friend.png" alt="">
      <p style="width: 3.94rem;">{{ $t('advertising') }}</p>
    </div>
  </div>
  <div class="exceedDate" v-else-if="exceed7day && !is_invite && !ad_conversion">
    <div class="box">
      <img src="../../../assets/img/invite/default_img_friend.png" alt="">
      <p style="width: 3.94rem;">{{ $t('exceed-7-day') }}</p>
    </div>
  </div>
</template>
<script>
import request from '@/lib/request/activity';
import Toast from '@/components/third/toast/toast.js';
import moment from 'moment';

import enConfirm from '../../../assets/img/invite/confirmbtn/en-confirm.png';
import arConfirm from '../../../assets/img/invite/confirmbtn/ar-confirm.png';
import inConfirm from '../../../assets/img/invite/confirmbtn/in-confirm.png';
import zhCNConfirm from '../../../assets/img/invite/confirmbtn/zhCN-confirm.png';
import zhTwConfirm from '../../../assets/img/invite/confirmbtn/zhTw-confirm.png';

const btnUrl = {
  'zh-cn': zhCNConfirm,
  'zh-tw': zhTwConfirm,
  en: enConfirm,
  ar: arConfirm,
  id: inConfirm
}

export default {
  name: 'InviteMe',
  props: {
    loadingRefresh: {
      type: Function,
      default: () => {},
    },
  },
  components: {},
  data() {
    return {
      day: '',
      hour: '',
      minute: '',
      avatar: '',
      expire_time: '',
      countdown: '',
      invite_code: '',
      list: '',
      is_invite: null,
      nick_name: '',
      uid: '',
      yaame_id: '',
      btnUrl: '',
      exceed7day: null,

        first_charge_status: 0,
        first_charge_diamonds: 0,
    };
  },
  computed: {},
  async created() {
    await this.getInviteInfo()
    this.getEndTimeDown(this.expire_time)
    this.btnUrl = btnUrl[this.language] || btnUrl['en']
  },
  mounted() {
    setInterval(() => {
      this.getEndTimeDown(this.expire_time);
    }, 1000);
  },
  methods: {
    async getInviteInfo() {
      let res = await request.getInviteInfo()
      if (res.status === 1000) {
        if (res.data.yaame_id || res.data.uid) {
          this.is_invite = true
        } else {
          this.is_invite = false
        }
        this.avatar = res.data.avatar;
        this.expire_time = res.data.expire_time;
        this.list = res.data.invite_rewards;
        this.nick_name = res.data.nick_name;
        this.uid = res.data.uid;
        this.yaame_id = res.data.yaame_id;

        this.first_charge_status = res.data.first_charge_status || 0;
        this.first_charge_diamonds = res.data.first_charge_diamonds || 0;
      }
    },

    async submitInviteCode() {
      let res = await request.postInviteBind({ invite_code: this.invite_code })
      if (res.status === 1000) {
        this.is_invite = true
        this.avatar = res.data.avatar
        this.expire_time = res.data.expire_time
        this.list = res.data.invite_rewards
        this.nick_name = res.data.nick_name
        this.uid = res.data.uid
        this.yaame_id = res.data.yaame_id
      }
      if (res.status === 1002) {
        Toast(res.desc);
      }
    },

    getEndTimeDown(val) {
      const now_time = moment().utc().valueOf();
      // const end_date = moment('2023-10-05').endOf('days').valueOf();
      if (now_time >= val) {
        this.day = 0;
        this.hour = '00';
        this.minute = '00';
        this.second = '00';
        this.exceed7day = true
        return;
      }else{
        this.exceed7day = false
      }
      let timeRemaining = val - now_time;

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
      
    },
  },
  props: {
    language: {
      default: 'en',
      type: String
    },
    ad_conversion: {
      default: 0,
      type: Number
    }
  }
};
</script>
<style scoped lang="less">
.tab-box {
  width: 100%;
  height: 100%;
  font-weight: 400;
  font-family: PingFangSC, PingFang SC;
  padding-bottom: 0.2rem;

  .time {
    width: 100%;
    height: 0.33rem;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.24rem;
    color: #000000;
    line-height: 0.33rem;
  }
  .no-fill-invite {
    width: 100%;
    // height: 0.33rem;
    text-align: center;
    font-size: .24rem;
    margin: .17rem 0 .24rem 0;
    padding: 0 .3rem;
    color: #999999;
    line-height: 0.33rem;
  }

  .invite-box {
    width: 6.1rem;
    height: 5.56rem;
    background: url('../../../assets/img/invite/bg/rectangle.png') no-repeat;
    background-size: 100% 5.56rem;
    font-family: PingFangSC, PingFang SC;
    margin: 0.3rem auto 0;
    // overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .gift-icon {
      width: 2.05rem;
      height: 1.36rem;
      margin: 0.3rem auto 0.09rem;
    }

    .tips {
      width: 100%;
      height: 0.6rem;
      font-size: 0.3rem;
      font-weight: 600;
      color: #000000;
      line-height: 0.42rem;
      margin-bottom: 0.31rem;
      margin-top: 0.09rem;
      text-align: center;
    }

    .input-box {
      width: 5.5rem;
      height: 0.94rem;
      background: #ffffff;
      border-radius: 0.47rem;
      border: 0.02rem solid #FFF196;
      font-size: 0.3rem;
      font-weight: 400;
      margin-top: 0.6rem;
      text-align: center;
      position: relative;
      border-color: linear-gradient(90deg, #FFF196 100%, #F7CC95 100%);
    }

    .confirm-btn {
      width: 4.78rem;
      height: 1.26rem;
      position: absolute;
      bottom: -0.5rem;
    }
  }

  .user-box {
    width: 6.1rem;
    height: 4.22rem;
    background: url('https://yaame-static.yaame.io/admin/0cf4beaae2b8a860e0eb7aabea4e6d6f.png') no-repeat;
    background-size: 100% 100%;
    font-family: PingFangSC, PingFang SC;
    margin: 0.3rem auto 0;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-bottom: 0.8rem;

    .title {
      width: 100%;
      height: 0.33rem;
      text-align: center;
      font-size: 0.24rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.33rem;
      margin-top: 0.3rem;
    }

    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 1rem;
      margin-top: 0.47rem;
      border: 0.04rem solid rgba(255, 255, 255, 0.46);
    }

    .name {
      width: 100%;
      text-align: center;
      height: 0.44rem;
      font-size: 0.36rem;
      font-family: SFProDisplay, SFProDisplay;
      font-weight: 600;
      color: #333333;
      line-height: 0.44rem;
      margin: 0.16rem auto 0.24rem;
    }

    .id {
      width: 100%;
      text-align: center;
      height: 0.28rem;
      font-size: 0.24rem;
      font-family: DINAlternate, DINAlternate;
      font-weight: bold;
      color: #666666;
      line-height: 0.28rem;
    }
  }

  .reward-box {
    width: 6.1rem;
    height: 3.25rem;
    border-radius: 0.47rem;
    margin: 0.17rem auto 0.3rem;
    overflow: hidden;
    background: url('https://yaame-static.yaame.io/admin/3fbc332ca7bafe6db516f02a88bf2c17.png');
    background-repeat: no-repeat;
    background-size: contain;

    .title {
      width: 100%;
      height: 0.33rem;
      font-size: 0.24rem;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #F49EA9;
      line-height: 0.33rem;
      text-align: center;
      margin: 0.3rem auto;
    }

    
  }
  .list {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.3rem;
      .item {
        margin: 0 0.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon {
          position: relative;
          width: 1.4rem;
          height: 1.4rem;
          background: #E8DADD;
          border-radius: 0.18rem;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 90%;
            height: 90%;
          }
          // 奖励样式
          .reward-time {
            position: absolute;
            top: 0;
            right: 0;
            width: .7rem;
            height: .34rem;
            font-size: .20rem;
            line-height: .34rem;
            color: #fff;
            text-align: center;
            background: linear-gradient(90deg, #FF8B5E 100%, #FFA863 100%);
            border-radius: .16rem .16rem .16rem .02rem;
            border-image: linear-gradient(117deg, #EFCDA6, #FFE2CE, #FFF9C6);
          }
        }

        .name {
          width: 100%;
          height: 0.3rem;
          font-size: 0.22rem;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 0.3rem;
          text-align: center;
          margin-top: 0.2rem;
        }
      }
    }
}
.exceedDate {
  width: 100%;
  height: 100%;
  font-weight: 400;
  font-family: PingFangSC, PingFang SC;
  font-size: .22rem;
  color: #6D3116;
  display: flex;
  justify-content: center;
  .box {
    width: 6.1rem;
    height: 8.09rem;
    margin-top: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-image: url('../../../assets//img//invite/exceedDate.png');
    background-size: 100% 100%;
    img {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
}
.task-item {
    width: 6.1rem;
    min-height: 1.9rem;
    background: #FDF5E4;
    border-radius: 0.24rem;
    padding: 0.42rem 0.3rem 0.3rem;
    position: relative;
    margin-left: 0.4rem;
    &.disabled {
        background: #F8F8F8;
        .task-btn {
            background-image: url(https://yaame-static.yaame.io/admin/a1c2e839c034c33fa63ce8a7b7d64291.png);
            color: #999999;
        }
    }
    .task-info {
        width: 3.75rem;
        font-size: 0.26rem;
        font-weight: 600;
        color: #482835;
    }
    .task-reward {
        width: 1.52rem;
        height: 0.8rem;
        position: absolute;
        right: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
        .status {
            width: 1.52rem;
            text-align: center;
            font-size: 0.22rem;
            font-weight: 400;
            color: #E14884;
        }
        .num {
            width: 1.52rem;
            text-align: center;
            font-size: 0.3rem;
            font-weight: normal;
            color: #E76D98;
            img {
                width: 0.34rem;
                height: auto;
                vertical-align: sub;
            }
        }
    }
    .task-btn {
        width: 1.52rem;
        height: 0.82rem;
        position: absolute;
        right: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/d5e3b12d9c76eaa13031d78213fb365c.png);
        text-align: center;
        line-height: 0.82rem;
        font-size: 0.24rem;
        font-weight: 600;
        color: #333333;
    }
}
</style>

<!-- <style>
::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #cacaca;
  position: absolute;
  width: 100%;
  top: 0.26rem;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #cacaca;
  position: absolute;
  width: 100%;
  top: 0.26rem;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #cacaca;
  position: absolute;
  width: 100%;
  top: 0.26rem;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #cacaca;
  position: absolute;
  width: 100%;
  top: 0.26rem;
}
</style>
 -->