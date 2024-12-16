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
        <img src="https://yaame-static.yaame.io/admin/b14ef6d85e16d6cb030b407e4f6f1237.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/353304d447b5ff161779fa34729561fa.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/4bc7c7131cc9349d7944b3522943048d.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/883d62620c4b07c4e120f398c6c5dafd.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/d6de678d9559dbe33c9a339ed30b7cf3.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/d3ba0e08574c74a7bc66131cdee0c14e.png" alt="">
    </div>
</template>

<script>
    import customHeader from '../../components/common/header.vue';
    export default {
        components: {
            customHeader,
        },
        mounted() {
            document.title = 'Dec Agency PK Event!';
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