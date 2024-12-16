<!-- 折扣商店 -->
<template>
    <div class="shop-con">
        <div class="decorate">
            <img
                class="left"
                src="https://yaame-static.yaame.io/admin/19e5b108464533515698b3b923208ff7.png"
                alt=""
            />
            <img
                class="right"
                src="https://yaame-static.yaame.io/admin/08101077e0377b9bb9a1c97f6c77d467.png"
                alt=""
            />
        </div>
        <div class="discount">
            <div class="title">
                <span>{{ $t("lucky_discount") }}</span>
            </div>
            <div class="countdown-box">
                <span>{{ $t("discount_countdown") }}</span>
                <Countdown :targetDate="countdown" />
            </div>
            <div class="discount-left">
                <img
                    v-if="showImageType == 0"
                    src="https://yaame-static.yaame.io/admin/9a6b5208917ab87d02a704c160163ca6.png"
                    alt=""
                />
                <img
                    v-if="showImageType == 1"
                    class="webpAnimation"
                    id="webpAnimation"
                    src="https://yaame-static.yaame.io/admin/234de69cc49eab0f351e4940c91b87ec.webp"
                    controls
                />
                <img
                    v-if="showImageType == 2"
                    class="webpAnimation"
                    id="webpAnimation"
                    :src="durationEnum[goodsList.discount]"
                    controls
                />
            </div>
            <div class="discount-right">
                <span>{{ $t("draw_your_discount") }}</span>
                <div
                    :class="goodsList.discount > 0 ? 'btn-d' : 'btn'"
                    @click="handleDiscount"
                >
                    <p>{{ $t("click_to_draw") }}</p>
                </div>
            </div>
        </div>
        <div class="shop">
            <div class="title">
                <span>{{ $t("shop") }}</span>
            </div>
            <div class="goodsList">
                <div
                    class="goodsItem"
                    v-for="(item, index) in goodsList.list"
                    :key="index"
                >
                    <div>
                        <span style="margin-right: 3px;">{{ $t("stock") }}</span>
                        <span>{{ item.inventory }}</span>
                    </div>
                    <div
                        class="goods-img"
                        @click="handleShowGift(item.pag_ani_url, true)"
                    >
                        <img :src="item.icon" alt="" />
                    </div>
                    <span>{{ item.name }}</span>
                    <div :class="goodsList.discount ? 'price-un' : 'price'">
                        <img
                            src="https://yaame-static.yaame.io/admin/12076e652b1268fd32952c7745006960.png"
                        />
                        <span>{{ item.original_price }}</span>
                    </div>
                    <div v-if="goodsList.discount" class="price-d">
                        <img
                            src="https://yaame-static.yaame.io/admin/12076e652b1268fd32952c7745006960.png"
                        />
                        <span>{{ item.discounted_prices }}</span>
                    </div>
                    <div class="buy-count">
                        <div
                            :class="item.count <= 1 ? 'minus-d' : 'minus'"
                            @click="handleCount(0, index)"
                        ></div>
                        <span></span>
                        <div class="num">{{ item.count || 1 }}</div>
                        <span></span>
                        <div class="add" @click="handleCount(1, index)"></div>
                    </div>
                    <div
                        :class="item.inventory > 0 ? 'buy-btn' : 'buy-btn-dis'"
                        @click="
                            handleBuy(
                                item.inventory,
                                item.count,
                                item.commodity_id
                            )
                        "
                    >
                        {{ $t("purchase") }}
                    </div>
                </div>
                <div class="footer"></div>
            </div>
        </div>
        <div class="show-gift">
            <popup v-show="showGift" :visible="showGift">
                <div class="close" @click="handleShowGift(null, false)"></div>
                <!-- <canvas
                    id="canvas"
                    class="animation-container"
                    ref="animationContainer"
                ></canvas> -->
                <div class="video-box">
                    <video
                        v-show="giftUrl"
                        class="gift"
                        id="gift-show"
                        x5-video-player-type="h5-page"
                        ref="video"
                        :src="giftUrl"
                        :autoplay="true"
                        preload="auto"
                        muted
                        webkit-playsinline
                        playsinline
                        x5-playsinline
                        x-webkit-airplay="allow"
                        poster=""
                        loop
                    />
                    <img
                        v-show="!giftUrl"
                        src="https://yaame-static.yaame.io/admin/57f7de54a3f7b9329a271677ae136f0a.webp"
                        alt=""
                    />
                </div>
            </popup>
        </div>
    </div>
