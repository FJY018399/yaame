<!--
 * @Author: Se7enElk
 * @Date: 2021-11-06 16:48:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-03 16:59:17
 * @FilePath: /yaame-h5/src/components/common/page_loading.vue
 * @Description: 
-->
<template>
  <div v-show="value" class="loading-box">
    <loading :options="defaultOptions" :height="60" :width="60" class="loading-icon" v-on:animCreated="handleAnimation" />
    <!-- <div class="loader"></div> -->
    <!-- <img
      class="loading-gif"
      src="http://imgcom.static.suishenyun.net/%E5%9B%BE%E7%89%87-73e7c6.gif"
      alt=""
    /> -->
  </div>
</template>

<script>
import Loading from '../lottie/loading.vue';
import animationData from '../../assets/lottie/loading.json';
/**
 * 页面loading组件
 */
export default {
  name: 'PageLoading',
  components: {
    Loading,
  },
  props: {
    value: {
      type: Boolean,
      require: true,
      default: true,
    },
  },
  data() {
    return {
      defaultOptions: { animationData: animationData },
      animationSpeed: 1,
    };
  },
  methods: {
    handleAnimation: function(anim) {
        this.anim = anim;
    },
  },
};
</script>

<style scoped>
.loading-box {
  position: fixed;
  background-color: #f4f8fb;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 99;
}
.loading-icon,
.loading-gif {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.loading-gif {
  width: 1rem;
  height: auto;
}
.loader {
    position: relative;
    width: 0.7rem;
    height: 0.7rem;
    left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 创建加载图案的圆圈 */
.loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid #ccc;
    border-top-color: #000;
    animation: spin 1s linear infinite;
}

/* 创建加载图案的旋转动画 */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
