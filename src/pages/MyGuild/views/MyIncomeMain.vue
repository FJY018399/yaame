<template>
    <keep-alive :include="['MyIncomeAll']" :exclude="['flow']">
        <router-view></router-view>
    </keep-alive>
</template>