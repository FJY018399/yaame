<template>
    <div :class="['reward', is_TuTu && 'tutu']">
        <!-- <page-loading v-if="page_loading"></page-loading> -->
        <refresh ref="wlRefresh" style="min-height: 100vh;" @onRefresh="handleRefresh">
            <!-- 顶部账户余额、今日奖励、累积余额 -->
            <div class="reward-container">
                <div :style="{marginBottom: is_app_ios ? '0' : '.35rem'}" class="top">
                    <div>
                        <p class="opacity-7">{{ $t('CurrentGoldCoins') }}</p>
                        <p class="current-money">{{ money_show }}</p>
                    </div>
                    <template v-if="proxy === 0">
                        <span v-if="!((verify_mode === 1) && isIOS)" @click="showModal">{{ $t('DiamondExchange') }}</span>
                    </template>
                </div>
                <!-- 固定展示，不用区分安卓、ios以及是否在app内 -->
                <template v-if="!is_TuTu">
                    <p v-if="(verify_mode === 1) && isIOS" class="weixin-desc">{{ $t('Content') }}</p>  
                    <p v-else class="weixin-desc">{{ $t('Content2') }}</p>
                </template>
                <div class="bottom">
                    <div style="width:3.45rem;">
                        <p class="money">{{ today_money_income_show }}</p>
                        <p class="opacity-7">{{ $t('TodayGoldCoins') }}</p>
                    </div>
                    <div>
                        <p class="money">{{ money_total_show }}</p>
                        <p class="opacity-7" @click="clickNum++">{{ $t('AccumulatedGoldCoinsEarned') }}</p>
                        <p v-if="clickNum > 20">{{ version }}</p>
                        <p v-if="clickNum > 20">{{ verify_mode }}</p>
                        <p v-if="clickNum > 20">{{ isIOS }}</p>
                        <p v-if="clickNum > 20">{{ (verify_mode === 1) && isIOS }}</p>
                    </div>
                </div>
            </div>
            <!-- <div v-if="is_app_ios && withdraw_info.wx" class="entrance"> -->
            <!-- 提现入口：app内 安卓始终展示提现入口，IOS展示去公众号 -->
            <!-- <template v-if="is_app">
                <div v-if="verify_mode === 0" class="entrance" @click="withdrawEntrance">
                    <img class="zfb-icon" src="http://imgcom.static.suishenyun.net/h5/fe7e1b29-a219-48b1-a3ea-c56876641c55.png" alt="">
                    <span>{{ withdraw_info.alipay ? '支付宝提现' : '添加支付宝账号提现' }}</span>
                    <img class="jt-icon" src="../../assets/img/common/my_icon_back.png" alt="">
                </div>
                <div v-if="verify_mode === 0" class="entrance" @click="toVerify">
                    <img class="zfb-icon" src="http://imgcom.static.suishenyun.net/tixian_icon_weixin@3x-998804.png" alt="">
                    <span>{{ withdraw_info.wx ? '微信提现' : '添加微信账号提现' }}</span>
                    <img class="jt-icon" src="../../assets/img/common/my_icon_back.png" alt="">
                </div>
                <div v-if="verify_mode !== 0" class="ios-entrance" >
                    关注公众号“蘑菇语音”，了解更多内容。
                </div>
            </template> -->
            <!-- 非App内 -->
            <!-- <div v-else class="entrance" @click="withdrawEntrance">
                <img class="zfb-icon" src="http://imgcom.static.suishenyun.net/h5/fe7e1b29-a219-48b1-a3ea-c56876641c55.png" alt="">
                <span>{{ withdraw_info.alipay ? '支付宝提现' : '添加支付宝账号提现' }}</span>
                <img class="jt-icon" src="../../assets/img/common/my_icon_back.png" alt="">
            </div> -->
            
            <p v-show="is_TuTu" class="sub-title tutu-sub-title">{{ $t('GoldCoinBreakdown') }}</p>
            <!-- 奖励明细 -->
            <div class="reward-detail">
                <p v-show="!is_TuTu" class="sub-title">{{ $t('GoldCoinBreakdown') }}</p>
                <ul v-infinite-scroll="loadMore" v-if="flows && flows.length" :infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10" class="reward-list">
                    <li v-for="(item,index) in flows" :key="index" class="reward-item">
                        <div>
                            <p class="task-name">{{ item.title }}</p>
                            <p class="time">{{ formatDate(item.create_time) }}</p>
                        </div>
                        <span>{{ item.money_show }}</span>
                    </li>
                </ul>
                <div v-if="!flows || !flows.length" class="empty">
                    <img v-if="app_type === 'sweet'" :src="sweet_empty_img_url" alt="">
                    <img v-else-if="app_type === 'cu'" :src="sweet_empty_img_url" alt="">
                    <img v-else-if="appType === 'planet' && channel === 'appstore'" :src="tutu_empty_img_url" alt="" />
                    <img v-else :src="empty_img_url" alt="">
                    <p>{{ $t('NoGoldCoinBreakdown') }}～</p>
                </div>
            </div>

            <!-- 提现按钮 -->
            <common-button v-if="is_guild === 1" :width="380" :height="100" :radius="60" :font="34" :type="app_type === 'peanut' ? 'default': 'sweet'" :shadow="app_type === 'peanut'" class="withdraw-btn" bold @click="withdrawEntrance">
                {{ $t('Withdrawal') }}
            </common-button>

        </refresh>
         <!-- 兑换钻石弹出框 -->
        <div v-show="show_modal" class="pop-fixed" @click.self="closeModal">
            <div :class="['modal-container', is_TuTu && 'tutu-modal']">
                <!-- <div class="close-btn" @click="closeModal">
                    <img src="http://imgcom.static.suishenyun.net/h5/2d030b2c-f1a0-439b-8849-e709de607113.png" alt="">
                </div> -->
                <div class="modal-title">{{ $t('DiamondExchange') }}</div>
                <div class="diamondsNum">{{ $t('CurrentDiamonds') }}：{{ diamondNum }}{{ $t('Diamond') }}</div>
                <div class="input-container">
                    <!-- onkeyup="  -->
                    <input v-model="exchange_diamonds" 
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
                        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        type="number" 
                        :placeholder="placeholder"
                    >
                    <div class="exchangeBtn" @click="exchangeAll">{{ $t('RedeemAll') }}</div>
                </div>
                <div class="exchangeInfo">
                    <span>{{ $t('ExchangeRates') }}</span>
                    <span>{{ $t('Most') }}<label>{{ getDiamondNum() }}</label>{{ $t('Diamond') }}</span>
                </div>
                <common-button v-if="is_TuTu" :width="690" :height="100" :radius="16" :font="34" :class="['modal-btn', 'tutu-modal-btn']" :disabled="exchange_diamonds <= 0" bold @click="modalSubmit">
                    {{ $t('ConfirmRedemption') }}
                </common-button>
                <common-button v-else :width="510" :height="90" :radius="60" :font="30" :class="['modal-btn']" :disabled="exchange_diamonds <= 0" bold @click="modalSubmit">
                    {{ $t('ConfirmRedemption') }}
                </common-button>
            </div>
        </div>
    </div>
