<!--
 * @Author: Elk
 * @Date: 2024-06-10 10:48:29
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/shop.vue
 * @Description: 
-->
<template>
    <div class="shop">
        <div v-for="(item, index) in shopList" :key="index" :style="{ 'background-image': `url(${item.img})` }" :class="['shop-item', !item.canView && 'disabled' ]" @click="handleClick(item)">
            <div class="shop-item-title">{{ $t(item.i18nTitleKey) }}</div>
            <img class="shop-br" src="https://yaame-static.yaame.io/admin/ac26fd2724c87b38180e482de323e190.png" alt="">
            <div class="shop-item-info">{{ $t(item.i18nInfoKey) }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { getUidForUser } from '@/lib/device.js';
const root = getCurrentInstance();

let shopList = ref([
    {
        img: 'https://yaame-static.yaame.io/admin/51082fa7f2cbf748796cdcc03f23f92d.png',
        i18nTitleKey: 'YaameShop',
        i18nInfoKey: 'daily_limit_supply',
        path: 'yaameShop',
        canView: true,
    }, {
        img: 'https://yaame-static.yaame.io/admin/9c693e81703488b89f06adcf28bbedb5.png',
        i18nTitleKey: 'freeMarket',
        i18nInfoKey: 'all_ingredients_freely_traded',
        // i18nInfoKey: 'all_ingredients_freely_traded1',
        path: 'freeMarket',
        canView: true,
        // list: [39138, 468492, 134889,206741,121716,23,33300, 345070]
    }, {
        img: 'https://yaame-static.yaame.io/admin/f3c2482373f7552b0b2e3dce481d826c.png',
        i18nTitleKey: 'myConsignment',
        i18nInfoKey: 'view_ingredients',
        // i18nInfoKey: 'view_ingredients1',
        path: 'myConsignment',
        canView: true,
        // list: [39138, 468492, 134889,206741,121716,23,33300, 345070]
    }, 
])

const handleClick = (item) => {
    // if (item.list) {
    //     let uid = getUidForUser();
    //     for (let i = 0; i < item.list.length; i++) {
    //         if (Number(uid) === item.list[i]) {
    //             root.proxy.$router.push({
    //                 name: item.path
    //             })
    //             return;
    //         }
    //     }
    // } else {
    //     if (!item.canView) {
    //         return;
    //     }
    //     root.proxy.$router.push({
    //         name: item.path
    //     })
    // }
    if (!item.canView) {
        return;
    }
    root.proxy.$router.push({
        name: item.path
    })
    
}


</script>

<style lang="less" scoped>
.shop {
    width: 7.5rem;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    .shop-item {
        width: 7.12rem;
        height: 2.46rem;
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 0.19rem;
        margin-bottom: 0.6rem;
        position: relative;
        &:last-child {
            margin-bottom: 0;
        }
        &.disabled {
            filter: grayscale(100%);
        }
        
        .shop-item-title {
            width: 4rem;
            font-weight: 600;
            font-size: 0.34rem;
            color: #FEE9AB;
            position: absolute;
            top: 0.44rem;
            left: 2.66rem;
        }
        .shop-item-info {
            width: 3.8rem;
            font-weight: 400;
            font-size: 0.24rem;
            color: #FEE9AB;
            position: absolute;
            left: 2.66rem;
            top: 1.14rem;
        }
        .shop-br {
            width: 3.75rem;
            height: 0.15rem;
            position: absolute;
            left: 2.65rem;
            top: 0.96rem;
        }
        &:nth-child(2) {
            .shop-item-title  {
                left: 0.71rem;
            }
            .shop-item-info {
                left: 0.71rem;
            }
            .shop-br {
                left: 0.71rem;
            }
        }
    }
}
</style>