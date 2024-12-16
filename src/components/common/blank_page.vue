<!--
 * @Author: Se7enElk
 * @Date: 2021-10-02 13:56:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-11 15:49:25
 * @FilePath: /yaame-h5/src/components/common/blank_page.vue
 * @Description: 
-->
<template>
  <div :style="{ height: height }" class="empty" @click="numAdd">
    <p v-if="num > 10">{{ appType }}</p>
    <img v-if="appType === 'sweet'" :src="define.sweet_empty_img_url" alt="" />
    <img
      v-else-if="appType === 'cu'"
      :src="define.sweet_empty_img_url"
      alt=""
    />
    <img
      v-else-if="appType === 'planet' && channel === 'appstore'"
      :src="define.tutu_empty_img_url"
      alt=""
    />
    <img v-else :src="define.empty_img_url" alt="" />
    <p>{{ title }}</p>
  </div>
</template>
<script>
import define from '../../lib/define.js';
import { getAppType, getChannel } from '../../lib/device';
export default {
  props: {
    title: {
      type: String,
      default: '暂无数据',
    },
      height: {
        type: String,
        default: '90vh',
      }
  },
  data() {
    return {
      define,
      appType: getAppType(),
      channel: getChannel(),
      num: 1,
    };
  },
  methods: {
    numAdd() {
      this.num = this.num + 1;
    },
  },
};
</script>
<style scoped>
.empty {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.28rem;
  color: #666;
}

.empty img {
  width: 1.8rem;
  height: 1.8rem;
  margin-bottom: 0.2rem;
}
</style>
