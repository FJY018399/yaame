<!--
 * @Author: Se7enElk
 * @Date: 2022-03-03 15:03:43
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-25 16:00:14
 * @FilePath: /peanut_h5/src/pages/demonKing/components/DamagePopup.vue
 * @Description: 
-->
<template>
    <popup class="flexBox">
        <div :style="{ 'height': rewardsNum > 1 ? '9.53rem' : '7.32rem' }" class="damagePopup">
            <img class="close-btn" src="https://yaame-static.yaame.io/admin/f9890c3f3df1d0edce6098ab86c7e3db.png" alt="关闭按钮" @click="close()">

            <header class="header">{{ $t('dealDamage') }}</header>

            <div class="damage-num-box">
                <p class="no-wrap">{{ $t('totalDamage') }}：<span class="damage-num">{{ attackObj.user_total_harm_blood_amount }}</span></p>
            </div>

            <header class="header">{{ rewardsNum ? $t('obtainRewards') : $t('tryAgain') }}</header>

            <div v-if="rewardsNum" :class="[rewardsNum === 1 ? 'gift-box' : 'gift-big-box']">
                <div v-for="(item,index) in attackObj.rewards" :key="index" class="gift-item">
                    <div class="gift-img-box">
                        <img :src="item.reward_icon" alt="">
                        <div class="num_box"><p>{{ item.reward_cnt }}</p></div>
                    </div>
                    <p class="gift-img-name no-wrap">{{ item.reward_name }}</p>
                    <p v-if="item.worth_diamond_cnt" class="gift-img-name gift-img-value  no-wrap">{{ item.worth_diamond_cnt }}<img
                        src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                        alt="diamond"
                    ></p>
                </div>
            </div>
            <div v-else class="gift-box">
                <div class="gift-item">
                    <div class="gift-img-box">
                        <img class="empty-img" src="http://imgcom.static.suishenyun.net/icon-2-f87c6e.png" alt="">
                    </div>

<!--                    <p class="gift-img-name no-wrap">{{ $t('') }}</p>-->
                </div>
            </div>
            <footer class="footer">
                <div class="footer-blue" @click="submit(1)">{{ $t('attackOnce') }}</div>
                <div class="footer-orange" @click="submit(10)">{{ $t('attackTenTimes') }}</div>
            </footer>

            <p class="footer-info">{{ rewardsNum ? $t('rewardInBag') : $t('nextTime') }}</p>
        </div>
    </popup>
</template>

<script>
    export default {
        name: 'DamagePopup',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        props: {
            attackObj: {
                type: Object,
                default: () => {
                    return {
                        harm_blood_amount: 0,
                        left_blood: 0,
                        rewards: [],
                        user_total_harm_blood_amount: 0,
                    };
                }
            },
        },
        data() {
            return {
                
            };
        },
        computed: {
            rewardsNum() {
                return this.attackObj.rewards.length;
            }
        },
        methods: {
            /**
             * @description: 调用父组件的再次攻击方法
             * @param {*} num 次数
             */
            submit(num = 1) {
                this.$emit('submit', num);
            },
            close() {
                this.$emit('close');
            },
        },
    };
</script>

<style scoped>
.flexBox{
    display: flex;
    align-items: center;
    justify-content: center;
}
.damagePopup{
    width: 6.16rem;
    min-height: 7.62rem;
    opacity: 0.9;
    background: #5132E5;
    border-radius: 0.2rem;
    position: relative;

    padding-top: 0.48rem;
    color: #fff;
}
.close-btn{
    position: absolute;
    width: 0.25rem;
    height: auto;
    right: 0.23rem;
    top: 0.23rem;
}
.header{
    font-size: 0.36rem;
    font-weight: 700;
    text-align: center;
    width: 100%;
}
.damage-num-box{
    width: 4rem;
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.24rem;
    display: flex;
    margin-left: 1.08rem;
    margin-top: 0.27rem;
    margin-bottom: 0.6rem;
    text-align: center;
    justify-content: center;
    background-image: url(https://yaame-static.yaame.io/admin/0d4ebe75cff2e27424899c7f4750e497.png);
    background-size: contain;
    background-repeat: no-repeat;
}
.damage-num > p {
    flex: 1;
}
.damage-num{
    font-size: 0.36rem;
    color: #FFD738;
    font-weight: 700;
}
.gift-box{
    display: flex;
    justify-content: center;
    align-items: center;
}
.gift-item {
    width: 1.4rem;
    margin-top: 0.4rem;
}
.gift-img-box{
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 0.12rem;
    background-color: #4218C9;
    position: relative;
}
.gift-img-box > img {
    width: 1.4rem;
    height: 1.4rem;
}
.gift-img-box > .empty-img{
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.1rem;
}
.gift-img-name{
    font-size: 0.24rem;
    font-weight: 700;
    text-align: center;
    margin-top: 0.14rem;
}
.gift-img-value {
    font-weight: 400;
    color: #F3EDCD;
    margin-top: 0.04rem;
}
.gift-img-value > img {
    width: 0.23rem;
    height: auto;
    vertical-align: middle;
}
.mb-40{
    margin-bottom: 0.4rem;
}
.gift-big-box{
    width: 100%;
    height: 4.6rem;
    padding-left: 0.5rem;
    overflow-y: scroll;
}
.gift-big-box > .gift-item{
    float: left;
    margin-right: 0.47rem;
}
.footer{
    width: 5.46rem;
    display: flex;

    justify-content: space-between;
    position: absolute;
    bottom: 0.3rem;
    left: 0.35rem;
}
.footer > div {
    width: 2.6rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    border-radius: 12px;

    font-size: 0.32rem;
    font-weight: 700;
}
.footer-blue {
    background-image: linear-gradient(180deg, #7B95FF 0%, #483FFF 100%);
    box-shadow: inset 1px 2px 3px 0 rgba(255,255,255,0.30);
}
.footer-orange {
    background-image: linear-gradient(180deg, #FFD56F 0%, #FFB90D 34%, #F38300 100%);
    box-shadow: inset 1px 2px 3px 0 rgba(255,255,255,0.30);
}
.footer-info{
    position: absolute;
    text-align: center;
    width: 100%;
    font-size: 0.24rem;
    font-weight: 400;
    bottom: 1.42rem;
}
.num_box{
    position: absolute;
    top: -0.13rem;
    right: -0.1rem;
    height: 0.36rem;
    line-height: 0.36rem;
    text-align: center;
    padding: 0 0.12rem 0;
    background-color: #FF6161;
    color: #fff;
    font-weight: 700;
    border-radius: 0.18rem;
}
.num_box > p {
    transform: scale(0.833);
    font-size: 0.24rem;
}
</style>