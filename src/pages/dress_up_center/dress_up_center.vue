<!--
 * @Author: Elk
 * @Date: 2023-06-03 19:00:38
 * @FilePath: /yaame-h5/src/pages/dress_up_center/dress_up_center.vue
 * @Description: 
-->
<template>
    <div :class="{ 'no-scroll': detailsVisible, container: true }">
        <div
            class="page-top"
            :style="{
                paddingTop: safe_height + 'rem',
                height: safe_height + 2.8 + 'rem',
            }"
        >
            <header :class="['page-header', language === 'ar' && 'arabia-header']">
                <img
                    src="../../assets/img/common/icon_back_white.png"
                    class="back"
                    @click="back"
                />
                <div class="header-content">{{ $t("DecoratingCenter") }}</div>
                <div
                    v-if="from !== 'my_bag'"
                    class="right"
                    @click="headerRightCallBack"
                >
                    {{ $t("MyBackpack") }}
                </div>
            </header>
            <van-tabs
                v-model="tab_active_type"
                :swipe-threshold="2"
                swipeable
                class="dress-type"
                ref="topTab"
            >
                <!--顶部菜单-->
                <van-tab v-for="(item, index) in dress_up_type_vo" :key="index">
                    <template #title>
                        <div
                            :class="{
                                'dress-tab-item': true,
                                active:
                                    dress_up_type_vo[tab_active_type].type_key === item.type_key,
                            }"
                            @click="dressActiveChange(dress_up_type_vo[index].type_key)"
                        >
                            {{ item.type_name }}
                        </div>
                    </template>
                </van-tab>
            </van-tabs>

            <van-tabs v-model="get_active" class="get-type" @change="getActiveClick">
                <!--二级菜单-->
                <van-tab v-for="(item, index) in getList" :key="index">
                    <template #title>
                        <div
                            :class="{
                                'get-tab-item': true,
                                active: getList[get_active].label === item.label,
                            }"
                        >
                            {{ item.name }}
                        </div>
                    </template>
                </van-tab>
            </van-tabs>

            <!-- <refresh ref="wlRefresh" @onRefresh="handleRefresh"> -->
            <div>
                <!--奖品内容-->
                <div v-show="list && list.length" ref="tab" class="dress-container">
                    <div>
                        <div
                            v-for="(item, index) in list"
                            :key="index"
                            class="dress-content"
                        >
                            <div :ref="item.access">
                                <div class="dress-content-name">
                                    <img :src="findByLabel(item.access).img" alt="" />
                                    {{ findByLabel(item.access).name }}
                                </div>
                                <div
                                    v-for="(ele, inx) in item.goods"
                                    :key="inx"
                                    :class="{
                                        'dress-item': true,
                                        'dress-item-bg':
                                            ele.type === 'INCOME_ANIMATION' ||
                                            ele.type === 'HOME_PLUS',
                                    }"
                                    @click="showDetails(ele)"
                                >
                                    <div class="dress-item-bg"></div>
                                    <!-- <div v-if="tab_active_type === 0" class="dress-item-type">
                                        <p>{{ findByKey(ele.type).type_name }}</p>
                                    </div> -->
                                    <div class="dress-item-img">
                                        <img :src="ele.icon_url" alt="" />
                                    </div>
                                    <div class="dress-item-name no-wrap">{{ ele.name }}</div>
                                </div>
                                <!--金币购买钻石-->
                                <div
                                    v-for="(ele, inx) in item.gold_products"
                                    :key="inx"
                                    :class="{
                                        'dress-item': true,
                                        'dress-item-bg':
                                            ele.type === 'INCOME_ANIMATION' ||
                                            ele.type === 'HOME_PLUS',
                                    }"
                                    @click="showDiamond(ele, inx, 1)"
                                >
                                    <div class="dress-item-bg"></div>
                                    <div class="number">
                                        {{ ele.already_quantity+'/'+ele.product_month_amount }}
                                    </div>
                                    <div class="dress-item-img">
                                        <img :src="ele.product_icon" alt="" />
                                    </div>
                                    <div class="dress-item-name no-wrap">{{ ele.diamond_amount + `${$t('Diamond')}` }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!list.length" class="empty">
                    <img v-if="appType === 'sweet'" :src="sweet_empty_img_url" alt="" />
                    <img v-else-if="appType === 'cu'" :src="sweet_empty_img_url" alt="" />
                    <img v-else :src="empty_img_url" alt="" />
                    <p>{{ $t("NoDress") }}</p>
                </div>
            </div>
            <!-- </refresh> -->

            <van-action-sheet
                v-model="detailsVisible"
                :safe-area-inset-bottom="false"
            >
                <div class="details">
                    <div
                        :class="{
                            'details-img': true,
                            'details-img-bg':
                                dress_info.type === 'INCOME_ANIMATION' ||
                                dress_info.type === 'HOME_PLUS',
                        }"
                    >
                        <div
                            v-if="dress_info.type === 'AVATAR_DRESS' || dress_info.type === 'MIKE_EFFECT'"
                            class="avatar-dress-box"
                        >
                            <img :src="user_avatar" class="user-avatar" alt="" />

                            <img
                                v-show="dress_info.webp_anim_url"
                                :src="dress_info.webp_anim_url"
                                class="avatar-dress-img"
                                alt=""
                            />
                            <canvas
                                v-show="!dress_info.webp_anim_url && dress_info.svga_anim_url"
                                id="address-canvas"
                            ></canvas>
                            <img
                                v-show="!dress_info.svga_anim_url && !dress_info.webp_anim_url"
                                :src="dress_info.icon_url"
                                class="avatar-dress-img"
                                alt=""
                            />
                        </div>

                        <div
                            v-else-if="dress_info.type === 'MIKE_HALO'"
                            class="avatar-dress-box"
                        >
                            <img :src="user_avatar" class="user-avatar" alt="" />

                            <canvas
                                v-show="dress_info.svga_anim_url"
                                id="mike-canvas"
                                width="140"
                                height="140"
                                style="width: 2.8rem; height: 2.8rem;"
                            ></canvas>
                            <img
                                v-show="!dress_info.svga_anim_url"
                                :src="dress_info.icon_url"
                                class="avatar-dress-img"
                                alt=""
                            />
                        </div>

                        <div
                            v-else-if="dress_info.type === 'TAIL_LIGHT'"
                            class="tail-light-box"
                        >
                            <div class="tail-light-user">
                                <img :src="user_avatar" alt="" />
                                {{ nick_name }}
                            </div>
                            <div class="tail-light-img">
                                {{ $t("HiEveryone") }}
                                <canvas
                                    v-show="dress_info.svga_anim_url"
                                    id="tail-canvas"
                                ></canvas>
                                <img
                                    v-if="!dress_info.svga_anim_url"
                                    :src="dress_info.icon_url"
                                    alt=""
                                />
                            </div>
                        </div>
                        <img
                            v-else
                            :src="dress_info.icon_url"
                            alt=""
                            class="dress-detail-img"
                        />

                        <img
                            v-if="
                                dress_info.svga_anim_url &&
                                (dress_info.type === 'INCOME_ANIMATION' ||
                                    dress_info.type === 'HOME_PLUS')
                            "

                            v-show="dress_info.svga_anim_url.indexOf('.mp4') === -1"
                            class="preview-img"
                            src="http://imgcom.static.suishenyun.net/jiaoyou_icon_yinpin_play@2x-c16617.png"
                            @click="showPreview(dress_info)"
                        />
                    </div>

                    <div class="details-info">
                        <div class="details-name">{{ dress_info.name }}</div>
                        <div class="details-content">{{ dress_info.desc }}</div>
                    </div>

                    <div v-if="dress_info.access === 'DIAMOND'" class="buy-dress">
                        <div class="price-list">
                            <div
                                v-for="(item, index) in dress_info.items"
                                :key="index"
                                :class="{
                                    'price-item': true,
                                    active: selected_price_index === index,
                                }"
                                @click="
                                    selected_price_index = index;
                                "
                            >
                                <div class="price-item-day">{{ item.period_count }}{{ $t('day') }}</div>
                                <div class="price-item-diamond">
                                    {{ item.diamond }}
                                    <img
                                        style="width: 0.28rem; height: auto; margin-top: 0.06rem"
                                        src="http://imgcom.static.suishenyun.net/zb_decorate_zs@2x-fa29e7.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="user-diamond">
                            <img
                                src="http://imgcom.static.suishenyun.net/zb_decorate_zs@2x-fa29e7.png"
                                alt=""
                            />
                            {{ $t("DiamondBalance") }}:{{ this.balance_diamond }}
                            <span class="to-charge" @click="toRecharge"
                                >| {{ $t("ToCharge") }}
                                <img
                                    src="http://imgcom.static.suishenyun.net/room_icon_jt_w@2x-83c985.png"
                            /></span>
                        </div>
                    </div>

                    <!--金币购买装扮-->
                    <div v-if="dress_info.access === 'COIN'" class="buy-dress">
                        <div class="price-list">
                            <div
                                v-for="(item, index) in dress_info.items"
                                :key="index"
                                :class="{
                                    'price-item': true,
                                    active: selected_price_index === index,
                                }"
                                @click="
                                    selected_price_index = index;
                                "
                            >
                                <div class="price-item-day">{{ item.period_count }}{{ $t('day') }}</div>
                                <div class="price-item-diamond">
                                    {{ item.diamond }}
                                    <img
                                        style="width: 0.28rem; height: auto; margin-top: 0.06rem"
                                        src="https://yaame-static.yaame.io/admin/a8b63e30360b2f2bbaa801399bb39476.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="user-diamond">
                            <img
                                src="https://yaame-static.yaame.io/admin/a8b63e30360b2f2bbaa801399bb39476.png"
                                alt=""
                            />
                            {{ $t('coinBalance') }}{{ money_balance }}
                        </div>
                    </div>

                    <div v-else-if="dress_info.access === 'CRYSTAL'" class="buy-dress">
                        <div class="price-list">
                            <div
                                v-for="(item, index) in dress_info.items"
                                :key="index"
                                :class="{
                                    'price-item': true,
                                    active: selected_price_index === index,
                                }"
                                @click="
                                    selected_price_index = index;
                                "
                            >
                                <div class="price-item-day">{{ item.period_count }}{{ $t('day') }}</div>
                                <div class="price-item-diamond">
                                    {{ item.diamond }}
                                    <img
                                        style="width: 0.28rem; height: auto; margin-top: 0.06rem"
                                        src="https://yaame-static.yaame.io/admin/3b95e699f2d1b41cc2a9a2ace0dd684e.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="user-diamond">
                            <img
                                src="https://yaame-static.yaame.io/admin/3b95e699f2d1b41cc2a9a2ace0dd684e.png"
                                alt=""
                            />
                            {{ $t("CrystalBalance") }}:{{ this.crystal_balance }}
                            <!-- <span class="to-charge" @click="toRecharge"
                                >| {{ $t("ToCharge") }}
                                <img
                                    src="http://imgcom.static.suishenyun.net/room_icon_jt_w@2x-83c985.png"
                            /></span> -->
                        </div>
                    </div>

                    <div v-else-if="dress_info.access === 'LEVEL'" class="get-info">
                        <p v-if="dress_info && dress_info.items" class="unlock-desc">
                            <img
                                style="width: 0.15rem; height: auto; margin-top: 0.06rem"
                                src="http://imgcom.static.suishenyun.net/icon_suo@2x-b207ce.png"
                                alt=""
                            />
                            {{ dress_info.items.find(item => item.unlock_tip !== undefined).unlock_tip }}
                            <span style="margin: 0 0.1rem">|</span>
                            <img
                                :src="popular_level_icon"
                                style="width: 0.9rem; height: auto"
                                alt=""
                            />
                        </p>
                        <p v-else>{{ dress_info.access_desc }}</p>
                    </div>

                    <div v-else-if="dress_info.access === 'NOBLE'" class="get-info">
                        <p v-if="dress_info && dress_info.items" class="unlock-desc">
                            <img
                                style="width: 0.15rem; height: auto; margin-top: 0.06rem"
                                src="http://imgcom.static.suishenyun.net/icon_suo@2x-b207ce.png"
                                alt=""
                            />
                            {{ dress_info.items.find(item => item.unlock_tip !== undefined).unlock_tip }}
                            <template v-if="noble_level_badge">
                                <span style="margin: 0 0.1rem">|</span>
                                <img
                                    :src="noble_level_badge"
                                    style="height: 0.36rem; width: auto"
                                    alt=""
                                />
                            </template>
                        </p>
                        <p v-else>{{ dress_info.access_desc }}</p>
                    </div>

                    <div class="buy-button">
                        <common-button
                            :width="650"
                            :height="88"
                            :radius="44"
                            :font="30"
                            :type="
                                'sweet'
                            "
                            :disabled="dress_info.access === 'ACTIVE'"
                            :class="{
                                disabled: dress_info.access === 'ACTIVE',
                                orange:
                                    dress_info.access === 'LEVEL' ||
                                    dress_info.access === 'NOBLE',
                            }"
                            @click="submitFun"
                        >
                            {{ dress_info.store_button_desc }}
                        </common-button>
                    </div>
                </div>
            </van-action-sheet>

            <!--购买钻石弹窗-->
            <van-action-sheet v-model="showDiamondShow" :safe-area-inset-bottom="false" class="diamond">
                <!--礼物图片-->
                <img :src="dress_info.product_icon" alt="" class="diamond-gift">
                <span class="diamond-number">{{ dress_info.diamond_amount }}{{ $t('diamonds') }}</span>
                <p class="text">{{ dress_info.month_desc }}</p>
                <p class="repertory">{{ dress_info.name }}</p>
                <div class="price">
                    <img src="https://yaame-static.yaame.io/admin/a8b63e30360b2f2bbaa801399bb39476.png" alt="">
                    {{ dress_info.gold_amount }}
                </div>
                <div class="gold-balance">
                    <img src="https://yaame-static.yaame.io/admin/a8b63e30360b2f2bbaa801399bb39476.png" alt="">
                    {{ $t('coinBalance') }}{{ money_balance }}
                </div>
                <div class="purchase" @click="buyDiamond">
                    <span>{{ $t('purchase') }}</span>
                    <p>{{ dress_info.user_week_desc }}</p>
                </div>
            </van-action-sheet>
            <div v-show="show_preview" id="demoCanvas" class="preview-box">
                <div v-show="show_preview_loading" class="loading-text">
                    loading
                    <span class="dot">...</span>
                </div>

                <canvas v-show="!show_preview_loading" id="canvas"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
    import request from "../../lib/request/dress_up.js";
    import Toast from "../../components/third/toast/toast";
    import { getAppType, getLanguage, getSafeHeight, isIOS, getXVerCode } from "../../lib/device";
    import { getQueryString } from "../../lib/utils";
    import define from "../../lib/define.js";
    import { Downloader, Parser, Player } from "svga.lite";

    export default {
    components: {
        refresh: () => import("../../components/common/refresh.vue"),
        commonButton: () => import("../../components/common/button.vue"),
    },
    data() {
        return {
            from: getQueryString("from"),
            safe_height: 0,
            appType: getAppType(),
            empty_img_url: define.empty_img_url,
            sweet_empty_img_url: define.sweet_empty_img_url,
            detailsVisible: false,
            showDiamondShow: false,
            tabSelect: false,
            page_loading: true,
            nick_name: "",

            page: 1,

            tab_active_type: 0,
            ad_list: [],
            dress_up_type_vo: [
                {
                    type_key: "RECOMMEND",
                    type_name: "RECOMMEND",
                },
                {
                    type_key: "INCOME_ANIMATION",
                    type_name: "INCOME ANIMATION",
                },
                {
                    type_key: "AVATAR_DRESS",
                    type_name: "AVATAR DRESS",
                },
                {
                    type_key: "CHAT_BUBBLE",
                    type_name: "CHAT BUBBLE",
                },
                {
                    type_key: "MIKE_HALO",
                    type_name: "MIKE HALO",
                },
                {
                    type_key: "HOME_PLUS",
                    type_name: "HOME PLUS",
                },
                {
                    type_key: "TAIL_LIGHT",
                    type_name: "TAIL LIGHT",
                },
                {
                    type_key: "PROP",
                    type_name: "PROP",
                },
                // {
                //     type_key: "GOLD_PURCHASE_DIAMONDS",
                //     type_name: "GOLD_PURCHASE_DIAMONDS",
                // }
            ],
            user_avatar: [],
            balance_diamond: 0,
            crystal_balance: 0,
            money_balance: 0,

            arr_object: {
                RECOMMEND: [],
                INCOME_ANIMATION: [],
                AVATAR_DRESS: [],
                CHAT_BUBBLE: [],
                MIKE_HALO: [],
                HOME_PLUS: [],
                TAIL_LIGHT: [],
                PROP: [],
                GOLD_PURCHASE_DIAMONDS: []
            },

            get_active: 0,

            dress_info: {},
            selected_price_index: 0,
            show_preview: false,
            show_preview_loading: false,
            downloader: null,
            parser: null,
            player: null,

            address_downloader: null,
            address_parser: null,
            address_player: null,

            mike_downloader: null,
            mike_parser: null,
            mike_player: null,

            tail_downloader: null,
            tail_parser: null,
            tail_player: null,

            popular_level_icon: "",
            noble_level_badge: "",
            throttle: false,
            dataIndex: null,
            dress_key_type: "",
        };
    },
    watch: {
        tab_active_type() {
            this.getTabDetails(this.dress_up_type_vo[this.tab_active_type].type_key);
        },
        detailsVisible(val) {
            if (val === false) {
                if (this.address_downloader) {
                    this.address_downloader.cancel();
                    this.address_player.clear();
                }
                if (this.mike_downloader) {
                    this.mike_downloader.cancel();
                    this.mike_player.clear();
                }
            }
        },
    },
    async mounted() {
        let self = this;
        const safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100;
        await this.getData();

        for (let index = 0; index < this.dress_up_type_vo.length; index++) {
            const element = this.dress_up_type_vo[index];
            await this.getTabDetails(element.type_key);
        }
        this.dressActiveChange('AVATAR_DRESS');

        window.onload = function () {
            self.setWindowScrollFun();
        };
        this.downloader = new Downloader();
        // 默认调用 WebWorker 线程解析
        // 可配置 new Parser({ disableWorker: true }) 禁止
        this.parser = new Parser();
        // #canvas 是 HTMLCanvasElement
        this.player = new Player("#canvas");

        // window.setInterval(function () {
        //     self.getData();
        // }, 3000);
        window.onPaySuccess = async function () {
            setTimeout(() => {
                self.getData();
            }, 500);
        }
},
    computed: {
        list() {
            let arr = this.arr_object[
                this.dress_up_type_vo[this.tab_active_type].type_key
            ];
            return arr.filter((item) => item.access !== 'CUSTOMIZED');
        },
        getList() {
            let array = this.arr_object[
                this.dress_up_type_vo[this.tab_active_type].type_key
            ].map((item) => item.access);
            let list = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                for (let sort = 0; sort < this.getTypeArr.length; sort++) {
                    const node = this.getTypeArr[sort];
                    if (element === node.label) {
                        list.push(node);
                    }
                }
            }
            return list;
        },
        language() {
            return getLanguage() || "en";
        },
        getTypeArr() {
            return [
                {
                    name: this.$t('diamondPurchase'),
                    label: "DIAMOND",
                    img: "http://imgcom.static.suishenyun.net/zb_decorate_zs@2x-fa29e7.png",
                },
                {
                    name: this.$t('activitiesObtained'),
                    label: "ACTIVE",
                    img: "http://imgcom.static.suishenyun.net/zb_decorate_hd@2x-1c602c.png",
                },
                {
                    name: this.$t('gradeExclusive'),
                    label: "LEVEL",
                    img: "http://imgcom.static.suishenyun.net/zb_decorate_dj@2x-1a37c5.png",
                },
                {
                    name: this.$t('aristocraticExclusive'),
                    label: "NOBLE",
                    img: "http://imgcom.static.suishenyun.net/zb_decorate_gz@2x-e8a1e9.png",
                },
                {
                        name: this.$t('VIPExclusive'),
                        label: "VIP",
                        img: "https://yaame-static.yaame.io/admin/20d6845f3d3ee692d0263c5f66ae1cb5.png",
                },
                {
                    name: this.$t('coinPurchase'),
                    label: "COIN",
                    img: "https://yaame-static.yaame.io/admin/a8b63e30360b2f2bbaa801399bb39476.png",
                }, {
                    name: this.$t('crystalPurchase'),
                    label: "CRYSTAL",
                    img: "https://yaame-static.yaame.io/admin/3b95e699f2d1b41cc2a9a2ace0dd684e.png",
                }
            ];
        },
    },
    beforeDestroy() {
        this.$refs["tab"].removeEventListener("scroll", this.scrollFun);
    },
    methods: {
        async submitFun() {
            if (this.dress_info.access === "ACTIVE") {
                return;
            }
            if (
                this.dress_info.access === "NOBLE" ||
                this.dress_info.access === "LEVEL" ||
                this.dress_info.access === "VIP"
            ) {
                location.href = this.dress_info.store_button_url;
            }
            if (this.dress_info.access === "DIAMOND" || this.dress_info.access === "COIN" || this.dress_info.access === "CRYSTAL") {
                let res = await request.createDressOrder({
                    id: this.dress_info.items[this.selected_price_index].id,
                    dressUpType: this.dress_key_type
                });
                this.detailsVisible = false;
                if (res.status !== 1000) {
                    if (res.status === 1023) {
                        Toast(this.$t('toCharge'))
                    }

                    let ver_code = getXVerCode();
                    if (this.dress_info.access === "DIAMOND" && Number(ver_code) >= 11600) {
                        setTimeout(() => {
                            location.href = 'wlyaame://mine/shop/diamond?popup=1&source=buy_dress_up';
                        }, 1000);
                    }
                    
                    if (res.status === 10002) {
                        Toast(res.desc);
                    }
                    return;
                }

                Toast(this.$t('buySuccess'))

                if (isIOS()) {
                    window.webkit.messageHandlers.consumeInWebMall.postMessage(
                        this.dress_info.access
                    );
                }
                //  else {
                //     window.peanut_client.consumeInWebMall(
                //         this.dress_info.access
                //     );
                // }
                setTimeout(() => {
                    this.getData();
                }, 2000);
            }
        },
        // 金币买钻石弹窗
        showDiamond (detail, index, inx) {
            /*
                0: 购买后刷新逻辑
                1： 弹窗打开
             */
            if (inx === 1) {
                this.showDiamondShow = true;
            }
            this.dress_info = detail;
            this.dataIndex = index;
            // 处理每月每周限购数量显示
            this.dress_info.month_desc = detail.month_desc.replace(/{|}/g, '');
            this.dress_info.user_week_desc = detail.user_week_desc.replace(/{|}/g, '');
        },
        // 发起购买
        async buyDiamond () {
            try {
                // 节流阀处理间隔1s
                if (this.throttle) return;
                this.throttle = true;
                const res = await request.createDressOrder({
                    id: this.dress_info.id,
                    dressUpType: 'GOLD_PURCHASE_DIAMONDS'
                });
                if (res.status !== 1000) {
                    if (res.status === 10016) {
                        // 处理返回错误提示的{}
                        Toast(res.desc.replace(/{|}/g, ''));
                        this.showDiamondShow = false;
                        await this.getTabDetails('GOLD_PURCHASE_DIAMONDS');
                        setTimeout(() => {
                            this.throttle = false;
                        },1000)
                        return;
                    }
                    // 处理返回错误提示的{}
                    Toast(res.desc.replace(/{|}/g, ''));
                    await this.refresh();
                    setTimeout(() => {
                        this.throttle = false;
                    },1000)
                    return;
                }
                Toast(this.$t('diamondsInWallet'));
                setTimeout(() => {
                    this.throttle = false;
                },1000)
                await this.refresh();
                this.showDiamondShow = false;
            } catch (err) {
                console.log(err);
            }
        },
        async refresh () {
            await this.getTabDetails('GOLD_PURCHASE_DIAMONDS');
            // 刷新当前弹窗数据
            this.showDiamond(this.arr_object['GOLD_PURCHASE_DIAMONDS'][0].gold_products[this.dataIndex], this.dataIndex, 0);
        },
        showDetails(detail) {
            this.detailsVisible = true;
            this.selected_price_index = 0;
            this.dress_info = detail;
            console.log(this.dress_info);
            if (detail.svga_anim_url && detail.svga_anim_url.indexOf('http://') > -1) {
                detail.svga_anim_url.replace("http://", "https://");
            }
            if (this.dress_info.access === "DIAMOND") {
                this.dress_info.items.sort((a, b) => a.period_count - b.period_count);
            }
            if (detail.type === "AVATAR_DRESS" && detail.svga_anim_url) {
                if (!detail.webp_anim_url) {
                    this.$nextTick(async () => {
                        await this.initSvga("address", detail.svga_anim_url);
                    });
                }
            } else if (detail.type === "MIKE_HALO" && detail.svga_anim_url) {
                this.$nextTick(async () => {
                    await this.initSvga("mike", detail.svga_anim_url);
                });
            } else if (detail.type === "TAIL_LIGHT" && detail.svga_anim_url) {
                this.$nextTick(async () => {
                    await this.initSvga("tail", detail.svga_anim_url);
                });
            } else if (detail.type === "MIKE_EFFECT" && detail.svga_anim_url) {
                this.$nextTick(async () => {
                    await this.initSvga("address", detail.svga_anim_url);
                });
            } else if (detail.type === "GOLD_PURCHASE_DIAMONDS" && detail.svga_anim_url) {
                this.$nextTick(async () => {
                    await this.initSvga("gold", detail.svga_anim_url);
                });
            }
        },

        async initSvga(val, svga) {
            if (this[`${val}_downloader`]) {
                this[`${val}_downloader`].destroy();
                this[`${val}_parser`].destroy();
                this[`${val}_player`].destroy();
            }
            this[`${val}_downloader`] = new Downloader();
            this[`${val}_parser`] = new Parser();
            this[`${val}_player`] = new Player(`#${val}-canvas`);
            const fileData = await this[`${val}_downloader`].get(svga);
            const svgaData = await this[`${val}_parser`].do(fileData);
            await this[`${val}_player`].mount(svgaData);
            this[`${val}_player`].set({ loop: 0 });
            this[`${val}_player`].start();
        },
        /**
         * @description: 获取方式tab栏点击方法
         * @param {*} index
         * @return {*}
         */
         getActiveClick(index) {
            if (this.tabSelect) {
                return;
            }
            this.tabSelect = true;

            // 获取动态的字体大小
            const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.7;

            this.$refs['tab'].scrollTop = (this.$refs[this.getList[index].label][0].offsetTop) - htmlSize;

            let self = this;
            setTimeout(() => {
                self.tabSelect = false;
            }, 700);
        },
        findByLabel(key) {
            let array = this.getTypeArr;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.label === key) {
                    return element;
                }
            }
        },
        findByKey(key) {
            let array = this.dress_up_type_vo;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.type_key === key) {
                    return element;
                }
            }
        },
        /**
         * @description: 获取页面基础数据
         */
        async getData() {
            let res = await request.getDressUpHomeInfo();
            if (res.status !== 1000) return;
            this.ad_list = res.data.ad_list;
            this.dress_up_type_vo = res.data.dress_up_types;
            this.user_avatar = res.data.avatar;
            this.balance_diamond = res.data.balance_diamond;
            this.crystal_balance = res.data.crystal_balance;
            this.money_balance = res.data.money_balance;
            this.nick_name = res.data.nick_name;
            this.popular_level_icon = res.data.popular_level_icon;
            this.noble_level_badge = res.data.noble_level_badge;
            if (this.page_loading) {
                for (let index = 0; index < this.dress_up_type_vo.length; index++) {
                    const element = this.dress_up_type_vo[index];
                    this.arr_object[element.type_key] = [];
                }
            }
            // 没有字段刷新掉
            let show = false;
            res.data.dress_up_types.forEach((item) => {
                if (item.type_key === "GOLD_PURCHASE_DIAMONDS") show = true;
            })
            if (this.dress_key_type === 'GOLD_PURCHASE_DIAMONDS' && !show) {
                window.location.reload();
            }
            this.page_loading = false;
        },
        async showPreview(item) {
            let svga_url = item.svga_anim_url;
            if (!svga_url) {
                return;
            }

            if (svga_url.indexOf('.mp4') > -1) {
                console.log(svga_url);

                // 创建 video 元素
                var video = document.createElement('video');
                video.src = svga_url;
                video.controls = false; // 隐藏默认操作栏
                video.autoplay = true; // 自动播放

                video.style.width = '100vw';
                video.style.height = '100vh';
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.zIndex = '9999';

                // 监听播放结束事件
                video.addEventListener('ended', function() {
                    video.pause(); // 暂停视频
                    video.currentTime = 0; // 重置播放进度
                    document.body.removeChild(video); // 移除视频元素
                });

                // 将 video 元素添加到页面中
                document.body.appendChild(video);
            } else {
                this.show_preview = true;
                this.show_preview_loading = true;
                const fileData = await this.downloader.get(svga_url);
                const svgaData = await this.parser.do(fileData);
                this.show_preview_loading = false;
                this.player.set({ loop: 1 });

                await this.player.mount(svgaData);
                this.player.$on("end", () => {
                    this.closePreview();
                });
                this.player.start();
            }
        },
        closePreview() {
            this.show_preview = false;
            this.downloader.cancel();
            this.player.clear();
        },
        dressActiveChange(key) {
            this.dress_key_type = key;
            this.$refs["tab"].removeEventListener("scroll", this.scrollFun);

            this.$nextTick(() => {
                this.setWindowScrollFun();
            });
        },
        /**
         * @description: 给window绑定滚动方法
         * @return {*}
         */
        setWindowScrollFun() {
            this.$refs["tab"].addEventListener("scroll", this.scrollFun);
        },
        scrollFun() {
            // 获取动态的字体大小
            const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.7;

            let array = [];
            for (let index = 0; index < this.getList.length; index++) {
                array.push(this.$refs[`${this.getList[index].label}`][0]);
            }
            const tabH = this.$refs['tab'].scrollTop;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if ((element.offsetTop) - htmlSize === tabH) this.get_active = index;
            }
        },
        /**
         * @description: 获取当前tab内容
         */
        async getTabDetails(type) {
            let res = await request.getDressUpListV2(type, this.page);
            if (res.status !== 1000) return;
            if (res.data) {
                this.arr_object[type] = res.data.content;
            } else {
                this.arr_object[type] = [];
            }

            this.$forceUpdate();
        },

        /**
         * @description: 刷新页面
         */
        async handleRefresh() {
            this.page = 1;
            await this.getTabDetails(
                this.dress_up_type_vo[this.tab_active_type].type_key
            );
            setTimeout(() => {
                this.$refs.wlRefresh.isLoading = false;
            }, 500);
        },

        /**
         * @description: 跳转我的背包
         */
        headerRightCallBack() {
            location.href = "wlyaame://back/pack/list?from=dress_up_center";
        },
        /**
         * @description: 返回上级
         * @return {*}
         */
        back() {
            location.href = `wlyaame://webview/back`;
        },
        toRecharge() {
            this.detailsVisible = false;
            window.location.href = "wlyaame://mine/shop/diamond?popup=1";
        },
    },
};
</script>
<style lang="less" scoped>
// 未选中文字颜色
@color-no-selected-text: #999;