</template>
<script>
    import refresh from '../../components/common/refresh.vue';
    // import pageLoading from '../../components/common/page_loading.vue';
    import customHeader from '../../components/common/header.vue';
    import commonButton from '../../components/common/button.vue';
    import Toast from '../../components/third/toast/toast.js';
    import request from '../../lib/request/withdraw';
    import { isIOS, isPeanut, getAppType, getVerCode, getChannel, getLanguage } from '../../lib/device';
    import define from '../../lib/define.js';
    import { isEmpty, fomatFloat, getQueryString, formatDate } from '../../lib/utils.js';
    
    export default {
        components: {
            customHeader,
            // pageLoading,
            refresh,
            commonButton,
        },
        data() {
            return {
                // page_loading: true,
                is_app: isPeanut(),
                os_type: isIOS() ? 'ios' : 'android',
                is_app_ios: isIOS() && isPeanut(),
                isIOS: isIOS(),
                p_index: 1,
                p_size: 20,
                diamond: 0,
                flows: [],
                has_next: true,
                money: 0,
                money_show: 0,
                money_total: 0,
                money_total_show: 0,
                today_money_income_show: 0,
                today_money_income: 0,
                withdraw_info: {
                    alipay: false,
                },
                sex: 0,
                empty_img_url: define.empty_img_url,
                sweet_empty_img_url: define.sweet_empty_img_url,
                tutu_empty_img_url: define.tutu_empty_img_url,
                show_modal: false,
                exchange_diamonds: null,
                ratio: 10,
                diamondNum: null,
                verify_mode: 0,
                clickNum: 0,
                appType: getAppType(),
                channel: getChannel(),
                proxy: null,
                is_guild: 0,
                app_type: getQueryString('app_type') || getAppType() || 'peanut'
            };
        },
        computed: {
            version() {
                return getVerCode();
            },
            is_TuTu() {
                return getAppType() === 'planet' && getChannel() === 'appstore';
            },
            placeholder() {
                return getLanguage() === 'id' ? 'Masukkan jumlah berlian yang akan ditukarkan' : 'Please enter the number of diamonds to be redeemed'
            },
            language() {
                return getLanguage() || 'en';
            },
            title() {
                return getLanguage() === 'id' ? 'Penghasilan saya' : 'My earnings'
            },
        },
        created() {
            this.getAccountInfo();
            document.title = this.title;
        },
        methods: {
            getDiamondNum() {
                return fomatFloat(this.money_show, 1, 2) * this.ratio;
            },
            closeModal() {
                this.show_modal = false;
            },
            showModal() {
                this.exchange_diamonds = null;
                this.show_modal = true;
            },
            exchangeAll() {
                this.exchange_diamonds = this.getDiamondNum();
            },
            async modalSubmit() {
                if (isEmpty(parseInt(this.exchange_diamonds, 10))) {
                    return;
                }
                if (this.exchange_diamonds > this.getDiamondNum()) {
                    Toast('当前余额不足');
                    return;
                }
                
                let res = await request.exchangeDiamonds(this.exchange_diamonds);
                if (res.status !== 1000) return;
                this.show_modal = false;
                this.getAccountInfo();
                Toast('兑换成功');
            },
            // 页面初始 加载账户信息
            async getAccountInfo() {
                let res = await request.getAccountInfo(this.p_index, this.p_size);
                this.page_loading = false;
                if (res.status === 1004) {
                    location.href = `./wechat_login.html?app_type=${this.app_type}`;
                    return;
                }
                if (res.status === 1000) {
                    Object.assign(this, res.data);
                    this.diamondNum = res.data.diamond;

                    this.proxy = res.data.proxy;
                    this.verify_mode = res.data.verify_mode;
                    this.is_guild = res.data.is_guild;
                }
            },
            // 奖励明细分页
            async getMoreProgress() {
                let res = await request.getAccountInfo(this.p_index, this.p_size);
                if (res.status === 1000) {
                    if (this.p_index === 1) {
                        this.flows = res.data.flows;
                    } else {
                        this.flows = this.flows.concat(res.data.flows);
                    }
                    
                    this.has_next = res.data.has_next;
                }
            },
            formatDate(timestamp) {
                return formatDate(timestamp, 'yyyy.MM.dd hh:mm');
            },
            loadMore() {
                if (this.has_next) {
                    this.p_index++;
                    this.getMoreProgress();
                }
            },
            async handleRefresh() {
                this.p_index = 1;
                await this.getAccountInfo();
                setTimeout(() => {
                    this.$refs.wlRefresh.isLoading = false;
                }, 500);
            },
            withdrawEntrance() {
                if (this.app_type) {
                    location.href = `./withdraw.html?app_type=${this.app_type}`;
                } else {
                    location.href = './withdraw.html';
                }
            }
        },
    };