</template>
<script setup>
import Countdown from "@/components/common/Countdown.vue";
import Toast from "@/components/third/toast/toast";
import { getDiscount, getShopGoods, shopBuy, getVideoResources } from "../api";
import popup from "@/components/common/pop_up.vue";
import { isIOS } from "@/lib/device";
// import { Downloader, Parser, Player } from "svga.lite";
import {
    onMounted,
    defineProps,
    ref,
    watch,
    getCurrentInstance,
    reactive,
} from "vue";
const root = getCurrentInstance();

const t = (value) => {
    return root.proxy.$i18n.t(value);
};
const props = defineProps({
    countdown: {
        type: Number,
        default: 0,
    },
});
const countdown = ref(0);
const showImageType = ref(0);
const showGift = ref(false);
const buyLock = ref(false);
const giftUrl = ref("");
// const downloader = ref(null);
// const parser = ref(null);
// const player = ref(null);
const goodsList = reactive({
    list: [],
    discount: 0,
});

const durationEnum = {
    0.3: "https://yaame-static.yaame.io/admin/24fa554cb5fcff0fe6d9643039a1e792.png",
    0.2: "https://yaame-static.yaame.io/admin/fa7172ee72ee6b9db203a90aad143e77.png",
    0.1: "https://yaame-static.yaame.io/admin/ba3bb3ab50a7fee026ddc18804fcb1b4.png",
};
// 更改购买数量
const handleCount = (type, index) => {
    if (type == 0) {
        if (goodsList.list[index]?.count <= 1) return;
        goodsList.list[index].count--;
    } else {
        if (goodsList.list[index].count < goodsList.list[index].inventory) {
            goodsList.list[index].count++;
        }
    }
};

const handleShowGift = async (url = null, type = false) => {
    showGift.value = type;
    if (isIOS()) {
        giftUrl.value = url;
        return;
    }
    if (!type) return;
    giftUrl.value = null;
    getVideoResources(url).then((res) => {
        const url = URL.createObjectURL(new Blob([res]));
        if (showGift.value) {
            giftUrl.value = url;
        }
    });
};

// const playSvga = async (url) => {
//     if (downloader.value) {
//         downloader.value.destroy();
//         parser.value.destroy();
//         player.value.destroy();
//     }
//     downloader.value = new Downloader();
//     parser.value = new Parser();
//     player.value = new Player("#canvas");
//     const fileData = await downloader.value.get(
//         url || "http://192.168.113.80:8000/3434_王冠.svga"
//     );
//     const svgaData = await parser.value.do(fileData);

//     await player.value.mount(svgaData);
//     player.value.set({ loop: true });
//     player.value.start();
// };

