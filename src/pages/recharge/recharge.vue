<!--
 * @Author: ZhaoZhiqi
 * @Date: 2023-10-26 10:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-11 10:53:02
 * @Description: 
 * @FilePath: /yaame-h5/src/pages/recharge/recharge.vue
-->
<template>
    <div class="recharge-container">
        <!-- header -->
        <div class="header">
            <img class="logo" src="../../assets/img/recharge/logo.png" />

            <van-popover v-model="languageVisible" trigger="click" :actions="languageColumns" @select="selectLanguage">
                <template #reference>
                    <div class="language">
                        <img class="language-icon" src="../../assets/img/recharge/language.png" />
                        <div>{{ curLanguage.text }}</div>
                        <img class="arrow-grey" src="../../assets/img/recharge/arrow-grey.png" />
                    </div>
                </template>
            </van-popover>
        </div>
        <!-- 去官网 -->
        <div class="to-official" @click="link">
            <div>{{ $t("Official Website") }}</div>
            <img class="arrow-white" src="../../assets/img/recharge/arrow-white.png" />
        </div>
        <!-- id查询 -->
        <div class="query-card">
            <div class="query-label">Yaame ID：</div>
            <div class="query-input">
                <van-field style="background-color: #f2f5fb; height: 1.1rem; border-radius: 0.55rem" v-model="id" center clearable :placeholder="$t('Please put in YaameID')" @input="onChange"></van-field>
            </div>
            <div v-if="loading" style="display: flex; justify-content: center">
                <van-loading style="display: flex;justify-content: center; margin-top: 0.2rem" size="16px" type="spinner" />
            </div>
            <div v-else-if="userInfo" class="query-user">
                <div class="user-avatar" :style="{ backgroundImage: `url(${userInfo.avatar})` }"></div>
                <div class="user-info">
                    <div class="user-name">{{ userInfo.nick_name }}</div>
                    <div class="user-id">ID: {{ userInfo.yaame_id }}</div>
                </div>
            </div>
            <div v-else-if="hasQuery" class="query-no-user">
                <img src="../../assets/img/recharge/warning.png" />
                <div>{{ $t("ID is invalid") }}</div>
            </div>
        </div>
        <!-- 充值数额 -->
        <div class="diamonds-card">
            <template v-if="tradeGoods.length">
                <div class="diamond-item" :class="{ selected: goodIndex === index }" v-for="(item, index) in tradeGoods" :key="item.id" @click="handleSelect(item, index)">
                    <img src="../../assets/img/recharge/diamond.png" />
                    <div style="font-size: 0.34rem; line-height: 0.52rem; color: #393939; margin-bottom: 0.06rem; font-weight: bold">{{ item.diamonds }}</div>
                    <div style="font-size: 0.28rem; line-height: 0.28rem; color: #999999; margin-bottom: 0.1rem">{{ item.currency_type }}</div>
                    <div style="font-size: 0.24rem; line-height: 0.24rem; color: #999999">{{ item.price / 100 }}</div>
                </div>
            </template>
            <van-empty style="margin: 0 auto" v-else />
        </div>
        <!-- 支付方式 -->
        <div class="pay-method-card">
            <div class="pay-method-header">
                <div class="pay-method-title">{{ $t("Payment method") }}：</div>
                <div class="pay-method-switch" @click="countryVisible = true">
                    <div>{{ curCountry.text }}</div>
                    <img class="arrow-grey" src="../../assets/img/recharge/arrow-grey.png" />
                </div>
            </div>
            <div class="pay-method-item" :class="{ selected: channelIndex === index }" v-for="(item, index) in paymentChannels" :key="item.channel_id" @click="channelIndex = index">
                <div class="method-item-img" :style="{ backgroundImage: `url(${item.channel_icon})` }"></div>
                <div v-if="item.discount" class="method-item-favorable">
                    <img src="https://yaame-static.yaame.io/admin/f8fbb8bdef97cfd61038676160cf426f.png" alt="">
                    <p class="num">{{ item.discount }}</p>
                </div>
                <div class="method-item-right">
                    <div class="method-name">{{ item.channel_name }}</div>
                    <div v-if="item.channel_desc" class="method-discount">{{ item.channel_desc }}</div>
                </div>

                <img v-if="channelIndex === index" class="method-item-select-img" src="https://yaame-static.yaame.io/admin/56ec90bc5843493ca575fce211d94dc9.png" alt="">
                <img v-else class="method-item-select-img" src="https://yaame-static.yaame.io/admin/478e33b285dbba1a64b57e11559bb9d9.png" alt="">
            </div>
        </div>
        <div class="pay-btn" @click="pay">{{ $t("Payment") }}</div>
        <!-- <pageLoading v-if="pageLoading" /> -->

        <!-- 选择国家 -->
        <van-popup v-model="countryVisible" position="bottom" round>
            <van-picker title="" show-toolbar :columns="countryColumns" @confirm="selectCountry" @cancel="countryVisible = false" :default-index="defaultIndex" :confirm-button-text="$t('Confirm')" :cancel-button-text="$t('Cancel')" />
        </van-popup>

        <pageLoading v-if="pageLoading" />
    </div>
