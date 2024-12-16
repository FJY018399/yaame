<template>
    <div>
        <customHeader style="position: fixed;" color="white">123123</customHeader>
        <img src="https://yaame-static.yaame.io/admin/6208472287a0d578db0cc34ba68d3d49.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/6dca53cec3906ce9cb6c769b8a3545ce.png" alt="">
        <img src="https://yaame-static.yaame.io/admin/3bcc2aa8c2b62ddcaaaf7a1393ae1de2.png" alt="">
    </div>
</template>

<script>
    import customHeader from '@/components/common/header.vue';
    export default {
        components: {
            customHeader,
        },
        mounted() {
            document.title = 'PROMO TOP UP AKHIR NOV';
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