// 获取商店商品列表
const handleGetShopGoods = async () => {
    await getShopGoods().then(
        (result) => {
            // console.log("获取商店商品列表", result);
            if (result?.data?.commodities?.length) {
                result.data.commodities.map((item) => {
                    item["count"] = 1;
                });
                goodsList.list = result.data.commodities;
            }
            countdown.value = result.data?.countdown || 0;
            goodsList.discount = result.data?.discount || 0;
            if (goodsList.discount > 0) {
                showImageType.value = 2;
            }
        },
        (e) => {}
    );
};
// 购买
const handleBuy = (inventory, count, id) => {
    if (!inventory) {
        Toast(t("insufficient_stock"));
        return;
    }

    if (buyLock.value) return;
    buyLock.value = true;
    shopBuy({ commodity_id: id, count }).then(
        (result) => {
            if (result.status === 1000) {
                Toast(result?.data?.msg);
                handleGetShopGoods();
            } else if (result.status === 6600) {
                Toast(result?.desc);
                window.location.href = "wlyaame://mine/shop/diamond?popup=1";
            } else {
                handleGetShopGoods();
                Toast(result?.desc);
            }
            setTimeout(() => {
                buyLock.value = false;
            }, 1500);
        },
        (e) => {
            buyLock.value = false;
        }
    );
};
// 抽取折扣
const handleDiscount = () => {
    if (goodsList.discount > 0) {
        Toast(t("discount_drawn"));
        return;
    }
    getDiscount().then((result) => {
        if (result?.status == 1000) {
            goodsList.discount = result.data.discount;
            showImageType.value = 1;
            setTimeout(() => {
                showImageType.value = 2;
                handleGetShopGoods();
            }, 3500);
        } else {
            Toast(result?.desc);
        }
    });
};