</script>
<style scoped>
    .ios-entrance{
        width: 6.9rem;
        height: 1.22rem;
        background-image: url('http://imgcom.static.suishenyun.net/h5/49c62713-537f-4768-9421-56a3b0f1bb96.png');
        background-size: 6.9rem 1.22rem;
        background-repeat: no-repeat;
        color: #333333;
        font-size: .26rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: .3rem auto 0;
    }
    .reward {
        font-size: 0.32rem;
        color: #1B1B1B;
    }
    .reward.tutu{
        background-image: url('http://imgcom.static.suishenyun.net/h5/00406696-e3b7-40f2-88d7-78f5fc80c6ec.png');
        background-size: 7.5rem 2.8rem;
        background-repeat: no-repeat;
    }

    .pop-fixed {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .modal-btn{
        margin: 0.8rem auto 0;
    }
    .modal-btn.tutu-modal-btn{
        background: #5CC86F;
    }

    .modal-desc{
        font-size: .28rem;
        line-height: .28rem;
        display: flex;
        justify-content: space-between;
    }

    .modal-desc p:first-child{
        color: #999;
    }
    .modal-desc p:last-child{
        color: #FF3543;
    }

    input{
        width: 70vw;
        text-indent: 0.56rem;
        border: none;
        outline: none;
        font-size: 0.32rem;
        color: #333;
        /* font-weight: bold; */
        background-color: #F4F4F4;
        line-height: 0.45rem;
        border-radius: 3.2vw;
    }

    .input-container{
        width: 92vw;
        height: 1rem;
        background-color: #F4F4F4;
        border-radius: 3.2vw;
        margin: 0.4rem auto 0.3rem;
        display: flex;
    }
    .exchangeBtn{
        width: 1.3rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        font-size: .26rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FD437A;
        margin-top: 0.2rem;
    }
    .tutu-modal .exchangeBtn{
        color: #5CC86F;
        background: rgba(255,255,255,0.8);
        border-radius: .12rem;
    }
    .tutu-modal .exchangeInfo label{
        color: #5CC86F;
    }
    .exchangeInfo{
        margin-top: 4vw;
        font-size: 3.2vw;
        color: #BCBCBC;
        display: flex;
        justify-content: space-between;
    }
    .modal-title{
        color: #333333;
        font-size: 4.26vw;
        line-height: .4rem;
        font-weight: bold;
        text-align: left;
        border-bottom: 1px solid #E8E8E8;
        padding-bottom: 4vw;
    }
    .tutu-modal .modal-title{
        border-bottom: none;
        text-align: center;
        color: #121212;
    }
    .diamondsNum{
        font-size: 3.46vw;
        font-weight: bold;
        color: #393939;
        margin-top: 2.66vw;
    }
    .modal-container{
        width: 100vw; 
        /* height: 5.5rem; */
        background: #FFFFFF;
        border-top-left-radius: .16rem;
        border-top-right-radius : .16rem;
        padding: 0.3rem 0.3rem .4rem;
        position: relative;
        bottom: 0;
    }

    .modal-container .close-btn{
        position: absolute;
        padding: .3rem;
        top: 0;
        right: 0;
    }

    
    .close-btn img{
        display: block;
        width: .2rem;
        height: .2rem;
    }

    .bottom-container{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.5rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
        padding-top: 0.1rem;
    }
    .bottom-container .btn{
        margin: 0 auto;
    }
    
    .reward-container {
        width: 6.9rem;
        margin: 0 auto;
        background: linear-gradient(90deg, #987FFF 0%, #D39AFF 100%);
        border-radius: 0.22rem;
        padding: 0.44rem .3rem .4rem;
        margin-top: 0.3rem;
        position: relative;
    }
    .tutu .reward-container{
        background: #FFFFFF;
    }

    .tutu .reward-container .top{
        color: #393939;
    }
    
    .reward-container .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.26rem;
        color: #fff;
    }

    .tutu .reward-container .top span{
        background: #5CC86F;
        padding: 0 .3rem;
        height: 0.7rem;
        border-radius: .16rem;
        font-size: 0.28rem;
        font-weight: bold;
        text-align: center;
        line-height: 0.7rem;
        color: #fff;
        border: none;
    }
    
    .top .current-money {
        font-size: 0.8rem;
        font-weight: bold;
        line-height: 0.8rem;
        margin-top: 0.1rem;
    }
    
    .top span {
        padding: 0 .3rem;
        height: 0.6rem;
        border-radius: .6rem;
        font-size: 0.28rem;
        font-weight: bold;
        text-align: center;
        line-height: 0.6rem;
        color: #fff;
        border: 0.01rem solid #FFFFFF;
    }
    
    .reward-container .bottom {
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
        font-size: 0.26rem;
        color: #fff;
        position: relative;
        z-index: 3;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: .38rem;
    }
    .tutu .reward-container .bottom{
        color: #121212;
        border-top: 1px solid rgba(18,18,18,0.08);
    }
    
    .reward-container .bottom .money {
        font-size: 0.5rem;
        font-weight: bold;
        line-height: 0.5rem;
        margin-bottom: 0.1rem;
    }
    
    .opacity-7 {
        opacity: 0.7;
    }
    
    
    .sub-title {
        font-size: 0.3rem;
        line-height: .42rem;
        color: #000;
        font-weight: bold;
    }
    .sub-title.tutu-sub-title{
        color: #121212;
        margin-top: 0.6rem;
        margin-left: 0.3rem;
    }
    .reward-detail {
        background: #FFFFFF;
        border-radius: .24rem;
        margin: 0.3rem;
        position: relative;
        padding: .3rem;
    }
    .tutu .reward-detail{
        padding: 0 .3rem;
    }
    
    .reward-list {
        margin-top: 0.1rem;
        padding-bottom: 0.01rem;
    }

    .reward-list .reward-item:last-child{
        border: none;
    }
    
    .reward-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0;
        border-bottom: 0.01rem solid #EEEEEE;
    }
    .tutu .reward-item{
        border-bottom: 0.01rem solid rgba(18,18,18,0.08);
    }
    
    .reward-item .task-name {
        font-size: 0.28rem;
        line-height: .4rem;
        color: #393939;
        max-width: 4rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
    }
    
    .reward-item .time {
        font-size: 0.26rem;
        line-height: .38rem;
        color: #999;
        margin-top: 0.04rem;
    }
    
    .reward-item span {
        font-size: 0.32rem;
        font-weight: bold;
        color: #333;
    }
    
    .weixin-desc {
        font-size: 0.24rem;
        color: #fff;
        opacity: 0.6;
        margin-top: 0.2rem;
        margin-bottom: 0.35rem;
    }

    .tutu-desc{
        width: 6.9rem;
        background: #fff;
        border-radius: .2rem;
        margin: 0.3rem auto 0;
        display: flex;
        padding: .3rem;
        align-items: center;
    }

    .tutu-desc img{
        display: block;
        width: .44rem;
        height: .46rem;
        margin-right: 0.2rem;
    }

    .tutu-desc p{
        color: rgba(18,18,18,0.6);
        font-size: .24rem;
        line-height: .33rem;
    }
    
    
    .empty {
        font-size: 0.28rem;
        color: #666;
        text-align: center;
        padding: 1.5rem 0;
    }
    
    .empty img {
        width: 1.8rem;
        height: 1.8rem;
        margin-bottom: 0.2rem;
    }
    
    .entrance {
        width: 6.9rem;
        height: 1.2rem;
        background-color: #FFFFFF;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        padding: 0 0.3rem;
        align-items: center;
        margin: 0.3rem auto;
        font-weight: bold;
        font-size: .3rem;
        color: #222222;
    }
    .entrance span{
        flex: 1;
    }
    .entrance .zfb-icon {
        width: 0.5rem;
        margin-right: 0.3rem;
    }
    .entrance .jt-icon {
        width: 0.24rem;
    }
    
    .bg-cover {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 2.24rem;
        z-index: 1;
    }
    .broadcast{
        width: 6.7rem;
        height: .64rem;
        background-color: rgba(250,100,0, 0.04);
        border-radius: .2rem;
        display: flex;
        align-items: center;
        color: #FA6400;
        font-size: .26rem;
        font-weight: bold;
        margin: 0.3rem auto 0;
    }
    .broadcast img{
        display: block;
        width: .33rem;
        height: .32rem;
        margin-left: .2rem;
        margin-right: .12rem;
    }
    .withdraw-btn{
        position: fixed;
        bottom: 0.4rem;
        left: 1.85rem;
    }
</style>
