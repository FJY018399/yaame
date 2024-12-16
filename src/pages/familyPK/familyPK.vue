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
        <img src="https://yaame-static.yaame.io/admin/f4026e9794dee1b445ee5bbdbcb03662.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/88d7820d8a0d9148daa9c14f38ab65ce.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/3fda8be12f839f9186ad84100a849caa.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/d14a0f1d97bacfd87c3bb548b4341873.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/742cc37b345e52e2325537050cc07947.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/f16073871c8694e01ae371e2929e86ac.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/53c86fd7229831ba1a90a9fdda9d3270.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/0bc95749815afce2063546973f93b30a.png" alt="">
    </div>
</template>

<script>
    import customHeader from '../../components/common/header.vue';
    export default {
        components: {
            customHeader,
        },
        mounted() {
            document.title = 'Pertandingan PK Agency!';
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