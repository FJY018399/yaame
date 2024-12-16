<!--
 * @Author: Se7enElk
 * @Date: 2022-03-09 17:29:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-16 19:15:23
 * @FilePath: /peanut_h5/src/pages/demonKing/components/Rewards.vue
 * @Description: 
-->
<template>
    <popup class="flexBox">
        <van-swipe
            :initial-swipe="rewards_current"
            :width="swipe_item_width"
            class="rewards-box"
            @change="onChange"
        >
            <van-swipe-item
                v-for="(item, index) in rewardsArr"
                :key="index"
                :style="{ 'background-image': `url(${item.img})` }"
                class="rewards-item"
            >
                <div class="rewards-item-content">
                    <img class="close-btn" src="https://yaame-static.yaame.io/admin/f9890c3f3df1d0edce6098ab86c7e3db.png" alt="关闭按钮" @click="close()">

                    <header class="rewards-header">{{ item.monster_name }}</header>
                    <div v-for="(ele, inx) in item.reward_weapons" :key="inx" class="rewards-content">
                        <p class="content-name">{{ ele.weapon_name }}：</p>
                        <ul class="content-ul">
                            <li v-for="(it,k) in ele.weapon_rewards" :key="k" class="content-li no-mb">
                                <div class="img-box">
                                    <img :src="it.reward_icon" alt="">
                                </div>
                                <p class="li-name no-wrap">{{ it.reward_name }}</p>
                                <p v-if="it.worth_diamonds" class="li-value no-wrap">{{ it.worth_diamonds }}<img
                                    src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                                    alt="diamond"
                                ></p>
                            </li>
                        </ul>
                    </div>
<!--                    <div class="rewards-content">-->
<!--                        <p class="content-name">宝石剑/净化水晶攻击奖励：</p>-->
<!--                        <ul class="content-ul se7en-box">-->
<!--                            <div v-for="(element, intNum) in item.exclusive_list" v-show="element.icon" :key="intNum">-->
<!--                                <li v-if="element.icon" class="content-li">-->
<!--                                    <div class="img-box">-->
<!--                                        <img :src="element.icon" alt="">-->
<!--                                        <img v-if="element.tag === 'SUPER'" src="http://imgcom.static.suishenyun.net/popup_gift_tag-bdbe19.png" class="rare-img" />-->
<!--                                    </div>-->
<!--                                    <p class="li-name no-wrap">{{ element.name }}</p>-->
<!--                                </li>-->
<!--                            </div>-->
<!--                        </ul>-->
<!--                    </div>-->
                </div>
            </van-swipe-item>
        </van-swipe>
    </popup>
</template>

<script>
    import { getDemonKingReward } from '@/lib/request/draw';
    export default {
        name: 'Rewards',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        data() {
            return {
                rewards_current: 0,
                swipe_item_width: 400,
                rewardsArr: [],
            };
        },

        mounted() {
            let e = document;
            let n = e.documentElement;
            let t = n.clientWidth;
            this.swipe_item_width = t / 75 * 66.1;

            this.getList();
        },

        methods: {
            getList() {
                getDemonKingReward({
                    activityType: 'BIG_MONSTER'
                }).then(res => {
                    if (res.status === 1000) {
                        this.rewardsArr = res.data.monster_rewards;
                    }
                });
            },
            onChange (index) {
                this.rewards_current = index;
            },
            close() {
                this.$emit('close');
            },
        },
    };
</script>

<style scoped>
.flexBox {
    display: flex;
    align-items: center;
    justify-content: center;
}
.rewards-box {
    width: 7.5rem;
    padding-left: 0.5rem;
}
.rewards-item {
    height: 9.44rem;
    position: relative;
}
.rewards-item-content{
    width: 6.16rem;
    height: 9.44rem;
    overflow-y: scroll;
    padding-top: 0.48rem;
    border-radius: .2rem;
    position: relative;
    /* background: rgba(81, 50, 229, 0.9) no-repeat; */
    background-color: rgba(81, 50, 229, 0.9);
    background-repeat: no-repeat;
    background-size: contain;
    border: 0.01rem transparent;
    padding-bottom: 0.3rem;
}
.close-btn{
    position: absolute;
    width: 0.25rem;
    height: auto;
    right: 0.23rem;
    top: 0.23rem;
}
.rewards-header{
    font-size: 0.36rem;
    color: #fff;
    font-weight: 700;
    text-align: center;
}
.rewards-content{
    padding: 0 0.5rem 0;
    margin-top: 0.3rem;
}
.content-name{
    font-size: 0.24rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    margin-bottom: 0.2rem;
}
.content-ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.content-li {
    flex-basis: 1.4rem;
    width: 1.4rem;
    height: 2.5rem;
    text-align: center;
    color: #fff;
}
.img-box{
    background: #4218C9;
    border-radius: 0.12rem;
    width: 1.4rem;
    height: 1.4rem;
    position: relative;
}
.img-box > img {
    width: 1.4rem;
    height: auto;
}
.img-box > .rare-img{
    position: absolute;
    width: 0.6rem;
    top: 0;
    right: 0;
}
.li-name {
    margin-top: 0.18rem;
    font-weight: 700;
    font-size: 0.24rem;
}
.li-value {
    font-size: 0.24rem;
    font-weight: 400;
    margin-top: 0.04rem;
    color: #F3EDCD;

}
.li-value > img {
    width: 0.23rem;
    height: auto;
    vertical-align: middle;
}
.no-mb{
    margin-bottom: 0;
}
.se7en-box{
    height: 4.2rem;
    overflow-y: auto;
}
</style>