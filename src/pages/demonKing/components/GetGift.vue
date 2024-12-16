<!--
 * @Author: Se7enElk
 * @Date: 2022-03-18 17:10:53
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-23 18:20:37
 * @FilePath: /peanut_h5/src/pages/demonKing/components/GetGift.vue
 * @Description: 
-->
<template>
    <popup class="flexBox">
        <div class="getGift">
            <p class="low-p">感谢勇士在这场作战中的英勇表现</p>
            <p class="height-p">恭喜获得</p>
            <div class="gift-box">
                <img :src="rewardsObj.icon">
                <div class="num_box"><p>{{ rewardsObj.amount }}</p></div>
            </div>
            <p class="gift-name">{{ rewardsObj.name }}</p>
            <p class="gift-back">奖励已放入背包</p>
            <div class="submit" @click="close">确认</div>
        </div>
    </popup>
</template>

<script>
    export default {
        name: 'GetGift',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        props: {
            rewardsObj: {
                type: Object,
                default: () => {
                    return {
                        amount: null,
                        box: null,
                        diamond: null,
                        icon: null,
                        id: null,
                        name: null,
                    };
                }
            }
        },
        methods: {
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
.getGift{
    width: 6.16rem;
    height: 6.6rem;
    background: rgba(81,50,229,0.9);
    border-radius: 0.2rem;
    position: relative;
}
.low-p{
    width: 100%;
    text-align: center;
    font-size: 0.32rem;
    color: #FFFFFF;
    text-align: center;
    font-weight: 700;
    margin-top: 0.74rem;
}
.height-p{
    margin-top: 0.4rem;
    width: 100%;
    text-align: center;
    font-size: 0.36rem;
    color: #FFFFFF;
    text-align: center;
    font-weight: 700;
}
.gift-box{
   width: 1.4rem;
   height: 1.4rem;
   background: #4218C9;
    border-radius: 0.12rem;
    position: absolute;
    top: 2.5rem;
    left: calc(50% - 0.7rem);
}
.gift-box > img {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.1rem;
}
.num_box{
    height: 0.36rem;
    line-height: 0.36rem;
    text-align: center;
    padding: 0 0.12rem 0;
    background-color: #FF6161;
    color: #fff;
    font-weight: 700;
    border-radius: 0.18rem;
    position: absolute;
    right: -0.13rem;
    top: -0.13rem;
}
.num_box > p {
    transform: scale(0.833);
    font-size: 0.24rem;
}
.gift-name{
    width: 100%;
    text-align: center;
    position: absolute;
    top: 4.07rem;
    font-size: 0.24rem;
    color: #FFFFFF;
    text-align: center;
    font-weight: 700;
}
.gift-back{
    width: 100%;
    text-align: center;
    position: absolute;
    top: 4.64rem;
    font-size: 0.24rem;
color: #FFFFFF;
text-align: center;
font-weight: 400;
}
.submit{
    width: 2.6rem;
    height: 0.8rem;
    position: absolute;
    top: 5.37rem;
    left: calc(50% - 1.3rem);
    text-align: center;
    font-size: 0.32rem;
color: #FFFFFF;
text-align: center;
font-weight: 700;
    line-height: 0.8rem;
    background-image: linear-gradient(180deg, #FFD56F 0%, #FFB90D 34%, #F38300 100%);
    box-shadow: inset 1px 2px 3px 0 rgba(255,255,255,0.30);
    border-radius: 0.12rem;
}
</style>