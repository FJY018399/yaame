<template>
    <div>
        <!--返回头部-->
        <custom-header color="white">{{ $t('fruitmachinewinner') }}</custom-header>
        <router-view></router-view>
    </div>
</template>

<script setup>
    import customHeader from "@/components/common/header.vue";
</script>

<style lang="less" scoped>

</style>