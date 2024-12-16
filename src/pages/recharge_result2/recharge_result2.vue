<template>
    <div class="recharge">
        <!-- <img class="logo" src="//imgcom.static.suishenyun.net/web/64de30de-d573-4d92-bd94-71a42b20f955.png" alt="logo" /> -->
        <!-- 充值成功 -->
        <div v-if="status === 'PAYED'">
            <img class="resultIcon" src="//imgcom.static.suishenyun.net/web/48ff80f3-d502-49bb-a2e8-6a3972edc280.png" alt="" />
            <div class="tips">{{ $t("rechargeSuccess") }}</div>
        </div>
        <!-- 充值中 -->
        <div v-else-if="status === 'REFUNDING'">
            <img class="resultIcon" src="//imgcom.static.suishenyun.net/web/35b9ba62-9edd-4c92-bb32-2ebbaf7ea6f9.png" alt="充值中" />
            <div class="tips">{{ $t("recharging") }}</div>
        </div>
        <!-- 失败 -->
        <div v-else-if="status === 'FAIL'">
            <img class="resultIcon" src="//imgcom.static.suishenyun.net/web/2eb0e6c9-bbdb-425d-91ec-c6a489b6b26d.png" alt="" />
            <div class="tips">{{ $t("rechargeFail") }}</div>
        </div>
        <!-- 异常 -->
        <div v-else>
            <!-- <img class="resultIcon" src="//imgcom.static.suishenyun.net/web/2eb0e6c9-bbdb-425d-91ec-c6a489b6b26d.png" alt="" />
            <div class="tips">{{ $t("rechargeAbnormal") }}</div> -->

            <img class="resultIcon" src="//imgcom.static.suishenyun.net/web/35b9ba62-9edd-4c92-bb32-2ebbaf7ea6f9.png" alt="充值中" />
            <div class="tips">{{ $t("recharging") }}</div>
        </div>
        <!-- 确认支付 -->
        <div class="back" @click="back">{{ $t("back") }}</div>

        <pageLoading v-if="pageLoading" />
    </div>
</template>
<script>
import Toast from "../../components/third/toast/toast.js";
import pageLoading from "../../components/common/page_loading.vue";
import { getQueryString } from "../../lib/utils";
import { getXVerCode } from "../../lib/device";
import { checkOrderAPI } from "../recharge/api";
export default {
    components: {
        pageLoading,
    },
    data() {
        const order_no = getQueryString("orderNo");
        const currency = getQueryString("currency");
        const code = getQueryString("code");
        const orderAmount = getQueryString("orderAmount");
        const xver_code = getXVerCode();

        const channel_type = getQueryString("channel_type");
        const outTradeNo = getQueryString("outTradeNo");
        const tradeToken = getQueryString("tradeToken");
        const status = getQueryString("status");
        const web_uid = getQueryString("web_uid") || '';

        return {
            page_loading: true,
            // 订单状态,可用值:CREATED,PAYED,CANCELED,FAIL,REFUNDING,REFUNDED,REFUND_FAIL
            status: "",
            order_no,
            currency,
            code,
            orderAmount,
            xver_code,

            channel_type,
            outTradeNo,
            tradeToken,
            status,
            web_uid,

            pageLoading: true,
        };
    },
    created() {
        document.title = "";
    },
    mounted() {
        this.initData();
        document.body.style.margin = 0;
    },
    methods: {
        // 获取充值结果
        async initData() {
            let options = {};
            if (this.channel_type === "PAYER_MAX") {
                options = {
                    channel_type: this.channel_type,
                    order_id: this.outTradeNo,
                    tradeToken: this.tradeToken,
                    status: this.status,
                    web_uid: this.web_uid,
                };
            } else if (this.channel_type === "DUK_PAY"){
                options = {
                    channel_type: "DUK_PAY",
                    currency: this.currency,
                    order_no: this.order_no,
                    pay_result: this.code,
                    web_uid: this.web_uid,
                };
            }  else if (this.channel_type === "SGATE"){
                options = {
                    channel_type: "SGATE",
                    order_id: getQueryString("orderId")
                };
            }
            if (localStorage.getItem('web_uid')) {
                options.web_uid = localStorage.getItem('web_uid');
            }
            const res = await checkOrderAPI(options);

            this.pageLoading = false;

            if (res.data) {
                this.status = res.data.status;
                let status = res.data.status;


                if (["PAYED", "CANCELED", "FAIL"].indexOf(status) === -1) {
                    status = "FAIL";
                }
            }

            if (res.status === 6307) {
                this.status = "FAIL";
            } else {
                this.status = "";
            }

            if (res.status === 1000) {
                this.status = "PAYED";
                location.href = location.origin + "/recharge.html";
            }
        },
        back() {
            location.href = location.origin + "/recharge.html";
        },
    },
};
</script>
<style scoped>
.pr {
    position: relative;
}
.dflex {
    display: flex;
    align-items: center;
}
.sb {
    justify-content: space-between;
}
.jcc {
    justify-content: center;
}
.recharge {
    padding: 0.27rem;
    font-size: 0.27rem;
}
.logo {
    width: 2.26rem;
    display: block;
}
.confirm,
.back {
    width: 3.45rem;
    height: 0.91rem;
    background: linear-gradient(90deg, #fe3e7f 0%, #fe47bc 100%);
    box-shadow: 0rem 0rem 0.11rem 0rem rgba(255, 48, 146, 0.3);
    border-radius: 0.55rem;
    margin: 30px auto;
    color: #fff;
    text-align: center;
    line-height: 0.91rem;
    position: absolute;
    bottom: 0.33rem;
    left: 50%;
    margin-left: -1.725rem;
}
.back {
    background: #f2f5fb;
    color: #333;
    box-shadow: none;
}
.resultIcon {
    width: 1.45rem;
    display: block;
    margin: 1.74rem auto 0;
}
.tips {
    margin-top: 0.4rem;
    color: #333;
    text-align: center;
}
.tips2 {
    margin-top: 0.09rem;
    text-align: center;
    color: #666;
}
</style>
