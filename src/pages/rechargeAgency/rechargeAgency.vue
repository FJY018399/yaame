<!--
 * @Author: Se7enElk
 * @Date: 2022-01-24 14:17:54
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-01-24 14:19:33
 * @FilePath: /peanut_h5/src/pages/anchorCall/anchorCall.vue
 * @Description: 
-->
<template>
    <div>
        <custom-header style="position: fixed;" color="white"/>
        <img src="https://yaame-static.yaame.io/admin/6e078ace459b12da61d60b7fbcd73236.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/09a32237c93de1c336e67fcda796e860.png" alt="">
    </div>
</template>

<script>
    import customHeader from '../../components/common/header.vue';
    export default {
        components: {
            customHeader,
        },
        mounted() {
            document.title = 'Recharge Agency';
        },
    };
</script>

<style>
img {
    display: block;
    width: 7.5rem;
    height: auto;
    margin-top: -0.02rem;
}
</style>