.container {
    position: relative;
    font-size: 0.24rem;
    color: #fff;
    height: 100vh;
    overflow-y: scroll;
    background-image: url("http://imgcom.static.suishenyun.net/dress_up_center_bg-f9dd40.png");
    background-size: contain;
    background-repeat: no-repeat;
    &.no-scroll {
        overflow: hidden;
    }
    .page-top {
        position: sticky;
        width: 100vw;
        top: 0;
        left: 0;
        background-image: url("http://imgcom.static.suishenyun.net/dress_up_center_bg-f9dd40.png");
        background-size: 100vw auto;
        background-repeat: no-repeat;
        .diamond {
            height: 8.81rem;
            background: linear-gradient( 180deg, #00223A 0%, #051B22 100%);
            border-radius: .24rem .24rem 0 0;
            opacity: 0.95;
            /deep/.van-action-sheet__content {
                position: relative;
                .diamond-gift {
                    position: absolute;
                    left: 50%;
                    top: .58rem;
                    width: 1.81rem;
                    height: 1.81rem;
                    transform: translateX(-50%);
                }
                .diamond-number {
                    position: absolute;
                    width: 100%;
                    top: 2.6rem;
                    color: #fff;
                    font-size: .32rem;
                    text-align: center;
                }
                .text {
                    position: absolute;
                    width: 100%;
                    top: 3.22rem;
                    padding: 0 .2rem;
                    font-size: .24rem;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #17D2DE;
                    text-align: center;
                }
                .repertory {
                    position: absolute;
                    top: 3.94rem;
                    width: 100%;
                    font-size: .2rem;
                    color: #ccc;
                    text-align: center;
                }
                .price {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 4.64rem;
                    left: 50%;
                    width: 6.5rem;
                    height: 1.32rem;
                    transform: translateX(-50%);
                    background: #344853;
                    border-radius: .24rem;
                    border: .03rem solid #17D2DE;
                    color: #17D2DE;
                    img {
                        width: .28rem;
                        height: .28rem;
                        margin-right: .09rem;
                    }
                }
                .gold-balance {
                    position: absolute;
                    display: flex;
                    top: 6.37rem;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    font-size: .2rem;
                    color: #ccc;
                    img {
                        width: .24rem;
                        height: .24rem;
                        margin-right: .08rem;
                    }
                }
                .purchase {
                    position: absolute;
                    display: flex;
                    bottom: .6rem;
                    left: 50%;
                    width: 6.50rem;
                    height: 1rem;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transform: translateX(-50%);
                    background: linear-gradient( 135deg, #ABF78E 0%, #00E59E 100%);
                    border-radius: .5rem;
                    color: #fff;
                    font-size: .2rem;
                    span {
                        font-size: .32rem;
                    }
                    p {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2; /* 控制显示的行数 */
                        overflow: hidden;
                        text-overflow: ellipsis; /* 超出部分显示省略号 */
                        text-align: center;
                        line-height: .2rem;
                        padding: 0 .2rem;
                    }
                }
            }
        }
        .page-header {
            display: flex;
            height: 0.88rem;
            line-height: 0.88rem;
            width: 100%;
            font-size: 0.34rem;
            color: #fff;
            text-align: center;
            position: sticky;
            top: 0;
            left: 0;
            align-items: center;
            justify-content: center;
            z-index: 99;
            background-color: #121520;
            .back {
                width: 0.4rem;
                height: 0.4rem;
                position: absolute;
                left: 0.3rem;
                bottom: 0.24rem;
            }
            .header-content {
                position: absolute;
                bottom: 0.24rem;
                height: 0.4rem;
                line-height: 0.4rem;
                left: 50%;
                transform: translate(-50%, -0%);
            }
            .right {
                position: absolute;
                right: 0.3rem;
                bottom: 0;
                color: #fff;
                font-size: 0.26rem;
            }
        }
        /deep/.van-tabs__content {
            display: none;
            height: 0px;
            width: 0px;
        }
        .dress-type /deep/.van-tab {
            width: auto;
            margin-right: 0;
            padding: 0 12px;
        }
        .dress-type /deep/.van-tabs__nav {
            background-color: transparent;
            padding: 0 0.1rem;
        }
        .dress-type /deep/.van-tabs__line {
            position: absolute;
            background-image: none;
            left: 0;
            bottom: 0;
            width: 0.4rem;
            height: 0.1rem;
            background-image: url("http://imgcom.static.suishenyun.net/tab_bottom_bg-c41885.png");
            background-size: contain;
            background-repeat: no-repeat;
        }
        .dress-type {
            height: 0.7rem;
            align-items: center;
            display: flex;
            flex-wrap: nowrap;
            //overflow-x: scroll;
        }
        .dress-tab-item {
            color: @color-no-selected-text;
            font-size: 0.3rem;
            position: relative;
            &.active {
                color: #fff;
                font-size: 0.38rem;
            }
        }
        .get-type /deep/.van-tab {
            width: auto;
            margin-right: 0;
            padding: 0 1px;
        }
        .get-type /deep/.van-tabs__nav {
            background-color: transparent;
            padding: 0 0.1rem;
            width: 6.7rem;
            overflow-x: scroll;
            display: block;
            justify-content: flex-start !important;
        }
        .get-type /deep/.van-tabs__nav--line {
            display: block;
            justify-content: flex-start !important;
            overflow-x: scroll;
            white-space: nowrap
        }
        .get-type /deep/.van-tabs__line {
            position: absolute;
            background-image: none !important;
            background-color: transparent !important;
        }
        .get-type /deep/ .van-tab {
            display: inline-block;
        }
        .get-type {
            width: 7.2rem;
            margin-left: 0.3rem;
            height: 0.8rem;
            margin-top: 0.2rem;
            align-items: stretch;
            display: flex;
            flex-wrap: nowrap;
            //overflow-x: scroll;
        }
        .get-tab-item {
            color: @color-no-selected-text;
            font-size: 0.3rem;
            position: relative;
            // width: 1.28rem;
            padding: 0 0.2rem;
            height: 0.54rem;
            background: #1a2134;
            border-radius: 0.27rem;
            font-size: 0.24rem;
            text-align: center;
            line-height: 0.54rem;
            margin-right: 0.2rem;
            flex: none;
            &.active {
                color: #fff;
                background-color: #2b3248;
            }
        }
        .dress-container {
            height: calc(100vh - 3.6rem);
            overflow-y: scroll;
            padding-left: 0.1rem;
            scroll-behavior: smooth;
            .dress-content-name {
                font-size: 0.3rem;
                color: #fff;
                padding-left: 0.3rem;
                margin-bottom: 0.2rem;
                margin-top: 0.4rem;
                img {
                    width: 0.34rem;
                    height: auto;
                    vertical-align: middle;
                }
            }
            .dress-item {
                position: relative;
                display: inline-block;
                width: 3.34rem;
                height: 3.64rem;
                border-radius: 0.27rem;
                margin-left: 0.2rem;
                margin-bottom: 0.22rem;
                position: relative;
                &.dress-item-bg {
                    background-image: url("http://imgcom.static.suishenyun.net/zbzx_img_bj_mid@2x-94c807.png");
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .dress-item-bg {
                    z-index: 1;
                    position: absolute;
                    left: 0;
                    top: 0;

                    width: 3.34rem;
                    height: 3.64rem;
                    background: linear-gradient(180deg, #1a2f58 0%, #233940 100%);
                    border-radius: 0.27rem;
                    opacity: 0.4;
                }
                .number {
                    position: absolute;
                    display: flex;
                    top: .2rem;
                    right: .2rem;
                    height: .32rem;
                    padding: 0 .2rem;
                    justify-content: center;
                    align-items: center;
                    background: #FFFFFF;
                    border-radius: .06rem;
                    opacity: 0.8;
                    color: #333;
                }
                .dress-item-type {
                    position: absolute;
                    height: 0.38rem;
                    border-radius: 0.2rem;
                    text-align: center;
                    line-height: 0.38rem;
                    padding: 0 0.1rem;
                    top: 0.1rem;
                    right: 0.1rem;
                    background-color: #2c3549;
                    z-index: 3;
                    p {
                        font-size: 0.24rem;
                        // color: rgba(255, 255, 255, 0.1);
                        // transform: scale(0.9166666);
                        color: #6b717f;
                    }
                }
                .dress-item-img {
                    z-index: 2;
                    position: absolute;
                    top: 0.4rem;
                    left: 0.57rem;
                    width: 2.2rem;
                    height: 2.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        max-width: 2.2rem;
                        max-height: 2.2rem;
                    }
                }
                .dress-item-name {
                    z-index: 2;
                    position: absolute;
                    bottom: 0.3rem;
                    width: 100%;
                    text-align: center;
                    font-size: 0.3rem;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #e8e9ea;
                }
            }
        }
        .empty {
            font-size: 0.32rem;
            color: rgba(255, 255, 255, 0.5);
            font-weight: bold;
            text-align: center;
            padding-top: 2.6rem;
            padding-bottom: 1.6rem;
            img {
                width: 2.4rem;
                height: auto;
                margin-bottom: 0.2rem;
            }
        }
        .details {
            width: 7.5rem;
            height: auto;
            overflow: hidden;
            background: linear-gradient(180deg, #00223a 0%, #051b22 100%);
            // background: #000;
            border-radius: 0.24rem 0.24rem 0px 0px;
            opacity: 0.95;
            .details-img {
                width: 7.5rem;
                height: 3.14rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                &.details-img-bg {
                    background-image: url("http://imgcom.static.suishenyun.net/zbzx_img_bj_tc@2x-54fbc5.png");
                    background-size: 7.5rem auto;
                    background-repeat: no-repeat;
                }
                .dress-detail-img {
                    // height: 100%;
                    max-width: 2.5rem;
                    max-height: 3rem;
                    // height: auto;
                }
                .avatar-dress-box {
                    width: 2.46rem;
                    height: 2.46rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    .user-avatar {
                        width: 1.7rem;
                        height: 1.7rem;
                        border-radius: 50%;
                        display: block;
                        overflow: hidden;
                        position: absolute;
                        z-index: 1;
                        left: 0.38rem;
                        top: 0.38rem;
                    }
                    .avatar-dress-img {
                        width: 2.46rem;
                        height: 2.46rem;
                        position: absolute;
                        z-index: 2;
                    }
                    #address-canvas {
                        width: 2.46rem;
                        height: 2.46rem;
                        position: relative;
                        z-index: 2;
                    }
                }
                .tail-light-box {
                    height: 1.2rem;
                    width: 3rem;
                    .tail-light-user {
                        font-size: 0.34rem;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #a3aeb6;
                        vertical-align: middle;
                        img {
                            width: 0.46rem;
                            height: 0.46rem;
                            border-radius: 50%;
                        }
                    }
                    .tail-light-img {
                        width: 2.92rem;
                        height: 0.7rem;
                        background: #021929;
                        border-radius: 0.16rem;
                        line-height: 0.7rem;
                        vertical-align: middle;
                        font-size: 0.3rem;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #e6e8ea;
                        margin-top: 0.1rem;
                        padding-left: 0.22rem;
                        canvas {
                            width: 0.9rem;
                            display: inline-block;
                            position: relative;
                            top: 0.12rem;
                        }
                        img {
                            vertical-align: middle;
                            width: 0.9rem;
                            height: auto;
                        }
                    }
                }
                .preview-img {
                    position: absolute;
                    top: 0.3rem;
                    right: 0.3rem;
                    // width: 1.36rem;
                    height: 0.42rem;
                }
            }
            .details-info {
                margin-top: 0.06rem;
                margin-bottom: 0.5rem;
                .details-name {
                    width: 7.5rem;
                    font-size: 0.32rem;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #ffffff;
                    text-align: center;
                }
                .details-content {
                    width: 7.5rem;
                    margin-top: 0.16rem;
                    height: auto;
                    text-align: center;
                    padding: 0 1rem;
                    font-size: 0.24rem;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #99a5ab;
                    overflow: hidden;

                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                    -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                    -webkit-line-clamp: 2; /* 文本需要显示多少行 */
                }
            }
            .buy-dress {
                height: 2.8rem;
                width: 7.5rem;
                padding-left: 0.5rem;
                margin-bottom: 0.5rem;
                .price-list {
                    width: 7rem;
                    height: 1.6rem;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.5rem;
                    overflow-x: scroll;
                    .price-item {
                        width: 1.98rem;
                        height: 1.6rem;
                        text-align: center;
                        background: #283e49;
                        border-radius: 0.14rem;
                        margin-left: 0.12rem;
                        margin-right: 0.12rem;
                        flex-shrink: 0;
                        .price-item-day {
                            font-size: 0.3rem;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                            color: #17d2de;
                            margin-top: 0.41rem;
                        }
                        .price-item-diamond {
                            font-size: 0.26rem;
                            margin-top: 0.12rem;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #ffffff;
                            text-align: center;
                        }
                        &.active {
                            box-sizing: border-box;
                            border: 0.04rem solid #17d2de;
                        }
                    }
                }
                .user-diamond {
                    width: 6.5rem;
                    text-align: center;
                    font-size: 0.24rem;
                    color: #fff;
                    vertical-align: middle;
                    img {
                        width: 0.28rem;
                        height: auto;
                        margin-top: 0.02rem;
                    }
                    .to-charge {
                        color: #73b6b9;
                        vertical-align: middle;
                        font-weight: bold;
                        display: inline-block;
                        margin-bottom: 0.04rem;
                        img {
                            width: 0.24rem;
                            margin-top: 0.06rem;
                        }
                    }
                }
            }
            .get-info {
                width: 7.5rem;
                font-size: 0.26rem;
                text-align: center;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #67767e;
                margin-bottom: 0.7rem;
                .unlock-desc {
                    margin: 0.1rem auto;
                    width: 7.5rem;
                    line-height: 0.36rem;
                    font-size: 0.24rem;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #68767b;
                }
            }
            .buy-button {
                padding-left: 0.5rem;
                margin-bottom: 0.5rem;
                .disabled {
                    background: #1a313a;
                    box-shadow: none;
                }
                .orange {
                    background: linear-gradient(90deg, #c78d5d 0%, #fdbd99 100%);
                    box-shadow: none;
                }
            }
        }
        #canvas {
            width: 7.5rem;
            height: 100%;
            object-fit: contain;
        }
        .preview-box {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>

