<!--
 * @Author: Elk
 * @Date: 2023-02-01 11:14:54
 * @FilePath: /yaame_h5/src/components/common/tip_popup.vue
 * @Description: 
-->
<template>
  <div v-if="value" class="tip">
    <popup class="flex-box">
      <div class="container">
        <header class="header">{{ data.title }}</header>

        <div class="content">{{ data.content }}</div>

        <div class="btns">
          <div
            v-for="(item, index) in data.buttons"
            :key="index"
            :class="{ cancel: data.buttons.length > 1 && index === 0 }"
            @click="btnClick(item.scheme)"
          >
            {{ item.content }}
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
        return {
          title: '',
          content: '',
          buttons: [
            {
              content: '',
              scheme: '',
            },
          ],
        };
      },
    },
  },
  components: {
    popup: () => import('./pop_up.vue'),
  },
  methods: {
    btnClick(scheme) {
      if (scheme) {
        location.href = scheme;
      }

      this.$emit('input', false);
    },
  },
};
</script>

<style scoped lang="less">
.flex-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 5.3rem;
    background-color: #fff;
    border-radius: 0.24rem;
    background-image: url(http://imgcom.static.suishenyun.net/tc_img_bj_1@2x-c2d2a9.png);
    background-size: contain;
    background-repeat: no-repeat;
    .header {
      width: 5.3rem;
      font-size: 0.34rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-top: 0.6rem;
      text-align: center;
    }
    .content {
      width: 5.3rem;
      padding: 0.65rem;
      font-size: 0.28rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin-top: 0.18rem;
      margin-bottom: 0.5rem;
    }
    .btns {
      width: 5.3rem;
      display: flex;
      justify-content: space-around;
      margin-bottom: 0.5rem;
      padding: 0 0.5rem;
      div {
        width: 2rem;
        height: 0.73rem;
        line-height: 0.73rem;
        border-radius: 0.44rem;
        text-align: center;
        font-size: 0.3rem;
        font-family: PingFangHK-Regular, PingFangHK;
        font-weight: 400;
        color: #ffffff;
        background: linear-gradient(90deg, #07cef4 0%, #1dd4d6 100%);
        &.cancel {
          background: #ededed;
        }
      }
    }
  }
}
</style>