defineExpose({ handleGetShopGoods });
</script>
<style scoped lang="less">
.shop-con {
    .decorate {
        width: 100%;
        height: 2.33rem;
        position: relative;
        z-index: 1;
        .left {
            width: 1.02rem;
            height: 1.37rem;
            position: absolute;
            left: 0;
        }
        .right {
            width: 3.18rem;
            height: 2.33rem;
            position: absolute;
            right: -0.45rem;
        }
    }
    .discount {
        background: url("https://yaame-static.yaame.io/admin/cf8dbaf9ee6e0124c81838e2293f5962.png")
            no-repeat;
        background-size: contain;
        color: #fff;
        margin: 0 auto;
        margin-top: -2rem;
        padding-top: 1.08rem;
        width: 7.17rem;
        height: 7.13rem;
        position: relative;
        z-index: 2;
        text-align: center;
        .title {
            font-size: 0.34rem;
            display: flex;
            justify-content: center;
            color: #770402;
            font-weight: bold;
        }
        .countdown-box {
            // min-width: 3.64rem;
            height: 0.51rem;
            background: #e56e02;
            border-radius: 0.09rem;
            margin: 0 auto;
            margin-top: 0.65rem;
            font-size: 0.26rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            padding: 0 0.15rem;
        }
        .discount-left {
            position: absolute;
            left: 0.4rem;
            top: 3.1rem;
            background: url("https://yaame-static.yaame.io/admin/9a6b5208917ab87d02a704c160163ca6.png")
                no-repeat;
            background-size: contain;
            width: 2.79rem;
            height: 2.79rem;
            .webpAnimation,
            img {
                width: 2.79rem;
                height: 2.79rem;
            }
        }
        .discount-right {
            position: absolute;
            right: 0.4rem;
            top: 3.1rem;
            font-size: 0.28rem;
            color: #770402;
            width: 3.3rem;
            text-align: left;
            line-height: 0.35rem;
            .btn,
            .btn-d {
                background: url("https://yaame-static.yaame.io/admin/73522b45c3d8f087ac0b27655e6caa6f.png")
                    no-repeat;
                background-size: contain;
                width: 2.11rem;
                height: 0.89rem;
                color: #fff;
                margin: 0 auto;
                margin-top: 0.1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                p {
                    text-align: center;
                    font-size: 0.34rem;
                }
            }
            .btn-d {
                opacity: 0.6;
            }
        }
    }
    .shop {
        padding-bottom: 0.2rem;
        .title {
            margin: 0 auto;
            background: url(https://yaame-static.yaame.io/admin/daf33528598de541d575720ed1b63c77.png)
                no-repeat;
            background-size: contain;
            width: 7.35rem;
            height: 2.32rem;
            margin-top: 0.2rem;
            text-align: center;
            line-height: 2.18rem;
            position: relative;
            z-index: 2;
            span {
                font-size: 0.34rem;
                color: #770402;
                font-weight: bold;
            }
        }
        .goodsList {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0.8rem 0.07rem;
            width: 7rem;
            margin: 0 auto;
            margin-top: 0.26rem;
            color: #aa4201;
            font-size: 0.18rem;
            background: #ff9820;
            border-radius: 0.08rem;
            border: 0.04rem solid #ffe265;
            position: relative;
            z-index: 1;
            margin-top: -0.5rem;
            .goodsItem {
                background: url(https://yaame-static.yaame.io/admin/b0d25c45e717a0956e591bc6f655b1f3.png)
                    no-repeat;
                background-size: contain;
                width: 2.2rem;
                height: 4.4rem;
                margin-bottom: 0.34rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding: 0.11rem 0;
                .goods-img {
                    background: url(https://yaame-static.yaame.io/admin/5d5538fe4e192a7178c4249a22a41620.png)
                        no-repeat;
                    background-size: contain;
                    width: 1.74rem;
                    height: 1.74rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 1.5rem;
                    }
                }
                .price,
                .price-d,
                .price-un {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        margin-right: 0.05rem;
                    }
                }
                .price-un {
                    span {
                        text-decoration: line-through;
                    }
                }
                .price,
                .price-un {
                    font-size: 0.15rem;

                    img {
                        width: 0.16rem;
                        height: 0.15rem;
                    }
                }
                .price-d {
                    font-size: 0.2rem;
                    img {
                        width: 0.2rem;
                        height: 0.17rem;
                    }
                }
                .buy-count {
                    width: 1.8rem;
                    height: 0.49rem;
                    background: #e09c0c;
                    border-radius: 0.25rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        width: 0.01rem;
                        height: 0.27rem;
                        background: #ffbc2e;
                    }
                    .minus,
                    .minus-d {
                        background: url("https://yaame-static.yaame.io/admin/69a04442efe574278e269f8165768fba.png")
                            no-repeat;
                        background-size: contain;
                        width: 0.34rem;
                        height: 0.34rem;
                        margin-right: 0.07rem;
                    }
                    .minus-d {
                        background: url(https://yaame-static.yaame.io/admin/c7802e6a1bf0ec9a0988dc19a4ca06a4.png)
                            no-repeat;
                        background-size: contain;
                    }
                    .add {
                        background: url(https://yaame-static.yaame.io/admin/e3ba535635643f6a79f8a7c578ef8a92.png)
                            no-repeat;
                        background-size: contain;
                        width: 0.34rem;
                        height: 0.34rem;
                        margin-left: 0.07rem;
                    }
                    .num {
                        width: 0.7rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.19rem;
                    }
                }
                .buy-btn,
                .buy-btn-dis {
                    background: url(https://yaame-static.yaame.io/admin/d971f2c6e104c0bc56ecf9ffc3bbd6ad.png)
                        no-repeat;
                    background-size: contain;
                    width: 1.44rem;
                    height: 0.61rem;
                    color: #770402;
                    text-align: center;
                    line-height: 0.61rem;
                }
                .buy-btn-dis {
                    opacity: 0.5;
                }
            }
        }
        .footer {
            background: url(https://yaame-static.yaame.io/admin/a814ba019a8633c9ff9569c34c58c60c.png)
                no-repeat;
            background-size: contain;
            width: 7.17rem;
            height: 1.07rem;
            margin: 0 auto;
            position: absolute;
            left: -0.1rem;
            bottom: -0.2rem;
        }
    }

    .show-gift {
        position: relative;
        .animation-container {
            width: 100%;
            margin-top: 15%;
        }
        .video-box {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .gift {
                // width: 50%;
                height: 50%;
            }
            img {
                width: 3rem;
            }
        }
        .close {
            background: url(https://yaame-static.yaame.io/admin/f00b2e711d6125babdbba6bf210029b7.png)
                no-repeat;
            background-size: contain;
            width: 0.5rem;
            height: 0.5rem;
            position: absolute;
            right: 48%;
            top: 80%;
            z-index: 99;
        }
    }
}
</style>
