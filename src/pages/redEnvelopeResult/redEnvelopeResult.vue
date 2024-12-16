<!--
 * @Author: Se7enElk
 * @Date: 2022-11-09 11:13:38
 * @FilePath: /yaame-h5/src/pages/redEnvelopeResult/redEnvelopeResult.vue
 * @Description: 
-->
<template>
	<div class="redPacket">
        <pageLoading v-if="pageLoading"></pageLoading>
        <!-- <div :class="['back', 'back-' + language ]" @click="back"></div> -->

        <Header
			style="position: fixed"
		></Header>
        <div class="user-avatar">
            <img :src="red_pack_current_users_received.avatar || defaultAvatar" alt="">
        </div>
        <p class="user-name">
            {{ red_pack_current_users_received.nick_name }}
        </p>

        <div v-if="red_pack_current_users_received.amount" class="rp-num">
            <span>{{ red_pack_current_users_received.amount }}</span>
            <img :src="diamondIcon" alt="">
        </div>
        <div v-else class="rp-status">
            <span>{{ $t('ranTtOut') }}</span>
        </div>

        <div class="statistics">
            <div>
                <!-- <span class="people-num">8</span>/20 -->
                {{ red_pack_received_tip }}
            </div>
            <div class="flex-center">
                {{ $t('received') }}：{{ received_amount }}/{{ amount }} 
                <img :src="diamondIcon" alt="">
            </div>
        </div>

        <div class="list">
            <div v-for="(item, index) in content" :key="index" class="item">
                <img :src="item.avatar" class="item-avatar" />

                <div class="item-info">
                    <p class="item-name">{{ item.nick_name }}</p>
                    <p class="item-time">{{ item.grab_time }}</p>
                </div>

                <div class="item-num">
                    <p class="item-diamond">{{ item.amount }}
                        <img :src="diamondIcon" alt="">
                    </p>
                    <p v-if="index === 0" class="item-lucky no-wrap">
                        <img src="https://static.yaame.io/admin/723a8fc8c6afc614b01c5012b0fff49a.png" alt="">
                        {{ $t('bestLuck') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

    <script>
    import Header from "../../components/common/header.vue";
    import { getSafeHeight, getLanguage } from "../../lib/device";
    import redEnvelope from "../../lib/request/redEnvelope";
    import popup from "../../components/common/pop_up.vue";
    import SVGAViewer from "../../components/common/SVGAViewer.vue";
    import { getScrollTop, getQueryString } from "../../lib/utils";
    import pageLoading from "../../components/common/page_loading.vue";
    import Toast from '../../components/third/toast/toast.js';
    export default {
        components: {
            pageLoading: pageLoading,
            Header
        },
        data() {
            return {
                // 安全高度
                safeHeight: 0,

                defaultAvatar: 'https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png',
                diamondIcon: 'https://static.yaame.io/admin/f95cfbe9913f352e40a0e6ef6edd4a91.png',

                redPackId: getQueryString('redPackId'),
                red_pack_received_tip: '0/10',
                received_amount: 0,
                amount: 0,
                red_pack_current_users_received: {
                    nick_name: '-',
                    avatar: '',
                    received_tip: '',
                    amount: 0
                },

                content: [],
                pageLoading: true
            };
        },
        computed: {
            language() {
                return getLanguage() || 'en';
            },
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(page = 1) {
                redEnvelope.getRedPackResult({
                    page,
                    size: 100,
                    redPackId: this.redPackId
                }).then(res => {
                    if (res.status === 1000) {
                        this.received_amount = res.data.received_amount;
                        this.amount = res.data.amount;
                        this.content = res.data.content || [];
                        this.red_pack_received_tip = res.data.red_pack_received_tip;
                        if (res.data.red_pack_current_users_received) {
                            this.red_pack_current_users_received = res.data.red_pack_current_users_received;
                        }
                        this.pageLoading = false;
                    } else {
                        Toast(res.desc);
                    }
                }).catch(msg => {
                    console.log(msg);
                });
            },
            back() {
                location.href = `wlyaame://webview/back`;
            },
        }
    };
</script>

<style lang="less" scoped>
    .redPacket{
        width: 7.5rem;
        min-height: 100vh;
        background-color: #fff;
        background-image: url(https://static.yaame.io/admin/512793306387809e8a5d022902ca340b.png);
        background-size: contain;
        background-repeat: no-repeat;
        position: relative;
        .back{
            width: 0.5rem;
            height: 0.5rem;
            position: absolute;
            top: 0.6rem;
            left: 0.3rem;
            background-image: url(../../assets//img//common//icon_back_white.png);
            background-size: 0.4rem 0.4rem;
            background-repeat: no-repeat;
            &.back-ar{
                right: 0.3rem;
            }
        }
        .user-avatar {
            width: 1.7rem;
            height: 1.7rem;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 2.9rem;
            top: 2.18rem;
            img{
                display: block;
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 50%;
            }
        }
        .user-name{
            width: 7.5rem;
            text-align: center;
            position: absolute;
            top: 4.1rem;
            font-size: 0.3rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        .rp-num,
        .rp-status{
            position: absolute;
            top: 5.03rem;
            left: 3.02rem;
            width: 1.47rem;
            height: 0.7rem;
            font-size: 0.6rem;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #393939;
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
                width: 0.5rem;
                height: 0.5rem;
            }
        }
        .rp-status{
            left: 1.5rem;
            width: 4.5rem;
            justify-content: center;
        }
        .statistics{
            position: absolute;
            top: 6.83rem;
            left: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 7.5rem;
            height: 0.37rem;
            padding: 0 0.3rem;
            font-size: 0.26rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            .people-num{
                font-size: 0.36rem;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
            }
            img{
                width: 0.3rem;
                height: 0.3rem;
            }
        }
        .list{
            width: 6.9rem;
            height: auto;
            position: absolute;
            left: 0.3rem;
            top: 7.5rem;
            border-top: 1px solid #eee;
            padding-top: 0.3rem;
            .item{
                height: 0.9rem;
                width: 6.9rem;
                display: flex;
                margin-bottom: 0.5rem;
                .item-avatar{
                    width: 0.9rem;
                    height: 0.9rem;
                    border-radius: 50%;
                    display: block;
                }
                .item-info{
                    width: 4rem;
                    height: 0.9rem;
                    margin-left: 0.2rem;
                    .item-name{
                        font-size: 0.3rem;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #222222;
                    }
                    .item-time {
                        font-size: 0.28rem;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999999;
                    }
                }
                .item-num{
                    width: 1.8rem;
                    height: 0.9rem;
                    .item-diamond {
                        font-size: 0.24rem;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #222222;
                        vertical-align: middle;
                        text-align: right;
                        img {
                            width: 0.3rem;
                            height: 0.3rem;
                        }
                    }
                    .item-lucky{
                        font-size: 0.24rem;
                        font-family: SFProDisplay-Regular, SFProDisplay;
                        font-weight: 400;
                        color: #FDAD50; 
                        text-align: right;
                        img {
                            width: 0.26rem;
                            height: 0.26rem;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }

    .flex-center{
        display: flex;
        align-items: center;
    }
</style>
