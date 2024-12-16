<!--
 * @Author: Se7enElk
 * @Date: 2021-11-09 11:55:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-11-09 16:48:45
 * @FilePath: /yaame_h5/src/components/common/table.vue
 * @Description: 表格控件
-->
<template>
  <div :style="{ color: color }" class="table">
    <div class="border">
      <table>
        <tr>
          <th>礼物名称</th>
          <th>概率</th>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td :style="{ width: firstWidth }">{{ item.name }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      default: '#fff',
    },
    firstWidth: {
      type: String,
      default: '0.49rem',
    },
  },
};
</script>

<style>
.border {
  width: 4rem;
  overflow: hidden;
  border-radius: 0.12rem;
  border: 1px solid rgba(224, 225, 226, 1);
  padding: 0;
  margin-bottom: 0.2rem;
  /* color: #fff; */
}
table {
  font-size: 0.24rem;
  width: 4rem;
  border-radius: 0.12rem;
  border: 1px solid rgba(224, 225, 226, 1);
  overflow: hidden;
}
th {
  font-weight: normal;
  border-right: 1px solid rgba(224, 225, 226, 1);
  border-bottom: 1px solid rgba(224, 225, 226, 1);
}
td {
  border-right: 1px solid rgba(224, 225, 226, 1);
  border-bottom: 1px solid rgba(224, 225, 226, 1);
  font-size: 0.24rem;
}
th:last-child {
  border-right: none;
}

tr td:last-child {
  border-right: none;
}

th,
td {
  height: 0.46rem;
  line-height: 0.46rem;
  text-align: center;
}
tr td:nth-child(1) {
  width: 0.49rem;
}
tr th:nth-child(1) {
  width: 0.49rem;
}
tr td:nth-of-type(2) {
  width: 0.49rem;
}
tr th:nth-of-type(2) {
  width: 0.49rem;
}
table tr:last-child > td {
  border-bottom: none;
}
</style>