</template>
<script>
import Toast from "../../components/third/toast/toast.js";
import pageLoading from "../../components/common/page_loading.vue";
import { getQueryString } from "../../lib/utils";
import { queryUserAPI, getGoodsAPI, orderAPI } from "./api";

export default {
    components: {
        pageLoading,
    },
    data() {
        return {
            pageLoading: true,
            id: "",
            languageVisible: false,
            countryVisible: false,

            curLanguage: {},
            languageColumns: [
                {
                    lang: "en",
                    key: "English",
                    text: "English",
                },
                {
                    lang: "id",
                    key: "Indonesian",
                    text: "Indonesia",
                },
                {
                    lang: "ar",
                    key: "Arabic",
                    text: "اللغة العربية",
                },
            ],
            curCountry: "",
            countryColumns: [],
            defaultIndex: 0,

            timer: null,
            loading: false,
            userInfo: null,
            hasQuery: false,

            tradeGoods: [],
            goodIndex: 0, // 商品索引
            paymentChannels: [],
            channelIndex: 0,
        };
    },
    created() {
        document.title = "";

        // 初始化城市列表
        this.setCountryColumns();

        // 初始化默认语言
        let lang = this.$i18n.locale;
        this.curLanguage = this.languageColumns.find((item) => item.lang === lang) || {};
        this.getCurCountry();
    },
    mounted() {
        document.body.style.margin = 0;
    },
    watch: {
        curCountry() {
            if (this.curCountry.key) this.getGoods();
        },
    },
    methods: {
        getGoods() {
            getGoodsAPI(this.curCountry.key).then((res) => {
                if (res.status === 1000) {
                    this.tradeGoods = res.data.trade_goods || [];
                    const tradeGoodsInfo = {};

                    // 遍历 trade_goods，将信息存储到 tradeGoodsInfo 中
                    res.data.trade_goods.forEach(trade_good => {
                      if (trade_good.channel_discounts && trade_good.channel_discounts.length > 0) {
                        trade_good.channel_discounts.forEach(discount => {
                          const payment_channel_id = discount.payment_channel_id;
                          if (!tradeGoodsInfo[payment_channel_id]) {
                            tradeGoodsInfo[payment_channel_id] = [];
                          }
                          tradeGoodsInfo[payment_channel_id].push({
                            id: trade_good.id,
                            discount: discount.discount,
                            payment_channel_id: payment_channel_id
                          });
                        });
                      }
                    });

                    // 遍历 payment_channels，将 trade_goods 的信息添加到每一项中
                    // res.data.payment_channels.forEach(payment_channel => {
                    //     const payment_channel_id = payment_channel.channel_id;
                    //     if (tradeGoodsInfo[payment_channel_id]) {
                    //         payment_channel.associated_trade_goods = tradeGoodsInfo[payment_channel_id];
                    //     }
                    // });
                    // console.log(res.data.payment_channels);
                    // this.paymentChannels = res.data.payment_channels || [];
                    if (this.tradeGoods.length) {
                        this.paymentChannels = this.tradeGoods[0].payment_channels || [];
                    } else {
                        this.paymentChannels = [];
                    }
                } else {
                    this.tradeGoods = [];
                    this.paymentChannels = [];
                }
                this.goodIndex = 0;
                this.channelIndex = 0;
                this.pageLoading = false;
            });
        },
        getCurCountry() {
            let countryKey = "";
            if (this.curLanguage.lang === "id") {
                countryKey = "INDONESIA";
            } else if (this.curLanguage.lang === "en" || this.curLanguage.lang === "ar") {
                countryKey = "SAUDI_ARABIA";
            }
            this.countryColumns.forEach((item, index) => {
                if (item.key === countryKey) {
                    this.curCountry = item;
                    this.defaultIndex = index;
                }
            });
        },
        setCountryColumns() {
            this.countryColumns = [
                {
                    key: "SAUDI_ARABIA",
                    text: this.$t("Saudi Arabia"),
                },
                {
                    key: "UNITED_ARAB_EMIRATES",
                    text: this.$t("United Arab Emirates"),
                },
                {
                    key: "KUWAIT",
                    text: this.$t("Kuwait"),
                },
                {
                    key: "QATAR",
                    text: this.$t("Qatar"),
                },
                {
                    key: "BAHRAIN",
                    text: this.$t("Bahrain"),
                },
                {
                    key: "JORDAN",
                    text: this.$t("Jordan"),
                },
                {
                    key: "EGYPT",
                    text: this.$t("Egypt"),
                },
                {
                    key: "MOROCCO",
                    text: this.$t("Morocco"),
                },
                {
                    key: "TURKEY",
                    text: this.$t("Türkiye"),
                },
                {
                    key: "OMAN",
                    text: this.$t("Oman"),
                },
                {
                    key: "INDONESIA",
                    text: this.$t("Indonesia"),
                },
                {
                    key: "PHILIPPINES",
                    text: this.$t("Philippines"),
                },
                {
                    key: "MALAYSIA",
                    text: this.$t("Malaysia"),
                },
                // 新加坡
                {
                    key: "SINGAPORE",
                    text: this.$t("Singapore"),
                }
            ];
        },
        // 选择语言
        selectLanguage(item) {
            this.$i18n.locale = item.lang;
            this.curLanguage = item;
            this.setCountryColumns();
            this.getCurCountry();
        },
        // 选择国家
        selectCountry(item) {
            this.curCountry = item;
            this.countryVisible = false;
        },
        // 用户输入框
        onChange(id) {
            if (id) {
                if (this.timer) clearTimeout(this.timer);
                this.loading = true;
                this.timer = setTimeout(() => {
                    this.queryUser(id);
                }, 500);
            } else {
                if (this.timer) clearTimeout(this.timer);
                setTimeout(() => {
                    this.loading = false;
                    this.hasQuery = false;
                    this.userInfo = null;
                }, 500);
            }
        },
        // 查询用户
        queryUser(id) {
            queryUserAPI(id).then((res) => {
                console.log(res);
                if (res.status === 1000) {
                    this.userInfo = res.data;
                    localStorage.setItem('web_uid', res.data.web_uid);
                } else if (res.status === 1002) {
                    this.userInfo = null;
                }
                this.hasQuery = true;
                this.loading = false;
            });
        },
        pay() {
            if (!this.userInfo) {
                Toast({
                    message: this.$t("Please put in YaameID"),
                });
                return false;
            }
            let good = this.tradeGoods[this.goodIndex];
            let channel = this.paymentChannels[this.channelIndex];
            
            orderAPI({
                // country_type: this.curCountry.key,
                // goods_id: good.id,
                // payment_channel_id: channel.channel_id,
                // web_uid: this.userInfo.web_uid,
                config_id: channel.config_id,
                country_type: this.curCountry.key,
                goods_id: good.id,
                web_uid: this.userInfo.web_uid,
            }).then((res) => {
                if (res.status === 1000) {
                    if (res.data.web_pay_url) {
                        location.href = res.data.web_pay_url;
                    } else {
                        Toast({
                            // 没有跳转链接
                            message: 'No jump link',
                        });
                    }
                    
                } else {
                    Toast({
                        message: res.desc,
                    });
                }
            });
        },
        link() {
            location.href = "http://www.yaame.io/";
        },
        back() {
            location.href = "wlyaame://webview/back";
        },
        handleSelect(item, index) {
            this.goodIndex = index;
            this.paymentChannels = item.payment_channels || [];
        }
    },
};
</script>
<style scoped lang="less">
.recharge-container {
    min-height: 100vh;
    background-color: #f4f8fb;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url("../../assets/img/recharge/bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    padding-bottom: 1.6rem;
    box-sizing: border-box;
    .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 0.88rem;
        padding: 0 0.3rem;
        margin-bottom: 0.2rem;
        align-items: center;
        box-sizing: border-box;
        .logo {
            width: 1.5rem;
            // height: 0.3rem;
        }
        .language {
            display: flex;
            align-items: center;
            font-size: 0.28rem;
            line-height: 1;
            color: #666;
            font-weight: bold;
            .language-icon {
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.08rem;
            }
            .arrow-grey {
                width: 0.24rem;
                height: 0.24rem;
            }
        }
    }
    .to-official {
        width: 6.9rem;
        height: 0.92rem;
        background: linear-gradient(90deg, #07cef4 0%, #1dd4d6 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.32rem;
        color: #fff;
        box-sizing: border-box;
        padding: 0 0.3rem 0 0.4rem;
        margin-bottom: 0.3rem;
        border-radius: 0.24rem;
        font-weight: bold;
        .arrow-white {
            width: 0.24rem;
            height: 0.24rem;
        }
    }
    .query-card {
        width: 6.9rem;
        box-sizing: border-box;
        background-color: #fff;
        padding: 0.4rem 0.3rem;
        border-radius: 0.24rem;
        margin-bottom: 0.3rem;
        .query-label {
            font-size: 0.36rem;
            color: #333333;
            font-weight: bold;
            margin-bottom: 0.3rem;
        }
        .query-input {
            width: 100%;
            height: 1.1rem;
            background-color: #f2f5fb;
            border-radius: 0.55rem;
            display: flex;
            align-items: center;
            // input {
            //     flex: auto;
            //     border: none;
            //     outline: none;
            //     background-color: #f2f5fb;
            //     font-size: 0.32rem;
            //     line-height: 0.46rem;
            //     margin-left: 0.4rem;
            //     margin-right: 0.2rem;
            // }
            .query-clear {
                flex: none;
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.4rem;
            }
        }
        .query-user {
            display: flex;
            margin: 0.4rem 0 0;
            .user-avatar {
                width: 1rem;
                height: 1rem;
                margin-right: 0.3rem;
                border-radius: 50%;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .user-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: #333333;
                .user-name {
                    font-size: 0.3rem;
                    line-height: 1;
                    font-weight: bold;
                    margin-bottom: 0.16rem;
                }
                .user-id {
                    font-size: 0.26rem;
                }
            }
        }
        .query-no-user {
            color: #ff2e00;
            font-size: 0.3rem;
            line-height: 1;
            margin: 0.4rem 0 0;
            display: flex;
            align-items: center;
            img {
                width: 0.3rem;
                height: 0.3rem;
                border-radius: 50%;
                margin-right: 0.1rem;
            }
        }
    }
    .diamonds-card {
        width: 6.9rem;
        box-sizing: border-box;
        background-color: #fff;
        padding: 0.4rem 0 0 0.3rem;
        padding-bottom: 0.1rem;
        border-radius: 0.24rem;
        flex-wrap: wrap;
        display: flex;
        // justify-content: space-between;
        margin-bottom: 0.5rem;
        .diamond-item {
            width: 1.9rem;
            height: 2.3rem;
            background-color: #f2f5fb;
            border-radius: 0.24rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.3rem;
            margin-right: 0.3rem;
            box-sizing: border-box;
            &.selected {
                border: 0.04rem solid #00c6e7;
            }
            img {
                width: 0.5rem;
                height: 0.5rem;
                margin-bottom: 0.1rem;
            }
        }
    }
    .pay-method-card {
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.3rem;
        .pay-method-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.3rem;
            .pay-method-title {
                font-size: 0.32rem;
                line-height: 1;
                color: #333333;
            }
            .pay-method-switch {
                display: flex;
                align-items: center;
                font-size: 0.26rem;
                line-height: 1;
                color: #666666;
                img {
                    width: 0.24rem;
                    height: 0.24rem;
                }
            }
        }
        .pay-method-item {
            height: 1.28rem;
            background-color: #fff;
            border-radius: 0.24rem;
            display: flex;
            align-items: center;
            margin-bottom: 0.2rem;
            box-sizing: border-box;
            border: 0.04rem solid #fff;
            position: relative;
            &.selected {
                border: 0.04rem solid #00c6e7;
            }
            .method-item-img {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 0.2rem;
                // background-color: #efefef;
                margin-left: 0.3rem;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
            .method-item-right {
                color: #393939;
                .method-name {
                    font-size: 0.3rem;
                    line-height: 0.4rem;
                    font-weight: bold;
                }
                .method-discount {
                    font-size: 0.24rem;
                    line-height: 1;
                    margin-top: 0.12rem;
                }
            }
            .method-item-favorable {
                width: 1.03rem;
                height: 0.3rem;
                background-image: url(https://yaame-static.yaame.io/admin/e19b0ef9ebdb0af5d88df610dff3a7e8.png);
                background-size: contain;
                background-repeat: no-repeat;
                position: absolute;
                right: 0.8rem;
                top: 0.5rem;
                img {
                    width: 0.22rem;
                    height: auto;
                    position: absolute;
                    left: 0.12rem;
                    top: 0.04rem;
                }
                .num {
                    position: absolute;
                    left: 0.3rem;
                    top: 0;
                    width: 1rem;
                    font-size: 0.24rem;
                    font-weight: 600;
                    color: #FFFFFF;
                    transform: scale(0.75);
                    z-index: 2;
                    margin: 0;
                }
            }
            .method-item-select-img {
                width: 0.3rem;
                height: 0.3rem;
                position: absolute;
                right: 0.3rem;
                top: 0.5rem;
            }
        }
    }
    .pay-btn {
        width: 6.3rem;
        height: 1rem;
        position: fixed;
        bottom: 0.6rem;
        left: 50%;
        margin-left: -3.15rem;
        width: 6.3rem;
        height: 1rem;
        border-radius: 0.5rem;
        background: linear-gradient(135deg, #abf78e 0%, #00e59e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.32rem;
        font-weight: bold;
        z-index: 9;
    }
}
</style>
