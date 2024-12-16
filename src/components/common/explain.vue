<!--
 * @Author: Elk
 * @Date: 2023-01-05 15:04:17
 * @FilePath: /yaame_h5/src/components/common/explain.vue
 * @Description: 
-->
<template>
  <div
    class="explain"
    @touchmove="touchForbidden($event)"
    @click.self="closeExplain"
  >
    <div class="content">
      <header>说明</header>
      <nav>
        <p>1. 赠送价值≥999钻石的礼物时，该消息会进入礼物公告</p>
        <!-- <p>2. 抽到价值≥500钻石的礼物时，该消息会进入幸运墙</p> -->
        <p>2. 所有公告消息均按时间排列，最多只展示100条</p>
      </nav>
      <footer @click="closeExplain">确定</footer>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    touchForbidden(e) {
      e.preventDefault();
    },
    closeExplain() {
      this.$emit('close');
    },
  },
};
</script>
<style scoped>
.explain {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
.content {
  width: 5.3rem;
  height: 6.14rem;
  font-size: 0.28rem;
  position: absolute;
  left: calc(50% - 2.65rem);
  top: calc(50% - 3.07rem);
  background: url('../../assets/img/notice/tc_img_bj_1@2x.png');
  border-radius: 0.24rem;
  background-size: 5.3rem 3rem;
  background-repeat: no-repeat;
  background-color: #fff;
  padding: 0.6rem 0.4rem;
}
.content > header {
  width: 100%;
  text-align: center;
  font-size: 0.34rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.content > nav > p {
  font-size: 0.28rem;
  color: #666;
  margin-bottom: 0.24rem;
}
.content > footer {
  width: 3.75rem;
  height: 0.88rem;
  line-height: 0.88rem;
  background: linear-gradient(90deg, #fe3e7f 0%, #fe47bc 100%);
  box-shadow: 0px 0px 0.12rem 0px rgba(255, 48, 146, 0.3);
  border-radius: 0.44rem;
  text-align: center;
  font-size: 0.3rem;
  font-weight: 600;
  color: #ffffff;
  top: 0.26rem;
  position: relative;
  left: calc(50% - 1.875rem);
  margin-top: 1rem;
}
</style>
