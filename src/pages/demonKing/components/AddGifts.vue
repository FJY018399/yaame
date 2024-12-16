<!--
 * @Author: Se7enElk
 * @Date: 2022-03-15 10:59:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-23 17:30:42
 * @FilePath: /peanut_h5/src/pages/demonKing/components/AddGifts.vue
 * @Description: 
-->
<template>
    <popup class="flexBox">
        <div class="addGifts">
            <div class="gift_box">
                <div class="img-box">
                    <img :src="selectNumObj.icon_url" alt="">
                </div>
                <div class="img-info">
                    <p class="gift_name">{{ selectNumObj.name }}</p>
                    <p class="gift_price">{{ selectNumObj.price }}钻石</p>
                </div>
            </div>
            <div class="selectNum">选择数量：{{ value }}</div>
            <div class="process-box">
                <div class="reduceBox" @click="reduceClick">
                    <img src="http://imgcom.static.suishenyun.net/--3619be.png" alt="">
                    0
                </div>
                <van-slider v-model="value" :min="0" :max="selectNumObj.amount" bar-height="4px" active-color="#FFD428" class="process" />
                <div class="addBox" @click="addClick">
                    {{ selectNumObj.amount }}
                    <img src="http://imgcom.static.suishenyun.net/+-38b265.png" alt="">
                </div>
            </div>
            <p class="price-p">价值：{{ selectNumObj.price * value }}钻石</p>

            <footer class="footer">
                <div class="cancel" @click="close">取消</div>
                <div class="submit" @click="submit">确定</div>
            </footer>
        </div>
    </popup>
</template>

<script>
    export default {
        name: 'AddGifts',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        props: {
            selectNumObj: {
                type: Object,
                default: () => {
                    return {};
                }
            },
        },
        data() {
            return {
                value: 0
            };
        },
        watch: {
            selectNumObj: {
                handler(res) {
                    this.value = res.selectNum;
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            reduceClick() {
                if (this.value === 0) return;
                this.value--;
            },
            addClick() {
                if (this.value === this.selectNumObj.amount) {
                    return;
                } else {
                    this.value++;
                }
            },
            submit() {
                this.$emit('submit', { ...this.selectNumObj, selectNum: this.value });
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
.addGifts{
    width: 6.16rem;
    height: 5.02rem;
    background: rgba(81,50,229,0.9);
    border-radius: 0.2rem;
}
.gift_box{
    width: 100%;
    height: 1rem;
    margin-top: 0.48rem;
    padding-left: 1.82rem;
}
.gift_box > div {
    display: inline-block;
}
.img-box{
    width: 1rem;
    height: 1rem;
    border-radius: 0.12rem;
    background: #4218C9;
}
.img-box > img {
    width: 1rem;
    height: 1rem;
}
.img-info{
    margin-left: 0.4rem;
    width: 2rem;
    height: 1rem;
}
.gift_name{
    margin-top: 0.06rem;
    font-size: 0.32rem;
    color: #FFFFFF;
    font-weight: 700;
}
.gift_price{
    margin-top: 0.06rem;
    opacity: 0.8;
    font-size: 0.24rem;
    color: #FFFFFF;
    font-weight: 400;
}
.selectNum{
    margin-top: 0.3rem;
    width: 100%;
    font-size: 0.32rem;
    color: #FFFFFF;
    text-align: center;
    font-weight: 400;
}
.process{
    width: 3.6rem;
    margin-top: 0.16rem;
}
.process-box{
    display: flex;
    width: 100%;
    margin-top: 0.47rem;
}
.reduceBox{
    height: 0.4rem;
    line-height: 0.4rem;
    width: 1.18rem;
    margin-right: 0.3rem;
    text-align: right;
}
.addBox{
    height: 0.4rem;
    line-height: 0.4rem;
    width: 1.18rem;
    margin-left: 0.3rem;
    text-align: left;
}
.reduceBox,
.addBox{
    font-size: 0.24rem;
    color: #FFFFFF;
    font-weight: 400;
}
.reduceBox > img,
.addBox > img {
    width: 0.4rem;
    height: 0.4rem;
}
.price-p{
    width: 7.04rem;
    margin-left: -0.44rem;
    transform: scale(0.875);
    font-size: 0.24rem;
    color: #FFFFFF;
    text-align: center;
    font-weight: 400;
}
.footer{
    width: 100%;
    height: 0.83rem;
    margin-top: 0.37rem;
    display: flex;
    padding: 0 0.36rem 0;
    justify-content: space-between;
    font-size: 0.32rem;
    color: #FFFFFF;
    line-height: 0.83rem;
    font-weight: 700;
}
.footer > div {
    width: 2.6rem;
    height: 0.83rem;
    text-align: center;
    border-radius: 0.12rem;
}
.cancel{
    background-image: linear-gradient(180deg, #778DE6 0%, #8682F1 100%);
    box-shadow: inset 1px 2px 3px 0 rgba(255,255,255,0.30);
}
.submit{
    background-image: linear-gradient(180deg, #FFD56F 0%, #FFB90D 34%, #F38300 100%);
    box-shadow: inset 1px 2px 3px 0 rgba(255,255,255,0.30);
}
</style>