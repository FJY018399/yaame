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
        <img src="https://yaame-static.yaame.io/admin/b6f8d37c4a2e4b502db9418e934cb291.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/35cadd6c5d145f88f33c0ebf479f2bac.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/d952f29102f8f5ff7132c79eb2236e2f.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/c22c07ae4bcaa393c85301bfe1d9b778.png" alt="">
    </div>
</template>

<script>
    import customHeader from '../../components/common/header.vue';
    export default {
        components: {
            customHeader,
        },
        mounted() {
            document.title = 'Fitur Keluarga Sudah Rilis!';
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